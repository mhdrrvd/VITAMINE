'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePos } from '@/context/PosContext';
import {
  X,
  PackagePlus,
  Check,
  Plus,
  Boxes,
  Sparkles,
} from 'lucide-react';

export function MorningStockModal() {
  const {
    isMorningStockModalOpen,
    setIsMorningStockModalOpen,
    ingredients,
    addMorningStock,
  } = usePos();

  const [inputs, setInputs] = useState<Record<string, number>>({});

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isMorningStockModalOpen) return;
      if (e.key === 'Escape') {
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

  const handleQuickAdd = (id: string, addQty: number) => {
    setInputs((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + addQty,
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
      alert('Silakan masukkan jumlah bahan baku yang diambil dari gudang!');
      return;
    }

    addMorningStock(list);
    alert('Bahan baku pagi berhasil dicatat dan ditambahkan ke stok kasir!');
    setIsMorningStockModalOpen(false);
    setInputs({});
  };

  const totalItemsOrdered = Object.values(inputs).filter((q) => q > 0).length;

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
            <div className="w-10 h-10 rounded-2xl bg-[#EAF5EF] text-[#1A6B51] flex items-center justify-center font-bold shadow-xs">
              <PackagePlus className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h2 className="font-extrabold text-lg text-slate-900 font-display tracking-tight flex items-center gap-2">
                <span>Order Bahan Baku Gudang (Pagi)</span>
              </h2>
              <p className="text-xs text-slate-400 font-medium">
                Pencatatan pengambilan bahan baku segar dari gudang outlet setiap pagi
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsMorningStockModalOpen(false)}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors"
            title="Tutup (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 2. Body List of Ingredients */}
        <div className="p-6 overflow-y-auto flex-1 space-y-3 bg-[#F8FAF9]/50">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
            Pilih & Masukkan Jumlah Bahan yang Diambil:
          </div>

          {ingredients.map((ing) => {
            const currentQty = inputs[ing.id] || 0;
            const isGram = ing.unit === 'GRAM';
            const isPcs = ing.unit === 'PCS';

            return (
              <div
                key={ing.id}
                className="p-3.5 rounded-2xl border border-slate-200/80 bg-white hover:border-[#1A6B51]/40 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all"
              >
                <div>
                  <h4 className="font-bold text-sm text-slate-900">{ing.name}</h4>
                  <span className="text-[11px] text-slate-400 font-mono mt-0.5 block">
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
                          className="px-2 py-1 rounded-lg bg-[#EAF5EF] hover:bg-[#d4ebdc] text-[10px] font-bold text-[#1A6B51] transition-colors"
                        >
                          +500g
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuickAdd(ing.id, 1000)}
                          className="px-2 py-1 rounded-lg bg-[#EAF5EF] hover:bg-[#d4ebdc] text-[10px] font-bold text-[#1A6B51] transition-colors"
                        >
                          +1kg
                        </button>
                      </>
                    ) : isPcs ? (
                      <>
                        <button
                          type="button"
                          onClick={() => handleQuickAdd(ing.id, 25)}
                          className="px-2 py-1 rounded-lg bg-[#EAF5EF] hover:bg-[#d4ebdc] text-[10px] font-bold text-[#1A6B51] transition-colors"
                        >
                          +25
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuickAdd(ing.id, 50)}
                          className="px-2 py-1 rounded-lg bg-[#EAF5EF] hover:bg-[#d4ebdc] text-[10px] font-bold text-[#1A6B51] transition-colors"
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
                      className="w-24 px-3 py-1.5 bg-slate-50 border border-slate-200 focus:border-[#1A6B51] focus:bg-white rounded-xl text-xs font-black text-slate-900 text-right focus:outline-none transition-all"
                    />
                    <span className="text-xs font-semibold text-slate-400 w-8 font-mono">
                      {isGram ? 'gr' : isPcs ? 'pcs' : 'ml'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 3. Modal Footer */}
        <div className="px-6 py-4 bg-white border-t border-slate-100 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            {totalItemsOrdered > 0 ? (
              <span className="font-bold text-[#1A6B51]">
                {totalItemsOrdered} jenis bahan akan ditambahkan ke outlet
              </span>
            ) : (
              <span>Masukkan kuantitas bahan yang diambil dari gudang</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsMorningStockModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-600 transition-colors"
            >
              Batal
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2.5 rounded-xl bg-[#1A6B51] hover:bg-[#14533F] text-white text-xs font-extrabold flex items-center gap-1.5 shadow-md shadow-[#1A6B51]/20 transition-all active:scale-98"
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
