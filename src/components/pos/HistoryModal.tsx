'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { usePos } from '@/context/PosContext';
import { Order, OrderType } from '@/types';
import {
  X,
  History,
  Store,
  Bike,
  Printer,
  Search,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  Receipt,
  Copy,
  Check,
} from 'lucide-react';

export function HistoryModal() {
  const {
    isHistoryModalOpen,
    setIsHistoryModalOpen,
    recentOrders,
    reprintReceipt,
  } = usePos();

  const [filterType, setFilterType] = useState<'ALL' | OrderType>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  // Set default selected order when opened
  useEffect(() => {
    if (isHistoryModalOpen && recentOrders.length > 0 && !selectedOrder) {
      setSelectedOrder(recentOrders[0]);
    }
  }, [isHistoryModalOpen, recentOrders, selectedOrder]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isHistoryModalOpen) return;
      if (e.key === 'Escape') {
        setIsHistoryModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isHistoryModalOpen, setIsHistoryModalOpen]);

  if (!isHistoryModalOpen) return null;

  // Filter orders
  const filteredOrders = recentOrders.filter((order) => {
    const matchesType =
      filterType === 'ALL' || order.orderType === filterType;

    const matchesSearch =
      !searchQuery ||
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.deliveryRefNumber &&
        order.deliveryRefNumber.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesType && matchesSearch;
  });

  const totalOmzet = recentOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const pickUpOrders = recentOrders.filter((o) => o.orderType === 'PICK_UP');
  const deliveryOrders = recentOrders.filter((o) => o.orderType === 'DELIVERY');

  const copyOrderNumber = (orderNumber: string) => {
    navigator.clipboard.writeText(orderNumber);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#051F20]/60 backdrop-blur-xs select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* 1. Modal Header */}
        <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#EAF5EF] text-[#1A6B51] flex items-center justify-center font-bold shadow-xs">
              <History className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h2 className="font-extrabold text-lg text-slate-900 font-display tracking-tight flex items-center gap-2">
                <span>Riwayat Penjualan (History)</span>
              </h2>
              <p className="text-xs text-slate-400 font-medium">
                Daftar transaksi penjualan hari ini &bull; Pisahkan pesanan Pick Up dan Ojol Delivery
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsHistoryModalOpen(false)}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors"
            title="Tutup (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 2. Top Summary KPI Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 px-6 py-3.5 bg-[#F8FAF9] border-b border-slate-100">
          <div className="p-3 bg-white rounded-xl border border-slate-200/70 shadow-2xs">
            <span className="text-[11px] font-bold text-slate-400 block">Total Omzet</span>
            <span className="text-base font-black text-[#1A6B51] font-mono">
              Rp {totalOmzet.toLocaleString('id-ID')}
            </span>
          </div>

          <div className="p-3 bg-white rounded-xl border border-slate-200/70 shadow-2xs">
            <span className="text-[11px] font-bold text-slate-400 block">Total Transaksi</span>
            <span className="text-base font-extrabold text-slate-900 font-mono">
              {recentOrders.length} Pesanan
            </span>
          </div>

          <div className="p-3 bg-white rounded-xl border border-slate-200/70 shadow-2xs">
            <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
              <Store className="w-3 h-3 text-[#1A6B51]" />
              <span>Pick Up Outlet</span>
            </span>
            <span className="text-base font-extrabold text-slate-900 font-mono">
              {pickUpOrders.length} Pesanan
            </span>
          </div>

          <div className="p-3 bg-white rounded-xl border border-slate-200/70 shadow-2xs">
            <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
              <Bike className="w-3 h-3 text-[#00B14F]" />
              <span>Delivery (Ojol)</span>
            </span>
            <span className="text-base font-extrabold text-slate-900 font-mono">
              {deliveryOrders.length} Pesanan
            </span>
          </div>
        </div>

        {/* 3. Search & Service Filters */}
        <div className="px-6 py-3 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white">
          {/* Service Filter Tabs */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto no-scrollbar">
            <button
              type="button"
              onClick={() => setFilterType('ALL')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterType === 'ALL'
                  ? 'bg-[#1A6B51] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Semua ({recentOrders.length})
            </button>

            <button
              type="button"
              onClick={() => setFilterType('PICK_UP')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                filterType === 'PICK_UP'
                  ? 'bg-[#1A6B51] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              <span>Pick Up ({pickUpOrders.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setFilterType('DELIVERY')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                filterType === 'DELIVERY'
                  ? 'bg-[#1A6B51] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Bike className="w-3.5 h-3.5" />
              <span>Delivery Ojol ({deliveryOrders.length})</span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari No. Order / Ref Ojol..."
              className="w-full pl-8 pr-3 py-1.5 bg-[#F8FAF9] border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#1A6B51]"
            />
          </div>
        </div>

        {/* 4. Split Two-Column Body: Order List (Left) & Order Detail (Right) */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden divide-y md:divide-y-0 md:divide-x divide-slate-100 min-h-[380px]">
          {/* LEFT: Order List */}
          <div className="w-full md:w-5/12 overflow-y-auto p-4 space-y-2.5 max-h-[50vh] md:max-h-[58vh]">
            {filteredOrders.length === 0 ? (
              <div className="py-16 text-center text-slate-400">
                <Receipt className="w-10 h-10 mx-auto text-slate-300 mb-2 stroke-[1.5]" />
                <p className="text-xs font-bold text-slate-600">Tidak ada riwayat transaksi</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Transaksi kasir akan otomatis tersimpan di sini.
                </p>
              </div>
            ) : (
              filteredOrders.map((order) => {
                const isSelected = selectedOrder?.id === order.id;
                const formattedTime = new Date(order.createdAt).toLocaleTimeString('id-ID', {
                  hour: '2-digit',
                  minute: '2-digit',
                });

                return (
                  <div
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#1A6B51] bg-[#EAF5EF]/40 shadow-xs ring-2 ring-[#1A6B51]/10'
                        : 'border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50/50'
                    }`}
                  >
                    {/* Top Row: Time & Service Badge */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{formattedTime} WIB</span>
                      </div>

                      {/* Service Badge (Pick Up vs Delivery Platform) */}
                      {order.orderType === 'DELIVERY' ? (
                        <div className="flex items-center gap-1">
                          {order.deliveryPlatform === 'GOFOOD' && (
                            <span className="px-2 py-0.5 rounded-md bg-[#005C2B] text-white text-[10px] font-bold flex items-center gap-1">
                              <Bike className="w-3 h-3" />
                              <span>GoFood</span>
                            </span>
                          )}
                          {order.deliveryPlatform === 'GRABFOOD' && (
                            <span className="px-2 py-0.5 rounded-md bg-[#00B14F] text-white text-[10px] font-bold flex items-center gap-1">
                              <Bike className="w-3 h-3" />
                              <span>GrabFood</span>
                            </span>
                          )}
                          {order.deliveryPlatform === 'SHOPEEFOOD' && (
                            <span className="px-2 py-0.5 rounded-md bg-[#EE4D2D] text-white text-[10px] font-bold flex items-center gap-1">
                              <Bike className="w-3 h-3" />
                              <span>ShopeeFood</span>
                            </span>
                          )}
                          {order.deliveryRefNumber && (
                            <span className="text-[10px] font-mono font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                              #{order.deliveryRefNumber}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md bg-[#EAF5EF] text-[#1A6B51] border border-[#8EB69B]/30 text-[10px] font-bold flex items-center gap-1">
                          <Store className="w-3 h-3" />
                          <span>Pick Up</span>
                        </span>
                      )}
                    </div>

                    {/* Middle Row: Order Number & Items Summary */}
                    <div className="flex items-baseline justify-between mb-1">
                      <span className="font-extrabold text-xs text-slate-800 font-mono">
                        {order.orderNumber}
                      </span>
                      <span className="font-black text-sm text-[#1A6B51] font-mono">
                        Rp {order.totalAmount.toLocaleString('id-ID')}
                      </span>
                    </div>

                    {/* Bottom Row: Item count & Payment Pill */}
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 pt-2 border-t border-slate-100">
                      <span className="truncate max-w-[180px]">
                        {order.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                      </span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold font-mono bg-slate-100 text-slate-600">
                        {order.paymentMethod === 'CASH' ? 'TUNAI' : 'QRIS'}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* RIGHT: Selected Order Detail */}
          <div className="w-full md:w-7/12 p-6 overflow-y-auto max-h-[50vh] md:max-h-[58vh] bg-[#F8FAF9]/50 flex flex-col justify-between">
            {selectedOrder ? (
              <div className="space-y-4">
                {/* Order Header Card */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-base text-slate-900">
                          {selectedOrder.orderNumber}
                        </span>
                        <button
                          type="button"
                          onClick={() => copyOrderNumber(selectedOrder.orderNumber)}
                          className="text-slate-400 hover:text-slate-700 transition-colors"
                          title="Salin No. Order"
                        >
                          {isCopied ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                      <span className="text-xs text-slate-400">
                        {new Date(selectedOrder.createdAt).toLocaleDateString('id-ID', {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}{' '}
                        pukul{' '}
                        {new Date(selectedOrder.createdAt).toLocaleTimeString('id-ID', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}{' '}
                        WIB
                      </span>
                    </div>

                    <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>LUNAS</span>
                    </span>
                  </div>

                  {/* Meta Specs Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mt-3.5 pt-3 border-t border-slate-100 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">Jenis Layanan</span>
                      <span className="font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                        {selectedOrder.orderType === 'DELIVERY' ? (
                          <>
                            <Bike className="w-3.5 h-3.5 text-[#00B14F]" />
                            <span>Delivery ({selectedOrder.deliveryPlatform || 'Ojol'})</span>
                          </>
                        ) : (
                          <>
                            <Store className="w-3.5 h-3.5 text-[#1A6B51]" />
                            <span>Pick Up Outlet</span>
                          </>
                        )}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">Kasir Bertugas</span>
                      <span className="font-bold text-slate-800 mt-0.5 block">
                        {selectedOrder.cashierName}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">Metode Bayar</span>
                      <span className="font-bold text-slate-800 mt-0.5 block">
                        {selectedOrder.paymentMethod === 'CASH' ? 'Tunai (Cash)' : 'QRIS Statis'}
                      </span>
                    </div>
                  </div>

                  {/* If Delivery has reference number */}
                  {selectedOrder.orderType === 'DELIVERY' && selectedOrder.deliveryRefNumber && (
                    <div className="mt-2.5 p-2 rounded-xl bg-slate-50 border border-slate-200/70 text-xs flex items-center justify-between">
                      <span className="text-slate-500 font-medium">Ref Pesanan Ojol / Driver PIN:</span>
                      <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                        {selectedOrder.deliveryRefNumber}
                      </span>
                    </div>
                  )}
                </div>

                {/* Items Breakdown Table */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-3">
                  <h3 className="font-bold text-xs text-slate-800 uppercase tracking-wider">
                    Rincian Menu ({selectedOrder.items.length} Macam)
                  </h3>

                  <div className="space-y-2.5 divide-y divide-slate-100">
                    {selectedOrder.items.map((item) => (
                      <div key={item.id} className="pt-2.5 first:pt-0 flex items-center justify-between gap-3">
                        <div className="relative w-10 h-10 rounded-full overflow-hidden bg-slate-100 shrink-0 border border-slate-100">
                          <Image
                            src={item.imageUrl}
                            alt={item.name}
                            fill
                            sizes="40px"
                            className="object-cover"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-xs text-slate-900 truncate">
                            {item.name}
                          </h4>
                          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono">
                            <span>
                              {item.options.size === 'LARGE' ? 'Large (22oz)' : 'Regular (16oz)'}
                            </span>
                            <span>&bull;</span>
                            <span>Gula: {item.options.sugarLevel}</span>
                            <span>&bull;</span>
                            <span>Es: {item.options.iceLevel}</span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-[11px] text-slate-400 font-mono block">
                            {item.quantity} x Rp {item.unitPrice.toLocaleString('id-ID')}
                          </span>
                          <span className="font-bold text-xs text-slate-900 font-mono">
                            Rp {item.subtotal.toLocaleString('id-ID')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Financial Total Section */}
                  <div className="pt-3 border-t border-slate-100 space-y-1.5 text-xs">
                    <div className="flex justify-between text-slate-500">
                      <span>Subtotal Item</span>
                      <span className="font-mono">Rp {selectedOrder.totalAmount.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Diskon</span>
                      <span className="font-mono text-rose-500">-Rp 0</span>
                    </div>
                    <div className="flex justify-between items-baseline pt-2 border-t border-slate-100">
                      <span className="font-bold text-sm text-slate-900">Total Nett</span>
                      <span className="font-black text-xl text-[#1A6B51] font-mono">
                        Rp {selectedOrder.totalAmount.toLocaleString('id-ID')}
                      </span>
                    </div>

                    {selectedOrder.paymentMethod === 'CASH' && selectedOrder.cashTendered && (
                      <div className="pt-2 text-xs text-slate-500 space-y-1 bg-[#F8FAF9] p-2 rounded-xl border border-slate-100 mt-2">
                        <div className="flex justify-between">
                          <span>Tunai Diterima:</span>
                          <span className="font-mono font-bold text-slate-800">
                            Rp {selectedOrder.cashTendered.toLocaleString('id-ID')}
                          </span>
                        </div>
                        <div className="flex justify-between font-bold text-[#1A6B51]">
                          <span>Uang Kembalian:</span>
                          <span className="font-mono">
                            Rp {(selectedOrder.changeGiven || 0).toLocaleString('id-ID')}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Reprint Receipt CTA */}
                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => reprintReceipt(selectedOrder)}
                    className="flex-1 py-3 px-4 rounded-xl bg-[#1A6B51] hover:bg-[#14533F] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-[#1A6B51]/20 transition-all active:scale-98"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Cetak Ulang Struk (58mm)</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-24 text-center text-slate-400">
                <Receipt className="w-12 h-12 mx-auto text-slate-300 mb-2 stroke-[1.5]" />
                <p className="text-xs font-bold text-slate-600">Pilih salah satu transaksi</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Klik kartu pesanan di sisi kiri untuk melihat detail lengkap dan cetak ulang struk.
                </p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
