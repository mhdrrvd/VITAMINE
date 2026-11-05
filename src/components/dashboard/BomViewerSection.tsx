'use client';

import React from 'react';
import { usePos } from '@/context/PosContext';
import { Layers, ShieldCheck, Info, DollarSign, TrendingUp, Scale, CheckCircle2 } from 'lucide-react';

export function BomViewerSection() {
  const { products, ingredients, getCupCapacity } = usePos();

  const calculateHpp = (recipe: { ingredientId: string; quantityRequired: number }[]) => {
    return recipe.reduce((acc, r) => {
      const ing = ingredients.find((i) => i.id === r.ingredientId);
      return acc + (ing ? ing.costPerUnit * r.quantityRequired : 0);
    }, 0);
  };

  const avgHpp = Math.round(
    products.reduce((acc, p) => acc + calculateHpp(p.recipe), 0) / (products.length || 1)
  );

  return (
    <div className="space-y-6">
      {/* 1. Header Row */}
      <div className="p-6 rounded-3xl bg-[#0F1E1B] border border-white/10 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-white font-display tracking-tight flex items-center gap-2">
              <Layers className="w-5 h-5 text-orange-400" />
              <span>Master Resep & Formula Bill of Materials (BOM)</span>
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-[#00E565]/20 text-[#00E565] text-xs font-mono font-bold border border-[#00E565]/30">
              Live Stock Deduction
            </span>
          </div>
          <p className="text-xs text-white/60 mt-1 max-w-2xl">
            Konfigurasi pemotongan otomatis bahan mentah di inventaris setiap kali 1 cup jus terjual di kasir. Dilengkapi analisis HPP per porsi.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-semibold self-start sm:self-auto">
          <Info className="w-4 h-4 shrink-0" />
          <span>Gula cair dipotong flat overhead 30ml/cup</span>
        </div>
      </div>

      {/* 2. BOM Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-[#0F1E1B] border border-white/10 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-white/60">Formula Aktif</span>
            <div className="text-xl font-black text-white font-mono mt-0.5">
              {products.length} Resep Terdaftar
            </div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-white/5 text-[#00E565] flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0F1E1B] border border-white/10 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-white/60">Rata-Rata HPP BOM</span>
            <div className="text-xl font-black text-[#00E565] font-mono mt-0.5">
              Rp {avgHpp.toLocaleString('id-ID')} / cup
            </div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-[#00E565]/15 text-[#00E565] flex items-center justify-center">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0F1E1B] border border-white/10 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-white/60">Bahan Baku Terhubung</span>
            <div className="text-xl font-black text-amber-400 font-mono mt-0.5">
              {ingredients.length} Jenis Bahan Mentah
            </div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center">
            <Scale className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 3. Products BOM Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((prod) => {
          const hpp = calculateHpp(prod.recipe);
          const margin = Math.round(((prod.basePrice - hpp) / prod.basePrice) * 100);
          const capacity = getCupCapacity(prod);

          return (
            <div
              key={prod.id}
              className="p-5 rounded-3xl bg-[#0F1E1B] border border-white/10 shadow-sm flex flex-col justify-between hover:border-[#00B14F]/40 transition-colors"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <h3 className="font-extrabold text-white text-base font-display">
                      {prod.name}
                    </h3>
                    <span className="text-[10px] text-white/50 font-mono">
                      Kapasitas Stok: {capacity} Cup
                    </span>
                  </div>
                  <span className="px-2.5 py-1 rounded-xl bg-orange-500/20 text-orange-400 font-mono text-xs font-black border border-orange-500/30">
                    Rp {prod.basePrice.toLocaleString('id-ID')}
                  </span>
                </div>

                {/* HPP & Margin Pill */}
                <div className="p-2.5 px-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between text-xs font-mono mb-3">
                  <span className="text-white/60">
                    HPP:{' '}
                    <strong className="text-white">Rp {Math.round(hpp).toLocaleString('id-ID')}</strong>
                  </span>
                  <span className="text-[#00E565] font-bold">
                    Margin: {margin}%
                  </span>
                </div>

                <div className="space-y-2 pt-2 border-t border-white/10">
                  <span className="text-[11px] font-bold text-white/40 uppercase tracking-wider block font-mono">
                    Komposisi Bahan Per Cup:
                  </span>

                  <div className="space-y-1.5 text-xs font-mono">
                    {prod.recipe.map((r, idx) => {
                      const ing = ingredients.find((i) => i.id === r.ingredientId);
                      const cost = (ing?.costPerUnit || 0) * r.quantityRequired;

                      return (
                        <div
                          key={idx}
                          className="flex items-center justify-between py-1.5 px-2.5 rounded-xl bg-black/40 text-slate-300 border border-white/5"
                        >
                          <span className="font-sans font-medium text-slate-200">
                            {ing?.name || r.ingredientId}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-orange-400">
                              {r.quantityRequired}{' '}
                              {ing?.unit === 'GRAM' ? 'gr' : ing?.unit === 'ML' ? 'ml' : 'pcs'}
                            </span>
                            <span className="text-[10px] text-white/40">
                              (Rp {Math.round(cost)})
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-white/50 font-sans">
                <span className="font-mono text-[10px] uppercase">
                  {prod.category}
                </span>
                <span className="text-[#00E565] font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Auto-Deduct Ready
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
