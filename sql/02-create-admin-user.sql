-- PASSO 2: Execute este arquivo DEPOIS de criar as tabelas
-- Substitua 'sua-senha-aqui' pela senha desejada

INSERT INTO users (name, email, password, role) 
VALUES ('Admin', 'admin@mevi.com', 'admin123', 'admin');

-- Verifique se foi criado:
-- SELECT * FROM users;
