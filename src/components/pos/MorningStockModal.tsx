'use client';

import React, { useState } from 'react';
import { usePos } from '@/context/PosContext';
import { X, ArrowDownToLine, Check, Plus } from 'lucide-react';

export function MorningStockModal() {
  const {
    isMorningStockModalOpen,
    setIsMorningStockModalOpen,
    ingredients,
    addMorningStock,
  } = usePos();

  const [inputs, setInputs] = useState<Record<string, number>>({});

  if (!isMorningStockModalOpen) return null;

  const handleInputChange = (id: string, value: number) => {
    setInputs((prev) => ({
      ...prev,
      [id]: Math.max(0, value),
    }));
  };

  const handleSave = () => {
    const list = Object.entries(inputs)
      .filter(([_, qty]) => qty > 0)
      .map(([ingredientId, quantity]) => ({
        ingredientId,
        quantity,
      }));

    if (list.length === 0) {
      alert('Silakan masukkan jumlah bahan baku yang diterima!');
      return;
    }

    addMorningStock(list);
    alert('Stok pagi berhasil ditambahkan ke inventaris outlet!');
    setIsMorningStockModalOpen(false);
    setInputs({});
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-modal border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <ArrowDownToLine className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-slate-900 text-base">
                Penerimaan Stok Pagi (Morning In)
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Input bahan baku yang disiapkan untuk penjualan hari ini
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsMorningStockModalOpen(false)}
            className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-600 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Form */}
        <div className="p-6 overflow-y-auto flex-1 space-y-3">
          {ingredients.map((ing) => (
            <div
              key={ing.id}
              className="p-3 rounded-xl border border-slate-200 bg-white flex items-center justify-between gap-4"
            >
              <div>
                <span className="font-bold text-slate-900 text-sm">{ing.name}</span>
                <span className="text-[11px] text-slate-400 block font-mono">
                  Sisa saat ini: {ing.currentStock} {ing.unit.toLowerCase()}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="0"
                  value={inputs[ing.id] || ''}
                  onChange={(e) => handleInputChange(ing.id, Number(e.target.value))}
                  className="w-28 px-3 py-1.5 bg-slate-50 border border-slate-300 focus:border-emerald-500 rounded-xl text-sm font-bold text-slate-900 text-right focus:outline-none"
                />
                <span className="text-xs font-semibold text-slate-500 w-10">
                  {ing.unit === 'GRAM' ? 'gr' : ing.unit === 'ML' ? 'ml' : 'pcs'}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setIsMorningStockModalOpen(false)}
            className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-xs font-bold text-slate-600 transition-colors"
          >
            Batal
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span>Simpan Stok Pagi</span>
          </button>
        </div>
      </div>
    </div>
  );
}

