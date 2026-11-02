'use client';

import React from 'react';
import Image from 'next/image';
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
    currentUser,
    setIsHistoryModalOpen,
    setIsMorningStockModalOpen,
    setIsStockModalOpen,
    setIsReturnStockModalOpen,
    setIsCashOpnameModalOpen,
  } = usePos();

  return (
    <aside className="w-20 bg-white border-r border-slate-100 flex flex-col justify-between items-center py-6 h-screen sticky top-0 shrink-0 select-none z-30 shadow-[1px_0_10px_rgba(0,0,0,0.02)]">
      {/* 1. Top Logo (Enlarged VM Logo) */}
      <div className="flex flex-col items-center gap-6">
        <motion.div
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="w-16 h-11 rounded-2xl bg-white flex items-center justify-center shadow-xs cursor-pointer border border-[#8EB69B]/40 overflow-hidden p-1.5"
          title="VITAMINE Juice Bar"
        >
          <div className="relative w-full h-full">
            <Image
              src="/images/logo-vm.png"
              alt="VITAMINE VM Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
        </motion.div>

        {/* 2. Slim Vertical Navigation Rail: Cashier, History, Order, Inventory, Return, Opname */}
        <nav className="flex flex-col items-center gap-3 w-full px-2">
          {/* 1. Cashier */}
          <div className="relative group">
            <motion.div
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="w-11 h-11 rounded-2xl bg-[#1A6B51] text-white flex items-center justify-center shadow-md shadow-[#1A6B51]/25 cursor-pointer"
            >
              <LayoutGrid className="w-5 h-5 stroke-[2.2]" />
            </motion.div>
            <span className="absolute left-14 top-1/2 -translate-y-1/2 bg-[#1A6B51] text-white text-[11px] font-bold px-2.5 py-1 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-300 ease-out whitespace-nowrap z-50 shadow-lg shadow-[#1A6B51]/25 border border-[#8EB69B]/30">
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
              className="w-11 h-11 rounded-2xl text-slate-400 hover:text-white hover:bg-[#1A6B51] hover:shadow-md hover:shadow-[#1A6B51]/20 flex items-center justify-center transition-all duration-300 ease-out cursor-pointer"
            >
              <History className="w-5 h-5 stroke-[1.8]" />
            </motion.button>
            <span className="absolute left-14 top-1/2 -translate-y-1/2 bg-[#1A6B51] text-white text-[11px] font-bold px-2.5 py-1 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-300 ease-out whitespace-nowrap z-50 shadow-lg shadow-[#1A6B51]/25 border border-[#8EB69B]/30">
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
              className="w-11 h-11 rounded-2xl text-slate-400 hover:text-white hover:bg-[#1A6B51] hover:shadow-md hover:shadow-[#1A6B51]/20 flex items-center justify-center transition-all duration-300 ease-out cursor-pointer"
            >
              <PackagePlus className="w-5 h-5 stroke-[1.8]" />
            </motion.button>
            <span className="absolute left-14 top-1/2 -translate-y-1/2 bg-[#1A6B51] text-white text-[11px] font-bold px-2.5 py-1 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-300 ease-out whitespace-nowrap z-50 shadow-lg shadow-[#1A6B51]/25 border border-[#8EB69B]/30">
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
              className="w-11 h-11 rounded-2xl text-slate-400 hover:text-white hover:bg-[#1A6B51] hover:shadow-md hover:shadow-[#1A6B51]/20 flex items-center justify-center transition-all duration-300 ease-out cursor-pointer"
            >
              <Layers className="w-5 h-5 stroke-[1.8]" />
            </motion.button>
            <span className="absolute left-14 top-1/2 -translate-y-1/2 bg-[#1A6B51] text-white text-[11px] font-bold px-2.5 py-1 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-300 ease-out whitespace-nowrap z-50 shadow-lg shadow-[#1A6B51]/25 border border-[#8EB69B]/30">
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
              className="w-11 h-11 rounded-2xl text-slate-400 hover:text-white hover:bg-[#1A6B51] hover:shadow-md hover:shadow-[#1A6B51]/20 flex items-center justify-center transition-all duration-300 ease-out cursor-pointer"
            >
              <RotateCcw className="w-5 h-5 stroke-[1.8]" />
            </motion.button>
            <span className="absolute left-14 top-1/2 -translate-y-1/2 bg-[#1A6B51] text-white text-[11px] font-bold px-2.5 py-1 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-300 ease-out whitespace-nowrap z-50 shadow-lg shadow-[#1A6B51]/25 border border-[#8EB69B]/30">
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
              className="w-11 h-11 rounded-2xl text-slate-400 hover:text-white hover:bg-[#1A6B51] hover:shadow-md hover:shadow-[#1A6B51]/20 flex items-center justify-center transition-all duration-300 ease-out cursor-pointer"
            >
              <Clock className="w-5 h-5 stroke-[1.8]" />
            </motion.button>
            <span className="absolute left-14 top-1/2 -translate-y-1/2 bg-[#1A6B51] text-white text-[11px] font-bold px-2.5 py-1 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-300 ease-out whitespace-nowrap z-50 shadow-lg shadow-[#1A6B51]/25 border border-[#8EB69B]/30">
              Opname
            </span>
          </div>
        </nav>
      </div>

      {/* 3. Bottom Profile Avatar */}
      <div className="flex flex-col items-center gap-3">
        <div className="relative group">
          <motion.div
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="w-10 h-10 rounded-2xl bg-[#F1F5F3] hover:bg-[#1A6B51] hover:text-white text-[#1A6B51] border border-slate-200/80 flex items-center justify-center font-extrabold text-xs cursor-pointer shadow-2xs transition-all duration-300 ease-out"
          >
            {currentUser.name.slice(0, 2).toUpperCase()}
          </motion.div>
          <span className="absolute left-14 bottom-1 bg-[#1A6B51] text-white text-[11px] font-bold px-2.5 py-1 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-300 ease-out whitespace-nowrap z-50 shadow-lg shadow-[#1A6B51]/25 border border-[#8EB69B]/30">
            {currentUser.name} ({currentUser.role})
          </span>
        </div>
      </div>
    </aside>
  );
}
