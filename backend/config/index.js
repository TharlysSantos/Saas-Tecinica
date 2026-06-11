require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3050,
  nodeEnv: process.env.NODE_ENV || 'development',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3051',

  vindi: {
    apiKey: process.env.VINDI_API_KEY || '',
    baseUrl: process.env.VINDI_BASE_URL || 'https://sandbox-app.vindi.com.br/api/v1',
  },

  base44: {
    appId: process.env.BASE44_APP_ID || '',
    appBaseUrl: process.env.BASE44_APP_BASE_URL || '',
  },

  jwtSecret: process.env.JWT_SECRET || 'dev-secret-change-in-prod',
};
