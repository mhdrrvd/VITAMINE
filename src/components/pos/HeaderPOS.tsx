'use client';

import React, { useState, useEffect } from 'react';
import { usePos } from '@/context/PosContext';
import {
  DollarSign,
  CupSoda,
  Clock,
  Calendar,
  Receipt,
  MoreVertical,
  Menu,
  Users,
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

  // Ensure dark mode is active
  useEffect(() => {
    document.documentElement.classList.add('dark');
    try {
      localStorage.setItem('vitamine-theme', 'dark');
    } catch (e) {}
  }, []);

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

  const additionalCustomers = (recentOrders || [])
    .filter((o) => !o.id.startsWith('order-sample-')).length;

  const totalRevenue = 3840000 + additionalRevenue;
  const totalCupsSold = 142 + additionalCups;
  const totalCustomers = 118 + additionalCustomers;

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
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                Indomaret Mabar
              </h2>
            </div>

              {/* Tanggal & Waktu Real-Time */}
              <div className="flex items-center gap-2 text-xs text-[#00E565] mt-1 font-medium flex-wrap">
                <span className="flex items-center gap-1.5 text-[#00E565] font-semibold">
                  <Calendar className="w-3.5 h-3.5 text-[#00E565]" />
                  {currentDate || 'Senin, 2 November 2026'}
                </span>
                <span className="text-[#00E565]/40">•</span>
                <span className="flex items-center gap-1.5 font-mono font-bold text-[#00E565]">
                  <Clock className="w-3.5 h-3.5 text-[#00E565]" />
                  {currentTime || '18:00:00 WIB'}
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] text-[#00E565] font-bold ml-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00E565] animate-pulse" />
                  Live
                </span>
              </div>
            </div>
          </div>

          {/* Right: User Login */}
          <div className="flex items-center gap-2.5">
            {/* User Profile Card */}
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-2xl bg-white dark:bg-[#0F1E1B] border border-slate-200/80 dark:border-slate-800 shadow-2xs">
              <div className="w-8 h-8 rounded-xl bg-[#00E565]/15 text-[#00E565] flex items-center justify-center font-bold text-xs shrink-0 border border-[#00E565]/30">
                {currentUser?.name ? currentUser.name.slice(0, 2).toUpperCase() : 'RP'}
              </div>
              <div className="text-left leading-tight pr-1">
                <div className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                  {currentUser?.name || 'Rian Pratama'}
                </div>
                <div className="text-[10px] font-medium text-[#00E565] flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00E565] shrink-0" />
                  <span className="truncate">{currentUser?.role === 'CASHIER' ? 'Kasir (Shift 1)' : 'Owner'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Four KPI Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
          {/* KPI 1: Total Sales */}
          <div className="p-4 rounded-2xl bg-white dark:bg-[#0F1E1B] border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-start justify-between transition-all">
            <div className="space-y-1.5 min-w-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#00E565]/15 text-[#00E565] flex items-center justify-center shrink-0">
                  <DollarSign className="w-4 h-4 stroke-[2.4]" />
                </div>
                <span className="text-xs font-semibold text-[#00E565] truncate">
                  Total Sales
                </span>
              </div>
              <div className="text-lg sm:text-xl font-black text-slate-900 dark:text-white font-mono tracking-tight">
                Rp {totalRevenue.toLocaleString('id-ID')}
              </div>
              <div className="text-[11px] font-bold text-[#00E565] flex items-center gap-1">
                <span>↑ 18.4%</span>
                <span className="text-[#00E565]/80 font-normal">from yesterday</span>
              </div>
            </div>
            <button type="button" className="text-[#00E565]/40 hover:text-[#00E565] p-0.5">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>

          {/* KPI 2: Orders */}
          <div className="p-4 rounded-2xl bg-white dark:bg-[#0F1E1B] border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-start justify-between transition-all">
            <div className="space-y-1.5 min-w-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#00E565]/15 text-[#00E565] flex items-center justify-center shrink-0">
                  <CupSoda className="w-4 h-4 stroke-[2.4]" />
                </div>
                <span className="text-xs font-semibold text-[#00E565] truncate">
                  Orders (Cup)
                </span>
              </div>
              <div className="text-lg sm:text-xl font-black text-slate-900 dark:text-white font-mono tracking-tight">
                {totalCupsSold}
              </div>
              <div className="text-[11px] font-bold text-[#00E565] flex items-center gap-1">
                <span>↑ 8.2%</span>
                <span className="text-[#00E565]/80 font-normal">from yesterday</span>
              </div>
            </div>
            <button type="button" className="text-[#00E565]/40 hover:text-[#00E565] p-0.5">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>

          {/* KPI 3: Total Customer */}
          <div className="p-4 rounded-2xl bg-white dark:bg-[#0F1E1B] border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-start justify-between transition-all">
            <div className="space-y-1.5 min-w-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#00E565]/15 text-[#00E565] flex items-center justify-center shrink-0">
                  <Users className="w-4 h-4 stroke-[2.4]" />
                </div>
                <span className="text-xs font-semibold text-[#00E565] truncate">
                  Total Customer
                </span>
              </div>
              <div className="text-lg sm:text-xl font-black text-slate-900 dark:text-white font-mono tracking-tight">
                {totalCustomers}
              </div>
              <div className="text-[11px] font-bold text-[#00E565] flex items-center gap-1">
                <span>↑ 12.5%</span>
                <span className="text-[#00E565]/80 font-normal">from yesterday</span>
              </div>
            </div>
            <button type="button" className="text-[#00E565]/40 hover:text-[#00E565] p-0.5">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>

          {/* KPI 4: Avg. Order Value */}
          <div className="p-4 rounded-2xl bg-white dark:bg-[#0F1E1B] border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-start justify-between transition-all">
            <div className="space-y-1.5 min-w-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#00E565]/15 text-[#00E565] flex items-center justify-center shrink-0">
                  <Receipt className="w-4 h-4 stroke-[2.4]" />
                </div>
                <span className="text-xs font-semibold text-[#00E565] truncate">
                  Avg. Order Value
                </span>
              </div>
              <div className="text-lg sm:text-xl font-black text-slate-900 dark:text-white font-mono tracking-tight">
                Rp 27.042
              </div>
              <div className="text-[11px] font-bold text-[#00E565] flex items-center gap-1">
                <span>↑ 3.1%</span>
                <span className="text-[#00E565]/80 font-normal">from yesterday</span>
              </div>
            </div>
            <button type="button" className="text-[#00E565]/40 hover:text-[#00E565] p-0.5">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
}
