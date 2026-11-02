'use client';

import React from 'react';
import { usePos } from '@/context/PosContext';
import { X, Layers, AlertCircle, ArrowDownToLine, RotateCcw } from 'lucide-react';

export function StockCheckerModal() {
  const {
    isStockModalOpen,
    setIsStockModalOpen,
    ingredients,
    setIsMorningStockModalOpen,
    setIsReturnStockModalOpen,
  } = usePos();

  if (!isStockModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#051F20]/60 backdrop-blur-xs animate-in fade-in duration-150 select-none">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-modal border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-[#F4F7F5]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#DAF1DE] text-[#235347] flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-[#051F20] text-base font-display">
                Status Stok Bahan Baku Real-Time (F4)
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Pembaruan otomatis saat transaksi selesai
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsStockModalOpen(false)}
            className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-600 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Table */}
        <div className="p-6 overflow-y-auto flex-1">
          <div className="border border-slate-200 rounded-2xl overflow-hidden">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-[#F4F7F5] border-b border-slate-200 text-slate-600 text-[11px] font-extrabold uppercase tracking-wider">
                  <th className="py-3 px-4">Nama Bahan Mentah</th>
                  <th className="py-3 px-4">Sisa Stok</th>
                  <th className="py-3 px-4">Batas Min.</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {ingredients.map((ing) => {
                  const isLow = ing.currentStock <= ing.minStockAlert;
                  const isDepleted = ing.currentStock <= 0;

                  return (
                    <tr key={ing.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4">
                        <span className="font-bold text-[#051F20]">{ing.name}</span>
                        <span className="text-[10px] text-slate-400 block font-mono">
                          Unit: {ing.unit}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono font-extrabold text-[#051F20]">
                        {ing.unit === 'GRAM'
                          ? `${(ing.currentStock / 1000).toFixed(2)} kg (${ing.currentStock} gr)`
                          : ing.unit === 'ML'
                          ? `${(ing.currentStock / 1000).toFixed(2)} L (${ing.currentStock} ml)`
                          : `${ing.currentStock} pcs`}
                      </td>
                      <td className="py-3 px-4 font-mono text-xs text-slate-500">
                        {ing.unit === 'GRAM'
                          ? `${(ing.minStockAlert / 1000).toFixed(1)} kg`
                          : ing.unit === 'ML'
                          ? `${(ing.minStockAlert / 1000).toFixed(1)} L`
                          : `${ing.minStockAlert} pcs`}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {isDepleted ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 text-xs font-bold">
                            Kosong
                          </span>
                        ) : isLow ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-700 text-xs font-bold">
                            <AlertCircle className="w-3 h-3" />
                            Menipis
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#DAF1DE] text-[#235347] text-xs font-bold">
                            Aman
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-[#F4F7F5] border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setIsStockModalOpen(false);
                setIsMorningStockModalOpen(true);
              }}
              className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-xs font-bold text-slate-700 flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <ArrowDownToLine className="w-3.5 h-3.5 text-[#235347]" />
              <span>Input Stok Pagi</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setIsStockModalOpen(false);
                setIsReturnStockModalOpen(true);
              }}
              className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-xs font-bold text-slate-700 flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <RotateCcw className="w-3.5 h-3.5 text-rose-600" />
              <span>Retur Stok</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsStockModalOpen(false)}
            className="px-4 py-2 rounded-xl bg-[#051F20] hover:bg-[#163832] text-white text-xs font-bold transition-colors"
          >
            Tutup (Esc)
          </button>
        </div>
      </div>
    </div>
  );
}
