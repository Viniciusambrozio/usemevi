"use client";
import Link from "next/link";
import { ReactNode } from "react";
import { AdminGuard } from "@/components/admin-guard";
import { ActiveNavLink } from "@/components/active-nav-link";
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  ShoppingCart, 
  Settings, 
  UserCog,
  LogOut,
  Warehouse
} from "lucide-react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AdminGuard>
      <div className="min-h-screen bg-gray-50">
        {/* Sidebar */}
        <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 z-50 shadow-sm">
          <div className="h-full flex flex-col">
            {/* Logo/Header */}
            <div className="h-16 border-b border-gray-200 flex items-center px-6">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center shadow-md">
                  <span className="text-white font-bold text-base">M</span>
                </div>
                <div>
                  <div className="font-bold text-gray-900">Mevi Admin</div>
                  <div className="text-xs text-gray-500">Painel Administrativo</div>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
              <ActiveNavLink href="/admin/dashboard" icon={LayoutDashboard}>
                Dashboard
              </ActiveNavLink>
              <ActiveNavLink href="/admin/products" icon={Package}>
                Produtos
              </ActiveNavLink>
              <ActiveNavLink href="/admin/stock" icon={Warehouse}>
                Estoque
              </ActiveNavLink>
              <ActiveNavLink href="/admin/clients" icon={Users}>
                Clientes
              </ActiveNavLink>
              <ActiveNavLink href="/admin/sales" icon={ShoppingCart}>
                Vendas
              </ActiveNavLink>
              <ActiveNavLink href="/admin/config" icon={Settings}>
                Configurações
              </ActiveNavLink>
              <ActiveNavLink href="/admin/users" icon={UserCog}>
                Usuários
              </ActiveNavLink>
            </nav>

            {/* Footer/Logout */}
            <div className="border-t border-gray-200 p-4">
              <Link
                href="/logout"
                className="flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span className="font-medium">Sair</span>
              </Link>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="ml-64">
          {/* Top Bar */}
          <header className="h-16 bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
            <div className="h-full flex items-center justify-between px-6">
              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-600">
                  {new Date().toLocaleDateString("pt-BR", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="p-6">
            {children}
          </main>
        </div>
      </div>
    </AdminGuard>
  );
}
