const cors = require('cors');
const config = require('../config');

const allowedOrigins = [
  config.frontendUrl,
  'http://localhost:3051',
  'http://127.0.0.1:3051',
];

module.exports = cors({
  origin: (origin, callback) => {
    // Permite requests sem origin (ex: Postman, curl)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS bloqueado para origin: ${origin}`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key'],
});
