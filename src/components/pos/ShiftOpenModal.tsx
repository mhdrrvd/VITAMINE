'use client';

import React, { useState } from 'react';
import { usePos } from '@/context/PosContext';
import { Lock, Play, Sparkles } from 'lucide-react';

export function ShiftOpenModal() {
  const { currentShift, openShift, currentUser } = usePos();
  const [startingCash, setStartingCash] = useState<number>(200000);

  if (currentShift && currentShift.status === 'OPEN') return null;

  const handleOpen = () => {
    if (startingCash < 0) {
      alert('Modal kas awal tidak valid!');
      return;
    }
    openShift(startingCash);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#051F20]/80 backdrop-blur-md animate-in fade-in duration-200 select-none">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-modal border border-slate-200 overflow-hidden p-6 sm:p-8 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-[#DAF1DE] text-[#235347] flex items-center justify-center mx-auto shadow-xs">
          <Lock className="w-8 h-8 stroke-[2.5]" />
        </div>

        <div>
          <h2 className="text-2xl font-extrabold text-[#051F20] font-display">
            Buka Shift Kasir Baru
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Silakan masukkan modal kas awal di laci sebelum membuka terminal kasir.
          </p>
        </div>

        <div className="bg-[#F4F7F5] p-4 rounded-2xl border border-slate-200 text-left space-y-2">
          <div className="flex justify-between text-xs text-slate-500 font-medium">
            <span>Petugas Kasir:</span>
            <span className="font-bold text-[#051F20]">{currentUser.name}</span>
          </div>
          <div className="flex justify-between text-xs text-slate-500 font-medium">
            <span>Waktu Buka:</span>
            <span className="font-bold text-[#051F20]">
              {new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
            </span>
          </div>

          <div className="pt-2">
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Nominal Kas Awal di Laci:
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                Rp
              </span>
              <input
                type="number"
                value={startingCash}
                onChange={(e) => setStartingCash(Number(e.target.value))}
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 focus:border-[#235347] rounded-xl text-base font-extrabold text-[#051F20] focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          {[100000, 200000, 300000].map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => setStartingCash(preset)}
              className="flex-1 py-1.5 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-bold text-slate-700 transition-colors"
            >
              Rp {(preset / 1000).toLocaleString('id-ID')}rb
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={handleOpen}
          className="w-full py-3.5 px-4 rounded-2xl bg-[#235347] hover:bg-[#163832] text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>MULAI BUKA SHIFT & MASUK POS</span>
        </button>
      </div>
    </div>
  );
}
