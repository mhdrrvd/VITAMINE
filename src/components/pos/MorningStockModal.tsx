'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { usePos } from '@/context/PosContext';
import {
  X,
  PackagePlus,
  Check,
  ArrowLeft,
} from 'lucide-react';

export function MorningStockModal() {
  const {
    isMorningStockModalOpen,
    setIsMorningStockModalOpen,
    ingredients,
    receiveMorningStock,
  } = usePos();

  const [inputs, setInputs] = useState<Record<string, number>>({});

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMorningStockModalOpen) {
        setIsMorningStockModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMorningStockModalOpen, setIsMorningStockModalOpen]);

  if (!isMorningStockModalOpen) return null;

  const handleInputChange = (id: string, value: number) => {
    setInputs((prev) => ({
      ...prev,
      [id]: Math.max(0, value),
    }));
  };

  const handleQuickAdd = (id: string, amount: number) => {
    setInputs((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + amount,
    }));
  };

  const handleSave = () => {
    const validEntries = Object.entries(inputs).filter(([, qty]) => qty > 0);
    if (validEntries.length === 0) {
      alert('Silakan masukkan jumlah bahan baku yang ingin di-order / diambil.');
      return;
    }

    const payload = validEntries.map(([ingredientId, quantity]) => ({
      ingredientId,
      quantity,
    }));

    receiveMorningStock(payload);
    alert(`Berhasil menambahkan stok masuk untuk ${payload.length} bahan baku.`);
    setInputs({});
    setIsMorningStockModalOpen(false);
  };

  const totalItemsOrdered = Object.values(inputs).filter((q) => q > 0).length;

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
              onClick={() => setIsMorningStockModalOpen(false)}
              className="w-9 h-9 rounded-xl bg-slate-800/80 hover:bg-[#00E565] text-slate-300 hover:text-slate-950 flex items-center justify-center transition-all cursor-pointer mr-1"
              title="Kembali ke POS (Esc)"
            >
              <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
            </button>
            <div className="w-10 h-10 rounded-2xl bg-[#00E565]/15 border border-[#00E565]/30 text-[#00E565] flex items-center justify-center font-bold shadow-xs">
              <PackagePlus className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h2 className="font-extrabold text-lg text-white font-display tracking-tight flex items-center gap-2">
                <span>Order Bahan Baku Gudang (Pagi)</span>
              </h2>
              <p className="text-xs text-[#00E565]/80 font-medium">
                Pencatatan pengambilan bahan baku segar dari gudang outlet setiap pagi
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsMorningStockModalOpen(false)}
            className="w-9 h-9 rounded-xl bg-slate-800/80 hover:bg-rose-500 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            title="Tutup (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 2. Body List of Ingredients */}
        <div className="p-6 overflow-y-auto flex-1 space-y-3 bg-[#0B1A16]/50">
          <div className="text-[11px] font-bold text-[#00E565] uppercase tracking-wider mb-2">
            Pilih & Masukkan Jumlah Bahan yang Diambil:
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {ingredients.map((ing) => {
              const currentQty = inputs[ing.id] || 0;
              const isGram = ing.unit === 'GRAM';
              const isPcs = ing.unit === 'PCS';

              return (
                <div
                  key={ing.id}
                  className="p-3.5 rounded-2xl border border-slate-800 bg-[#132824] hover:border-[#00E565]/50 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all"
                >
                  <div>
                    <h4 className="font-bold text-sm text-white">{ing.name}</h4>
                    <span className="text-[11px] text-[#00E565]/70 font-mono mt-0.5 block">
                      Stok outlet saat ini: {ing.currentStock.toLocaleString('id-ID')} {ing.unit.toLowerCase()}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Quick add shortcuts */}
                    <div className="flex items-center gap-1">
                      {isGram ? (
                        <>
                          <button
                            type="button"
                            onClick={() => handleQuickAdd(ing.id, 500)}
                            className="px-2 py-1 rounded-lg bg-[#00E565]/15 hover:bg-[#00E565] text-[10px] font-bold text-[#00E565] hover:text-slate-950 transition-colors cursor-pointer border border-[#00E565]/30"
                          >
                            +500g
                          </button>
                          <button
                            type="button"
                            onClick={() => handleQuickAdd(ing.id, 1000)}
                            className="px-2 py-1 rounded-lg bg-[#00E565]/15 hover:bg-[#00E565] text-[10px] font-bold text-[#00E565] hover:text-slate-950 transition-colors cursor-pointer border border-[#00E565]/30"
                          >
                            +1kg
                          </button>
                        </>
                      ) : isPcs ? (
                        <>
                          <button
                            type="button"
                            onClick={() => handleQuickAdd(ing.id, 25)}
                            className="px-2 py-1 rounded-lg bg-[#00E565]/15 hover:bg-[#00E565] text-[10px] font-bold text-[#00E565] hover:text-slate-950 transition-colors cursor-pointer border border-[#00E565]/30"
                          >
                            +25
                          </button>
                          <button
                            type="button"
                            onClick={() => handleQuickAdd(ing.id, 50)}
                            className="px-2 py-1 rounded-lg bg-[#00E565]/15 hover:bg-[#00E565] text-[10px] font-bold text-[#00E565] hover:text-slate-950 transition-colors cursor-pointer border border-[#00E565]/30"
                          >
                            +50
                          </button>
                        </>
                      ) : null}
                    </div>

                    {/* Input value */}
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        placeholder="0"
                        min={0}
                        value={currentQty || ''}
                        onChange={(e) => handleInputChange(ing.id, Number(e.target.value))}
                        className="w-24 px-3 py-1.5 bg-[#0F1E1B] border border-slate-700 focus:border-[#00E565] rounded-xl text-xs font-black text-white text-right focus:outline-none transition-all font-mono"
                      />
                      <span className="text-xs font-semibold text-[#00E565]/70 w-8 font-mono">
                        {isGram ? 'gr' : isPcs ? 'pcs' : 'ml'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. View Footer */}
        <div className="px-6 py-4 bg-[#132824] border-t border-slate-800 flex items-center justify-between">
          <div className="text-xs text-[#00E565]/80">
            {totalItemsOrdered > 0 ? (
              <span className="font-bold text-[#00E565]">
                {totalItemsOrdered} jenis bahan akan ditambahkan ke stok outlet
              </span>
            ) : (
              <span>Masukkan kuantitas bahan yang diambil dari gudang</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsMorningStockModalOpen(false)}
              className="px-4 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-xs font-bold text-slate-300 transition-colors cursor-pointer"
            >
              Batal
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="btn-kilat px-5 py-2.5 rounded-xl bg-[#00E565] hover:bg-[#2ef586] text-slate-950 text-xs font-black flex items-center gap-1.5 shadow-lg shadow-[#00E565]/25 transition-all active:scale-98 cursor-pointer"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Simpan Order Bahan</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}