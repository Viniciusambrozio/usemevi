import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { NextRequest, NextResponse } from "next/server";

// Cliente para uso no cliente (browser)
export function createBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createSupabaseClient(url, anon, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
}

// Cliente para uso no servidor (Server Components)
export async function createServerSupabaseClient() {
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  
  const supabase = createSupabaseClient(url, anon, {
    auth: {
      persistSession: false,
    },
  });

  // Pega o access_token dos cookies
  const accessToken = cookieStore.get("sb-access-token")?.value;
  const refreshToken = cookieStore.get("sb-refresh-token")?.value;

  if (accessToken && refreshToken) {
    await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });
  }

  return supabase;
}

// Cliente para middleware
export function createMiddlewareSupabaseClient(req: NextRequest, res: NextResponse) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  
  const supabase = createSupabaseClient(url, anon, {
    auth: {
      persistSession: false,
    },
  });

  const accessToken = req.cookies.get("sb-access-token")?.value;
  const refreshToken = req.cookies.get("sb-refresh-token")?.value;

  if (accessToken && refreshToken) {
    supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    }).catch(() => {});
  }

  return { supabase, res };
}

// Função auxiliar para compatibilidade (retorna cliente browser)
export function createClient() {
  return createBrowserClient();
}
