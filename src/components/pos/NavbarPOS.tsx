'use client';

import React from 'react';
import { usePos } from '@/context/PosContext';
import {
  Sparkles,
  Search,
  Layers,
  ArrowDownToLine,
  RotateCcw,
  LogOut,
  Printer,
  Monitor,
  AlertTriangle,
} from 'lucide-react';

export function NavbarPOS() {
  const {
    currentUser,
    currentShift,
    searchQuery,
    setSearchQuery,
    setIsStockModalOpen,
    setIsMorningStockModalOpen,
    setIsReturnStockModalOpen,
    setIsCashOpnameModalOpen,
    ingredients,
  } = usePos();

  // Count ingredients with low stock
  const lowStockCount = ingredients.filter(
    (ing) => ing.currentStock <= ing.minStockAlert
  ).length;

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between gap-4 sticky top-0 z-30 select-none">
      {/* Brand & Shift Info */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-orange-500 text-white flex items-center justify-center font-extrabold text-lg shadow-sm">
            V
          </div>
          <div>
            <h1 className="font-extrabold text-slate-900 leading-none tracking-tight text-lg">
              VITAMINE
            </h1>
            <span className="text-[10px] text-slate-500 font-medium tracking-wider uppercase">
              Fresh Juice POS
            </span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-lg text-xs font-semibold text-slate-700">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>Kasir: {currentUser.name}</span>
          <span className="text-slate-400">|</span>
          <span className="text-slate-500">
            {currentShift ? `Shift #${currentShift.id.slice(-4)}` : 'Shift Tutup'}
          </span>
        </div>
      </div>

      {/* Search Input (F2) */}
      <div className="flex-1 max-w-md relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          id="pos-search-input"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari menu buah... (F2)"
          className="w-full pl-9 pr-12 py-1.5 bg-slate-100 hover:bg-slate-150 focus:bg-white border border-transparent focus:border-orange-500 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none transition-all"
        />
        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-bold text-slate-500 shadow-2xs">
          F2
        </kbd>
      </div>

      {/* Operational Actions */}
      <div className="flex items-center gap-2">
        {/* Real-time Stock Checker Button (F4) */}
        <button
          onClick={() => setIsStockModalOpen(true)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
            lowStockCount > 0
              ? 'bg-amber-50 border-amber-300 text-amber-700 hover:bg-amber-100'
              : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
          }`}
          title="Cek Stok Real-Time (F4)"
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Stok</span>
          {lowStockCount > 0 ? (
            <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-white text-[10px]">
              {lowStockCount}
            </span>
          ) : (
            <kbd className="px-1 py-0.2 bg-white rounded text-[9px] font-mono border border-slate-200">
              F4
            </kbd>
          )}
        </button>

        {/* Morning Stock In */}
        <button
          onClick={() => setIsMorningStockModalOpen(true)}
          className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-semibold text-slate-700 transition-all"
          title="Input Penerimaan Stok Pagi"
        >
          <ArrowDownToLine className="w-3.5 h-3.5 text-emerald-600" />
          <span>Stok Pagi</span>
        </button>

        {/* Retur Stok */}
        <button
          onClick={() => setIsReturnStockModalOpen(true)}
          className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-semibold text-slate-700 transition-all"
          title="Retur Sisa Bahan Baku"
        >
          <RotateCcw className="w-3.5 h-3.5 text-rose-500" />
          <span>Retur</span>
        </button>

        {/* Hardware Status Indicators */}
        <div className="hidden sm:flex items-center gap-3 px-2 border-l border-r border-slate-200">
          <div className="flex items-center gap-1 text-[11px] font-medium text-emerald-700" title="Printer Thermal 58mm: Siap">
            <Printer className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden xl:inline">58mm</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-medium text-emerald-700" title="Display Pelanggan: Terhubung">
            <Monitor className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden xl:inline">Dual-Screen</span>
          </div>
        </div>

        {/* Tutup Shift & Cash Opname */}
        <button
          onClick={() => setIsCashOpnameModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-sm"
          title="Serah Terima Shift & Cash Opname"
        >
          <LogOut className="w-3.5 h-3.5 text-orange-400" />
          <span>Tutup Shift</span>
        </button>
      </div>
    </header>
  );
}

