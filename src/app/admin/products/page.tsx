"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabaseClient";
import { formatCurrencyBRL } from "@/lib/utils";
import { Plus, Search, Edit, Trash2, Package, Image as ImageIcon, Star, ThumbsUp, Info, AlertCircle, CheckCircle2, Sparkles, X } from "lucide-react";
import { ImageUpload } from "@/components/image-upload";

interface ProductForm {
  name: string;
  description: string;
  price: string;
  category: string;
  stock: string;
  featured: boolean;
  images: string[];
  variations: { size: string; color: string; imageUrl: string; stock: number | string }[];
  rating: string;
  likes: string;
}

export default function AdminProductsPage() {
  const supabase = createClient();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [productLoading, setProductLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [deleteModal, setDeleteModal] = useState<{ show: boolean; productId: string; productName: string }>({
    show: false,
    productId: "",
    productName: ""
  });
  
  const [form, setForm] = useState<ProductForm>({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "0",
    featured: false,
    images: [],
    variations: [],
    rating: "0",
    likes: "0"
  });

  async function load() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { 
    load(); 
  }, []);

  async function saveProduct(e: React.FormEvent) {
    e.preventDefault();
    setProductLoading(true);

    try {
      // Calcular estoque total baseado nas variações
      const totalStock = form.variations.length > 0
        ? form.variations.reduce((sum, v) => {
            const stockValue = typeof v.stock === 'string' ? (v.stock === '' ? 0 : Number(v.stock)) : v.stock;
            return sum + (stockValue || 0);
          }, 0)
        : Number(form.stock || 0);

      const productData = {
        name: form.name,
        description: form.description || null,
        price: Number(form.price),
        category: form.category || null,
        stock: totalStock,
        featured: !!form.featured,
        images: form.images.length > 0 ? form.images : null,
        variations: form.variations.length > 0 ? form.variations : null,
        rating: Number(form.rating) || 0,
        likes: Number(form.likes) || 0,
      };

      if (editing) {
        // Atualizar produto existente
        const { error } = await supabase
          .from("products")
          .update(productData)
          .eq("id", editing);

        if (error) throw error;
        alert("Produto atualizado com sucesso!");
      } else {
        // Criar novo produto
        const { error } = await supabase
          .from("products")
          .insert(productData);

        if (error) throw error;
        alert("Produto criado com sucesso!");
      }

      resetForm();
      await load();
    } catch (error: any) {
      alert("Erro: " + error.message);
    } finally {
      setProductLoading(false);
    }
  }

  function editProduct(product: any) {
    setEditing(product.id);
    setForm({
      name: product.name || "",
      description: product.description || "",
      price: product.price?.toString() || "",
      category: product.category || "",
      stock: product.stock?.toString() || "0",
      featured: !!product.featured,
      images: Array.isArray(product.images) ? product.images : [],
      variations: Array.isArray(product.variations) ? product.variations : [],
      rating: product.rating?.toString() || "0",
      likes: product.likes?.toString() || "0",
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function resetForm() {
    setEditing(null);
    setForm({
      name: "",
      description: "",
      price: "",
      category: "",
      stock: "0",
      featured: false,
      images: [],
      variations: [],
      rating: "0",
      likes: "0"
    });
    setShowForm(false);
  }

  function openDeleteModal(id: string, name: string) {
    setDeleteModal({ show: true, productId: id, productName: name });
  }

  function closeDeleteModal() {
    setDeleteModal({ show: false, productId: "", productName: "" });
  }

  async function confirmDelete() {
    try {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", deleteModal.productId);

      if (error) throw error;
      closeDeleteModal();
      await load();
    } catch (error: any) {
      alert("Erro ao excluir produto: " + error.message);
    }
  }

  function addVariation() {
    setForm({
      ...form,
      variations: [...form.variations, { size: "", color: "", imageUrl: "", stock: "" as any }]
    });
  }

  function removeVariation(index: number) {
    setForm({
      ...form,
      variations: form.variations.filter((_, i) => i !== index)
    });
  }

  function updateVariation(index: number, field: 'size' | 'color' | 'imageUrl' | 'stock', value: any) {
    const newVariations = [...form.variations];
    if (field === 'stock') {
      // Mantém como string vazia se estiver vazio, senão converte para número
      newVariations[index][field] = value === '' ? '' : value;
    } else {
      newVariations[index][field] = value;
    }
    setForm({ ...form, variations: newVariations });
  }

  // Calcular estoque total das variações (converte string vazia para 0)
  const totalStockFromVariations = form.variations.reduce((sum, v) => {
    const stockValue = typeof v.stock === 'string' ? (v.stock === '' ? 0 : Number(v.stock)) : v.stock;
    return sum + (stockValue || 0);
  }, 0);

  const filteredProducts = products.filter(p => 
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.toLowerCase().includes(search.toLowerCase()) ||
    p.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Modal de Confirmação de Exclusão */}
      {deleteModal.show && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in slide-in-from-bottom sm:zoom-in duration-200">
            {/* Header do Modal */}
            <div className="bg-gradient-to-r from-red-500 to-red-600 px-4 sm:px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <AlertCircle className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white">Confirmar Exclusão</h3>
                </div>
                <button
                  onClick={closeDeleteModal}
                  className="text-white/80 hover:text-white transition-colors p-1"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Conteúdo do Modal */}
            <div className="p-4 sm:p-6 space-y-4">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="bg-red-100 p-2 sm:p-3 rounded-full flex-shrink-0">
                  <Trash2 className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm sm:text-base text-gray-900 font-medium mb-3">
                    Tem certeza que deseja excluir este produto?
                  </p>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-3">
                    <p className="text-xs sm:text-sm text-gray-600">Produto:</p>
                    <p className="font-semibold text-sm sm:text-base text-gray-900 truncate">{deleteModal.productName}</p>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600">
                    ⚠️ Esta ação não pode ser desfeita. O produto será permanentemente removido do sistema.
                  </p>
                </div>
              </div>
            </div>

            {/* Botões de Ação */}
            <div className="bg-gray-50 px-4 sm:px-6 py-4 flex flex-col-reverse sm:flex-row gap-3">
              <button
                onClick={closeDeleteModal}
                className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-white transition-all font-medium text-base"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-3 rounded-lg hover:shadow-lg transition-all font-bold flex items-center justify-center gap-2 text-base"
              >
                <Trash2 className="h-4 w-4" />
                <span>Excluir</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Produtos</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">Gerencie seu catálogo de produtos</p>
        </div>
        <button
          onClick={() => {
            setShowForm(!showForm);
            if (showForm) resetForm();
          }}
          className="flex items-center justify-center gap-2 bg-primary text-white px-4 sm:px-6 py-3 sm:py-2 rounded-lg hover:bg-primary/90 transition-colors font-medium text-base sm:text-sm w-full sm:w-auto"
        >
          <Plus className="h-5 w-5" />
          <span>{showForm ? 'Cancelar' : 'Novo Produto'}</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar produtos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-base"
        />
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden">
          {/* Header do Form */}
          <div className="bg-gradient-to-r from-primary to-primary/80 px-4 sm:px-6 py-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <div className="bg-white/20 p-2 rounded-lg flex-shrink-0">
                  <Package className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-base sm:text-xl font-bold text-white truncate">
                    {editing ? "Editar Produto" : "Novo Produto"}
                  </h2>
                  <p className="text-white/80 text-xs sm:text-sm hidden sm:block">
                    {editing ? "Atualize as informações do produto" : "Preencha os dados para criar um novo produto"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={resetForm}
                className="text-white/80 hover:text-white transition-colors p-1 flex-shrink-0"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          <form onSubmit={saveProduct} className="p-4 sm:p-6 space-y-6">
            {/* Seção 1: Informações Básicas */}
            <div className="bg-white rounded-xl border-2 border-gray-200 p-4 sm:p-5 space-y-4">
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <Info className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                </div>
                <h3 className="font-semibold text-base sm:text-lg text-gray-900">Informações Básicas</h3>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  Nome do Produto
                  <span className="text-red-500">*</span>
                </label>
                <input
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary transition-all text-base"
                  placeholder="Ex: Vestido Floral Longo"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
                {form.name && (
                  <div className="flex items-center gap-1 mt-1 text-xs text-green-600">
                    <CheckCircle2 className="h-3 w-3" />
                    Nome definido
                  </div>
                )}
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  Descrição do Produto
                  <span className="text-gray-400 text-xs">(opcional)</span>
                </label>
                <textarea
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary transition-all resize-none text-base"
                  placeholder="Descreva os detalhes, características e benefícios do produto..."
                  rows={4}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>💡 Descrições detalhadas ajudam a vender mais</span>
                  <span>{form.description.length} caracteres</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    Preço (R$)
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">R$</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      className="w-full border-2 border-gray-300 rounded-lg pl-12 pr-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary transition-all text-base font-medium"
                      placeholder="149.90"
                      value={form.price}
                      onChange={(e) => setForm({ ...form, price: e.target.value })}
                      required
                    />
                  </div>
                  {form.price && Number(form.price) > 0 && (
                    <div className="flex items-center gap-1 mt-1 text-xs text-green-600">
                      <CheckCircle2 className="h-3 w-3" />
                      {formatCurrencyBRL(Number(form.price))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    Categoria
                    <span className="text-gray-400 text-xs">(opcional)</span>
                  </label>
                  <input
                    className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary transition-all text-base"
                    placeholder="Ex: Vestidos, Bolsas, Acessórios"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    📁 Facilita a organização e filtros
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-primary/5 to-transparent rounded-lg border-l-4 border-primary">
                <Sparkles className="h-5 w-5 text-primary flex-shrink-0" />
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                    className="rounded border-gray-300 text-primary focus:ring-primary w-5 h-5"
                  />
                  <span className="text-sm font-medium text-gray-900">
                    Produto em Destaque
                    <span className="block text-xs text-gray-600 font-normal">
                      Produtos em destaque aparecem primeiro na página inicial
                    </span>
                  </span>
                </label>
              </div>
            </div>

            {/* Seção 2: Avaliações e Engajamento */}
            <div className="bg-white rounded-xl border-2 border-gray-200 p-4 sm:p-5 space-y-4">
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <div className="bg-yellow-100 p-2 rounded-lg">
                  <Star className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-base sm:text-lg text-gray-900">Avaliações</h3>
                  <p className="text-xs text-gray-600 hidden sm:block">Define como o produto aparecerá na loja</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-yellow-50 to-white p-4 rounded-lg border-2 border-yellow-200">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                    <Star className="h-4 w-4 text-yellow-600" />
                    Avaliação (Rating)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    className="w-full border-2 border-yellow-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all text-base font-medium text-center"
                    placeholder="4.5"
                    value={form.rating}
                    onChange={(e) => setForm({ ...form, rating: e.target.value })}
                  />
                  <div className="flex items-center justify-between mt-2 text-xs text-gray-600">
                    <span>0.0</span>
                    <span className="font-medium">⭐ Valor de 0.0 a 5.0</span>
                    <span>5.0</span>
                  </div>
                  {form.rating && Number(form.rating) > 0 && (
                    <div className="mt-3 flex items-center justify-center gap-1 text-yellow-700 font-bold">
                      <Star className="h-4 w-4 fill-current" />
                      {Number(form.rating).toFixed(1)}
                    </div>
                  )}
                </div>

                <div className="bg-gradient-to-br from-red-50 to-white p-4 rounded-lg border-2 border-red-200">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                    <ThumbsUp className="h-4 w-4 text-red-600" />
                    Curtidas (Likes)
                  </label>
                  <input
                    type="number"
                    min="0"
                    className="w-full border-2 border-red-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all text-base font-medium text-center"
                    placeholder="150"
                    value={form.likes}
                    onChange={(e) => setForm({ ...form, likes: e.target.value })}
                  />
                  <div className="mt-2 text-xs text-gray-600 text-center">
                    👍 Número de curtidas que o produto recebeu
                  </div>
                  {form.likes && Number(form.likes) > 0 && (
                    <div className="mt-3 flex items-center justify-center gap-1 text-red-700 font-bold">
                      <ThumbsUp className="h-4 w-4" />
                      {Number(form.likes)}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-blue-900">
                  <strong>Dica:</strong> Produtos com boa avaliação e muitas curtidas aparecem melhor posicionados e ganham mais visibilidade na loja.
                </p>
              </div>
            </div>

            {/* Seção 3: Imagens */}
            <div className="bg-white rounded-xl border-2 border-gray-200 p-4 sm:p-5 space-y-4">
              <div className="flex items-center justify-between mb-3 sm:mb-4 gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="bg-purple-100 p-2 rounded-lg flex-shrink-0">
                    <ImageIcon className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-base sm:text-lg text-gray-900">Imagens</h3>
                    <p className="text-xs text-gray-600 truncate">
                      {form.images.length === 0 
                        ? "Adicione imagens" 
                        : `${form.images.length} ${form.images.length === 1 ? 'imagem' : 'imagens'}`
                      }
                    </p>
                  </div>
                </div>
                {form.images.length > 0 && (
                  <div className="flex items-center gap-1 text-xs sm:text-sm text-green-600 font-medium flex-shrink-0">
                    <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">{form.images.length}/10</span>
                  </div>
                )}
              </div>
              
              <ImageUpload
                value={form.images}
                onChange={(urls) => setForm({ ...form, images: urls })}
                maxImages={10}
              />

              {form.images.length === 0 && (
                <div className="flex items-start gap-2 p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <AlertCircle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-orange-900">
                    <strong>Importante:</strong> Produtos com imagens de qualidade vendem muito mais! Adicione fotos bem iluminadas e de diferentes ângulos.
                  </p>
                </div>
              )}
            </div>

            {/* Seção 4: Estoque e Variações */}
            <div className="bg-white rounded-xl border-2 border-gray-200 p-4 sm:p-5 space-y-4">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="bg-blue-100 p-2 rounded-lg flex-shrink-0">
                    <Package className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-base sm:text-lg text-gray-900">Estoque</h3>
                    <p className="text-xs text-gray-600 truncate">
                      {form.variations.length === 0 
                        ? "Configure o estoque" 
                        : `${form.variations.length} ${form.variations.length === 1 ? 'variação' : 'variações'}`
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* Estoque Simples */}
              {form.variations.length === 0 && (
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    Quantidade em Estoque
                  </label>
                  <input
                    type="number"
                    min="0"
                    className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary transition-all text-base font-medium"
                    placeholder="Ex: 10 unidades"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    📦 Quantidade total disponível para venda
                  </div>
                </div>
              )}

              {/* Botão Adicionar Variações */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center">
                  <button
                    type="button"
                    onClick={addVariation}
                    className="bg-white px-4 py-2 border-2 border-primary text-primary hover:bg-primary hover:text-white rounded-lg transition-all flex items-center gap-2 font-medium shadow-sm"
                  >
                    <Plus className="h-4 w-4" />
                    {form.variations.length === 0 ? 'Adicionar Variações (Tamanho/Cor)' : 'Adicionar Mais uma Variação'}
                  </button>
                </div>
              </div>

              {/* Lista de Variações */}
              {form.variations.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600 bg-blue-50 p-3 rounded-lg border border-blue-200">
                    <Info className="h-4 w-4 text-blue-600" />
                    <span>O estoque total será calculado automaticamente pela soma de todas as variações</span>
                  </div>

                  {form.variations.map((variation, idx) => (
                    <div key={idx} className="bg-gradient-to-r from-blue-50 to-white border-2 border-blue-200 rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow">
                      <div className="space-y-3">
                        {/* Linha 1: Tamanho e Cor */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Tamanho #{idx + 1}
                            </label>
                            <input
                              className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-base font-medium"
                              placeholder="Ex: P, M, G, GG"
                              value={variation.size}
                              onChange={(e) => updateVariation(idx, 'size', e.target.value)}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Cor
                            </label>
                            <input
                              className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-base font-medium"
                              placeholder="Ex: Preto, Branco, Rosa"
                              value={variation.color}
                              onChange={(e) => updateVariation(idx, 'color', e.target.value)}
                            />
                          </div>
                        </div>

                        {/* Linha 2: Seletor de Imagem para a Cor */}
                        {variation.color && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              📸 Imagem da cor "{variation.color}"
                            </label>
                            
                            {form.images.length > 0 ? (
                              <>
                                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                                  {form.images.map((img, imgIdx) => (
                                    <button
                                      key={imgIdx}
                                      type="button"
                                      onClick={() => updateVariation(idx, 'imageUrl', img)}
                                      className={`
                                        relative aspect-square rounded-lg overflow-hidden border-2 transition-all
                                        ${variation.imageUrl === img 
                                          ? 'border-purple-500 ring-2 ring-purple-300 scale-105 shadow-lg' 
                                          : 'border-gray-200 hover:border-purple-300 hover:shadow-md'
                                        }
                                      `}
                                      title={`Selecionar imagem ${imgIdx + 1} para ${variation.color}`}
                                    >
                                      <img 
                                        src={img} 
                                        alt={`Opção ${imgIdx + 1}`}
                                        className="w-full h-full object-cover"
                                      />
                                      {variation.imageUrl === img && (
                                        <div className="absolute inset-0 bg-purple-500/20 flex items-center justify-center">
                                          <CheckCircle2 className="h-6 w-6 text-purple-600 bg-white rounded-full shadow-md" />
                                        </div>
                                      )}
                                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-1">
                                        <p className="text-xs text-white text-center font-medium">#{imgIdx + 1}</p>
                                      </div>
                                    </button>
                                  ))}
                                </div>
                                {variation.imageUrl && (
                                  <p className="text-xs text-purple-600 mt-2 flex items-center gap-1 font-medium">
                                    <CheckCircle2 className="h-3 w-3" />
                                    Imagem selecionada para {variation.color}
                                  </p>
                                )}
                              </>
                            ) : (
                              <div className="flex items-start gap-2 p-3 bg-orange-50 rounded-lg border border-orange-200">
                                <AlertCircle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                                <p className="text-xs text-orange-900">
                                  <strong>Adicione imagens primeiro!</strong> Vá até a seção "Imagens do Produto" acima e faça upload das fotos antes de associar cores.
                                </p>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Linha 3: Quantidade e Botão Remover */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:items-end">
                          <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Quantidade em Estoque
                            </label>
                            <input
                              type="number"
                              min="0"
                              className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-base font-medium"
                              placeholder="Digite a quantidade"
                              value={variation.stock}
                              onChange={(e) => updateVariation(idx, 'stock', e.target.value)}
                            />
                          </div>
                          <div>
                            <button
                              type="button"
                              onClick={() => removeVariation(idx)}
                              className="w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center justify-center gap-2 border-2 border-red-200 hover:border-red-300 font-medium"
                              title="Remover variação"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span>Remover</span>
                            </button>
                          </div>
                        </div>

                        {/* Preview da variação */}
                        {(variation.size || variation.color || variation.imageUrl) && (
                          <div className="flex items-start gap-3 pt-2 border-t border-blue-200">
                            <div className="flex-1">
                              <span className="text-xs text-gray-600 block mb-2">Preview:</span>
                              <div className="flex flex-wrap items-center gap-2">
                                {variation.size && (
                                  <span className="text-xs bg-white border border-blue-300 text-blue-700 px-2 py-1 rounded font-medium">
                                    {variation.size}
                                  </span>
                                )}
                                {variation.color && (
                                  <span className="text-xs bg-white border border-purple-300 text-purple-700 px-2 py-1 rounded font-medium">
                                    {variation.color}
                                  </span>
                                )}
                                {variation.stock && Number(variation.stock) > 0 && (
                                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded font-medium">
                                    {variation.stock} un.
                                  </span>
                                )}
                              </div>
                            </div>
                            {variation.imageUrl && (
                              <div className="flex-shrink-0">
                                <img 
                                  src={variation.imageUrl} 
                                  alt={`Preview ${variation.color}`}
                                  className="w-16 h-16 object-cover rounded-lg border-2 border-purple-300"
                                />
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {/* Resumo do Estoque */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="bg-green-500 p-2 rounded-lg">
                          <Package className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <div className="text-sm text-green-800 font-medium">Estoque Total Calculado</div>
                          <div className="text-xs text-green-700">
                            Soma de todos os tamanhos configurados
                          </div>
                        </div>
                      </div>
                      <div className="text-3xl font-bold text-green-900">
                        {totalStockFromVariations}
                        <span className="text-sm font-normal ml-1">un.</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Botões de Ação - Fixos no final */}
            <div className="sticky bottom-0 bg-white border-t-2 border-gray-200 -mx-4 sm:-mx-6 -mb-4 sm:-mb-6 px-4 sm:px-6 py-4 rounded-b-2xl">
              <div className="flex flex-col-reverse sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={resetForm}
                  disabled={productLoading}
                  className="sm:flex-none px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all disabled:opacity-50 font-medium text-base"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={productLoading || !form.name || !form.price}
                  className="flex-1 bg-gradient-to-r from-primary to-primary/90 text-white px-6 py-3.5 sm:py-3 rounded-lg hover:shadow-lg transition-all font-bold text-base sm:text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {productLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Salvando...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-5 w-5" />
                      <span>{editing ? "Atualizar" : "Criar Produto"}</span>
                    </>
                  )}
                </button>
              </div>
              
              {(!form.name || !form.price) && (
                <div className="flex items-center gap-2 mt-3 text-xs sm:text-sm text-orange-600">
                  <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>Preencha os campos obrigatórios (*)</span>
                </div>
              )}
            </div>
          </form>
        </div>
      )}

      {/* Products List */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">Carregando produtos...</div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
          <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600">
            {search ? "Nenhum produto encontrado com os filtros aplicados" : "Nenhum produto cadastrado ainda"}
          </p>
          {!search && !showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 text-primary hover:text-primary/80 font-medium"
            >
              Adicionar seu primeiro produto
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-xs sm:text-sm text-gray-600 px-1">
            {filteredProducts.length} de {products.length} produtos
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {filteredProducts.map((product) => {
              const firstImage = Array.isArray(product.images) && product.images.length > 0 
                ? product.images[0] 
                : null;
              
              return (
                <div 
                  key={product.id} 
                  className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all"
                >
                  {firstImage ? (
                    <img 
                      src={firstImage} 
                      alt={product.name} 
                      className="w-full h-40 sm:h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-40 sm:h-48 bg-gray-100 flex items-center justify-center">
                      <ImageIcon className="h-10 w-10 sm:h-12 sm:w-12 text-gray-300" />
                    </div>
                  )}
                  
                  <div className="p-3 sm:p-4">
                    <div className="flex items-start justify-between mb-2 gap-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm sm:text-base text-gray-900 truncate">{product.name}</h3>
                        {product.description && (
                          <p className="text-xs text-gray-500 mt-1 line-clamp-2 hidden sm:block">
                            {product.description}
                          </p>
                        )}
                      </div>
                      {product.featured && (
                        <span className="text-xs bg-primary text-white px-2 py-1 rounded whitespace-nowrap flex-shrink-0">
                          Destaque
                        </span>
                      )}
                    </div>

                    <div className="mt-2 flex flex-wrap gap-1.5 items-center">
                      {product.category && (
                        <span className="inline-block text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                          {product.category}
                        </span>
                      )}

                      {product.rating > 0 && (
                        <span className="inline-flex items-center gap-1 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                          <Star className="h-3 w-3 fill-current" />
                          {product.rating.toFixed(1)}
                        </span>
                      )}

                      {product.likes > 0 && (
                        <span className="inline-flex items-center gap-1 text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                          <ThumbsUp className="h-3 w-3" />
                          {product.likes}
                        </span>
                      )}
                    </div>

                    {Array.isArray(product.variations) && product.variations.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {product.variations.slice(0, 3).map((v: any, i: number) => (
                          <span key={i} className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded">
                            {v.size}{v.color && ` - ${v.color}`} ({v.stock})
                          </span>
                        ))}
                        {product.variations.length > 3 && (
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                            +{product.variations.length - 3}
                          </span>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-3 sm:mt-4 pt-3 border-t border-gray-100 gap-2">
                      <div className="min-w-0">
                        <div className="text-base sm:text-lg font-bold text-primary truncate">
                          {formatCurrencyBRL(product.price)}
                        </div>
                        <div className="text-xs text-gray-500">
                          Estoque: {product.stock || 0}
                        </div>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <button
                          onClick={() => editProduct(product)}
                          className="p-2.5 sm:p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors touch-manipulation"
                          title="Editar produto"
                        >
                          <Edit className="h-5 w-5 sm:h-4 sm:w-4" />
                        </button>
                        <button
                          onClick={() => openDeleteModal(product.id, product.name)}
                          className="p-2.5 sm:p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors touch-manipulation"
                          title="Excluir produto"
                        >
                          <Trash2 className="h-5 w-5 sm:h-4 sm:w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
