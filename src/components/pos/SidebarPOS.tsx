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
      className="fixed left-4 top-1/2 -translate-y-1/2 z-50 px-2.5 py-4 rounded-[28px] flex flex-col items-center gap-3.5 select-none transition-all duration-200 overflow-hidden backdrop-blur-2xl bg-gradient-to-b from-[#1E5D47]/90 via-[#0F3D2E]/95 to-[#062017]/98 border border-white/30 border-t-white/55 border-b-black/40 shadow-[inset_0_2px_3px_rgba(255,255,255,0.45),inset_0_-2px_4px_rgba(0,0,0,0.6),0_20px_50px_rgba(0,0,0,0.7),0_0_25px_rgba(0,229,101,0.22)]"
    >
      {/* Glossy Specular Glass Reflection (Pantulan Kaca Mengkilap Bagian Atas) */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-36 rounded-t-[28px] bg-gradient-to-b from-white/30 via-white/10 to-transparent pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-3 top-1 h-[1.5px] bg-gradient-to-r from-transparent via-white/80 to-transparent pointer-events-none"
      />

      {/* 1. Dashboard (Active Glossy Squircle) */}
      <button
        type="button"
        title="Dashboard"
        className="relative group w-12 h-12 rounded-2xl p-3 flex items-center justify-center font-bold transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer overflow-hidden bg-gradient-to-b from-white via-[#F4FAF6] to-[#DDF7E8] border border-white border-t-white border-b-emerald-300/40 shadow-[inset_0_2px_2px_rgba(255,255,255,1),inset_0_-2px_3px_rgba(10,56,42,0.15),0_6px_18px_rgba(0,0,0,0.28),0_0_18px_rgba(0,229,101,0.4)]"
      >
        {/* Top gloss curve on active button */}
        <div
          aria-hidden="true"
          className="absolute inset-x-1.5 top-0.5 h-3.5 rounded-t-xl bg-gradient-to-b from-white/95 to-transparent pointer-events-none"
        />
        <LayoutGrid className="w-5 h-5 text-[#0A382A] stroke-[2.5] drop-shadow-[0_1px_1px_rgba(255,255,255,0.7)]" />
        {/* Floating Tooltip to the right */}
        <span className="absolute left-full ml-4 px-3 py-1.5 rounded-xl bg-slate-950/95 text-white text-xs font-bold whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-150 z-50 shadow-xl border border-white/15 backdrop-blur-md">
          Dashboard
        </span>
      </button>

      {/* 2. History */}
      <button
        type="button"
        onClick={() => setIsHistoryModalOpen(true)}
        title="History"
        className="relative group w-12 h-12 rounded-2xl text-white/85 p-3 flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer overflow-hidden border border-transparent hover:border-white/30 hover:border-t-white/60 hover:bg-gradient-to-b hover:from-white/25 hover:via-white/10 hover:to-white/5 hover:text-white hover:shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.4),0_6px_16px_rgba(0,0,0,0.35)]"
      >
        <History className="w-5 h-5 stroke-[2] drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]" />
        <span className="absolute left-full ml-4 px-3 py-1.5 rounded-xl bg-slate-950/95 text-white text-xs font-bold whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-150 z-50 shadow-xl border border-white/15 backdrop-blur-md">
          History
        </span>
      </button>

      {/* 3. Order Stock */}
      <button
        type="button"
        onClick={() => setIsMorningStockModalOpen(true)}
        title="Order Stock"
        className="relative group w-12 h-12 rounded-2xl text-white/85 p-3 flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer overflow-hidden border border-transparent hover:border-white/30 hover:border-t-white/60 hover:bg-gradient-to-b hover:from-white/25 hover:via-white/10 hover:to-white/5 hover:text-white hover:shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.4),0_6px_16px_rgba(0,0,0,0.35)]"
      >
        <PackagePlus className="w-5 h-5 stroke-[2] drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]" />
        <span className="absolute left-full ml-4 px-3 py-1.5 rounded-xl bg-slate-950/95 text-white text-xs font-bold whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-150 z-50 shadow-xl border border-white/15 backdrop-blur-md">
          Order Stock
        </span>
      </button>

      {/* 4. Inventory */}
      <button
        type="button"
        onClick={() => setIsStockModalOpen(true)}
        title="Inventory"
        className="relative group w-12 h-12 rounded-2xl text-white/85 p-3 flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer overflow-hidden border border-transparent hover:border-white/30 hover:border-t-white/60 hover:bg-gradient-to-b hover:from-white/25 hover:via-white/10 hover:to-white/5 hover:text-white hover:shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.4),0_6px_16px_rgba(0,0,0,0.35)]"
      >
        <Layers className="w-5 h-5 stroke-[2] drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]" />
        <span className="absolute left-full ml-4 px-3 py-1.5 rounded-xl bg-slate-950/95 text-white text-xs font-bold whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-150 z-50 shadow-xl border border-white/15 backdrop-blur-md">
          Inventory
        </span>
      </button>

      {/* 5. Return Stock */}
      <button
        type="button"
        onClick={() => setIsReturnStockModalOpen(true)}
        title="Return Stock"
        className="relative group w-12 h-12 rounded-2xl text-white/85 p-3 flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer overflow-hidden border border-transparent hover:border-white/30 hover:border-t-white/60 hover:bg-gradient-to-b hover:from-white/25 hover:via-white/10 hover:to-white/5 hover:text-white hover:shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.4),0_6px_16px_rgba(0,0,0,0.35)]"
      >
        <RotateCcw className="w-5 h-5 stroke-[2] drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]" />
        <span className="absolute left-full ml-4 px-3 py-1.5 rounded-xl bg-slate-950/95 text-white text-xs font-bold whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-150 z-50 shadow-xl border border-white/15 backdrop-blur-md">
          Return Stock
        </span>
      </button>

      {/* 6. Cash Opname */}
      <button
        type="button"
        onClick={() => setIsCashOpnameModalOpen(true)}
        title="Cash Opname"
        className="relative group w-12 h-12 rounded-2xl text-white/85 p-3 flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer overflow-hidden border border-transparent hover:border-white/30 hover:border-t-white/60 hover:bg-gradient-to-b hover:from-white/25 hover:via-white/10 hover:to-white/5 hover:text-white hover:shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.4),0_6px_16px_rgba(0,0,0,0.35)]"
      >
        <Calculator className="w-5 h-5 stroke-[2] drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]" />
        <span className="absolute left-full ml-4 px-3 py-1.5 rounded-xl bg-slate-950/95 text-white text-xs font-bold whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-150 z-50 shadow-xl border border-white/15 backdrop-blur-md">
          Cash Opname
        </span>
      </button>

      {/* Subtle bottom ambient neon glow indicator */}
      <div
        aria-hidden="true"
        className="w-5 h-1 rounded-full bg-[#00E565]/40 blur-[1px] mt-0.5 pointer-events-none"
      />
    </nav>
  );
}