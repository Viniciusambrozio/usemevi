import { NextRequest, NextResponse } from "next/server";
import { createMiddlewareSupabaseClient } from "@/lib/supabaseClient";

export async function POST(req: NextRequest) {
  const res = NextResponse.json({ success: true });
  const { supabase } = createMiddlewareSupabaseClient(req, res);
  
  await supabase.auth.signOut();

  // Remove cookies
  res.cookies.delete("sb-access-token");
  res.cookies.delete("sb-refresh-token");

  return res;
}
