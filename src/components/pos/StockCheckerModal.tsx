'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { usePos } from '@/context/PosContext';
import { X, Layers, AlertCircle, ArrowDownToLine, RotateCcw, ArrowLeft } from 'lucide-react';

export function StockCheckerModal() {
  const {
    isStockModalOpen,
    setIsStockModalOpen,
    ingredients,
    setIsMorningStockModalOpen,
    setIsReturnStockModalOpen,
  } = usePos();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isStockModalOpen) {
        setIsStockModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isStockModalOpen, setIsStockModalOpen]);

  if (!isStockModalOpen) return null;

  return (
    <div className="fixed inset-0 z-40 bg-[#081210] flex flex-col pl-16 sm:pl-20 pr-3 sm:pr-6 py-3 sm:py-5 overflow-hidden select-none animate-in fade-in duration-150">
      <motion.div
        initial={{ opacity: 0, scale: 0.99 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.99 }}
        transition={{ duration: 0.15 }}
        className="w-full h-full bg-[#0F1E1B] text-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-800/90 overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-[#132824]">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsStockModalOpen(false)}
              className="w-9 h-9 rounded-xl bg-slate-800/80 hover:bg-[#00E565] text-slate-300 hover:text-slate-950 flex items-center justify-center transition-all cursor-pointer mr-1"
              title="Kembali ke POS (Esc)"
            >
              <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
            </button>
            <div className="w-10 h-10 rounded-2xl bg-[#00E565]/15 border border-[#00E565]/30 text-[#00E565] flex items-center justify-center font-bold shadow-xs">
              <Layers className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h2 className="font-extrabold text-white text-lg font-display flex items-center gap-2">
                <span>Status Stok Bahan Baku Real-Time</span>
                <span className="text-xs px-2 py-0.5 rounded-md bg-[#00E565]/20 text-[#00E565] border border-[#00E565]/40 font-mono font-bold">
                  F4
                </span>
              </h2>
              <p className="text-xs text-[#00E565]/80 font-medium">
                Pembaruan otomatis saat transaksi kasir selesai
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsStockModalOpen(false)}
            className="w-9 h-9 rounded-xl bg-slate-800/80 hover:bg-rose-500 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            title="Tutup (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Table */}
        <div className="p-6 overflow-y-auto flex-1 bg-[#0B1A16]/50">
          <div className="border border-slate-800 rounded-2xl overflow-hidden shadow-2xs">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-[#132824] border-b border-slate-800 text-[#00E565] text-xs font-black uppercase tracking-wider">
                  <th className="py-3.5 px-5">Nama Bahan Mentah</th>
                  <th className="py-3.5 px-5">Sisa Stok Outlet</th>
                  <th className="py-3.5 px-5">Batas Min. Peringatan</th>
                  <th className="py-3.5 px-5 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {ingredients.map((ing) => {
                  const isLow = ing.currentStock <= ing.minStockAlert;
                  const isDepleted = ing.currentStock <= 0;

                  return (
                    <tr key={ing.id} className="hover:bg-[#16302b] transition-colors">
                      <td className="py-3.5 px-5">
                        <span className="font-bold text-white text-sm">{ing.name}</span>
                        <span className="text-[11px] text-[#00E565]/70 block font-mono">
                          Unit: {ing.unit}
                        </span>
                      </td>
                      <td className="py-3.5 px-5 font-mono font-black text-white text-base">
                        {ing.unit === 'GRAM'
                          ? `${(ing.currentStock / 1000).toFixed(2)} kg (${ing.currentStock} gr)`
                          : ing.unit === 'ML'
                          ? `${(ing.currentStock / 1000).toFixed(2)} L (${ing.currentStock} ml)`
                          : `${ing.currentStock} pcs`}
                      </td>
                      <td className="py-3.5 px-5 font-mono text-xs text-slate-400">
                        {ing.unit === 'GRAM'
                          ? `${(ing.minStockAlert / 1000).toFixed(1)} kg`
                          : ing.unit === 'ML'
                          ? `${(ing.minStockAlert / 1000).toFixed(1)} L`
                          : `${ing.minStockAlert} pcs`}
                      </td>
                      <td className="py-3.5 px-5 text-center">
                        {isDepleted ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/40 text-xs font-black">
                            Kosong
                          </span>
                        ) : isLow ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 text-xs font-black">
                            <AlertCircle className="w-3.5 h-3.5" />
                            Menipis
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#00E565]/20 text-[#00E565] border border-[#00E565]/40 text-xs font-black">
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
        <div className="px-6 py-4 bg-[#132824] border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setIsStockModalOpen(false);
                setIsMorningStockModalOpen(true);
              }}
              className="px-3.5 py-2.5 rounded-xl bg-[#0F1E1B] border border-slate-700 hover:border-[#00E565] text-xs font-bold text-white flex items-center gap-2 transition-all cursor-pointer hover:bg-[#00E565]/10"
            >
              <ArrowDownToLine className="w-4 h-4 text-[#00E565]" />
              <span>Input Order Gudang</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setIsStockModalOpen(false);
                setIsReturnStockModalOpen(true);
              }}
              className="px-3.5 py-2.5 rounded-xl bg-[#0F1E1B] border border-slate-700 hover:border-rose-500 text-xs font-bold text-white flex items-center gap-2 transition-all cursor-pointer hover:bg-rose-500/10"
            >
              <RotateCcw className="w-4 h-4 text-rose-400" />
              <span>Retur / Waste Bahan</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsStockModalOpen(false)}
            className="btn-kilat px-5 py-2.5 rounded-xl bg-[#00E565] hover:bg-[#2ef586] text-slate-950 text-xs font-black transition-all cursor-pointer shadow-lg shadow-[#00E565]/25"
          >
            Tutup (Esc)
          </button>
        </div>
      </motion.div>
    </div>
  );
}