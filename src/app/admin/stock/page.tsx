"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabaseClient";
import { formatCurrencyBRL } from "@/lib/utils";
import { Search, Package, AlertCircle, TrendingDown, TrendingUp, Box, Eye, X } from "lucide-react";
import Image from "next/image";

export default function AdminStockPage() {
  const supabase = createClient();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "low" | "out">("all");
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [showModal, setShowModal] = useState(false);

  async function load() {
    setLoading(true);
    try {
      let query = supabase
        .from("products")
        .select("*")
        .order("stock", { ascending: true });

      const { data, error } = await query;

      if (error) {
        console.error("Erro ao carregar produtos:", error);
        setProducts([]);
      } else {
        setProducts(data || []);
      }
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filteredProducts = products.filter((p) => {
    const matchesSearch = 
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category?.toLowerCase().includes(search.toLowerCase());
    
    if (!matchesSearch) return false;

    if (filter === "low") return p.stock > 0 && p.stock <= 10;
    if (filter === "out") return p.stock <= 0;
    return true;
  });

  const stats = {
    total: products.reduce((sum, p) => sum + (p.stock || 0), 0),
    lowStock: products.filter((p) => p.stock > 0 && p.stock <= 10).length,
    outOfStock: products.filter((p) => p.stock <= 0).length,
    totalProducts: products.length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Controle de Estoque</h1>
        <p className="text-gray-600 mt-1">Gerencie o estoque dos seus produtos</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600">Total em Estoque</div>
              <div className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</div>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <Box className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600">Estoque Baixo</div>
              <div className="text-2xl font-bold text-yellow-600 mt-1">{stats.lowStock}</div>
            </div>
            <div className="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center">
              <TrendingDown className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600">Esgotados</div>
              <div className="text-2xl font-bold text-red-600 mt-1">{stats.outOfStock}</div>
            </div>
            <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600">Total de Produtos</div>
              <div className="text-2xl font-bold text-gray-900 mt-1">{stats.totalProducts}</div>
            </div>
            <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center">
              <Package className="h-6 w-6 text-gray-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar produtos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg border transition-colors ${
                filter === "all"
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setFilter("low")}
              className={`px-4 py-2 rounded-lg border transition-colors flex items-center gap-2 ${
                filter === "low"
                  ? "bg-yellow-100 text-yellow-800 border-yellow-300"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
            >
              <TrendingDown className="h-4 w-4" />
              Estoque Baixo
            </button>
            <button
              onClick={() => setFilter("out")}
              className={`px-4 py-2 rounded-lg border transition-colors flex items-center gap-2 ${
                filter === "out"
                  ? "bg-red-100 text-red-800 border-red-300"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
            >
              <AlertCircle className="h-4 w-4" />
              Esgotados
            </button>
          </div>
        </div>
      </div>

      {/* Products List */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">Carregando...</div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
          <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600">
            {search ? "Nenhum produto encontrado" : "Nenhum produto cadastrado ainda"}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-sm text-gray-600">
            Mostrando {filteredProducts.length} de {products.length} produtos
          </div>
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Produto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Categoria
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estoque Atual
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Valor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredProducts.map((p) => {
                    const isLow = p.stock > 0 && p.stock <= 10;
                    const isOut = p.stock <= 0;
                    const firstImage = Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : null;
                    return (
                      <tr key={p.id} className={`hover:bg-gray-50 transition-colors ${isOut ? 'opacity-60' : ''}`}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            {firstImage ? (
                              <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                                <Image 
                                  src={firstImage} 
                                  alt={p.name} 
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            ) : (
                              <div className="w-16 h-16 rounded-lg bg-gray-200 flex items-center justify-center flex-shrink-0">
                                <Package className="h-6 w-6 text-gray-400" />
                              </div>
                            )}
                            <div className="font-medium text-gray-900">{p.name}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            {p.category || "Sem categoria"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-2">
                            <div className={`font-bold text-lg flex items-center gap-2 ${
                              isOut ? "text-red-600" : isLow ? "text-yellow-600" : "text-gray-900"
                            }`}>
                              {isOut ? (
                                <>
                                  <AlertCircle className="h-5 w-5" />
                                  {p.stock || 0} un.
                                </>
                              ) : isLow ? (
                                <>
                                  <TrendingDown className="h-5 w-5" />
                                  {p.stock || 0} un.
                                </>
                              ) : (
                                <>
                                  <TrendingUp className="h-5 w-5" />
                                  {p.stock || 0} un.
                                </>
                              )}
                            </div>
                            {p.variations?.sizes && Array.isArray(p.variations.sizes) && p.variations.sizes.length > 0 && (
                              <div className="flex flex-wrap gap-1.5">
                                {p.variations.sizes.map((size: any, idx: number) => (
                                  <div
                                    key={idx}
                                    className={`text-xs px-2 py-1 rounded-md font-medium ${
                                      size.stock <= 0
                                        ? "bg-red-100 text-red-700"
                                        : size.stock <= 3
                                        ? "bg-yellow-100 text-yellow-700"
                                        : "bg-gray-100 text-gray-700"
                                    }`}
                                  >
                                    {size.size}: {size.stock}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {isOut ? (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              Esgotado
                            </span>
                          ) : isLow ? (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              Estoque Baixo
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              OK
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-semibold text-gray-900">
                            {formatCurrencyBRL(p.price)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => {
                              setSelectedProduct(p);
                              setShowModal(true);
                            }}
                            className="p-2 text-gray-600 hover:bg-gray-100 hover:text-primary rounded-lg transition-colors"
                            title="Ver detalhes"
                          >
                            <Eye className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Product Details Modal */}
      {showModal && selectedProduct && (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" style={{ minHeight: '100vh', minWidth: '100vw' }} onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-8">
              <div className="flex items-start justify-between mb-8">
                <h2 className="text-3xl font-bold text-gray-900">Detalhes do Estoque</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600"
                  aria-label="Fechar"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  {Array.isArray(selectedProduct.images) && selectedProduct.images.length > 0 ? (
                    <div className="relative w-full aspect-square rounded-2xl overflow-hidden border-2 border-gray-100 shadow-lg">
                      <Image 
                        src={selectedProduct.images[0]} 
                        alt={selectedProduct.name} 
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-full aspect-square rounded-2xl bg-gray-100 flex items-center justify-center border-2 border-gray-200">
                      <Package className="h-24 w-24 text-gray-300" />
                    </div>
                  )}
                </div>

                <div className="space-y-5">
                  <div>
                    <div className="text-sm font-medium text-gray-500 mb-2">Nome do Produto</div>
                    <div className="text-2xl font-bold text-gray-900">{selectedProduct.name}</div>
                  </div>

                  {selectedProduct.category && (
                    <div>
                      <div className="text-sm font-medium text-gray-500 mb-2">Categoria</div>
                      <span className="inline-block px-3 py-1.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-semibold">
                        {selectedProduct.category}
                      </span>
                    </div>
                  )}

                  <div>
                    <div className="text-sm font-medium text-gray-500 mb-2">Preço</div>
                    <div className="text-3xl font-bold" style={{ color: '#fc0055' }}>
                      {formatCurrencyBRL(selectedProduct.price)}
                    </div>
                  </div>

                  <div className="rounded-2xl p-5" style={{ backgroundColor: '#ffe472' }}>
                    <div className="text-sm font-semibold mb-2" style={{ color: '#fc0055' }}>
                      Estoque Total
                    </div>
                    <div className={`text-4xl font-black ${
                      selectedProduct.stock <= 0 ? "text-red-600" : 
                      selectedProduct.stock <= 10 ? "text-orange-600" : 
                      "text-gray-900"
                    }`}>
                      {selectedProduct.stock || 0}
                    </div>
                    <div className="text-sm font-medium text-gray-700 mt-1">
                      unidades disponíveis
                    </div>
                  </div>

                  {/* Estoque por Tamanho */}
                  {selectedProduct.variations?.sizes && Array.isArray(selectedProduct.variations.sizes) && selectedProduct.variations.sizes.length > 0 && (
                    <div className="bg-gray-50 rounded-2xl p-5">
                      <div className="text-sm font-semibold text-gray-700 mb-4">
                        📏 Estoque por Tamanho
                      </div>
                      <div className="space-y-3">
                        {selectedProduct.variations.sizes.map((size: any, idx: number) => {
                          const percentage = selectedProduct.stock > 0 ? (size.stock / selectedProduct.stock) * 100 : 0;
                          const isLowSize = size.stock > 0 && size.stock <= 3;
                          const isOutSize = size.stock <= 0;
                          
                          return (
                            <div key={idx} className="bg-white rounded-xl p-3 shadow-sm">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                  <span 
                                    className="text-sm font-black text-white px-3 py-1.5 rounded-lg min-w-[50px] text-center"
                                    style={{ backgroundColor: '#fc0055' }}
                                  >
                                    {size.size}
                                  </span>
                                  <span className={`text-lg font-bold ${
                                    isOutSize ? "text-red-600" : 
                                    isLowSize ? "text-orange-600" : 
                                    "text-gray-900"
                                  }`}>
                                    {size.stock} un.
                                  </span>
                                </div>
                                <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded-lg">
                                  {percentage.toFixed(0)}%
                                </span>
                              </div>
                              <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                                <div 
                                  className="h-full rounded-full transition-all"
                                  style={{ 
                                    width: `${percentage}%`,
                                    backgroundColor: isOutSize ? '#ef4444' : isLowSize ? '#f97316' : '#fc0055'
                                  }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {selectedProduct.description && (
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Descrição</div>
                      <div className="text-gray-700">{selectedProduct.description}</div>
                    </div>
                  )}

                  {selectedProduct.featured && (
                    <div className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-lg text-sm font-medium">
                      Produto em destaque
                    </div>
                  )}
                </div>
              </div>

              {Array.isArray(selectedProduct.images) && selectedProduct.images.length > 1 && (
                <div className="mt-6">
                  <div className="text-sm text-gray-500 mb-3">Outras imagens</div>
                  <div className="grid grid-cols-4 gap-3">
                    {selectedProduct.images.slice(1, 5).map((img: string, idx: number) => (
                      <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200">
                        <Image src={img} alt={`${selectedProduct.name} - Imagem ${idx + 2}`} fill className="object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

