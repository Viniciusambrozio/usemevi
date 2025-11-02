"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LucideIcon } from "lucide-react";
import React from "react";

export function ActiveNavLink({ href, icon: Icon, children }: { href: string; icon: LucideIcon; children: React.ReactNode }) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(href + "/");

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
        isActive
          ? "bg-primary/10 text-primary font-semibold"
          : "text-gray-700 hover:bg-gray-50 hover:text-primary"
      }`}
    >
      <Icon className={`h-5 w-5 ${isActive ? "text-primary" : ""}`} />
      <span>{children}</span>
    </Link>
  );
}
