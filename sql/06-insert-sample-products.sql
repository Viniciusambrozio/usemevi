-- Inserir produtos de exemplo para o catálogo
-- Execute este arquivo no SQL Editor do Supabase

INSERT INTO products (name, price, category, stock, featured, images, description, created_at)
VALUES
  (
    'Vestido Floral Elegante',
    189.90,
    'vestidos',
    15,
    true,
    '["https://images.unsplash.com/photo-1745695894760-600be9c8c307?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMGZhc2hpb24lMjBkcmVzc3xlbnwxfHx8fDE3NjE4Mzc1NjF8MA&ixlib=rb-4.1.0&q=80&w=1080"]'::jsonb,
    'Vestido feminino com estampa floral, ideal para ocasiões especiais',
    now() - interval '1 day'
  ),
  (
    'Blusa Estampada Premium',
    119.90,
    'blusas',
    20,
    true,
    '["https://images.unsplash.com/photo-1761117228880-df2425bd70da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMGJsb3VzZSUyMGVsZWdhbnR8ZW58MXx8fHwxNzYxOTM0OTg3fDA&ixlib=rb-4.1.0&q=80&w=1080"]'::jsonb,
    'Blusa com estampa moderna e corte elegante',
    now() - interval '2 days'
  ),
  (
    'Calça Jeans Casual',
    159.90,
    'calcas',
    12,
    false,
    '["https://images.unsplash.com/photo-1656007363175-e0d9dcfc666a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMGplYW5zJTIwY2FzdWFsfGVufDF8fHx8MTc2MTg1NjUzMnww&ixlib=rb-4.1.0&q=80&w=1080"]'::jsonb,
    'Calça jeans com corte moderno e confortável',
    now() - interval '3 days'
  ),
  (
    'Saia Midi Moderna',
    139.90,
    'saias',
    8,
    false,
    '["https://images.unsplash.com/photo-1637227314917-3c0f595c3596?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHNraXJ0JTIwZmFzaGlvbnxlbnwxfHx8fDE3NjE5MzQ5ODd8MA&ixlib=rb-4.1.0&q=80&w=1080"]'::jsonb,
    'Saia midi com tecido leve e fluido',
    now() - interval '4 days'
  ),
  (
    'Jaqueta de Couro Style',
    299.90,
    'jaquetas',
    5,
    true,
    '["https://images.unsplash.com/photo-1653513770755-0b481c54c297?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMGphY2tldCUyMHN0eWxlfGVufDF8fHx8MTc2MTgxOTA1OXww&ixlib=rb-4.1.0&q=80&w=1080"]'::jsonb,
    'Jaqueta de couro sintético com design moderno',
    now() - interval '1 day'
  ),
  (
    'Bolsa Estruturada Chic',
    249.90,
    'acessorios',
    10,
    false,
    '["https://images.unsplash.com/photo-1605542654507-4647bef3e957?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHhmYXNoaW9uJTIwYWNjZXNzb3JpZXMlMjBiYWd8ZW58MXx8fHwxNzYxODkyNTg1fDA&ixlib=rb-4.1.0&q=80&w=1080"]'::jsonb,
    'Bolsa estruturada perfeita para o dia a dia',
    now() - interval '5 days'
  ),
  (
    'Conjunto Verão Leve',
    169.90,
    'conjuntos',
    7,
    false,
    '["https://images.unsplash.com/photo-1586024452802-86e0d084a4f9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHN1bW1lciUyMGNsb3RoZXN8ZW58MXx8fHwxNzYxOTM0OTg4fDA&ixlib=rb-4.1.0&q=80&w=1080"]'::jsonb,
    'Conjunto leve e fresco para o verão',
    now() - interval '6 days'
  ),
  (
    'Suéter Inverno Cozy',
    179.90,
    'blusas',
    18,
    false,
    '["https://images.unsplash.com/photo-1612018887944-1b8e4e88278b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHN3ZWF0ZXIlMjB3aW50ZXJ8ZW58MXx8fHwxNzYxOTM0OTg4fDA&ixlib=rb-4.1.0&q=80&w=1080"]'::jsonb,
    'Suéter quentinho e confortável para o inverno',
    now() - interval '7 days'
  ),
  (
    'Sapato Salto Alto Clássico',
    229.90,
    'calcados',
    14,
    false,
    '["https://images.unsplash.com/photo-1605733513549-de9b150bd70d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHNob2VzJTIwaGVlbHN8ZW58MXx8fHwxNzYxOTAwNjA1fDA&ixlib=rb-4.1.0&q=80&w=1080"]'::jsonb,
    'Salto alto elegante e confortável',
    now() - interval '3 days'
  ),
  (
    'Óculos de Sol Fashion',
    199.90,
    'acessorios',
    22,
    false,
    '["https://images.unsplash.com/photo-1732139637217-56c77369e25c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHN1bmdsYXNzZXMlMjBmYXNoaW9ufGVufDF8fHx8MTc2MTkzNTM5NHww&ixlib=rb-4.1.0&q=80&w=1080"]'::jsonb,
    'Óculos de sol com proteção UV e estilo',
    now() - interval '4 days'
  ),
  (
    'Colar Delicado Dourado',
    89.90,
    'acessorios',
    25,
    false,
    '["https://images.unsplash.com/photo-1683099869102-bcf8791eb0e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMGpld2VscnklMjBuZWNrbGFjZXxlbnwxfHx8fDE3NjE5MzUzNzN8MA&ixlib=rb-4.1.0&q=80&w=1080"]'::jsonb,
    'Colar dourado delicado e elegante',
    now() - interval '5 days'
  ),
  (
    'Blusa Casual Branca',
    99.90,
    'blusas',
    16,
    false,
    '["https://images.unsplash.com/photo-1761117228880-df2425bd70da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMGJsb3VzZSUyMGVsZWdhbnR8ZW58MXx8fHwxNzYxOTM0OTg3fDA&ixlib=rb-4.1.0&q=80&w=1080"]'::jsonb,
    'Blusa básica branca para compor looks',
    now() - interval '6 days'
  )
ON CONFLICT DO NOTHING;


