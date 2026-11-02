'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { usePos } from '@/context/PosContext';
import { Order, OrderType, OrderStatus } from '@/types';
import {
  X,
  ShoppingBag,
  Store,
  Bike,
  CheckCircle2,
  Clock,
  Printer,
  ChevronRight,
  Sparkles,
  CupSoda,
} from 'lucide-react';

export function OrderQueueModal() {
  const {
    isOrderModalOpen,
    setIsOrderModalOpen,
    recentOrders,
    updateOrderStatus,
    reprintReceipt,
  } = usePos();

  const [activeTab, setActiveTab] = useState<'ALL' | OrderType>('ALL');

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOrderModalOpen) return;
      if (e.key === 'Escape') {
        setIsOrderModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOrderModalOpen, setIsOrderModalOpen]);

  if (!isOrderModalOpen) return null;

  // Active orders in queue (not yet completed)
  const activeOrders = recentOrders.filter((o) => {
    const matchesTab = activeTab === 'ALL' || o.orderType === activeTab;
    return matchesTab;
  });

  const preparingCount = recentOrders.filter((o) => (o.status || 'PREPARING') === 'PREPARING').length;
  const readyCount = recentOrders.filter((o) => o.status === 'READY').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#051F20]/60 backdrop-blur-xs select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden flex flex-col max-h-[88vh]"
      >
        {/* 1. Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#EAF5EF] text-[#1A6B51] flex items-center justify-center font-bold shadow-xs">
              <ShoppingBag className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h2 className="font-extrabold text-lg text-slate-900 font-display tracking-tight flex items-center gap-2">
                <span>Daftar Pesanan (Order Queue)</span>
                <span className="px-2 py-0.5 rounded-full bg-[#EAF5EF] text-[#1A6B51] text-xs font-mono font-bold">
                  {recentOrders.length} Total
                </span>
              </h2>
              <p className="text-xs text-slate-400 font-medium">
                Antrean peracikan jus bar untuk pesanan Pick Up & Delivery Ojol
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsOrderModalOpen(false)}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors"
            title="Tutup (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 2. Filter Bar */}
        <div className="px-6 py-3 bg-[#F8FAF9] border-b border-slate-100 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('ALL')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'ALL'
                  ? 'bg-[#1A6B51] text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              Semua Pesanan ({recentOrders.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('PICK_UP')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'PICK_UP'
                  ? 'bg-[#1A6B51] text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              <span>Pick Up Outlet</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('DELIVERY')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'DELIVERY'
                  ? 'bg-[#1A6B51] text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Bike className="w-3.5 h-3.5" />
              <span>Delivery Ojol</span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold">
            <span className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200">
              Diracik: {preparingCount}
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
              Siap: {readyCount}
            </span>
          </div>
        </div>

        {/* 3. Orders Grid Cards */}
        <div className="flex-1 p-6 overflow-y-auto max-h-[60vh] bg-white">
          {activeOrders.length === 0 ? (
            <div className="py-20 text-center text-slate-400">
              <ShoppingBag className="w-12 h-12 mx-auto text-slate-300 mb-2 stroke-[1.5]" />
              <p className="font-bold text-sm text-slate-600">Tidak ada antrean pesanan</p>
              <p className="text-xs text-slate-400 mt-1">Pesanan baru dari kasir akan muncul di sini secara instan.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeOrders.map((order) => {
                const currentStatus = order.status || 'PREPARING';
                const formattedTime = new Date(order.createdAt).toLocaleTimeString('id-ID', {
                  hour: '2-digit',
                  minute: '2-digit',
                });

                return (
                  <div
                    key={order.id}
                    className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                      currentStatus === 'READY'
                        ? 'bg-emerald-50/40 border-emerald-200 shadow-xs'
                        : currentStatus === 'COMPLETED'
                        ? 'bg-slate-50 border-slate-200 opacity-70'
                        : 'bg-white border-slate-200/90 shadow-2xs'
                    }`}
                  >
                    <div>
                      {/* Top Header of Card */}
                      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-black text-sm text-slate-900">
                            {order.orderNumber}
                          </span>
                          <span className="text-xs text-slate-400 font-mono">
                            {formattedTime}
                          </span>
                        </div>

                        {/* Service Badge */}
                        {order.orderType === 'DELIVERY' ? (
                          <div className="flex items-center gap-1">
                            {order.deliveryPlatform === 'GOFOOD' && (
                              <span className="px-2 py-0.5 rounded-md bg-[#005C2B] text-white text-[10px] font-bold">
                                GoFood
                              </span>
                            )}
                            {order.deliveryPlatform === 'GRABFOOD' && (
                              <span className="px-2 py-0.5 rounded-md bg-[#00B14F] text-white text-[10px] font-bold">
                                GrabFood
                              </span>
                            )}
                            {order.deliveryPlatform === 'SHOPEEFOOD' && (
                              <span className="px-2 py-0.5 rounded-md bg-[#EE4D2D] text-white text-[10px] font-bold">
                                ShopeeFood
                              </span>
                            )}
                            {order.deliveryRefNumber && (
                              <span className="text-[10px] font-mono font-bold text-slate-700 bg-white px-1.5 py-0.5 rounded border border-slate-200">
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

                      {/* Items to prepare */}
                      <div className="py-3 space-y-2">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex items-start justify-between text-xs gap-2">
                            <div className="flex items-start gap-2">
                              <span className="w-5 h-5 rounded-md bg-[#1A6B51] text-white font-extrabold text-[11px] flex items-center justify-center shrink-0 font-mono">
                                {item.quantity}
                              </span>
                              <div>
                                <span className="font-bold text-slate-900 block leading-tight">
                                  {item.name}
                                </span>
                                <span className="text-[10px] text-slate-500 font-mono">
                                  {item.options.size === 'LARGE' ? '22oz Large' : '16oz'} &bull; Gula {item.options.sugarLevel} &bull; Es {item.options.iceLevel}
                                </span>
                              </div>
                            </div>
                            <span className="font-mono text-slate-400 font-semibold text-[11px]">
                              Rp {item.subtotal.toLocaleString('id-ID')}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Status Buttons */}
                    <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => reprintReceipt(order)}
                        className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                        title="Cetak Tiket Bar"
                      >
                        <Printer className="w-4 h-4" />
                      </button>

                      <div className="flex items-center gap-1.5">
                        {currentStatus === 'PREPARING' && (
                          <button
                            type="button"
                            onClick={() => updateOrderStatus(order.id, 'READY')}
                            className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-all shadow-xs"
                          >
                            Tandai Siap Diambil &rarr;
                          </button>
                        )}

                        {currentStatus === 'READY' && (
                          <button
                            type="button"
                            onClick={() => updateOrderStatus(order.id, 'COMPLETED')}
                            className="px-3 py-1.5 rounded-xl bg-[#1A6B51] hover:bg-[#14533F] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Selesai Diserahkan</span>
                          </button>
                        )}

                        {currentStatus === 'COMPLETED' && (
                          <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                            <span>Pesanan Selesai</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
