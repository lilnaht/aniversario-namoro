# Romantic Blog (1 ano de namoro)

Site romantico estilo blog feito com Next.js (App Router), Tailwind e Supabase. Inclui home com carrossel, frases, contador de tempo, Spotify (QR + embed), linha do tempo, cartas e painel admin com CRUD e upload com crop.

## Requisitos

- Node.js 20.19+ (LTS)
- Conta no Supabase

## Setup local

1) Instale deps:

```bash
npm install
```

2) Crie `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
ADMIN_PASSWORD=uma-senha-forte
MAX_UPLOAD_MB=10
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Opcional para rodar sem Supabase (mock local):

```bash
MOCK_DATA=true
```

3) Rode o projeto:

```bash
npm run dev
```

Abra `http://localhost:3000`.

## Supabase

1) Crie um projeto no Supabase.
2) Abra o SQL Editor e execute o script em `supabase/schema.sql`.
3) Confirme que o bucket `romantic` foi criado como publico e com as policies aplicadas.

Os arquivos de imagem ficam em:

- `carousel/`
- `timeline/`
- `letters/`

## Admin

- Acesse `/admin`
- Login via `ADMIN_PASSWORD`
- CRUD para carrossel, frases, timeline, cartas e motivos
- Upload com crop e validacao de tipo/tamanho

## Testes

Instale navegadores do Playwright (uma vez):

```bash
npm run test -- --help
npx playwright install
```

Rodar unit/integration:

```bash
npm run test
```

Rodar E2E:

```bash
npm run test:e2e
```

Rodar tudo:

```bash
npm run test:all
```

## Deploy na Vercel

1) Suba o repo para o GitHub.
2) Importe no Vercel.
3) Configure as env vars:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_PASSWORD`
- `MAX_UPLOAD_MB` (opcional)
- `NEXT_PUBLIC_SITE_URL` (URL de producao)

4) Deploy.

## Observacoes

- Admin usa cookie HttpOnly com assinatura para sessao.
- Server actions exigem sessao valida.
- Em mock mode, os uploads vao para `public/uploads/`.
