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
      <button
        type="button"
        onClick={() => navigateTo('DASHBOARD')}
        aria-label="Dashboard POS"
        className={`btn-kilat relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-150 cursor-pointer overflow-hidden ${
          isDashboardActive
            ? 'bg-[#00B14F] text-white shadow-lg shadow-[#00B14F]/40 font-bold scale-105'
            : 'text-white/70 hover:text-white hover:bg-[#00B14F] hover:scale-105 hover:shadow-lg hover:shadow-[#00B14F]/40'
        }`}
      >
        <LayoutGrid className="w-4.5 h-4.5 stroke-[2.2]" />
      </button>

      {/* Minimalist Divider */}
      <div className="w-5 h-[1px] bg-white/10 my-0.5" />

      {/* 2. History */}
      <button
        type="button"
        onClick={() => navigateTo('HISTORY')}
        aria-label="Riwayat Penjualan"
        className={`btn-kilat relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-150 cursor-pointer overflow-hidden ${
          isHistoryModalOpen
            ? 'bg-[#00B14F] text-white shadow-lg shadow-[#00B14F]/40 font-bold scale-105'
            : 'text-white/70 hover:text-white hover:bg-[#00B14F] hover:scale-105 hover:shadow-lg hover:shadow-[#00B14F]/40'
        }`}
      >
        <History className="w-4.5 h-4.5 stroke-[2]" />
      </button>

      {/* 3. Order Stock */}
      <button
        type="button"
        onClick={() => navigateTo('MORNING_STOCK')}
        aria-label="Order Bahan Baku"
        className={`btn-kilat relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-150 cursor-pointer overflow-hidden ${
          isMorningStockModalOpen
            ? 'bg-[#00B14F] text-white shadow-lg shadow-[#00B14F]/40 font-bold scale-105'
            : 'text-white/70 hover:text-white hover:bg-[#00B14F] hover:scale-105 hover:shadow-lg hover:shadow-[#00B14F]/40'
        }`}
      >
        <PackagePlus className="w-4.5 h-4.5 stroke-[2]" />
      </button>

      {/* 4. Inventory */}
      <button
        type="button"
        onClick={() => navigateTo('STOCK')}
        aria-label="Status Stok Real-Time"
        className={`btn-kilat relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-150 cursor-pointer overflow-hidden ${
          isStockModalOpen
            ? 'bg-[#00B14F] text-white shadow-lg shadow-[#00B14F]/40 font-bold scale-105'
            : 'text-white/70 hover:text-white hover:bg-[#00B14F] hover:scale-105 hover:shadow-lg hover:shadow-[#00B14F]/40'
        }`}
      >
        <Layers className="w-4.5 h-4.5 stroke-[2]" />
      </button>

      {/* 5. Return Stock */}
      <button
        type="button"
        onClick={() => navigateTo('RETURN_STOCK')}
        aria-label="Return Bahan Baku"
        className={`btn-kilat relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-150 cursor-pointer overflow-hidden ${
          isReturnStockModalOpen
            ? 'bg-[#00B14F] text-white shadow-lg shadow-[#00B14F]/40 font-bold scale-105'
            : 'text-white/70 hover:text-white hover:bg-[#00B14F] hover:scale-105 hover:shadow-lg hover:shadow-[#00B14F]/40'
        }`}
      >
        <RotateCcw className="w-4.5 h-4.5 stroke-[2]" />
      </button>

      {/* 6. Cash Opname */}
      <button
        type="button"
        onClick={() => navigateTo('CASH_OPNAME')}
        aria-label="Serah Terima Shift & Kas Opname"
        className={`btn-kilat relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-150 cursor-pointer overflow-hidden ${
          isCashOpnameModalOpen
            ? 'bg-[#00B14F] text-white shadow-lg shadow-[#00B14F]/40 font-bold scale-105'
            : 'text-white/70 hover:text-white hover:bg-[#00B14F] hover:scale-105 hover:shadow-lg hover:shadow-[#00B14F]/40'
        }`}
      >
        <Calculator className="w-4.5 h-4.5 stroke-[2]" />
      </button>
    </nav>
  );
}