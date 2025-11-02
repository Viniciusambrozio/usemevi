"use client";
import { useEffect, useState } from "react";
import React from "react";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<"loading" | "denied" | "ok">("loading");

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/auth/me", {
        credentials: "include",
      });
      const j = await res.json().catch(() => ({ user: null }));
      if (!j.user) {
        window.location.href = "/login";
        return;
      }
      if (j.user.role === "admin") setStatus("ok");
      else setStatus("denied");
    })();
  }, []);

  if (status === "loading") return <div className="p-4">Verificando acesso...</div>;
  if (status === "denied") return <div className="p-4">Acesso negado. Peça permissão a um administrador.</div>;
  return <>{children}</>;
}
