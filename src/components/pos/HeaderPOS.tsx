'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { usePos } from '@/context/PosContext';
import {
  Menu,
  Search,
  Bell,
  ShoppingBag,
  Printer,
  Monitor,
} from 'lucide-react';

export function HeaderPOS() {
  const {
    currentUser,
    searchQuery,
    setSearchQuery,
    cart,
    ingredients,
  } = usePos();

  const lowStockCount = ingredients.filter(
    (ing) => ing.currentStock <= ing.minStockAlert
  ).length;

  return (
    <header className="h-20 bg-white border-b border-slate-200/80 px-6 sm:px-8 flex items-center justify-between gap-6 sticky top-0 z-20 select-none">
      {/* 1. Left Greeting */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[#051F20] tracking-tight font-display flex items-center gap-2">
            <span>Welcome back, {currentUser.name.split(' ')[0]}!</span>
            <span className="inline-block animate-wave origin-bottom-right">👋</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Here&apos;s what&apos;s happening with your store today.
          </p>
        </div>
      </div>

      {/* 2. Right Search & Notification Hub */}
      <div className="flex items-center gap-3.5">
        {/* Search Bar */}
        <div className="relative w-64 xl:w-80 group">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 group-focus-within:text-[#235347] transition-colors" />
          <input
            id="pos-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search menu or fruit (F2)..."
            className="w-full pl-9 pr-12 py-2 bg-[#F4F7F5] border border-transparent focus:border-[#235347] focus:bg-white rounded-xl text-xs font-medium text-[#051F20] placeholder:text-slate-400 focus:outline-none transition-all shadow-2xs"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-mono text-slate-500 shadow-2xs">
            F2
          </kbd>
        </div>

        {/* Hardware Badges */}
        <div className="hidden xl:flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-xl bg-[#DAF1DE] text-[#163832] border border-[#8EB69B]/30">
          <Printer className="w-3.5 h-3.5 text-[#235347]" />
          <span>58mm USB</span>
          <span className="text-slate-300">|</span>
          <Monitor className="w-3.5 h-3.5 text-[#235347]" />
          <span>Display Dual-OK</span>
        </div>

        {/* Notification Bell */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="button"
          className="relative p-2.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white text-slate-600 hover:text-slate-900 transition-colors shadow-2xs"
          title="Notifikasi Stok"
        >
          <Bell className="w-4 h-4" />
          {lowStockCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#235347] text-white text-[10px] font-bold flex items-center justify-center border-2 border-white shadow-xs">
              {lowStockCount}
            </span>
          )}
        </motion.button>

        {/* Quick Cart Indicator */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="relative p-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 shadow-2xs"
        >
          <ShoppingBag className="w-4 h-4 text-[#235347]" />
          {cart.length > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#235347] text-white text-[10px] font-bold flex items-center justify-center border-2 border-white shadow-xs animate-bounce">
              {cart.length}
            </span>
          )}
        </motion.div>
      </div>
    </header>
  );
}
