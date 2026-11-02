'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { usePos } from '@/context/PosContext';
import {
  Search,
  Bell,
  Sun,
  Moon,
  DollarSign,
  CupSoda,
  Clock,
  Calendar,
  Receipt,
  MoreVertical,
  Menu,
} from 'lucide-react';

export function HeaderPOS() {
  const {
    currentUser,
    ingredients,
    setIsStockModalOpen,
    recentOrders,
    searchQuery,
    setSearchQuery,
  } = usePos();

  const [isDark, setIsDark] = useState(true);
  const [currentDate, setCurrentDate] = useState('');
  const [currentTime, setCurrentTime] = useState('');

  // 1. Realtime Date & Clock (Ticking every second)
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const dateFormatted = new Intl.DateTimeFormat('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
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

  // 2. Dark mode initialization
  useEffect(() => {
    const savedTheme = localStorage.getItem('vitamine-theme');
    const shouldBeDark = savedTheme ? savedTheme === 'dark' : true;

    setIsDark(shouldBeDark);
    if (shouldBeDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('vitamine-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('vitamine-theme', 'light');
    }
  };

  const lowStockCount = ingredients.filter(
    (ing) => ing.currentStock <= ing.minStockAlert
  ).length;

  // Hitung total omset & cup dinamis berdasarkan pesanan
  const additionalRevenue = (recentOrders || [])
    .filter((o) => !o.id.startsWith('order-sample-'))
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const additionalCups = (recentOrders || [])
    .filter((o) => !o.id.startsWith('order-sample-'))
    .reduce((sum, o) => sum + o.items.reduce((s, it) => s + it.quantity, 0), 0);

  const totalRevenue = 3840000 + additionalRevenue;
  const totalCupsSold = 142 + additionalCups;

  return (
    <div className="px-6 pt-5 pb-2 shrink-0 select-none">
      {/* 1. Top Header Row: Nama Outlet & Tanggal Real-Time */}
      <div className="flex items-center justify-between gap-4 mb-4">
        {/* Left: Outlet Name & Real-time Live Clock */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="w-9 h-9 rounded-xl bg-white dark:bg-[#0F1E1B] border border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center hover:bg-slate-50 transition-colors cursor-pointer shadow-2xs md:hidden"
            aria-label="Toggle Menu"
          >
            <Menu className="w-4 h-4" />
          </button>

          <div>
            {/* Nama Outlet Utama */}
            <div className="flex items-center gap-2.5">
              <div className="relative w-9 h-8 sm:w-10 sm:h-8.5 rounded-xl bg-white border border-slate-200/80 dark:border-white/15 flex items-center justify-center p-1 shadow-2xs shrink-0 overflow-hidden">
                <Image
                  src="/images/logo-vm-brand.png"
                  alt="VM Logo"
                  width={34}
                  height={16}
                  className="w-full h-auto object-contain"
                  priority
                  unoptimized
                />
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight font-display">
                Outlet Sun Plaza
              </h2>
            </div>

            {/* Tanggal & Waktu Real-Time */}
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium flex-wrap">
              <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-semibold">
                <Calendar className="w-3.5 h-3.5 text-[#1A6B51] dark:text-[#00B14F]" />
                {currentDate || 'Senin, 2 November 2026'}
              </span>
              <span className="text-slate-300 dark:text-slate-600">•</span>
              <span className="flex items-center gap-1.5 font-mono font-bold text-slate-800 dark:text-slate-200">
                <Clock className="w-3.5 h-3.5 text-[#1A6B51] dark:text-[#00B14F]" />
                {currentTime || '18:00:00 WIB'}
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-bold ml-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live
              </span>
            </div>
          </div>
        </div>

        {/* Right: Search, Notification & Dark Mode */}
        <div className="flex items-center gap-2.5">
          {/* Search Input with ⌘K / F2 */}
          <div className="relative hidden sm:block">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="pos-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search anything..."
              className="w-56 lg:w-68 pl-9 pr-10 py-2 rounded-xl bg-white dark:bg-[#0F1E1B] border border-slate-200/80 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#1A6B51] dark:focus:border-[#00B14F] shadow-2xs transition-all"
            />
            <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-mono font-semibold text-slate-400 bg-slate-100 dark:bg-slate-800 rounded">
              ⌘K
            </kbd>
          </div>

          {/* Notifications Bell */}
          <button
            type="button"
            onClick={() => setIsStockModalOpen(true)}
            className="relative w-9 h-9 rounded-xl bg-white dark:bg-[#0F1E1B] border border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-[#1A6B51] dark:hover:text-[#00B14F] flex items-center justify-center transition-all cursor-pointer shadow-2xs"
            title="Pemberitahuan Stok"
          >
            <Bell className="w-4 h-4" />
            {lowStockCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#1A6B51] dark:bg-[#00B14F] text-white text-[9px] font-black flex items-center justify-center shadow-xs">
                {lowStockCount}
              </span>
            )}
          </button>

          {/* Toggle Dark Mode */}
          <button
            type="button"
            onClick={toggleDarkMode}
            className="w-9 h-9 rounded-xl bg-white dark:bg-[#0F1E1B] border border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-amber-400 hover:text-[#1A6B51] flex items-center justify-center transition-all cursor-pointer shadow-2xs"
            title={isDark ? 'Mode Terang' : 'Mode Gelap'}
          >
            {isDark ? (
              <Sun className="w-4 h-4 stroke-[2.2] text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 stroke-[2.2] text-slate-600" />
            )}
          </button>
        </div>
      </div>

      {/* 2. Four KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {/* KPI 1: Total Sales */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#0F1E1B] border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-start justify-between transition-all">
          <div className="space-y-1.5 min-w-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#1A6B51]/10 dark:bg-[#00B14F]/15 text-[#1A6B51] dark:text-[#00B14F] flex items-center justify-center shrink-0">
                <DollarSign className="w-4 h-4 stroke-[2.4]" />
              </div>
              <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 truncate">
                Total Sales
              </span>
            </div>
            <div className="text-lg sm:text-xl font-black text-slate-900 dark:text-white font-mono tracking-tight">
              Rp {totalRevenue.toLocaleString('id-ID')}
            </div>
            <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <span>↑ 18.4%</span>
              <span className="text-slate-400 dark:text-slate-500 font-normal">from yesterday</span>
            </div>
          </div>
          <button type="button" className="text-slate-300 dark:text-slate-600 hover:text-slate-500 p-0.5">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>

        {/* KPI 2: Orders */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#0F1E1B] border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-start justify-between transition-all">
          <div className="space-y-1.5 min-w-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#1A6B51]/10 dark:bg-[#00B14F]/15 text-[#1A6B51] dark:text-[#00B14F] flex items-center justify-center shrink-0">
                <CupSoda className="w-4 h-4 stroke-[2.4]" />
              </div>
              <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 truncate">
                Orders (Cup)
              </span>
            </div>
            <div className="text-lg sm:text-xl font-black text-slate-900 dark:text-white font-mono tracking-tight">
              {totalCupsSold}
            </div>
            <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <span>↑ 8.2%</span>
              <span className="text-slate-400 dark:text-slate-500 font-normal">from yesterday</span>
            </div>
          </div>
          <button type="button" className="text-slate-300 dark:text-slate-600 hover:text-slate-500 p-0.5">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>

        {/* KPI 3: Peak Hours */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#0F1E1B] border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-start justify-between transition-all">
          <div className="space-y-1.5 min-w-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#1A6B51]/10 dark:bg-[#00B14F]/15 text-[#1A6B51] dark:text-[#00B14F] flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4 stroke-[2.4]" />
              </div>
              <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 truncate">
                Peak Hours
              </span>
            </div>
            <div className="text-lg sm:text-xl font-black text-slate-900 dark:text-white font-mono tracking-tight">
              12:00 & 18:00
            </div>
            <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <span>↑ 5.4%</span>
              <span className="text-slate-400 dark:text-slate-500 font-normal">peak load</span>
            </div>
          </div>
          <button type="button" className="text-slate-300 dark:text-slate-600 hover:text-slate-500 p-0.5">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>

        {/* KPI 4: Avg. Order Value */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#0F1E1B] border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-start justify-between transition-all">
          <div className="space-y-1.5 min-w-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#1A6B51]/10 dark:bg-[#00B14F]/15 text-[#1A6B51] dark:text-[#00B14F] flex items-center justify-center shrink-0">
                <Receipt className="w-4 h-4 stroke-[2.4]" />
              </div>
              <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 truncate">
                Avg. Order Value
              </span>
            </div>
            <div className="text-lg sm:text-xl font-black text-slate-900 dark:text-white font-mono tracking-tight">
              Rp 27.042
            </div>
            <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <span>↑ 3.1%</span>
              <span className="text-slate-400 dark:text-slate-500 font-normal">from yesterday</span>
            </div>
          </div>
          <button type="button" className="text-slate-300 dark:text-slate-600 hover:text-slate-500 p-0.5">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
