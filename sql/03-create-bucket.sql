-- PASSO 3 (Opcional): Crie o bucket de imagens no Storage
-- Execute no SQL Editor do Supabase

-- Criar bucket público para imagens de produtos
-- Método 1: Via SQL (sintaxe correta)
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- OU Método 2: Via Dashboard (mais fácil)
-- 1. Vá em Storage no menu lateral
-- 2. Clique em "New bucket"
-- 3. Nome: product-images
-- 4. Marque "Public bucket"
-- 5. Clique em "Create bucket"

-- Depois, configure as políticas:
-- Vá em Storage > product-images > Policies
-- Crie uma política para permitir leitura pública:
-- Policy name: Public read
-- Allowed operation: SELECT
-- Target roles: anon, authenticated
-- USING expression: true
