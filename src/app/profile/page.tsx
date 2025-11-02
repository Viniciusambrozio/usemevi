"use client";
import { useAuth } from "@/hooks/useAuth";
import { NavbarBottom } from "@/components/navbar-bottom";
import { User, Mail, LogOut, Heart, ShoppingBag, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();

  function handleLogout() {
    if (confirm("Tem certeza que deseja sair?")) {
      logout();
      router.push("/");
    }
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-white pb-24 flex items-center justify-center">
        <div className="text-center p-8">
          <User className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Não autenticado</h2>
          <p className="text-gray-600 mb-6">Faça login para acessar seu perfil</p>
          <Link 
            href="/"
            className="inline-block px-6 py-3 rounded-2xl font-bold text-white"
            style={{ backgroundColor: '#fc0055' }}
          >
            Ir para Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Header */}
      <header className="bg-primary py-2">
        <div className="flex items-center justify-between px-4 h-12">
          <Link href="/" className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors">
            <ArrowLeft className="h-5 w-5 text-white" />
          </Link>
          
          <div className="flex items-center gap-2">
            <div 
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: '#ffe472' }}
            >
              <User className="h-5 w-5" style={{ color: '#fc0055' }} />
            </div>
            <div>
              <h1 className="text-base font-bold text-white">Meu Perfil</h1>
            </div>
          </div>

          <div className="w-9" />
        </div>
      </header>

      {/* Perfil do Usuário */}
      <div className="p-6 space-y-6">
        {/* Card de Informações */}
        <div className="bg-gray-50 rounded-3xl p-6">
          <div className="flex items-center gap-4 mb-6">
            <div 
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black text-white"
              style={{ backgroundColor: '#fc0055' }}
            >
              {user.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
              <p className="text-sm text-gray-600">Cliente Mevi</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center">
                <Mail className="h-5 w-5" style={{ color: '#fc0055' }} />
              </div>
              <div>
                <p className="text-xs text-gray-500">Email</p>
                <p className="font-semibold text-gray-900">{user.email}</p>
              </div>
            </div>

            {user.phone && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center">
                  <Mail className="h-5 w-5" style={{ color: '#fc0055' }} />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Telefone</p>
                  <p className="font-semibold text-gray-900">{user.phone}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Ações Rápidas */}
        <div className="space-y-3">
          <Link
            href="/favorites"
            className="flex items-center justify-between bg-gray-50 rounded-2xl p-4 hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#ffe472' }}>
                <Heart className="h-5 w-5" style={{ color: '#fc0055' }} />
              </div>
              <span className="font-semibold text-gray-900">Meus Favoritos</span>
            </div>
            <span className="text-gray-400">→</span>
          </Link>

          <Link
            href="/cart"
            className="flex items-center justify-between bg-gray-50 rounded-2xl p-4 hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#ffe472' }}>
                <ShoppingBag className="h-5 w-5" style={{ color: '#fc0055' }} />
              </div>
              <span className="font-semibold text-gray-900">Meu Carrinho</span>
            </div>
            <span className="text-gray-400">→</span>
          </Link>
        </div>

        {/* Botão Sair */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-3 bg-red-50 hover:bg-red-100 rounded-2xl p-4 transition-colors"
        >
          <LogOut className="h-5 w-5 text-red-600" />
          <span className="font-bold text-red-600">Sair da Conta</span>
        </button>
      </div>

      <NavbarBottom />
    </div>
  );
}

