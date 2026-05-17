import { useEffect, useRef, useCallback } from 'react';
import api from '../utils/api';

/**
 * useAutoCompile
 * Debounces code changes and auto-executes after `delay` ms of inactivity.
 * Only runs when `enabled` is true.
 */
export function useAutoCompile({ code, language, enabled, delay = 2000, onResult, onCompiling }) {
  const timerRef = useRef(null);

  const compile = useCallback(async (sourceCode, lang) => {
    if (!sourceCode.trim()) return;
    try {
      onCompiling?.(true);
      const res = await api.post('/execute', { code: sourceCode, language: lang });
      onResult?.(res.data);
    } catch (err) {
      onResult?.({
        output: err.response?.data?.error || 'Execution service unavailable',
        isError: true,
        status: 'Error',
      });
    } finally {
      onCompiling?.(false);
    }
  }, [onResult, onCompiling]);

  useEffect(() => {
    if (!enabled) return;

    // Clear previous timer on every keystroke
    if (timerRef.current) clearTimeout(timerRef.current);

    // Set new timer — fires only after `delay` ms of no changes
    timerRef.current = setTimeout(() => {
      compile(code, language);
    }, delay);

    return () => clearTimeout(timerRef.current);
  }, [code, language, enabled, delay, compile]);
}
