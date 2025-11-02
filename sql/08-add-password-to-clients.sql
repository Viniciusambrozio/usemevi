-- Adiciona coluna de senha na tabela clients para autenticação

ALTER TABLE clients 
ADD COLUMN IF NOT EXISTS password TEXT;

COMMENT ON COLUMN clients.password IS 'Senha do cliente (em produção deve ser hasheada)';

-- Atualiza email para ser único
ALTER TABLE clients 
ADD CONSTRAINT clients_email_unique UNIQUE (email);

