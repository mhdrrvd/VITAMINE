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
  FileText,
  Banknote,
  CreditCard,
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

  const [orderType, setOrderType] = useState<'DINE_IN' | 'PICK_UP' | 'DELIVERY'>('DINE_IN');
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [orderNote, setOrderNote] = useState('');

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
      setTimeout(() => {
        window.print();
      }, 200);
    }
  };

  return (
    <aside className="w-full lg:w-[350px] xl:w-[370px] bg-white border-l border-slate-100 flex flex-col justify-between p-6 select-none shrink-0 min-h-screen sticky top-0 shadow-[-2px_0_12px_rgba(0,0,0,0.02)]">
      {/* 1. Header: "My Order" & Close/Clear button */}
      <div>
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <h2 className="font-extrabold text-xl text-slate-900 font-display tracking-tight">
            My Order
          </h2>

          {cart.length > 0 && (
            <button
              type="button"
              onClick={clearCart}
              className="w-8 h-8 rounded-full border border-slate-200 hover:border-rose-300 text-slate-400 hover:text-rose-500 flex items-center justify-center transition-colors"
              title="Clear Order"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* 2. Order Type Switcher: Dine, Pick Up, Delivery */}
        <div className="flex items-center gap-2 mt-4">
          <button
            type="button"
            onClick={() => setOrderType('DINE_IN')}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all ${
              orderType === 'DINE_IN'
                ? 'bg-[#1A6B51] text-white shadow-xs'
                : 'border border-slate-200 text-slate-500 hover:bg-slate-50'
            }`}
          >
            Dine
          </button>
          <button
            type="button"
            onClick={() => setOrderType('PICK_UP')}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all ${
              orderType === 'PICK_UP'
                ? 'bg-[#1A6B51] text-white shadow-xs'
                : 'border border-slate-200 text-slate-500 hover:bg-slate-50'
            }`}
          >
            Pick Up
          </button>
          <button
            type="button"
            onClick={() => setOrderType('DELIVERY')}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all ${
              orderType === 'DELIVERY'
                ? 'bg-[#1A6B51] text-white shadow-xs'
                : 'border border-slate-200 text-slate-500 hover:bg-slate-50'
            }`}
          >
            Delivery
          </button>
        </div>

        {/* 3. Items List with Stepper [ + 01 - ] */}
        <div className="max-h-[38vh] xl:max-h-[44vh] overflow-y-auto pr-1 mt-4 space-y-3 no-scrollbar">
          {cart.length === 0 ? (
            <div className="py-14 text-center text-slate-400 flex flex-col items-center">
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                className="w-12 h-12 rounded-full bg-[#F8FAF9] flex items-center justify-center mb-2.5 text-slate-300 border border-slate-100"
              >
                <ShoppingBag className="w-5 h-5 stroke-[1.8]" />
              </motion.div>
              <p className="text-xs font-bold text-slate-600">No items selected</p>
              <p className="text-[11px] text-slate-400 mt-1 max-w-[200px]">
                Choose items from the catalog on the left to add to order.
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
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.18 }}
                  className="p-3 rounded-2xl bg-white border border-slate-100 hover:border-slate-200 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex items-center justify-between gap-3 group"
                >
                  {/* Round Cutout Thumbnail */}
                  <div className="relative w-11 h-11 rounded-full overflow-hidden bg-[#F8FAF9] shrink-0 border border-slate-100 shadow-2xs">
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      sizes="44px"
                      className="object-cover"
                    />
                  </div>

                  {/* Title & Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="font-bold text-xs text-slate-900 truncate">
                        {item.name}
                      </h4>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        className="text-slate-300 hover:text-rose-500 transition-colors p-0.5"
                        title="Remove"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>

                    <p className="text-[10px] text-slate-400">
                      {item.options.size === 'LARGE' ? 'Large 22oz' : 'Regular 16oz'}
                      {item.options.sugarLevel !== '100%' && ` &bull; ${item.options.sugarLevel} sugar`}
                    </p>

                    <span className="font-extrabold text-xs text-[#1A6B51] font-mono block mt-0.5">
                      Rp {item.unitPrice.toLocaleString('id-ID')}
                    </span>
                  </div>

                  {/* Stepper capsule: [ +  01  - ] as shown in reference */}
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg border border-slate-200 bg-white shadow-2xs shrink-0">
                    <motion.button
                      whileTap={{ scale: 0.8 }}
                      type="button"
                      onClick={() => updateQuantity(item.id, 1)}
                      className="text-slate-500 hover:text-[#1A6B51] transition-colors"
                      title="Add"
                    >
                      <Plus className="w-3 h-3 stroke-[2.5]" />
                    </motion.button>
                    <span className="font-bold text-xs text-slate-800 w-4 text-center font-mono">
                      {String(item.quantity).padStart(2, '0')}
                    </span>
                    <motion.button
                      whileTap={{ scale: 0.8 }}
                      type="button"
                      onClick={() => updateQuantity(item.id, -1)}
                      className="text-slate-500 hover:text-rose-600 transition-colors"
                      title="Minus"
                    >
                      <Minus className="w-3 h-3 stroke-[2.5]" />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* Add Note Button */}
        <button
          type="button"
          onClick={() => setShowNoteModal(!showNoteModal)}
          className="w-full mt-3 py-1.5 px-3 rounded-lg border border-dashed border-slate-200 hover:border-[#1A6B51] text-slate-400 hover:text-[#1A6B51] text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors"
        >
          <FileText className="w-3 h-3" />
          <span>{orderNote ? `Note: ${orderNote}` : '+ Add Note'}</span>
        </button>

        <AnimatePresence>
          {showNoteModal && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2 p-2 bg-[#F8FAF9] rounded-xl border border-slate-200 overflow-hidden"
            >
              <input
                type="text"
                value={orderNote}
                onChange={(e) => setOrderNote(e.target.value)}
                placeholder="Order note (e.g. separate ice)..."
                className="w-full bg-white p-2 rounded-lg text-xs border border-slate-200 focus:outline-none focus:border-[#1A6B51]"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 4. Bottom Financials & Payments */}
      <div className="pt-4 border-t border-slate-100 space-y-4">
        {/* Items & Total Breakdown */}
        <div className="space-y-1.5 text-xs">
          <div className="flex justify-between text-slate-500">
            <span>Items</span>
            <span className="font-bold text-[#1A6B51] font-mono">
              Rp {cartTotal.toLocaleString('id-ID')}
            </span>
          </div>

          <div className="flex justify-between text-slate-500">
            <span>Discount</span>
            <span className="font-semibold text-rose-500 font-mono">
              -Rp 0
            </span>
          </div>

          <div className="flex justify-between items-baseline pt-2 border-t border-slate-100">
            <span className="font-bold text-sm text-slate-900">Total Amount</span>
            <span className="font-black text-xl text-[#1A6B51] font-mono">
              Rp {cartTotal.toLocaleString('id-ID')}
            </span>
          </div>
        </div>

        {/* Payments Section */}
        <div>
          <h4 className="text-xs font-bold text-slate-800 tracking-wide mb-2">
            Payments
          </h4>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setPaymentMethod('CASH')}
              className={`py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                paymentMethod === 'CASH'
                  ? 'bg-[#1E293B] text-white shadow-xs'
                  : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Banknote className="w-3.5 h-3.5" />
              <span>Cash</span>
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod('QRIS_STATIC')}
              className={`py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                paymentMethod === 'QRIS_STATIC'
                  ? 'bg-[#1E293B] text-white shadow-xs'
                  : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>QRIS</span>
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod('QRIS_STATIC')}
              className="py-2 rounded-lg text-xs font-bold border border-slate-200 text-slate-500 hover:bg-slate-50 flex items-center justify-center gap-1"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Debit</span>
            </button>
          </div>

          {/* Quick Cash Options if Cash selected */}
          {paymentMethod === 'CASH' && (
            <div className="mt-3 p-2.5 rounded-xl bg-[#F8FAF9] border border-slate-200/80 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-slate-600">Diterima:</span>
                <input
                  id="cash-tendered-input"
                  type="number"
                  value={cashTendered || ''}
                  onChange={(e) => setCashTendered(Number(e.target.value))}
                  placeholder="Rp 0"
                  className="flex-1 px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs font-extrabold text-slate-900 text-right focus:outline-none focus:border-[#1A6B51]"
                />
              </div>

              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={setExactCash}
                  className="flex-1 py-1 rounded-md bg-[#EAF5EF] hover:bg-[#d5ebd8] text-[10px] font-bold text-[#1A6B51]"
                >
                  Uang Pas
                </button>
                <button
                  type="button"
                  onClick={() => addQuickCash(50000)}
                  className="flex-1 py-1 rounded-md bg-white border border-slate-200 text-[10px] font-bold text-slate-700"
                >
                  +50k
                </button>
                <button
                  type="button"
                  onClick={() => addQuickCash(100000)}
                  className="flex-1 py-1 rounded-md bg-white border border-slate-200 text-[10px] font-bold text-slate-700"
                >
                  +100k
                </button>
              </div>

              {cashTendered >= cartTotal && cartTotal > 0 && (
                <div className="flex justify-between text-xs pt-1 border-t border-slate-200 font-bold text-[#1A6B51]">
                  <span>Kembalian:</span>
                  <span className="font-mono">Rp {changeGiven.toLocaleString('id-ID')}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Big Checkout CTA Button */}
        <motion.button
          whileHover={cart.length > 0 ? { scale: 1.015 } : undefined}
          whileTap={cart.length > 0 ? { scale: 0.985 } : undefined}
          type="button"
          onClick={handleCheckoutClick}
          disabled={cart.length === 0 || (paymentMethod === 'CASH' && cashTendered < cartTotal)}
          className={`w-full py-3.5 rounded-xl font-extrabold text-sm flex items-center justify-center gap-2 transition-all shadow-md ${
            cart.length === 0 || (paymentMethod === 'CASH' && cashTendered < cartTotal)
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
              : 'bg-[#1A6B51] hover:bg-[#14533F] text-white shadow-[#1A6B51]/20 hover:shadow-lg'
          }`}
        >
          <span>Checkout</span>
          <kbd className="px-1.5 py-0.5 bg-black/20 rounded text-[10px] font-mono text-white/90">
            Enter
          </kbd>
        </motion.button>
      </div>
    </aside>
  );
}
