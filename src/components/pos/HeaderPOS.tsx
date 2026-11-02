'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { usePos } from '@/context/PosContext';
import {
  Search,
  SlidersHorizontal,
  Printer,
  Bell,
  Sparkles,
} from 'lucide-react';

export function HeaderPOS() {
  const {
    currentUser,
    searchQuery,
    setSearchQuery,
    ingredients,
    setIsStockModalOpen,
  } = usePos();

  const [dateStr, setDateStr] = useState('June 15, 2023');

  useEffect(() => {
    const today = new Date();
    const formatted = new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }).format(today);
    setDateStr(formatted);
  }, []);

  const lowStockCount = ingredients.filter(
    (ing) => ing.currentStock <= ing.minStockAlert
  ).length;

  return (
    <header className="px-8 pt-7 pb-4 flex items-center justify-between gap-6 bg-transparent select-none">
      {/* 1. Left: Date & Restaurant Title with VM Logo */}
      <div className="flex items-center gap-3.5">
        <div className="relative w-16 h-11 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-center justify-center p-1.5 shrink-0 overflow-hidden">
          <Image
            src="/images/logo-vm.png"
            alt="VITAMINE Logo"
            fill
            className="object-contain p-0.5"
            priority
          />
        </div>
        <div>
          <span className="text-xs font-semibold text-slate-400 tracking-wide block">
            {dateStr}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-display mt-0.5">
            VITAMINE Juice Bar
          </h1>
        </div>
      </div>

      {/* 2. Right: Search Here Capsule & Filter + Hardware pill */}
      <div className="flex items-center gap-3">
        {/* Rounded Search Bar Capsule with Search + Filter icon */}
        <div className="relative w-72 sm:w-80 group">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-[#1A6B51] transition-colors" />
          <input
            id="pos-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Here"
            className="w-full pl-10 pr-11 py-2.5 bg-white border border-slate-200/90 rounded-full text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#1A6B51] focus:ring-2 focus:ring-[#1A6B51]/10 transition-all shadow-[0_2px_8px_rgba(0,0,0,0.03)]"
          />
          <button
            type="button"
            onClick={() => setIsStockModalOpen(true)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#1A6B51] transition-colors"
            title="Filter / Cek Stok (F4)"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Hardware Status: Printer 58mm */}
        <div className="hidden xl:flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-white border border-slate-200/80 text-slate-600 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
          <Printer className="w-3.5 h-3.5 text-[#1A6B51]" />
          <span className="text-[11px] font-mono">58mm Printer Ready</span>
        </div>

        {lowStockCount > 0 && (
          <button
            type="button"
            onClick={() => setIsStockModalOpen(true)}
            className="px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold flex items-center gap-1.5 animate-pulse"
            title="Bahan Hampir Habis"
          >
            <Bell className="w-3 h-3 text-amber-600" />
            <span className="text-[11px]">{lowStockCount} alert</span>
          </button>
        )}
      </div>
    </header>
  );
}
