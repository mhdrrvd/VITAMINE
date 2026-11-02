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
    <nav
      aria-label="Floating POS Navbar"
      className="fixed left-4 top-1/2 -translate-y-1/2 z-50 bg-[#1A6B51]/95 dark:bg-[#0E3D2E]/95 backdrop-blur-md px-3 py-4 rounded-3xl shadow-2xl shadow-[#1A6B51]/25 border border-white/20 flex flex-col items-center gap-3.5 select-none transition-all duration-200"
    >
      {/* 1. Dashboard (Active) */}
      <button
        type="button"
        title="Dashboard"
        className="relative group w-12 h-12 rounded-2xl bg-white text-[#1A6B51] p-3 flex items-center justify-center shadow-md shadow-black/10 font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer"
      >
        <LayoutGrid className="w-5 h-5 stroke-[2.4]" />
        {/* Floating Tooltip to the right */}
        <span className="absolute left-full ml-4 px-2.5 py-1 rounded-lg bg-slate-900 text-white text-xs font-semibold whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-md">
          Dashboard
        </span>
      </button>

      {/* 2. History */}
      <button
        type="button"
        onClick={() => setIsHistoryModalOpen(true)}
        title="History"
        className="relative group w-12 h-12 rounded-2xl text-white/85 hover:text-white hover:bg-white/15 p-3 flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer"
      >
        <History className="w-5 h-5 stroke-[2]" />
        <span className="absolute left-full ml-4 px-2.5 py-1 rounded-lg bg-slate-900 text-white text-xs font-semibold whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-md">
          History
        </span>
      </button>

      {/* 3. Order Stock */}
      <button
        type="button"
        onClick={() => setIsMorningStockModalOpen(true)}
        title="Order Stock"
        className="relative group w-12 h-12 rounded-2xl text-white/85 hover:text-white hover:bg-white/15 p-3 flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer"
      >
        <PackagePlus className="w-5 h-5 stroke-[2]" />
        <span className="absolute left-full ml-4 px-2.5 py-1 rounded-lg bg-slate-900 text-white text-xs font-semibold whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-md">
          Order Stock
        </span>
      </button>

      {/* 4. Inventory */}
      <button
        type="button"
        onClick={() => setIsStockModalOpen(true)}
        title="Inventory"
        className="relative group w-12 h-12 rounded-2xl text-white/85 hover:text-white hover:bg-white/15 p-3 flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer"
      >
        <Layers className="w-5 h-5 stroke-[2]" />
        <span className="absolute left-full ml-4 px-2.5 py-1 rounded-lg bg-slate-900 text-white text-xs font-semibold whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-md">
          Inventory
        </span>
      </button>

      {/* 5. Return Stock */}
      <button
        type="button"
        onClick={() => setIsReturnStockModalOpen(true)}
        title="Return Stock"
        className="relative group w-12 h-12 rounded-2xl text-white/85 hover:text-white hover:bg-white/15 p-3 flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer"
      >
        <RotateCcw className="w-5 h-5 stroke-[2]" />
        <span className="absolute left-full ml-4 px-2.5 py-1 rounded-lg bg-slate-900 text-white text-xs font-semibold whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-md">
          Return Stock
        </span>
      </button>
    </nav>
  );
}
