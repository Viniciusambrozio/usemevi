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
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [favorited, setFavorited] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  
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
  const variations = Array.isArray(product.variations) ? product.variations : [];
  const sizes = variations.sizes || []; // Compatibilidade com formato antigo
  
  // Debug - veja no console do navegador
  console.log('Produto:', product.name);
  console.log('Variações no banco:', product.variations);
  console.log('Variações processadas:', variations);
  
  // Extrair cores únicas das variações
  const uniqueColors: string[] = [...new Set(variations.map((v: any) => v.color).filter(Boolean))] as string[];
  
  // Extrair tamanhos únicos das variações
  const uniqueSizes: string[] = [...new Set(variations.map((v: any) => v.size).filter(Boolean))] as string[];
  
  console.log('Cores únicas:', uniqueColors);
  console.log('Tamanhos únicos:', uniqueSizes);
  
  // Obter imagem da cor selecionada
  const selectedColorVariation = variations.find((v: any) => v.color === selectedColor);
  const colorImage = selectedColorVariation?.imageUrl;
  
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
    
    const variantInfo = [];
    if (selectedSize) variantInfo.push(selectedSize);
    if (selectedColor) variantInfo.push(selectedColor);
    const variantLabel = variantInfo.length > 0 ? ` - ${variantInfo.join(' - ')}` : '';
    
    add({
      id: `${product.id}-${selectedSize || "default"}-${selectedColor || "default"}`,
      name: `${product.name}${variantLabel}`,
      price: product.price,
      quantity: 1,
    });
    
    // Mostra notificação bonita
    setShowToast(true);
  }

  function handleColorSelect(color: string) {
    if (selectedColor === color) {
      // Se clicar na mesma cor, desmarca
      setSelectedColor("");
      setCurrentImageIndex(0);
    } else {
      setSelectedColor(color);
      // Quando seleciona uma cor, reseta o índice da imagem
      setCurrentImageIndex(0);
      
      // Se a cor tem imagem associada, mostra ela
      const variation = variations.find((v: any) => v.color === color);
      if (variation?.imageUrl) {
        // Encontra o índice da imagem associada à cor no array de imagens
        const imageIndex = images.indexOf(variation.imageUrl);
        if (imageIndex !== -1) {
          setCurrentImageIndex(imageIndex);
        }
      }
    }
    if (navigator.vibrate) navigator.vibrate(30);
  }

  // Swipe para trocar imagens
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && currentImageIndex < images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
    if (isRightSwipe && currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }

    setTouchStart(0);
    setTouchEnd(0);
  };

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
          <div 
            className="relative aspect-[4/5] bg-gray-50"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <Image 
              src={images[currentImageIndex] || images[0]} 
              alt={product.name} 
              fill
              className="object-cover" 
              priority
            />

            {/* Badge de cor selecionada */}
            {selectedColor && (
              <div className="absolute top-4 left-4 bg-purple-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1.5 animate-in zoom-in duration-200">
                <div className="w-3 h-3 bg-white rounded-full"></div>
                {selectedColor}
              </div>
            )}

            {/* Indicadores de imagem (sempre visível se houver múltiplas imagens) */}
            {images.length > 1 && (
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5">
                {images.map((_: any, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`transition-all ${
                      idx === currentImageIndex 
                        ? 'w-6 h-1.5 bg-white rounded-full' 
                        : 'w-1.5 h-1.5 bg-white/60 rounded-full hover:bg-white/80'
                    }`}
                  />
                ))}
              </div>
            )}
            
            {/* Botões de navegação (setas) */}
            {images.length > 1 && (
              <>
                <button
                  onClick={() => setCurrentImageIndex((prev) => prev === 0 ? images.length - 1 : prev - 1)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all shadow-md"
                >
                  <span className="text-gray-800 text-lg">‹</span>
                </button>
                <button
                  onClick={() => setCurrentImageIndex((prev) => prev === images.length - 1 ? 0 : prev + 1)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all shadow-md"
                >
                  <span className="text-gray-800 text-lg">›</span>
                </button>
              </>
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

        {/* Debug Info (remover depois) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="text-xs text-gray-500 bg-gray-100 p-2 rounded">
            Debug: {uniqueColors.length} cores, {uniqueSizes.length} tamanhos, {variations.length} variações total
          </div>
        )}

        {/* Cores Disponíveis */}
        {uniqueColors.length > 0 && (
          <div>
            <h3 className="text-base font-semibold text-gray-900 mb-3">Cores Disponíveis</h3>
            <div className="flex gap-2 flex-wrap">
              {uniqueColors.map((color: string) => {
                const colorVariation = variations.find((v: any) => v.color === color);
                const hasImage = !!colorVariation?.imageUrl;
                
                return (
                  <button
                    key={color}
                    onClick={() => handleColorSelect(color)}
                    className={`
                      px-5 py-2.5 rounded-xl border-2 font-medium transition-all relative
                      ${selectedColor === color 
                        ? "bg-purple-500 text-white border-purple-500 shadow-lg scale-105" 
                        : "bg-white border-gray-300 text-gray-700 hover:border-purple-400 hover:shadow-md"
                      }
                    `}
                  >
                    <span>{color}</span>
                    {hasImage && (
                      <span className="ml-1.5">📸</span>
                    )}
                  </button>
                );
              })}
            </div>
            {selectedColor && (
              <p className="text-xs text-purple-600 mt-2 font-medium">
                Cor selecionada: {selectedColor}
              </p>
            )}
          </div>
        )}

        {/* Tamanhos Disponíveis */}
        {(uniqueSizes.length > 0 || sizes.length > 0) && (
          <div>
            <h3 className="text-base font-semibold text-gray-900 mb-3">Tamanhos Disponíveis</h3>
            <div className="flex gap-2 flex-wrap">
              {(uniqueSizes.length > 0 ? uniqueSizes : sizes).map((size: any) => {
                const sizeLabel = typeof size === 'string' ? size : size.size;
                const sizeStock = typeof size === 'object' && size.stock ? size.stock : null;
                
                return (
                  <button
                    key={sizeLabel}
                    onClick={() => setSelectedSize(sizeLabel)}
                    className={`px-5 py-2.5 rounded-xl border-2 font-medium transition-all ${
                      selectedSize === sizeLabel 
                        ? "bg-primary text-white border-primary shadow-lg scale-105" 
                        : "bg-white border-gray-300 text-gray-700 hover:border-primary hover:shadow-md"
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
            {selectedSize && (
              <p className="text-xs text-gray-600 mt-2 font-medium">
                Tamanho selecionado: {selectedSize}
              </p>
            )}
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

