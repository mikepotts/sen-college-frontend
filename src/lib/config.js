// API_BASE must be explicitly set via VITE_API_BASE environment variable
// Dev environment uses http://localhost:8001
if (!import.meta.env.VITE_API_BASE) {
  throw new Error(
    'VITE_API_BASE environment variable is required. ' +
    'Set it in .env file, e.g., VITE_API_BASE=http://localhost:8001'
  );
}

export const API_BASE = import.meta.env.VITE_API_BASE;
