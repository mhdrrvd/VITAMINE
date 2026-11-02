'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { usePos } from '@/context/PosContext';
import { OrderType } from '@/types';
import {
  X,
  FileText,
  Banknote,
  QrCode,
  ShoppingBag,
  MoreVertical,
} from 'lucide-react';

export function CartPanel() {
  const {
    cart,
    cartTotal,
    removeFromCart,
    clearCart,
    paymentMethod,
    setPaymentMethod,
    cashTendered,
    setCashTendered,
    changeGiven,
    processCheckout,
  } = usePos();

  const [showNoteModal, setShowNoteModal] = useState(false);
  const [orderNote, setOrderNote] = useState('');

  const setExactCash = () => {
    setCashTendered(cartTotal);
  };

  const handleCheckoutClick = async () => {
    if (cart.length === 0) return;
    const order = await processCheckout({
      orderType: 'PICK_UP',
    });
    if (order) {
      setTimeout(() => {
        window.print();
      }, 200);
    }
  };

  return (
    <aside className="w-full h-full bg-white dark:bg-[#0F1E1B] text-slate-900 dark:text-white p-4 lg:p-4.5 select-none flex flex-col justify-between overflow-hidden transition-colors duration-300">
      {/* 1. Header: "Current Sale" (Sesuai Referensi Gambar) */}
      <div className="shrink-0 pb-3 border-b border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white tracking-tight font-display">
              Current Sale
            </h3>
            <span className="text-[11px] text-[#00E565] font-medium">
              {cart.length > 0 ? `${cart.length} item dipilih` : 'Belum ada item'}
            </span>
          </div>

          <div className="flex items-center gap-1">
            {cart.length > 0 && (
              <button
                type="button"
                onClick={clearCart}
                className="w-7 h-7 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-rose-300 dark:hover:border-rose-500 text-[#00E565]/70 hover:text-rose-500 flex items-center justify-center transition-colors cursor-pointer"
                title="Hapus Semua Item"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              type="button"
              className="text-[#00E565]/60 hover:text-[#00E565] p-1"
              title="Menu Opsi"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Items List with Stepper [ -  1  + ] (Exact Reference Layout) */}
      <div className="flex-1 overflow-y-auto no-scrollbar my-2.5 space-y-2 pr-1 min-h-0">
        {cart.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-[#00E565]/70 py-8">
            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800/60 flex items-center justify-center mb-2 text-[#00E565]/50">
              <ShoppingBag className="w-5 h-5 stroke-[1.8]" />
            </div>
            <p className="text-xs font-bold text-[#00E565]">No items in sale</p>
            <p className="text-[10px] text-[#00E565]/70 mt-0.5 max-w-[170px]">
              Klik tombol + pada menu jus untuk menambahkan pesanan.
            </p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {cart.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.16 }}
                className="p-2 rounded-xl bg-white dark:bg-[#132824] border border-slate-100 dark:border-slate-800/90 hover:border-slate-200 dark:hover:border-slate-700/80 shadow-2xs flex items-center justify-between gap-2.5"
              >
                {/* Square Product Image Thumbnail (Polos tanpa badge) */}
                <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-slate-50 dark:bg-[#1A3630] border border-slate-100 dark:border-slate-800 shrink-0">
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    sizes="40px"
                    className="object-contain p-1"
                    unoptimized
                  />
                </div>

                {/* Full Product Name & Customization Options (Teks Lebih Panjang & Jelas) */}
                <div className="flex-1 min-w-0 pr-1">
                  <div className="flex items-center gap-1.5">
                    {item.quantity === 1 ? (
                      <span className="text-[11px] font-bold text-[#00E565] font-mono shrink-0">1x</span>
                    ) : (
                      <span className="text-xs font-black text-[#00E565] font-mono shrink-0">{item.quantity}x</span>
                    )}
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white leading-snug line-clamp-2">
                      {item.name}
                    </h4>
                  </div>
                  {/* Customization Details */}
                  <div className="text-[10px] text-[#00E565]/90 font-medium truncate mt-0.5">
                    {item.options.size === 'LARGE' ? 'Large' : 'Regular'} • Gula {item.options.sugarLevel} • {item.options.iceLevel === 'NORMAL' ? 'Normal Ice' : item.options.iceLevel === 'LESS' ? 'Less Ice' : 'No Ice'}
                  </div>
                </div>

                {/* Remove Action Button & Total Price di Sudut Kanan */}
                <div className="flex flex-col items-end justify-between shrink-0 self-stretch min-h-[42px] pl-1">
                  <button
                    type="button"
                    onClick={() => removeFromCart(item.id)}
                    className="w-5 h-5 -mr-0.5 -mt-0.5 rounded-md text-[#00E565]/40 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center justify-center transition-colors cursor-pointer"
                    title="Hapus pesanan"
                  >
                    <X className="w-3.5 h-3.5 stroke-[2.2]" />
                  </button>
                  <span className="text-xs font-bold text-slate-900 dark:text-white font-mono tracking-tight whitespace-nowrap">
                    Rp {(item.subtotal || item.unitPrice * item.quantity).toLocaleString('id-ID')}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* 4. Bottom Financials & Action Buttons (Sesuai Referensi Gambar) */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-2.5 shrink-0">
        {/* Add Note Button */}
        <button
          type="button"
          onClick={() => setShowNoteModal(!showNoteModal)}
          className="w-full py-1 px-2.5 rounded-lg border border-dashed border-[#00E565]/35 hover:border-[#00E565] text-[#00E565] hover:text-[#00E565] text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <FileText className="w-3 h-3 text-[#00E565]" />
          <span>{orderNote ? `Note: ${orderNote}` : '+ Add Note'}</span>
        </button>

        <AnimatePresence>
          {showNoteModal && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-1.5 bg-slate-50 dark:bg-[#132824] rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden"
            >
              <input
                type="text"
                value={orderNote}
                onChange={(e) => setOrderNote(e.target.value)}
                placeholder="Catatan pesanan..."
                className="w-full bg-white dark:bg-[#0F1E1B] px-2 py-1 rounded-lg text-xs border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-[#00E565]/50 focus:outline-none focus:border-[#00E565]"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Financial Breakdown */}
        <div className="space-y-1 text-xs">
          <div className="flex justify-between text-[#00E565] text-[11px] font-medium">
            <span>Subtotal</span>
            <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">
              Rp {cartTotal.toLocaleString('id-ID')}
            </span>
          </div>

          <div className="flex justify-between items-baseline pt-1.5 border-t border-slate-100 dark:border-slate-800/80">
            <span className="font-bold text-sm text-slate-900 dark:text-white">Total</span>
            <span className="font-black text-xl text-slate-900 dark:text-white font-mono">
              Rp {cartTotal.toLocaleString('id-ID')}
            </span>
          </div>
        </div>

        {/* Payment Selector: Cash (F8) & QRIS (F9) */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            type="button"
            onClick={() => setPaymentMethod('CASH')}
            className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-1.5 cursor-pointer ${
              paymentMethod === 'CASH'
                ? 'bg-[#00B14F] border-[#00B14F] text-white shadow-xs'
                : 'bg-white dark:bg-[#132824] border-slate-200 dark:border-slate-800 text-[#00E565] hover:border-[#00B14F]'
            }`}
          >
            <Banknote className="w-3.5 h-3.5" />
            <span>Cash (F8)</span>
          </button>

          <button
            type="button"
            onClick={() => setPaymentMethod('QRIS_STATIC')}
            className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-1.5 cursor-pointer ${
              paymentMethod === 'QRIS_STATIC'
                ? 'bg-[#D8232A] border-[#D8232A] text-white shadow-xs'
                : 'bg-white dark:bg-[#132824] border-slate-200 dark:border-slate-800 text-[#00E565] hover:border-[#D8232A]'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>QRIS (F9)</span>
          </button>
        </div>

        {/* Cash Tendered & Quick Nominal Buttons */}
        {paymentMethod === 'CASH' && (
          <div className="p-2.5 rounded-2xl bg-[#00B14F]/5 dark:bg-[#00B14F]/10 border border-[#00B14F]/25 dark:border-[#00B14F]/30 space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#00E565]">Diterima:</span>
              <div className="relative flex-1 flex items-center">
                <input
                  id="cash-tendered-input"
                  type="number"
                  value={cashTendered || ''}
                  onChange={(e) => setCashTendered(Number(e.target.value))}
                  placeholder="Rp 0"
                  className="w-full pl-2.5 pr-14 py-1.5 bg-white dark:bg-[#0F1E1B] border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-black text-slate-900 dark:text-white text-right focus:outline-none focus:border-[#00B14F] shadow-2xs font-mono"
                />
                <button
                  type="button"
                  onClick={setExactCash}
                  title="Bayar dengan uang pas"
                  className="absolute right-1.5 px-2 py-0.5 rounded-lg bg-[#00B14F]/15 hover:bg-[#00B14F] text-[#00E565] hover:text-white dark:hover:text-black text-[10px] font-black transition-colors cursor-pointer"
                >
                  PAS
                </button>
              </div>
            </div>

            {/* Nominal Buttons: 20k, 50k, 100k (Otomatis Mengisi Nominal) */}
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => setCashTendered(20000)}
                className={`py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  cashTendered === 20000
                    ? 'bg-[#00B14F] text-white border-[#00B14F] shadow-xs'
                    : 'bg-white dark:bg-[#132824] text-[#00E565] border-slate-200 dark:border-slate-800 hover:border-[#00B14F] hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                20k
              </button>
              <button
                type="button"
                onClick={() => setCashTendered(50000)}
                className={`py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  cashTendered === 50000
                    ? 'bg-[#00B14F] text-white border-[#00B14F] shadow-xs'
                    : 'bg-white dark:bg-[#132824] text-[#00E565] border-slate-200 dark:border-slate-800 hover:border-[#00B14F] hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                50k
              </button>
              <button
                type="button"
                onClick={() => setCashTendered(100000)}
                className={`py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  cashTendered === 100000
                    ? 'bg-[#00B14F] text-white border-[#00B14F] shadow-xs'
                    : 'bg-white dark:bg-[#132824] text-[#00E565] border-slate-200 dark:border-slate-800 hover:border-[#00B14F] hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                100k
              </button>
            </div>

            {cashTendered >= cartTotal && cartTotal > 0 && (
              <div className="flex justify-between items-center text-xs font-bold text-[#00E565] pt-1 border-t border-[#00B14F]/15 dark:border-[#00B14F]/30">
                <span>Kembalian:</span>
                <span className="font-mono text-sm font-black">Rp {changeGiven.toLocaleString('id-ID')}</span>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons: [Clear Cart] & [Pay Rp ... (Enter)] */}
        <div className="flex items-center gap-2 pt-1">
          <button
            type="button"
            onClick={clearCart}
            disabled={cart.length === 0}
            className="px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-[#00E565] text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            Clear Cart
          </button>

          <motion.button
            whileHover={cart.length > 0 ? { scale: 1.01 } : undefined}
            whileTap={cart.length > 0 ? { scale: 0.99 } : undefined}
            type="button"
            onClick={handleCheckoutClick}
            disabled={cart.length === 0 || (paymentMethod === 'CASH' && cashTendered < cartTotal)}
            className={`flex-1 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer ${
              cart.length === 0 || (paymentMethod === 'CASH' && cashTendered < cartTotal)
                ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed shadow-none'
                : 'bg-[#1A6B51] hover:bg-[#14533F] dark:bg-[#00B14F] dark:hover:bg-[#009440] text-white shadow-[#1A6B51]/20 dark:shadow-[#00B14F]/20 hover:shadow-lg'
            }`}
          >
            <span>Pay Rp {cartTotal.toLocaleString('id-ID')}</span>
            <kbd className="px-1.5 py-0.5 bg-black/20 rounded text-[9px] font-mono text-white/90">
              Enter
            </kbd>
          </motion.button>
        </div>
      </div>
    </aside>
  );
}
