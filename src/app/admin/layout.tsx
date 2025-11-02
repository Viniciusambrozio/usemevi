"use client";
import Link from "next/link";
import { ReactNode, useState, useEffect } from "react";
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
  Warehouse,
  Menu,
  X
} from "lucide-react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Fecha sidebar ao mudar de rota em mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <AdminGuard>
      <div className="min-h-screen bg-gray-50">
        {/* Overlay para mobile */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={closeSidebar}
          />
        )}

        {/* Sidebar */}
        <aside className={`
          fixed left-0 top-0 h-full w-72 sm:w-80 lg:w-64 bg-white border-r border-gray-200 z-50 shadow-lg lg:shadow-sm
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="h-full flex flex-col">
            {/* Logo/Header */}
            <div className="h-16 border-b border-gray-200 flex items-center justify-between px-4 sm:px-6">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center shadow-md flex-shrink-0">
                  <span className="text-white font-bold text-base">M</span>
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-gray-900 truncate">Mevi Admin</div>
                  <div className="text-xs text-gray-500 truncate">Painel Administrativo</div>
                </div>
              </div>
              
              {/* Botão fechar (apenas mobile) */}
              <button
                onClick={closeSidebar}
                className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 sm:px-4 py-4 sm:py-6 space-y-1 overflow-y-auto">
              <div onClick={closeSidebar}>
                <ActiveNavLink href="/admin/dashboard" icon={LayoutDashboard}>
                  Dashboard
                </ActiveNavLink>
              </div>
              <div onClick={closeSidebar}>
                <ActiveNavLink href="/admin/products" icon={Package}>
                  Produtos
                </ActiveNavLink>
              </div>
              <div onClick={closeSidebar}>
                <ActiveNavLink href="/admin/stock" icon={Warehouse}>
                  Estoque
                </ActiveNavLink>
              </div>
              <div onClick={closeSidebar}>
                <ActiveNavLink href="/admin/clients" icon={Users}>
                  Clientes
                </ActiveNavLink>
              </div>
              <div onClick={closeSidebar}>
                <ActiveNavLink href="/admin/sales" icon={ShoppingCart}>
                  Vendas
                </ActiveNavLink>
              </div>
              <div onClick={closeSidebar}>
                <ActiveNavLink href="/admin/config" icon={Settings}>
                  Configurações
                </ActiveNavLink>
              </div>
              <div onClick={closeSidebar}>
                <ActiveNavLink href="/admin/users" icon={UserCog}>
                  Usuários
                </ActiveNavLink>
              </div>
            </nav>

            {/* Footer/Logout */}
            <div className="border-t border-gray-200 p-3 sm:p-4">
              <Link
                href="/logout"
                onClick={closeSidebar}
                className="flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
              >
                <LogOut className="h-5 w-5 flex-shrink-0" />
                <span className="font-medium">Sair</span>
              </Link>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="lg:ml-64">
          {/* Top Bar */}
          <header className="h-14 sm:h-16 bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
            <div className="h-full flex items-center justify-between px-4 sm:px-6">
              <div className="flex items-center gap-3 sm:gap-4">
                {/* Botão Menu Hamburger (apenas mobile) */}
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors -ml-2"
                >
                  <Menu className="h-6 w-6" />
                </button>
                
                {/* Data */}
                <div className="text-xs sm:text-sm text-gray-600 truncate">
                  {new Date().toLocaleDateString("pt-BR", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              </div>
              
              {/* Logo mobile (substitui o menu em telas pequenas) */}
              <div className="lg:hidden flex items-center gap-2">
                <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center shadow-md">
                  <span className="text-white font-bold text-sm">M</span>
                </div>
                <span className="font-bold text-gray-900 text-sm">Mevi</span>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="p-4 sm:p-6 max-w-full">
            {children}
          </main>
        </div>
      </div>
    </AdminGuard>
  );
}
