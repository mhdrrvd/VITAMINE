'use client';

import React, { useState } from 'react';
import { usePos } from '@/context/PosContext';
import { CashDenominationCount } from '@/types';
import {
  X,
  Calculator,
  CheckCircle2,
  AlertTriangle,
  Printer,
  Coins,
} from 'lucide-react';

const DENOMINATIONS = [
  { nominal: 100000, label: 'Rp 100.000 (Seratus Ribu)' },
  { nominal: 50000, label: 'Rp 50.000 (Lima Puluh Ribu)' },
  { nominal: 20000, label: 'Rp 20.000 (Dua Puluh Ribu)' },
  { nominal: 10000, label: 'Rp 10.000 (Sepuluh Ribu)' },
  { nominal: 5000, label: 'Rp 5.000 (Lima Ribu)' },
  { nominal: 2000, label: 'Rp 2.000 (Dua Ribu)' },
  { nominal: 1000, label: 'Rp 1.000 / Koin' },
];

export function CashOpnameModal() {
  const {
    isCashOpnameModalOpen,
    setIsCashOpnameModalOpen,
    currentShift,
    closeShift,
  } = usePos();

  const [counts, setCounts] = useState<Record<number, number>>({
    100000: 0,
    50000: 0,
    20000: 0,
    10000: 0,
    5000: 0,
    2000: 0,
    1000: 0,
  });

  const [note, setNote] = useState('');

  if (!isCashOpnameModalOpen || !currentShift) return null;

  const handleCountChange = (nominal: number, count: number) => {
    setCounts((prev) => ({
      ...prev,
      [nominal]: Math.max(0, count),
    }));
  };

  // Calculations
  const totalPhysicalCash = DENOMINATIONS.reduce((sum, denom) => {
    return sum + denom.nominal * (counts[denom.nominal] || 0);
  }, 0);

  const expectedCash = currentShift.systemCashTotal;
  const discrepancy = totalPhysicalCash - expectedCash;

  const handleFinalize = () => {
    if (discrepancy !== 0 && (!note || note.trim().length < 5)) {
      alert('Terdapat selisih kas! Wajib mengisi keterangan alasan selisih (minimal 5 karakter).');
      return;
    }

    const denomList: CashDenominationCount[] = DENOMINATIONS.map((d) => ({
      nominal: d.nominal,
      label: d.label,
      count: counts[d.nominal] || 0,
      subtotal: d.nominal * (counts[d.nominal] || 0),
    }));

    closeShift(totalPhysicalCash, discrepancy, note, denomList);
    alert('Shift berhasil ditutup dan kas opname tersimpan!');
    setIsCashOpnameModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-modal border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-slate-900 text-base">
                Serah Terima Shift & Cash Opname
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Sesi #{currentShift.id.slice(-4)} &bull; Kasir: {currentShift.userName}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsCashOpnameModalOpen(false)}
            className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-600 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body Split */}
        <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left: Denomination Counter Table */}
          <div className="md:col-span-7 space-y-3">
            <h3 className="font-extrabold text-xs text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
              <Coins className="w-4 h-4 text-amber-500" />
              Perhitungan Fisik Uang Kas Laci
            </h3>

            <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100">
              {DENOMINATIONS.map((denom) => {
                const count = counts[denom.nominal] || 0;
                const subtotal = count * denom.nominal;

                return (
                  <div
                    key={denom.nominal}
                    className="p-2.5 px-3 flex items-center justify-between gap-2 hover:bg-slate-50 transition-colors"
                  >
                    <span className="text-xs font-bold text-slate-800 flex-1">
                      {denom.label}
                    </span>

                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        placeholder="0"
                        value={count || ''}
                        onChange={(e) => handleCountChange(denom.nominal, Number(e.target.value))}
                        className="w-16 px-2 py-1 bg-white border border-slate-300 focus:border-orange-500 rounded-lg text-xs font-bold text-center text-slate-900 focus:outline-none"
                      />
                      <span className="text-xs font-mono font-semibold text-slate-500 w-24 text-right">
                        Rp {subtotal.toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Summary & Discrepancy */}
          <div className="md:col-span-5 flex flex-col justify-between space-y-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div className="space-y-3">
              <h3 className="font-extrabold text-xs text-slate-600 uppercase tracking-wider">
                Rekonsiliasi Kas Laci
              </h3>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Modal Kas Awal:</span>
                  <span className="font-mono font-semibold text-slate-900">
                    Rp {currentShift.startingCash.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Total Kas Sistem:</span>
                  <span className="font-mono font-semibold text-slate-900">
                    Rp {expectedCash.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600 pt-2 border-t border-slate-200">
                  <span>Fisik Dihitung:</span>
                  <span className="font-mono font-extrabold text-sm text-slate-900">
                    Rp {totalPhysicalCash.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              {/* Discrepancy Box */}
              <div
                className={`p-3 rounded-xl border flex flex-col gap-1 ${
                  discrepancy === 0
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : discrepancy < 0
                    ? 'bg-rose-50 border-rose-200 text-rose-800'
                    : 'bg-blue-50 border-blue-200 text-blue-800'
                }`}
              >
                <div className="flex items-center justify-between font-bold text-xs">
                  <span>Status Selisih:</span>
                  {discrepancy === 0 ? (
                    <span className="inline-flex items-center gap-1 text-emerald-700 font-extrabold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      PAS (BALANCE)
                    </span>
                  ) : discrepancy < 0 ? (
                    <span className="inline-flex items-center gap-1 text-rose-700 font-extrabold">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      MINUS (KURANG)
                    </span>
                  ) : (
                    <span className="text-blue-700 font-extrabold">SURPLUS (LEBIH)</span>
                  )}
                </div>

                <span className="font-mono font-extrabold text-lg">
                  {discrepancy < 0 ? `- Rp ${Math.abs(discrepancy).toLocaleString('id-ID')}` : `Rp ${discrepancy.toLocaleString('id-ID')}`}
                </span>
              </div>

              {/* Note / Reason Field */}
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  Catatan Serah Terima {discrepancy !== 0 && <span className="text-rose-500">*wajib</span>}:
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Contoh: Uang fisik sesuai dengan penjualan kasir shift pagi."
                  rows={2}
                  className="w-full p-2 bg-white border border-slate-300 focus:border-orange-500 rounded-xl text-xs text-slate-800 focus:outline-none resize-none"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleFinalize}
              className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>FINALISASI & TUTUP SHIFT</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

