'use client';

import React from 'react';
import { usePos } from '@/context/PosContext';
import {
  LayoutGrid,
  History,
  PackagePlus,
  Layers,
  RotateCcw,
  Calculator,
} from 'lucide-react';

export function SidebarPOS() {
  const {
    setIsHistoryModalOpen,
    setIsMorningStockModalOpen,
    setIsStockModalOpen,
    setIsReturnStockModalOpen,
    setIsCashOpnameModalOpen,
  } = usePos();

  return (
    <nav
      aria-label="Floating POS Navbar"
      className="fixed left-3 top-1/2 -translate-y-1/2 z-50 bg-[#0B1E19]/90 backdrop-blur-xl px-1.5 py-2 rounded-2xl shadow-xl shadow-black/40 border border-white/10 flex flex-col items-center gap-1.5 select-none transition-all duration-200"
    >
      {/* 1. Dashboard (Active) */}
      <div className="relative group flex items-center">
        <button
          type="button"
          title="Dashboard"
          className="btn-kilat relative w-10 h-10 rounded-xl bg-white text-[#0B1E19] flex items-center justify-center shadow-xs font-bold transition-all duration-150 hover:scale-105 active:scale-95 cursor-pointer overflow-hidden"
        >
          <LayoutGrid className="w-4.5 h-4.5 stroke-[2.2]" />
        </button>
        {/* Minimalist Tooltip */}
        <span className="absolute left-full ml-2.5 px-2 py-1 rounded-md bg-slate-950/95 text-white text-[11px] font-medium whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-md border border-white/10 backdrop-blur-xs">
          Dashboard
        </span>
      </div>

      {/* Minimalist Divider */}
      <div className="w-5 h-[1px] bg-white/10 my-0.5" />

      {/* 2. History */}
      <div className="relative group flex items-center">
        <button
          type="button"
          onClick={() => setIsHistoryModalOpen(true)}
          title="History"
          className="btn-kilat relative w-10 h-10 rounded-xl text-white/70 hover:text-white hover:bg-white/10 flex items-center justify-center transition-all duration-150 hover:scale-105 active:scale-95 cursor-pointer overflow-hidden"
        >
          <History className="w-4.5 h-4.5 stroke-[1.8]" />
        </button>
        <span className="absolute left-full ml-2.5 px-2 py-1 rounded-md bg-slate-950/95 text-white text-[11px] font-medium whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-md border border-white/10 backdrop-blur-xs">
          History
        </span>
      </div>

      {/* 3. Order Stock */}
      <div className="relative group flex items-center">
        <button
          type="button"
          onClick={() => setIsMorningStockModalOpen(true)}
          title="Order Stock"
          className="btn-kilat relative w-10 h-10 rounded-xl text-white/70 hover:text-white hover:bg-white/10 flex items-center justify-center transition-all duration-150 hover:scale-105 active:scale-95 cursor-pointer overflow-hidden"
        >
          <PackagePlus className="w-4.5 h-4.5 stroke-[1.8]" />
        </button>
        <span className="absolute left-full ml-2.5 px-2 py-1 rounded-md bg-slate-950/95 text-white text-[11px] font-medium whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-md border border-white/10 backdrop-blur-xs">
          Order Stock
        </span>
      </div>

      {/* 4. Inventory */}
      <div className="relative group flex items-center">
        <button
          type="button"
          onClick={() => setIsStockModalOpen(true)}
          title="Inventory"
          className="btn-kilat relative w-10 h-10 rounded-xl text-white/70 hover:text-white hover:bg-white/10 flex items-center justify-center transition-all duration-150 hover:scale-105 active:scale-95 cursor-pointer overflow-hidden"
        >
          <Layers className="w-4.5 h-4.5 stroke-[1.8]" />
        </button>
        <span className="absolute left-full ml-2.5 px-2 py-1 rounded-md bg-slate-950/95 text-white text-[11px] font-medium whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-md border border-white/10 backdrop-blur-xs">
          Inventory
        </span>
      </div>

      {/* 5. Return Stock */}
      <div className="relative group flex items-center">
        <button
          type="button"
          onClick={() => setIsReturnStockModalOpen(true)}
          title="Return Stock"
          className="btn-kilat relative w-10 h-10 rounded-xl text-white/70 hover:text-white hover:bg-white/10 flex items-center justify-center transition-all duration-150 hover:scale-105 active:scale-95 cursor-pointer overflow-hidden"
        >
          <RotateCcw className="w-4.5 h-4.5 stroke-[1.8]" />
        </button>
        <span className="absolute left-full ml-2.5 px-2 py-1 rounded-md bg-slate-950/95 text-white text-[11px] font-medium whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-md border border-white/10 backdrop-blur-xs">
          Return Stock
        </span>
      </div>

      {/* 6. Cash Opname */}
      <div className="relative group flex items-center">
        <button
          type="button"
          onClick={() => setIsCashOpnameModalOpen(true)}
          title="Cash Opname"
          className="btn-kilat relative w-10 h-10 rounded-xl text-white/70 hover:text-white hover:bg-white/10 flex items-center justify-center transition-all duration-150 hover:scale-105 active:scale-95 cursor-pointer overflow-hidden"
        >
          <Calculator className="w-4.5 h-4.5 stroke-[1.8]" />
        </button>
        <span className="absolute left-full ml-2.5 px-2 py-1 rounded-md bg-slate-950/95 text-white text-[11px] font-medium whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-md border border-white/10 backdrop-blur-xs">
          Cash Opname
        </span>
      </div>
    </nav>
  );
}