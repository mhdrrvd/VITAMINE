'use client';

import React from 'react';
import { usePos } from '@/context/PosContext';
import {
  LayoutGrid,
  History,
  PackagePlus,
  Layers,
  RotateCcw,
} from 'lucide-react';

export function SidebarPOS() {
  const {
    setIsHistoryModalOpen,
    setIsMorningStockModalOpen,
    setIsStockModalOpen,
    setIsReturnStockModalOpen,
  } = usePos();

  return (
    <aside className="w-20 h-screen bg-[#1A6B51] dark:bg-[#0E3D2E] text-white flex flex-col items-center py-6 px-3 shrink-0 select-none z-30 transition-colors duration-300 shadow-xl shadow-[#1A6B51]/15">
      {/* Navigation Menu Links (Icons Only with Hover Tooltips) */}
      <nav className="flex flex-col items-center gap-3 w-full">
        {/* 1. Dashboard (Active) */}
        <button
          type="button"
          title="Dashboard"
          className="relative group w-12 h-12 rounded-2xl bg-white text-[#1A6B51] flex items-center justify-center shadow-md shadow-black/10 transition-all hover:scale-105 active:scale-95 cursor-pointer"
        >
          <LayoutGrid className="w-5 h-5 stroke-[2.4]" />
          {/* Floating Tooltip */}
          <span className="absolute left-full ml-3 px-2.5 py-1 rounded-lg bg-slate-900 text-white text-xs font-semibold whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-lg">
            Dashboard
          </span>
        </button>

        {/* 2. History */}
        <button
          type="button"
          onClick={() => setIsHistoryModalOpen(true)}
          title="History"
          className="relative group w-12 h-12 rounded-2xl text-white/80 hover:text-white hover:bg-white/15 flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer"
        >
          <History className="w-5 h-5 stroke-[2]" />
          <span className="absolute left-full ml-3 px-2.5 py-1 rounded-lg bg-slate-900 text-white text-xs font-semibold whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-lg">
            History
          </span>
        </button>

        {/* 3. Order Stock */}
        <button
          type="button"
          onClick={() => setIsMorningStockModalOpen(true)}
          title="Order Stock"
          className="relative group w-12 h-12 rounded-2xl text-white/80 hover:text-white hover:bg-white/15 flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer"
        >
          <PackagePlus className="w-5 h-5 stroke-[2]" />
          <span className="absolute left-full ml-3 px-2.5 py-1 rounded-lg bg-slate-900 text-white text-xs font-semibold whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-lg">
            Order Stock
          </span>
        </button>

        {/* 4. Inventory */}
        <button
          type="button"
          onClick={() => setIsStockModalOpen(true)}
          title="Inventory"
          className="relative group w-12 h-12 rounded-2xl text-white/80 hover:text-white hover:bg-white/15 flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer"
        >
          <Layers className="w-5 h-5 stroke-[2]" />
          <span className="absolute left-full ml-3 px-2.5 py-1 rounded-lg bg-slate-900 text-white text-xs font-semibold whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-lg">
            Inventory
          </span>
        </button>

        {/* 5. Return Stock */}
        <button
          type="button"
          onClick={() => setIsReturnStockModalOpen(true)}
          title="Return Stock"
          className="relative group w-12 h-12 rounded-2xl text-white/80 hover:text-white hover:bg-white/15 flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer"
        >
          <RotateCcw className="w-5 h-5 stroke-[2]" />
          <span className="absolute left-full ml-3 px-2.5 py-1 rounded-lg bg-slate-900 text-white text-xs font-semibold whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-lg">
            Return Stock
          </span>
        </button>
      </nav>
    </aside>
  );
}
