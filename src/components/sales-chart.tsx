"use client";
import { formatCurrencyBRL } from "@/lib/utils";

interface SaleData {
  date: string;
  total: number;
}

interface SalesChartProps {
  data: SaleData[];
}

export function SalesChart({ data }: SalesChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <div className="text-center">
          <p className="text-sm">Sem dados de vendas recentes</p>
        </div>
      </div>
    );
  }

  // Prepara dados para os últimos 7 dias
  const last7Days = [];
  const today = new Date();
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];
    last7Days.push({
      date: dateStr,
      label: date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
      total: 0,
    });
  }

  // Agrupa vendas por data
  data.forEach(sale => {
    const saleDate = new Date(sale.date).toISOString().split("T")[0];
    const dayData = last7Days.find(d => d.date === saleDate);
    if (dayData) {
      dayData.total += sale.total;
    }
  });

  // Calcula altura máxima para escala
  const maxTotal = Math.max(...last7Days.map(d => d.total));
  const maxHeight = 200; // altura máxima em pixels

  // Função para calcular altura da barra
  const getBarHeight = (total: number) => {
    if (maxTotal === 0) return 0;
    return (total / maxTotal) * maxHeight;
  };

  return (
    <div className="h-64 flex flex-col">
      {/* Bars */}
      <div className="flex-1 flex items-end gap-2 px-2">
        {last7Days.map((day, index) => {
          const height = getBarHeight(day.total);
          const hasData = day.total > 0;
          
          return (
            <div key={index} className="flex-1 flex flex-col items-center group">
              <div
                className="w-full bg-primary rounded-t-lg transition-all hover:opacity-80 relative"
                style={{ height: `${Math.max(height, 4)}px`, minHeight: hasData ? "4px" : "0" }}
              >
                {/* Tooltip */}
                {hasData && (
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {formatCurrencyBRL(day.total)}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Labels */}
      <div className="flex gap-2 px-2 pt-2 border-t border-gray-200">
        {last7Days.map((day, index) => (
          <div key={index} className="flex-1 text-center">
            <div className="text-xs text-gray-600">{day.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
