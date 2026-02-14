/**
 * App configuration — dev/prod toggle via environment variables.
 *
 * In your .env file:
 *   VITE_PRODUCTION=false        → uses localhost URLs
 *   VITE_PRODUCTION=true         → uses production URLs
 *
 * You can also override individual URLs:
 *   VITE_API_URL=https://your-backend.vercel.app
 *   VITE_AVA_SERVER_URL=https://ava.useaxis.app
 */

const isProduction = import.meta.env.VITE_PRODUCTION === 'true';

export const config = {
  isProduction,

  // Main backend (waitlist API — Vercel serverless)
  apiUrl: import.meta.env.VITE_API_URL
    || (isProduction ? 'https://clinicflow-app.vercel.app' : 'http://localhost:8000'),

  // Ava voice/SMS server (DigitalOcean droplet)
  avaServerUrl: import.meta.env.VITE_AVA_SERVER_URL
    || (isProduction ? 'https://ava.useaxis.app' : 'http://localhost:8002'),
};
