"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabaseClient";
import { formatCurrencyBRL } from "@/lib/utils";
import { Plus, Search, Edit, Trash2, Package } from "lucide-react";

export default function AdminProductsPage() {
  const supabase = createClient();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", price: "", category: "", stock: "0", featured: false, images: "" });
  const [search, setSearch] = useState("");

  async function load() {
    setLoading(true);
    const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    setProducts(data || []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function createProduct(e: React.FormEvent) {
    e.preventDefault();
    const images = form.images ? form.images.split(",").map((s) => s.trim()).filter(Boolean) : [];
    const { error } = await supabase.from("products").insert({
      name: form.name,
      price: Number(form.price),
      category: form.category || null,
      stock: Number(form.stock || 0),
      featured: !!form.featured,
      images,
    });
    if (!error) {
      setForm({ name: "", price: "", category: "", stock: "0", featured: false, images: "" });
      setShowForm(false);
      await load();
    } else {
      alert(error.message);
    }
  }

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Produtos</h1>
          <p className="text-gray-600 mt-1">Gerencie seu catálogo de produtos</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors font-medium"
        >
          <Plus className="h-5 w-5" />
          Novo Produto
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
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Adicionar Novo Produto</h2>
          <form onSubmit={createProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
              <input
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Nome do produto"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Preço *</label>
              <input
                type="number"
                step="0.01"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="149.90"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
              <input
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Ex: Vestidos, Bolsas"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estoque</label>
              <input
                type="number"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="10"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">URLs das Imagens</label>
              <input
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="URL1, URL2, URL3 (separadas por vírgula)"
                value={form.images}
                onChange={(e) => setForm({ ...form, images: e.target.value })}
              />
            </div>
            <div className="md:col-span-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm text-gray-700">Produto em destaque</span>
              </label>
            </div>
            <div className="md:col-span-2 flex gap-3">
              <button
                type="submit"
                className="flex-1 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors font-medium"
              >
                Criar Produto
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((p) => {
            const firstImage = Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : null;
            return (
              <div key={p.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                {firstImage && (
                  <img src={firstImage} alt={p.name} className="w-full h-48 object-cover" />
                )}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{p.name}</h3>
                      {p.category && (
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded mt-1 inline-block">
                          {p.category}
                        </span>
                      )}
                    </div>
                    {p.featured && (
                      <span className="text-xs bg-primary text-white px-2 py-1 rounded">Destaque</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div>
                      <div className="text-lg font-bold text-primary">{formatCurrencyBRL(p.price)}</div>
                      <div className="text-xs text-gray-500">Estoque: {p.stock || 0}</div>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 text-gray-600 hover:bg-gray-100 rounded">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-red-600 hover:bg-red-50 rounded">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
