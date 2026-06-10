# Portal CRM — Retenção de Assinantes

Sistema web para gestão de cancelamentos e retenção de clientes. Permite que times de atendimento acompanhem solicitações, executem workflows de retenção e visualizem métricas em tempo real.

## Início rápido

```bash
git clone https://github.com/TharlysSantos/Saas-Tecnica.git
cd Saas-Tecnica
npm install
# Criar .env.local com VITE_BASE44_APP_ID e VITE_BASE44_APP_BASE_URL
npm run dev
```

## Stack

React 18 · Vite · Tailwind CSS · shadcn/ui · TanStack Query · Base44

## Pipeline

Todo push para `main` aciona build → lint → homologação → deploy automático para produção.

## Documentação completa

Consulte [`CLAUDE.md`](./CLAUDE.md) para arquitetura, secrets, pipeline e padrões de código.
