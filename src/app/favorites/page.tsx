"use client";
import { useEffect, useState } from "react";
import { NavbarBottom } from "@/components/navbar-bottom";
import { ProductCard } from "@/components/product-card";
import { FloatingCartButton } from "@/components/floating-cart-button";
import { createClient } from "@/lib/supabaseClient";
import { Heart } from "lucide-react";

export default function FavoritesPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function loadFavorites() {
      setLoading(true);
      try {
        // Buscar favoritos do localStorage
        const favoriteIds = JSON.parse(localStorage.getItem("mevi-favorites") || "[]");
        
        if (favoriteIds.length === 0) {
          setProducts([]);
          setLoading(false);
          return;
        }

        // Buscar produtos favoritados
        const { data } = await supabase
          .from("products")
          .select("id, name, price, images, featured, description, stock, variations, category, created_at")
          .in("id", favoriteIds);

        if (data) {
          // Manter a ordem dos favoritos
          const orderedProducts = favoriteIds
            .map((id: string) => data.find(p => p.id === id))
            .filter(Boolean);
          setProducts(orderedProducts);
        }
      } catch (error) {
        console.error("Erro ao carregar favoritos:", error);
      } finally {
        setLoading(false);
      }
    }
    
    loadFavorites();
    
    // Recarregar quando localStorage mudar
    const handleStorageChange = () => loadFavorites();
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <div className="pb-20 bg-gradient-to-b from-gray-50 to-white min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary/10 via-secondary/5 to-gray-50 p-6 pb-8 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="bg-primary rounded-2xl p-3 shadow-soft">
            <Heart className="h-6 w-6 text-white fill-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Favoritos</h1>
            <p className="text-sm text-gray-600">Seus produtos preferidos</p>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <section className="grid grid-cols-2 gap-3 p-3">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-xl bg-gray-100 animate-pulse aspect-[3/4]" />
          ))
        ) : products.length === 0 ? (
          <div className="col-span-2 text-center py-16">
            <div className="bg-gray-100 rounded-full p-8 w-32 h-32 mx-auto mb-4 flex items-center justify-center">
              <Heart className="h-16 w-16 text-gray-300" />
            </div>
            <p className="text-gray-500 text-lg font-medium mb-2">Nenhum favorito ainda</p>
            <p className="text-gray-400 text-sm">Adicione produtos aos favoritos para vê-los aqui</p>
          </div>
        ) : (
          products.map((p) => <ProductCard key={p.id} product={p} />)
        )}
      </section>

      {/* Results counter */}
      {!loading && products.length > 0 && (
        <div className="px-3 pb-2 text-center">
          <p className="text-sm text-gray-500">
            {products.length} {products.length === 1 ? "produto favoritado" : "produtos favoritados"}
          </p>
        </div>
      )}

      {/* Botão Flutuante do Carrinho */}
      <FloatingCartButton />

      <NavbarBottom />
    </div>
  );
}
