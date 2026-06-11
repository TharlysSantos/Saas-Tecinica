'use strict';

require('express-async-errors');
const express = require('express');
const helmet  = require('helmet');
const morgan  = require('morgan');

const corsMiddleware  = require('./middleware/cors');
const errorHandler   = require('./middleware/errorHandler');
const config         = require('./config');

// Rotas
const healthRoutes   = require('./routes/health');
const vindiRoutes    = require('./routes/vindi');
const requestRoutes  = require('./routes/requests');
const webhookRoutes  = require('./routes/webhook');

const app = express();

// ── Segurança ──────────────────────────────────────────────────────────────
app.use(helmet());
app.use(corsMiddleware);

// ── Parsing ────────────────────────────────────────────────────────────────
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));

// ── Logging ────────────────────────────────────────────────────────────────
if (config.nodeEnv !== 'test') {
  app.use(morgan(config.nodeEnv === 'production' ? 'combined' : 'dev'));
}

// ── Rotas ──────────────────────────────────────────────────────────────────
app.use('/health',        healthRoutes);
app.use('/api/vindi',     vindiRoutes);
app.use('/api/requests',  requestRoutes);
app.use('/api/webhook',   webhookRoutes);

// 404 para rotas não mapeadas
app.use((req, res) => {
  res.status(404).json({ error: `Rota não encontrada: ${req.method} ${req.path}` });
});

// ── Tratamento de erros ────────────────────────────────────────────────────
app.use(errorHandler);

// ── Inicialização ──────────────────────────────────────────────────────────
const server = app.listen(config.port, () => {
  console.log(`✓ Portal CRM Backend rodando na porta ${config.port} [${config.nodeEnv}]`);
  console.log(`  → Health: http://localhost:${config.port}/health`);
  console.log(`  → API:    http://localhost:${config.port}/api`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM recebido — encerrando servidor...');
  server.close(() => process.exit(0));
});

module.exports = app;
