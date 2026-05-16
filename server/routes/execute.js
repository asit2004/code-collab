const router = require('express').Router();
const axios = require('axios');

// Language ID map for Judge0
const LANGUAGE_IDS = {
  javascript: 63,
  python:     71,
  java:       62,
  cpp:        54,
  c:          50,
  typescript: 74,
  go:         60,
  rust:       73,
  ruby:       72,
};

// POST /api/execute
router.post('/', async (req, res) => {
  try {
    const { code, language } = req.body;
    const languageId = LANGUAGE_IDS[language] || 63;

    const JUDGE0_URL = process.env.JUDGE0_URL || 'https://judge0-ce.p.rapidapi.com';
    const headers = {
      'Content-Type': 'application/json',
      'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
      'X-RapidAPI-Key': process.env.RAPIDAPI_KEY || '',
    };

    // Submit
    const submitRes = await axios.post(
      `${JUDGE0_URL}/submissions?base64_encoded=false&wait=true`,
      { source_code: code, language_id: languageId, stdin: '' },
      { headers }
    );

    const { stdout, stderr, compile_output, status } = submitRes.data;
    res.json({
      output: stdout || compile_output || stderr || 'No output',
      status: status?.description || 'Unknown',
      isError: !stdout && (!!stderr || !!compile_output),
    });
  } catch (err) {
    res.status(500).json({ error: 'Execution service unavailable', details: err.message });
  }
});

module.exports = router;
