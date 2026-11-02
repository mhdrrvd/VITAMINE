'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { usePos } from '@/context/PosContext';
import {
  X,
  RotateCcw,
  AlertTriangle,
  Archive,
  Check,
  Trash2,
} from 'lucide-react';

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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isReturnStockModalOpen) return;
      if (e.key === 'Escape') {
        setIsReturnStockModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isReturnStockModalOpen, setIsReturnStockModalOpen]);

  if (!isReturnStockModalOpen) return null;

  const handleQtyChange = (id: string, qty: number) => {
    setReturns((prev) => ({
      ...prev,
      [id]: {
        quantity: Math.max(0, qty),
        isWaste: prev[id]?.isWaste ?? false,
        reason: prev[id]?.reason || 'Sisa Tidak Laku (Kembali ke Gudang)',
      },
    }));
  };

  const handleTypeChange = (id: string, isWaste: boolean) => {
    setReturns((prev) => ({
      ...prev,
      [id]: {
        quantity: prev[id]?.quantity || 0,
        isWaste,
        reason: isWaste ? 'Buah Rusak / Busuk (Waste)' : 'Sisa Tidak Laku (Kembali ke Gudang)',
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
      alert('Silakan masukkan jumlah bahan baku yang akan diretur/dikembalikan!');
      return;
    }

    returnStock(list);
    alert('Return bahan baku berhasil dicatat ke sistem inventaris!');
    setIsReturnStockModalOpen(false);
    setReturns({});
  };

  const totalItemsReturned = Object.values(returns).filter((r) => r.quantity > 0).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#051F20]/60 backdrop-blur-xs select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden flex flex-col max-h-[88vh]"
      >
        {/* 1. Modal Header */}
        <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold shadow-xs">
              <RotateCcw className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h2 className="font-extrabold text-lg text-slate-900 font-display tracking-tight flex items-center gap-2">
                <span>Return Bahan Baku (Waste / Sisa Tidak Laku)</span>
              </h2>
              <p className="text-xs text-slate-400 font-medium">
                Kembalikan bahan sisa tidak laku ke inventory gudang atau catat bahan terbuang (waste/busuk)
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsReturnStockModalOpen(false)}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors"
            title="Tutup (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 2. Body List of Ingredients */}
        <div className="p-6 overflow-y-auto flex-1 space-y-3.5 bg-[#F8FAF9]/50">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Pilih Bahan & Kategori Pengembalian:
          </div>

          {ingredients.map((ing) => {
            const data = returns[ing.id] || {
              quantity: 0,
              isWaste: false,
              reason: 'Sisa Tidak Laku (Kembali ke Gudang)',
            };
            const isGram = ing.unit === 'GRAM';

            return (
              <div
                key={ing.id}
                className="p-4 rounded-2xl border border-slate-200/80 bg-white hover:border-slate-300 shadow-2xs space-y-3 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{ing.name}</h4>
                    <span className="text-[11px] text-slate-400 font-mono mt-0.5 block">
                      Stok kasir saat ini: {ing.currentStock.toLocaleString('id-ID')} {ing.unit.toLowerCase()}
                    </span>
                  </div>

                  {/* Quantity input */}
                  <div className="flex items-center gap-1.5 self-end sm:self-auto">
                    <span className="text-xs text-slate-400 font-medium">Jumlah:</span>
                    <input
                      type="number"
                      placeholder="0"
                      min={0}
                      max={ing.currentStock}
                      value={data.quantity || ''}
                      onChange={(e) => handleQtyChange(ing.id, Number(e.target.value))}
                      className="w-24 px-3 py-1.5 bg-slate-50 border border-slate-200 focus:border-[#1A6B51] focus:bg-white rounded-xl text-xs font-black text-slate-900 text-right focus:outline-none transition-all"
                    />
                    <span className="text-xs font-semibold text-slate-400 w-8 font-mono">
                      {isGram ? 'gr' : ing.unit === 'PCS' ? 'pcs' : 'ml'}
                    </span>
                  </div>
                </div>

                {/* Return Classification Toggle: Sisa Tidak Laku (Kembali ke Gudang) vs Waste (Terbuang) */}
                <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleTypeChange(ing.id, false)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                        !data.isWaste
                          ? 'bg-[#1A6B51] text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <Archive className="w-3 h-3" />
                      <span>Sisa Tidak Laku (Ke Gudang)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleTypeChange(ing.id, true)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                        data.isWaste
                          ? 'bg-rose-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Waste / Rusak</span>
                    </button>
                  </div>

                  <span className="text-[10px] text-slate-400 font-medium">
                    {data.isWaste
                      ? 'Dihapus dari stok & dicatat sebagai kerugian waste'
                      : 'Bahan masuk kembali ke inventaris gudang'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* 3. Modal Footer */}
        <div className="px-6 py-4 bg-white border-t border-slate-100 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            {totalItemsReturned > 0 ? (
              <span className="font-bold text-amber-700">
                {totalItemsReturned} jenis bahan siap diretur/dikembalikan
              </span>
            ) : (
              <span>Pilih bahan yang ingin diretur atau dicatat waste</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsReturnStockModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-600 transition-colors"
            >
              Batal
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-md shadow-amber-600/20 transition-all active:scale-98"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Simpan Return Bahan</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
