"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabaseClient";
import { formatCurrencyBRL } from "@/lib/utils";
import { Package, ShoppingCart, Users, DollarSign, TrendingUp } from "lucide-react";
import { SalesChart } from "@/components/sales-chart";

export default function AdminDashboardPage() {
  const supabase = createClient();
  const [stats, setStats] = useState({ products: 0, sales: 0, clients: 0, revenue: 0 });
  const [salesData, setSalesData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [productsData, salesData, clientsData] = await Promise.all([
          supabase.from("products").select("id", { count: "exact", head: true }),
          supabase.from("sales").select("total, date"),
          supabase.from("clients").select("id", { count: "exact", head: true }),
        ]);
        const revenue = (salesData.data || []).reduce((s, v) => s + (Number(v.total) || 0), 0);
        setStats({
          products: productsData.count || 0,
          sales: salesData.data?.length || 0,
          clients: clientsData.count || 0,
          revenue,
        });
        setSalesData(salesData.data || []);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const cards = [
    {
      title: "Produtos",
      value: stats.products,
      icon: Package,
      color: "bg-blue-500",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      title: "Vendas",
      value: stats.sales,
      icon: ShoppingCart,
      color: "bg-green-500",
      bgColor: "bg-green-50",
      textColor: "text-green-600",
    },
    {
      title: "Clientes",
      value: stats.clients,
      icon: Users,
      color: "bg-purple-500",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
    },
    {
      title: "Receita Total",
      value: formatCurrencyBRL(stats.revenue),
      icon: DollarSign,
      color: "bg-primary",
      bgColor: "bg-primary/10",
      textColor: "text-primary",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Visão geral do seu negócio</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`${card.bgColor} p-3 rounded-lg`}>
                  <Icon className={`h-6 w-6 ${card.textColor}`} />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <p className={`text-2xl font-bold ${index === 3 ? card.textColor : "text-gray-900"}`}>
                  {card.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Sales */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Vendas Recentes (Últimos 7 dias)</h2>
            <TrendingUp className="h-5 w-5 text-gray-400" />
          </div>
          <SalesChart data={salesData.map(s => ({ date: s.date, total: s.total }))} />
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h2>
          <div className="space-y-3">
            <a
              href="/admin/products/new"
              className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Package className="h-5 w-5 text-primary" />
              <span className="font-medium text-gray-700">Adicionar Novo Produto</span>
            </a>
            <a
              href="/admin/sales/new"
              className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ShoppingCart className="h-5 w-5 text-primary" />
              <span className="font-medium text-gray-700">Registrar Nova Venda</span>
            </a>
            <a
              href="/admin/clients/new"
              className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Users className="h-5 w-5 text-primary" />
              <span className="font-medium text-gray-700">Adicionar Cliente</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
