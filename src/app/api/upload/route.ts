import { NextRequest, NextResponse } from "next/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "Nenhum arquivo enviado" }, { status: 400 });
    }

    // Validação de tipo
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Apenas imagens são permitidas" }, { status: 400 });
    }

    // Validação de tamanho (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "Arquivo muito grande (máximo 5MB)" }, { status: 400 });
    }

    // Verifica autenticação via cookie
    const accessToken = req.cookies.get("sb-access-token")?.value;
    if (!accessToken) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    // Cria cliente Supabase com token de autenticação
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const supabase = createSupabaseClient(url, anon, {
      global: {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    });

    // Gera nome único para o arquivo
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const filePath = `product-images/${fileName}`;

    // Converte File para ArrayBuffer e depois para Uint8Array
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    // Upload para Supabase Storage com autenticação
    const { data, error } = await supabase.storage
      .from("product-images")
      .upload(filePath, uint8Array, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error("Erro no upload:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Obtém URL pública
    const { data: { publicUrl } } = supabase.storage
      .from("product-images")
      .getPublicUrl(filePath);

    return NextResponse.json({ url: publicUrl });
  } catch (error: any) {
    console.error("Erro no upload:", error);
    return NextResponse.json({ error: error.message || "Erro ao fazer upload" }, { status: 500 });
  }
}
