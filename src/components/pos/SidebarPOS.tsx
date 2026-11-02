'use client';

import React from 'react';
import Image from 'next/image';
import { usePos } from '@/context/PosContext';
import {
  LayoutGrid,
  History,
  PackagePlus,
  Layers,
  RotateCcw,
  Headphones,
  ChevronDown,
} from 'lucide-react';

export function SidebarPOS() {
  const {
    currentUser,
    setIsHistoryModalOpen,
    setIsMorningStockModalOpen,
    setIsStockModalOpen,
    setIsReturnStockModalOpen,
  } = usePos();

  return (
    <aside className="w-56 lg:w-60 h-screen bg-[#1A6B51] dark:bg-[#0E3D2E] text-white flex flex-col justify-between p-4.5 shrink-0 select-none z-30 transition-colors duration-300 shadow-xl shadow-[#1A6B51]/15">
      {/* 1. Brand Logo Header */}
      <div>
        <div className="flex items-center gap-2.5 px-2 py-2 mb-6">
          <div className="relative w-10 h-10 rounded-xl bg-white flex items-center justify-center p-1.5 shadow-sm shadow-black/15 shrink-0 border border-white/20 overflow-hidden">
            <Image
              src="/images/logo-vm-brand.png"
              alt="VITAMINE Logo"
              width={36}
              height={16}
              className="w-full h-auto object-contain"
              priority
              unoptimized
            />
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

        {/* 2. Navigation Menu Links (Exact user requested items & order) */}
        <nav className="space-y-1.5">
          {/* 1. Dashboard (Active) */}
          <button
            type="button"
            className="w-full bg-white text-[#1A6B51] font-bold rounded-xl px-3.5 py-2.5 flex items-center gap-3 text-xs shadow-sm transition-all"
          >
            <LayoutGrid className="w-4 h-4 stroke-[2.4]" />
            <span>Dashboard</span>
          </button>

          {/* 2. History */}
          <button
            type="button"
            onClick={() => setIsHistoryModalOpen(true)}
            className="w-full text-white/80 hover:text-white hover:bg-white/10 rounded-xl px-3.5 py-2.5 flex items-center gap-3 text-xs font-semibold transition-all cursor-pointer"
          >
            <History className="w-4 h-4 stroke-[2]" />
            <span>History</span>
          </button>

          {/* 3. Order Stock */}
          <button
            type="button"
            onClick={() => setIsMorningStockModalOpen(true)}
            className="w-full text-white/80 hover:text-white hover:bg-white/10 rounded-xl px-3.5 py-2.5 flex items-center gap-3 text-xs font-semibold transition-all cursor-pointer"
          >
            <PackagePlus className="w-4 h-4 stroke-[2]" />
            <span>Order Stock</span>
          </button>

          {/* 4. Inventory */}
          <button
            type="button"
            onClick={() => setIsStockModalOpen(true)}
            className="w-full text-white/80 hover:text-white hover:bg-white/10 rounded-xl px-3.5 py-2.5 flex items-center gap-3 text-xs font-semibold transition-all cursor-pointer"
          >
            <Layers className="w-4 h-4 stroke-[2]" />
            <span>Inventory</span>
          </button>

          {/* 5. Return Stock */}
          <button
            type="button"
            onClick={() => setIsReturnStockModalOpen(true)}
            className="w-full text-white/80 hover:text-white hover:bg-white/10 rounded-xl px-3.5 py-2.5 flex items-center gap-3 text-xs font-semibold transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 stroke-[2]" />
            <span>Return Stock</span>
          </button>
        </nav>
      </div>

      {/* 3. Bottom: Need Help Card & User Profile */}
      <div className="space-y-3">
        {/* Need Help Card */}
        <div className="p-3 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-xs flex items-center gap-3 cursor-pointer hover:bg-white/15 transition-all">
          <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
            <Headphones className="w-4 h-4 text-white" />
          </div>
          <div className="leading-tight min-w-0">
            <h4 className="text-xs font-bold text-white truncate">Need Help?</h4>
            <span className="text-[10px] text-white/70 truncate block">Hubungi support</span>
          </div>
        </div>

        {/* User Profile Capsule */}
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
