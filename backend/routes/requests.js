const router = require('express').Router();
const auth = require('../middleware/auth');

/**
 * Rotas de solicitações de retenção.
 *
 * NOTA: por enquanto o frontend lê/escreve diretamente via Base44 SDK.
 * Este arquivo serve como ponto de extensão para lógica de negócio adicional
 * que não cabe no frontend (ex: notificações, validações complexas, integrações).
 *
 * Endpoints aqui são COMPLEMENTARES ao SDK — ex: ações que disparam
 * múltiplos efeitos colaterais (email + atualização de status + log).
 */

// POST /api/requests/:id/cancelar
// Cancela uma solicitação e dispara todos os efeitos colaterais
router.post('/:id/cancelar', auth, async (req, res) => {
  const { id } = req.params;
  const { motivo, observacao } = req.body;

  // TODO: integrar com Base44 SDK server-side + Vindi + envio de email
  // Por ora retorna estrutura esperada
  res.json({
    success: true,
    message: `Solicitação ${id} cancelada`,
    data: { id, motivo, observacao, status: 'cancelado' },
  });
});

// POST /api/requests/:id/aprovar
router.post('/:id/aprovar', auth, async (req, res) => {
  const { id } = req.params;

  // TODO: lógica de aprovação + notificação
  res.json({
    success: true,
    message: `Solicitação ${id} aprovada`,
    data: { id, status: 'aprovado' },
  });
});

// POST /api/requests/:id/notificar
// Envia email/comunicação para o cliente
router.post('/:id/notificar', auth, async (req, res) => {
  const { id } = req.params;
  const { tipo, canal, conteudo } = req.body;

  // TODO: integrar com serviço de email/SMS
  res.json({
    success: true,
    message: `Notificação enviada para solicitação ${id}`,
    data: { id, tipo, canal },
  });
});

module.exports = router;
