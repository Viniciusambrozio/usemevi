"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabaseClient";
import { formatCurrencyBRL } from "@/lib/utils";
import { useCart } from "@/hooks/useCart";
import { ArrowLeft, Heart, ShoppingCart, Tag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { RatingBadges } from "@/components/rating-badges";
import { ToastNotification } from "@/components/toast-notification";
import { FloatingCartButton } from "@/components/floating-cart-button";

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const { add, items } = useCart();
  const supabase = createClient();
  
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [related, setRelated] = useState<any[]>([]);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [favorited, setFavorited] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [showToast, setShowToast] = useState(false);
  
  // Calcula quantidade de itens do carrinho
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    async function loadProduct() {
      if (!params.id) return;
      
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("id", params.id)
          .single();

        if (error) {
          console.error("Erro ao carregar produto:", error);
          router.push("/");
          return;
        }

        setProduct(data);

        // Carregar produtos relacionados
        if (data?.category) {
          const { data: relatedData } = await supabase
            .from("products")
            .select("id, name, price, images, category")
            .eq("category", data.category)
            .neq("id", params.id)
            .limit(4);
          
          setRelated(relatedData || []);
        }

        // Verificar se está favoritado
        const favorites = JSON.parse(localStorage.getItem("mevi-favorites") || "[]");
        setFavorited(favorites.includes(data?.id));
        
        // Carregar contador de favoritos
        loadFavoritesCount();
      } catch (error) {
        console.error("Erro ao carregar produto:", error);
        router.push("/");
      } finally {
        setLoading(false);
      }
    }

    loadProduct();

    // Atualiza contador de favoritos quando mudam
    const handleStorageChange = () => {
      loadFavoritesCount();
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [params.id]);

  function loadFavoritesCount() {
    const favorites = JSON.parse(localStorage.getItem("mevi-favorites") || "[]");
    setFavoritesCount(favorites.length);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  const images = Array.isArray(product.images) ? product.images : [];
  const variations = product.variations || {};
  const sizes = variations.sizes || [];
  const stock = product.stock || 0;
  const isNew = product?.created_at && 
    (Date.now() - new Date(product.created_at).getTime()) < 7 * 24 * 60 * 60 * 1000;
  const isFeatured = product?.featured;
  const lowStock = stock > 0 && stock <= 5;

  function toggleFavorite() {
    const favorites = JSON.parse(localStorage.getItem("mevi-favorites") || "[]");
    if (favorited) {
      const newFavorites = favorites.filter((id: string) => id !== product.id);
      localStorage.setItem("mevi-favorites", JSON.stringify(newFavorites));
    } else {
      localStorage.setItem("mevi-favorites", JSON.stringify([...favorites, product.id]));
    }
    setFavorited(!favorited);
    
    // Dispara evento para atualizar outros componentes
    window.dispatchEvent(new Event("storage"));
    loadFavoritesCount();
    
    if (navigator.vibrate) navigator.vibrate(50);
  }

  function handleAddToCart() {
    if (stock <= 0) {
      alert("Produto esgotado");
      return;
    }
    if (navigator.vibrate) navigator.vibrate(50);
    add({
      id: `${product.id}-${selectedSize || "default"}`,
      name: `${product.name}${selectedSize ? ` - ${selectedSize}` : ""}`,
      price: product.price,
      quantity: 1,
    });
    
    // Mostra notificação bonita
    setShowToast(true);
  }

  return (
    <div className="min-h-screen bg-white pb-32">
      {/* Toast Notification */}
      <ToastNotification
        isOpen={showToast}
        onClose={() => setShowToast(false)}
        message="Produto adicionado ao carrinho!"
        productName={product.name}
        productImage={images[0]}
        productPrice={formatCurrencyBRL(product.price)}
        showCartButton={true}
      />

      {/* Header */}
      <header className="bg-primary py-2">
        <div className="flex items-center justify-between px-4 h-12">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-white" />
          </button>
          
          <div className="flex items-center gap-3">
            <Link href="/cart" className="relative p-1">
              <ShoppingCart className="w-6 h-6" style={{ color: '#ffe472' }} />
              {cartCount > 0 && (
                <span 
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shadow-md"
                  style={{ backgroundColor: '#ffe472', color: '#000' }}
                >
                  {cartCount}
                </span>
              )}
            </Link>
            <Link href="/favorites" className="relative p-1">
              <Heart 
                className="w-6 h-6" 
                style={{ color: '#ffe472' }}
                fill={favorited ? '#ffe472' : 'none'}
              />
            </Link>
          </div>
        </div>
      </header>

      {/* Imagem do Produto */}
      <div className="relative">
        {images.length > 0 ? (
          <div className="relative aspect-[4/5] bg-gray-50">
            <Image 
              src={images[currentImageIndex]} 
              alt={product.name} 
              fill
              className="object-cover" 
              priority
            />

            {/* Indicadores de imagem */}
            {images.length > 1 && (
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5">
                {images.map((_: any, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`w-1.5 h-1.5 rounded-full transition-all ${
                      idx === currentImageIndex 
                        ? 'bg-gray-700' 
                        : 'bg-gray-400'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="aspect-[4/5] bg-gray-100 flex items-center justify-center">
            <ShoppingCart className="h-20 w-20 text-gray-300" />
          </div>
        )}
      </div>

      {/* Informações do Produto */}
      <div className="px-5 py-5 space-y-4">
        {/* Nome e Stock Badge */}
        <div className="flex items-start justify-between gap-3">
          <h1 className="text-xl font-bold text-gray-900 flex-1">{product.name}</h1>
          {stock > 0 && (
            <div className="bg-pink-50 px-3 py-1.5 rounded-lg flex items-center gap-1.5 flex-shrink-0">
              <Tag className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-medium text-primary">{stock} Unidades em estoque</span>
            </div>
          )}
        </div>

        {/* Preço e Avaliações */}
        <div className="flex items-center justify-between">
          <div className="text-3xl font-bold text-gray-900">
            {formatCurrencyBRL(product.price)}
          </div>
          <RatingBadges 
            rating={product.rating || 0}
            likes={product.likes || 0}
            productId={product.id}
          />
        </div>

        {/* Tamanhos Disponíveis */}
        {sizes.length > 0 && (
          <div>
            <h3 className="text-base font-semibold text-gray-900 mb-3">Tamanhos Disponíveis</h3>
            <div className="flex gap-2 flex-wrap">
              {sizes.map((size: any) => {
                const sizeLabel = typeof size === 'string' ? size : size.size;
                const sizeStock = typeof size === 'object' && size.stock ? size.stock : null;
                
                return (
                  <button
                    key={sizeLabel}
                    onClick={() => setSelectedSize(sizeLabel)}
                    className={`px-5 py-2.5 rounded-xl border-2 font-medium transition-all ${
                      selectedSize === sizeLabel 
                        ? "bg-primary text-white border-primary" 
                        : "bg-white border-gray-300 text-gray-700 hover:border-primary"
                    }`}
                  >
                    <span>{sizeLabel}</span>
                    {sizeStock !== null && (
                      <span className="ml-1 text-xs opacity-75">({sizeStock})</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Descrição */}
        <div>
          <h3 className="text-base font-semibold text-gray-900 mb-2">Descrição do Produto</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            {product.description || "Produto de alta qualidade, confeccionado com materiais premium e atenção aos detalhes. Perfeito para complementar seu estilo com elegância e conforto."}
          </p>
        </div>

        {/* Alerta de Estoque */}
        {stock <= 0 && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-800">
            ❌ Produto esgotado
          </div>
        )}
      </div>

      {/* Footer Fixo com Botão */}
      <div className="fixed bottom-6 left-0 right-0 px-4 z-50">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-3">
          <div className="flex items-center gap-2.5">
          {/* Botão Adicionar ao Carrinho */}
          <button
            onClick={handleAddToCart}
            disabled={stock <= 0}
            className={`flex-1 h-10 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
              stock <= 0 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-primary text-white hover:bg-primary/90 active:scale-95'
            }`}
          >
            <ShoppingCart className="h-4 w-4 flex-shrink-0" />
            <span>Adicione ao Carrinho</span>
          </button>

          {/* Botão Favoritar */}
          <button
            onClick={toggleFavorite}
            className="w-10 h-10 rounded-xl bg-white border-2 border-gray-200 flex items-center justify-center hover:border-primary transition-colors flex-shrink-0"
          >
            <Heart 
              className={`h-4 w-4 transition-all ${
                favorited 
                  ? "fill-primary text-primary" 
                  : "text-gray-400"
              }`} 
            />
          </button>
          </div>
        </div>
      </div>

      {/* Botão Flutuante do Carrinho */}
      <FloatingCartButton />
    </div>
  );
}

