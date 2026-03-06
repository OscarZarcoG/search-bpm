'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Music3, ListMusic, Search } from 'lucide-react';

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 z-50 w-full px-4 py-3 bg-[#0a0f1c]/80 backdrop-blur-md border-b border-white/5">
      <div className="flex items-center justify-between max-w-4xl mx-auto">
        <Link href="/" className="flex items-center space-x-2 text-indigo-400 hover:text-indigo-300 transition-colors">
          <Music3 className="w-6 h-6 sm:w-7 sm:h-7" />
          <span className="font-bold tracking-tight text-white hidden sm:block text-lg">FindZarBPM</span>
        </Link>
        
        <div className="flex items-center space-x-2">
          <Link href="/">
            <span className={`flex items-center px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-colors rounded-xl ${pathname === '/' ? 'bg-white/10 text-white' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}>
              <Search className="w-4 h-4 mr-1.5" />
              Buscador
            </span>
          </Link>
          <Link href="/mis-canciones">
            <span className={`flex items-center px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-colors border rounded-xl ${pathname === '/mis-canciones' ? 'bg-indigo-500/20 border-indigo-500/30 text-white' : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-300 hover:bg-indigo-500/20 hover:text-white'}`}>
              <ListMusic className="w-4 h-4 mr-1.5" />
              Mis Canciones
            </span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
