import Link from 'next/link';
import { ShoppingBag, Monitor, BarChart3, Clock, CheckCircle2 } from 'lucide-react';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 sm:p-12">
      <div className="w-full max-w-4xl text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100 text-orange-700 text-sm font-semibold tracking-wide border border-orange-200">
          <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
          VITAMINE Smart POS v1.0 (MVP Ready)
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 font-display">
          Segar, Presisi & Terintegrasi
        </h1>
        <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto">
          Sistem kasir pintar berbasis resep bahan mentah buah (BOM), rekonsiliasi cash opname pergantian shift, dan display promo monitor pelanggan.
        </p>

        {/* Status verification cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 text-left">
          <Link
            href="/pos"
            className="group p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-orange-500 transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-orange-500 text-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-1">Terminal Kasir (POS)</h2>
            <p className="text-sm text-slate-500 mb-4">
              Katalog kartu buah visual, fast keyboard checkout (F2, F4, F8, Enter), dan cetak struk 58mm.
            </p>
            <span className="text-sm font-semibold text-orange-600 group-hover:underline">Buka Meja Kasir &rarr;</span>
          </Link>

          <Link
            href="/customer-display"
            className="group p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-500 transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-500 text-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Monitor className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-1">Customer Display</h2>
            <p className="text-sm text-slate-500 mb-4">
              Layar monitor kedua (menghadap pelanggan) menampilkan promo slider interaktif dan split cart preview.
            </p>
            <span className="text-sm font-semibold text-emerald-600 group-hover:underline">Buka Display Pelanggan &rarr;</span>
          </Link>

          <Link
            href="/dashboard"
            className="group p-6 rounded-2xl bg-slate-900 text-white border border-slate-800 shadow-sm hover:shadow-md hover:border-slate-700 transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-slate-800 text-orange-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-white mb-1">Dashboard Owner</h2>
            <p className="text-sm text-slate-400 mb-4">
              Analitik omzet live, rasio retur/waste bahan, rekapitulasi audit kasir, dan pengaturan promo GUI.
            </p>
            <span className="text-sm font-semibold text-orange-400 group-hover:underline">Masuk Dashboard &rarr;</span>
          </Link>
        </div>

        <div className="pt-8 border-t border-slate-200 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Next.js 16 + React 19 Engine</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Tailwind CSS v4 Design Tokens</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>ESC/POS 58mm Thermal Driver</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>BroadcastChannel Dual-Screen Sync</span>
          </div>
        </div>
      </div>
    </main>
  );
}

