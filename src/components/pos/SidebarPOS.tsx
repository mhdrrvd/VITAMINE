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
      className="fixed left-4 top-1/2 -translate-y-1/2 z-50 bg-[#1A6B51]/95 dark:bg-[#0E3D2E]/95 backdrop-blur-md px-3 py-4 rounded-3xl shadow-2xl shadow-[#1A6B51]/25 border border-white/20 flex flex-col items-center gap-3.5 select-none transition-all duration-200"
    >
      {/* 1. Dashboard (Active) */}
      <div className="relative group flex items-center">
        <button
          type="button"
          title="Dashboard"
          className="btn-kilat relative w-12 h-12 rounded-2xl bg-white text-[#1A6B51] p-3 flex items-center justify-center shadow-md shadow-black/10 font-bold transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-white/30 active:scale-95 cursor-pointer overflow-hidden"
        >
          <LayoutGrid className="w-5 h-5 stroke-[2.4]" />
        </button>
        {/* Floating Tooltip to the right */}
        <span className="absolute left-full ml-3 px-2.5 py-1 rounded-lg bg-slate-900 text-white text-xs font-semibold whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-md border border-white/10">
          Dashboard
        </span>
      </div>

      {/* 2. History */}
      <div className="relative group flex items-center">
        <button
          type="button"
          onClick={() => setIsHistoryModalOpen(true)}
          title="History"
          className="btn-kilat relative w-12 h-12 rounded-2xl text-white/85 hover:text-white hover:bg-white/20 hover:border hover:border-white/30 hover:shadow-md hover:shadow-white/10 p-3 flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer overflow-hidden border border-transparent"
        >
          <History className="w-5 h-5 stroke-[2]" />
        </button>
        <span className="absolute left-full ml-3 px-2.5 py-1 rounded-lg bg-slate-900 text-white text-xs font-semibold whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-md border border-white/10">
          History
        </span>
      </div>

      {/* 3. Order Stock */}
      <div className="relative group flex items-center">
        <button
          type="button"
          onClick={() => setIsMorningStockModalOpen(true)}
          title="Order Stock"
          className="btn-kilat relative w-12 h-12 rounded-2xl text-white/85 hover:text-white hover:bg-white/20 hover:border hover:border-white/30 hover:shadow-md hover:shadow-white/10 p-3 flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer overflow-hidden border border-transparent"
        >
          <PackagePlus className="w-5 h-5 stroke-[2]" />
        </button>
        <span className="absolute left-full ml-3 px-2.5 py-1 rounded-lg bg-slate-900 text-white text-xs font-semibold whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-md border border-white/10">
          Order Stock
        </span>
      </div>

      {/* 4. Inventory */}
      <div className="relative group flex items-center">
        <button
          type="button"
          onClick={() => setIsStockModalOpen(true)}
          title="Inventory"
          className="btn-kilat relative w-12 h-12 rounded-2xl text-white/85 hover:text-white hover:bg-white/20 hover:border hover:border-white/30 hover:shadow-md hover:shadow-white/10 p-3 flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer overflow-hidden border border-transparent"
        >
          <Layers className="w-5 h-5 stroke-[2]" />
        </button>
        <span className="absolute left-full ml-3 px-2.5 py-1 rounded-lg bg-slate-900 text-white text-xs font-semibold whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-md border border-white/10">
          Inventory
        </span>
      </div>

      {/* 5. Return Stock */}
      <div className="relative group flex items-center">
        <button
          type="button"
          onClick={() => setIsReturnStockModalOpen(true)}
          title="Return Stock"
          className="btn-kilat relative w-12 h-12 rounded-2xl text-white/85 hover:text-white hover:bg-white/20 hover:border hover:border-white/30 hover:shadow-md hover:shadow-white/10 p-3 flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer overflow-hidden border border-transparent"
        >
          <RotateCcw className="w-5 h-5 stroke-[2]" />
        </button>
        <span className="absolute left-full ml-3 px-2.5 py-1 rounded-lg bg-slate-900 text-white text-xs font-semibold whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-md border border-white/10">
          Return Stock
        </span>
      </div>

      {/* 6. Cash Opname */}
      <div className="relative group flex items-center">
        <button
          type="button"
          onClick={() => setIsCashOpnameModalOpen(true)}
          title="Cash Opname"
          className="btn-kilat relative w-12 h-12 rounded-2xl text-white/85 hover:text-white hover:bg-white/20 hover:border hover:border-white/30 hover:shadow-md hover:shadow-white/10 p-3 flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer overflow-hidden border border-transparent"
        >
          <Calculator className="w-5 h-5 stroke-[2]" />
        </button>
        <span className="absolute left-full ml-3 px-2.5 py-1 rounded-lg bg-slate-900 text-white text-xs font-semibold whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-md border border-white/10">
          Cash Opname
        </span>
      </div>
    </nav>
  );
}