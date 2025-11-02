# Sistema de Pedidos via WhatsApp

## 📱 Como Funciona

Ao clicar em **"Finalizar Pedido"** no carrinho, o cliente é redirecionado para o WhatsApp com uma mensagem formatada e interativa.

## 📋 Configuração

### 1. Configure o Número do WhatsApp

1. Acesse `/admin/config`
2. No campo **"Número do WhatsApp"**, digite o número no formato:
   - Exemplo: `5511999999999`
   - Formato: `[código país][DDD][número]`
   - **Apenas números**, sem espaços, parênteses ou hífens

3. Clique em **"Salvar Configurações"**
4. Clique em **"Testar WhatsApp"** para verificar

## 💬 Formato da Mensagem

A mensagem enviada é automaticamente formatada e inclui:

```
🛍️ *NOVO PEDIDO - USEMEVI*

👤 *Cliente:* João Silva

📦 *PRODUTOS:*
━━━━━━━━━━━━━━━━━━━

*2x Blusa Florida - M*
   💰 R$ 100,00 cada
   📊 Subtotal: R$ 200,00
   🔗 https://usemevi.vercel.app/product/[id-do-produto]

*1x Vestido Longo - G*
   💰 R$ 150,00 cada
   📊 Subtotal: R$ 150,00
   🔗 https://usemevi.vercel.app/product/[id-do-produto]

━━━━━━━━━━━━━━━━━━━

💵 *TOTAL DO PEDIDO: R$ 350,00*

✨ _Obrigado por escolher a Usemevi!_
```

## ✨ Recursos da Mensagem

### **Informações Incluídas:**
- 🎯 **Nome do cliente** (se estiver logado)
- 📦 **Produtos** com quantidade, nome e tamanho
- 💰 **Preço unitário** de cada produto
- 📊 **Subtotal** por item
- 🔗 **Link direto** para cada produto em `usemevi.vercel.app`
- 💵 **Total do pedido**
- ✨ Mensagem de agradecimento

### **Formatação:**
- Usa **negrito** (*texto*) para destaques
- Usa **itálico** (_texto_) para mensagem final
- **Emojis** para melhor visualização
- **Separadores** visuais
- **Links clicáveis** para os produtos

### **Informações Técnicas:**
- Links automáticos: `https://usemevi.vercel.app/product/{product-id}`
- IDs extraídos automaticamente (remove sufixo de tamanho)
- Formatação de moeda em BRL
- URL encoded para compatibilidade

## 🔗 Links dos Produtos

Cada produto na mensagem inclui um link direto:
- **Formato**: `https://usemevi.vercel.app/product/[UUID]`
- **Clicável** no WhatsApp
- Leva direto para a página do produto
- Facilita visualização e confirmação do pedido

## 🎨 Personalização

Para personalizar a mensagem, edite:
- **Arquivo**: `src/lib/utils.ts`
- **Função**: `buildWhatsAppCheckoutMessage()`

Você pode modificar:
- Texto de saudação
- Emojis utilizados
- Formato dos separadores
- Informações exibidas
- Mensagem de rodapé

## ⚙️ Variáveis de Ambiente

Certifique-se de ter no arquivo `.env.local`:

```bash
NEXT_PUBLIC_WHATSAPP_NUMBER=5511999999999
```

Ou configure diretamente em `/admin/config`.

## 📝 Exemplo de Uso

1. Cliente adiciona produtos ao carrinho
2. Cliente cadastra/faz login (nome é capturado)
3. Cliente clica em "Finalizar Pedido"
4. WhatsApp abre automaticamente
5. Mensagem já está formatada e pronta
6. Cliente só precisa enviar!

## 🚀 Benefícios

- ✅ **Processo rápido**: Cliente envia pedido em 1 clique
- ✅ **Informativo**: Todos os detalhes incluídos
- ✅ **Links diretos**: Fácil conferir produtos
- ✅ **Profissional**: Mensagem bem formatada
- ✅ **Rastreável**: Nome do cliente incluso
- ✅ **Visual**: Emojis e formatação clara

