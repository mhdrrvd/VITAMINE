'use client';

import React, { useState } from 'react';
import { usePos } from '@/context/PosContext';
import { AlertTriangle, ArrowRight, X, PackageOpen, Layers } from 'lucide-react';
import { DashboardTab } from './SidebarDashboard';

interface LowStockBannerProps {
  onNavigateToBom: () => void;
}

export function LowStockBanner({ onNavigateToBom }: LowStockBannerProps) {
  const { ingredients } = usePos();
  const [isDismissed, setIsDismissed] = useState(false);

  const lowStockItems = ingredients.filter(
    (ing) => ing.currentStock <= ing.minStockAlert
  );

  if (isDismissed || lowStockItems.length === 0) return null;

  return (
    <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-[#0F1E1B] border border-amber-500/30 shadow-lg relative overflow-hidden animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0 mt-0.5">
            <AlertTriangle className="w-5 h-5 stroke-[2.4]" />
          </div>

          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-extrabold text-white">
                Peringatan Stok Menipis ({lowStockItems.length} Bahan Baku Kritis)
              </h4>
              <span className="px-2 py-0.2 rounded-md bg-amber-500 text-slate-950 text-[10px] font-bold font-mono">
                Segera Restock
              </span>
            </div>

            <p className="text-xs text-white/70">
              Bahan baku berikut telah mencapai batas minimum dan berpotensi menghambat transaksi di kasir:
            </p>

            <div className="flex flex-wrap gap-2 pt-1.5">
              {lowStockItems.map((item) => (
                <div
                  key={item.id}
                  className="px-2.5 py-1 rounded-xl bg-black/40 border border-white/10 text-[11px] font-mono text-amber-300 flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                  <span className="font-bold text-white">{item.name}:</span>
                  <span>
                    {item.currentStock.toLocaleString('id-ID')}{' '}
                    {item.unit === 'GRAM' ? 'gr' : item.unit === 'ML' ? 'ml' : 'pcs'}
                  </span>
                  <span className="text-white/40">
                    (Min: {item.minStockAlert})
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
          <button
            type="button"
            onClick={onNavigateToBom}
            className="btn-kilat px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-all cursor-pointer"
          >
            <span>Buka Resep & Stok BOM</span>
            <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>

          <button
            type="button"
            onClick={() => setIsDismissed(true)}
            className="p-2 rounded-xl hover:bg-white/10 text-white/50 hover:text-white transition-colors"
            title="Tutup Peringatan"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
