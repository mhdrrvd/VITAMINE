'use client';

import React, { useState, useEffect } from 'react';
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

  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // Default mode: Dark mode (kecuali user pernah memilih 'light')
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

  // Kalkulasi koordinat sparkline dashboard yang lebih lega (width: 130, height: 32)
  const chartW = 130;
  const chartH = 32;
  const maxRev = Math.max(...HOURLY_SALES.map((d) => d.revenue));
  const pts = HOURLY_SALES.map((d, i) => {
    const x = (i / (HOURLY_SALES.length - 1)) * chartW;
    const y = chartH - (d.revenue / maxRev) * (chartH - 8) - 4;
    return { x: Number(x.toFixed(1)), y: Number(y.toFixed(1)), ...d };
  });
  const lineD = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaD = `${lineD} L ${chartW} ${chartH} L 0 ${chartH} Z`;

  return (
    <header className="px-8 py-4 sm:py-5 flex items-center justify-between gap-4 bg-transparent select-none transition-colors duration-300">
      {/* 1. Kiri: Indikator Dashboard Penjualan (Tampil Lebih Besar & Terbuka) */}
      <div className="flex items-center gap-3 lg:gap-4 flex-wrap">
        {/* KPI 1: Total Omset */}
        <div className="flex items-center gap-3.5 px-4.5 py-2.5 rounded-2xl bg-white dark:bg-[#0F1E1B] border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-all">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-[#1A6B51] dark:text-[#00B14F] flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div className="leading-tight">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Total Omset
              </span>
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded-md">
                +18.4%
              </span>
            </div>
            <span className="text-lg sm:text-xl font-black text-slate-900 dark:text-white font-mono tracking-tight">
              Rp {totalRevenue.toLocaleString('id-ID')}
            </span>
          </div>
        </div>

        {/* KPI 2: Cup Terjual */}
        <div className="flex items-center gap-3.5 px-4.5 py-2.5 rounded-2xl bg-white dark:bg-[#0F1E1B] border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-all">
          <div className="w-10 h-10 rounded-xl bg-[#FF7A00]/10 dark:bg-[#FF7A00]/20 text-[#FF7A00] flex items-center justify-center shrink-0">
            <CupSoda className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div className="leading-tight">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Cup Terjual
              </span>
              <span className="text-[10px] font-bold text-[#FF7A00] bg-orange-50 dark:bg-orange-950/60 px-1.5 py-0.5 rounded-md">
                Hari ini
              </span>
            </div>
            <span className="text-lg sm:text-xl font-black text-slate-900 dark:text-white font-mono tracking-tight">
              {totalCupsSold} <span className="text-xs font-semibold text-slate-400">Cup</span>
            </span>
          </div>
        </div>

        {/* KPI 3: Grafik Penjualan Per Jam (Sparkline Lebih Besar & Jelas) */}
        <div className="relative group hidden sm:flex items-center gap-4 px-4.5 py-2.5 rounded-2xl bg-white dark:bg-[#0F1E1B] border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-all cursor-pointer">
          <div className="leading-tight">
            <div className="flex items-center gap-1.5 mb-0.5">
              <Clock className="w-3.5 h-3.5 text-[#1A6B51] dark:text-[#00B14F]" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Penjualan / Jam
              </span>
            </div>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
              Peak: 12:00 & 18:00
            </span>
          </div>

          <div className="relative w-[130px] h-[32px] flex items-center">
            <svg className="w-[130px] h-[32px] overflow-visible" viewBox="0 0 130 32">
              <defs>
                <linearGradient id="headerHourlyGradLg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1A6B51" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#1A6B51" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path d={areaD} fill="url(#headerHourlyGradLg)" />
              <path
                d={lineD}
                fill="none"
                stroke="#1A6B51"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="dark:stroke-[#00B14F]"
              />
              {/* Highlight Peak Dot 12:00 (index 2) */}
              <circle cx={pts[2].x} cy={pts[2].y} r="3" fill="#FF7A00" />
              {/* Highlight Peak Dot 18:00 (index 5) */}
              <circle cx={pts[5].x} cy={pts[5].y} r="3" fill="#1A6B51" className="dark:fill-[#00B14F]" />
            </svg>
          </div>

          {/* Hover Tooltip: Breakdown Jam Ramai */}
          <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-68 p-3.5 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 z-50">
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
                  className={`p-1.5 rounded-lg ${
                    h.hour === '12:00' || h.hour === '18:00'
                      ? 'bg-orange-50 dark:bg-orange-950/40 text-[#FF7A00] font-bold border border-orange-200 dark:border-orange-800/40'
                      : 'bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <div className="text-[10px]">{h.hour}</div>
                  <div className="text-[11px] font-mono leading-tight font-bold">
                    {Math.round(h.revenue / 1000)}k
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Kanan: Toggle Darkmode & User Profile */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Toggle Dark Mode Button */}
        <button
          type="button"
          onClick={toggleDarkMode}
          className="w-10 h-10 rounded-2xl bg-white dark:bg-[#0F1E1B] border border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-amber-400 hover:text-[#1A6B51] dark:hover:text-amber-300 hover:border-[#1A6B51]/30 dark:hover:border-amber-400/30 shadow-xs flex items-center justify-center transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95"
          title={isDark ? 'Mode Terang (Light Mode)' : 'Mode Gelap (Dark Mode)'}
          aria-label="Toggle Dark Mode"
        >
          {isDark ? (
            <Sun className="w-4.5 h-4.5 stroke-[2.2] text-amber-400" />
          ) : (
            <Moon className="w-4.5 h-4.5 stroke-[2.2] text-slate-600" />
          )}
        </button>

        {/* Profil User */}
        <div
          className="flex items-center gap-2.5 pl-1.5 pr-3.5 py-1.5 rounded-2xl bg-white dark:bg-[#0F1E1B] border border-slate-200/80 dark:border-slate-800 shadow-xs select-none transition-all duration-300 hover:border-[#1A6B51]/30 dark:hover:border-[#00B14F]/30"
          title={`Kasir Aktif: ${currentUser.name} (${currentUser.role})`}
        >
          <div className="w-8 h-8 rounded-xl bg-[#1A6B51] dark:bg-[#00B14F] text-white dark:text-slate-950 font-black text-xs flex items-center justify-center shadow-xs">
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
            className="px-2.5 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-700 dark:text-amber-300 text-xs font-bold flex items-center gap-1.5 animate-pulse transition-colors cursor-pointer"
            title="Bahan Baku Menipis"
          >
            <Bell className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span className="text-[11px]">{lowStockCount} alert</span>
          </button>
        )}
      </div>
    </header>
  );
}
