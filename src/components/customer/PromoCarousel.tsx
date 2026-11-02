'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { PromoSlide } from '@/types';
import { Sparkles, Tag, ChevronRight, ChevronLeft } from 'lucide-react';

interface PromoCarouselProps {
  promos: PromoSlide[];
  isCompact?: boolean;
}

export function PromoCarousel({ promos, isCompact = false }: PromoCarouselProps) {
  const activePromos = promos.filter((p) => p.isActive);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (activePromos.length <= 1) return;

    const currentSlide = activePromos[currentIndex];
    const duration = (currentSlide?.durationSeconds || 5) * 1000;

    const timer = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % activePromos.length);
    }, duration);

    return () => clearTimeout(timer);
  }, [currentIndex, activePromos]);

  if (activePromos.length === 0) {
    return (
      <div className="w-full h-full bg-slate-900 flex items-center justify-center p-8 text-center text-white">
        <p className="text-xl font-bold">Selamat Datang di VITAMINE</p>
      </div>
    );
  }

  const currentPromo = activePromos[currentIndex];

  if (isCompact) {
    // 40% Mini Carousel for Split Screen
    return (
      <div className="relative w-full h-full rounded-3xl overflow-hidden bg-slate-900 shadow-md flex flex-col justify-between p-6 text-white">
        <Image
          src={currentPromo.imageUrl}
          alt={currentPromo.title}
          fill
          priority
          sizes="40vw"
          className="object-cover opacity-40 transition-opacity duration-700"
        />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500 text-white text-[11px] font-extrabold tracking-wide uppercase shadow-sm mb-3">
            <Tag className="w-3 h-3" />
            Promo Hari Ini
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold leading-snug drop-shadow-sm font-display">
            {currentPromo.title}
          </h3>
        </div>

        <div className="relative z-10 pt-4 border-t border-white/20 flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-200">
            100% Buah Alami &bull; Tanpa Pengawet
          </span>
          <div className="flex gap-1.5">
            {activePromos.map((_, idx) => (
              <span
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentIndex ? 'w-6 bg-orange-500' : 'w-1.5 bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Fullscreen Hero Carousel for Idle State
  return (
    <div className="relative w-full h-full bg-slate-950 overflow-hidden select-none flex flex-col justify-between">
      {/* Background Image Carousel with Crossfade */}
      {activePromos.map((promo, idx) => (
        <div
          key={promo.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            idx === currentIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
          }`}
        >
          <Image
            src={promo.imageUrl}
            alt={promo.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          {/* Ambient Dark Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-black/30" />
          <div className="absolute inset-0 bg-radial from-transparent via-black/20 to-black/60" />
        </div>
      ))}

      {/* Top Header Floating Brand Bar */}
      <header className="relative z-20 px-8 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-orange-500 text-white flex items-center justify-center font-extrabold text-2xl shadow-glow-citrus">
            V
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight drop-shadow-md font-display">
              VITAMINE
            </h1>
            <p className="text-xs text-orange-400 font-bold tracking-widest uppercase">
              Fresh Squeezed Juice Bar
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white/90 text-xs font-semibold">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Outlet Buka &bull; Siap Melayani Anda</span>
        </div>
      </header>

      {/* Center/Bottom Promotional Feature Hero */}
      <div className="relative z-20 p-8 sm:p-14 max-w-4xl space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500 text-white text-xs font-extrabold uppercase tracking-widest shadow-glow-citrus">
          <Sparkles className="w-3.5 h-3.5 fill-white" />
          Spesial Segar Hari Ini
        </div>

        <h2 className="text-4xl sm:text-6xl font-black text-white leading-tight tracking-tight drop-shadow-lg font-display">
          {currentPromo.title}
        </h2>

        <p className="text-base sm:text-xl text-slate-200/90 font-medium max-w-2xl leading-relaxed drop-shadow-sm">
          Dibuat dari 100% buah murni pilihan berkualitas tinggi, gula tebu alami, tanpa perisa sintetis. Segarkan hari dan boost vitamin Anda sekarang!
        </p>

        {/* Carousel Slide Indicators */}
        <div className="pt-6 flex items-center gap-3">
          {activePromos.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentIndex
                  ? 'w-10 bg-orange-500 shadow-glow-citrus'
                  : 'w-2.5 bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Bottom Footer Callout */}
      <footer className="relative z-20 px-8 py-4 bg-black/50 backdrop-blur-md border-t border-white/10 flex items-center justify-between text-xs text-slate-300 font-medium">
        <span>Silakan sebutkan pesanan Anda kepada kasir kami yang ramah.</span>
        <span className="font-mono text-white/80">Menu Baru: Paket Multi-Vitamin VIT-A & VIT-C</span>
      </footer>
    </div>
  );
}

