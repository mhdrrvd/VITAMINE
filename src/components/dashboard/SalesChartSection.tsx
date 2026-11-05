'use client';

import React, { useState } from 'react';
import { Clock, PieChart, Sparkles, TrendingUp, BarChart2 } from 'lucide-react';

interface HourlyData {
  hour: string;
  revenue: number;
  orders: number;
}

const HOURLY_SALES: HourlyData[] = [
  { hour: '08:00', revenue: 140000, orders: 6 },
  { hour: '10:00', revenue: 320000, orders: 13 },
  { hour: '12:00', revenue: 840000, orders: 32 }, // Lunch peak
  { hour: '14:00', revenue: 620000, orders: 24 },
  { hour: '16:00', revenue: 410000, orders: 16 },
  { hour: '18:00', revenue: 780000, orders: 29 }, // Dinner peak
  { hour: '20:00', revenue: 580000, orders: 18 },
  { hour: '21:00', revenue: 150000, orders: 4 },
];

const TOP_FRUITS = [
  { name: 'Jus Mangga Harum Manis', percent: 34, color: '#FF9800', cups: 48 },
  { name: 'Jus Alpukat Mentega', percent: 28, color: '#8BC34A', cups: 40 },
  { name: 'Paket VIT-C Booster', percent: 18, color: '#F59E0B', cups: 26 },
  { name: 'Jus Buah Naga Merah', percent: 12, color: '#E91E63', cups: 17 },
  { name: 'Lainnya & Add-on', percent: 8, color: '#94A3B8', cups: 11 },
];

const CATEGORY_MARGINS = [
  { name: 'Paket Vitamin (Multi)', margin: 74, hpp: 7000, price: 27000, color: '#00E565' },
  { name: 'Mix Fruit Juice', margin: 71, hpp: 6900, price: 24000, color: '#38BDF8' },
  { name: 'Regular Single Fruit', margin: 68, hpp: 7040, price: 22000, color: '#F59E0B' },
  { name: 'Add-on & Extra Topping', margin: 82, hpp: 900, price: 5000, color: '#A855F7' },
];

export function SalesChartSection() {
  const [hoveredHour, setHoveredHour] = useState<HourlyData | null>(null);
  const [viewMode, setViewMode] = useState<'HOURLY' | 'MARGIN'>('HOURLY');

  // SVG Area Chart Calculations
  const maxRevenue = Math.max(...HOURLY_SALES.map((d) => d.revenue));
  const chartHeight = 160;
  const chartWidth = 500;

  const points = HOURLY_SALES.map((d, idx) => {
    const x = (idx / (HOURLY_SALES.length - 1)) * chartWidth;
    const y = chartHeight - (d.revenue / maxRevenue) * (chartHeight - 20) - 10;
    return { x, y, data: d };
  });

  const pathD = points.reduce((acc, pt, idx) => {
    return idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
  }, '');

  const areaD = `${pathD} L ${chartWidth} ${chartHeight} L 0 ${chartHeight} Z`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* 1. Hourly Sales Trend Chart (7 cols) */}
      <div className="lg:col-span-7 p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm flex flex-col justify-between">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="font-extrabold text-white text-base font-display flex items-center gap-2">
              {viewMode === 'HOURLY' ? (
                <>
                  <Clock className="w-4 h-4 text-orange-400" />
                  <span>Tren Penjualan Jam Sibuk (Peak Hours)</span>
                </>
              ) : (
                <>
                  <TrendingUp className="w-4 h-4 text-[#00E565]" />
                  <span>Analisis Gross Margin per Kategori Menu</span>
                </>
              )}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {viewMode === 'HOURLY'
                ? 'Distribusi omzet per interval 2 jam di meja kasir'
                : 'Tingkat profitabilitas bersih berdasarkan kalkulasi resep BOM'}
            </p>
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800 text-[11px] font-bold self-start sm:self-center">
            <button
              type="button"
              onClick={() => setViewMode('HOURLY')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'HOURLY'
                  ? 'bg-[#00B14F] text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Jam Sibuk
            </button>
            <button
              type="button"
              onClick={() => setViewMode('MARGIN')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'MARGIN'
                  ? 'bg-[#00B14F] text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Margin HPP
            </button>
          </div>
        </div>

        {viewMode === 'MARGIN' ? (
          <div className="space-y-3.5 my-auto py-2">
            {CATEGORY_MARGINS.map((cat) => (
              <div key={cat.name} className="space-y-1.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-white">{cat.name}</span>
                  <span className="font-mono text-[#00E565]">
                    Margin {cat.margin}% (HPP: Rp {cat.hpp.toLocaleString('id-ID')})
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${cat.margin}%`, backgroundColor: cat.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="relative w-full pt-4">
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="w-full h-44 overflow-visible"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FF6B00" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#FF6B00" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Area Fill */}
              <path d={areaD} fill="url(#revenueGradient)" />

              {/* Line Path */}
              <path
                d={pathD}
                fill="none"
                stroke="#FF6B00"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Interactive Data Dots */}
              {points.map((pt, idx) => (
                <circle
                  key={idx}
                  cx={pt.x}
                  cy={pt.y}
                  r="4"
                  className="fill-slate-900 stroke-orange-400 stroke-2 hover:r-6 cursor-pointer transition-all"
                  onMouseEnter={() => setHoveredHour(pt.data)}
                  onMouseLeave={() => setHoveredHour(null)}
                />
              ))}
            </svg>

            {/* X Axis Labels */}
            <div className="flex justify-between text-[11px] font-mono text-slate-500 mt-2 border-t border-slate-800 pt-2">
              {HOURLY_SALES.map((d) => (
                <span key={d.hour}>{d.hour}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 2. Top-Selling Fruits Breakdown (5 cols) */}
      <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-extrabold text-white text-base font-display flex items-center gap-2">
              <PieChart className="w-4 h-4 text-emerald-400" />
              <span>Komposisi Menu Terlaris (Top Fruits)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Persentase kontribusi per kategori buah segar
            </p>
          </div>
        </div>

        {/* Progress Bar Stack & Legend */}
        <div className="space-y-4 my-auto">
          {/* Multi-segmented Bar */}
          <div className="w-full h-4 rounded-full overflow-hidden flex bg-slate-800">
            {TOP_FRUITS.map((fruit) => (
              <div
                key={fruit.name}
                style={{ width: `${fruit.percent}%`, backgroundColor: fruit.color }}
                title={`${fruit.name}: ${fruit.percent}%`}
                className="h-full hover:opacity-90 transition-opacity"
              />
            ))}
          </div>

          {/* List items */}
          <div className="space-y-2.5 pt-2">
            {TOP_FRUITS.map((fruit) => (
              <div
                key={fruit.name}
                className="flex items-center justify-between text-xs py-1 px-2 rounded-lg hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: fruit.color }}
                  />
                  <span className="font-bold text-slate-200">{fruit.name}</span>
                </div>
                <div className="flex items-center gap-3 font-mono">
                  <span className="text-slate-400">{fruit.cups} cup</span>
                  <span className="font-extrabold text-white">{fruit.percent}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

