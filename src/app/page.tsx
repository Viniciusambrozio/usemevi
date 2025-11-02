"use client";
import { NavbarBottom } from "@/components/navbar-bottom";
import { ProductCard } from "@/components/product-card";
import { FloatingCartButton } from "@/components/floating-cart-button";
import { WelcomeModal } from "@/components/welcome-modal";
import { createClient } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";
import { Search, ShoppingCart, SlidersHorizontal } from "lucide-react";
import Image from "next/image";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";

export default function HomePage() {
  const supabase = createClient();
  const { items } = useCart();
  const { user, login } = useAuth();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("todos");
  const [categories, setCategories] = useState<string[]>([]);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("products")
          .select("id, name, price, images, featured, description, stock, variations, category, created_at, rating, likes")
          .order("created_at", { ascending: false })
          .limit(100);

        if (error) {
          console.error("Erro ao carregar produtos:", error);
        } else if (data) {
          setProducts(data);
          const uniqueCategories = Array.from(new Set(data.map(p => p.category).filter(Boolean)));
          setCategories(uniqueCategories as string[]);
        }
      } catch (error) {
        console.error("Erro ao carregar produtos:", error);
      } finally {
        setLoading(false);
      }
    }
    load();

    // Verificar se usuário está logado
    const checkAuth = setTimeout(() => {
      if (!user) {
        setShowWelcomeModal(true);
      }
    }, 1000); // Aguarda 1 segundo para não ser intrusivo

    return () => clearTimeout(checkAuth);
  }, [user]);

  const filteredProducts = products.filter(p => {
    const matchesSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "todos" || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Welcome Modal */}
      <WelcomeModal
        isOpen={showWelcomeModal}
        onClose={() => setShowWelcomeModal(false)}
        onSuccess={(userData) => {
          login(userData);
          setShowWelcomeModal(false);
        }}
      />

      {/* Header */}
      <header className="bg-primary py-2">
        <div className="flex items-center justify-between px-4 h-12">
          {/* Logo */}
          <div className="relative w-48 h-12 -ml-4">
            <Image 
              src="/logo-usemevi.png" 
              alt="usemevi logo" 
              fill
              className="object-contain"
              priority
            />
          </div>
          
          {/* Ícones */}
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
          </div>
        </div>
      </header>

      {/* SearchBar */}
      <div className="px-4 pt-3 pb-2">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar produtos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-gray-50 rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-pink-100 text-sm shadow-sm"
          />
        </div>
      </div>

      {/* PromoBanner com Logo */}
      <div className="px-4 pb-2">
        <div 
          className="relative rounded-2xl overflow-hidden h-32 bg-primary"
        >
          <div className="relative z-10 h-full flex items-center">
            {/* Logo */}
            <div className="relative w-28 h-16 ml-2">
              <Image 
                src="/logo-usemevi.png" 
                alt="usemevi logo" 
                fill
                className="object-contain"
                priority
              />
            </div>
            
            {/* Badges */}
            <div className="flex-1 flex flex-col items-end gap-2 pr-4">
              <div className="bg-white rounded-full px-4 py-2">
                <p className="text-xs font-bold text-primary flex items-center gap-1">
                  <span>✨</span> NOVA COLEÇÃO
                </p>
              </div>
              <div className="bg-secondary rounded-xl px-5 py-2.5">
                <p className="text-sm font-bold text-gray-900">
                  60% OFF
                </p>
              </div>
            </div>
          </div>
          
          {/* Decoração de fundo */}
          <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-white/10 -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-secondary/20 -ml-16 -mb-16" />
        </div>
      </div>

      {/* CategoryFilter */}
      <div className="px-4 pb-2">
        <h3 className="mb-2 text-gray-900 text-sm">Categorias</h3>
        <div className="flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedCategory("todos")}
            className="flex flex-col items-center gap-1 min-w-[60px]"
          >
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center transition-all"
              style={{
                backgroundColor: selectedCategory === "todos" ? '#fc0055' : '#f5f5f5',
                transform: selectedCategory === "todos" ? 'scale(1.05)' : 'scale(1)'
              }}
            >
              <SlidersHorizontal 
                className="w-5 h-5" 
                style={{ 
                  color: selectedCategory === "todos" ? 'white' : '#374151'
                }}
              />
            </div>
            <span 
              className="text-xs text-center"
              style={{ 
                color: selectedCategory === "todos" ? '#fc0055' : '#6b7280'
              }}
            >
              Todos
            </span>
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className="flex flex-col items-center gap-1 min-w-[60px]"
            >
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center transition-all"
                style={{
                  backgroundColor: selectedCategory === cat ? '#fc0055' : '#f5f5f5',
                  transform: selectedCategory === cat ? 'scale(1.05)' : 'scale(1)'
                }}
              >
                <SlidersHorizontal 
                  className="w-5 h-5" 
                  style={{ 
                    color: selectedCategory === cat ? 'white' : '#374151'
                  }}
                />
              </div>
              <span 
                className="text-xs text-center"
                style={{ 
                  color: selectedCategory === cat ? '#fc0055' : '#6b7280'
                }}
              >
                {cat}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Products Section */}
      <div className="px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-gray-900">Produtos recentes</h3>
          <button className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200">
            <span className="text-sm text-gray-600">Filtros</span>
            <SlidersHorizontal className="w-4 h-4 text-gray-600" />
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-3xl bg-gray-100 animate-pulse aspect-square" />
            ))
          ) : filteredProducts.length === 0 ? (
            <div className="col-span-2 text-center py-12">
              <p className="text-gray-500 text-sm">Nenhum produto encontrado nesta categoria.</p>
            </div>
          ) : (
            filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          )}
        </div>
      </div>

      {/* Botão Flutuante do Carrinho */}
      <FloatingCartButton />

      <NavbarBottom />
    </div>
  );
}
