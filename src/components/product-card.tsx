"use client";
import Image from "next/image";
import { Heart, AlertCircle, ShoppingCart } from "lucide-react";
import { formatCurrencyBRL } from "@/lib/utils";
import { useState, useEffect } from "react";
import Link from "next/link";
import { RatingBadges } from "./rating-badges";

export function ProductCard({ product }: { product: any }) {
  const [favorited, setFavorited] = useState(false);
  const firstImage = Array.isArray(product?.images) ? product.images[0] : undefined;
  const outOfStock = (product?.stock || 0) <= 0;
  const isNew = product?.created_at && 
    (Date.now() - new Date(product.created_at).getTime()) < 7 * 24 * 60 * 60 * 1000; // 7 dias
  const isFeatured = product?.featured;
  const stock = product?.stock || 0;
  const lowStock = stock > 0 && stock <= 5;

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem("mevi-favorites") || "[]");
    setFavorited(favorites.includes(product.id));
  }, [product.id]);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorited(!favorited);
    
    const favorites = JSON.parse(localStorage.getItem("mevi-favorites") || "[]");
    if (favorited) {
      const newFavorites = favorites.filter((id: string) => id !== product.id);
      localStorage.setItem("mevi-favorites", JSON.stringify(newFavorites));
    } else {
      localStorage.setItem("mevi-favorites", JSON.stringify([...favorites, product.id]));
    }
    
    // Dispara evento para atualizar outros componentes
    window.dispatchEvent(new Event("storage"));
    
    if (navigator.vibrate) navigator.vibrate(50);
  };

  return (
    <Link href={`/product/${product.id}`} className="bg-gray-50 rounded-3xl overflow-hidden p-3.5 block hover:shadow-lg transition-shadow">
      {firstImage ? (
        <div className="relative aspect-square overflow-hidden bg-white rounded-2xl mb-3">
          <Image 
            src={firstImage} 
            alt={product.name} 
            fill
            className="object-cover" 
            sizes="(max-width: 768px) 50vw, 25vw"
          />
          
          {/* Badges */}
          {isNew && !lowStock && (
            <div className="absolute top-2 left-2 px-2.5 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: '#fc0055', color: 'white' }}>
              NEW
            </div>
          )}
          {lowStock && (
            <div className="absolute top-2 left-2 px-2.5 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: '#ffe472', color: '#fc0055' }}>
              ÚLTIMAS {stock}
            </div>
          )}
          {isFeatured && !isNew && !lowStock && (
            <div className="absolute top-2 left-2 px-2.5 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: '#ffe472', color: '#fc0055' }}>
              DESTAQUE
            </div>
          )}

          {/* Botão favoritar */}
          <button
            aria-label="Favoritar"
            onClick={toggleFavorite}
            className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full p-2 z-10 hover:bg-white transition-colors shadow-sm"
          >
            <Heart 
              className={`h-4 w-4 transition-all ${
                favorited 
                  ? "fill-primary text-primary scale-110" 
                  : "text-gray-600 hover:text-primary"
              }`} 
            />
          </button>

          {/* Estoque esgotado */}
          {outOfStock && (
            <div className="absolute inset-0 bg-gray-900/60 flex items-center justify-center z-20">
              <div className="bg-red-600 text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Esgotado
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="aspect-square w-full bg-white rounded-2xl mb-3 flex items-center justify-center">
          <AlertCircle className="h-12 w-12 text-gray-300" />
        </div>
      )}

      {/* Info do produto */}
      <div>
        <h4 className="text-sm text-gray-900 mb-3 line-clamp-2 h-10 px-1 font-medium">
          {product.name}
        </h4>
        
        <div className="flex items-center gap-2 mb-2 h-6 px-1">
          <span className="text-gray-900 font-bold">
            {formatCurrencyBRL(product.price)}
          </span>
        </div>

        {/* Badges de Avaliação e Curtidas */}
        <div className="px-1 mb-3">
          <RatingBadges 
            rating={product.rating || 0} 
            likes={product.likes || 0}
            productId={product.id}
          />
        </div>
        
        <div
          className="w-full py-2.5 rounded-xl transition-all text-sm text-white text-center flex items-center justify-center gap-2 font-medium"
          style={{ 
            backgroundColor: outOfStock ? '#e0e0e0' : '#fc0055',
            opacity: outOfStock ? 0.5 : 1
          }}
        >
          <ShoppingCart className="w-4 h-4" />
          <span>{outOfStock ? 'Esgotado' : 'Ver detalhes'}</span>
        </div>
      </div>
    </Link>
  );
}
