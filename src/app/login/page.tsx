"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // Importante: permite receber cookies
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (data.error) {
      setError(data.error);
    } else {
      // Aguarda um momento para garantir que o cookie foi setado
      await new Promise(resolve => setTimeout(resolve, 100));
      // Usa window.location para garantir reload completo e verificação do AdminGuard
      window.location.href = "/admin/dashboard";
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="bg-white border rounded-xl p-6 w-full max-w-sm space-y-4">
        <h1 className="text-xl font-semibold">Login Admin</h1>
        {error && <div className="text-sm text-red-600 bg-red-50 p-2 rounded">{error}</div>}
        <input className="w-full border rounded px-3 py-2" type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <input className="w-full border rounded px-3 py-2" type="password" placeholder="Senha" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        <button className="w-full bg-primary text-white px-4 py-2 rounded">Entrar</button>
      </form>
    </div>
  );
}
