# 🔐 Setup de Autenticação com Supabase Auth (JWT)

O sistema agora usa **Supabase Authentication** com JWT tokens. Não é mais necessário usar a tabela `users`.

## 📋 Passo a Passo

### 1️⃣ Habilitar Authentication no Supabase

1. Acesse seu projeto no Supabase Dashboard
2. Vá em **Authentication** > **Providers**
3. Ative **Email** provider (já vem ativado por padrão)

### 2️⃣ Criar Usuário Admin via Dashboard

1. Vá em **Authentication** > **Users**
2. Clique em **Add user** > **Create new user**
3. Preencha:
   - **Email**: `admin@mevi.com`
   - **Password**: crie uma senha segura
   - **Auto Confirm User**: ✅ (marcar para não precisar confirmar email)
4. Clique em **Create user**

### 3️⃣ Adicionar Role "admin" ao Usuário

1. Com o usuário criado, clique nos **três pontos** ao lado do usuário
2. Selecione **Edit user**
3. Vá na aba **Metadata**
4. Adicione em **Raw user metadata** (JSON):
```json
{
  "role": "admin",
  "name": "Administrador"
}
```
5. Clique em **Save**

### 4️⃣ (Alternativa) Criar via SQL

Se preferir criar via SQL, execute:

```sql
-- Criar usuário via função (você precisará do email e senha)
-- Nota: A senha será hash automático pelo Supabase

-- Depois de criar o usuário manualmente, atualize os metadados:
UPDATE auth.users 
SET raw_user_meta_data = jsonb_build_object('role', 'admin', 'name', 'Administrador')
WHERE email = 'admin@mevi.com';
```

## ✅ Teste

1. Acesse http://localhost:3000/login
2. Faça login com:
   - Email: `admin@mevi.com`
   - Senha: a senha que você criou
3. Você deve ser redirecionado para `/admin/dashboard`

## 🔑 Como Funciona

- **Login**: Usa `supabase.auth.signInWithPassword()` que retorna JWT tokens
- **Cookies**: Os tokens JWT são salvos em cookies `sb-access-token` e `sb-refresh-token`
- **Middleware**: Verifica o JWT em cada requisição para `/admin/*`
- **AdminGuard**: Componente client-side que também verifica autenticação

## 🔒 Segurança

- Tokens JWT são armazenados em cookies `httpOnly` (não acessíveis via JavaScript)
- Tokens são verificados a cada requisição
- Apenas usuários com `role: "admin"` podem acessar o admin

## 📝 Notas

- Não precisa mais da tabela `users` no banco de dados
- O Supabase Auth gerencia tudo: hash de senhas, refresh tokens, etc.
- Você pode gerenciar usuários diretamente no Dashboard do Supabase
