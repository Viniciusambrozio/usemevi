import { NextRequest, NextResponse } from "next/server";
import { createMiddlewareSupabaseClient } from "@/lib/supabaseClient";

export async function GET(req: NextRequest) {
  const res = NextResponse.next();
  const { supabase } = createMiddlewareSupabaseClient(req, res);
  
  try {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.json({ user: null });
    }

    const userRole = user.user_metadata?.role || user.app_metadata?.role;

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        role: userRole,
        name: user.user_metadata?.name || user.email?.split("@")[0],
      },
    });
  } catch {
    return NextResponse.json({ user: null });
  }
}
