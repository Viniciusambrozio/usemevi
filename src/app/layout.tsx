import "@/styles/globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "Mevi Catálogo",
  description: "Catálogo mobile-first da usemevi",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-br" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <main className="main-content min-h-screen">{children}</main>
      </body>
    </html>
  );
}
