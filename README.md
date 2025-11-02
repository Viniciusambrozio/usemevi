# Mevi Catálogo

Sistema mobile-first para catálogo de moda feminina com checkout via WhatsApp e painel administrativo completo.

## Stack
- Next.js 15 (App Router)
- TypeScript
- TailwindCSS
- Framer Motion
- Supabase (Auth, DB, Storage)
- Zustand (estado global)

## Setup

1. Instale dependências:
```bash
npm install
```

2. Configure `.env.local` (já criado com suas credenciais):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_WHATSAPP_NUMBER` (opcional)
   - `NEXT_PUBLIC_INSTAGRAM_URL` (opcional)

3. Execute o schema no SQL Editor do Supabase:
   - Abra `sql/schema.sql`
   - Execute todo o conteúdo no SQL Editor do Supabase
   - Crie o bucket `product-images` no Storage (público para leitura)

4. Crie um usuário admin inicial (SQL):
```sql
INSERT INTO users (name, email, password, role) 
VALUES ('Admin', 'admin@mevi.com', 'sua-senha', 'admin');
```

## Scripts
- `npm run dev` — desenvolvimento (http://localhost:3000)
- `npm run build` — build de produção
- `npm start` — servidor de produção

## Funcionalidades

### Catálogo Público
- ✅ Home com grid de produtos estilo Pinterest
- ✅ Modal de produto com fotos, variações e estoque
- ✅ Favoritos (localStorage)
- ✅ Carrinho com checkout via WhatsApp
- ✅ Contato
- ✅ Navbar inferior fixa com animações

### Painel Admin
- ✅ Login/Auth com cookies
- ✅ Dashboard com KPIs (produtos, vendas, clientes, receita)
- ✅ CRUD de Produtos
- ✅ CRUD de Clientes (mini-CRM com tags)
- ✅ CRUD de Vendas
- ✅ Configurações (WhatsApp, logo, cores)
- ✅ CRUD de Usuários com RBAC (admin/vendedor)

### UX
- ✅ Animações com Framer Motion
- ✅ Haptic feedback (vibração ao favoritar/adicionar)
- ✅ Seção "Combina com" (produtos relacionados)
- ✅ Aviso de escassez de estoque
- ✅ Indicador ativo na navbar

## Estrutura

```
src/
├── app/              # Páginas (App Router)
│   ├── page.tsx      # Home (catálogo)
│   ├── cart/         # Carrinho
│   ├── favorites/    # Favoritos
│   ├── contact/      # Contato
│   ├── login/        # Login admin
│   └── admin/        # Painel admin
├── components/       # Componentes React
│   ├── product-card.tsx
│   ├── product-modal.tsx
│   ├── navbar-bottom.tsx
│   └── admin-guard.tsx
├── hooks/            # Hooks customizados
│   └── useCart.ts    # Zustand store
└── lib/              # Utilitários
    ├── supabaseClient.ts
    └── utils.ts
```

## Próximos Passos (Opcional)

- Upload real de imagens para Supabase Storage
- Gráfico de vendas no Dashboard
- Tracking de cliques no WhatsApp
- Sistema de favoritos persistente no Supabase
- Email notifications
