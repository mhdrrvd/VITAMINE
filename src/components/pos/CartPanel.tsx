'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { usePos } from '@/context/PosContext';
import {
  MoreVertical,
  Plus,
  Minus,
  Trash2,
  FileText,
  Banknote,
  QrCode,
  CreditCard,
  Printer,
  Sparkles,
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
    <div className="w-full lg:w-[380px] xl:w-[410px] bg-white rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between p-5 select-none shrink-0">
      {/* 1. Header */}
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <h3 className="font-extrabold text-lg text-[#051F20] font-display">
              Current Sale
            </h3>
            {cart.length > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-[#DAF1DE] text-[#235347] text-xs font-bold">
                {cart.length} item
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={clearCart}
              disabled={cart.length === 0}
              className="text-slate-400 hover:text-rose-500 p-1.5 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-30"
              title="Clear Cart"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 2. Item Rows List */}
        <div className="max-h-[38vh] xl:max-h-[44vh] overflow-y-auto divide-y divide-slate-100 pr-1 mt-2 space-y-2">
          {cart.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <p className="text-xs font-bold text-slate-600">Belum ada item dipilih</p>
              <p className="text-[11px] text-slate-400 mt-1">
                Klik kartu buah di sebelah kanan untuk menambahkan pesanan.
              </p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="pt-2.5 pb-2 flex items-center justify-between gap-3">
                {/* Thumbnail */}
                <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    sizes="44px"
                    className="object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-xs text-[#051F20] truncate">
                    {item.name}
                  </h4>
                  <div className="flex items-center gap-1 text-[10px] text-slate-400">
                    <span>Rp {item.unitPrice.toLocaleString('id-ID')}</span>
                    {item.options.sugarLevel !== '100%' && (
                      <span className="text-[#235347] font-semibold">&bull; {item.options.sugarLevel} sugar</span>
                    )}
                  </div>
                </div>

                {/* Stepper `[- 1 +]` */}
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg border border-slate-200 bg-[#F4F7F5]">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, -1)}
                    className="text-slate-600 hover:text-[#051F20] transition-colors"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="font-extrabold text-xs text-[#051F20] w-4 text-center font-mono">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, 1)}
                    className="text-slate-600 hover:text-[#051F20] transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                {/* Subtotal */}
                <span className="font-extrabold text-xs text-[#051F20] w-16 text-right font-mono">
                  Rp {item.subtotal.toLocaleString('id-ID')}
                </span>

                {/* Delete */}
                <button
                  type="button"
                  onClick={() => removeFromCart(item.id)}
                  className="text-slate-300 hover:text-rose-500 transition-colors p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Add Note Button */}
        <button
          type="button"
          onClick={() => setShowNoteModal(!showNoteModal)}
          className="w-full mt-3 py-2 px-3 rounded-xl border border-dashed border-slate-300 hover:border-[#235347] text-slate-500 hover:text-[#235347] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>{orderNote ? `Catatan: ${orderNote}` : '+ Add Note'}</span>
        </button>

        {showNoteModal && (
          <div className="mt-2 p-2 bg-[#F4F7F5] rounded-xl border border-slate-200">
            <input
              type="text"
              value={orderNote}
              onChange={(e) => setOrderNote(e.target.value)}
              placeholder="Catatan pesanan (misal: bungkus terpisah)..."
              className="w-full bg-white p-2 rounded-lg text-xs border border-slate-200 focus:outline-none focus:border-[#235347]"
            />
          </div>
        )}
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
        {showPaymentDrawer && (
          <div className="p-3 rounded-xl bg-[#F4F7F5] border border-slate-200 space-y-2.5 animate-in fade-in">
            {/* Payment Mode Pills */}
            <div className="grid grid-cols-2 gap-2 text-xs font-bold">
              <button
                type="button"
                onClick={() => setPaymentMethod('CASH')}
                className={`py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                  paymentMethod === 'CASH'
                    ? 'bg-[#235347] text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200'
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
                    : 'bg-white text-slate-600 border border-slate-200'
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

                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={setExactCash}
                    className="flex-1 py-1 rounded-md bg-[#DAF1DE] hover:bg-[#c3e6ca] text-[10px] font-extrabold text-[#163832]"
                  >
                    Uang Pas
                  </button>
                  <button
                    type="button"
                    onClick={() => addQuickCash(50000)}
                    className="flex-1 py-1 rounded-md bg-white border border-slate-200 text-[10px] font-bold text-slate-700"
                  >
                    +50rb
                  </button>
                  <button
                    type="button"
                    onClick={() => addQuickCash(100000)}
                    className="flex-1 py-1 rounded-md bg-white border border-slate-200 text-[10px] font-bold text-slate-700"
                  >
                    +100rb
                  </button>
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
          </div>
        )}

        {/* Action Buttons: "Clear Cart" and "Pay Rp..." */}
        <div className="grid grid-cols-12 gap-2">
          <button
            type="button"
            onClick={clearCart}
            disabled={cart.length === 0}
            className="col-span-4 py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors disabled:opacity-40"
          >
            Clear Cart
          </button>

          <button
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
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
                : 'bg-[#235347] hover:bg-[#163832] text-white active:scale-98'
            }`}
          >
            <span>{showPaymentDrawer ? 'Bayar & Cetak Struk' : `Pay Rp ${cartTotal.toLocaleString('id-ID')}`}</span>
            <kbd className="px-1.5 py-0.2 bg-black/20 rounded text-[9px] font-mono">
              Enter
            </kbd>
          </button>
        </div>
      </div>
    </div>
  );
}
