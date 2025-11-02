"use client";
import { useState } from "react";
import { X, User, Mail, Lock, Sparkles, Phone } from "lucide-react";
import { createClient } from "@/lib/supabaseClient";

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: any) => void;
}

export function WelcomeModal({ isOpen, onClose, onSuccess }: WelcomeModalProps) {
  const [isLogin, setIsLogin] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        // Login
        const { data: client } = await supabase
          .from("clients")
          .select("*")
          .eq("email", form.email)
          .single();

        if (!client) {
          alert("Email não encontrado. Crie uma conta primeiro!");
          setLoading(false);
          return;
        }

        // Armazenar cliente logado
        localStorage.setItem("mevi-user", JSON.stringify(client));
        onSuccess(client);
      } else {
        // Cadastro - Verificar se email já existe
        const { data: existingClients, error: checkError } = await supabase
          .from("clients")
          .select("id")
          .eq("email", form.email);

        if (checkError) {
          console.error("Erro ao verificar email:", checkError);
        }

        if (existingClients && existingClients.length > 0) {
          alert("Este email já está cadastrado. Faça login!");
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from("clients")
          .insert({
            name: form.name,
            email: form.email,
            password: form.password, // Em produção, use hash!
            phone: form.phone || "",
            tags: ["Cadastro Automático"]
          })
          .select()
          .single();

        if (error) {
          alert("Erro ao criar conta: " + error.message);
          setLoading(false);
          return;
        }

        localStorage.setItem("mevi-user", JSON.stringify(data));
        onSuccess(data);
      }
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao processar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed top-0 left-0 right-0 bottom-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[10000]"
      style={{ minHeight: '100vh', minWidth: '100vw' }}
    >
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-8 pb-6" style={{ background: 'linear-gradient(135deg, #fc0055 0%, #ff1a6b 100%)' }}>
          <div className="flex items-start justify-between mb-4">
            <div 
              className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{ backgroundColor: '#ffe472' }}
            >
              <Sparkles className="h-7 w-7" style={{ color: '#fc0055' }} />
            </div>
          </div>
          
          <h2 className="text-2xl font-black text-white mb-2">
            {isLogin ? "Bem-vindo de volta!" : "Oii! 👋"}
          </h2>
          <p className="text-white/90 text-sm leading-relaxed">
            {isLogin 
              ? "Entre com sua conta para continuar" 
              : "Preciso de apenas algumas informações para continuarmos"}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-4">
          {!isLogin && (
            <>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <User className="inline h-4 w-4 mr-1" style={{ color: '#fc0055' }} />
                  Nome
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="Seu nome completo"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Phone className="inline h-4 w-4 mr-1" style={{ color: '#fc0055' }} />
                  Telefone
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="(00) 00000-0000"
                  required
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Mail className="inline h-4 w-4 mr-1" style={{ color: '#fc0055' }} />
              Email
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              placeholder="seu@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Lock className="inline h-4 w-4 mr-1" style={{ color: '#fc0055' }} />
              Senha
            </label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              placeholder="Mínimo 6 caracteres"
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl font-black text-white transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: '#fc0055' }}
          >
            {loading ? "Processando..." : isLogin ? "Entrar" : "Criar Conta"}
          </button>

          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="w-full text-sm text-gray-600 hover:text-primary transition-colors"
          >
            {isLogin ? "Não tem conta? Cadastre-se" : "Já tem conta? Faça login"}
          </button>
        </form>
      </div>
    </div>
  );
}

