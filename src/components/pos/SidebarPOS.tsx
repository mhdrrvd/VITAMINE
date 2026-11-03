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
    isHistoryModalOpen,
    setIsHistoryModalOpen,
    isMorningStockModalOpen,
    setIsMorningStockModalOpen,
    isStockModalOpen,
    setIsStockModalOpen,
    isReturnStockModalOpen,
    setIsReturnStockModalOpen,
    isCashOpnameModalOpen,
    setIsCashOpnameModalOpen,
  } = usePos();

  const isDashboardActive =
    !isHistoryModalOpen &&
    !isMorningStockModalOpen &&
    !isStockModalOpen &&
    !isReturnStockModalOpen &&
    !isCashOpnameModalOpen;

  const navigateTo = (view: 'DASHBOARD' | 'HISTORY' | 'MORNING_STOCK' | 'STOCK' | 'RETURN_STOCK' | 'CASH_OPNAME') => {
    setIsHistoryModalOpen(view === 'HISTORY');
    setIsMorningStockModalOpen(view === 'MORNING_STOCK');
    setIsStockModalOpen(view === 'STOCK');
    setIsReturnStockModalOpen(view === 'RETURN_STOCK');
    setIsCashOpnameModalOpen(view === 'CASH_OPNAME');
  };

  return (
    <nav
      aria-label="Floating POS Navbar"
      className="fixed left-3 top-1/2 -translate-y-1/2 z-50 bg-[#0B1E19]/95 backdrop-blur-xl px-1.5 py-2 rounded-2xl shadow-xl shadow-black/50 border border-white/10 flex flex-col items-center gap-1.5 select-none transition-all duration-200"
    >
      {/* 1. Dashboard (Active POS View) */}
      <div className="relative group flex items-center">
        <button
          type="button"
          onClick={() => navigateTo('DASHBOARD')}
          title="Dashboard POS"
          className={`btn-kilat relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-150 cursor-pointer overflow-hidden ${
            isDashboardActive
              ? 'bg-white text-[#0B1E19] shadow-md font-bold scale-105'
              : 'text-white/70 hover:text-white hover:bg-white/10'
          }`}
        >
          <LayoutGrid className="w-4.5 h-4.5 stroke-[2.2]" />
        </button>
        <span className="absolute left-full ml-2.5 px-2 py-1 rounded-md bg-slate-950/95 text-white text-[11px] font-medium whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-md border border-white/10 backdrop-blur-xs">
          Dashboard POS
        </span>
      </div>

      {/* Minimalist Divider */}
      <div className="w-5 h-[1px] bg-white/10 my-0.5" />

      {/* 2. History */}
      <div className="relative group flex items-center">
        <button
          type="button"
          onClick={() => navigateTo('HISTORY')}
          title="Riwayat Penjualan"
          className={`btn-kilat relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-150 cursor-pointer overflow-hidden ${
            isHistoryModalOpen
              ? 'bg-white text-[#0B1E19] shadow-md font-bold scale-105'
              : 'text-white/70 hover:text-white hover:bg-white/10'
          }`}
        >
          <History className="w-4.5 h-4.5 stroke-[2]" />
        </button>
        <span className="absolute left-full ml-2.5 px-2 py-1 rounded-md bg-slate-950/95 text-white text-[11px] font-medium whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-md border border-white/10 backdrop-blur-xs">
          Riwayat Penjualan
        </span>
      </div>

      {/* 3. Order Stock */}
      <div className="relative group flex items-center">
        <button
          type="button"
          onClick={() => navigateTo('MORNING_STOCK')}
          title="Order Bahan Baku"
          className={`btn-kilat relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-150 cursor-pointer overflow-hidden ${
            isMorningStockModalOpen
              ? 'bg-white text-[#0B1E19] shadow-md font-bold scale-105'
              : 'text-white/70 hover:text-white hover:bg-white/10'
          }`}
        >
          <PackagePlus className="w-4.5 h-4.5 stroke-[2]" />
        </button>
        <span className="absolute left-full ml-2.5 px-2 py-1 rounded-md bg-slate-950/95 text-white text-[11px] font-medium whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-md border border-white/10 backdrop-blur-xs">
          Order Bahan Baku
        </span>
      </div>

      {/* 4. Inventory */}
      <div className="relative group flex items-center">
        <button
          type="button"
          onClick={() => navigateTo('STOCK')}
          title="Status Stok Real-Time"
          className={`btn-kilat relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-150 cursor-pointer overflow-hidden ${
            isStockModalOpen
              ? 'bg-white text-[#0B1E19] shadow-md font-bold scale-105'
              : 'text-white/70 hover:text-white hover:bg-white/10'
          }`}
        >
          <Layers className="w-4.5 h-4.5 stroke-[2]" />
        </button>
        <span className="absolute left-full ml-2.5 px-2 py-1 rounded-md bg-slate-950/95 text-white text-[11px] font-medium whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-md border border-white/10 backdrop-blur-xs">
          Status Stok
        </span>
      </div>

      {/* 5. Return Stock */}
      <div className="relative group flex items-center">
        <button
          type="button"
          onClick={() => navigateTo('RETURN_STOCK')}
          title="Return Bahan Baku"
          className={`btn-kilat relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-150 cursor-pointer overflow-hidden ${
            isReturnStockModalOpen
              ? 'bg-white text-[#0B1E19] shadow-md font-bold scale-105'
              : 'text-white/70 hover:text-white hover:bg-white/10'
          }`}
        >
          <RotateCcw className="w-4.5 h-4.5 stroke-[2]" />
        </button>
        <span className="absolute left-full ml-2.5 px-2 py-1 rounded-md bg-slate-950/95 text-white text-[11px] font-medium whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-md border border-white/10 backdrop-blur-xs">
          Return Bahan Baku
        </span>
      </div>

      {/* 6. Cash Opname */}
      <div className="relative group flex items-center">
        <button
          type="button"
          onClick={() => navigateTo('CASH_OPNAME')}
          title="Serah Terima Shift & Kas Opname"
          className={`btn-kilat relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-150 cursor-pointer overflow-hidden ${
            isCashOpnameModalOpen
              ? 'bg-white text-[#0B1E19] shadow-md font-bold scale-105'
              : 'text-white/70 hover:text-white hover:bg-white/10'
          }`}
        >
          <Calculator className="w-4.5 h-4.5 stroke-[2]" />
        </button>
        <span className="absolute left-full ml-2.5 px-2 py-1 rounded-md bg-slate-950/95 text-white text-[11px] font-medium whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-md border border-white/10 backdrop-blur-xs">
          Cash Opname
        </span>
      </div>
    </nav>
  );
}