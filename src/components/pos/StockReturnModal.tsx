'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { usePos } from '@/context/PosContext';
import {
  X,
  RotateCcw,
  Check,
  Archive,
  Trash2,
  ArrowLeft,
} from 'lucide-react';

export function StockReturnModal() {
  const {
    isReturnStockModalOpen,
    setIsReturnStockModalOpen,
    ingredients,
    returnStock,
  } = usePos();

  const [returns, setReturns] = useState<
    Record<
      string,
      {
        quantity: number;
        isWaste: boolean;
        reason: string;
      }
    >
  >({});

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isReturnStockModalOpen) {
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
        ...(prev[id] || {
          isWaste: false,
          reason: 'Sisa Tidak Laku (Kembali ke Gudang)',
        }),
        quantity: Math.max(0, qty),
      },
    }));
  };

  const handleTypeChange = (id: string, isWaste: boolean) => {
    setReturns((prev) => ({
      ...prev,
      [id]: {
        ...(prev[id] || { quantity: 0 }),
        isWaste,
        reason: isWaste
          ? 'Bahan Rusak / Basi (Waste)'
          : 'Sisa Tidak Laku (Kembali ke Gudang)',
      },
    }));
  };

  const handleSave = () => {
    const validEntries = Object.entries(returns).filter(
      ([, data]) => data.quantity > 0
    );

    if (validEntries.length === 0) {
      alert('Silakan masukkan jumlah bahan baku yang ingin diretur atau dicatat waste.');
      return;
    }

    const payload = validEntries.map(([ingredientId, data]) => ({
      ingredientId,
      quantity: data.quantity,
      isWaste: data.isWaste,
      reason: data.reason,
    }));

    returnStock(payload);
    alert(
      `Berhasil memproses return/waste untuk ${payload.length} bahan baku.`
    );
    setIsReturnStockModalOpen(false);
    setReturns({});
  };

  const totalItemsReturned = Object.values(returns).filter((r) => r.quantity > 0).length;

  return (
    <div className="fixed inset-0 z-40 bg-[#081210] flex flex-col pl-16 sm:pl-20 pr-3 sm:pr-6 py-3 sm:py-5 overflow-hidden select-none animate-in fade-in duration-150">
      <motion.div
        initial={{ opacity: 0, scale: 0.99 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.99 }}
        transition={{ duration: 0.15 }}
        className="w-full h-full bg-[#0F1E1B] text-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-800/90 overflow-hidden flex flex-col"
      >
        {/* 1. View Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-[#132824]">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsReturnStockModalOpen(false)}
              className="w-9 h-9 rounded-xl bg-slate-800/80 hover:bg-[#00E565] text-slate-300 hover:text-slate-950 flex items-center justify-center transition-all cursor-pointer mr-1"
              title="Kembali ke POS (Esc)"
            >
              <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
            </button>
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center font-bold shadow-xs">
              <RotateCcw className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h2 className="font-extrabold text-lg text-white font-display tracking-tight flex items-center gap-2">
                <span>Return Bahan Baku (Waste / Sisa Tidak Laku)</span>
              </h2>
              <p className="text-xs text-[#00E565]/80 font-medium">
                Kembalikan bahan sisa tidak laku ke inventory gudang atau catat bahan terbuang (waste/busuk)
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsReturnStockModalOpen(false)}
            className="w-9 h-9 rounded-xl bg-slate-800/80 hover:bg-rose-500 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            title="Tutup (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 2. Body List of Ingredients */}
        <div className="p-6 overflow-y-auto flex-1 space-y-3.5 bg-[#0B1A16]/50">
          <div className="text-[11px] font-bold text-[#00E565] uppercase tracking-wider mb-1">
            Pilih Bahan & Kategori Pengembalian:
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
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
                  className="p-4 rounded-2xl border border-slate-800 bg-[#132824] hover:border-slate-700 shadow-2xs space-y-3 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-sm text-white">{ing.name}</h4>
                      <span className="text-[11px] text-[#00E565]/70 font-mono mt-0.5 block">
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
                        className="w-24 px-3 py-1.5 bg-[#0F1E1B] border border-slate-700 focus:border-[#00E565] rounded-xl text-xs font-black text-white text-right focus:outline-none transition-all font-mono"
                      />
                      <span className="text-xs font-semibold text-[#00E565]/70 w-8 font-mono">
                        {isGram ? 'gr' : ing.unit === 'PCS' ? 'pcs' : 'ml'}
                      </span>
                    </div>
                  </div>

                  {/* Return Classification Toggle */}
                  <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleTypeChange(ing.id, false)}
                        className={`px-3 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                          !data.isWaste
                            ? 'bg-[#00E565] text-slate-950 shadow-md font-black'
                            : 'bg-[#0F1E1B] text-slate-400 hover:text-white border border-slate-800'
                        }`}
                      >
                        <Archive className="w-3.5 h-3.5" />
                        <span>Sisa Tidak Laku (Ke Gudang)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleTypeChange(ing.id, true)}
                        className={`px-3 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                          data.isWaste
                            ? 'bg-rose-600 text-white shadow-md font-black'
                            : 'bg-[#0F1E1B] text-slate-400 hover:text-white border border-slate-800'
                        }`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Waste / Rusak</span>
                      </button>
                    </div>

                    <span className="text-[10px] text-slate-500 font-medium">
                      {data.isWaste
                        ? 'Dihapus dari stok & dicatat sebagai kerugian waste'
                        : 'Bahan masuk kembali ke inventaris gudang'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. View Footer */}
        <div className="px-6 py-4 bg-[#132824] border-t border-slate-800 flex items-center justify-between">
          <div className="text-xs text-[#00E565]/80">
            {totalItemsReturned > 0 ? (
              <span className="font-bold text-amber-400">
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
              className="px-4 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-xs font-bold text-slate-300 transition-colors cursor-pointer"
            >
              Batal
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="btn-kilat px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black flex items-center gap-1.5 shadow-lg shadow-amber-500/25 transition-all active:scale-98 cursor-pointer"
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