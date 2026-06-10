# Portal CRM — Documentação de Contexto

> **Este arquivo é a fonte de verdade do projeto.**  
> Qualquer IA ou desenvolvedor que entrar no repositório deve ler este arquivo primeiro.  
> Se trocar de máquina, de agente ou de ambiente: `git clone` → leia este arquivo → siga o jogo.

---

## 1. O que é este projeto

**Portal CRM** é uma aplicação web SaaS para gestão de relacionamento com clientes — focada em **retenção de assinantes** e gerenciamento de cancelamentos. Permite que times de atendimento acompanhem solicitações, executem workflows de retenção, visualizem métricas e se comuniquem com clientes.

O sistema usa **Base44** como backend (banco de dados, autenticação, serverless functions), com frontend em React.

---

## 2. Stack técnica

| Camada | Tecnologia |
|---|---|
| Frontend | React 18 + Vite 6 |
| Estilo | Tailwind CSS 3 + shadcn/ui (Radix UI) |
| Roteamento | React Router v6 |
| Estado/Cache | TanStack React Query v5 |
| Formulários | React Hook Form + Zod |
| Gráficos | Recharts |
| Animações | Framer Motion |
| Ícones | Lucide React |
| Backend/BaaS | Base44 SDK (`@base44/sdk`) |
| PDF | jsPDF + html2canvas |
| Drag & Drop | @hello-pangea/dnd |
| Pagamentos | Stripe (react-stripe-js) |

---

## 3. Estrutura de pastas

```
/
├── src/
│   ├── pages/              # Páginas da aplicação (auto-registradas via pages.config.js)
│   │   ├── Dashboard.jsx   # Página principal com KPIs e métricas
│   │   ├── Requests.jsx    # Listagem e gestão de solicitações
│   │   ├── Actions.jsx     # Workflow board
│   │   ├── Relatorios.jsx  # Relatórios e analytics
│   │   ├── Profile.jsx     # Perfil do usuário
│   │   ├── Settings.jsx    # Configurações do sistema
│   │   └── ExAssinante.jsx # Gestão de ex-assinantes
│   ├── components/
│   │   ├── dashboard/      # Blocos do dashboard (KPIs, gráficos, tabelas)
│   │   ├── retention/      # Modal e formulários do fluxo de retenção
│   │   ├── settings/       # Componentes de configuração
│   │   └── ui/             # shadcn/ui (NÃO editar manualmente)
│   ├── api/
│   │   └── base44Client.js # Instância única do SDK Base44
│   ├── lib/
│   │   ├── AuthContext.jsx  # Context de autenticação
│   │   ├── utils.js         # Helpers (cn, etc.)
│   │   └── query-client.js  # Configuração do React Query
│   ├── hooks/              # Custom hooks
│   ├── utils/index.ts      # Utilitários gerais
│   ├── App.jsx             # Root com router e providers
│   ├── Layout.jsx          # Layout principal (sidebar + header)
│   ├── pages.config.js     # Registro de páginas (AUTO-GERADO — ver regra abaixo)
│   ├── index.css           # Variáveis CSS do tema (customizável)
│   └── main.jsx            # Entry point
├── base44/
│   ├── entities/           # Definições das entidades do banco
│   ├── functions/          # Serverless functions
│   ├── config.jsonc        # Config do projeto Base44
│   └── .app.jsonc          # ID do app Base44
├── .github/
│   └── workflows/
│       └── ci-cd.yml       # Pipeline CI/CD (ver Seção 7)
├── CLAUDE.md               # Este arquivo
└── README.md               # Visão geral pública
```

### ⚠️ Regras importantes de arquivos

- **`pages.config.js`** é auto-gerado pelo Base44. A única coisa editável é `mainPage`. Não adicionar imports manualmente.
- **`src/components/ui/`** são componentes shadcn/ui. Não editar — se precisar customizar, criar um wrapper.
- **`base44/entities/`** define o schema do banco. Alterações aqui impactam o backend.

---

## 4. Entidades Base44 (banco de dados)

| Entidade | Finalidade |
|---|---|
| `RetentionRequest` | Solicitação de cancelamento/retenção de um assinante |
| `CancellationReason` | Motivos de cancelamento cadastrados |
| `PlanConfig` | Configurações de planos de assinatura |
| `StepConfig` | Etapas configuráveis do workflow de retenção |
| `PlanoAuxiliar` | Planos auxiliares ofertados na retenção |
| `Comunicacao` | Registros de comunicação com clientes |
| `MigrationLog` | Log de migrações de dados |

Campos comuns em `RetentionRequest`:
- `status_processo`: `em_triagem` | `em_atendimento` | `retido` | `processo_finalizado`
- `tipo_retencao`: `negociado` | `sem_alteracao` | `null`
- `request_type`: tipo da solicitação

---

## 5. Variáveis de ambiente

### `.env.local` (desenvolvimento local)

```env
VITE_BASE44_APP_ID=69aae81f416f0a7fc846ab74
VITE_BASE44_APP_BASE_URL=https://[seu-app].base44.app
```

### GitHub Secrets (Settings → Secrets → Actions)

| Secret | Obrigatório | Descrição |
|---|---|---|
| `PROD_PAT` | ✅ Sim | PAT do GitHub com `contents: write` no repo `Saas-Tecnica_Prod`. Permite que o CI/CD faça deploy no repo de produção. |
| `ANTHROPIC_API_KEY` | ✅ Sim | Chave da API da Anthropic (Claude). Usada para analisar erros de build automaticamente. Gerar em: console.anthropic.com |
| `HOMOLOG_API_URL` | ⏳ Quando pronto | URL do endpoint de homologação. Deve receber POST e retornar HTTP 200 se aprovado. |
| `HOMOLOG_API_TOKEN` | ⏳ Quando pronto | Token Bearer para autenticar no endpoint de homologação. |

---

## 6. Como rodar localmente

```bash
git clone https://github.com/TharlysSantos/Saas-Tecnica.git
cd Saas-Tecnica
npm install
cp .env.example .env.local   # editar com os valores corretos
npm run dev
```

Comandos disponíveis:

| Comando | O que faz |
|---|---|
| `npm run dev` | Inicia servidor de desenvolvimento |
| `npm run build` | Gera build de produção em `dist/` |
| `npm run lint` | Verifica erros de código (ESLint) |
| `npm run lint:fix` | Corrige erros de lint automaticamente |
| `npm run preview` | Serve o build de produção localmente |

---

## 7. Pipeline CI/CD

Todo push para `main` aciona o workflow `.github/workflows/ci-cd.yml`:

```
Push → main
  │
  ├─ Job: build
  │   ├─ npm ci
  │   ├─ npm run lint
  │   └─ npm run build  ──── salva dist/ como artifact
  │         │ (se falhar)
  │         └─► Job: analyze-error
  │                └─ Claude API analisa o log e posta no GitHub Summary
  │
  ├─ Job: homologacao  (após build OK)
  │   └─ POST para HOMOLOG_API_URL
  │       ├─ HTTP 200 → aprovado
  │       └─ outro código → pipeline para, não faz deploy
  │
  └─ Job: deploy  (após homologação OK)
      └─ push do dist/ → Saas-Tecnica_Prod (force push, branch main)
```

### Payload enviado para a API de homologação

```json
{
  "repo":   "TharlysSantos/Saas-Tecnica",
  "commit": "<sha>",
  "branch": "main",
  "actor":  "<usuario-que-commitou>",
  "run_id": "<id-do-run>"
}
```

A API deve retornar `HTTP 200` para aprovar. Qualquer outro status bloqueia o deploy.

### Análise automática de erros

Quando o build ou lint falha, o job `analyze-error` chama a **Claude API** com o log completo do erro. Claude classifica o problema em três categorias e explica em linguagem acessível:

- **INTERNO** — erro no código (lint, importação, lógica)
- **EXTERNO** — serviço de terceiro indisponível ou com problema
- **CONFIGURAÇÃO** — secret faltando, variável de ambiente errada, config incorreta

O resultado aparece no **GitHub Actions Summary** do run com causa provável e ação recomendada.

---

## 8. Temas e customização visual

As variáveis do tema ficam em `src/index.css` (seção `:root`). Alterar lá reflete em todo o app:

```css
:root {
  --primary: ...;
  --accent: ...;
  --sidebar-background: ...;
  /* etc. */
}
```

Use o **Preview Interativo** (artifact do Cowork) para testar cores e labels antes de alterar os arquivos — o painel "Código" gera o diff exato para colar no `index.css`.

---

## 9. Padrões de código

- **Componentes**: functional components com hooks. Nenhum class component.
- **Estilo**: apenas Tailwind classes + variáveis CSS do tema. Sem CSS inline (exceto valores dinâmicos calculados em JS).
- **Data fetching**: sempre `useQuery` / `useMutation` do TanStack React Query. Nunca `useEffect` + `fetch`.
- **Formulários**: React Hook Form + Zod para validação.
- **Ícones**: sempre de `lucide-react`.
- **Notificações toast**: `sonner` (`import { toast } from 'sonner'`).
- **Novos componentes UI**: verificar se já existe em `src/components/ui/` antes de criar.

---

## 10. Contexto para assistentes de IA

Se você é um agente de IA trabalhando neste repositório, siga estas diretrizes:

1. **Nunca edite `pages.config.js` manualmente** a não ser para mudar `mainPage`.
2. **Sempre use o Base44 SDK** para operações de dados — nunca fetch direto para o backend.
3. **Mantenha a estrutura de pastas** — componentes específicos de feature ficam em subpastas de `components/`.
4. **Ao adicionar uma nova página**: criar o arquivo em `src/pages/`, adicionar o import e a entrada em `PAGES` no `pages.config.js`, e adicionar o item de navegação em `Layout.jsx` (`NAV_BY_ENV.retencao`).
5. **Ao alterar o tema**: propor alterações em `src/index.css` (variáveis CSS) e em `Layout.jsx` (se for estrutural).
6. **Commits**: sempre mensagem em inglês no formato `tipo: descrição` (feat, fix, ci, docs, style, refactor).
7. **Este arquivo (`CLAUDE.md`) deve ser atualizado** quando há mudanças estruturais (novas entidades, novos secrets, mudanças no pipeline).

---

*Última atualização: gerado automaticamente pelo agente Claude (Cowork)*
