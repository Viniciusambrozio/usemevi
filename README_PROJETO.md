# 🛍️ Usemevi - E-commerce Completo

Sistema completo de e-commerce desenvolvido com Next.js 15, TypeScript, Tailwind CSS e Supabase.

## 🎨 Funcionalidades Principais

### 👥 **Sistema de Autenticação**
- ✅ Modal de boas-vindas automático
- ✅ Cadastro de clientes com nome, email, telefone e senha
- ✅ Login/Logout
- ✅ Página de perfil personalizada
- ✅ Sessão persistente no localStorage
- ✅ Tag automática "Cadastro Automático"

### 🛒 **Carrinho de Compras**
- ✅ Seleção de produtos com tamanhos específicos
- ✅ Preview de imagens dos produtos
- ✅ Validação de estoque por tamanho
- ✅ Controle de quantidade com limites
- ✅ Cálculo automático de subtotais e total
- ✅ Botão flutuante (FAB) rosa com contador
- ✅ Toast notifications modernas
- ✅ Finalização via WhatsApp personalizada

### 📦 **Gestão de Produtos**
- ✅ CRUD completo de produtos
- ✅ Upload de múltiplas imagens
- ✅ Gestão de estoque por tamanho
- ✅ Categorização de produtos
- ✅ Produtos em destaque
- ✅ Badges de "NEW", "ÚLTIMAS X", "DESTAQUE"
- ✅ Avaliações e curtidas com animações
- ✅ Modal de confirmação de exclusão

### 💰 **Sistema de Vendas**
- ✅ Registro de vendas com produtos e tamanhos
- ✅ Desconto automático de estoque ao marcar como "Pago"
- ✅ Edição de vendas com reversão de estoque
- ✅ Exclusão de vendas com reversão de estoque
- ✅ Status: Pendente, Pago, Entregue
- ✅ Associação com clientes

### 📊 **Controle de Estoque**
- ✅ Visualização por produto e tamanho
- ✅ Indicadores visuais (baixo, esgotado, OK)
- ✅ Filtros por status
- ✅ Modal detalhado com gráficos de barras
- ✅ Atualização automática ao realizar vendas

### ❤️ **Favoritos**
- ✅ Sistema de favoritos com localStorage
- ✅ Contador em tempo real no header
- ✅ Ícone preenchido quando ativo
- ✅ Página dedicada de favoritos
- ✅ Animações ao favoritar

### 💬 **Integração WhatsApp**
- ✅ Mensagens personalizadas como cliente
- ✅ Links diretos para produtos
- ✅ Formatação rica e profissional
- ✅ Inclusão do nome do cliente
- ✅ Valor total e detalhamento
- ✅ Configurável no painel admin

### 🎨 **UI/UX Premium**
- ✅ Design moderno e clean
- ✅ Cores vibrantes (#fc0055 rosa, #ffe472 amarelo)
- ✅ Animações suaves e micro-interações
- ✅ Headers padronizados e compactos
- ✅ Modais com backdrop blur
- ✅ Badges interativos com animações
- ✅ Toast notifications elegantes
- ✅ FAB com efeitos de pulso
- ✅ Responsivo mobile-first

## 🚀 Tecnologias

- **Framework**: Next.js 15 (App Router)
- **Linguagem**: TypeScript
- **Estilização**: Tailwind CSS
- **Banco de Dados**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage
- **Autenticação**: Sistema customizado
- **Estado Global**: Zustand
- **Animações**: Framer Motion
- **Ícones**: Lucide React

## 📋 Setup do Projeto

### 1. Instale as dependências
```bash
npm install
```

### 2. Configure o Supabase
Execute os scripts SQL na ordem:
1. `sql/01-create-tables.sql`
2. `sql/02-create-admin-user.sql`
3. `sql/03-create-bucket.sql`
4. `sql/04-storage-policies.sql`
5. `sql/05-add-email-to-clients.sql`
6. `sql/06-insert-sample-products.sql`
7. `sql/07-add-rating-likes.sql`
8. `sql/08-add-password-to-clients.sql`

### 3. Configure variáveis de ambiente
Crie `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=sua-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-key
NEXT_PUBLIC_WHATSAPP_NUMBER=5511999999999
```

### 4. Execute o projeto
```bash
npm run dev
```

## 📱 Páginas

### **Cliente:**
- `/` - Home com catálogo
- `/product/[id]` - Página do produto
- `/cart` - Carrinho de compras
- `/favorites` - Produtos favoritos
- `/profile` - Perfil do usuário

### **Admin:**
- `/admin/dashboard` - Dashboard
- `/admin/products` - Gestão de produtos
- `/admin/stock` - Controle de estoque
- `/admin/sales` - Vendas
- `/admin/clients` - Clientes
- `/admin/config` - Configurações
- `/admin/users` - Usuários admin

## 🎯 Destaques

- 🎨 **UI/UX Premium** com animações suaves
- 🛒 **Carrinho inteligente** com validação de estoque
- 📱 **WhatsApp Integration** com mensagens personalizadas
- 👤 **Sistema de usuários** completo
- 📊 **Dashboard** com estatísticas
- 🔐 **Autenticação** simples e eficaz
- ✨ **Micro-interações** em todo o app
- 💎 **Design moderno** e profissional

## 📝 Documentação

- `SETUP_SUPABASE.md` - Configuração do Supabase
- `SETUP_AUTH.md` - Configuração de autenticação admin
- `SETUP_USER_AUTH.md` - Sistema de autenticação de clientes
- `WHATSAPP_PEDIDOS.md` - Sistema de pedidos via WhatsApp
- `ADICIONAR_RATING_LIKES.md` - Como adicionar avaliações e curtidas

## 🌟 Autor

Desenvolvido para **Usemevi by Lato**

---

**Deploy URL**: https://usemevi.vercel.app
**Repositório**: https://github.com/ofertasgringasteste/usemevi

