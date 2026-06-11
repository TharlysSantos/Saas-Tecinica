const config = require('../config');

module.exports = function errorHandler(err, req, res, next) {
  const status = err.status || err.statusCode || 500;
  const isProd = config.nodeEnv === 'production';

  console.error(`[${new Date().toISOString()}] ${req.method} ${req.path} → ${status}:`, err.message);

  res.status(status).json({
    error: err.message || 'Erro interno do servidor',
    ...(isProd ? {} : { stack: err.stack }),
  });
};
