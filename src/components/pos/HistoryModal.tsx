'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { usePos } from '@/context/PosContext';
import { Order, OrderType } from '@/types';
import {
  X,
  History,
  Store,
  Bike,
  Printer,
  Search,
  CheckCircle2,
  Clock,
  Receipt,
  Copy,
  Check,
  ArrowLeft,
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
      if (e.key === 'Escape' && isHistoryModalOpen) {
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
              onClick={() => setIsHistoryModalOpen(false)}
              className="w-9 h-9 rounded-xl bg-slate-800/80 hover:bg-[#00E565] text-slate-300 hover:text-slate-950 flex items-center justify-center transition-all cursor-pointer mr-1"
              title="Kembali ke POS (Esc)"
            >
              <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
            </button>
            <div className="w-10 h-10 rounded-2xl bg-[#00E565]/15 border border-[#00E565]/30 text-[#00E565] flex items-center justify-center font-bold shadow-xs">
              <History className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h2 className="font-extrabold text-lg text-white font-display tracking-tight flex items-center gap-2">
                <span>Riwayat Penjualan (History)</span>
              </h2>
              <p className="text-xs text-[#00E565]/80 font-medium">
                Daftar transaksi penjualan hari ini &bull; Pisahkan pesanan Pick Up dan Ojol Delivery
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsHistoryModalOpen(false)}
            className="w-9 h-9 rounded-xl bg-slate-800/80 hover:bg-rose-500 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            title="Tutup (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 2. Top Summary KPI Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 px-6 py-3.5 bg-[#0B1A16] border-b border-slate-800">
          <div className="p-3 bg-[#132824] rounded-xl border border-slate-800/90 shadow-2xs">
            <span className="text-[11px] font-bold text-[#00E565]/70 block">Total Omzet</span>
            <span className="text-base sm:text-lg font-black text-[#00E565] font-mono">
              Rp {totalOmzet.toLocaleString('id-ID')}
            </span>
          </div>

          <div className="p-3 bg-[#132824] rounded-xl border border-slate-800/90 shadow-2xs">
            <span className="text-[11px] font-bold text-[#00E565]/70 block">Total Transaksi</span>
            <span className="text-base sm:text-lg font-extrabold text-white font-mono">
              {recentOrders.length} Pesanan
            </span>
          </div>

          <div className="p-3 bg-[#132824] rounded-xl border border-slate-800/90 shadow-2xs">
            <span className="text-[11px] font-bold text-[#00E565]/70 flex items-center gap-1">
              <Store className="w-3 h-3 text-[#00E565]" />
              <span>Pick Up Outlet</span>
            </span>
            <span className="text-base sm:text-lg font-extrabold text-white font-mono">
              {pickUpOrders.length} Pesanan
            </span>
          </div>

          <div className="p-3 bg-[#132824] rounded-xl border border-slate-800/90 shadow-2xs">
            <span className="text-[11px] font-bold text-[#00E565]/70 flex items-center gap-1">
              <Bike className="w-3 h-3 text-[#00E565]" />
              <span>Delivery (Ojol)</span>
            </span>
            <span className="text-base sm:text-lg font-extrabold text-white font-mono">
              {deliveryOrders.length} Pesanan
            </span>
          </div>
        </div>

        {/* 3. Search & Service Filters */}
        <div className="px-6 py-3 border-b border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#0F1E1B]">
          {/* Service Filter Tabs */}
          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto no-scrollbar">
            <button
              type="button"
              onClick={() => setFilterType('ALL')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                filterType === 'ALL'
                  ? 'bg-[#00E565] text-slate-950 shadow-md font-black'
                  : 'bg-[#132824] text-slate-300 hover:text-white border border-slate-800'
              }`}
            >
              Semua ({recentOrders.length})
            </button>

            <button
              type="button"
              onClick={() => setFilterType('PICK_UP')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                filterType === 'PICK_UP'
                  ? 'bg-[#00E565] text-slate-950 shadow-md font-black'
                  : 'bg-[#132824] text-slate-300 hover:text-white border border-slate-800'
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              <span>Pick Up ({pickUpOrders.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setFilterType('DELIVERY')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                filterType === 'DELIVERY'
                  ? 'bg-[#00E565] text-slate-950 shadow-md font-black'
                  : 'bg-[#132824] text-slate-300 hover:text-white border border-slate-800'
              }`}
            >
              <Bike className="w-3.5 h-3.5" />
              <span>Delivery Ojol ({deliveryOrders.length})</span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari No. Order / Ref Ojol..."
              className="w-full pl-8 pr-3 py-1.5 bg-[#132824] border border-slate-700/80 rounded-xl text-xs font-medium text-white placeholder:text-slate-500 focus:outline-none focus:border-[#00E565]"
            />
          </div>
        </div>

        {/* 4. Split Two-Column Body: Order List (Left) & Order Detail (Right) */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden divide-y md:divide-y-0 md:divide-x divide-slate-800 min-h-0">
          {/* LEFT: Order List */}
          <div className="w-full md:w-5/12 overflow-y-auto p-4 space-y-2.5 h-full">
            {filteredOrders.length === 0 ? (
              <div className="py-20 text-center text-slate-500">
                <Receipt className="w-10 h-10 mx-auto text-slate-600 mb-2 stroke-[1.5]" />
                <p className="text-xs font-bold text-slate-400">Tidak ada riwayat transaksi</p>
                <p className="text-[11px] text-slate-500 mt-0.5">
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
                        ? 'border-[#00E565] bg-[#00E565]/10 shadow-md ring-1 ring-[#00E565]/30'
                        : 'border-slate-800/80 bg-[#132824] hover:border-slate-700 hover:bg-[#16302b]'
                    }`}
                  >
                    {/* Top Row: Time & Service Badge */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5 text-xs text-[#00E565]/80 font-medium">
                        <Clock className="w-3.5 h-3.5 text-[#00E565]" />
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
                            <span className="text-[10px] font-mono font-bold text-[#00E565] bg-[#0B1A16] px-1.5 py-0.5 rounded border border-slate-700">
                              #{order.deliveryRefNumber}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md bg-[#00E565]/15 text-[#00E565] border border-[#00E565]/30 text-[10px] font-bold flex items-center gap-1">
                          <Store className="w-3 h-3" />
                          <span>Pick Up</span>
                        </span>
                      )}
                    </div>

                    {/* Middle Row: Order Number & Items Summary */}
                    <div className="flex items-baseline justify-between mb-1">
                      <span className="font-extrabold text-xs text-white font-mono">
                        {order.orderNumber}
                      </span>
                      <span className="font-black text-sm text-[#00E565] font-mono">
                        Rp {order.totalAmount.toLocaleString('id-ID')}
                      </span>
                    </div>

                    {/* Bottom Row: Item count & Payment Pill */}
                    <div className="flex items-center justify-between text-[11px] text-[#00E565]/70 mt-2 pt-2 border-t border-slate-800">
                      <span className="truncate max-w-[220px]">
                        {order.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-slate-800 text-[#00E565]">
                        {order.paymentMethod === 'CASH' ? 'TUNAI' : 'QRIS'}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* RIGHT: Selected Order Detail */}
          <div className="w-full md:w-7/12 p-6 overflow-y-auto h-full bg-[#0B1A16]/50 flex flex-col justify-between">
            {selectedOrder ? (
              <div className="space-y-4">
                {/* Order Header Card */}
                <div className="p-4 rounded-2xl bg-[#132824] border border-slate-800 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-base sm:text-lg text-white">
                          {selectedOrder.orderNumber}
                        </span>
                        <button
                          type="button"
                          onClick={() => copyOrderNumber(selectedOrder.orderNumber)}
                          className="text-slate-400 hover:text-[#00E565] transition-colors cursor-pointer"
                          title="Salin No. Order"
                        >
                          {isCopied ? (
                            <Check className="w-3.5 h-3.5 text-[#00E565]" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                      <span className="text-xs text-[#00E565]/70">
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

                    <span className="px-2.5 py-1 rounded-full bg-[#00E565]/20 text-[#00E565] border border-[#00E565]/40 text-xs font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>LUNAS</span>
                    </span>
                  </div>

                  {/* Meta Specs Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mt-3.5 pt-3 border-t border-slate-800 text-xs">
                    <div>
                      <span className="text-[10px] text-[#00E565]/70 block font-semibold">Jenis Layanan</span>
                      <span className="font-bold text-white flex items-center gap-1 mt-0.5">
                        {selectedOrder.orderType === 'DELIVERY' ? (
                          <>
                            <Bike className="w-3.5 h-3.5 text-[#00E565]" />
                            <span>Delivery ({selectedOrder.deliveryPlatform || 'Ojol'})</span>
                          </>
                        ) : (
                          <>
                            <Store className="w-3.5 h-3.5 text-[#00E565]" />
                            <span>Pick Up Outlet</span>
                          </>
                        )}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-[#00E565]/70 block font-semibold">Kasir Bertugas</span>
                      <span className="font-bold text-white mt-0.5 block">
                        {selectedOrder.cashierName}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-[#00E565]/70 block font-semibold">Metode Bayar</span>
                      <span className="font-bold text-white mt-0.5 block">
                        {selectedOrder.paymentMethod === 'CASH' ? 'Tunai (Cash)' : 'QRIS Statis'}
                      </span>
                    </div>
                  </div>

                  {/* If Delivery has reference number */}
                  {selectedOrder.orderType === 'DELIVERY' && selectedOrder.deliveryRefNumber && (
                    <div className="mt-2.5 p-2 rounded-xl bg-[#0F1E1B] border border-slate-700/80 text-xs flex items-center justify-between">
                      <span className="text-slate-400 font-medium">Ref Pesanan Ojol / Driver PIN:</span>
                      <span className="font-mono font-bold text-[#00E565] bg-[#132824] px-2 py-0.5 rounded border border-slate-700">
                        {selectedOrder.deliveryRefNumber}
                      </span>
                    </div>
                  )}
                </div>

                {/* Items Breakdown Table */}
                <div className="p-4 rounded-2xl bg-[#132824] border border-slate-800 shadow-2xs space-y-3">
                  <h3 className="font-bold text-xs text-[#00E565] uppercase tracking-wider">
                    Rincian Menu ({selectedOrder.items.length} Macam)
                  </h3>

                  <div className="space-y-2.5 divide-y divide-slate-800">
                    {selectedOrder.items.map((item) => (
                      <div key={item.id} className="pt-2.5 first:pt-0 flex items-center justify-between gap-3">
                        <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-[#0F1E1B] shrink-0 border border-slate-800">
                          <Image
                            src={item.imageUrl}
                            alt={item.name}
                            fill
                            sizes="40px"
                            className="object-cover"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-xs text-white truncate">
                            {item.name}
                          </h4>
                          <div className="flex items-center gap-1.5 text-[10px] text-[#00E565]/80 font-mono">
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
                          <span className="text-[11px] text-[#00E565]/70 font-mono block">
                            {item.quantity} x Rp {item.unitPrice.toLocaleString('id-ID')}
                          </span>
                          <span className="font-bold text-xs text-white font-mono">
                            Rp {item.subtotal.toLocaleString('id-ID')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Financial Total Section */}
                  <div className="pt-3 border-t border-slate-800 space-y-1.5 text-xs">
                    <div className="flex justify-between text-slate-400">
                      <span>Subtotal Item</span>
                      <span className="font-mono text-white">Rp {selectedOrder.totalAmount.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Diskon</span>
                      <span className="font-mono text-rose-400">-Rp 0</span>
                    </div>
                    <div className="flex justify-between items-baseline pt-2 border-t border-slate-800">
                      <span className="font-bold text-sm text-white">Total Nett</span>
                      <span className="font-black text-xl text-[#00E565] font-mono">
                        Rp {selectedOrder.totalAmount.toLocaleString('id-ID')}
                      </span>
                    </div>

                    {selectedOrder.paymentMethod === 'CASH' && selectedOrder.cashTendered && (
                      <div className="pt-2 text-xs text-slate-400 space-y-1 bg-[#0F1E1B] p-2.5 rounded-xl border border-slate-800 mt-2">
                        <div className="flex justify-between">
                          <span>Tunai Diterima:</span>
                          <span className="font-mono font-bold text-white">
                            Rp {selectedOrder.cashTendered.toLocaleString('id-ID')}
                          </span>
                        </div>
                        <div className="flex justify-between font-bold text-[#00E565]">
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
                    className="btn-kilat flex-1 py-3 px-4 rounded-xl bg-[#00E565] hover:bg-[#2ef586] text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#00E565]/25 transition-all active:scale-98 cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Cetak Ulang Struk (58mm)</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-24 text-center text-slate-500">
                <Receipt className="w-12 h-12 mx-auto text-slate-600 mb-2 stroke-[1.5]" />
                <p className="text-xs font-bold text-slate-400">Pilih salah satu transaksi</p>
                <p className="text-[11px] text-slate-500 mt-0.5">
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