/**
 * Middleware de autenticação.
 * Valida o token enviado pelo frontend (Bearer token da sessão Base44)
 * e disponibiliza req.user para as rotas.
 *
 * Por enquanto faz validação básica — expanda conforme a estratégia de auth escolhida.
 */
module.exports = function auth(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token não informado' });
  }

  const token = authHeader.split(' ')[1];

  // TODO: validar JWT ou fazer lookup via Base44 SDK
  // Por enquanto repassa o token para uso nos services
  req.token = token;
  req.user = null; // preenchido pelo service quando necessário

  next();
};
