"use client";
import { useCart } from "@/hooks/useCart";
import { buildWhatsAppCheckoutMessage, formatCurrencyBRL } from "@/lib/utils";
import { NavbarBottom } from "@/components/navbar-bottom";
import { FloatingCartButton } from "@/components/floating-cart-button";
import { Plus, Minus, Trash2, ShoppingBag, ArrowLeft, Package } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabaseClient";
import { useAuth } from "@/hooks/useAuth";

export default function CartPage() {
  const { items, total, updateQuantity, remove } = useCart();
  const { user } = useAuth();
  const [productsData, setProductsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const supabase = createClient();

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        // Buscar configuração do WhatsApp
        const { data: configData } = await supabase
          .from("config")
          .select("whatsapp_number")
          .limit(1)
          .maybeSingle();
        
        if (configData?.whatsapp_number) {
          setWhatsappNumber(configData.whatsapp_number);
        }

        // Buscar dados dos produtos se houver itens
        if (items.length > 0) {
          const productIds = items.map(item => {
            const parts = item.id.split('-');
            if (parts.length > 5) {
              return parts.slice(0, -1).join('-');
            }
            return item.id;
          });
          const uniqueIds = Array.from(new Set(productIds));

          const { data } = await supabase
            .from("products")
            .select("id, images, stock, variations")
            .in("id", uniqueIds);

          setProductsData(data || []);
        } else {
          setProductsData([]);
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [items]);

  const message = buildWhatsAppCheckoutMessage(items, user?.name);
  const waLink = whatsappNumber 
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}` 
    : "#";

  function handleFinalizarPedido(e: React.MouseEvent) {
    if (!whatsappNumber) {
      e.preventDefault();
      alert("Número do WhatsApp não configurado! Configure em Admin > Configurações");
      return;
    }
    
    if (items.length === 0) {
      e.preventDefault();
      alert("Carrinho vazio!");
      return;
    }

    console.log("Abrindo WhatsApp:", whatsappNumber);
    console.log("Mensagem:", message);
  }

  function getProductImage(itemId: string) {
    const product = getProductData(itemId);
    const image = Array.isArray(product?.images) && product.images.length > 0 ? product.images[0] : null;
    return image;
  }

  function getProductData(itemId: string) {
    // Extrai o UUID do produto (remove sufixo de tamanho)
    const parts = itemId.split('-');
    const productId = parts.length > 5 ? parts.slice(0, -1).join('-') : itemId;
    
    const product = productsData.find(p => p.id === productId);
    return product;
  }

  function getAvailableStock(itemId: string, itemName: string): number {
    const product = getProductData(itemId);
    if (!product) return 0;

    // Extrai o tamanho do nome do produto (ex: "Blusa Florida - M" -> "M")
    const sizeMatch = itemName.match(/- ([A-Z0-9]+)$/);
    const size = sizeMatch ? sizeMatch[1] : null;

    if (size && product.variations?.sizes) {
      const sizeData = product.variations.sizes.find((s: any) => s.size === size);
      return sizeData?.stock || 0;
    }

    return product.stock || 0;
  }

  function handleUpdateQuantity(itemId: string, itemName: string, newQuantity: number) {
    const maxStock = getAvailableStock(itemId, itemName);
    
    if (newQuantity > maxStock) {
      alert(`Estoque insuficiente! Apenas ${maxStock} unidades disponíveis.`);
      return;
    }

    updateQuantity(itemId, newQuantity);
  }

  return (
    <div className="min-h-screen bg-white pb-32">
      {/* Header */}
      <header className="bg-primary py-2">
        <div className="flex items-center justify-between px-4 h-12">
          <Link href="/" className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors">
            <ArrowLeft className="h-5 w-5 text-white" />
          </Link>
          
          <div className="flex items-center gap-2">
            <div 
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: '#ffe472' }}
            >
              <ShoppingBag className="h-5 w-5" style={{ color: '#fc0055' }} />
            </div>
            <div>
              <h1 className="text-base font-bold text-white">Carrinho</h1>
            </div>
          </div>

          <div className="w-9" />
        </div>
      </header>

      {/* Items */}
      <div className="p-4 space-y-3">
        {items.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-gray-100 rounded-full p-8 w-32 h-32 mx-auto mb-4 flex items-center justify-center">
              <ShoppingBag className="h-16 w-16 text-gray-300" />
            </div>
            <p className="text-gray-500 text-lg font-medium mb-2">Carrinho vazio</p>
            <p className="text-gray-400 text-sm mb-6">Adicione produtos para começar</p>
            <Link 
              href="/" 
              className="inline-block bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors"
            >
              Continuar comprando
            </Link>
          </div>
        ) : (
          items.map((item) => {
            const productImage = getProductImage(item.id);
            const availableStock = getAvailableStock(item.id, item.name);
            const isAtMaxStock = item.quantity >= availableStock;
            
            return (
              <div key={item.id} className="bg-gray-50 rounded-3xl p-3.5 shadow-sm">
                <div className="flex gap-4">
                  {/* Imagem do Produto */}
                  {productImage ? (
                    <div className="relative w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 bg-white">
                      <Image 
                        src={productImage} 
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-24 h-24 rounded-2xl bg-white flex items-center justify-center flex-shrink-0">
                      <Package className="h-10 w-10 text-gray-300" />
                    </div>
                  )}

                  {/* Informações do Produto */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 pr-2">
                        <h3 className="font-bold text-gray-900 text-sm line-clamp-2 mb-1">
                          {item.name}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {formatCurrencyBRL(item.price)} cada
                        </p>
                        {availableStock > 0 && (
                          <p className="text-xs mt-1" style={{ color: isAtMaxStock ? '#ef4444' : '#6b7280' }}>
                            {isAtMaxStock ? '⚠️ ' : ''}
                            {availableStock} disponíveis
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => remove(item.id)}
                        className="p-1.5 hover:bg-red-100 rounded-lg transition-colors flex-shrink-0"
                        aria-label="Remover item"
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Controles de quantidade */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.name, item.quantity - 1)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white transition-colors"
                          style={{ backgroundColor: '#fff' }}
                        >
                          <Minus className="h-4 w-4 text-gray-700" />
                        </button>
                        <span className="w-8 text-center font-bold text-gray-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.name, item.quantity + 1)}
                          disabled={isAtMaxStock}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                            isAtMaxStock 
                              ? 'bg-gray-200 cursor-not-allowed opacity-50' 
                              : 'bg-white hover:bg-gray-50'
                          }`}
                        >
                          <Plus className={`h-4 w-4 ${isAtMaxStock ? 'text-gray-400' : 'text-gray-700'}`} />
                        </button>
                      </div>

                      {/* Subtotal */}
                      <div className="text-right">
                        <p className="text-xs text-gray-500 mb-0.5">Subtotal</p>
                        <p className="text-base font-black" style={{ color: '#fc0055' }}>
                          {formatCurrencyBRL(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer com Total */}
      {items.length > 0 && (
        <div className="fixed left-0 right-0 px-4 z-30" style={{ bottom: '8rem' }}>
          <div className="bg-white rounded-3xl shadow-2xl p-5" style={{ border: '2px solid #ffe472' }}>
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs text-gray-500 mb-1">Total do Pedido</p>
                <p className="text-3xl font-black" style={{ color: '#fc0055' }}>
                  {formatCurrencyBRL(total)}
                </p>
              </div>
            </div>
            
            <a 
              href={waLink} 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={handleFinalizarPedido}
              className="w-full py-4 rounded-2xl font-black text-white text-center flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95"
              style={{ backgroundColor: '#fc0055' }}
            >
              <ShoppingBag className="h-5 w-5" />
              Finalizar Pedido
            </a>
            
            <p className="text-xs text-gray-400 text-center mt-3">
              💬 Você será redirecionado para o WhatsApp
            </p>
          </div>
        </div>
      )}

      <NavbarBottom />
    </div>
  );
}
