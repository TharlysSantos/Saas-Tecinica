const axios = require('axios');
const config = require('../config');

/**
 * Cliente Vindi — encapsula autenticação e chamadas à API.
 * Documentação: https://atendimento.vindi.com.br/hc/pt-br/articles/204163150
 */
const vindiClient = axios.create({
  baseURL: config.vindi.baseUrl,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  auth: {
    username: config.vindi.apiKey,
    password: '',
  },
});

// --- Clientes ---
async function buscarCliente(cpf_cnpj) {
  const { data } = await vindiClient.get('/customers', { params: { query: `registry_code:${cpf_cnpj}` } });
  return data.customers?.[0] || null;
}

async function buscarClientePorId(id) {
  const { data } = await vindiClient.get(`/customers/${id}`);
  return data.customer;
}

// --- Assinaturas ---
async function buscarAssinaturas(customerId) {
  const { data } = await vindiClient.get('/subscriptions', { params: { query: `customer_id:${customerId}` } });
  return data.subscriptions || [];
}

async function buscarAssinaturaPorId(id) {
  const { data } = await vindiClient.get(`/subscriptions/${id}`);
  return data.subscription;
}

async function cancelarAssinatura(id, payload = {}) {
  const { data } = await vindiClient.delete(`/subscriptions/${id}`, { data: payload });
  return data;
}

// --- Faturas ---
async function buscarFaturas(customerId) {
  const { data } = await vindiClient.get('/bills', { params: { query: `customer_id:${customerId}`, per_page: 50 } });
  return data.bills || [];
}

// --- Produtos ---
async function listarProdutos() {
  const { data } = await vindiClient.get('/products', { params: { per_page: 100 } });
  return data.products || [];
}

// --- Pagamentos ---
async function buscarMetodosPagamento(customerId) {
  const { data } = await vindiClient.get('/payment_profiles', { params: { query: `customer_id:${customerId}` } });
  return data.payment_profiles || [];
}

module.exports = {
  buscarCliente,
  buscarClientePorId,
  buscarAssinaturas,
  buscarAssinaturaPorId,
  cancelarAssinatura,
  buscarFaturas,
  listarProdutos,
  buscarMetodosPagamento,
};
