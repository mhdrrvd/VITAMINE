'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { usePos } from '@/context/PosContext';
import {
  ShoppingBag,
  LayoutDashboard,
  Layers,
  RotateCcw,
  Calculator,
  Monitor,
  Headphones,
  ChevronDown,
  Sparkles,
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
    <aside className="w-60 bg-[#163832] text-white flex flex-col justify-between h-screen sticky top-0 shrink-0 select-none z-30 transition-all border-r border-[#0B2B26]">
      {/* 1. Top Brand Logo */}
      <div>
        <div className="px-6 py-5 flex items-center gap-3 border-b border-white/10">
          <motion.div
            whileHover={{ scale: 1.05, rotate: 2 }}
            className="w-9 h-9 rounded-xl bg-[#235347] border border-[#8EB69B]/30 text-[#DAF1DE] flex items-center justify-center font-extrabold text-lg shadow-sm"
          >
            <ShoppingBag className="w-5 h-5" />
          </motion.div>
          <div>
            <h1 className="font-extrabold text-white text-lg tracking-tight font-display">
              VITAMINE
            </h1>
            <span className="text-[10px] text-[#8EB69B] font-bold tracking-widest uppercase block -mt-0.5">
              Juice Bar POS
            </span>
          </div>
        </div>

        {/* 2. Navigation Items */}
        <nav className="p-3 space-y-1.5 text-sm font-semibold">
          {/* Active POS Button (Styled like active PosyMart card) */}
          <div className="px-3 py-2.5 rounded-xl bg-white text-[#163832] flex items-center gap-3 shadow-sm font-bold cursor-default">
            <ShoppingBag className="w-4 h-4 text-[#235347]" />
            <span>Kasir (Sales)</span>
          </div>

          <motion.div whileHover={{ x: 3 }} transition={{ duration: 0.15 }}>
            <Link
              href="/dashboard"
              className="px-3 py-2.5 rounded-xl text-[#DAF1DE]/80 hover:text-white hover:bg-white/10 flex items-center gap-3 transition-colors"
            >
              <LayoutDashboard className="w-4 h-4 text-[#8EB69B]" />
              <span>Dashboard</span>
            </Link>
          </motion.div>

          <motion.button
            whileHover={{ x: 3 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.15 }}
            type="button"
            onClick={() => setIsStockModalOpen(true)}
            className="w-full text-left px-3 py-2.5 rounded-xl text-[#DAF1DE]/80 hover:text-white hover:bg-white/10 flex items-center gap-3 transition-colors"
          >
            <Layers className="w-4 h-4 text-[#8EB69B]" />
            <span>Cek Stok (F4)</span>
          </motion.button>

          <motion.button
            whileHover={{ x: 3 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.15 }}
            type="button"
            onClick={() => setIsMorningStockModalOpen(true)}
            className="w-full text-left px-3 py-2.5 rounded-xl text-[#DAF1DE]/80 hover:text-white hover:bg-white/10 flex items-center gap-3 transition-colors"
          >
            <Sparkles className="w-4 h-4 text-[#8EB69B]" />
            <span>Stok Pagi</span>
          </motion.button>

          <motion.button
            whileHover={{ x: 3 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.15 }}
            type="button"
            onClick={() => setIsReturnStockModalOpen(true)}
            className="w-full text-left px-3 py-2.5 rounded-xl text-[#DAF1DE]/80 hover:text-white hover:bg-white/10 flex items-center gap-3 transition-colors"
          >
            <RotateCcw className="w-4 h-4 text-[#8EB69B]" />
            <span>Retur Bahan</span>
          </motion.button>

          <motion.button
            whileHover={{ x: 3 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.15 }}
            type="button"
            onClick={() => setIsCashOpnameModalOpen(true)}
            className="w-full text-left px-3 py-2.5 rounded-xl text-[#DAF1DE]/80 hover:text-white hover:bg-white/10 flex items-center gap-3 transition-colors"
          >
            <Calculator className="w-4 h-4 text-[#8EB69B]" />
            <span>Tutup Shift</span>
          </motion.button>

          <motion.div whileHover={{ x: 3 }} transition={{ duration: 0.15 }}>
            <Link
              href="/customer-display"
              target="_blank"
              className="px-3 py-2.5 rounded-xl text-[#DAF1DE]/80 hover:text-white hover:bg-white/10 flex items-center gap-3 transition-colors"
            >
              <Monitor className="w-4 h-4 text-[#8EB69B]" />
              <span>Display Customer</span>
            </Link>
          </motion.div>
        </nav>
      </div>

      {/* 3. Bottom Profile & Help Widget */}
      <div className="p-3 space-y-2.5">
        {/* Support Pill */}
        <div className="p-3 rounded-2xl bg-[#0B2B26]/60 border border-white/5 flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#235347] text-[#DAF1DE] flex items-center justify-center shrink-0">
            <Headphones className="w-4 h-4" />
          </div>
          <div className="text-xs">
            <p className="font-bold text-white leading-tight">Need Help?</p>
            <span className="text-[11px] text-[#8EB69B]">Contact support</span>
          </div>
        </div>

        {/* User Profile Card */}
        <div className="p-2.5 rounded-2xl bg-[#0B2B26] border border-white/10 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#235347] border border-[#8EB69B]/40 flex items-center justify-center text-white font-extrabold text-xs shadow-xs">
              {currentUser.name.slice(0, 2).toUpperCase()}
            </div>
            <div className="leading-tight">
              <h4 className="font-bold text-white text-xs line-clamp-1">{currentUser.name}</h4>
              <span className="text-[10px] text-[#8EB69B] block font-medium">
                {currentUser.role === 'CASHIER' ? 'Kasir Shift' : 'Owner'}
              </span>
            </div>
          </div>
          <ChevronDown className="w-4 h-4 text-[#8EB69B]" />
        </div>
      </div>
    </aside>
  );
}
