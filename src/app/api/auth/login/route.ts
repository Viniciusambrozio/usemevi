import { NextRequest, NextResponse } from "next/server";
import { createBrowserClient } from "@/lib/supabaseClient";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  
  if (!email || !password) {
    return NextResponse.json({ error: "Email e senha são obrigatórios" }, { status: 400 });
  }

  const supabase = createBrowserClient();
  
  // Faz login via Supabase Auth
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.session) {
    return NextResponse.json({ error: error?.message || "Credenciais inválidas" }, { status: 401 });
  }

  const { access_token, refresh_token } = data.session;
  const user = data.user;

  // Verifica se o usuário tem metadata role = 'admin'
  const userRole = (user.user_metadata as any)?.role || (user.app_metadata as any)?.role;
  
  if (userRole !== "admin") {
    return NextResponse.json({ error: "Acesso negado. Apenas administradores podem acessar." }, { status: 403 });
  }

  const res = NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      role: userRole,
      name: user.user_metadata?.name || user.email?.split("@")[0],
    },
  });

  // Salva os tokens JWT nos cookies
  res.cookies.set("sb-access-token", access_token, {
    maxAge: 60 * 60 * 24 * 7, // 7 dias
    path: "/",
    sameSite: "lax",
    httpOnly: true, // Seguro: não acessível via JavaScript
    secure: process.env.NODE_ENV === "production",
  });

  res.cookies.set("sb-refresh-token", refresh_token, {
    maxAge: 60 * 60 * 24 * 30, // 30 dias
    path: "/",
    sameSite: "lax",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });

  return res;
}
