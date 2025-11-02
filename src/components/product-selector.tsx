"use client";
import { useState, useEffect } from "react";
import { Search, Plus, X, ShoppingCart } from "lucide-react";
import { createClient } from "@/lib/supabaseClient";
import { formatCurrencyBRL } from "@/lib/utils";
import Image from "next/image";

interface Product {
  id: string;
  name: string;
  price: number;
  images?: string[];
  stock?: number;
  category?: string;
  variations?: {
    sizes?: { size: string; stock: number }[];
  };
}

interface SelectedProduct extends Product {
  quantity: number;
  selectedSize?: string;
}

interface ProductSelectorProps {
  value: SelectedProduct[];
  onChange: (products: SelectedProduct[]) => void;
}

export function ProductSelector({ value = [], onChange }: ProductSelectorProps) {
  const supabase = createClient();
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [showSelector, setShowSelector] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>(value);
  const [selectingSizeFor, setSelectingSizeFor] = useState<Product | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    onChange(selectedProducts);
  }, [selectedProducts]);

  async function loadProducts() {
    const { data } = await supabase
      .from("products")
      .select("id, name, price, images, stock, category, variations")
      .order("name", { ascending: true });
    setProducts(data || []);
  }

  function addProduct(product: Product) {
    // Verifica se o produto tem estoque
    if (product.stock !== undefined && product.stock <= 0) {
      alert(`Produto "${product.name}" está fora de estoque`);
      return;
    }

    // Se o produto tem variações de tamanho, mostra seletor
    if (product.variations?.sizes && product.variations.sizes.length > 0) {
      setSelectingSizeFor(product);
      return;
    }

    // Se não tem tamanhos, adiciona diretamente
    addProductWithSize(product, undefined);
  }

  function addProductWithSize(product: Product, size?: string) {
    const existingIndex = selectedProducts.findIndex(
      p => p.id === product.id && p.selectedSize === size
    );
    
    if (existingIndex >= 0) {
      // Se já existe com mesmo tamanho, incrementa quantidade
      const updated = [...selectedProducts];
      updated[existingIndex].quantity += 1;
      setSelectedProducts(updated);
    } else {
      // Se não existe, adiciona
      setSelectedProducts([...selectedProducts, { ...product, quantity: 1, selectedSize: size }]);
    }
    
    setShowSelector(false);
    setSelectingSizeFor(null);
    setSearch("");
  }

  function updateQuantity(productId: string, newQuantity: number) {
    if (newQuantity <= 0) {
      removeProduct(productId);
      return;
    }
    
    // Verifica se não excede o estoque disponível
    const product = products.find(p => p.id === productId);
    if (product && product.stock !== undefined && newQuantity > product.stock) {
      alert(`Estoque insuficiente. Disponível: ${product.stock}`);
      return;
    }
    
    const updated = selectedProducts.map(p =>
      p.id === productId ? { ...p, quantity: newQuantity } : p
    );
    setSelectedProducts(updated);
  }

  function removeProduct(productId: string, size?: string) {
    setSelectedProducts(selectedProducts.filter(p => !(p.id === productId && p.selectedSize === size)));
  }

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.toLowerCase().includes(search.toLowerCase())
  );

  const total = selectedProducts.reduce((sum, p) => sum + (p.price * p.quantity), 0);

  return (
    <div className="space-y-4">
      {/* Button to open selector */}
      <button
        type="button"
        onClick={() => setShowSelector(true)}
        className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-primary hover:bg-gray-50 transition-colors"
      >
        <Plus className="h-5 w-5 text-primary" />
        <span className="font-medium text-gray-700">Adicionar Produtos</span>
      </button>

      {/* Selected Products */}
      {selectedProducts.length > 0 && (
        <div className="space-y-3">
          {selectedProducts.map((p) => {
            const firstImage = Array.isArray(p.images) && p.images[0] ? p.images[0] : null;
            return (
              <div key={p.id} className="flex items-center gap-4 bg-gray-50 rounded-lg p-3 border border-gray-200">
                {firstImage ? (
                  <Image src={firstImage} alt={p.name} width={60} height={60} className="rounded-lg object-cover" />
                ) : (
                  <div className="w-[60px] h-[60px] bg-gray-200 rounded-lg flex items-center justify-center">
                    <ShoppingCart className="h-6 w-6 text-gray-400" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 truncate">{p.name}</div>
                  {p.selectedSize && (
                    <div className="text-xs font-semibold px-2 py-0.5 rounded mt-1 inline-block" style={{ backgroundColor: '#ffe472', color: '#fc0055' }}>
                      Tamanho: {p.selectedSize}
                    </div>
                  )}
                  <div className="text-sm text-primary font-semibold mt-1">{formatCurrencyBRL(p.price)}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => updateQuantity(p.id, p.quantity - 1)}
                    className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span className="w-12 text-center font-medium">{p.quantity}</span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(p.id, p.quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => removeProduct(p.id, p.selectedSize)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            );
          })}
          
          {/* Total */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-200">
            <span className="font-semibold text-gray-900">Total:</span>
            <span className="text-xl font-bold text-primary">{formatCurrencyBRL(total)}</span>
          </div>
        </div>
      )}

      {/* Product Selector Modal */}
      {showSelector && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowSelector(false)}>
          <div className="bg-white rounded-xl w-full max-w-3xl max-h-[80vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Selecionar Produtos</h3>
                <button
                  onClick={() => setShowSelector(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar produtos..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="overflow-y-auto max-h-[calc(80vh-200px)] p-6">
              {filteredProducts.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  {search ? "Nenhum produto encontrado" : "Nenhum produto cadastrado"}
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {filteredProducts.map((p) => {
                    const firstImage = Array.isArray(p.images) && p.images[0] ? p.images[0] : null;
                    const outOfStock = p.stock !== undefined && p.stock <= 0;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => addProduct(p)}
                        disabled={outOfStock}
                        className={`text-left border rounded-lg overflow-hidden transition-all ${
                          outOfStock
                            ? "border-gray-200 opacity-50 cursor-not-allowed bg-gray-50"
                            : "border-gray-200 hover:border-primary hover:shadow-md"
                        }`}
                      >
                        {firstImage ? (
                          <div className="relative">
                            <Image src={firstImage} alt={p.name} width={200} height={200} className="w-full h-32 object-cover" />
                            {outOfStock && (
                              <div className="absolute inset-0 bg-gray-900/60 flex items-center justify-center">
                                <span className="text-white text-xs font-semibold bg-red-600 px-2 py-1 rounded">
                                  Sem Estoque
                                </span>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className={`w-full h-32 flex items-center justify-center ${outOfStock ? "bg-gray-100" : "bg-gray-50"}`}>
                            <ShoppingCart className="h-8 w-8 text-gray-300" />
                          </div>
                        )}
                        <div className="p-3">
                          <div className="font-medium text-sm text-gray-900 truncate">{p.name}</div>
                          <div className="text-primary font-semibold">{formatCurrencyBRL(p.price)}</div>
                          {p.stock !== undefined && (
                            <div className={`text-xs mt-1 ${outOfStock ? "text-red-600 font-semibold" : "text-gray-500"}`}>
                              Estoque: {p.stock}
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Size Selector Modal */}
      {selectingSizeFor && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" style={{ minHeight: '100vh', minWidth: '100vw' }} onClick={() => setSelectingSizeFor(null)}>
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-8">
              <div className="flex items-start justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Selecionar Tamanho</h3>
                <button
                  onClick={() => setSelectingSizeFor(null)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="mb-6">
                <div className="font-medium text-gray-900 mb-2">{selectingSizeFor.name}</div>
                <div className="text-primary font-bold text-xl">{formatCurrencyBRL(selectingSizeFor.price)}</div>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium text-gray-700 mb-3">Tamanhos Disponíveis:</div>
                {selectingSizeFor.variations?.sizes?.map((sizeOption) => {
                  const isAvailable = sizeOption.stock > 0;
                  return (
                    <button
                      key={sizeOption.size}
                      type="button"
                      onClick={() => isAvailable && addProductWithSize(selectingSizeFor, sizeOption.size)}
                      disabled={!isAvailable}
                      className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                        isAvailable
                          ? 'border-gray-200 hover:border-primary hover:bg-gray-50 cursor-pointer'
                          : 'border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span 
                            className="text-sm font-black text-white px-3 py-1.5 rounded-lg min-w-[50px] text-center"
                            style={{ backgroundColor: isAvailable ? '#fc0055' : '#999' }}
                          >
                            {sizeOption.size}
                          </span>
                          <span className={`text-sm font-semibold ${isAvailable ? 'text-gray-900' : 'text-gray-400'}`}>
                            {isAvailable ? `${sizeOption.stock} disponíveis` : 'Esgotado'}
                          </span>
                        </div>
                        {isAvailable && (
                          <Plus className="h-5 w-5" style={{ color: '#fc0055' }} />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
