"use client";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X, Heart, ShoppingCart, Sparkles, Plus, Minus } from "lucide-react";
import { formatCurrencyBRL } from "@/lib/utils";
import { useCart } from "@/hooks/useCart";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabaseClient";

type ProductModalProps = {
  product: any;
  isOpen: boolean;
  onClose: () => void;
};

export function ProductModal({ product, isOpen, onClose }: ProductModalProps) {
  const { add } = useCart();
  const [related, setRelated] = useState<any[]>([]);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [favorited, setFavorited] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const supabase = createClient();

  useEffect(() => {
    if (product?.category) {
      supabase.from("products").select("id, name, price, images").eq("category", product.category).neq("id", product.id).limit(3).then(({ data }) => {
        setRelated(data || []);
      });
    }
  }, [product?.category, product?.id]);

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem("mevi-favorites") || "[]");
    setFavorited(favorites.includes(product?.id));
  }, [product?.id]);

  if (!product) return null;

  const images = Array.isArray(product.images) ? product.images : [];
  const variations = product.variations || {};
  const sizes = variations.sizes || [];
  const stock = product.stock || 0;
  const isNew = product?.created_at && 
    (Date.now() - new Date(product.created_at).getTime()) < 7 * 24 * 60 * 60 * 1000;
  const isFeatured = product?.featured;

  function toggleFavorite() {
    const favorites = JSON.parse(localStorage.getItem("mevi-favorites") || "[]");
    if (favorited) {
      const newFavorites = favorites.filter((id: string) => id !== product.id);
      localStorage.setItem("mevi-favorites", JSON.stringify(newFavorites));
    } else {
      localStorage.setItem("mevi-favorites", JSON.stringify([...favorites, product.id]));
    }
    setFavorited(!favorited);
    if (navigator.vibrate) navigator.vibrate(50);
  }

  function handleAddToCart() {
    if (stock <= 0) {
      alert("Produto esgotado");
      return;
    }
    if (quantity > stock) {
      alert(`Estoque disponível: ${stock} unidades`);
      return;
    }
    if (navigator.vibrate) navigator.vibrate(50);
    add({
      id: `${product.id}-${selectedSize || "default"}`,
      name: `${product.name}${selectedSize ? ` - ${selectedSize}` : ""}`,
      price: product.price,
      quantity: quantity,
    });
    
    // Resetar quantidade e fechar modal
    setQuantity(1);
    setTimeout(onClose, 300);
  }

  function increaseQuantity() {
    if (quantity < stock) {
      setQuantity(quantity + 1);
    }
  }

  function decreaseQuantity() {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/50 flex items-end md:items-center justify-center"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: "100%", scale: 0.95 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: "100%", scale: 0.95 }}
            transition={{ type: "spring", damping: 25 }}
            className="bg-white rounded-t-3xl md:rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <button onClick={onClose} className="absolute top-3 right-3 z-10 bg-white/90 backdrop-blur-sm rounded-full p-2.5 hover:bg-white transition-colors shadow-sm">
                <X className="h-5 w-5" />
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite();
                }}
                className="absolute top-3 left-3 z-10 bg-white/90 backdrop-blur-sm rounded-full p-2.5 hover:bg-white transition-colors shadow-sm"
              >
                <Heart className={`h-5 w-5 transition-all ${favorited ? "fill-primary text-primary scale-110" : "text-gray-600"}`} />
              </button>
              {images.length > 0 ? (
                <div className="relative h-80">
                  <Image src={images[0]} alt={product.name} fill className="object-cover rounded-t-3xl md:rounded-t-2xl" />
                </div>
              ) : (
                <div className="h-80 bg-gray-100 rounded-t-3xl md:rounded-t-2xl" />
              )}
            </div>

            <div className="p-4 space-y-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {isNew && (
                      <div className="bg-emerald-500 text-white px-2 py-0.5 rounded-full text-xs font-bold flex items-center gap-1">
                        <Sparkles className="h-3 w-3" />
                        Novo
                      </div>
                    )}
                    {isFeatured && (
                      <div className="bg-secondary text-gray-900 px-2 py-0.5 rounded-full text-xs font-bold">
                        ⭐ Destaque
                      </div>
                    )}
                    {product?.category && (
                      <div className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                        {product.category}
                      </div>
                    )}
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">{product.name}</h2>
                  <div className="text-2xl font-bold text-primary mt-1">{formatCurrencyBRL(product.price)}</div>
                </div>
              </div>

              {product.description && (
                <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                  <p className="text-sm text-gray-700 leading-relaxed">{product.description}</p>
                </div>
              )}

              {sizes.length > 0 && (
                <div>
                  <div className="text-sm font-medium mb-2">Tamanho</div>
                  <div className="flex gap-2 flex-wrap">
                    {sizes.map((size: string) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 rounded-xl border ${
                          selectedSize === size ? "bg-primary text-white border-primary" : "bg-white border-gray-300"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {stock > 0 && stock <= 5 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-sm text-yellow-800">
                  ⚠️ Restam apenas {stock} unidades{selectedSize ? ` no tamanho ${selectedSize}` : ""}
                </div>
              )}

              {stock <= 0 && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-800">
                  Produto esgotado
                </div>
              )}

              {/* Seletor de Quantidade */}
              {stock > 0 && (
                <div>
                  <div className="text-sm font-medium mb-2">Quantidade</div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={decreaseQuantity}
                      disabled={quantity <= 1}
                      className="w-10 h-10 rounded-xl border-2 border-gray-300 flex items-center justify-center hover:border-primary hover:bg-primary/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Minus className="h-4 w-4 text-gray-700" />
                    </button>
                    <div className="flex-1 text-center">
                      <span className="text-2xl font-bold text-gray-900">{quantity}</span>
                    </div>
                    <button
                      onClick={increaseQuantity}
                      disabled={quantity >= stock}
                      className="w-10 h-10 rounded-xl border-2 border-gray-300 flex items-center justify-center hover:border-primary hover:bg-primary/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="h-4 w-4 text-gray-700" />
                    </button>
                  </div>
                </div>
              )}

              <button
                onClick={handleAddToCart}
                disabled={stock <= 0}
                className={`w-full py-4 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg ${
                  stock <= 0 
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                    : 'bg-primary text-white'
                }`}
              >
                <ShoppingCart className="h-5 w-5" />
                {stock <= 0 ? 'Produto Esgotado' : `Adicionar ${quantity > 1 ? `${quantity} unidades` : ''} ao carrinho`}
              </button>

              {stock > 0 && (
                <div className="text-xs text-gray-500 text-center">
                  {stock} unidades disponíveis
                </div>
              )}

              {related.length > 0 && (
                <div>
                  <div className="text-sm font-medium mb-2">Combina com</div>
                  <div className="grid grid-cols-3 gap-2">
                    {related.map((p) => (
                      <div key={p.id} className="relative aspect-square rounded-xl overflow-hidden">
                        {Array.isArray(p.images) && p.images[0] ? (
                          <Image src={p.images[0]} alt={p.name} fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full bg-gray-100" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
