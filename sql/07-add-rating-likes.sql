-- Adiciona colunas de avaliação e curtidas na tabela products

ALTER TABLE products 
ADD COLUMN IF NOT EXISTS rating DECIMAL(2,1) DEFAULT 0.0 CHECK (rating >= 0 AND rating <= 5);

ALTER TABLE products 
ADD COLUMN IF NOT EXISTS likes INTEGER DEFAULT 0 CHECK (likes >= 0);

-- Adiciona comentários nas colunas
COMMENT ON COLUMN products.rating IS 'Avaliação do produto (0.0 a 5.0)';
COMMENT ON COLUMN products.likes IS 'Número de curtidas do produto';

