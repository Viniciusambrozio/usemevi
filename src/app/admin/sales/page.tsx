"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabaseClient";
import { formatCurrencyBRL } from "@/lib/utils";
import { ProductSelector } from "@/components/product-selector";
import { ConfirmModal } from "@/components/confirm-modal";
import { Plus, Search, CheckCircle, Clock, Truck, Edit, Trash2 } from "lucide-react";

interface SelectedProduct {
  id: string;
  name: string;
  price: number;
  quantity: number;
  selectedSize?: string;
}

export default function AdminSalesPage() {
  const supabase = createClient();
  const [sales, setSales] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({ client_id: "", products: [] as SelectedProduct[], status: "pendente" as "pendente" | "pago" | "entregue" });
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; saleId: string | null; saleTotal: number }>({
    isOpen: false,
    saleId: null,
    saleTotal: 0
  });

  async function load() {
    setLoading(true);
    try {
      const [salesData, clientsData] = await Promise.all([
        supabase.from("sales").select("*, clients(name)").order("date", { ascending: false }),
        supabase.from("clients").select("id, name"),
      ]);
      setSales(salesData.data || []);
      setClients(clientsData.data || []);
    } catch (error) {
      console.error("Erro ao carregar vendas:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function saveSale(e: React.FormEvent) {
    e.preventDefault();
    
    if (form.products.length === 0) {
      alert("Selecione pelo menos um produto");
      return;
    }

    if (editing) {
      await updateSale();
    } else {
      await createSale();
    }
  }

  async function createSale() {
    // Verifica estoque antes de criar a venda
    const stockChecks = await Promise.all(
      form.products.map(async (p) => {
        const { data } = await supabase
          .from("products")
          .select("id, name, stock")
          .eq("id", p.id)
          .single();
        return { product: p, stock: data?.stock || 0, name: data?.name };
      })
    );

    // Verifica se algum produto está sem estoque suficiente
    const insufficientStock = stockChecks.find(
      (check) => check.product.quantity > check.stock
    );

    if (insufficientStock) {
      alert(
        `Estoque insuficiente para "${insufficientStock.name}". Disponível: ${insufficientStock.stock}, Solicitado: ${insufficientStock.product.quantity}`
      );
      return;
    }

    // Converte produtos para o formato JSON esperado pelo banco
    const productsJson = form.products.map(p => ({
      id: p.id,
      name: p.name,
      price: p.price,
      quantity: p.quantity,
      selectedSize: p.selectedSize,
    }));

    const total = form.products.reduce((s, p) => s + (p.price * p.quantity), 0);
    
    const { error: saleError } = await supabase.from("sales").insert({
      client_id: form.client_id || null,
      products: productsJson,
      total,
      status: form.status,
    });
    
    if (saleError) {
      alert(saleError.message);
      return;
    }

    // Desconta estoque de cada produto (apenas se status for "pago")
    if (form.status === "pago") {
      await Promise.all(
        form.products.map(async (p) => {
          const { data: product } = await supabase
            .from("products")
            .select("variations")
            .eq("id", p.id)
            .single();

          if (product && p.selectedSize && product.variations?.sizes) {
            // Desconta do tamanho específico
            const updatedSizes = product.variations.sizes.map((size: any) =>
              size.size === p.selectedSize
                ? { ...size, stock: size.stock - p.quantity }
                : size
            );

            // Recalcula estoque total
            const totalStock = updatedSizes.reduce((sum: number, size: any) => sum + size.stock, 0);

            await supabase
              .from("products")
              .update({
                variations: { sizes: updatedSizes },
                stock: totalStock
              })
              .eq("id", p.id);
          } else {
            // Se não tem tamanho, desconta do estoque total
            const currentCheck = stockChecks.find(ch => ch.product.id === p.id);
            if (currentCheck) {
              const newStock = currentCheck.stock - p.quantity;
              await supabase
                .from("products")
                .update({ stock: newStock })
                .eq("id", p.id);
            }
          }
        })
      );
    }
    
    setForm({ client_id: "", products: [], status: "pendente" });
    setShowForm(false);
    await load();
  }

  async function updateSale() {
    if (!editing) return;

    // Busca a venda original para reverter o estoque
    const { data: originalSale } = await supabase
      .from("sales")
      .select("*")
      .eq("id", editing)
      .single();

    if (!originalSale) {
      alert("Venda não encontrada");
      return;
    }

    // Reverte o estoque da venda original (se estava pago)
    if (originalSale.status === "pago" && Array.isArray(originalSale.products)) {
      await Promise.all(
        originalSale.products.map(async (p: any) => {
          const { data: product } = await supabase
            .from("products")
            .select("variations, stock")
            .eq("id", p.id)
            .single();
          
          if (product && p.selectedSize && product.variations?.sizes) {
            // Reverte no tamanho específico
            const updatedSizes = product.variations.sizes.map((size: any) =>
              size.size === p.selectedSize
                ? { ...size, stock: size.stock + p.quantity }
                : size
            );

            const totalStock = updatedSizes.reduce((sum: number, size: any) => sum + size.stock, 0);

            await supabase
              .from("products")
              .update({
                variations: { sizes: updatedSizes },
                stock: totalStock
              })
              .eq("id", p.id);
          } else if (product) {
            // Se não tem tamanho, reverte no estoque total
            await supabase
              .from("products")
              .update({ stock: product.stock + p.quantity })
              .eq("id", p.id);
          }
        })
      );
    }

    // Verifica estoque para nova configuração
    const stockChecks = await Promise.all(
      form.products.map(async (p) => {
        const { data } = await supabase
          .from("products")
          .select("id, name, stock")
          .eq("id", p.id)
          .single();
        return { product: p, stock: data?.stock || 0, name: data?.name };
      })
    );

    const insufficientStock = stockChecks.find(
      (check) => check.product.quantity > check.stock
    );

    if (insufficientStock) {
      // Reverte de volta o estoque se não for possível atualizar
      if (Array.isArray(originalSale.products)) {
        await Promise.all(
          originalSale.products.map(async (p: any) => {
            const { data: product } = await supabase
              .from("products")
              .select("stock")
              .eq("id", p.id)
              .single();
            
            if (product) {
              await supabase
                .from("products")
                .update({ stock: product.stock - p.quantity })
                .eq("id", p.id);
            }
          })
        );
      }
      
      alert(
        `Estoque insuficiente para "${insufficientStock.name}". Disponível: ${insufficientStock.stock}, Solicitado: ${insufficientStock.product.quantity}`
      );
      return;
    }

    // Atualiza a venda
    const productsJson = form.products.map(p => ({
      id: p.id,
      name: p.name,
      price: p.price,
      quantity: p.quantity,
    }));

    const total = form.products.reduce((s, p) => s + (p.price * p.quantity), 0);

    const { error } = await supabase
      .from("sales")
      .update({
        client_id: form.client_id || null,
        products: productsJson,
        total,
        status: form.status,
      })
      .eq("id", editing);

    if (error) {
      alert(error.message);
      return;
    }

    // Desconta estoque com nova configuração (apenas se status for "pago")
    if (form.status === "pago") {
      await Promise.all(
        form.products.map(async (p) => {
          const { data: product } = await supabase
            .from("products")
            .select("variations")
            .eq("id", p.id)
            .single();

          if (product && p.selectedSize && product.variations?.sizes) {
            // Desconta do tamanho específico
            const updatedSizes = product.variations.sizes.map((size: any) =>
              size.size === p.selectedSize
                ? { ...size, stock: size.stock - p.quantity }
                : size
            );

            const totalStock = updatedSizes.reduce((sum: number, size: any) => sum + size.stock, 0);

            await supabase
              .from("products")
              .update({
                variations: { sizes: updatedSizes },
                stock: totalStock
              })
              .eq("id", p.id);
          } else {
            // Se não tem tamanho, desconta do estoque total
            const currentCheck = stockChecks.find(ch => ch.product.id === p.id);
            if (currentCheck) {
              const newStock = currentCheck.stock - p.quantity;
              await supabase
                .from("products")
                .update({ stock: newStock })
                .eq("id", p.id);
            }
          }
        })
      );
    }

    setForm({ client_id: "", products: [], status: "pendente" });
    setShowForm(false);
    setEditing(null);
    await load();
  }

  function editSale(sale: any) {
    setEditing(sale.id);
    setForm({
      client_id: sale.client_id || "",
      products: Array.isArray(sale.products) ? sale.products : [],
      status: sale.status || "pendente",
    });
    setShowForm(true);
  }

  function cancelEdit() {
    setEditing(null);
    setForm({ client_id: "", products: [], status: "pendente" });
    setShowForm(false);
  }

  function openDeleteModal(sale: any) {
    setDeleteModal({
      isOpen: true,
      saleId: sale.id,
      saleTotal: sale.total
    });
  }

  function closeDeleteModal() {
    setDeleteModal({ isOpen: false, saleId: null, saleTotal: 0 });
  }

  async function confirmDelete() {
    if (!deleteModal.saleId) return;

    // Busca a venda para reverter o estoque
    const { data: sale } = await supabase
      .from("sales")
      .select("*")
      .eq("id", deleteModal.saleId)
      .single();

    // Reverte o estoque (apenas se a venda estava paga)
    if (sale && sale.status === "pago" && Array.isArray(sale.products)) {
      await Promise.all(
        sale.products.map(async (p: any) => {
          const { data: product } = await supabase
            .from("products")
            .select("variations, stock")
            .eq("id", p.id)
            .single();
          
          if (product && p.selectedSize && product.variations?.sizes) {
            // Reverte no tamanho específico
            const updatedSizes = product.variations.sizes.map((size: any) =>
              size.size === p.selectedSize
                ? { ...size, stock: size.stock + p.quantity }
                : size
            );

            const totalStock = updatedSizes.reduce((sum: number, size: any) => sum + size.stock, 0);

            await supabase
              .from("products")
              .update({
                variations: { sizes: updatedSizes },
                stock: totalStock
              })
              .eq("id", p.id);
          } else if (product) {
            // Se não tem tamanho, reverte no estoque total
            await supabase
              .from("products")
              .update({ stock: product.stock + p.quantity })
              .eq("id", p.id);
          }
        })
      );
    }

    // Exclui a venda
    const { error } = await supabase
      .from("sales")
      .delete()
      .eq("id", deleteModal.saleId);

    if (!error) {
      await load();
      closeDeleteModal();
    } else {
      alert(error.message);
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pago":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "entregue":
        return <Truck className="h-4 w-4 text-blue-600" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pago":
        return "Pago";
      case "entregue":
        return "Entregue";
      default:
        return "Pendente";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vendas</h1>
          <p className="text-gray-600 mt-1">Registre e gerencie suas vendas</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors font-medium"
        >
          <Plus className="h-5 w-5" />
          Nova Venda
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">{editing ? "Editar Venda" : "Registrar Nova Venda"}</h2>
          <form onSubmit={saveSale} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cliente (opcional)</label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
                value={form.client_id}
                onChange={(e) => setForm({ ...form, client_id: e.target.value })}
              >
                <option value="">Selecionar cliente...</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Produtos</label>
              <ProductSelector
                value={form.products}
                onChange={(products) => setForm({ ...form, products })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as any })}
              >
                <option value="pendente">Pendente</option>
                <option value="pago">Pago</option>
                <option value="entregue">Entregue</option>
              </select>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors font-medium"
              >
                {editing ? "Atualizar Venda" : "Registrar Venda"}
              </button>
              <button
                type="button"
                onClick={cancelEdit}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Sales List */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">Carregando...</div>
      ) : sales.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
          <Truck className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600">Nenhuma venda registrada ainda</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sales.map((s) => (
            <div key={s.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {getStatusIcon(s.status)}
                    <div>
                      <div className="text-2xl font-bold text-primary">{formatCurrencyBRL(s.total)}</div>
                      <div className="text-sm text-gray-600">
                        {new Date(s.date).toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>
                  {s.clients && (
                    <div className="text-sm text-gray-600">
                      Cliente: <span className="font-medium">{s.clients.name}</span>
                    </div>
                  )}
                </div>
                <div className="flex items-start gap-2">
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-medium ${
                      s.status === "pago"
                        ? "bg-green-100 text-green-800"
                        : s.status === "entregue"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {getStatusLabel(s.status)}
                  </span>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      editSale(s);
                    }}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Editar venda"
                    type="button"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      openDeleteModal(s);
                    }}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Excluir venda"
                    type="button"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {Array.isArray(s.products) && s.products.length > 0 && (
                <div className="space-y-2 pt-4 border-t border-gray-100">
                  {s.products.map((p: any, i: number) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-700">
                          {p.quantity || 1}x <span className="font-medium">{p.name}</span>
                        </span>
                        {p.selectedSize && (
                          <span 
                            className="text-xs font-semibold px-2 py-0.5 rounded"
                            style={{ backgroundColor: '#ffe472', color: '#fc0055' }}
                          >
                            {p.selectedSize}
                          </span>
                        )}
                      </div>
                      <span className="font-semibold text-gray-900">
                        {formatCurrencyBRL((p.price || 0) * (p.quantity || 1))}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal de Confirmação de Exclusão */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        title="Excluir Venda"
        message={`Tem certeza que deseja excluir esta venda de ${formatCurrencyBRL(deleteModal.saleTotal)}? O estoque dos produtos será revertido. Esta ação não pode ser desfeita.`}
        confirmText="Excluir"
        cancelText="Cancelar"
        type="danger"
      />
    </div>
  );
}
