export function formatCurrencyBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export type CartItem = { id: string; name: string; price: number; quantity: number };

export function buildWhatsAppCheckoutMessage(items: CartItem[], userName?: string) {
  const lines: string[] = [];
  
  // Saudação personalizada
  const greeting = userName 
    ? `Ola! Me chamo *${userName}*` 
    : "Ola!";
  
  lines.push(greeting);
  lines.push("");
  lines.push("Fiquei interessada em umas pecas lindas da Usemevi e gostaria de finalizar meu pedido!");
  lines.push("");
  
  // Contar itens
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const itemWord = totalItems === 1 ? "peca" : "pecas";
  
  lines.push(`Escolhi *${totalItems} ${itemWord}* que amei:`);
  lines.push("");
  
  let total = 0;
  
  for (const item of items) {
    const subtotal = item.price * item.quantity;
    total += subtotal;
    
    // Extrai o ID do produto (remove sufixo de tamanho)
    const productId = item.id.split('-').length > 5 
      ? item.id.split('-').slice(0, -1).join('-') 
      : item.id;
    
    lines.push(`*${item.quantity}x ${item.name}*`);
    lines.push(`   ${formatCurrencyBRL(item.price)} cada`);
    lines.push(`   _Ver peca:_ https://usemevi.vercel.app/product/${productId}`);
    lines.push("");
  }
  
  lines.push("-------------------");
  lines.push(`*Valor Total: ${formatCurrencyBRL(total)}*`);
  lines.push("-------------------");
  lines.push("");
  lines.push("Pode me ajudar a finalizar? Estou ansiosa para receber!");
  
  return lines.join("\n");
}
