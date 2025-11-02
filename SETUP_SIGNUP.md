# 🔐 Configuração de Cadastro de Usuários

Para que o cadastro de usuários funcione nas configurações, você precisa adicionar a **Service Role Key** do Supabase.

## ⚙️ Configuração Necessária

### 1. Obter Service Role Key

1. Acesse seu projeto no **Supabase Dashboard**
2. Vá em **Settings** (⚙️) > **API**
3. Em **Project API keys**, copie a **`service_role`** key (não a `anon` key!)
   - ⚠️ **IMPORTANTE**: Esta key é sensível e não deve ser exposta no frontend!

### 2. Adicionar ao `.env.local`

Adicione a seguinte variável ao seu arquivo `.env.local`:

```env
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key_aqui
```

⚠️ **ATENÇÃO**: 
- NUNCA commite esta key no Git
- Ela já deve estar no `.gitignore`
- Mantenha esta key secreta

### 3. Reiniciar o Servidor

Após adicionar a variável, reinicie o servidor Next.js:

```bash
# Pare o servidor (Ctrl+C) e inicie novamente
npm run dev
```

## ✅ Como Funciona

Quando você cadastrar um usuário nas **Configurações**:

1. O formulário envia os dados para `/api/auth/signup`
2. A API usa a Service Role Key para criar o usuário no Supabase Auth
3. O usuário é criado com:
   - Email confirmado automaticamente
   - Role definido (admin ou vendedor)
   - Metadata com o nome

## 🔒 Segurança

- A Service Role Key só funciona no servidor (API routes)
- Ela permite operações administrativas no Supabase
- Nunca exponha esta key no frontend ou em código público

## 🧪 Testar

Após configurar:

1. Vá em **Admin > Configurações**
2. Clique em "Criar Novo Usuário"
3. Preencha os dados:
   - Nome
   - Email
   - Senha (mínimo 6 caracteres)
   - Nível de acesso (Vendedor ou Admin)
4. Clique em "Criar Usuário"
5. O usuário será criado e poderá fazer login imediatamente
