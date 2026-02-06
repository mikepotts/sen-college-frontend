// API_BASE should be explicitly set via VITE_API_BASE environment variable
// Dev environment uses http://localhost:8001
const apiBase = import.meta.env.VITE_API_BASE;

if (!apiBase) {
  console.warn(
    '⚠️ VITE_API_BASE environment variable is not set. ' +
    'Defaulting to http://localhost:8001. ' +
    'Set VITE_API_BASE in .env file for production builds.'
  );
}

export const API_BASE = apiBase || 'http://localhost:8001';
