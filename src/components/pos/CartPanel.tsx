'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { usePos } from '@/context/PosContext';
import {
  Plus,
  Minus,
  Trash2,
  X,
  ShoppingBag,
  CreditCard,
  FileText,
  ArrowRight,
} from 'lucide-react';

export function CartPanel() {
  const {
    cart,
    cartTotal,
    removeFromCart,
    updateQuantity,
    clearCart,
    setIsPaymentModalOpen,
  } = usePos();

  const [showNoteInput, setShowNoteInput] = useState(false);
  const [orderNote, setOrderNote] = useState('');

  const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <aside className="w-full h-full bg-white text-slate-900 border border-slate-200/80 rounded-3xl p-5 select-none flex flex-col justify-between overflow-hidden shadow-xs">
      {/* 1. Header: "Current Sale" */}
      <div className="shrink-0 pb-3 border-b border-slate-100 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-extrabold text-base sm:text-lg text-slate-900 tracking-tight">
              Current Sale
            </h3>
            {cart.length > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-[#1A6B51]/10 text-[#1A6B51] text-[11px] font-bold">
                {totalItemsCount} item
              </span>
            )}
          </div>
          <span className="text-[11px] text-slate-400 font-medium">
            {cart.length > 0 ? `${cart.length} varian dipilih` : 'Belum ada pesanan'}
          </span>
        </div>

        {cart.length > 0 && (
          <button
            type="button"
            onClick={clearCart}
            className="px-2.5 py-1 rounded-lg border border-slate-200 hover:border-rose-300 text-slate-400 hover:text-rose-500 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
            title="Kosongkan Keranjang"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* 2. Items List: NOW EXPANDED TO FULL HEIGHT! */}
      <div className="flex-1 overflow-y-auto no-scrollbar py-3 space-y-2.5 min-h-0 pr-0.5">
        {cart.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 py-12">
            <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mb-3 text-slate-300">
              <ShoppingBag className="w-7 h-7 stroke-[1.6]" />
            </div>
            <p className="text-sm font-bold text-slate-700">Keranjang Masih Kosong</p>
            <p className="text-xs text-slate-400 mt-1 max-w-[200px]">
              Klik tombol (+) pada kartu menu jus untuk menambahkan pesanan.
            </p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {cart.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.16 }}
                className="p-3 rounded-2xl bg-white border border-slate-100 hover:border-slate-200 hover:shadow-2xs transition-all flex items-center justify-between gap-3"
              >
                {/* Product Thumbnail */}
                <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-50 border border-slate-100 shrink-0">
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    sizes="48px"
                    className="object-contain p-1"
                    unoptimized
                  />
                </div>

                {/* Name, Modifiers & Price */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-xs text-slate-900 truncate">
                    {item.name}
                  </h4>
                  <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                    <span className="text-[10px] text-slate-400 font-mono font-semibold">
                      Rp {item.unitPrice.toLocaleString('id-ID')}
                    </span>
                    {item.options && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-medium truncate max-w-[120px]">
                        {item.options.size} • {item.options.sugarLevel}
                      </span>
                    )}
                  </div>
                </div>

                {/* Stepper Capsule: [ -  1  + ] */}
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-xl border border-slate-200 bg-slate-50 shrink-0">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, -1)}
                    className="w-5 h-5 rounded-md flex items-center justify-center text-slate-600 hover:text-rose-600 hover:bg-white transition-colors cursor-pointer"
                    title="Kurangi"
                  >
                    <Minus className="w-3 h-3 stroke-[2.5]" />
                  </button>
                  <span className="font-black text-xs text-slate-900 w-4 text-center font-mono">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, 1)}
                    className="w-5 h-5 rounded-md flex items-center justify-center text-slate-600 hover:text-[#1A6B51] hover:bg-white transition-colors cursor-pointer"
                    title="Tambah"
                  >
                    <Plus className="w-3 h-3 stroke-[2.5]" />
                  </button>
                </div>

                {/* Line Subtotal */}
                <span className="font-black text-xs text-slate-900 font-mono shrink-0 w-20 text-right">
                  Rp {(item.unitPrice * item.quantity).toLocaleString('id-ID')}
                </span>

                {/* Delete Button */}
                <button
                  type="button"
                  onClick={() => removeFromCart(item.id)}
                  className="w-7 h-7 rounded-lg text-slate-300 hover:text-rose-500 hover:bg-rose-50 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                  title="Hapus"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* 3. Bottom Summary & Tombol Pembayaran */}
      <div className="pt-3 border-t border-slate-100 space-y-3 shrink-0">
        {/* Catatan Tambahan (Compact Toggle) */}
        <div>
          {showNoteInput ? (
            <div className="relative">
              <input
                type="text"
                value={orderNote}
                onChange={(e) => setOrderNote(e.target.value)}
                placeholder="Catatan pesanan (cth: jangan terlalu manis)..."
                className="w-full pl-3 pr-7 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#1A6B51]"
              />
              <button
                type="button"
                onClick={() => setShowNoteInput(false)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowNoteInput(true)}
              className="text-[11px] font-semibold text-slate-400 hover:text-[#1A6B51] flex items-center gap-1 transition-colors cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{orderNote ? `Catatan: ${orderNote}` : '+ Tambah Catatan Pesanan'}</span>
            </button>
          )}
        </div>

        {/* Financial Summary */}
        <div className="space-y-1 text-xs">
          <div className="flex justify-between text-slate-500 text-[11px]">
            <span>Subtotal ({totalItemsCount} item)</span>
            <span className="font-bold text-slate-800 font-mono">
              Rp {cartTotal.toLocaleString('id-ID')}
            </span>
          </div>

          <div className="flex justify-between items-baseline pt-2 border-t border-slate-100">
            <span className="font-bold text-sm text-slate-900">Total Tagihan</span>
            <span className="font-black text-2xl text-slate-900 font-mono">
              Rp {cartTotal.toLocaleString('id-ID')}
            </span>
          </div>
        </div>

        {/* 4. Tombol Pembayaran Utama (Dipisah Menjadi Modal Khusus) */}
        <motion.button
          whileHover={cart.length > 0 ? { scale: 1.01 } : undefined}
          whileTap={cart.length > 0 ? { scale: 0.99 } : undefined}
          type="button"
          onClick={() => setIsPaymentModalOpen(true)}
          disabled={cart.length === 0}
          className={`w-full py-3.5 px-4 rounded-2xl font-bold text-sm sm:text-base flex items-center justify-between transition-all shadow-md cursor-pointer ${
            cart.length === 0
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
              : 'bg-[#1A6B51] hover:bg-[#14533F] text-white shadow-[#1A6B51]/25 hover:shadow-xl'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <CreditCard className="w-5 h-5 stroke-[2.2]" />
            <span>Pembayaran</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-mono font-black text-base sm:text-lg">
              Rp {cartTotal.toLocaleString('id-ID')}
            </span>
            <kbd className="px-1.5 py-0.5 bg-black/20 rounded text-[10px] font-mono font-normal">
              Enter ↵
            </kbd>
          </div>
        </motion.button>
      </div>
    </aside>
  );
}
