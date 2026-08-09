# Rachas — PWA (site instalável)

Versão web instalável do app de divisão de contas de férias. Corre num browser normal, mas os teus amigos conseguem "instalá-la" no ecrã principal do telemóvel (Android e iPhone), sem passar por nenhuma loja de apps.

## Testar no teu computador

```bash
npm install
npm run dev
```

Abre o link que aparece no terminal (normalmente `http://localhost:5173`) no browser.

## Publicar online (para os teus amigos acederem)

Uma PWA só é "instalável" a partir de um site publicado com **https** — não funciona só localmente no teu computador para os teus amigos acederem de fora de casa.

A forma mais simples e gratuita é o **Vercel**:

1. Cria conta em vercel.com (podes usar a conta do GitHub)
2. Instala a ferramenta: `npm install -g vercel`
3. Dentro da pasta do projeto, corre: `vercel`
4. Segue as perguntas no terminal (aceita as opções por defeito)
5. No fim, recebes um link tipo `https://rachas-app.vercel.app`

Esse é o link que partilhas com os teus amigos.

## Como os teus amigos "instalam" a app

**Android (Chrome):** abrem o link → aparece um aviso "Adicionar Rachas ao ecrã principal" (ou nos 3 pontinhos do menu → "Instalar app").

**iPhone (Safari — tem de ser Safari, não funciona no Chrome do iPhone):** abrem o link → carregam no ícone de partilha (quadrado com seta) → "Adicionar ao Ecrã Principal".

Depois disso, fica um ícone como qualquer app normal.

## Estrutura

```
src/
  App.jsx                  — rotas da aplicação
  data/AppDataContext.jsx  — estado partilhado (viagens, feed) e ações
  data/mockData.js         — dados de exemplo (trocar por Firebase mais tarde)
  utils/balances.js        — cálculo de saldos a partir do feed
  screens/                 — Login, Lista de viagens, Grupo, modal de despesa
  components/               — Avatar, TripCard, FeedRow, BalancePill
  theme/colors.js
public/icons/              — ícones da app (gerados para 192px, 512px, maskable, apple-touch-icon)
```

## O que já funciona (dados mock, em memória — perdem-se ao recarregar a página)

- Login (Google/Apple) — simula sessão iniciada
- Lista de viagens + criar viagem
- Chat/Feed e Resumo dentro de cada grupo
- Adicionar, editar e apagar despesas
- Cálculo de saldos e "marcar como pago"
- Funciona offline depois da primeira visita (service worker gerado automaticamente)

## O que falta antes de ser uma app real

1. **Backend real** (ex: Firebase) — para os dados não se perderem e serem partilhados entre os telemóveis de todos os membros do grupo
2. **Separar o feed por viagem** — atualmente é global, partilhado por todas as viagens (mesma limitação que já existia no protótipo)
3. **Convite por link** para entrar num grupo
4. **Notificações** — em PWA, para iPhone são bastante limitadas; Android tem melhor suporte
