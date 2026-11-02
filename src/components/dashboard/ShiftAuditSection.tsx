'use client';

import React from 'react';
import { Shift } from '@/types';
import { ScrollText, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

const SAMPLE_SHIFTS: Shift[] = [
  {
    id: 'shift-104',
    userId: 'user-1',
    userName: 'Rian Pratama',
    startTime: '2026-11-02T08:00:00Z',
    endTime: '2026-11-02T16:00:00Z',
    startingCash: 200000,
    systemCashTotal: 1650000,
    actualCashCounted: 1650000,
    cashDiscrepancy: 0,
    note: 'Uang fisik pas sesuai total penjualan shift pagi.',
    status: 'CLOSED',
  },
  {
    id: 'shift-103',
    userId: 'user-2',
    userName: 'Siti Aminah',
    startTime: '2026-11-01T16:00:00Z',
    endTime: '2026-11-01T22:00:00Z',
    startingCash: 200000,
    systemCashTotal: 2120000,
    actualCashCounted: 2115000,
    cashDiscrepancy: -5000,
    note: 'Selisih Rp5.000 karena salah kembalian pecahan receh ke pelanggan.',
    status: 'CLOSED',
  },
  {
    id: 'shift-102',
    userId: 'user-1',
    userName: 'Rian Pratama',
    startTime: '2026-11-01T08:00:00Z',
    endTime: '2026-11-01T16:00:00Z',
    startingCash: 200000,
    systemCashTotal: 1820000,
    actualCashCounted: 1820000,
    cashDiscrepancy: 0,
    note: 'Penutupan aman tanpa selisih.',
    status: 'CLOSED',
  },
];

export function ShiftAuditSection() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-white font-display flex items-center gap-2">
            <ScrollText className="w-5 h-5 text-orange-400" />
            <span>Audit Trail & Rekonsiliasi Kasir (Cash Opname)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Riwayat serah terima fisik uang kas laci tiap pergantian shift kerja karyawan
          </p>
        </div>
      </div>

      <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-900 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-extrabold uppercase tracking-wider">
                <th className="py-3.5 px-4">ID Sesi</th>
                <th className="py-3.5 px-4">Petugas Kasir</th>
                <th className="py-3.5 px-4">Waktu Buka / Tutup</th>
                <th className="py-3.5 px-4">Modal Kas</th>
                <th className="py-3.5 px-4">Kas Sistem</th>
                <th className="py-3.5 px-4">Kas Aktual Fisik</th>
                <th className="py-3.5 px-4">Selisih</th>
                <th className="py-3.5 px-4">Keterangan / Alasan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {SAMPLE_SHIFTS.map((shift) => {
                const isZero = shift.cashDiscrepancy === 0;
                const isMinus = (shift.cashDiscrepancy || 0) < 0;

                return (
                  <tr key={shift.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-orange-400">
                      #{shift.id.slice(-3)}
                    </td>
                    <td className="py-3.5 px-4 font-sans font-bold text-slate-200">
                      {shift.userName}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 font-sans text-[11px]">
                      {new Date(shift.startTime).toLocaleTimeString('id-ID', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}{' '}
                      -{' '}
                      {shift.endTime
                        ? new Date(shift.endTime).toLocaleTimeString('id-ID', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : 'Berjalan'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
                      Rp {shift.startingCash.toLocaleString('id-ID')}
                    </td>
                    <td className="py-3.5 px-4 text-slate-200 font-bold">
                      Rp {shift.systemCashTotal.toLocaleString('id-ID')}
                    </td>
                    <td className="py-3.5 px-4 text-white font-black">
                      Rp {shift.actualCashCounted?.toLocaleString('id-ID') || '-'}
                    </td>
                    <td className="py-3.5 px-4">
                      {isZero ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-bold">
                          <CheckCircle2 className="w-3 h-3" />
                          Rp 0 (PAS)
                        </span>
                      ) : isMinus ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[11px] font-bold">
                          <AlertTriangle className="w-3 h-3" />
                          -Rp {Math.abs(shift.cashDiscrepancy || 0).toLocaleString('id-ID')}
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-[11px] font-bold">
                          +Rp {shift.cashDiscrepancy?.toLocaleString('id-ID')}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-sans text-slate-300 max-w-xs text-[11px] leading-relaxed">
                      {shift.note || '-'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
