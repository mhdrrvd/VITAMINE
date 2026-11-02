'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Sparkles,
  BarChart3,
  Image as ImageIcon,
  ScrollText,
  Layers,
  ShoppingBag,
  Calendar,
  LogOut,
} from 'lucide-react';

interface NavbarDashboardProps {
  activeTab: 'ANALYTICS' | 'PROMO' | 'BOM';
  setActiveTab: (tab: 'ANALYTICS' | 'PROMO' | 'BOM') => void;
  dateRange: string;
  setDateRange: (range: string) => void;
}

export function NavbarDashboard({
  activeTab,
  setActiveTab,
  dateRange,
  setDateRange,
}: NavbarDashboardProps) {
  return (
    <header className="h-16 bg-slate-900 border-b border-slate-800 px-4 sm:px-8 flex items-center justify-between gap-4 sticky top-0 z-30 select-none text-white">
      {/* Brand & Tabs */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2.5">
          <div className="relative w-12 h-9 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center p-1 overflow-hidden shrink-0">
            <Image
              src="/images/logo-vm.png"
              alt="VITAMINE Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div>
            <h1 className="font-extrabold text-white leading-none tracking-tight text-base font-display flex items-center gap-1.5">
              <span>VITAMINE</span>
              <span className="px-1.5 py-0.2 rounded bg-orange-500/20 text-orange-400 text-[10px] font-mono border border-orange-500/30">
                OWNER
              </span>
            </h1>
            <span className="text-[10px] text-slate-400 font-medium">
              Executive Analytics & Operations
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-950/60 p-1 rounded-xl border border-slate-800 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('ANALYTICS')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all duration-300 ease-out ${
              activeTab === 'ANALYTICS'
                ? 'bg-[#1A6B51] text-white shadow-xs'
                : 'text-slate-400 hover:bg-[#1A6B51] hover:text-white'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Analitik Bisnis</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('PROMO')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all duration-300 ease-out ${
              activeTab === 'PROMO'
                ? 'bg-[#1A6B51] text-white shadow-xs'
                : 'text-slate-400 hover:bg-[#1A6B51] hover:text-white'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Kelola Promo GUI</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('BOM')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all duration-300 ease-out ${
              activeTab === 'BOM'
                ? 'bg-[#1A6B51] text-white shadow-xs'
                : 'text-slate-400 hover:bg-[#1A6B51] hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Resep BOM</span>
          </button>
        </nav>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Date Filter */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 font-semibold">
          <Calendar className="w-3.5 h-3.5 text-orange-400" />
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="bg-transparent focus:outline-none cursor-pointer text-slate-200 font-medium"
          >
            <option value="TODAY" className="bg-slate-900">Hari Ini (Real-Time)</option>
            <option value="YESTERDAY" className="bg-slate-900">Kemarin</option>
            <option value="WEEK" className="bg-slate-900">7 Hari Terakhir</option>
            <option value="MONTH" className="bg-slate-900">Bulan Ini</option>
          </select>
        </div>

        {/* Quick Links to POS & Customer Display */}
        <div className="flex items-center gap-1.5">
          <Link
            href="/pos"
            target="_blank"
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 border border-slate-700 transition-colors"
            title="Buka Terminal Kasir di Tab Baru"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-orange-400" />
            <span className="hidden lg:inline">Kasir POS</span>
          </Link>


        </div>
      </div>
    </header>
  );
}

