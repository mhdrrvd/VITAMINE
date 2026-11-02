'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { usePos } from '@/context/PosContext';
import { TrendingUp, CupSoda, Clock, Sun, Moon, Bell } from 'lucide-react';

// Data penjualan per jam (08:00 - 21:00)
const HOURLY_SALES = [
  { hour: '08:00', revenue: 140000, orders: 6 },
  { hour: '10:00', revenue: 320000, orders: 13 },
  { hour: '12:00', revenue: 840000, orders: 32 }, // Lunch peak
  { hour: '14:00', revenue: 620000, orders: 24 },
  { hour: '16:00', revenue: 410000, orders: 16 },
  { hour: '18:00', revenue: 780000, orders: 29 }, // Dinner peak
  { hour: '20:00', revenue: 580000, orders: 18 },
  { hour: '21:00', revenue: 150000, orders: 4 },
];

export function HeaderPOS() {
  const {
    currentUser,
    ingredients,
    setIsStockModalOpen,
    recentOrders,
  } = usePos();

  const [dateStr, setDateStr] = useState('');
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // 1. Date format
    const today = new Date();
    const formatted = new Intl.DateTimeFormat('id-ID', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(today);
    setDateStr(formatted);

    // 2. Dark mode initialization
    const savedTheme = localStorage.getItem('vitamine-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = savedTheme === 'dark' || (!savedTheme && prefersDark);

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

  // Kalkulasi koordinat mini sparkline (width: 110, height: 26)
  const chartW = 110;
  const chartH = 26;
  const maxRev = Math.max(...HOURLY_SALES.map((d) => d.revenue));
  const pts = HOURLY_SALES.map((d, i) => {
    const x = (i / (HOURLY_SALES.length - 1)) * chartW;
    const y = chartH - (d.revenue / maxRev) * (chartH - 6) - 2;
    return { x: Number(x.toFixed(1)), y: Number(y.toFixed(1)), ...d };
  });
  const lineD = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaD = `${lineD} L ${chartW} ${chartH} L 0 ${chartH} Z`;

  return (
    <header className="px-8 pt-5 pb-3 flex items-center justify-between gap-4 bg-transparent select-none transition-colors duration-300">
      {/* 1. Kiri: Logo VM, Tanggal & Judul Dashboard Penjualan */}
      <div className="flex items-center gap-3">
        <div className="relative w-11 h-10 rounded-2xl bg-white dark:bg-[#0F1E1B] border border-slate-200/80 dark:border-slate-800 shadow-2xs flex items-center justify-center p-1.5 shrink-0 overflow-hidden">
          <Image
            src="/images/logo-vm.png"
            alt="VM Logo"
            width={38}
            height={32}
            className="object-contain"
            priority
          />
        </div>
        <div className="flex flex-col justify-center">
          <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 tracking-wide block transition-colors duration-300">
            {dateStr || 'Hari Ini'}
          </span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight font-display transition-colors duration-300">
            Dashboard Penjualan
          </h1>
        </div>
      </div>

      {/* 2. Tengah: Total Omset, Cup Terjual, dan Grafik Penjualan Per Jam */}
      <div className="hidden md:flex items-center gap-2.5 lg:gap-3">
        {/* KPI 1: Total Omset */}
        <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-2xl bg-white/90 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 shadow-2xs transition-all">
          <div className="w-7 h-7 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-[#1A6B51] dark:text-[#00B14F] flex items-center justify-center shrink-0">
            <TrendingUp className="w-4 h-4 stroke-[2.2]" />
          </div>
          <div className="leading-tight">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Total Omset
              </span>
              <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1 rounded">
                +18%
              </span>
            </div>
            <span className="text-sm font-extrabold text-slate-900 dark:text-white font-mono">
              Rp {totalRevenue.toLocaleString('id-ID')}
            </span>
          </div>
        </div>

        {/* KPI 2: Cup Terjual */}
        <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-2xl bg-white/90 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 shadow-2xs transition-all">
          <div className="w-7 h-7 rounded-xl bg-orange-50 dark:bg-orange-950/60 text-[#FF7A00] flex items-center justify-center shrink-0">
            <CupSoda className="w-4 h-4 stroke-[2.2]" />
          </div>
          <div className="leading-tight">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Cup Terjual
              </span>
              <span className="text-[9px] font-bold text-[#FF7A00] bg-orange-50 dark:bg-orange-950/60 px-1 rounded">
                Hari ini
              </span>
            </div>
            <span className="text-sm font-extrabold text-slate-900 dark:text-white font-mono">
              {totalCupsSold} <span className="text-xs font-semibold text-slate-500">Cup</span>
            </span>
          </div>
        </div>

        {/* KPI 3: Grafik Penjualan Per Jam (Interactive Sparkline with Hover Tooltip) */}
        <div className="relative group hidden lg:flex items-center gap-3 px-3.5 py-1.5 rounded-2xl bg-white/90 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 shadow-2xs cursor-pointer hover:border-[#1A6B51]/30 dark:hover:border-[#00B14F]/30 transition-all">
          <div className="leading-tight">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-[#1A6B51] dark:text-[#00B14F]" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Penjualan / Jam
              </span>
            </div>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
              Peak: 12:00 & 18:00
            </span>
          </div>

          <div className="relative w-[110px] h-[26px] flex items-center">
            <svg className="w-[110px] h-[26px] overflow-visible" viewBox="0 0 110 26">
              <defs>
                <linearGradient id="headerHourlyGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1A6B51" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#1A6B51" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path d={areaD} fill="url(#headerHourlyGrad)" />
              <path
                d={lineD}
                fill="none"
                stroke="#1A6B51"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="dark:stroke-[#00B14F]"
              />
              {/* Highlight Peak Dot 12:00 (index 2) */}
              <circle cx={pts[2].x} cy={pts[2].y} r="2.5" fill="#FF7A00" />
              {/* Highlight Peak Dot 18:00 (index 5) */}
              <circle cx={pts[5].x} cy={pts[5].y} r="2.5" fill="#1A6B51" className="dark:fill-[#00B14F]" />
            </svg>
          </div>

          {/* Hover Tooltip: Breakdown Jam Ramai */}
          <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-64 p-3 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 z-50">
            <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-800 dark:text-white">
                Tren Jam Ramai (Peak Hours)
              </span>
              <span className="text-[10px] text-slate-400">08:00 - 21:00</span>
            </div>
            <div className="grid grid-cols-4 gap-1.5 text-center">
              {HOURLY_SALES.map((h) => (
                <div
                  key={h.hour}
                  className={`p-1 rounded-lg ${
                    h.hour === '12:00' || h.hour === '18:00'
                      ? 'bg-orange-50 dark:bg-orange-950/40 text-[#FF7A00] font-bold border border-orange-200 dark:border-orange-800/40'
                      : 'bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <div className="text-[9px]">{h.hour}</div>
                  <div className="text-[10px] font-mono leading-tight">
                    {Math.round(h.revenue / 1000)}k
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Kanan: Toggle Darkmode & User Profile (Status print dihapus sesuai permintaan) */}
      <div className="flex items-center gap-3">
        {/* Toggle Dark Mode Button */}
        <button
          type="button"
          onClick={toggleDarkMode}
          className="w-9 h-9 rounded-full bg-white/90 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-amber-400 hover:text-[#1A6B51] dark:hover:text-amber-300 hover:border-[#1A6B51]/30 dark:hover:border-amber-400/30 shadow-2xs flex items-center justify-center transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95"
          title={isDark ? 'Mode Terang (Light Mode)' : 'Mode Gelap (Dark Mode)'}
          aria-label="Toggle Dark Mode"
        >
          {isDark ? (
            <Sun className="w-4 h-4 stroke-[2.2] text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 stroke-[2.2] text-slate-600" />
          )}
        </button>

        {/* Profil User */}
        <div
          className="flex items-center gap-2 pl-1 pr-3.5 py-1 rounded-full bg-white/90 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 shadow-2xs select-none transition-all duration-300 hover:border-[#1A6B51]/30 dark:hover:border-[#00B14F]/30"
          title={`Kasir Aktif: ${currentUser.name} (${currentUser.role})`}
        >
          <div className="w-7 h-7 rounded-full bg-[#1A6B51] dark:bg-[#00B14F] text-white dark:text-slate-950 font-extrabold text-[11px] flex items-center justify-center shadow-xs">
            {currentUser.name.slice(0, 2).toUpperCase()}
          </div>
          <div className="text-left leading-tight hidden md:block">
            <p className="text-xs font-bold text-slate-800 dark:text-slate-100 max-w-[110px] truncate">
              {currentUser.name}
            </p>
            <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 capitalize block -mt-0.5">
              {currentUser.role.toLowerCase()}
            </span>
          </div>
        </div>

        {lowStockCount > 0 && (
          <button
            type="button"
            onClick={() => setIsStockModalOpen(true)}
            className="px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-700 dark:text-amber-300 text-xs font-bold flex items-center gap-1.5 animate-pulse transition-colors cursor-pointer"
            title="Bahan Baku Menipis"
          >
            <Bell className="w-3 h-3 text-amber-600 dark:text-amber-400" />
            <span className="text-[11px]">{lowStockCount} alert</span>
          </button>
        )}
      </div>
    </header>
  );
}
