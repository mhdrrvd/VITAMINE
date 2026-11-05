'use client';

import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  CupSoda,
  AlertOctagon,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

interface KpiData {
  totalRevenue: number;
  revenueGrowth: number;
  totalOrders: number;
  averageOrderValue: number;
  wasteCost: number;
  wastePercentage: number;
  wasteKg: number;
  cashReconciliationStatus: 'BALANCE' | 'DISCREPANCY';
  unbalancedShiftsCount: number;
}

const SAMPLE_KPI: KpiData = {
  totalRevenue: 3840000,
  revenueGrowth: 18.4,
  totalOrders: 142,
  averageOrderValue: 27042,
  wasteCost: 48000,
  wastePercentage: 1.2,
  wasteKg: 2.1,
  cashReconciliationStatus: 'BALANCE',
  unbalancedShiftsCount: 0,
};

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const width = 100;
  const height = 28;

  const points = data
    .map((val, idx) => {
      const x = (idx / (data.length - 1)) * width;
      const y = height - ((val - min) / range) * (height - 6) - 3;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  return (
    <svg className="w-20 h-6 overflow-visible opacity-80" viewBox={`0 0 ${width} ${height}`}>
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
}

export function KpiCardsSection() {
  const [data, setData] = useState<KpiData>(SAMPLE_KPI);
  const [displayRevenue, setDisplayRevenue] = useState(0);

  // Animated rolling counter for revenue
  useEffect(() => {
    let start = 0;
    const end = data.totalRevenue;
    const duration = 1200;
    const stepTime = 20;
    const steps = duration / stepTime;
    const increment = end / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setDisplayRevenue(end);
        clearInterval(timer);
      } else {
        setDisplayRevenue(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [data.totalRevenue]);

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Total Revenue Card */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm relative overflow-hidden group hover:border-orange-500/50 transition-all">
        <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/10 rounded-full blur-xl pointer-events-none group-hover:bg-orange-500/20 transition-all" />

        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Total Omzet Nett
          </span>
          <div className="w-8 h-8 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center">
            <DollarSign className="w-4 h-4" />
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex items-baseline justify-between">
            <h3 className="text-2xl sm:text-3xl font-black text-white font-display">
              Rp {displayRevenue.toLocaleString('id-ID')}
            </h3>
            <Sparkline data={[2100, 2400, 2200, 2900, 3100, 2800, 3400, 3840]} color="#10B981" />
          </div>
          <div className="flex items-center gap-2 pt-1">
            <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
              <TrendingUp className="w-3 h-3" />
              +{data.revenueGrowth}%
            </span>
            <span className="text-[11px] text-slate-400">vs kemarin</span>
          </div>
        </div>
      </div>

      {/* 2. Total Orders Card */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm relative overflow-hidden group hover:border-blue-500/50 transition-all">
        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-xl pointer-events-none group-hover:bg-blue-500/20 transition-all" />

        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Cup Terjual
          </span>
          <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
            <CupSoda className="w-4 h-4" />
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex items-baseline justify-between">
            <h3 className="text-2xl sm:text-3xl font-black text-white font-display">
              {data.totalOrders} Pesanan
            </h3>
            <Sparkline data={[85, 92, 110, 105, 128, 134, 142]} color="#38BDF8" />
          </div>
          <div className="flex items-center gap-2 pt-1">
            <span className="text-[11px] font-bold text-slate-300">
              Rata-rata Rp {data.averageOrderValue.toLocaleString('id-ID')}/cup
            </span>
          </div>
        </div>
      </div>

      {/* 3. Waste & Spoilage Card */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm relative overflow-hidden group hover:border-rose-500/50 transition-all">
        <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/10 rounded-full blur-xl pointer-events-none group-hover:bg-rose-500/20 transition-all" />

        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Biaya Buah Rusak (Waste)
          </span>
          <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
            <AlertOctagon className="w-4 h-4" />
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex items-baseline justify-between">
            <h3 className="text-2xl sm:text-3xl font-black text-white font-display">
              Rp {data.wasteCost.toLocaleString('id-ID')}
            </h3>
            <Sparkline data={[120, 95, 75, 80, 60, 52, 48]} color="#F43F5E" />
          </div>
          <div className="flex items-center gap-2 pt-1">
            <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
              {data.wastePercentage}% Waste
            </span>
            <span className="text-[11px] text-slate-400">({data.wasteKg} kg buah rusak)</span>
          </div>
        </div>
      </div>

      {/* 4. Cash Drawer Reconciliation Card */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm relative overflow-hidden group hover:border-emerald-500/50 transition-all">
        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl pointer-events-none group-hover:bg-emerald-500/20 transition-all" />

        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Audit Kas Laci
          </span>
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4" />
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex items-baseline justify-between">
            <h3 className="text-xl sm:text-2xl font-black text-emerald-400 font-display flex items-center gap-2">
              <span>PAS (BALANCE)</span>
            </h3>
            <Sparkline data={[0, 0, 0, 0, 0, 0, 0]} color="#10B981" />
          </div>
          <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-400">
            <span>100% Shift Tercatat &bull; 0 Kasir Minus</span>
          </div>
        </div>
      </div>
    </section>
  );
}

