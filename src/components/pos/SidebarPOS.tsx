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
      className="fixed top-3.5 left-1/2 -translate-x-1/2 z-50 bg-[#1A6B51]/95 dark:bg-[#0E3D2E]/95 backdrop-blur-md p-1.5 rounded-2xl shadow-xl shadow-black/20 border border-white/20 flex items-center gap-1.5 select-none transition-all duration-200"
    >
      {/* 1. Dashboard (Active) */}
      <button
        type="button"
        title="Dashboard"
        className="relative group w-10 h-10 rounded-xl bg-white text-[#1A6B51] flex items-center justify-center shadow-sm font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer"
      >
        <LayoutGrid className="w-5 h-5 stroke-[2.4]" />
        {/* Floating Tooltip below */}
        <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-md bg-slate-900 text-white text-[11px] font-semibold whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-md">
          Dashboard
        </span>
      </button>

      {/* 2. History */}
      <button
        type="button"
        onClick={() => setIsHistoryModalOpen(true)}
        title="History"
        className="relative group w-10 h-10 rounded-xl text-white/85 hover:text-white hover:bg-white/15 flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer"
      >
        <History className="w-5 h-5 stroke-[2]" />
        <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-md bg-slate-900 text-white text-[11px] font-semibold whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-md">
          History
        </span>
      </button>

      {/* 3. Order Stock */}
      <button
        type="button"
        onClick={() => setIsMorningStockModalOpen(true)}
        title="Order Stock"
        className="relative group w-10 h-10 rounded-xl text-white/85 hover:text-white hover:bg-white/15 flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer"
      >
        <PackagePlus className="w-5 h-5 stroke-[2]" />
        <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-md bg-slate-900 text-white text-[11px] font-semibold whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-md">
          Order Stock
        </span>
      </button>

      {/* 4. Inventory */}
      <button
        type="button"
        onClick={() => setIsStockModalOpen(true)}
        title="Inventory"
        className="relative group w-10 h-10 rounded-xl text-white/85 hover:text-white hover:bg-white/15 flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer"
      >
        <Layers className="w-5 h-5 stroke-[2]" />
        <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-md bg-slate-900 text-white text-[11px] font-semibold whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-md">
          Inventory
        </span>
      </button>

      {/* 5. Return Stock */}
      <button
        type="button"
        onClick={() => setIsReturnStockModalOpen(true)}
        title="Return Stock"
        className="relative group w-10 h-10 rounded-xl text-white/85 hover:text-white hover:bg-white/15 flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer"
      >
        <RotateCcw className="w-5 h-5 stroke-[2]" />
        <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-md bg-slate-900 text-white text-[11px] font-semibold whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-md">
          Return Stock
        </span>
      </button>
    </nav>
  );
}
