'use client';

import React from 'react';
import Image from 'next/image';
import { CartItem, PromoSlide } from '@/types';
import { PromoCarousel } from './PromoCarousel';
import {
  ShoppingBag,
  QrCode,
  Banknote,
  Sparkles,
  CheckCircle2,
  Clock,
} from 'lucide-react';

interface LiveCartViewProps {
  items: CartItem[];
  subtotal: number;
  totalAmount: number;
  paymentMethod?: string;
  cashTendered?: number;
  changeGiven?: number;
  promos: PromoSlide[];
}

export function LiveCartView({
  items,
  subtotal,
  totalAmount,
  paymentMethod = 'CASH',
  cashTendered = 0,
  changeGiven = 0,
  promos,
}: LiveCartViewProps) {
  return (
    <div className="w-full h-full bg-slate-100 flex flex-col lg:flex-row overflow-hidden select-none">
      {/* 1. Left Section (60% Width) - Live Order Review */}
      <section className="flex-1 lg:w-[60%] bg-white flex flex-col justify-between p-6 sm:p-8 border-r border-slate-200 overflow-hidden">
        {/* Header Bar */}
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center font-extrabold text-xl shadow-sm">
                V
              </div>
              <div>
                <h1 className="text-xl font-extrabold text-slate-900 tracking-tight font-display">
                  Pesanan Anda di VITAMINE
                </h1>
                <p className="text-xs text-slate-500 font-medium">
                  Periksa rincian pesanan jus segar Anda di bawah ini
                </p>
              </div>
            </div>

            <div className="px-3 py-1 rounded-full bg-orange-100 text-orange-700 font-extrabold text-xs">
              {items.length} Menu Dipilih
            </div>
          </div>

          {/* Items List */}
          <div className="mt-4 max-h-[46vh] overflow-y-auto space-y-3 pr-2">
            {items.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4 transition-all"
              >
                <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-slate-200 shrink-0">
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-orange-500 text-white font-extrabold text-xs flex items-center justify-center shrink-0">
                      {item.quantity}x
                    </span>
                    <h3 className="font-extrabold text-slate-900 text-base leading-tight">
                      {item.name}
                    </h3>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {item.options.size === 'LARGE' && (
                      <span className="px-2 py-0.5 rounded-md bg-orange-100 text-orange-700 text-[11px] font-bold">
                        Size Large
                      </span>
                    )}
                    <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600 text-[11px] font-medium">
                      Gula: {item.options.sugarLevel}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600 text-[11px] font-medium">
                      Es: {item.options.iceLevel === 'NORMAL' ? 'Normal' : item.options.iceLevel === 'LESS' ? 'Less' : 'No Ice'}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[11px] text-slate-400 block font-medium">
                    @Rp {item.unitPrice.toLocaleString('id-ID')}
                  </span>
                  <span className="font-extrabold text-slate-900 text-lg">
                    Rp {item.subtotal.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Financial Calculation & Payment Review */}
        <div className="pt-4 border-t border-slate-200 space-y-4 bg-white">
          <div className="space-y-1 text-sm text-slate-600">
            <div className="flex justify-between">
              <span>Subtotal Pembelian:</span>
              <span className="font-bold text-slate-900">
                Rp {subtotal.toLocaleString('id-ID')}
              </span>
            </div>
            <div className="flex justify-between text-xs text-slate-400">
              <span>Pajak Restoran / PB1 (Harga Net Final):</span>
              <span>Rp 0</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-orange-800 uppercase tracking-wider block">
                Total Pembayaran (Nett)
              </span>
              <span className="text-xs text-orange-600 font-medium">
                Metode: {paymentMethod === 'CASH' ? 'Tunai di Kasir' : paymentMethod === 'QRIS_STATIC' ? 'QRIS' : 'Transfer'}
              </span>
            </div>

            <span className="text-3xl sm:text-4xl font-black text-orange-600 font-display">
              Rp {totalAmount.toLocaleString('id-ID')}
            </span>
          </div>

          {/* Cash Change or QRIS Display */}
          {paymentMethod === 'CASH' && cashTendered > 0 && (
            <div className="p-3.5 rounded-2xl bg-slate-900 text-white flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 block font-medium">Uang Diterima:</span>
                <span className="font-extrabold text-lg">
                  Rp {cashTendered.toLocaleString('id-ID')}
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs text-emerald-400 block font-bold">Kembalian Anda:</span>
                <span className="font-extrabold text-xl text-emerald-400">
                  Rp {changeGiven.toLocaleString('id-ID')}
                </span>
              </div>
            </div>
          )}

          {paymentMethod === 'QRIS_STATIC' && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                  <QrCode className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-extrabold text-emerald-900 text-sm">
                    Pembayaran QRIS Aktif
                  </h4>
                  <p className="text-xs text-emerald-700">
                    Silakan scan QRIS di samping kanan monitor untuk membayar
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 bg-emerald-600 text-white text-xs font-extrabold rounded-lg">
                Siap Di-scan
              </span>
            </div>
          )}
        </div>
      </section>

      {/* 2. Right Section (40% Width) - Mini Promo or QRIS Code Display */}
      <section className="hidden lg:flex lg:w-[40%] bg-slate-900 p-6 sm:p-8 flex-col justify-between text-white">
        {paymentMethod === 'QRIS_STATIC' ? (
          // QRIS Focused Display
          <div className="h-full flex flex-col items-center justify-center text-center p-6 bg-white text-slate-900 rounded-3xl shadow-lg border border-slate-200">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold mb-4 uppercase tracking-wider">
              <QrCode className="w-4 h-4" />
              Scan QRIS VITAMINE
            </div>

            {/* QR Mockup Box */}
            <div className="p-4 bg-white rounded-2xl border-2 border-dashed border-slate-300 shadow-inner mb-4">
              <div className="w-48 h-48 bg-slate-900 rounded-xl flex items-center justify-center p-3 text-white">
                <div className="w-full h-full border-4 border-white rounded-lg flex flex-col items-center justify-center p-2">
                  <QrCode className="w-24 h-24 stroke-[1.5]" />
                  <span className="text-[10px] font-mono tracking-widest mt-1 uppercase font-bold">
                    QRIS RESMI
                  </span>
                </div>
              </div>
            </div>

            <p className="font-black text-2xl text-slate-900 font-display">
              Rp {totalAmount.toLocaleString('id-ID')}
            </p>
            <p className="text-xs text-slate-500 mt-1 max-w-xs leading-relaxed">
              Dukungan seluruh aplikasi pembayaran: BCA, Mandiri, GoPay, OVO, ShopeePay, DANA.
            </p>
          </div>
        ) : (
          // Mini Promo Carousel
          <div className="h-full flex flex-col justify-between">
            <div className="flex-1">
              <PromoCarousel promos={promos} isCompact={true} />
            </div>

            <div className="pt-6 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-orange-400" />
                <span>100% Buah Murni Tanpa Es Batu Tambahan Air</span>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
