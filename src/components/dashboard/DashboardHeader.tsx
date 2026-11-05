'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  ShoppingBag,
  ExternalLink,
  Store,
  UserCheck,
  ChevronDown,
  Search,
} from 'lucide-react';
import { usePos } from '@/context/PosContext';

interface DashboardHeaderProps {
  dateRange: string;
  setDateRange: (range: string) => void;
  activeTabTitle?: string;
  onOpenCommandPalette?: () => void;
}

export function DashboardHeader({
  dateRange,
  setDateRange,
  activeTabTitle = 'Dashboard Operasional',
  onOpenCommandPalette,
}: DashboardHeaderProps) {
  const { currentShift } = usePos();
  const [currentDate, setCurrentDate] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [selectedOutlet, setSelectedOutlet] = useState('Indomaret Mabar (Pusat)');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const dateFormatted = new Intl.DateTimeFormat('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }).format(now);

      const timeFormatted = now
        .toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        })
        .replace(/\./g, ':');

      setCurrentDate(dateFormatted);
      setCurrentTime(`${timeFormatted} WIB`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-16 border-b border-white/10 px-4 sm:px-8 flex items-center justify-between gap-4 sticky top-0 z-30 bg-[#081210]/90 backdrop-blur-md select-none text-white">
      {/* Left: Outlet details & live clock */}
      <div className="flex items-center gap-4 min-w-0">
        <div>
          <h2 className="text-sm sm:text-base font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>{activeTabTitle}</span>
            <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#00E565]/10 text-[#00E565] text-[10px] font-bold border border-[#00E565]/20">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00E565] animate-pulse" />
              Live Sync POS
            </span>
          </h2>
          <div className="hidden sm:flex items-center gap-2 text-[11px] text-[#00E565] mt-0.5 font-medium">
            <span className="flex items-center gap-1 font-mono">
              <Calendar className="w-3 h-3 text-[#00E565]" />
              {currentDate || 'Kamis, 5 Nov 2026'}
            </span>
            <span className="text-white/20">•</span>
            <span className="flex items-center gap-1 font-mono font-bold">
              <Clock className="w-3 h-3 text-[#00E565]" />
              {currentTime || '18:00:00 WIB'}
            </span>
          </div>
        </div>
      </div>

      {/* Right: Cashier Shift status, Date Filter, & Quick POS Link */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Command Palette Trigger */}
        <button
          type="button"
          onClick={onOpenCommandPalette}
          className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0F1E1B] hover:bg-white/10 border border-white/10 text-xs text-white/70 hover:text-white transition-colors cursor-pointer"
          title="Buka Command Palette (Ctrl+K)"
        >
          <Search className="w-3.5 h-3.5 text-[#00E565]" />
          <span>Cari Perintah</span>
          <kbd className="px-1.5 py-0.2 rounded bg-white/10 text-white/50 text-[10px] font-mono border border-white/10">
            ⌘K
          </kbd>
        </button>

        {/* Branch / Outlet Switcher */}
        <div className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0F1E1B] border border-white/10 text-xs text-white">
          <Store className="w-3.5 h-3.5 text-[#00E565]" />
          <select
            value={selectedOutlet}
            onChange={(e) => setSelectedOutlet(e.target.value)}
            className="bg-transparent focus:outline-none cursor-pointer text-xs font-semibold text-white pr-1"
          >
            <option value="Indomaret Mabar (Pusat)" className="bg-[#0B1E19] text-white">
              Indomaret Mabar (Pusat)
            </option>
            <option value="Sun Plaza Medan" className="bg-[#0B1E19] text-white">
              Sun Plaza Medan (Branch #2)
            </option>
            <option value="Centre Point Mall" className="bg-[#0B1E19] text-white">
              Centre Point Mall (Branch #3)
            </option>
          </select>
        </div>

        {/* Active Cashier Pill */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0F1E1B] border border-white/10 text-xs text-white">
          <UserCheck className="w-3.5 h-3.5 text-[#00E565]" />
          <span className="text-white/70">Kasir:</span>
          <span className="font-bold text-white">Rian P.</span>
          <span className="text-white/30">|</span>
          <span className="font-mono text-[11px] text-[#00E565]">
            {currentShift ? `Shift #${currentShift.id.slice(-3)}` : 'Shift Aktif'}
          </span>
        </div>

        {/* Date Filter Dropdown */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0F1E1B] border border-white/10 text-xs font-semibold text-white">
          <Calendar className="w-3.5 h-3.5 text-orange-400" />
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="bg-transparent focus:outline-none cursor-pointer text-xs font-semibold text-white pr-1"
          >
            <option value="TODAY" className="bg-[#0B1E19] text-white">Hari Ini</option>
            <option value="YESTERDAY" className="bg-[#0B1E19] text-white">Kemarin</option>
            <option value="WEEK" className="bg-[#0B1E19] text-white">7 Hari Terakhir</option>
            <option value="MONTH" className="bg-[#0B1E19] text-white">Bulan Ini</option>
          </select>
        </div>

        {/* Fast link to POS */}
        <Link
          href="/pos"
          target="_blank"
          className="btn-kilat px-3 py-1.5 rounded-xl bg-[#00B14F] hover:bg-[#00E565] text-white hover:text-slate-950 text-xs font-black flex items-center gap-1.5 shadow-md shadow-[#00B14F]/30 transition-all cursor-pointer"
          title="Buka Terminal Kasir POS"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Kasir POS</span>
        </Link>
      </div>
    </header>
  );
}

