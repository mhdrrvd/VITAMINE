'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { usePos } from '@/context/PosContext';
import { OrderType, DeliveryPlatform } from '@/types';
import {
  Plus,
  Minus,
  Trash2,
  X,
  FileText,
  Banknote,
  QrCode,
  ShoppingBag,
  Bike,
  Store,
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

  // Order Type: Only Pick Up & Delivery (GoFood / GrabFood)
  const [orderType, setOrderType] = useState<OrderType>('PICK_UP');
  const [deliveryPlatform, setDeliveryPlatform] = useState<DeliveryPlatform>('GOFOOD');
  const [deliveryRefNumber, setDeliveryRefNumber] = useState('');

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
    const order = await processCheckout({
      orderType,
      deliveryPlatform: orderType === 'DELIVERY' ? deliveryPlatform : undefined,
      deliveryRefNumber: orderType === 'DELIVERY' && deliveryRefNumber ? deliveryRefNumber : undefined,
    });
    if (order) {
      setTimeout(() => {
        window.print();
      }, 200);
    }
  };

  return (
    <aside className="w-full lg:w-[350px] xl:w-[370px] bg-white border-l border-slate-100 flex flex-col justify-between p-6 select-none shrink-0 h-screen overflow-hidden sticky top-0 z-30 shadow-[-2px_0_12px_rgba(0,0,0,0.02)]">
      {/* 1. Header: "My Order" & Close/Clear button */}
      <div>
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
          <div>
            <h2 className="font-extrabold text-xl text-slate-900 font-display tracking-tight">
              My Order
            </h2>
            <span className="text-[11px] text-slate-400 font-medium">
              {cart.length > 0 ? `${cart.length} item dipilih` : 'Belum ada pesanan'}
            </span>
          </div>

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

        {/* 2. Order Type Switcher: Only Pick Up & Delivery (GoFood / GrabFood) */}
        <div className="mt-3.5 space-y-2">
          <div className="grid grid-cols-2 gap-2 w-full">
            <button
              type="button"
              onClick={() => setOrderType('PICK_UP')}
              className={`w-full h-10 px-3 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-2 ${
                orderType === 'PICK_UP'
                  ? 'bg-[#1A6B51] border-[#1A6B51] text-white shadow-xs'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Store className="w-4 h-4 shrink-0" />
              <span>Pick Up</span>
            </button>

            <button
              type="button"
              onClick={() => setOrderType('DELIVERY')}
              className={`w-full h-10 px-3 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-2 ${
                orderType === 'DELIVERY'
                  ? 'bg-[#1A6B51] border-[#1A6B51] text-white shadow-xs'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Bike className="w-4 h-4 shrink-0" />
              <span>Delivery</span>
            </button>
          </div>

          {/* Sub-selector for Delivery Platform (GoFood / GrabFood / ShopeeFood) */}
          <AnimatePresence>
            {orderType === 'DELIVERY' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="p-2.5 rounded-xl bg-[#F8FAF9] border border-slate-200/80 space-y-2 overflow-hidden"
              >
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
                  <span>Platform Aplikasi:</span>
                </div>

                <div className="grid grid-cols-3 gap-1.5">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    type="button"
                    onClick={() => setDeliveryPlatform('GOFOOD')}
                    className={`py-1.5 px-2 rounded-lg text-[10px] font-bold transition-all border ${deliveryPlatform === 'GOFOOD'
                      ? 'bg-[#005C2B] text-white border-[#005C2B] shadow-xs'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-[#005C2B]/10 hover:border-[#005C2B] hover:text-[#005C2B]'
                      }`}
                  >
                    GoFood
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    type="button"
                    onClick={() => setDeliveryPlatform('GRABFOOD')}
                    className={`py-1.5 px-2 rounded-lg text-[10px] font-bold transition-all border ${deliveryPlatform === 'GRABFOOD'
                      ? 'bg-[#00B14F] text-white border-[#00B14F] shadow-xs'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-[#00B14F]/10 hover:border-[#00B14F] hover:text-[#00B14F]'
                      }`}
                  >
                    GrabFood
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    type="button"
                    onClick={() => setDeliveryPlatform('SHOPEEFOOD')}
                    className={`py-1.5 px-2 rounded-lg text-[10px] font-bold transition-all border ${deliveryPlatform === 'SHOPEEFOOD'
                      ? 'bg-[#EE4D2D] text-white border-[#EE4D2D] shadow-xs'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-[#EE4D2D]/10 hover:border-[#EE4D2D] hover:text-[#EE4D2D]'
                      }`}
                  >
                    ShopeeFood
                  </motion.button>
                </div>

                <input
                  type="text"
                  value={deliveryRefNumber}
                  onChange={(e) => setDeliveryRefNumber(e.target.value)}
                  placeholder={`No. Pesanan ${deliveryPlatform === 'GOFOOD' ? 'GoFood (e.g. GF-4829)' : deliveryPlatform === 'GRABFOOD' ? 'GrabFood (e.g. GR-2810)' : 'ShopeeFood (e.g. SF-9021)'}...`}
                  className={`w-full bg-white px-2.5 py-1.5 rounded-lg text-xs border border-slate-200 focus:outline-none transition-colors ${deliveryPlatform === 'GOFOOD'
                    ? 'focus:border-[#005C2B]'
                    : deliveryPlatform === 'GRABFOOD'
                      ? 'focus:border-[#00B14F]'
                      : 'focus:border-[#EE4D2D]'
                    }`}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 3. Items List with Stepper [ + 01 - ] */}
        <div className="max-h-[36vh] xl:max-h-[42vh] overflow-y-auto pr-1 mt-3 space-y-2.5 no-scrollbar">
          {cart.length === 0 ? (
            <div className="py-12 text-center text-slate-400 flex flex-col items-center">
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                className="w-12 h-12 rounded-full bg-[#F8FAF9] flex items-center justify-center mb-2.5 text-slate-300 border border-slate-100"
              >
                <ShoppingBag className="w-5 h-5 stroke-[1.8]" />
              </motion.div>
              <p className="text-xs font-bold text-slate-600">No items selected</p>
              <p className="text-[11px] text-slate-400 mt-1 max-w-[200px]">
                Pilih menu jus di sebelah kiri untuk menambahkan pesanan.
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
                placeholder="Catatan pesanan (misal: pisahkan es)..."
                className="w-full bg-white p-2 rounded-lg text-xs border border-slate-200 focus:outline-none focus:border-[#1A6B51]"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 4. Bottom Financials & Payments */}
      <div className="pt-3.5 border-t border-slate-100 space-y-3.5">
        {/* Items & Total Breakdown */}
        <div className="space-y-1 text-xs">
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

          <div className="flex justify-between items-baseline pt-1.5 border-t border-slate-100">
            <span className="font-bold text-sm text-slate-900">Total Amount</span>
            <span className="font-black text-xl text-[#1A6B51] font-mono">
              Rp {cartTotal.toLocaleString('id-ID')}
            </span>
          </div>
        </div>

        {/* Payments Section: Cash (Hijau Muda) and QRIS (Merah) */}
        <div>
          <h4 className="text-xs font-bold text-slate-800 tracking-wide mb-2">
            Payments
          </h4>
          <div className="grid grid-cols-2 gap-2 w-full">
            <button
              type="button"
              onClick={() => setPaymentMethod('CASH')}
              className={`w-full h-10 px-3 rounded-xl text-xs font-bold transition-all duration-300 ease-out border flex items-center justify-center gap-2 cursor-pointer ${
                paymentMethod === 'CASH'
                  ? 'bg-[#00B14F] border-[#00B14F] text-white shadow-xs shadow-[#00B14F]/25'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-[#00B14F] hover:text-[#00B14F] hover:bg-[#00B14F]/5'
              }`}
            >
              <Banknote className="w-4 h-4 shrink-0" />
              <span>Cash (F8)</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('QRIS_STATIC')}
              className={`w-full h-10 px-3 rounded-xl text-xs font-bold transition-all duration-300 ease-out border flex items-center justify-center gap-2 cursor-pointer ${
                paymentMethod === 'QRIS_STATIC'
                  ? 'bg-[#D8232A] border-[#D8232A] text-white shadow-xs shadow-[#D8232A]/25'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-[#D8232A] hover:text-[#D8232A] hover:bg-[#D8232A]/5'
              }`}
            >
              <QrCode className="w-4 h-4 shrink-0" />
              <span>QRIS (F9)</span>
            </button>
          </div>

          {/* If Cash selected */}
          {paymentMethod === 'CASH' && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2.5 p-2.5 rounded-xl bg-[#00B14F]/5 border border-[#00B14F]/30 space-y-2"
            >
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-slate-600">Diterima:</span>
                <input
                  id="cash-tendered-input"
                  type="number"
                  value={cashTendered || ''}
                  onChange={(e) => setCashTendered(Number(e.target.value))}
                  placeholder="Rp 0"
                  className="flex-1 px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs font-extrabold text-slate-900 text-right focus:outline-none focus:border-[#00B14F]"
                />
              </div>

              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={setExactCash}
                  className="flex-1 py-1 rounded-md bg-[#00B14F]/15 hover:bg-[#00B14F]/25 text-[10px] font-bold text-[#00873C] transition-colors"
                >
                  Uang Pas
                </button>
                <button
                  type="button"
                  onClick={() => addQuickCash(50000)}
                  className="flex-1 py-1 rounded-md bg-white border border-slate-200 hover:bg-slate-50 text-[10px] font-bold text-slate-700 transition-colors"
                >
                  +50k
                </button>
                <button
                  type="button"
                  onClick={() => addQuickCash(100000)}
                  className="flex-1 py-1 rounded-md bg-white border border-slate-200 hover:bg-slate-50 text-[10px] font-bold text-slate-700 transition-colors"
                >
                  +100k
                </button>
              </div>

              {cashTendered >= cartTotal && cartTotal > 0 && (
                <div className="flex justify-between text-xs pt-1 border-t border-[#00B14F]/20 font-bold text-[#00873C]">
                  <span>Kembalian:</span>
                  <span className="font-mono">Rp {changeGiven.toLocaleString('id-ID')}</span>
                </div>
              )}
            </motion.div>
          )}

          {/* If QRIS selected */}
          {paymentMethod === 'QRIS_STATIC' && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2.5 p-2.5 rounded-xl bg-[#D8232A]/5 border border-[#D8232A]/30 flex items-center gap-2.5"
            >
              <div className="w-8 h-8 rounded-lg bg-[#D8232A] text-white flex items-center justify-center shrink-0 shadow-xs">
                <QrCode className="w-4 h-4" />
              </div>
              <div className="text-[11px] leading-tight text-slate-700">
                <p className="font-bold text-[#D8232A]">QRIS Standar Indonesia</p>
                <span className="text-slate-500">Scan barcode QRIS statis di meja kasir</span>
              </div>
            </motion.div>
          )}
        </div>

        {/* Big Checkout CTA Button */}
        <motion.button
          whileHover={cart.length > 0 ? { scale: 1.015 } : undefined}
          whileTap={cart.length > 0 ? { scale: 0.985 } : undefined}
          type="button"
          onClick={handleCheckoutClick}
          disabled={cart.length === 0 || (paymentMethod === 'CASH' && cashTendered < cartTotal)}
          className={`w-full py-3.5 rounded-xl font-extrabold text-sm flex items-center justify-center gap-2 transition-all shadow-md ${cart.length === 0 || (paymentMethod === 'CASH' && cashTendered < cartTotal)
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
