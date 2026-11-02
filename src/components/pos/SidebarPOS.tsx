'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { usePos } from '@/context/PosContext';
import {
  LayoutDashboard,
  ShoppingBag,
  History,
  Layers,
  PackagePlus,
  RotateCcw,
  Clock,
  Clock4,
  Headphones,
  ChevronDown,
  Sparkles,
} from 'lucide-react';

export function SidebarPOS() {
  const {
    currentUser,
    setIsHistoryModalOpen,
    setIsMorningStockModalOpen,
    setIsStockModalOpen,
    setIsReturnStockModalOpen,
    setIsCashOpnameModalOpen,
    setIsOrderModalOpen,
  } = usePos();

  return (
    <aside className="w-56 lg:w-60 h-screen bg-[#1A6B51] dark:bg-[#0E3D2E] text-white flex flex-col justify-between p-4.5 shrink-0 select-none z-30 transition-colors duration-300 shadow-xl shadow-[#1A6B51]/15">
      {/* 1. Brand Logo Header */}
      <div>
        <div className="flex items-center gap-2.5 px-2.5 py-2 mb-6">
          <div className="w-9 h-9 rounded-xl bg-white/15 backdrop-blur-xs flex items-center justify-center border border-white/20 shadow-xs">
            <ShoppingBag className="w-5 h-5 text-white stroke-[2.2]" />
          </div>
          <div className="leading-tight">
            <h1 className="text-lg font-black tracking-tight text-white font-display">
              VITAMINE
            </h1>
            <span className="text-[10px] font-semibold text-white/70 tracking-wider uppercase block">
              Smart POS
            </span>
          </div>
        </div>

        {/* 2. Navigation Menu Links */}
        <nav className="space-y-1">
          {/* Active: Dashboard / POS */}
          <button
            type="button"
            className="w-full bg-white text-[#1A6B51] font-bold rounded-xl px-3.5 py-2.5 flex items-center gap-3 text-xs shadow-sm transition-all"
          >
            <LayoutDashboard className="w-4 h-4 stroke-[2.4]" />
            <span>Dashboard</span>
          </button>

          {/* Sales / Order Queue */}
          <button
            type="button"
            onClick={() => setIsOrderModalOpen(true)}
            className="w-full text-white/80 hover:text-white hover:bg-white/10 rounded-xl px-3.5 py-2.5 flex items-center gap-3 text-xs font-semibold transition-all cursor-pointer"
          >
            <Clock4 className="w-4 h-4 stroke-[2]" />
            <span>Antrian Pesanan</span>
          </button>

          {/* History */}
          <button
            type="button"
            onClick={() => setIsHistoryModalOpen(true)}
            className="w-full text-white/80 hover:text-white hover:bg-white/10 rounded-xl px-3.5 py-2.5 flex items-center gap-3 text-xs font-semibold transition-all cursor-pointer"
          >
            <History className="w-4 h-4 stroke-[2]" />
            <span>Riwayat Transaksi</span>
          </button>

          {/* Products & Inventory */}
          <button
            type="button"
            onClick={() => setIsStockModalOpen(true)}
            className="w-full text-white/80 hover:text-white hover:bg-white/10 rounded-xl px-3.5 py-2.5 flex items-center gap-3 text-xs font-semibold transition-all cursor-pointer"
          >
            <Layers className="w-4 h-4 stroke-[2]" />
            <span>Inventori Bahan</span>
          </button>

          {/* Morning Stock In */}
          <button
            type="button"
            onClick={() => setIsMorningStockModalOpen(true)}
            className="w-full text-white/80 hover:text-white hover:bg-white/10 rounded-xl px-3.5 py-2.5 flex items-center gap-3 text-xs font-semibold transition-all cursor-pointer"
          >
            <PackagePlus className="w-4 h-4 stroke-[2]" />
            <span>Stok Pagi Gudang</span>
          </button>

          {/* Return */}
          <button
            type="button"
            onClick={() => setIsReturnStockModalOpen(true)}
            className="w-full text-white/80 hover:text-white hover:bg-white/10 rounded-xl px-3.5 py-2.5 flex items-center gap-3 text-xs font-semibold transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 stroke-[2]" />
            <span>Retur Bahan</span>
          </button>

          {/* Cash Opname */}
          <button
            type="button"
            onClick={() => setIsCashOpnameModalOpen(true)}
            className="w-full text-white/80 hover:text-white hover:bg-white/10 rounded-xl px-3.5 py-2.5 flex items-center gap-3 text-xs font-semibold transition-all cursor-pointer"
          >
            <Clock className="w-4 h-4 stroke-[2]" />
            <span>Cash Opname Shift</span>
          </button>
        </nav>
      </div>

      {/* 3. Bottom: Need Help Card & User Profile */}
      <div className="space-y-3">
        {/* Need Help Card (Exact reference style) */}
        <div className="p-3 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-xs flex items-center gap-3 cursor-pointer hover:bg-white/15 transition-all">
          <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
            <Headphones className="w-4 h-4 text-white" />
          </div>
          <div className="leading-tight min-w-0">
            <h4 className="text-xs font-bold text-white truncate">Need Help?</h4>
            <span className="text-[10px] text-white/70 truncate block">Hubungi support</span>
          </div>
        </div>

        {/* User Profile Capsule (Exact reference style) */}
        <div className="pt-2 border-t border-white/15 flex items-center justify-between px-1">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-white text-[#1A6B51] font-black text-xs flex items-center justify-center shadow-xs shrink-0">
              {currentUser.name.slice(0, 2).toUpperCase()}
            </div>
            <div className="leading-tight min-w-0">
              <p className="text-xs font-bold text-white truncate">{currentUser.name}</p>
              <span className="text-[10px] text-white/70 capitalize block">
                {currentUser.role.toLowerCase()}
              </span>
            </div>
          </div>
          <ChevronDown className="w-4 h-4 text-white/60 shrink-0" />
        </div>
      </div>
    </aside>
  );
}
