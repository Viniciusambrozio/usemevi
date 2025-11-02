-- Adiciona coluna email à tabela clients
-- Execute este SQL no Supabase Dashboard > SQL Editor

ALTER TABLE clients 
ADD COLUMN IF NOT EXISTS email text;

-- Criar índice para busca rápida por email
CREATE INDEX IF NOT EXISTS idx_clients_email ON clients (email);

-- Verificar se foi criado:
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'clients';
