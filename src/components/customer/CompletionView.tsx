'use client';

import React, { useEffect, useState } from 'react';
import { Order } from '@/types';
import { CheckCircle2, CupSoda, Heart, Sparkles } from 'lucide-react';

interface CompletionViewProps {
  order: Order;
  onDone: () => void;
}

export function CompletionView({ order, onDone }: CompletionViewProps) {
  const [countdown, setCountdown] = useState(6);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onDone();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onDone]);

  return (
    <div className="w-full h-full bg-slate-950 flex flex-col items-center justify-center p-8 text-center text-white relative overflow-hidden select-none">
      {/* Ambient background glows */}
      <div className="absolute w-96 h-96 rounded-full bg-orange-500/15 blur-3xl -top-20 -left-20 pointer-events-none" />
      <div className="absolute w-96 h-96 rounded-full bg-emerald-500/15 blur-3xl -bottom-20 -right-20 pointer-events-none" />

      <div className="relative z-10 max-w-xl w-full bg-slate-900/90 border border-white/10 rounded-3xl p-8 sm:p-12 shadow-2xl backdrop-blur-md space-y-6">
        <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-glow-citrus">
          <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
        </div>

        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30 text-xs font-extrabold uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Pembayaran Berhasil
          </span>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight font-display text-white">
            Terima Kasih!
          </h2>
          <p className="text-slate-300 text-sm sm:text-base mt-2">
            Pesanan jus segar Anda sedang diracik dengan penuh cinta & kehigienisan oleh barista kami.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-left space-y-2 font-mono text-xs text-slate-300">
          <div className="flex justify-between">
            <span>Nomor Pesanan:</span>
            <span className="font-bold text-orange-400">{order.orderNumber}</span>
          </div>
          <div className="flex justify-between">
            <span>Total Bayar:</span>
            <span className="font-bold text-white">
              Rp {order.totalAmount.toLocaleString('id-ID')}
            </span>
          </div>
          {order.paymentMethod === 'CASH' && order.changeGiven !== undefined && order.changeGiven > 0 && (
            <div className="flex justify-between text-emerald-400 font-bold pt-1 border-t border-white/10">
              <span>Kembalian Anda:</span>
              <span>Rp {order.changeGiven.toLocaleString('id-ID')}</span>
            </div>
          )}
        </div>

        <div className="pt-2 flex items-center justify-center gap-2 text-xs text-slate-400">
          <CupSoda className="w-4 h-4 text-orange-400" />
          <span>Selamat menikmati vitamin alami Anda! ({countdown}s)</span>
        </div>
      </div>
    </div>
  );
}

