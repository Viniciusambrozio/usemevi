import { NextRequest, NextResponse } from "next/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  try {
    const { email, password, name, role } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email e senha são obrigatórios" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Senha deve ter no mínimo 6 caracteres" }, { status: 400 });
    }

    // Usa Service Role Key para criar usuários (requer acesso admin)
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    if (!serviceRoleKey) {
      return NextResponse.json(
        { error: "SUPABASE_SERVICE_ROLE_KEY não configurada. Adicione no .env.local" },
        { status: 500 }
      );
    }

    const supabaseAdmin = createSupabaseClient(url, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Lista usuários para verificar se o email já existe
    const { data: usersList } = await supabaseAdmin.auth.admin.listUsers();
    const existingUser = usersList?.users?.find((u: any) => u.email === email);
    
    if (existingUser) {
      return NextResponse.json({ error: "Email já cadastrado" }, { status: 409 });
    }

    // Cria usuário no Supabase Auth
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirma email
      user_metadata: {
        name: name || email.split("@")[0],
        role: role || "vendedor",
      },
    });

    if (error || !data.user) {
      console.error("Erro ao criar usuário:", error);
      return NextResponse.json({ error: error?.message || "Erro ao criar usuário" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: data.user.id,
        email: data.user.email,
        name: name || email.split("@")[0],
        role: role || "vendedor",
      },
    });
  } catch (error: any) {
    console.error("Erro no signup:", error);
    return NextResponse.json({ error: error.message || "Erro ao criar usuário" }, { status: 500 });
  }
}
