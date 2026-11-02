'use client';

import React, { useState, useEffect } from 'react';
import { usePos } from '@/context/PosContext';
import { Printer, Bell, Sun, Moon } from 'lucide-react';

export function HeaderPOS() {
  const {
    currentUser,
    ingredients,
    setIsStockModalOpen,
  } = usePos();

  const [dateStr, setDateStr] = useState('');
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // 1. Date format
    const today = new Date();
    const formatted = new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
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

  return (
    <header className="mx-8 mt-5 mb-2 px-6 py-3.5 rounded-2xl bg-white/95 dark:bg-[#0F1E1B]/95 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 shadow-[0_4px_24px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.25)] flex items-center justify-between gap-6 select-none transition-all duration-300">
      {/* 1. Left: Date & Restaurant Title (Logo dihapus sesuai permintaan) */}
      <div className="flex flex-col justify-center">
        <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 tracking-wide block transition-colors duration-300">
          {dateStr || 'Today'}
        </span>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight font-display transition-colors duration-300">
          VITAMINE Juice Bar
        </h1>
      </div>

      {/* 2. Right: Printer Status, Dark Mode Toggle, dan Profil User */}
      <div className="flex items-center gap-3">
        {/* Hardware Status: Printer 58mm */}
        <div className="flex items-center gap-2 text-xs font-semibold px-3.5 py-1.5 rounded-full bg-slate-50 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800 text-slate-700 dark:text-slate-200 shadow-2xs transition-colors duration-300">
          <Printer className="w-3.5 h-3.5 text-[#1A6B51] dark:text-[#00B14F]" />
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-[11px] font-mono tracking-tight font-medium">58mm Ready</span>
        </div>

        {/* Simple Dark Mode Toggle Button */}
        <button
          type="button"
          onClick={toggleDarkMode}
          className="w-9 h-9 rounded-full bg-slate-50 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800 text-slate-600 dark:text-amber-400 hover:text-[#1A6B51] dark:hover:text-amber-300 hover:border-[#1A6B51]/30 dark:hover:border-amber-400/30 shadow-2xs flex items-center justify-center transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95"
          title={isDark ? 'Mode Terang (Light Mode)' : 'Mode Gelap (Dark Mode)'}
          aria-label="Toggle Dark Mode"
        >
          {isDark ? (
            <Sun className="w-4 h-4 stroke-[2.2] text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 stroke-[2.2] text-slate-600" />
          )}
        </button>

        {/* Profil User (Pindah ke sebelah toggle dark mode) */}
        <div
          className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full bg-slate-50 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800 shadow-2xs select-none transition-all duration-300 cursor-pointer hover:border-[#1A6B51]/30 dark:hover:border-[#00B14F]/30"
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
            className="px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-700 dark:text-amber-300 text-xs font-bold flex items-center gap-1.5 animate-pulse transition-colors"
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
