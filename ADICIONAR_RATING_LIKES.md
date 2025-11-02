# Como adicionar Rating e Likes aos Produtos

## 📋 Instruções

Para adicionar as funcionalidades de **Avaliação** e **Curtidas** aos produtos, você precisa executar o script SQL no Supabase.

### Passos:

1. **Acesse o Supabase Dashboard**
   - Vá para https://supabase.com
   - Faça login
   - Selecione seu projeto

2. **Abra o SQL Editor**
   - No menu lateral, clique em "SQL Editor"
   - Clique em "New query"

3. **Execute o Script**
   - Copie todo o conteúdo do arquivo `sql/07-add-rating-likes.sql`
   - Cole no editor SQL
   - Clique em "Run" para executar

4. **Verifique as Colunas**
   - Vá em "Table Editor"
   - Selecione a tabela `products`
   - Verifique se as colunas `rating` e `likes` foram adicionadas

## ✨ Funcionalidades Implementadas

### No Painel Admin (`/admin/products`):
- ✅ Campos para definir **Avaliação** (0-5 estrelas com decimais)
- ✅ Campo para definir **Número de Curtidas**
- ✅ Validação automática dos valores

### Na Loja (página principal):
- ✅ **Badges amarelos** com ícones rosa exibindo avaliação e curtidas
- ✅ **Animação ao clicar** nos badges:
  - Estrela: rotação e escala
  - Curtida: incrementa +1 com feedback visual
- ✅ **Feedback tátil** (vibração) em dispositivos compatíveis
- ✅ **Efeitos visuais**:
  - Hover: leve aumento de escala
  - Click: animação de "pulse" e partículas

## 🎨 Design

Os badges seguem o design do projeto:
- Fundo: Amarelo (`#ffe472`)
- Ícones: Rosa (`#fc0055`)
- Bordas arredondadas
- Sombras suaves

## 🔄 Como Usar

1. **Criar/Editar Produto**:
   - Vá em `/admin/products`
   - Ao criar ou editar um produto, preencha os campos:
     - **Avaliação**: Digite um valor entre 0 e 5 (ex: 4.5)
     - **Curtidas**: Digite um número inteiro (ex: 150)

2. **Visualizar na Loja**:
   - Os badges aparecem automaticamente nos cards de produtos
   - Clique nos badges para ver as animações!

## 📱 Experiência do Usuário

- **Ao clicar na estrela**: Animação de rotação e destaque
- **Ao clicar na curtida**: 
  - Incrementa +1 localmente
  - Animação de "ping" 
  - Efeito de +1 flutuante
  - Vibração tátil (se disponível)

---

**Nota**: As interações são apenas visuais (não salvam no banco). Se quiser persistir as curtidas, será necessário adicionar uma API endpoint.

