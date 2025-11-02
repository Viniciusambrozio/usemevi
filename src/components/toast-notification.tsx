"use client";
import { CheckCircle, ShoppingCart, X } from "lucide-react";
import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

interface ToastNotificationProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  productName?: string;
  productImage?: string;
  productPrice?: string;
  showCartButton?: boolean;
}

export function ToastNotification({
  isOpen,
  onClose,
  message,
  productName,
  productImage,
  productPrice,
  showCartButton = true
}: ToastNotificationProps) {
  
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000); // Fecha após 4 segundos

      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed top-4 left-1/2 -translate-x-1/2 z-[10000] animate-in slide-in-from-top-4 duration-500"
      style={{ width: 'calc(100% - 2rem)', maxWidth: '440px' }}
    >
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-2" style={{ borderColor: '#ffe472' }}>
        {/* Header com gradiente */}
        <div 
          className="px-5 py-3 flex items-center justify-between"
          style={{ background: 'linear-gradient(135deg, #fc0055 0%, #ff1a6b 100%)' }}
        >
          <div className="flex items-center gap-2">
            <div 
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: '#ffe472' }}
            >
              <CheckCircle className="h-5 w-5" style={{ color: '#fc0055' }} />
            </div>
            <span className="text-white font-bold text-sm">
              Adicionado ao carrinho!
            </span>
          </div>
          
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
            aria-label="Fechar"
          >
            <X className="h-4 w-4 text-white" />
          </button>
        </div>

        {/* Conteúdo do produto */}
        {productName && (
          <div className="p-5 flex items-center gap-4">
            {productImage && (
              <div className="relative w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 border-2" style={{ borderColor: '#ffe472' }}>
                <Image 
                  src={productImage} 
                  alt={productName}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-gray-900 text-base mb-1 line-clamp-2">
                {productName}
              </h4>
              {productPrice && (
                <p className="font-bold text-lg" style={{ color: '#fc0055' }}>
                  {productPrice}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Botão de ação */}
        {showCartButton && (
          <div className="px-5 pb-5">
            <Link
              href="/cart"
              onClick={onClose}
              className="w-full py-3 rounded-2xl font-bold text-white flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95"
              style={{ backgroundColor: '#fc0055' }}
            >
              <ShoppingCart className="h-5 w-5" />
              Ver Carrinho
            </Link>
          </div>
        )}
        
        {/* Barra de progresso */}
        <div className="h-1" style={{ backgroundColor: '#ffe472' }}>
          <div 
            className="h-full"
            style={{ 
              backgroundColor: '#fc0055',
              animation: 'progress 4s linear forwards'
            }}
          />
        </div>
      </div>
      
      <style jsx>{`
        @keyframes progress {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
}

