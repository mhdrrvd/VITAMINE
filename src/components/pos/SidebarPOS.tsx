'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { usePos } from '@/context/PosContext';
import {
  ShoppingBag,
  Home,
  LayoutGrid,
  Clock,
  Layers,
  Sparkles,
  RotateCcw,
  Calculator,
  Compass,
  Monitor,
  Settings,
  HelpCircle,
} from 'lucide-react';

export function SidebarPOS() {
  const {
    currentUser,
    setIsStockModalOpen,
    setIsMorningStockModalOpen,
    setIsReturnStockModalOpen,
    setIsCashOpnameModalOpen,
  } = usePos();

  return (
    <aside className="w-20 bg-white border-r border-slate-100 flex flex-col justify-between items-center py-6 h-screen sticky top-0 shrink-0 select-none z-30 shadow-[1px_0_10px_rgba(0,0,0,0.02)]">
      {/* 1. Top Logo */}
      <div className="flex flex-col items-center gap-6">
        <motion.div
          whileHover={{ scale: 1.08, rotate: 4 }}
          whileTap={{ scale: 0.95 }}
          className="w-12 h-12 rounded-2xl bg-[#EAF5EF] text-[#1A6B51] flex items-center justify-center font-black shadow-xs cursor-pointer border border-[#8EB69B]/30"
          title="VITAMINE Juice Bar"
        >
          <ShoppingBag className="w-6 h-6 stroke-[2.2]" />
        </motion.div>

        {/* 2. Slim Vertical Navigation Rail */}
        <nav className="flex flex-col items-center gap-3 w-full px-2">
          {/* Active Kasir / Grid Icon */}
          <div className="relative group">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-11 h-11 rounded-2xl bg-[#1A6B51] text-white flex items-center justify-center shadow-md shadow-[#1A6B51]/20 cursor-pointer"
            >
              <LayoutGrid className="w-5 h-5 stroke-[2.2]" />
            </motion.div>
            <span className="absolute left-14 top-1/2 -translate-y-1/2 bg-[#051F20] text-white text-[11px] font-bold px-2.5 py-1 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-md">
              POS Kasir
            </span>
          </div>

          {/* Stok Pagi */}
          <div className="relative group">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={() => setIsMorningStockModalOpen(true)}
              className="w-11 h-11 rounded-2xl text-slate-400 hover:text-[#1A6B51] hover:bg-[#EAF5EF] flex items-center justify-center transition-colors"
            >
              <Sparkles className="w-5 h-5 stroke-[1.8]" />
            </motion.button>
            <span className="absolute left-14 top-1/2 -translate-y-1/2 bg-[#051F20] text-white text-[11px] font-bold px-2.5 py-1 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-md">
              Stok Pagi
            </span>
          </div>

          {/* Cek Stok Bahan (F4) */}
          <div className="relative group">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={() => setIsStockModalOpen(true)}
              className="w-11 h-11 rounded-2xl text-slate-400 hover:text-[#1A6B51] hover:bg-[#EAF5EF] flex items-center justify-center transition-colors"
            >
              <Layers className="w-5 h-5 stroke-[1.8]" />
            </motion.button>
            <span className="absolute left-14 top-1/2 -translate-y-1/2 bg-[#051F20] text-white text-[11px] font-bold px-2.5 py-1 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-md">
              Cek Stok (F4)
            </span>
          </div>

          {/* Retur Bahan */}
          <div className="relative group">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={() => setIsReturnStockModalOpen(true)}
              className="w-11 h-11 rounded-2xl text-slate-400 hover:text-[#1A6B51] hover:bg-[#EAF5EF] flex items-center justify-center transition-colors"
            >
              <RotateCcw className="w-5 h-5 stroke-[1.8]" />
            </motion.button>
            <span className="absolute left-14 top-1/2 -translate-y-1/2 bg-[#051F20] text-white text-[11px] font-bold px-2.5 py-1 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-md">
              Retur Bahan
            </span>
          </div>

          {/* Tutup Shift / Cash Opname */}
          <div className="relative group">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={() => setIsCashOpnameModalOpen(true)}
              className="w-11 h-11 rounded-2xl text-slate-400 hover:text-[#1A6B51] hover:bg-[#EAF5EF] flex items-center justify-center transition-colors"
            >
              <Clock className="w-5 h-5 stroke-[1.8]" />
            </motion.button>
            <span className="absolute left-14 top-1/2 -translate-y-1/2 bg-[#051F20] text-white text-[11px] font-bold px-2.5 py-1 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-md">
              Tutup Shift & Opname
            </span>
          </div>

          {/* Customer Display */}
          <div className="relative group">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/customer-display"
                target="_blank"
                className="w-11 h-11 rounded-2xl text-slate-400 hover:text-[#1A6B51] hover:bg-[#EAF5EF] flex items-center justify-center transition-colors block"
              >
                <Monitor className="w-5 h-5 stroke-[1.8]" />
              </Link>
            </motion.div>
            <span className="absolute left-14 top-1/2 -translate-y-1/2 bg-[#051F20] text-white text-[11px] font-bold px-2.5 py-1 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-md">
              Layar Pelanggan
            </span>
          </div>

          {/* Owner Dashboard */}
          <div className="relative group">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/dashboard"
                className="w-11 h-11 rounded-2xl text-slate-400 hover:text-[#1A6B51] hover:bg-[#EAF5EF] flex items-center justify-center transition-colors block"
              >
                <Compass className="w-5 h-5 stroke-[1.8]" />
              </Link>
            </motion.div>
            <span className="absolute left-14 top-1/2 -translate-y-1/2 bg-[#051F20] text-white text-[11px] font-bold px-2.5 py-1 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-md">
              Dashboard Owner
            </span>
          </div>
        </nav>
      </div>

      {/* 3. Bottom Profile Avatar */}
      <div className="flex flex-col items-center gap-3">
        <div className="relative group">
          <motion.div
            whileHover={{ scale: 1.08 }}
            className="w-10 h-10 rounded-2xl bg-[#F1F5F3] border border-slate-200/80 flex items-center justify-center text-[#1A6B51] font-extrabold text-xs cursor-pointer shadow-2xs"
          >
            {currentUser.name.slice(0, 2).toUpperCase()}
          </motion.div>
          <span className="absolute left-14 bottom-1 bg-[#051F20] text-white text-[11px] font-bold px-2.5 py-1 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-md">
            {currentUser.name} ({currentUser.role})
          </span>
        </div>
      </div>
    </aside>
  );
}
