-- Políticas RLS para o bucket product-images
-- Execute este SQL no Supabase Dashboard > SQL Editor

-- 1. Habilitar RLS no storage.objects (se ainda não estiver)
-- ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 2. Política para INSERT (upload) - apenas usuários autenticados
CREATE POLICY "Authenticated users can upload images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'product-images' AND
  auth.role() = 'authenticated'
);

-- 3. Política para SELECT (download/leitura) - público
CREATE POLICY "Public can read images"
ON storage.objects
FOR SELECT
TO public
USING (
  bucket_id = 'product-images'
);

-- 4. Política para UPDATE - apenas usuários autenticados (para atualizar/sobrescrever)
CREATE POLICY "Authenticated users can update images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'product-images' AND
  auth.role() = 'authenticated'
)
WITH CHECK (
  bucket_id = 'product-images' AND
  auth.role() = 'authenticated'
);

-- 5. Política para DELETE - apenas usuários autenticados
CREATE POLICY "Authenticated users can delete images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'product-images' AND
  auth.role() = 'authenticated'
);

-- Verificar se as políticas foram criadas:
-- SELECT * FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage';
