const router = require('express').Router();
const axios = require('axios');

// Wandbox API — 100% free, no API key, no signup required
// Docs: https://wandbox.org/
const WANDBOX_URL = 'https://wandbox.org/api/compile.json';

// Map our language names → Wandbox compiler names
// Verified against https://wandbox.org/api/list.json
const WANDBOX_COMPILERS = {
  javascript: { compiler: 'nodejs-20.17.0' },
  typescript: { compiler: 'typescript-5.6.2' },
  python:     { compiler: 'cpython-3.13.8' },
  java:       { compiler: 'openjdk-jdk-22+36' },
  cpp:        { compiler: 'gcc-head',     options: '-std=c++17 -Wall' },
  c:          { compiler: 'gcc-head-c',   options: '-std=c17 -Wall' },
  go:         { compiler: 'go-1.23.2' },
  rust:       { compiler: 'rust-1.82.0' },
  ruby:       { compiler: 'ruby-4.0.2' },
};

// Helper: call Wandbox with up to `maxRetries` attempts on transient errors
const callWandbox = async (payload, maxRetries = 2) => {
  let lastErr;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await axios.post(WANDBOX_URL, payload, {
        timeout: 20000,
        headers: { 'Content-Type': 'application/json' },
      });
      return response;
    } catch (err) {
      lastErr = err;
      const isTransient =
        err.response?.status === 500 ||   // Wandbox OCI / capacity error
        err.response?.status === 503 ||   // Service unavailable
        err.code === 'ECONNRESET' ||
        err.code === 'ECONNABORTED';

      // Don't retry on timeout or non-transient errors
      if (!isTransient || attempt === maxRetries) throw err;

      // Wait 1s before retrying
      await new Promise(r => setTimeout(r, 1000));
    }
  }
  throw lastErr;
};

// POST /api/execute
router.post('/', async (req, res) => {
  try {
    const { code, language, stdin = '' } = req.body;

    if (!code?.trim()) {
      return res.status(400).json({ error: 'No code provided', isError: true });
    }

    const lang = WANDBOX_COMPILERS[language];
    if (!lang) {
      return res.status(400).json({
        error: `Unsupported language: ${language}`,
        isError: true,
      });
    }

    const payload = {
      code,
      compiler: lang.compiler,
      stdin,
      ...(lang.options && { 'compiler-option-raw': lang.options }),
      save: false,
    };

    const response = await callWandbox(payload);

    const {
      status,
      program_output,
      program_error,
      compiler_error,
    } = response.data;

    // Build readable output
    let output = '';
    if (compiler_error)  output += `Compile Error:\n${compiler_error}\n`;
    if (program_output)  output += program_output;
    if (program_error)   output += program_error;
    if (!output.trim())  output  = 'Program exited with no output.';

    const isError = !!compiler_error || (status !== '0' && status !== 0);

    res.json({
      output,
      isError,
      status: compiler_error
        ? 'Compile Error'
        : isError
          ? `Runtime Error (exit ${status})`
          : 'Accepted',
    });

  } catch (err) {
    if (err.code === 'ECONNABORTED' || err.code === 'ETIMEDOUT') {
      return res.status(504).json({
        error: 'Execution timed out (20s limit)',
        isError: true,
        status: 'Timeout',
      });
    }

    // Wandbox OCI / capacity error — friendly message
    const isOciError = err.response?.data && JSON.stringify(err.response.data).includes('OCI');
    if (isOciError || err.response?.status === 500) {
      return res.status(503).json({
        error: 'Execution service is temporarily busy. Please try again in a moment.',
        isError: true,
        status: 'Service Busy',
      });
    }

    res.status(500).json({
      error: `Execution failed: ${err.message}`,
      isError: true,
      status: 'Service Error',
    });
  }
});

module.exports = router;
