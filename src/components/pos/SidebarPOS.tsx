'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { usePos } from '@/context/PosContext';
import {
  ShoppingBag,
  LayoutGrid,
  Layers,
  RotateCcw,
  Clock,
} from 'lucide-react';

export function SidebarPOS() {
  const {
    currentUser,
    setIsStockModalOpen,
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
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="w-12 h-12 rounded-2xl bg-[#EAF5EF] text-[#1A6B51] flex items-center justify-center font-black shadow-xs cursor-pointer border border-[#8EB69B]/30"
          title="VITAMINE Juice Bar"
        >
          <ShoppingBag className="w-6 h-6 stroke-[2.2]" />
        </motion.div>

        {/* 2. Slim Vertical Navigation Rail: Order, Inventory, Retur, Opname */}
        <nav className="flex flex-col items-center gap-3.5 w-full px-2">
          {/* 1. Order (Active POS Kasir) */}
          <div className="relative group">
            <motion.div
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="w-11 h-11 rounded-2xl bg-[#1A6B51] text-white flex items-center justify-center shadow-md shadow-[#1A6B51]/25 cursor-pointer"
            >
              <LayoutGrid className="w-5 h-5 stroke-[2.2]" />
            </motion.div>
            <span className="absolute left-14 top-1/2 -translate-y-1/2 bg-[#051F20] text-white text-[11px] font-bold px-2.5 py-1 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50 shadow-md">
              Order
            </span>
          </div>

          {/* 2. Inventory (Stok Bahan Baku) */}
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
            <span className="absolute left-14 top-1/2 -translate-y-1/2 bg-[#051F20] text-white text-[11px] font-bold px-2.5 py-1 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50 shadow-md">
              Inventory
            </span>
          </div>

          {/* 3. Retur (Retur Bahan) */}
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
            <span className="absolute left-14 top-1/2 -translate-y-1/2 bg-[#051F20] text-white text-[11px] font-bold px-2.5 py-1 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50 shadow-md">
              Retur
            </span>
          </div>

          {/* 4. Opname (Cash Opname Kasir) */}
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
            <span className="absolute left-14 top-1/2 -translate-y-1/2 bg-[#051F20] text-white text-[11px] font-bold px-2.5 py-1 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50 shadow-md">
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
          <span className="absolute left-14 bottom-1 bg-[#051F20] text-white text-[11px] font-bold px-2.5 py-1 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50 shadow-md">
            {currentUser.name} ({currentUser.role})
          </span>
        </div>
      </div>
    </aside>
  );
}
