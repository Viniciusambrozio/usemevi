import { NextRequest, NextResponse } from "next/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  try {
    const { id, email, name, role, password } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "ID do usuário é obrigatório" }, { status: 400 });
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    if (!serviceRoleKey) {
      return NextResponse.json({ error: "Service Role Key não configurada" }, { status: 500 });
    }

    const supabaseAdmin = createSupabaseClient(url, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const updateData: any = {
      user_metadata: {
        name: name || undefined,
        role: role || "vendedor",
      },
    };

    if (email) {
      updateData.email = email;
    }

    if (password) {
      updateData.password = password;
    }

    const { error } = await supabaseAdmin.auth.admin.updateUserById(id, updateData);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

