# 🚀 Setup do Supabase - Passo a Passo

## ⚠️ IMPORTANTE: Execute nesta ordem!

### 1️⃣ Criar as Tabelas

1. Acesse seu projeto no Supabase Dashboard
2. Vá em **SQL Editor** (ícone de banco de dados no menu lateral)
3. Clique em **New Query**
4. Copie e cole todo o conteúdo do arquivo: `sql/01-create-tables.sql`
5. Clique em **RUN** (ou pressione Cmd/Ctrl + Enter)
6. Deve aparecer: "Success. No rows returned"

### 2️⃣ Criar Usuário Admin

1. Ainda no **SQL Editor**, crie uma nova query
2. Copie e cole o conteúdo de: `sql/02-create-admin-user.sql`
3. **IMPORTANTE**: Substitua `'admin123'` pela senha que você deseja
4. Clique em **RUN**
5. Verifique se funcionou executando:
   ```sql
   SELECT * FROM users;
   ```

### 3️⃣ (Opcional) Criar Bucket de Imagens

1. No SQL Editor, execute: `sql/03-create-bucket.sql`
2. Ou vá em **Storage** no menu lateral
3. Clique em **Create Bucket**
4. Nome: `product-images`
5. Marque como **Public bucket**
6. Clique em **Create**

## ✅ Verificação

Execute estas queries para verificar se tudo está certo:

```sql
-- Verificar tabelas criadas
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';

-- Verificar usuário admin
SELECT * FROM users;

-- Verificar configurações
SELECT * FROM config;
```

## 🔑 Credenciais Padrão

Após executar o passo 2, você pode fazer login com:
- **Email**: `admin@mevi.com`
- **Senha**: `admin123` (ou a que você definiu)

## 📝 Notas

- Se aparecer erro de "relation does not exist", significa que você pulou o passo 1
- Se aparecer erro de "duplicate key", significa que o usuário já existe
- Para resetar tudo, você pode dropar as tabelas (cuidado!):
  ```sql
  DROP TABLE IF EXISTS sales, products, clients, users, config CASCADE;
  ```
