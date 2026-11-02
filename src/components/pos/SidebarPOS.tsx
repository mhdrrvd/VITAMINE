'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { usePos } from '@/context/PosContext';
import {
  LayoutGrid,
  History,
  PackagePlus,
  Layers,
  RotateCcw,
  Clock,
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
    <aside className="my-5 ml-5 w-18 h-[calc(100vh-2.5rem)] rounded-3xl bg-white/95 dark:bg-[#0F1E1B]/95 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 shadow-[0_4px_24px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.25)] flex flex-col items-center py-6 shrink-0 select-none z-30 transition-all duration-300">
      {/* Slim Vertical Navigation Rail: Cashier, History, Order, Inventory, Return, Opname (Logo dihapus sesuai permintaan) */}
      <nav className="flex flex-col items-center gap-3.5 w-full px-2">
        {/* 1. Cashier */}
        <div className="relative group">
          <motion.div
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="w-11 h-11 rounded-2xl bg-[#1A6B51] dark:bg-[#00B14F] text-white dark:text-slate-950 flex items-center justify-center shadow-md shadow-[#1A6B51]/25 dark:shadow-[#00B14F]/25 cursor-pointer"
          >
            <LayoutGrid className="w-5 h-5 stroke-[2.2]" />
          </motion.div>
          <span className="absolute left-14 top-1/2 -translate-y-1/2 bg-[#1A6B51] dark:bg-slate-800 text-white dark:text-slate-100 text-[11px] font-bold px-2.5 py-1 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-300 ease-out whitespace-nowrap z-50 shadow-lg shadow-[#1A6B51]/25 border border-[#8EB69B]/30 dark:border-slate-700">
            Cashier
          </span>
        </div>

        {/* 2. History */}
        <div className="relative group">
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            type="button"
            onClick={() => setIsHistoryModalOpen(true)}
            className="w-11 h-11 rounded-2xl text-slate-400 dark:text-slate-500 hover:text-white hover:bg-[#1A6B51] dark:hover:bg-[#00B14F] dark:hover:text-slate-950 hover:shadow-md hover:shadow-[#1A6B51]/20 flex items-center justify-center transition-all duration-300 ease-out cursor-pointer"
          >
            <History className="w-5 h-5 stroke-[1.8]" />
          </motion.button>
          <span className="absolute left-14 top-1/2 -translate-y-1/2 bg-[#1A6B51] dark:bg-slate-800 text-white dark:text-slate-100 text-[11px] font-bold px-2.5 py-1 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-300 ease-out whitespace-nowrap z-50 shadow-lg shadow-[#1A6B51]/25 border border-[#8EB69B]/30 dark:border-slate-700">
            History
          </span>
        </div>

        {/* 3. Order (Ambil Bahan Baku di Gudang Setiap Pagi) */}
        <div className="relative group">
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            type="button"
            onClick={() => setIsMorningStockModalOpen(true)}
            className="w-11 h-11 rounded-2xl text-slate-400 dark:text-slate-500 hover:text-white hover:bg-[#1A6B51] dark:hover:bg-[#00B14F] dark:hover:text-slate-950 hover:shadow-md hover:shadow-[#1A6B51]/20 flex items-center justify-center transition-all duration-300 ease-out cursor-pointer"
          >
            <PackagePlus className="w-5 h-5 stroke-[1.8]" />
          </motion.button>
          <span className="absolute left-14 top-1/2 -translate-y-1/2 bg-[#1A6B51] dark:bg-slate-800 text-white dark:text-slate-100 text-[11px] font-bold px-2.5 py-1 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-300 ease-out whitespace-nowrap z-50 shadow-lg shadow-[#1A6B51]/25 border border-[#8EB69B]/30 dark:border-slate-700">
            Order
          </span>
        </div>

        {/* 4. Inventory */}
        <div className="relative group">
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            type="button"
            onClick={() => setIsStockModalOpen(true)}
            className="w-11 h-11 rounded-2xl text-slate-400 dark:text-slate-500 hover:text-white hover:bg-[#1A6B51] dark:hover:bg-[#00B14F] dark:hover:text-slate-950 hover:shadow-md hover:shadow-[#1A6B51]/20 flex items-center justify-center transition-all duration-300 ease-out cursor-pointer"
          >
            <Layers className="w-5 h-5 stroke-[1.8]" />
          </motion.button>
          <span className="absolute left-14 top-1/2 -translate-y-1/2 bg-[#1A6B51] dark:bg-slate-800 text-white dark:text-slate-100 text-[11px] font-bold px-2.5 py-1 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-300 ease-out whitespace-nowrap z-50 shadow-lg shadow-[#1A6B51]/25 border border-[#8EB69B]/30 dark:border-slate-700">
            Inventory
          </span>
        </div>

        {/* 5. Return */}
        <div className="relative group">
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            type="button"
            onClick={() => setIsReturnStockModalOpen(true)}
            className="w-11 h-11 rounded-2xl text-slate-400 dark:text-slate-500 hover:text-white hover:bg-[#1A6B51] dark:hover:bg-[#00B14F] dark:hover:text-slate-950 hover:shadow-md hover:shadow-[#1A6B51]/20 flex items-center justify-center transition-all duration-300 ease-out cursor-pointer"
          >
            <RotateCcw className="w-5 h-5 stroke-[1.8]" />
          </motion.button>
          <span className="absolute left-14 top-1/2 -translate-y-1/2 bg-[#1A6B51] dark:bg-slate-800 text-white dark:text-slate-100 text-[11px] font-bold px-2.5 py-1 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-300 ease-out whitespace-nowrap z-50 shadow-lg shadow-[#1A6B51]/25 border border-[#8EB69B]/30 dark:border-slate-700">
            Return
          </span>
        </div>

        {/* 6. Opname */}
        <div className="relative group">
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            type="button"
            onClick={() => setIsCashOpnameModalOpen(true)}
            className="w-11 h-11 rounded-2xl text-slate-400 dark:text-slate-500 hover:text-white hover:bg-[#1A6B51] dark:hover:bg-[#00B14F] dark:hover:text-slate-950 hover:shadow-md hover:shadow-[#1A6B51]/20 flex items-center justify-center transition-all duration-300 ease-out cursor-pointer"
          >
            <Clock className="w-5 h-5 stroke-[1.8]" />
          </motion.button>
          <span className="absolute left-14 top-1/2 -translate-y-1/2 bg-[#1A6B51] dark:bg-slate-800 text-white dark:text-slate-100 text-[11px] font-bold px-2.5 py-1 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-300 ease-out whitespace-nowrap z-50 shadow-lg shadow-[#1A6B51]/25 border border-[#8EB69B]/30 dark:border-slate-700">
            Opname
          </span>
        </div>
      </nav>
    </aside>
  );
}
