'use client';

import React, { useRef, useEffect } from 'react';
import { usePos } from '@/context/PosContext';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  CreditCard,
  Banknote,
  QrCode,
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

  const cashInputRef = useRef<HTMLInputElement>(null);

  // Quick preset add cash
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
      // Trigger native browser print fallback if desired
      setTimeout(() => {
        window.print();
      }, 200);
    }
  };

  return (
    <aside className="w-full lg:w-96 xl:w-[420px] bg-white border-l border-slate-200 flex flex-col h-[calc(100vh-4rem)] sticky top-16 shadow-drawer select-none">
      {/* Cart Header */}
      <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
            <ShoppingBag className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-extrabold text-slate-900 text-sm">Keranjang Pesanan</h2>
            <span className="text-xs text-slate-500 font-medium">{cart.length} Jenis Menu</span>
          </div>
        </div>

        {cart.length > 0 && (
          <button
            type="button"
            onClick={clearCart}
            className="text-xs font-semibold text-rose-500 hover:text-rose-700 flex items-center gap-1 hover:underline transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Kosongkan</span>
          </button>
        )}
      </div>

      {/* Cart Items List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {cart.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-3">
              <ShoppingBag className="w-8 h-8 text-slate-300 stroke-[1.5]" />
            </div>
            <p className="font-bold text-slate-700 text-sm mb-1">Keranjang Masih Kosong</p>
            <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
              Klik salah satu kartu buah di katalog atau tekan <kbd className="px-1 py-0.5 bg-slate-200 rounded text-[10px] text-slate-600 font-mono">F2</kbd> untuk mencari menu.
            </p>
          </div>
        ) : (
          cart.map((item) => (
            <div
              key={item.id}
              className="p-3 rounded-xl border border-slate-200 hover:border-slate-300 bg-white flex flex-col gap-2 transition-all"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <h4 className="font-bold text-slate-900 text-sm leading-tight">{item.name}</h4>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {item.options.size === 'LARGE' && (
                      <span className="px-1.5 py-0.2 rounded bg-orange-100 text-orange-700 text-[10px] font-bold">
                        Large
                      </span>
                    )}
                    <span className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 text-[10px] font-medium">
                      Gula: {item.options.sugarLevel}
                    </span>
                    <span className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 text-[10px] font-medium">
                      Es: {item.options.iceLevel === 'NORMAL' ? 'Normal' : item.options.iceLevel === 'LESS' ? 'Less' : 'No Ice'}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => removeFromCart(item.id)}
                  className="text-slate-400 hover:text-rose-500 p-1 rounded transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, -1)}
                    className="w-7 h-7 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-700 font-bold transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-bold text-slate-900 text-sm w-6 text-center">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, 1)}
                    className="w-7 h-7 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-700 font-bold transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <span className="font-extrabold text-slate-900 text-sm">
                  Rp {item.subtotal.toLocaleString('id-ID')}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Payment & Action Section */}
      <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-4">
        {/* Financial Summary */}
        <div className="space-y-1.5 text-xs text-slate-600">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="font-semibold text-slate-900">
              Rp {cartTotal.toLocaleString('id-ID')}
            </span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Pajak PB1 (Net Final)</span>
            <span>Rp 0</span>
          </div>
          <div className="flex justify-between items-baseline pt-2 border-t border-slate-200 text-slate-900">
            <span className="font-extrabold text-sm uppercase">Total Pembayaran</span>
            <span className="font-extrabold text-2xl text-orange-600 font-display">
              Rp {cartTotal.toLocaleString('id-ID')}
            </span>
          </div>
        </div>

        {/* Payment Method Selector (F8 / F9) */}
        <div>
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
            Metode Pembayaran
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setPaymentMethod('CASH')}
              className={`py-2 px-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                paymentMethod === 'CASH'
                  ? 'border-orange-500 bg-orange-50 text-orange-600 ring-2 ring-orange-500/20'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Banknote className="w-4 h-4" />
              <span>Tunai</span>
              <kbd className="text-[9px] opacity-70">F8</kbd>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('QRIS_STATIC')}
              className={`py-2 px-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                paymentMethod === 'QRIS_STATIC'
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700 ring-2 ring-emerald-500/20'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-100'
              }`}
            >
              <QrCode className="w-4 h-4" />
              <span>QRIS Statis</span>
              <kbd className="text-[9px] opacity-70">F9</kbd>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('TRANSFER')}
              className={`py-2 px-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                paymentMethod === 'TRANSFER'
                  ? 'border-blue-500 bg-blue-50 text-blue-600 ring-2 ring-blue-500/20'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-100'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>Transfer</span>
              <span className="text-[9px] opacity-70">BCA</span>
            </button>
          </div>
        </div>

        {/* Cash Tendered Input & Change Box */}
        {paymentMethod === 'CASH' && (
          <div className="space-y-2 pt-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700">Diterima:</span>
              <div className="relative flex-1">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                  Rp
                </span>
                <input
                  ref={cashInputRef}
                  id="cash-tendered-input"
                  type="number"
                  value={cashTendered || ''}
                  onChange={(e) => setCashTendered(Number(e.target.value))}
                  placeholder="0"
                  className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-300 focus:border-orange-500 rounded-xl text-sm font-extrabold text-slate-900 focus:outline-none"
                />
              </div>
            </div>

            {/* Quick cash chip buttons */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                type="button"
                onClick={setExactCash}
                className="px-2 py-1 rounded-lg bg-slate-200 hover:bg-slate-300 text-[11px] font-bold text-slate-700 transition-colors"
              >
                Uang Pas
              </button>
              <button
                type="button"
                onClick={() => addQuickCash(10000)}
                className="px-2 py-1 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-[11px] font-semibold text-slate-700"
              >
                +10rb
              </button>
              <button
                type="button"
                onClick={() => addQuickCash(20000)}
                className="px-2 py-1 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-[11px] font-semibold text-slate-700"
              >
                +20rb
              </button>
              <button
                type="button"
                onClick={() => addQuickCash(50000)}
                className="px-2 py-1 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-[11px] font-semibold text-slate-700"
              >
                +50rb
              </button>
              <button
                type="button"
                onClick={() => addQuickCash(100000)}
                className="px-2 py-1 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-[11px] font-semibold text-slate-700"
              >
                +100rb
              </button>
            </div>

            {/* Change Given Display */}
            {cashTendered >= cartTotal && cartTotal > 0 && (
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-800">Kembalian:</span>
                <span className="font-extrabold text-base text-emerald-700">
                  Rp {changeGiven.toLocaleString('id-ID')}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Big Primary Action: Bayar & Cetak Struk */}
        <button
          type="button"
          onClick={handleCheckoutClick}
          disabled={cart.length === 0 || (paymentMethod === 'CASH' && cashTendered < cartTotal)}
          className={`w-full py-3.5 px-4 rounded-2xl font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg transition-all ${
            cart.length === 0 || (paymentMethod === 'CASH' && cashTendered < cartTotal)
              ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
              : 'bg-orange-500 hover:bg-orange-600 text-white shadow-glow-citrus active:scale-[0.98]'
          }`}
        >
          <Printer className="w-5 h-5 stroke-[2.5]" />
          <span>BAYAR & CETAK STRUK</span>
          <kbd className="px-1.5 py-0.5 bg-black/20 rounded text-[10px] font-mono">Enter</kbd>
        </button>

        <p className="text-[10px] text-center text-slate-400 font-medium">
          Struk 58mm langsung tercetak & transaksi terkunci final (No-Void).
        </p>
      </div>
    </aside>
  );
}
