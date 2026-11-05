'use client';

import React, { useState } from 'react';
import { usePos } from '@/context/PosContext';
import { Order, OrderStatus } from '@/types';
import {
  Receipt,
  Clock,
  Printer,
  CheckCircle2,
  AlertCircle,
  ShoppingBag,
  DollarSign,
  QrCode,
  Search,
  Filter,
  Eye,
  X,
  ExternalLink,
} from 'lucide-react';

export function PosOrdersSection() {
  const { recentOrders, updateOrderStatus, reprintReceipt } = usePos();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | OrderStatus>('ALL');
  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState<Order | null>(null);

  // Filter orders
  const filteredOrders = recentOrders.filter((order) => {
    const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter;
    const matchesSearch =
      !searchQuery ||
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.cashierName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some((it) => it.name.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesStatus && matchesSearch;
  });

  // Calculate live metrics
  const totalRevenue = recentOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalCups = recentOrders.reduce(
    (sum, o) => sum + o.items.reduce((s, it) => s + it.quantity, 0),
    0
  );
  const cashTotal = recentOrders
    .filter((o) => o.paymentMethod === 'CASH')
    .reduce((sum, o) => sum + o.totalAmount, 0);
  const qrisTotal = recentOrders
    .filter((o) => o.paymentMethod === 'QRIS_STATIC')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  return (
    <div className="space-y-6">
      {/* 1. Header Row */}
      <div className="p-6 rounded-3xl bg-[#0F1E1B] border border-white/10 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-white font-display tracking-tight flex items-center gap-2">
              <Receipt className="w-5 h-5 text-[#00E565]" />
              <span>Live Monitor Transaksi Kasir POS</span>
            </h2>
            <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#00E565]/20 text-[#00E565] text-xs font-mono font-bold border border-[#00E565]/30">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00E565] animate-pulse" />
              Live Antrean
            </span>
          </div>
          <p className="text-xs text-white/60 mt-1">
            Pantau arus transaksi kasir, rincian cup pesanan, metode bayar (Tunai & QRIS), dan cetak ulang struk thermal 58mm.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-[#00E565] bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl self-start sm:self-auto">
          <span>Total Antrean:</span>
          <span className="font-bold text-white">{recentOrders.length} Pesanan</span>
        </div>
      </div>

      {/* 2. Metrics Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        <div className="p-4 rounded-2xl bg-[#0F1E1B] border border-white/10">
          <span className="text-[11px] font-semibold text-white/60">Total Omzet Kasir</span>
          <div className="text-xl sm:text-2xl font-black text-white font-mono mt-1">
            Rp {totalRevenue.toLocaleString('id-ID')}
          </div>
          <span className="text-[10px] text-[#00E565] font-bold mt-0.5 block">
            {recentOrders.length} transaksi tercatat
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-[#0F1E1B] border border-white/10">
          <span className="text-[11px] font-semibold text-white/60">Total Cup Terjual</span>
          <div className="text-xl sm:text-2xl font-black text-white font-mono mt-1">
            {totalCups} Cup
          </div>
          <span className="text-[10px] text-white/50 font-mono mt-0.5 block">
            Berdasarkan BOM deduction
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-[#0F1E1B] border border-white/10">
          <span className="text-[11px] font-semibold text-white/60">Tunai Laci Kas</span>
          <div className="text-xl sm:text-2xl font-black text-[#00E565] font-mono mt-1">
            Rp {cashTotal.toLocaleString('id-ID')}
          </div>
          <span className="text-[10px] text-white/50 font-mono mt-0.5 block">
            Wajib cocok saat tutup shift
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-[#0F1E1B] border border-white/10">
          <span className="text-[11px] font-semibold text-white/60">Pembayaran QRIS</span>
          <div className="text-xl sm:text-2xl font-black text-sky-400 font-mono mt-1">
            Rp {qrisTotal.toLocaleString('id-ID')}
          </div>
          <span className="text-[10px] text-sky-400/80 font-mono mt-0.5 block">
            Masuk langsung ke rekening
          </span>
        </div>
      </div>

      {/* 3. Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-2xl bg-[#0F1E1B] border border-white/10">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full sm:w-auto">
          {(['ALL', 'PREPARING', 'READY', 'COMPLETED'] as const).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                statusFilter === st
                  ? 'bg-[#00B14F] text-white shadow-xs'
                  : 'bg-white/5 text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              {st === 'ALL'
                ? 'Semua Status'
                : st === 'PREPARING'
                ? 'Sedang Diracik'
                : st === 'READY'
                ? 'Siap Diambil'
                : 'Selesai'}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nomor order / menu..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-[#00E565]"
          />
        </div>
      </div>

      {/* 4. Transactions List */}
      <div className="rounded-3xl bg-[#0F1E1B] border border-white/10 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#081210] border-b border-white/10 text-white/50 uppercase font-mono text-[10px]">
              <tr>
                <th className="py-3 px-4">No. Order / Waktu</th>
                <th className="py-3 px-4">Kasir</th>
                <th className="py-3 px-4">Item & Varian</th>
                <th className="py-3 px-4">Metode Bayar</th>
                <th className="py-3 px-4 text-right">Total Net</th>
                <th className="py-3 px-4 text-center">Status Pesanan</th>
                <th className="py-3 px-4 text-center">Aksi Struk</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-white/40">
                    Tidak ada transaksi yang sesuai kriteria filter.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const timeFormatted = new Date(order.createdAt).toLocaleTimeString('id-ID', {
                    hour: '2-digit',
                    minute: '2-digit',
                  });

                  return (
                    <tr key={order.id} className="hover:bg-white/5 transition-colors">
                      {/* Order Number & Time */}
                      <td className="py-3.5 px-4 font-mono">
                        <div className="font-bold text-white">{order.orderNumber}</div>
                        <div className="text-[11px] text-white/50 flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3 text-[#00E565]" />
                          <span>{timeFormatted} WIB</span>
                        </div>
                      </td>

                      {/* Cashier */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white">{order.cashierName}</div>
                        <span className="text-[10px] font-mono text-white/50">
                          {order.shiftId}
                        </span>
                      </td>

                      {/* Items */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-1 max-w-xs">
                          {order.items.map((it, idx) => (
                            <div key={idx} className="leading-tight">
                              <span className="font-bold text-white">
                                {it.quantity}x {it.name}
                              </span>
                              <span className="text-[10px] text-white/60 block font-mono">
                                {it.options.size} • Gula {it.options.sugarLevel} • Es {it.options.iceLevel}
                              </span>
                            </div>
                          ))}
                        </div>
                      </td>

                      {/* Payment Method */}
                      <td className="py-3.5 px-4 font-mono">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-bold text-[10px] ${
                            order.paymentMethod === 'CASH'
                              ? 'bg-emerald-500/20 text-[#00E565] border border-emerald-500/30'
                              : 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                          }`}
                        >
                          {order.paymentMethod === 'CASH' ? 'TUNAI' : 'QRIS STATIS'}
                        </span>
                      </td>

                      {/* Total Net */}
                      <td className="py-3.5 px-4 text-right font-mono font-black text-white text-sm">
                        Rp {order.totalAmount.toLocaleString('id-ID')}
                      </td>

                      {/* Status Selector */}
                      <td className="py-3.5 px-4 text-center">
                        <select
                          value={order.status || 'COMPLETED'}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                          className={`px-2 py-1 rounded-lg text-[11px] font-bold border focus:outline-none cursor-pointer ${
                            order.status === 'PREPARING'
                              ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                              : order.status === 'READY'
                              ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                              : 'bg-[#00B14F]/20 text-[#00E565] border-[#00B14F]/30'
                          }`}
                        >
                          <option value="PREPARING" className="bg-[#0B1E19] text-white">Diracik</option>
                          <option value="READY" className="bg-[#0B1E19] text-white">Siap</option>
                          <option value="COMPLETED" className="bg-[#0B1E19] text-white">Selesai</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setSelectedReceiptOrder(order)}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-[#00B14F] text-white/70 hover:text-white transition-colors cursor-pointer"
                            title="Lihat Pratinjau Struk"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => reprintReceipt(order)}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-orange-600 text-white/70 hover:text-white transition-colors cursor-pointer"
                            title="Cetak Uang Struk Thermal 58mm"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Thermal Receipt Preview Modal */}
      {selectedReceiptOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150 select-none">
          <div className="w-full max-w-sm bg-[#0F1E1B] border border-white/10 rounded-3xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Receipt className="w-4 h-4 text-[#00E565]" />
                <h4 className="text-sm font-bold text-white">Struk Thermal 58mm</h4>
              </div>
              <button
                type="button"
                onClick={() => setSelectedReceiptOrder(null)}
                className="p-1 rounded-lg hover:bg-white/10 text-white/60 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Thermal Print Visual Simulator */}
            <div className="p-4 rounded-2xl bg-white text-slate-950 font-mono text-[11px] leading-relaxed shadow-inner">
              <div className="text-center pb-2 border-b border-dashed border-slate-300">
                <div className="font-extrabold text-sm tracking-wider">VITAMINE</div>
                <div className="text-[10px] text-slate-600">Fresh Fruit Juice Smart POS</div>
                <div className="text-[9px] text-slate-500">Indomaret Mabar, Medan</div>
              </div>

              <div className="py-2 border-b border-dashed border-slate-300 text-[10px] space-y-0.5 text-slate-700">
                <div>No: {selectedReceiptOrder.orderNumber}</div>
                <div>Kasir: {selectedReceiptOrder.cashierName}</div>
                <div>Waktu: {new Date(selectedReceiptOrder.createdAt).toLocaleString('id-ID')}</div>
              </div>

              <div className="py-2 border-b border-dashed border-slate-300 space-y-1.5">
                {selectedReceiptOrder.items.map((it, i) => (
                  <div key={i} className="flex justify-between items-start">
                    <div>
                      <div className="font-bold">{it.quantity}x {it.name}</div>
                      <div className="text-[9px] text-slate-500">
                        {it.options.size} • Gula {it.options.sugarLevel} • Es {it.options.iceLevel}
                      </div>
                    </div>
                    <span className="font-bold">Rp {it.subtotal.toLocaleString('id-ID')}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2 space-y-1 font-bold">
                <div className="flex justify-between text-xs">
                  <span>TOTAL:</span>
                  <span>Rp {selectedReceiptOrder.totalAmount.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-[10px] text-slate-600 font-normal">
                  <span>Metode:</span>
                  <span>{selectedReceiptOrder.paymentMethod === 'CASH' ? 'TUNAI' : 'QRIS'}</span>
                </div>
              </div>

              <div className="text-center pt-3 text-[9px] text-slate-500 border-t border-dashed border-slate-300 mt-2">
                Terima kasih atas pesanan Anda!<br />
                Segar, Presisi & Bervitamin.
              </div>
            </div>

            {/* Print Action */}
            <button
              type="button"
              onClick={() => {
                reprintReceipt(selectedReceiptOrder);
                setSelectedReceiptOrder(null);
              }}
              className="btn-kilat w-full py-2.5 rounded-xl bg-[#00B14F] hover:bg-[#00E565] text-white hover:text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#00B14F]/30 transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak ke Printer Thermal 58mm</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

