'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePos } from '@/context/PosContext';
import { OrderType, DeliveryPlatform } from '@/types';
import {
  X,
  Banknote,
  QrCode,
  Store,
  Bike,
  Printer,
  CheckCircle2,
  AlertCircle,
  FileText,
  RotateCcw,
} from 'lucide-react';

export function PaymentModal() {
  const {
    isPaymentModalOpen,
    setIsPaymentModalOpen,
    cart,
    cartTotal,
    paymentMethod,
    setPaymentMethod,
    cashTendered,
    setCashTendered,
    changeGiven,
    processCheckout,
  } = usePos();

  const [orderType, setOrderType] = useState<OrderType>('PICK_UP');
  const [deliveryPlatform, setDeliveryPlatform] = useState<DeliveryPlatform>('GOFOOD');
  const [deliveryRefNumber, setDeliveryRefNumber] = useState('');
  const [orderNote, setOrderNote] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const cashInputRef = useRef<HTMLInputElement>(null);

  // Focus cash input whenever modal opens with CASH selected
  useEffect(() => {
    if (isPaymentModalOpen && paymentMethod === 'CASH') {
      setTimeout(() => {
        cashInputRef.current?.focus();
        cashInputRef.current?.select();
      }, 100);
    }
  }, [isPaymentModalOpen, paymentMethod]);

  // Handle keyboard shortcuts within modal
  useEffect(() => {
    if (!isPaymentModalOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setIsPaymentModalOpen(false);
      } else if (e.key === 'F8') {
        e.preventDefault();
        setPaymentMethod('CASH');
        setTimeout(() => cashInputRef.current?.focus(), 50);
      } else if (e.key === 'F9') {
        e.preventDefault();
        setPaymentMethod('QRIS_STATIC');
      } else if (e.key === 'Enter') {
        const target = e.target as HTMLElement;
        if (target.tagName.toLowerCase() !== 'textarea') {
          if (paymentMethod !== 'CASH' || cashTendered >= cartTotal) {
            e.preventDefault();
            handleConfirmPayment();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPaymentModalOpen, paymentMethod, cashTendered, cartTotal]);

  if (!isPaymentModalOpen || cart.length === 0) return null;

  const setExactCash = () => {
    setCashTendered(cartTotal);
  };

  const addCash = (amount: number) => {
    setCashTendered(cashTendered + amount);
  };

  const setNominalCash = (amount: number) => {
    setCashTendered(amount);
  };

  const handleConfirmPayment = async () => {
    if (paymentMethod === 'CASH' && cashTendered < cartTotal) {
      alert('Uang yang diterima kurang dari total belanja!');
      cashInputRef.current?.focus();
      return;
    }

    setIsProcessing(true);
    try {
      const order = await processCheckout({
        orderType,
        deliveryPlatform: orderType === 'DELIVERY' ? deliveryPlatform : undefined,
        deliveryRefNumber: orderType === 'DELIVERY' && deliveryRefNumber ? deliveryRefNumber : undefined,
      });

      if (order) {
        setIsPaymentModalOpen(false);
        setTimeout(() => {
          window.print();
        }, 200);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const isCashReady = paymentMethod === 'CASH' ? cashTendered >= cartTotal : true;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none animate-in fade-in duration-150">
      <div className="bg-white dark:bg-[#0F1E1B] w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]">
        {/* 1. Header Modal */}
        <div className="px-6 py-4.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/60 dark:bg-slate-900/40">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#1A6B51] dark:text-[#00B14F]">
              Checkout Kasir
            </span>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              Pembayaran Pesanan
            </h2>
          </div>

          <div className="text-right flex items-center gap-3">
            <div>
              <span className="text-[10px] text-slate-400 block font-medium">Total Tagihan</span>
              <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                Rp {cartTotal.toLocaleString('id-ID')}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsPaymentModalOpen(false)}
              className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-800 dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 2. Body: Scrollable Form */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 min-h-0">
          {/* Order Type Pill (Pick Up vs Delivery) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Tipe Pesanan
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setOrderType('PICK_UP')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-2 cursor-pointer ${
                  orderType === 'PICK_UP'
                    ? 'bg-[#1A6B51] border-[#1A6B51] text-white shadow-xs'
                    : 'bg-white dark:bg-[#162724] border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
                }`}
              >
                <Store className="w-4 h-4 shrink-0" />
                <span>Pick Up / Dine In</span>
              </button>

              <button
                type="button"
                onClick={() => setOrderType('DELIVERY')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-2 cursor-pointer ${
                  orderType === 'DELIVERY'
                    ? 'bg-[#1A6B51] border-[#1A6B51] text-white shadow-xs'
                    : 'bg-white dark:bg-[#162724] border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
                }`}
              >
                <Bike className="w-4 h-4 shrink-0" />
                <span>Online Delivery (Ojol)</span>
              </button>
            </div>

            {/* Delivery Sub-selector */}
            {orderType === 'DELIVERY' && (
              <div className="mt-2.5 p-3 rounded-2xl bg-slate-50 dark:bg-[#162724] border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setDeliveryPlatform('GOFOOD')}
                    className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                      deliveryPlatform === 'GOFOOD'
                        ? 'bg-[#005C2B] text-white border-[#005C2B] shadow-xs'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    GoFood
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeliveryPlatform('GRABFOOD')}
                    className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                      deliveryPlatform === 'GRABFOOD'
                        ? 'bg-[#00B14F] text-white border-[#00B14F] shadow-xs'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    GrabFood
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeliveryPlatform('SHOPEEFOOD')}
                    className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                      deliveryPlatform === 'SHOPEEFOOD'
                        ? 'bg-[#EE4D2D] text-white border-[#EE4D2D] shadow-xs'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    ShopeeFood
                  </button>
                </div>
                <input
                  type="text"
                  value={deliveryRefNumber}
                  onChange={(e) => setDeliveryRefNumber(e.target.value)}
                  placeholder={`Masukkan No. Order ${deliveryPlatform} (opsional)...`}
                  className="w-full bg-white dark:bg-[#0F1E1B] px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#1A6B51]"
                />
              </div>
            )}
          </div>

          {/* Payment Method Tabs (CASH vs QRIS) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Metode Pembayaran
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('CASH')}
                className={`py-3 px-4 rounded-2xl text-xs sm:text-sm font-bold transition-all border flex items-center justify-center gap-2.5 cursor-pointer ${
                  paymentMethod === 'CASH'
                    ? 'bg-[#00B14F] border-[#00B14F] text-white shadow-md shadow-[#00B14F]/20'
                    : 'bg-white dark:bg-[#162724] border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-[#00B14F]'
                }`}
              >
                <Banknote className="w-5 h-5" />
                <div className="text-left">
                  <div className="leading-tight">Uang Tunai</div>
                  <span className="text-[10px] font-normal opacity-85">Shortcut: F8</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('QRIS_STATIC')}
                className={`py-3 px-4 rounded-2xl text-xs sm:text-sm font-bold transition-all border flex items-center justify-center gap-2.5 cursor-pointer ${
                  paymentMethod === 'QRIS_STATIC'
                    ? 'bg-[#D8232A] border-[#D8232A] text-white shadow-md shadow-[#D8232A]/20'
                    : 'bg-white dark:bg-[#162724] border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-[#D8232A]'
                }`}
              >
                <QrCode className="w-5 h-5" />
                <div className="text-left">
                  <div className="leading-tight">QRIS / Non-Tunai</div>
                  <span className="text-[10px] font-normal opacity-85">Shortcut: F9</span>
                </div>
              </button>
            </div>
          </div>

          {/* Panel: Cash Details */}
          {paymentMethod === 'CASH' && (
            <div className="p-4 rounded-2xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/25 space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Uang Diterima dari Pelanggan
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400 font-mono">
                    Rp
                  </span>
                  <input
                    ref={cashInputRef}
                    id="cash-tendered-input"
                    type="number"
                    value={cashTendered || ''}
                    onChange={(e) => setCashTendered(Number(e.target.value))}
                    placeholder="0"
                    className="w-full pl-11 pr-4 py-2.5 bg-white dark:bg-[#0F1E1B] border-2 border-emerald-500/40 rounded-xl text-lg font-black text-slate-900 dark:text-white font-mono focus:outline-none focus:border-emerald-500 transition-all"
                  />
                </div>
              </div>

              {/* Quick Cash Buttons */}
              <div>
                <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1.5 flex items-center justify-between">
                  <span>Pilihan Cepat:</span>
                  <button
                    type="button"
                    onClick={() => setCashTendered(0)}
                    className="text-[10px] text-slate-400 hover:text-rose-500 flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-2.5 h-2.5" />
                    Reset
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  <button
                    type="button"
                    onClick={setExactCash}
                    className="py-1.5 px-2 rounded-lg bg-emerald-600 text-white text-xs font-bold shadow-xs hover:bg-emerald-700 transition-colors cursor-pointer"
                  >
                    Uang Pas
                  </button>
                  <button
                    type="button"
                    onClick={() => setNominalCash(20000)}
                    className="py-1.5 px-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    20.000
                  </button>
                  <button
                    type="button"
                    onClick={() => setNominalCash(50000)}
                    className="py-1.5 px-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    50.000
                  </button>
                  <button
                    type="button"
                    onClick={() => setNominalCash(100000)}
                    className="py-1.5 px-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    100.000
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-1.5 mt-1.5">
                  <button
                    type="button"
                    onClick={() => addCash(10000)}
                    className="py-1 px-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-semibold hover:bg-emerald-100 transition-colors cursor-pointer"
                  >
                    +10.000
                  </button>
                  <button
                    type="button"
                    onClick={() => addCash(20000)}
                    className="py-1 px-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-semibold hover:bg-emerald-100 transition-colors cursor-pointer"
                  >
                    +20.000
                  </button>
                  <button
                    type="button"
                    onClick={() => addCash(50000)}
                    className="py-1 px-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-semibold hover:bg-emerald-100 transition-colors cursor-pointer"
                  >
                    +50.000
                  </button>
                </div>
              </div>

              {/* Kembalian / Status Display */}
              <div className="pt-2 border-t border-emerald-500/20">
                {cashTendered >= cartTotal ? (
                  <div className="p-3 rounded-xl bg-emerald-600 text-white flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 shrink-0" />
                      <span className="text-xs font-bold">Kembalian:</span>
                    </div>
                    <span className="text-xl font-black font-mono">
                      Rp {changeGiven.toLocaleString('id-ID')}
                    </span>
                  </div>
                ) : (
                  <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-400 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-semibold">
                      <AlertCircle className="w-4 h-4 shrink-0 text-amber-500" />
                      <span>Masih Kurang:</span>
                    </div>
                    <span className="font-mono font-bold text-sm">
                      Rp {(cartTotal - (cashTendered || 0)).toLocaleString('id-ID')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Panel: QRIS Details */}
          {paymentMethod === 'QRIS_STATIC' && (
            <div className="p-4 rounded-2xl bg-rose-500/5 dark:bg-rose-500/10 border border-rose-500/25 flex flex-col items-center text-center space-y-3">
              <div className="w-36 h-36 bg-white p-2.5 rounded-2xl border border-slate-200 shadow-md flex items-center justify-center">
                {/* Clean QR Graphic */}
                <div className="w-full h-full bg-slate-900 rounded-lg p-1.5 flex flex-col items-center justify-center text-white text-center">
                  <QrCode className="w-20 h-20 text-white stroke-[1.5]" />
                  <span className="text-[9px] font-mono tracking-widest uppercase font-bold mt-1">
                    QRIS VITAMINE
                  </span>
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Scan QRIS dengan Semua Aplikasi Pembayaran
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  BCA, Mandiri, BRI, BNI, GoPay, OVO, Dana, ShopeePay
                </p>
                <div className="inline-block mt-2 px-3 py-1 bg-rose-500/15 border border-rose-500/30 rounded-full text-xs font-black text-rose-600 dark:text-rose-400 font-mono">
                  Rp {cartTotal.toLocaleString('id-ID')}
                </div>
              </div>
            </div>
          )}

          {/* Order Items Preview (Compact Accordion) */}
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1.5">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              Ringkasan Item ({cart.reduce((s, it) => s + it.quantity, 0)} Porsi)
            </span>
            <div className="space-y-1 max-h-24 overflow-y-auto no-scrollbar">
              {cart.map((it) => (
                <div key={it.id} className="flex justify-between text-xs text-slate-700 dark:text-slate-300">
                  <span className="truncate pr-2">
                    <span className="font-bold text-slate-900 dark:text-white font-mono">{it.quantity}x</span>{' '}
                    {it.name}
                  </span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200 shrink-0">
                    Rp {(it.unitPrice * it.quantity).toLocaleString('id-ID')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 3. Footer Actions */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setIsPaymentModalOpen(false)}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold transition-colors cursor-pointer"
          >
            Batal (Esc)
          </button>

          <button
            type="button"
            onClick={handleConfirmPayment}
            disabled={!isCashReady || isProcessing}
            className={`flex-1 py-3 px-5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer ${
              !isCashReady || isProcessing
                ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed shadow-none'
                : 'bg-[#1A6B51] hover:bg-[#14533F] text-white shadow-[#1A6B51]/20 hover:shadow-lg'
            }`}
          >
            <Printer className="w-4 h-4" />
            <span>
              {isProcessing
                ? 'Memproses Transaksi...'
                : `Konfirmasi Bayar & Cetak Struk (Enter)`}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
