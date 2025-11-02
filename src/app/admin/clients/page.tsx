"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabaseClient";
import { PhoneInput } from "@/components/phone-input";
import { Plus, Search, Edit, Trash2, UserPlus, Mail, Phone, Tag } from "lucide-react";

export default function AdminClientsPage() {
  const supabase = createClient();
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", notes: "", tags: "" });
  const [editing, setEditing] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const { data } = await supabase.from("clients").select("*").order("created_at", { ascending: false });
    setClients(data || []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    const tags = form.tags ? form.tags.split(",").map((s) => s.trim()).filter(Boolean) : [];
    const payload: any = {
      name: form.name,
      phone: form.phone || null,
      email: form.email || null,
      notes: form.notes || null,
      tags,
    };
    
    if (editing) {
      const { error } = await supabase.from("clients").update(payload).eq("id", editing);
      if (!error) {
        setEditing(null);
        setForm({ name: "", phone: "", email: "", notes: "", tags: "" });
        setShowForm(false);
        await load();
      } else {
        alert(error.message);
      }
    } else {
      const { error } = await supabase.from("clients").insert(payload);
      if (!error) {
        setForm({ name: "", phone: "", email: "", notes: "", tags: "" });
        setShowForm(false);
        await load();
      } else {
        alert(error.message);
      }
    }
  }

  function edit(c: any) {
    setEditing(c.id);
    setForm({
      name: c.name || "",
      phone: c.phone || "",
      email: c.email || "",
      notes: c.notes || "",
      tags: Array.isArray(c.tags) ? c.tags.join(", ") : "",
    });
    setShowForm(true);
  }

  function cancel() {
    setEditing(null);
    setForm({ name: "", phone: "", email: "", notes: "", tags: "" });
    setShowForm(false);
  }

  async function deleteClient(id: string) {
    if (!confirm("Tem certeza que deseja excluir este cliente?")) return;
    const { error } = await supabase.from("clients").delete().eq("id", id);
    if (!error) {
      await load();
    } else {
      alert(error.message);
    }
  }

  const filteredClients = clients.filter(c =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.phone?.includes(search) ||
    c.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clientes (CRM)</h1>
          <p className="text-gray-600 mt-1">Gerencie sua base de clientes</p>
        </div>
        <button
          onClick={() => {
            setShowForm(!showForm);
            if (showForm) cancel();
          }}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors font-medium"
        >
          <Plus className="h-5 w-5" />
          Novo Cliente
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar por nome, telefone ou email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">
            {editing ? "Editar Cliente" : "Adicionar Novo Cliente"}
          </h2>
          <form onSubmit={save} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
              <input
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Nome completo"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Telefone/WhatsApp
              </label>
              <PhoneInput
                value={form.phone}
                onChange={(value) => setForm({ ...form, phone: value })}
                placeholder="(11) 91234-5678"
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email
              </label>
              <input
                type="email"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="cliente@email.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
              <textarea
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Preferências, estilo, histórico de compras..."
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                rows={3}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <Tag className="h-4 w-4" />
                Tags
              </label>
              <input
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="VIP, Recorrente, Carrinho Abandonado (separadas por vírgula)"
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
              />
              <p className="text-xs text-gray-500 mt-1">Separe as tags por vírgula</p>
            </div>
            <div className="md:col-span-2 flex gap-3">
              <button
                type="submit"
                className="flex-1 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors font-medium"
              >
                {editing ? "Atualizar" : "Criar Cliente"}
              </button>
              <button
                type="button"
                onClick={cancel}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Clients List */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">Carregando...</div>
      ) : filteredClients.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
          <UserPlus className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600">
            {search ? "Nenhum cliente encontrado" : "Nenhum cliente cadastrado ainda"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredClients.map((c) => (
            <div key={c.id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-lg">{c.name}</h3>
                  {c.phone && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                      <Phone className="h-4 w-4" />
                      <span>{c.phone.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3").replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3")}</span>
                      <a
                        href={`https://wa.me/55${c.phone.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-green-600 hover:text-green-700"
                        title="Abrir WhatsApp"
                      >
                        💬
                      </a>
                    </div>
                  )}
                  {c.email && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                      <Mail className="h-4 w-4" />
                      <a href={`mailto:${c.email}`} className="hover:text-primary">
                        {c.email}
                      </a>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => edit(c)}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Editar"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => deleteClient(c.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Excluir"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              {c.notes && (
                <p className="text-sm text-gray-700 mb-3 bg-gray-50 p-2 rounded-lg">
                  {c.notes}
                </p>
              )}
              {Array.isArray(c.tags) && c.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {c.tags.map((tag: string, i: number) => (
                    <span key={i} className="text-xs bg-secondary px-2 py-1 rounded-full font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
