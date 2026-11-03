'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { usePos } from '@/context/PosContext';
import {
  X,
  Calculator,
  Coins,
  CheckCircle2,
  AlertTriangle,
  Printer,
  ArrowLeft,
} from 'lucide-react';

const DENOMINATIONS = [
  { nominal: 100000, label: 'Rp 100.000' },
  { nominal: 50000, label: 'Rp 50.000' },
  { nominal: 20000, label: 'Rp 20.000' },
  { nominal: 10000, label: 'Rp 10.000' },
  { nominal: 5000, label: 'Rp 5.000' },
  { nominal: 2000, label: 'Rp 2.000' },
  { nominal: 1000, label: 'Rp 1.000' },
  { nominal: 500, label: 'Rp 500 (Koin)' },
];

export function CashOpnameModal() {
  const {
    isCashOpnameModalOpen,
    setIsCashOpnameModalOpen,
    currentShift,
    recentOrders,
  } = usePos();

  const [counts, setCounts] = useState<Record<number, number>>({});
  const [note, setNote] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isCashOpnameModalOpen) {
        setIsCashOpnameModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCashOpnameModalOpen, setIsCashOpnameModalOpen]);

  if (!isCashOpnameModalOpen || !currentShift) return null;

  // Calculate system expected cash: Starting Cash + Cash from cash sales
  const cashSalesTotal = recentOrders
    .filter((o) => o.paymentMethod === 'CASH')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const expectedCash = currentShift.startingCash + cashSalesTotal;

  // Calculate actual physical cash from denomination counts
  const totalPhysicalCash = Object.entries(counts).reduce(
    (sum, [nom, count]) => sum + Number(nom) * count,
    0
  );

  const discrepancy = totalPhysicalCash - expectedCash;

  const handleCountChange = (nominal: number, count: number) => {
    setCounts((prev) => ({
      ...prev,
      [nominal]: Math.max(0, count),
    }));
  };

  const handleFinalize = () => {
    if (totalPhysicalCash === 0) {
      alert('Silakan isi perhitungan uang fisik di laci kasir.');
      return;
    }

    if (discrepancy !== 0 && !note.trim()) {
      alert('Terdapat selisih kas! Harap isi catatan alasan selisih sebelum menutup shift.');
      return;
    }

    alert('Shift berhasil ditutup dan kas opname tersimpan!');
    setIsCashOpnameModalOpen(false);
  };

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
              onClick={() => setIsCashOpnameModalOpen(false)}
              className="w-9 h-9 rounded-xl bg-slate-800/80 hover:bg-[#00E565] text-slate-300 hover:text-slate-950 flex items-center justify-center transition-all cursor-pointer mr-1"
              title="Kembali ke POS (Esc)"
            >
              <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
            </button>
            <div className="w-10 h-10 rounded-2xl bg-[#00E565]/15 border border-[#00E565]/30 text-[#00E565] flex items-center justify-center font-bold shadow-xs">
              <Calculator className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h2 className="font-extrabold text-white text-lg font-display">
                Serah Terima Shift & Cash Opname
              </h2>
              <p className="text-xs text-[#00E565]/80 font-medium">
                Sesi #{currentShift.id.slice(-4)} &bull; Kasir: {currentShift.userName}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsCashOpnameModalOpen(false)}
            className="w-9 h-9 rounded-xl bg-slate-800/80 hover:bg-rose-500 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            title="Tutup (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body Split */}
        <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-12 gap-6 bg-[#0B1A16]/50">
          {/* Left: Denomination Counter Table */}
          <div className="md:col-span-7 space-y-3">
            <h3 className="font-extrabold text-xs text-[#00E565] uppercase tracking-wider flex items-center gap-1.5">
              <Coins className="w-4 h-4 text-[#00E565]" />
              Perhitungan Fisik Uang Kas Laci
            </h3>

            <div className="border border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-800 bg-[#132824]">
              {DENOMINATIONS.map((denom) => {
                const count = counts[denom.nominal] || 0;
                const subtotal = count * denom.nominal;

                return (
                  <div
                    key={denom.nominal}
                    className="p-3 px-4 flex items-center justify-between gap-3 hover:bg-[#16302b] transition-colors"
                  >
                    <span className="text-sm font-bold text-white flex-1 font-mono">
                      {denom.label}
                    </span>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          placeholder="0"
                          value={count || ''}
                          onChange={(e) => handleCountChange(denom.nominal, Number(e.target.value))}
                          className="w-20 px-2 py-1.5 bg-[#0F1E1B] border border-slate-700 focus:border-[#00E565] rounded-xl text-xs font-black text-center text-white focus:outline-none font-mono"
                        />
                        <span className="text-xs text-slate-400 font-medium">lbr/koin</span>
                      </div>
                      <span className="text-sm font-mono font-black text-[#00E565] w-28 text-right">
                        Rp {subtotal.toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Summary & Discrepancy */}
          <div className="md:col-span-5 flex flex-col justify-between space-y-4 bg-[#132824] p-5 rounded-2xl border border-slate-800">
            <div className="space-y-4">
              <h3 className="font-extrabold text-xs text-[#00E565] uppercase tracking-wider">
                Rekonsiliasi Kas Laci
              </h3>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Modal Kas Awal:</span>
                  <span className="font-mono font-bold text-white">
                    Rp {currentShift.startingCash.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Total Kas Penjualan (Sistem):</span>
                  <span className="font-mono font-bold text-white">
                    Rp {expectedCash.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="flex justify-between text-slate-400 pt-2 border-t border-slate-800">
                  <span className="text-sm font-bold text-white">Fisik Dihitung:</span>
                  <span className="font-mono font-black text-base text-[#00E565]">
                    Rp {totalPhysicalCash.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              {/* Discrepancy Box */}
              <div
                className={`p-3.5 rounded-xl border flex flex-col gap-1.5 ${
                  discrepancy === 0
                    ? 'bg-[#00E565]/15 border-[#00E565]/40 text-[#00E565]'
                    : discrepancy < 0
                    ? 'bg-rose-500/15 border-rose-500/40 text-rose-400'
                    : 'bg-blue-500/15 border-blue-500/40 text-blue-400'
                }`}
              >
                <div className="flex items-center justify-between font-bold text-xs">
                  <span>Status Selisih:</span>
                  {discrepancy === 0 ? (
                    <span className="inline-flex items-center gap-1 font-black">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      PAS (BALANCE)
                    </span>
                  ) : discrepancy < 0 ? (
                    <span className="inline-flex items-center gap-1 font-black">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      MINUS (KURANG)
                    </span>
                  ) : (
                    <span className="font-black">SURPLUS (LEBIH)</span>
                  )}
                </div>

                <span className="font-mono font-black text-xl">
                  {discrepancy < 0 ? `- Rp ${Math.abs(discrepancy).toLocaleString('id-ID')}` : `Rp ${discrepancy.toLocaleString('id-ID')}`}
                </span>
              </div>

              {/* Note / Reason Field */}
              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">
                  Catatan Serah Terima {discrepancy !== 0 && <span className="text-rose-400">*wajib</span>}:
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Contoh: Uang fisik sesuai dengan penjualan kasir shift pagi."
                  rows={2}
                  className="w-full p-2.5 bg-[#0F1E1B] border border-slate-700 focus:border-[#00E565] rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none resize-none"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleFinalize}
              className="btn-kilat w-full py-3.5 px-4 rounded-xl bg-[#00E565] hover:bg-[#2ef586] text-slate-950 text-xs font-black flex items-center justify-center gap-2 shadow-lg shadow-[#00E565]/25 transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>FINALISASI & TUTUP SHIFT</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}