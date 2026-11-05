'use client';

import React, { useState } from 'react';
import { usePos } from '@/context/PosContext';
import {
  Calculator,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Clock,
  UserCheck,
  Coins,
  FileText,
  DollarSign,
  TrendingDown,
  Info,
  X,
  Download,
} from 'lucide-react';
import { exportToCsv } from '@/lib/export-utils';

interface HistoricalShift {
  id: string;
  cashierName: string;
  startTime: string;
  endTime: string;
  startingCash: number;
  systemCashSales: number;
  expectedCashTotal: number;
  actualCashCounted: number;
  discrepancy: number;
  note: string;
  denominations: { label: string; count: number; subtotal: number }[];
}

const HISTORICAL_SHIFTS: HistoricalShift[] = [
  {
    id: 'shift-104',
    cashierName: 'Rian Pratama',
    startTime: 'Kemarin, 08:00 WIB',
    endTime: 'Kemarin, 16:02 WIB',
    startingCash: 200000,
    systemCashSales: 1450000,
    expectedCashTotal: 1650000,
    actualCashCounted: 1650000,
    discrepancy: 0,
    note: 'Kas fisik balance pas. Sisa buah segar telah dipindahkan ke chiller.',
    denominations: [
      { label: 'Rp 100.000', count: 12, subtotal: 1200000 },
      { label: 'Rp 50.000', count: 7, subtotal: 350000 },
      { label: 'Rp 20.000', count: 4, subtotal: 80000 },
      { label: 'Rp 10.000', count: 2, subtotal: 20000 },
    ],
  },
  {
    id: 'shift-103',
    cashierName: 'Siti Aminah',
    startTime: '03 Nov 2026, 16:00 WIB',
    endTime: '03 Nov 2026, 23:15 WIB',
    startingCash: 200000,
    systemCashSales: 1920000,
    expectedCashTotal: 2120000,
    actualCashCounted: 2115000,
    discrepancy: -5000,
    note: 'Selisih kurang Rp 5.000 karena pembulatan kembalian pelanggan jam sibuk.',
    denominations: [
      { label: 'Rp 100.000', count: 15, subtotal: 1500000 },
      { label: 'Rp 50.000', count: 10, subtotal: 500000 },
      { label: 'Rp 20.000', count: 4, subtotal: 80000 },
      { label: 'Rp 10.000', count: 3, subtotal: 30000 },
      { label: 'Rp 5.000', count: 1, subtotal: 5000 },
    ],
  },
  {
    id: 'shift-102',
    cashierName: 'Rian Pratama',
    startTime: '03 Nov 2026, 08:00 WIB',
    endTime: '03 Nov 2026, 16:00 WIB',
    startingCash: 200000,
    systemCashSales: 1740000,
    expectedCashTotal: 1940000,
    actualCashCounted: 1940000,
    discrepancy: 0,
    note: 'Semua penjualan tunai sesuai. Tidak ada komplain pembeli.',
    denominations: [
      { label: 'Rp 100.000', count: 14, subtotal: 1400000 },
      { label: 'Rp 50.000', count: 8, subtotal: 400000 },
      { label: 'Rp 20.000', count: 5, subtotal: 100000 },
      { label: 'Rp 10.000', count: 4, subtotal: 40000 },
    ],
  },
];

export function ShiftAuditSection() {
  const { currentShift, recentOrders } = usePos();
  const [selectedShift, setSelectedShift] = useState<HistoricalShift | null>(null);

  // Live calculation of current shift cash
  const liveCashSales = recentOrders
    .filter((o) => o.paymentMethod === 'CASH')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const startingCash = currentShift?.startingCash || 200000;
  const currentExpectedCash = startingCash + liveCashSales;

  const handleExportAuditCsv = () => {
    const headers = [
      'ID Shift',
      'Kasir',
      'Waktu Buka',
      'Waktu Tutup',
      'Modal Awal',
      'Kas Sistem',
      'Kas Fisik Dihitung',
      'Selisih Kas',
      'Status',
      'Catatan Kasir',
    ];
    const rows = HISTORICAL_SHIFTS.map((s) => [
      s.id,
      s.cashierName,
      s.startTime,
      s.endTime,
      s.startingCash,
      s.expectedCashTotal,
      s.actualCashCounted,
      s.discrepancy,
      s.discrepancy === 0 ? 'BALANCE' : s.discrepancy < 0 ? 'MINUS' : 'SURPLUS',
      s.note,
    ]);
    exportToCsv(`audit-shift-vitamine-${new Date().toISOString().slice(0, 10)}`, headers, rows);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Row */}
      <div className="p-6 rounded-3xl bg-[#0F1E1B] border border-white/10 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-white font-display tracking-tight flex items-center gap-2">
              <Calculator className="w-5 h-5 text-[#00E565]" />
              <span>Audit Kas & Rekonsiliasi Serah Terima Shift</span>
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-[#00E565]/20 text-[#00E565] text-xs font-mono font-bold border border-[#00E565]/30">
              Zero Ambiguity
            </span>
          </div>
          <p className="text-xs text-white/60 mt-1 max-w-2xl">
            Laporan transparansi selisih uang kas laci fisik vs penjualan sistem di setiap pergantian shift kasir. Mencegah kecurangan & selisih kas tersembunyi.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            type="button"
            onClick={handleExportAuditCsv}
            className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-white flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#00E565]" />
            <span>Download Audit CSV</span>
          </button>

          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-[#00E565]">
            <ShieldCheck className="w-4 h-4 text-[#00E565]" />
            <span>Siap Audit</span>
          </div>
        </div>
      </div>

      {/* 2. Active Shift Live Status Card */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-[#0F1E1B] to-[#122b24] border border-[#00B14F]/30 shadow-lg relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-[#00E565] font-bold">
              <span className="w-2 h-2 rounded-full bg-[#00E565] animate-pulse" />
              <span>SESI SHIFT AKTIF (SEDANG BERJALAN)</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#00B14F]/20 text-[#00E565] flex items-center justify-center font-black text-lg">
                RP
              </div>
              <div>
                <h3 className="text-lg font-black text-white">
                  Kasir: Rian Pratama (Shift #101)
                </h3>
                <span className="text-xs text-white/60 font-mono">
                  Mulai Buka: Hari ini, 08:00 WIB • Terminal POS Utama
                </span>
              </div>
            </div>
          </div>

          {/* Key Cash Status */}
          <div className="grid grid-cols-3 gap-4 border-t lg:border-t-0 lg:border-l border-white/10 pt-4 lg:pt-0 lg:pl-6 text-right">
            <div>
              <span className="text-[11px] font-semibold text-white/60 block">Modal Kas Awal</span>
              <span className="text-sm sm:text-base font-black text-white font-mono">
                Rp {startingCash.toLocaleString('id-ID')}
              </span>
            </div>
            <div>
              <span className="text-[11px] font-semibold text-white/60 block">Penjualan Tunai</span>
              <span className="text-sm sm:text-base font-black text-[#00E565] font-mono">
                +Rp {liveCashSales.toLocaleString('id-ID')}
              </span>
            </div>
            <div>
              <span className="text-[11px] font-semibold text-white/60 block">Target Fisik Laci</span>
              <span className="text-sm sm:text-base font-black text-white font-mono">
                Rp {currentExpectedCash.toLocaleString('id-ID')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Historical Shift Handover Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
            Riwayat Tutup Shift & Cash Opname Kasir Terakhir
          </h4>
          <span className="text-xs text-white/40 font-mono">
            {HISTORICAL_SHIFTS.length} Sesi Terarsip
          </span>
        </div>

        <div className="rounded-3xl bg-[#0F1E1B] border border-white/10 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#081210] border-b border-white/10 text-white/50 uppercase font-mono text-[10px]">
                <tr>
                  <th className="py-3 px-4">ID Shift</th>
                  <th className="py-3 px-4">Kasir Penyerah</th>
                  <th className="py-3 px-4">Waktu Buka - Tutup</th>
                  <th className="py-3 px-4 text-right">Modal Awal</th>
                  <th className="py-3 px-4 text-right">Kas Sistem</th>
                  <th className="py-3 px-4 text-right">Kas Fisik Aktual</th>
                  <th className="py-3 px-4 text-center">Status Selisih</th>
                  <th className="py-3 px-4 text-center">Rincian Pecahan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {HISTORICAL_SHIFTS.map((shift) => {
                  const isBalance = shift.discrepancy === 0;
                  const isMinus = shift.discrepancy < 0;

                  return (
                    <tr key={shift.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-4 px-4 font-mono font-bold text-white">
                        #{shift.id.replace('shift-', '')}
                      </td>

                      <td className="py-4 px-4 font-semibold text-white">
                        {shift.cashierName}
                      </td>

                      <td className="py-4 px-4 font-mono text-white/60 text-[11px]">
                        <div>{shift.startTime}</div>
                        <div className="text-white/40">s/d {shift.endTime}</div>
                      </td>

                      <td className="py-4 px-4 text-right font-mono text-white/80">
                        Rp {shift.startingCash.toLocaleString('id-ID')}
                      </td>

                      <td className="py-4 px-4 text-right font-mono text-white">
                        Rp {shift.expectedCashTotal.toLocaleString('id-ID')}
                      </td>

                      <td className="py-4 px-4 text-right font-mono font-bold text-white">
                        Rp {shift.actualCashCounted.toLocaleString('id-ID')}
                      </td>

                      <td className="py-4 px-4 text-center">
                        {isBalance ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-[#00E565] border border-emerald-500/30 text-[10px] font-mono font-bold">
                            <CheckCircle2 className="w-3 h-3" />
                            BALANCE (PAS)
                          </span>
                        ) : isMinus ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[10px] font-mono font-bold">
                            <AlertTriangle className="w-3 h-3" />
                            MINUS Rp {Math.abs(shift.discrepancy).toLocaleString('id-ID')}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/30 text-[10px] font-mono font-bold">
                            SURPLUS Rp {shift.discrepancy.toLocaleString('id-ID')}
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => setSelectedShift(shift)}
                          className="px-3 py-1 rounded-xl bg-white/5 hover:bg-[#00B14F] text-white/80 hover:text-white border border-white/10 hover:border-[#00B14F] text-[11px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1 mx-auto"
                        >
                          <Coins className="w-3 h-3" />
                          <span>Hitung Fisik</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 4. Denominations Breakdown Detail Modal */}
      {selectedShift && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150 select-none">
          <div className="w-full max-w-md bg-[#0F1E1B] border border-white/10 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <h4 className="text-base font-extrabold text-white flex items-center gap-2">
                  <Coins className="w-4 h-4 text-amber-400" />
                  <span>Rincian Uang Fisik Kasir</span>
                </h4>
                <p className="text-[11px] text-white/60 font-mono">
                  Shift #{selectedShift.id.slice(-3)} • Kasir: {selectedShift.cashierName}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedShift(null)}
                className="p-1 rounded-lg hover:bg-white/10 text-white/60 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Denomination Table */}
            <div className="space-y-1.5 font-mono text-xs max-h-60 overflow-y-auto no-scrollbar">
              {selectedShift.denominations.map((denom, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/5"
                >
                  <span className="font-bold text-white">{denom.label}</span>
                  <span className="text-white/60">{denom.count} lembar</span>
                  <span className="font-bold text-[#00E565]">
                    Rp {denom.subtotal.toLocaleString('id-ID')}
                  </span>
                </div>
              ))}
            </div>

            {/* Total Fisik Summary */}
            <div className="p-3 rounded-2xl bg-white/5 border border-white/5 space-y-1 font-mono text-xs">
              <div className="flex justify-between text-white/70">
                <span>Total Fisik Terhitung:</span>
                <span className="font-black text-white text-sm">
                  Rp {selectedShift.actualCashCounted.toLocaleString('id-ID')}
                </span>
              </div>
              <div className="flex justify-between text-white/70">
                <span>Ekspektasi Kas Sistem:</span>
                <span>Rp {selectedShift.expectedCashTotal.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-white/10 font-bold">
                <span>Status Selisih:</span>
                <span
                  className={
                    selectedShift.discrepancy === 0
                      ? 'text-[#00E565]'
                      : selectedShift.discrepancy < 0
                      ? 'text-rose-400'
                      : 'text-sky-400'
                  }
                >
                  {selectedShift.discrepancy === 0
                    ? 'PAS (BALANCE Rp 0)'
                    : `SELISIH ${selectedShift.discrepancy < 0 ? 'MINUS' : 'SURPLUS'} Rp ${Math.abs(selectedShift.discrepancy).toLocaleString('id-ID')}`}
                </span>
              </div>
            </div>

            {/* Cashier Handover Note */}
            {selectedShift.note && (
              <div className="p-3 rounded-xl bg-[#081210] border border-white/10 text-[11px] text-white/70">
                <span className="font-bold text-orange-400 block mb-0.5">Catatan Kasir:</span>
                <p className="italic">"{selectedShift.note}"</p>
              </div>
            )}

            <button
              type="button"
              onClick={() => setSelectedShift(null)}
              className="w-full py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors cursor-pointer"
            >
              Tutup Rincian
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

