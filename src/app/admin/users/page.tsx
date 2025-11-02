"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabaseClient";
import { UserPlus, Edit, Trash2, Shield, User as UserIcon, Search } from "lucide-react";

export default function AdminUsersPage() {
  const supabase = createClient();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "vendedor" });
  const [editing, setEditing] = useState<string | null>(null);
  const [userLoading, setUserLoading] = useState(false);
  const [search, setSearch] = useState("");

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      if (res.ok && data.users) {
        setUsers(data.users);
      }
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { 
    load(); 
  }, []);

  async function saveUser(e: React.FormEvent) {
    e.preventDefault();
    setUserLoading(true);

    try {
      if (editing) {
        // Atualizar usuário existente
        const updateData: any = {
          id: editing,
          email: form.email,
          name: form.name,
          role: form.role,
        };

        // Se tem senha, incluir na atualização
        if (form.password) {
          updateData.password = form.password;
        }

        const updateRes = await fetch("/api/users/update", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updateData),
        });

        const updateResult = await updateRes.json();

        if (!updateRes.ok) {
          alert(updateResult.error || "Erro ao atualizar usuário");
          return;
        }

        alert("Usuário atualizado com sucesso!");
        setEditing(null);
        setForm({ name: "", email: "", password: "", role: "vendedor" });
        setShowForm(false);
        await load();
      } else {
        // Criar novo usuário
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: form.email,
            password: form.password,
            name: form.name,
            role: form.role,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          alert(data.error || "Erro ao criar usuário");
          return;
        }

        alert("Usuário criado com sucesso!");
        setForm({ name: "", email: "", password: "", role: "vendedor" });
        setShowForm(false);
        await load();
      }
    } catch (error: any) {
      alert("Erro: " + error.message);
    } finally {
      setUserLoading(false);
    }
  }

  function editUser(user: any) {
    setEditing(user.id);
    setForm({
      name: user.user_metadata?.name || "",
      email: user.email || "",
      password: "",
      role: user.user_metadata?.role || "vendedor",
    });
    setShowForm(true);
  }

  function cancel() {
    setEditing(null);
    setForm({ name: "", email: "", password: "", role: "vendedor" });
    setShowForm(false);
  }

  async function deleteUser(id: string) {
    if (!confirm("Tem certeza que deseja excluir este usuário?")) return;
    
    try {
      const res = await fetch("/api/users/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Erro ao excluir usuário");
        return;
      }

      await load();
    } catch (error: any) {
      alert("Erro ao excluir usuário: " + error.message);
    }
  }

  const filteredUsers = users.filter(user => {
    const searchLower = search.toLowerCase();
    return (
      user.email?.toLowerCase().includes(searchLower) ||
      user.user_metadata?.name?.toLowerCase().includes(searchLower) ||
      user.user_metadata?.role?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Usuários</h1>
          <p className="text-gray-600 mt-1">Gerencie usuários do sistema</p>
        </div>
        <button
          onClick={() => {
            setShowForm(!showForm);
            if (showForm) cancel();
          }}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors font-medium"
        >
          <UserPlus className="h-5 w-5" />
          Novo Usuário
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar usuários por nome, email ou função..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">
            {editing ? "Editar Usuário" : "Novo Usuário"}
          </h2>
          <form onSubmit={saveUser} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <input
                type="email"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="usuario@email.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Senha {!editing && "*"}
              </label>
              <input
                type="password"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Mínimo 6 caracteres"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required={!editing}
                minLength={6}
              />
              {editing && (
                <p className="text-xs text-gray-500 mt-1">Deixe em branco para manter a senha atual</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nível de Acesso *</label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                required
              >
                <option value="vendedor">Vendedor</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
            <div className="md:col-span-2 flex gap-3 pt-2">
              <button
                type="submit"
                disabled={userLoading}
                className="flex-1 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors font-medium disabled:opacity-50"
              >
                {userLoading ? "Salvando..." : editing ? "Atualizar" : "Criar Usuário"}
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

      {/* Users List */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">Carregando...</div>
      ) : filteredUsers.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
          <UserIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600">
            {search ? "Nenhum usuário encontrado" : "Nenhum usuário cadastrado"}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredUsers.length > 0 && (
            <div className="text-sm text-gray-600">
              Mostrando {filteredUsers.length} de {users.length} usuários
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredUsers.map((user) => (
            <div key={user.id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {user.user_metadata?.role === "admin" ? (
                      <Shield className="h-5 w-5 text-yellow-600" />
                    ) : (
                      <UserIcon className="h-5 w-5 text-gray-600" />
                    )}
                    <h3 className="font-semibold text-gray-900">
                      {user.user_metadata?.name || user.email}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600">{user.email}</p>
                  {user.user_metadata?.role && (
                    <span
                      className={`inline-block mt-2 px-2 py-1 rounded-full text-xs font-medium ${
                        user.user_metadata.role === "admin"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {user.user_metadata.role === "admin" ? "Administrador" : "Vendedor"}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex gap-2 pt-3 border-t border-gray-100">
                <button
                  onClick={() => editUser(user)}
                  className="flex-1 flex items-center justify-center gap-2 p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Edit className="h-4 w-4" />
                  Editar
                </button>
                <button
                  onClick={() => deleteUser(user.id)}
                  className="flex items-center justify-center gap-2 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
          </div>
        </div>
      )}
    </div>
  );
}
