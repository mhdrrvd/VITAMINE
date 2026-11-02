'use client';

import React from 'react';
import { INITIAL_PRODUCTS, INITIAL_INGREDIENTS } from '@/lib/mock-data';
import { Layers, ShieldCheck, Info } from 'lucide-react';

export function BomViewerSection() {
  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white font-display flex items-center gap-2">
            <Layers className="w-5 h-5 text-orange-400" />
            <span>Master Resep & Formula Bill of Materials (BOM)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Konfigurasi pemotongan otomatis bahan mentah di inventaris setiap kali 1 cup jus terjual di kasir.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-semibold">
          <Info className="w-4 h-4 shrink-0" />
          <span>Gula cair dipotong flat overhead 30ml per cup</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {INITIAL_PRODUCTS.map((prod) => (
          <div
            key={prod.id}
            className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <h3 className="font-extrabold text-white text-base font-display">
                  {prod.name}
                </h3>
                <span className="px-2 py-0.5 rounded-md bg-orange-500/20 text-orange-400 font-mono text-xs font-extrabold">
                  Rp {prod.basePrice.toLocaleString('id-ID')}
                </span>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Komposisi Resep Per Cup:
                </span>

                <div className="space-y-1.5 text-xs font-mono">
                  {prod.recipe.map((r, idx) => {
                    const ing = INITIAL_INGREDIENTS.find((i) => i.id === r.ingredientId);
                    return (
                      <div
                        key={idx}
                        className="flex items-center justify-between py-1 px-2 rounded-lg bg-slate-950/60 text-slate-300"
                      >
                        <span className="font-sans font-medium text-slate-300">
                          {ing?.name || r.ingredientId}
                        </span>
                        <span className="font-bold text-orange-400">
                          {r.quantityRequired}{' '}
                          {ing?.unit === 'GRAM' ? 'gr' : ing?.unit === 'ML' ? 'ml' : 'pcs'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 font-sans">
              <span>Kategori: {prod.category === 'SINGLE_FRUIT' ? 'Buah Tunggal' : 'Multi-Vitamin'}</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Auto-Deduct
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

