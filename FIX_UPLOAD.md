# 🔧 Correção de Upload de Imagens

O erro "new row violates row-level security policy" ocorre porque as políticas RLS (Row Level Security) do Supabase Storage estão bloqueando o upload.

## ✅ Solução

### 1️⃣ Execute o SQL no Supabase

1. Acesse seu projeto no **Supabase Dashboard**
2. Vá em **SQL Editor**
3. Execute o arquivo: `sql/04-storage-policies.sql`

Ou copie e cole este SQL:

```sql
-- Política para INSERT (upload) - apenas usuários autenticados
CREATE POLICY "Authenticated users can upload images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'product-images' AND
  auth.role() = 'authenticated'
);

-- Política para SELECT (download/leitura) - público
CREATE POLICY "Public can read images"
ON storage.objects
FOR SELECT
TO public
USING (
  bucket_id = 'product-images'
);
```

### 2️⃣ Verificar Bucket

Certifique-se de que o bucket `product-images` existe e está configurado:

1. Vá em **Storage** > **Buckets**
2. Verifique se existe `product-images`
3. Se não existir, crie-o como **público** (public bucket)

### 3️⃣ Verificar Autenticação

O upload agora usa o token JWT do cookie de autenticação. Certifique-se de:

1. Estar logado como admin
2. O cookie `sb-access-token` está sendo enviado

## 🔍 Se ainda não funcionar

### Opção A: Desabilitar RLS temporariamente (NÃO RECOMENDADO para produção)

```sql
ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;
```

### Opção B: Política mais permissiva (para desenvolvimento)

```sql
-- Remove políticas antigas se existirem
DROP POLICY IF EXISTS "Authenticated users can upload images" ON storage.objects;
DROP POLICY IF EXISTS "Public can read images" ON storage.objects;

-- Cria política permissiva para desenvolvimento
CREATE POLICY "Allow all for product-images"
ON storage.objects
FOR ALL
TO public
USING (bucket_id = 'product-images')
WITH CHECK (bucket_id = 'product-images');
```

**⚠️ ATENÇÃO**: Use apenas em desenvolvimento. Para produção, use as políticas restritivas.

## ✅ Após aplicar

1. Recarregue a página do admin
2. Tente fazer upload novamente
3. O upload deve funcionar se você estiver autenticado
