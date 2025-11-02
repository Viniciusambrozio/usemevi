"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabaseClient";
import { Settings } from "lucide-react";

export default function AdminConfigPage() {
  const supabase = createClient();
  const [config, setConfig] = useState<any | null>(null);
  const [whatsapp, setWhatsapp] = useState("");
  const [logo, setLogo] = useState("");
  const [primary, setPrimary] = useState("#fc0055");
  const [secondary, setSecondary] = useState("#FFE472");

  useEffect(() => { 
    (async () => {
      const { data } = await supabase.from("config").select("*").limit(1).maybeSingle();
      if (data) {
        setConfig(data);
        setWhatsapp(data.whatsapp_number || "");
        setLogo(data.logo_url || "");
        setPrimary(data.color_primary || "#fc0055");
        setSecondary(data.color_secondary || "#FFE472");
      }
    })(); 
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (config?.id) {
      await supabase.from("config").update({ whatsapp_number: whatsapp, logo_url: logo, color_primary: primary, color_secondary: secondary }).eq("id", config.id);
    } else {
      const { data } = await supabase.from("config").insert({ whatsapp_number: whatsapp, logo_url: logo, color_primary: primary, color_secondary: secondary }).select().single();
      setConfig(data);
    }
    alert("Configurações salvas!");
  }

  function testWhatsApp() {
    if (!whatsapp) return;
    const link = `https://wa.me/${whatsapp}?text=${encodeURIComponent("Olá! Teste de mensagem da Mevi.")}`;
    window.open(link, "_blank");
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
        <p className="text-gray-600 mt-1">Gerencie as configurações da loja</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configurações Gerais */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Settings className="h-5 w-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Configurações Gerais</h2>
          </div>
          <form onSubmit={save} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Número do WhatsApp</label>
              <input
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="5511999999999 (somente dígitos)"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL da Logo</label>
              <input
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="https://exemplo.com/logo.png"
                value={logo}
                onChange={(e) => setLogo(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cor primária</label>
                <input
                  type="color"
                  className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
                  value={primary}
                  onChange={(e) => setPrimary(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cor secundária</label>
                <input
                  type="color"
                  className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
                  value={secondary}
                  onChange={(e) => setSecondary(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="flex-1 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors font-medium"
              >
                Salvar Configurações
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                onClick={testWhatsApp}
              >
                Testar WhatsApp
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
