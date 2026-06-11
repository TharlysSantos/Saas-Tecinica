const router = require('express').Router();
const config = require('../config');

/**
 * GET /health
 * Usado pelo CI/CD e monitoramento para verificar se o servidor está no ar.
 */
router.get('/', (req, res) => {
  res.json({
    status: 'ok',
    env: config.nodeEnv,
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
