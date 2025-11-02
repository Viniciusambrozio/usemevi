"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Home, Heart, ShoppingBag, User } from "lucide-react";

export function NavbarBottom() {
  const pathname = usePathname();
  const items = [
    { href: "/", label: "Home", icon: Home },
    { href: "/favorites", label: "Favoritos", icon: Heart },
    { href: "/cart", label: "Carrinho", icon: ShoppingBag },
    { href: "/profile", label: "Perfil", icon: User },
  ];
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-3 z-40">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {items.map((it) => {
          const Icon = it.icon;
          const isActive = pathname === it.href;
          return (
            <Link key={it.href} href={it.href} className="flex flex-col items-center gap-1 p-2">
              {isActive ? (
                <>
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-primary">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xs text-primary font-medium">{it.label}</span>
                </>
              ) : (
                <>
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-transparent">
                    <Icon className="w-5 h-5 text-gray-400" />
                  </div>
                  <span className="text-xs text-gray-400">{it.label}</span>
                </>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
