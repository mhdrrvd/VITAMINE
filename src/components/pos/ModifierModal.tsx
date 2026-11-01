'use client';

import React, { useState, useEffect } from 'react';
import { usePos } from '@/context/PosContext';
import { CustomOptions } from '@/types';
import { X, Check, CupSoda, Flame, Snowflake } from 'lucide-react';

export function ModifierModal() {
  const {
    selectedProductForModifier,
    setSelectedProductForModifier,
    addToCart,
  } = usePos();

  const [size, setSize] = useState<'REGULAR' | 'LARGE'>('REGULAR');
  const [sugarLevel, setSugarLevel] = useState<'100%' | '50%' | '0%'>('100%');
  const [iceLevel, setIceLevel] = useState<'NORMAL' | 'LESS' | 'NO_ICE'>('NORMAL');

  // Reset choices on open
  useEffect(() => {
    if (selectedProductForModifier) {
      setSize('REGULAR');
      setSugarLevel('100%');
      setIceLevel('NORMAL');
    }
  }, [selectedProductForModifier]);

  // Keyboard shortcut: Enter to confirm, Esc to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedProductForModifier) return;

      if (e.key === 'Escape') {
        setSelectedProductForModifier(null);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        handleConfirm();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  if (!selectedProductForModifier) return null;

  const handleConfirm = () => {
    const options: CustomOptions = {
      size,
      sugarLevel,
      iceLevel,
    };
    addToCart(selectedProductForModifier, options);
    setSelectedProductForModifier(null);
  };

  const extraPrice = size === 'LARGE' ? 5000 : 0;
  const finalPrice = selectedProductForModifier.basePrice + extraPrice;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-modal border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <h2 className="font-extrabold text-slate-900 text-lg">
              Kustomisasi Racikan Jus
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              {selectedProductForModifier.name}
            </p>
          </div>
          <button
            onClick={() => setSelectedProductForModifier(null)}
            className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-600 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-5">
          {/* 1. Ukuran Cup */}
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
              <CupSoda className="w-3.5 h-3.5 text-orange-500" />
              Ukuran Cup
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSize('REGULAR')}
                className={`px-4 py-2.5 rounded-xl border text-sm font-bold flex flex-col items-center justify-center transition-all ${
                  size === 'REGULAR'
                    ? 'border-orange-500 bg-orange-50 text-orange-600 ring-2 ring-orange-500/20'
                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span>Regular (16 oz)</span>
                <span className="text-[11px] font-medium opacity-80">Standar</span>
              </button>

              <button
                type="button"
                onClick={() => setSize('LARGE')}
                className={`px-4 py-2.5 rounded-xl border text-sm font-bold flex flex-col items-center justify-center transition-all ${
                  size === 'LARGE'
                    ? 'border-orange-500 bg-orange-50 text-orange-600 ring-2 ring-orange-500/20'
                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span>Large (22 oz)</span>
                <span className="text-[11px] font-semibold text-orange-600">+Rp 5.000</span>
              </button>
            </div>
          </div>

          {/* 2. Level Gula Cair */}
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              Tingkat Kemanisan (Gula Cair)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['100%', '50%', '0%'] as const).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setSugarLevel(lvl)}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                    sugarLevel === lvl
                      ? 'border-orange-500 bg-orange-50 text-orange-600 ring-2 ring-orange-500/20'
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {lvl === '100%' ? 'Normal (100%)' : lvl === '50%' ? 'Less (50%)' : 'No Sugar (0%)'}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Level Es */}
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
              <Snowflake className="w-3.5 h-3.5 text-blue-500" />
              Tingkat Dingin (Es Batu)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  { id: 'NORMAL', label: 'Normal Ice' },
                  { id: 'LESS', label: 'Less Ice' },
                  { id: 'NO_ICE', label: 'No Ice' },
                ] as const
              ).map((lvl) => (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => setIceLevel(lvl.id)}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                    iceLevel === lvl.id
                      ? 'border-blue-500 bg-blue-50 text-blue-600 ring-2 ring-blue-500/20'
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {lvl.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Action Bottom */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400 font-medium block">Total Item</span>
            <span className="text-xl font-extrabold text-orange-600">
              Rp {finalPrice.toLocaleString('id-ID')}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSelectedProductForModifier(null)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-xs font-bold text-slate-600 transition-colors"
            >
              Batal (Esc)
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Tambah (Enter)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

