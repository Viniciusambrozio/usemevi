import { NextRequest, NextResponse } from "next/server";
import { createMiddlewareSupabaseClient } from "@/lib/supabaseClient";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  
  if (pathname.startsWith("/admin")) {
    const res = NextResponse.next();
    const { supabase } = createMiddlewareSupabaseClient(req, res);
    
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error || !user) {
        const url = req.nextUrl.clone();
        url.pathname = "/login";
        return NextResponse.redirect(url);
      }

      // Verifica role do usuário
      const userRole = user.user_metadata?.role || user.app_metadata?.role;
      
      if (userRole !== "admin") {
        const url = req.nextUrl.clone();
        url.pathname = "/login";
        return NextResponse.redirect(url);
      }
      
      return res;
    } catch {
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
