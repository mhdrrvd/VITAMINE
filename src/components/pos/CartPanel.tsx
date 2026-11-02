'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { usePos } from '@/context/PosContext';
import {
  Plus,
  Minus,
  Trash2,
  FileText,
  Banknote,
  QrCode,
  ShoppingBag,
} from 'lucide-react';

export function CartPanel() {
  const {
    cart,
    cartTotal,
    removeFromCart,
    updateQuantity,
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
  const [showPaymentDrawer, setShowPaymentDrawer] = useState(false);

  const addQuickCash = (amount: number) => {
    setCashTendered(cashTendered + amount);
  };

  const setExactCash = () => {
    setCashTendered(cartTotal);
  };

  const handleCheckoutClick = async () => {
    if (cart.length === 0) return;
    const order = await processCheckout();
    if (order) {
      setShowPaymentDrawer(false);
      setTimeout(() => {
        window.print();
      }, 200);
    }
  };

  return (
    <aside className="w-full lg:w-[380px] xl:w-[410px] bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between p-5 select-none shrink-0 sticky top-24 transition-all">
      {/* 1. Header */}
      <div>
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#DAF1DE] text-[#235347] flex items-center justify-center font-bold shadow-2xs">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-[#051F20] font-display tracking-tight">
                Current Sale
              </h3>
              <span className="text-[11px] text-slate-400 font-medium">
                {cart.length > 0 ? `${cart.length} jenis item dipilih` : 'Belum ada pesanan'}
              </span>
            </div>
          </div>

          {cart.length > 0 && (
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              type="button"
              onClick={clearCart}
              className="text-slate-400 hover:text-rose-500 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
              title="Kosongkan Keranjang"
            >
              <Trash2 className="w-4 h-4" />
            </motion.button>
          )}
        </div>

        {/* 2. Animated Item Rows List */}
        <div className="max-h-[36vh] xl:max-h-[42vh] overflow-y-auto pr-1 mt-3 space-y-2 no-scrollbar">
          {cart.length === 0 ? (
            <div className="py-12 text-center text-slate-400 flex flex-col items-center">
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ repeat: Infinity, duration: 2.8, ease: 'easeInOut' }}
                className="w-12 h-12 rounded-2xl bg-[#F4F7F5] flex items-center justify-center mb-2.5 text-slate-300"
              >
                <ShoppingBag className="w-6 h-6 stroke-[1.5]" />
              </motion.div>
              <p className="text-xs font-bold text-slate-600">Keranjang masih kosong</p>
              <p className="text-[11px] text-slate-400 mt-1 max-w-[200px] leading-relaxed">
                Pilih menu di sebelah kiri untuk mulai menambahkan pesanan.
              </p>
            </div>
          ) : (
            <AnimatePresence initial={false}>
              {cart.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 20, transition: { duration: 0.15 } }}
                  transition={{ duration: 0.2 }}
                  className="p-2.5 rounded-xl border border-slate-100 hover:border-slate-200/90 bg-white hover:bg-slate-50/50 flex items-center justify-between gap-2.5 transition-colors group"
                >
                  {/* Thumbnail */}
                  <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-100">
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      sizes="40px"
                      className="object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-xs text-[#051F20] truncate">
                      {item.name}
                    </h4>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono">
                      <span>Rp {item.unitPrice.toLocaleString('id-ID')}</span>
                      {item.options.sugarLevel !== '100%' && (
                        <span className="text-[#235347] font-semibold font-sans">
                          &bull; {item.options.sugarLevel}
                        </span>
                      )}
                      {item.options.size === 'LARGE' && (
                        <span className="text-[#235347] font-semibold font-sans">
                          &bull; L
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Stepper `[- 1 +]` */}
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg border border-slate-200/80 bg-[#F4F7F5]">
                    <motion.button
                      whileTap={{ scale: 0.8 }}
                      whileHover={{ scale: 1.1 }}
                      type="button"
                      onClick={() => updateQuantity(item.id, -1)}
                      className="text-slate-600 hover:text-[#051F20] transition-colors p-0.5"
                      aria-label="Kurangi kuantitas"
                    >
                      <Minus className="w-3 h-3" />
                    </motion.button>
                    <span className="font-extrabold text-xs text-[#051F20] w-4 text-center font-mono">
                      {item.quantity}
                    </span>
                    <motion.button
                      whileTap={{ scale: 0.8 }}
                      whileHover={{ scale: 1.1 }}
                      type="button"
                      onClick={() => updateQuantity(item.id, 1)}
                      className="text-slate-600 hover:text-[#051F20] transition-colors p-0.5"
                      aria-label="Tambah kuantitas"
                    >
                      <Plus className="w-3 h-3" />
                    </motion.button>
                  </div>

                  {/* Subtotal */}
                  <span className="font-extrabold text-xs text-[#051F20] w-16 text-right font-mono">
                    Rp {item.subtotal.toLocaleString('id-ID')}
                  </span>

                  {/* Delete */}
                  <motion.button
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.85 }}
                    type="button"
                    onClick={() => removeFromCart(item.id)}
                    className="text-slate-300 hover:text-rose-500 transition-colors p-1"
                    title="Hapus item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </motion.button>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* Add Note Button */}
        <button
          type="button"
          onClick={() => setShowNoteModal(!showNoteModal)}
          className="w-full mt-3 py-2 px-3 rounded-xl border border-dashed border-slate-200 hover:border-[#235347] text-slate-500 hover:text-[#235347] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>{orderNote ? `Catatan: ${orderNote}` : '+ Add Note'}</span>
        </button>

        <AnimatePresence>
          {showNoteModal && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2 p-2 bg-[#F4F7F5] rounded-xl border border-slate-200 overflow-hidden"
            >
              <input
                type="text"
                value={orderNote}
                onChange={(e) => setOrderNote(e.target.value)}
                placeholder="Catatan pesanan (misal: pisahkan es)..."
                className="w-full bg-white p-2 rounded-lg text-xs border border-slate-200 focus:outline-none focus:border-[#235347] transition-colors"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 3. Bottom Financials & Pay Action */}
      <div className="pt-4 border-t border-slate-100 space-y-3">
        {/* Subtotal, Tax, Total */}
        <div className="space-y-1.5 text-xs text-slate-500">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="font-bold text-[#051F20] font-mono">
              Rp {cartTotal.toLocaleString('id-ID')}
            </span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Tax (0% Net Final)</span>
            <span>Rp 0</span>
          </div>
          <div className="flex justify-between items-baseline pt-2 border-t border-slate-100">
            <span className="font-extrabold text-sm text-[#051F20]">Total</span>
            <span className="font-black text-2xl text-[#051F20] font-display">
              Rp {cartTotal.toLocaleString('id-ID')}
            </span>
          </div>
        </div>

        {/* Payment Drawer Toggle for Method & Tendered */}
        <AnimatePresence>
          {showPaymentDrawer && (
            <motion.div
              initial={{ opacity: 0, y: 10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: 10, height: 0 }}
              className="p-3 rounded-xl bg-[#F4F7F5] border border-slate-200 space-y-2.5 overflow-hidden"
            >
              {/* Payment Mode Pills */}
              <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('CASH')}
                  className={`py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                    paymentMethod === 'CASH'
                      ? 'bg-[#235347] text-white shadow-xs'
                      : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <Banknote className="w-3.5 h-3.5" />
                  <span>Tunai (F8)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('QRIS_STATIC')}
                  className={`py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                    paymentMethod === 'QRIS_STATIC'
                      ? 'bg-[#235347] text-white shadow-xs'
                      : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>QRIS (F9)</span>
                </button>
              </div>

              {/* Cash input */}
              {paymentMethod === 'CASH' && (
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-600">Diterima:</span>
                    <input
                      id="cash-tendered-input"
                      type="number"
                      value={cashTendered || ''}
                      onChange={(e) => setCashTendered(Number(e.target.value))}
                      placeholder="Rp 0"
                      className="flex-1 px-2.5 py-1 bg-white border border-slate-300 rounded-lg text-xs font-extrabold text-[#051F20] text-right focus:outline-none focus:border-[#235347]"
                    />
                  </div>

                  <div className="flex gap-1.5">
                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={setExactCash}
                      className="flex-1 py-1 rounded-md bg-[#DAF1DE] hover:bg-[#c3e6ca] text-[10px] font-extrabold text-[#163832] transition-colors"
                    >
                      Uang Pas
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={() => addQuickCash(50000)}
                      className="flex-1 py-1 rounded-md bg-white border border-slate-200 hover:border-slate-300 text-[10px] font-bold text-slate-700 transition-colors"
                    >
                      +50rb
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={() => addQuickCash(100000)}
                      className="flex-1 py-1 rounded-md bg-white border border-slate-200 hover:border-slate-300 text-[10px] font-bold text-slate-700 transition-colors"
                    >
                      +100rb
                    </motion.button>
                  </div>

                  {cashTendered >= cartTotal && cartTotal > 0 && (
                    <div className="flex justify-between text-xs pt-1 border-t border-slate-200">
                      <span className="font-bold text-[#235347]">Kembalian:</span>
                      <span className="font-extrabold text-[#235347] font-mono">
                        Rp {changeGiven.toLocaleString('id-ID')}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Buttons: "Clear Cart" and "Pay Rp..." */}
        <div className="grid grid-cols-12 gap-2">
          <motion.button
            whileHover={cart.length > 0 ? { scale: 1.02 } : undefined}
            whileTap={cart.length > 0 ? { scale: 0.98 } : undefined}
            type="button"
            onClick={clearCart}
            disabled={cart.length === 0}
            className="col-span-4 py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors disabled:opacity-40"
          >
            Clear Cart
          </motion.button>

          <motion.button
            whileHover={cart.length > 0 ? { scale: 1.02 } : undefined}
            whileTap={cart.length > 0 ? { scale: 0.98 } : undefined}
            type="button"
            onClick={() => {
              if (!showPaymentDrawer) {
                setShowPaymentDrawer(true);
              } else {
                handleCheckoutClick();
              }
            }}
            disabled={cart.length === 0 || (showPaymentDrawer && paymentMethod === 'CASH' && cashTendered < cartTotal)}
            className={`col-span-8 py-3 rounded-xl font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm ${
              cart.length === 0
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                : 'bg-[#235347] hover:bg-[#163832] text-white'
            }`}
          >
            <span>{showPaymentDrawer ? 'Bayar & Cetak Struk' : `Pay Rp ${cartTotal.toLocaleString('id-ID')}`}</span>
            <kbd className="px-1.5 py-0.5 bg-black/20 rounded text-[9px] font-mono text-white/90">
              Enter
            </kbd>
          </motion.button>
        </div>
      </div>
    </aside>
  );
}
