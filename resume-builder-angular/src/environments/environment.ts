// Dynamic environment configuration
const isProduction = window.location.hostname !== 'localhost';

export const environment = {
  production: isProduction,
  apiUrl: isProduction
    ? 'https://resume-generator-with-ai-full-system-production-2a76.up.railway.app/api'
    : 'http://localhost:5050/api',
  clientUrl: isProduction
    ? 'https://resume-generator-with-ai-full-syste.vercel.app'
    : 'http://localhost:4201',
  geminiApiKey: 'AIzaSyB4LMblYJFpHsq-oH5Do0KJenXkVL0UMqI',
};
