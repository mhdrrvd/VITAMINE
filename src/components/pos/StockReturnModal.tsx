'use client';

import React, { useState } from 'react';
import { usePos } from '@/context/PosContext';
import { X, RotateCcw, AlertOctagon, Check } from 'lucide-react';

export function StockReturnModal() {
  const {
    isReturnStockModalOpen,
    setIsReturnStockModalOpen,
    ingredients,
    returnStock,
  } = usePos();

  const [returns, setReturns] = useState<
    Record<string, { quantity: number; isWaste: boolean; reason: string }>
  >({});

  if (!isReturnStockModalOpen) return null;

  const handleQtyChange = (id: string, qty: number) => {
    setReturns((prev) => ({
      ...prev,
      [id]: {
        quantity: Math.max(0, qty),
        isWaste: prev[id]?.isWaste ?? true,
        reason: prev[id]?.reason || 'Buah Rusak / Terlalu Matang',
      },
    }));
  };

  const handleTypeChange = (id: string, isWaste: boolean) => {
    setReturns((prev) => ({
      ...prev,
      [id]: {
        quantity: prev[id]?.quantity || 0,
        isWaste,
        reason: isWaste ? 'Buah Rusak / Terlalu Matang' : 'Disimpan ke Chiller Utama',
      },
    }));
  };

  const handleSave = () => {
    const list = Object.entries(returns)
      .filter(([_, data]) => data.quantity > 0)
      .map(([ingredientId, data]) => ({
        ingredientId,
        quantity: data.quantity,
        isWaste: data.isWaste,
        reason: data.reason,
      }));

    if (list.length === 0) {
      alert('Silakan masukkan jumlah bahan baku yang diretur!');
      return;
    }

    returnStock(list);
    alert('Retur stok berhasil dicatat ke sistem audit!');
    setIsReturnStockModalOpen(false);
    setReturns({});
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-modal border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-slate-900 text-base">
                Retur Stok Bahan Baku Sisa
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Pilih klasifikasi bahan: Terbuang (Waste) vs Kembali ke Chiller
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsReturnStockModalOpen(false)}
            className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-600 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {ingredients.map((ing) => {
            const data = returns[ing.id] || {
              quantity: 0,
              isWaste: true,
              reason: 'Buah Rusak / Terlalu Matang',
            };

            return (
              <div
                key={ing.id}
                className="p-3.5 rounded-2xl border border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <span className="font-bold text-slate-900 text-sm">{ing.name}</span>
                  <span className="text-[11px] text-slate-400 block font-mono">
                    Stok saat ini: {ing.currentStock} {ing.unit.toLowerCase()}
                  </span>
                </div>

                <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
                  {/* Category toggle */}
                  <div className="flex rounded-lg p-0.5 bg-slate-100 border border-slate-200 text-[11px] font-bold">
                    <button
                      type="button"
                      onClick={() => handleTypeChange(ing.id, true)}
                      className={`px-2 py-1 rounded-md transition-all ${
                        data.isWaste
                          ? 'bg-rose-600 text-white shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Waste / Rusak
                    </button>
                    <button
                      type="button"
                      onClick={() => handleTypeChange(ing.id, false)}
                      className={`px-2 py-1 rounded-md transition-all ${
                        !data.isWaste
                          ? 'bg-blue-600 text-white shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Ke Chiller
                    </button>
                  </div>

                  {/* Quantity input */}
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      placeholder="0"
                      value={data.quantity || ''}
                      onChange={(e) => handleQtyChange(ing.id, Number(e.target.value))}
                      className="w-24 px-3 py-1 bg-slate-50 border border-slate-300 focus:border-rose-500 rounded-xl text-sm font-bold text-slate-900 text-right focus:outline-none"
                    />
                    <span className="text-xs font-semibold text-slate-500 w-8">
                      {ing.unit === 'GRAM' ? 'gr' : ing.unit === 'ML' ? 'ml' : 'pcs'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setIsReturnStockModalOpen(false)}
            className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-xs font-bold text-slate-600 transition-colors"
          >
            Batal
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span>Simpan Retur Stok</span>
          </button>
        </div>
      </div>
    </div>
  );
}

