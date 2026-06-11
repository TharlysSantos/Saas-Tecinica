const router = require('express').Router();

/**
 * Webhooks recebidos de serviços externos.
 * NÃO usa auth middleware — validação é feita por assinatura/secret do serviço.
 */

// POST /api/webhook/vindi — eventos da Vindi (pagamento, cancelamento, etc.)
router.post('/vindi', (req, res) => {
  const event = req.body;
  console.log('[Webhook Vindi]', JSON.stringify(event, null, 2));

  // TODO: processar evento e atualizar entidades correspondentes
  // ex: event.type === 'bill.paid' → atualizar RetentionRequest

  res.status(200).json({ received: true });
});

// POST /api/webhook/ci — recebe notificação do CI/CD quando build é aprovado
router.post('/ci', (req, res) => {
  const { event, repo, commit, branch, actor, message } = req.body;
  console.log('[Webhook CI]', { event, repo, commit, branch, actor, message });

  // TODO: processar evento CI (ex: disparar deploy, enviar notificação no Slack)

  res.status(200).json({ received: true });
});

module.exports = router;
