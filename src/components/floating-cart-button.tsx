"use client";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { formatCurrencyBRL } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export function FloatingCartButton() {
  const { items, total } = useCart();
  const router = useRouter();
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    if (cartCount > 0) {
      setShouldAnimate(true);
      const timer = setTimeout(() => setShouldAnimate(false), 600);
      return () => clearTimeout(timer);
    }
  }, [cartCount]);

  if (cartCount === 0) return null;

  return (
    <button
      onClick={() => router.push('/cart')}
      className={`
        fixed bottom-32 right-5 z-40
        w-16 h-16 rounded-full
        flex items-center justify-center
        transition-all duration-300
        hover:scale-110 active:scale-95
        ${shouldAnimate ? 'animate-bounce' : ''}
      `}
      style={{ 
        backgroundColor: '#fc0055'
      }}
      aria-label={`Ir para carrinho - ${cartCount} ${cartCount === 1 ? 'item' : 'itens'}`}
    >
      <ShoppingCart className="w-7 h-7 text-white" strokeWidth={2} />
      
      {/* Badge com contador */}
      <span 
        className="absolute -top-1.5 -right-1.5 w-7 h-7 rounded-full flex items-center justify-center text-xs font-black"
        style={{ 
          backgroundColor: '#ffe472', 
          color: '#000'
        }}
      >
        {cartCount}
      </span>
      
      {/* Efeito de pulso ao adicionar */}
      {shouldAnimate && (
        <span 
          className="absolute inset-0 rounded-full animate-ping"
          style={{ 
            backgroundColor: '#fc0055',
            opacity: 0.6
          }}
        />
      )}
    </button>
  );
}

