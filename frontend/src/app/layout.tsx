import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FindZarBPM",
  description: "Encuentra el tempo (BPM), la tonalidad y la métrica de tus canciones favoritas al instante o busca en tu repertorio propio.",
};

import { Navigation } from "@/components/Navigation";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark scroll-smooth">
      <body className={`${inter.className} min-h-screen bg-[#0a0f1c] text-slate-50 antialiased selection:bg-indigo-500/30 selection:text-indigo-200`}>
        <Navigation />
        <div className="pt-20">
          {children}
        </div>
      </body>
    </html>
  );
}
