'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, ShoppingBag, Users, TrendingUp, TrendingDown, Layers } from 'lucide-react';

export function MetricsRow() {
  const metrics = [
    {
      label: 'Total Sales',
      value: 'Rp 3.840.000',
      change: '+12.5% from yesterday',
      isPositive: true,
      icon: DollarSign,
    },
    {
      label: 'Orders',
      value: '128',
      change: '-0.2% from yesterday',
      isPositive: false,
      icon: ShoppingBag,
    },
    {
      label: 'Sisa Stok Bahan',
      value: '42.5 kg',
      change: '+5.4% restock pagi',
      isPositive: true,
      icon: Layers,
    },
    {
      label: 'Avg. Order Value',
      value: 'Rp 27.500',
      change: '+2.1% from yesterday',
      isPositive: true,
      icon: Users,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 px-6 sm:px-8 pt-5 pb-2 select-none">
      {metrics.map((m, idx) => {
        const IconComponent = m.icon;
        return (
          <motion.div
            key={idx}
            whileHover={{ y: -3, transition: { duration: 0.2, ease: 'easeOut' } }}
            className="p-4 rounded-2xl bg-white border border-slate-200/70 shadow-xs flex items-center gap-4 hover:border-[#8EB69B]/70 hover:shadow-sm transition-all cursor-default"
          >
            {/* Circular Icon with light mint background from palette */}
            <motion.div
              whileHover={{ scale: 1.08 }}
              className="w-11 h-11 rounded-full bg-[#DAF1DE] text-[#235347] flex items-center justify-center shrink-0 shadow-xs transition-transform"
            >
              <IconComponent className="w-5 h-5 stroke-[2.2]" />
            </motion.div>

            <div className="flex-1 min-w-0">
              <span className="text-xs text-slate-500 font-semibold block truncate">
                {m.label}
              </span>
              <h3 className="text-lg sm:text-xl font-extrabold text-[#051F20] font-display tracking-tight leading-tight">
                {m.value}
              </h3>
              <div className="flex items-center gap-1 text-[11px] font-bold mt-0.5">
                {m.isPositive ? (
                  <span className="text-[#235347] flex items-center gap-0.5">
                    <TrendingUp className="w-3 h-3" />
                    {m.change}
                  </span>
                ) : (
                  <span className="text-rose-600 flex items-center gap-0.5">
                    <TrendingDown className="w-3 h-3" />
                    {m.change}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
