const router = require('express').Router();
const auth = require('../middleware/auth');
const vindi = require('../services/vindiService');

/**
 * Rotas de integração Vindi.
 * Todas protegidas por auth middleware.
 * O frontend chama /api/vindi/* em vez de bater direto na API Vindi.
 */

// GET /api/vindi/produtos
router.get('/produtos', auth, async (req, res) => {
  const produtos = await vindi.listarProdutos();
  res.json({ produtos });
});

// GET /api/vindi/clientes?cpf_cnpj=...
router.get('/clientes', auth, async (req, res) => {
  const { cpf_cnpj, id } = req.query;
  if (id) {
    const cliente = await vindi.buscarClientePorId(id);
    return res.json({ cliente });
  }
  if (!cpf_cnpj) return res.status(400).json({ error: 'Informe cpf_cnpj ou id' });
  const cliente = await vindi.buscarCliente(cpf_cnpj);
  res.json({ cliente });
});

// GET /api/vindi/clientes/:id/assinaturas
router.get('/clientes/:id/assinaturas', auth, async (req, res) => {
  const assinaturas = await vindi.buscarAssinaturas(req.params.id);
  res.json({ assinaturas });
});

// GET /api/vindi/clientes/:id/faturas
router.get('/clientes/:id/faturas', auth, async (req, res) => {
  const faturas = await vindi.buscarFaturas(req.params.id);
  res.json({ faturas });
});

// GET /api/vindi/clientes/:id/pagamentos
router.get('/clientes/:id/pagamentos', auth, async (req, res) => {
  const metodos = await vindi.buscarMetodosPagamento(req.params.id);
  res.json({ metodos });
});

// GET /api/vindi/assinaturas/:id
router.get('/assinaturas/:id', auth, async (req, res) => {
  const assinatura = await vindi.buscarAssinaturaPorId(req.params.id);
  res.json({ assinatura });
});

// DELETE /api/vindi/assinaturas/:id  — cancelamento
router.delete('/assinaturas/:id', auth, async (req, res) => {
  const resultado = await vindi.cancelarAssinatura(req.params.id, req.body);
  res.json({ resultado });
});

module.exports = router;
