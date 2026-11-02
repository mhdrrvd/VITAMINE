'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Product } from '@/types';
import { usePos } from '@/context/PosContext';
import { Heart, Clock } from 'lucide-react';

interface FruitCardProps {
  product: Product;
}

export function FruitCard({ product }: FruitCardProps) {
  const { getCupCapacity, setSelectedProductForModifier } = usePos();
  const [isLiked, setIsLiked] = useState(false);

  const capacity = getCupCapacity(product);
  const isOutOfStock = capacity <= 0;

  return (
    <div
      className={`relative flex flex-col justify-between pt-16 pb-5 px-5 rounded-3xl bg-white border transition-colors duration-300 select-none ${
        isOutOfStock
          ? 'opacity-60 border-slate-200 bg-slate-50/70 cursor-not-allowed grayscale'
          : 'border-slate-100 hover:border-[#8EB69B]/60 shadow-[0_4px_24px_rgba(0,0,0,0.04)] hover:shadow-lg hover:shadow-[#1A6B51]/8 cursor-pointer'
      }`}
      onClick={() => {
        if (!isOutOfStock) {
          setSelectedProductForModifier(product);
        }
      }}
    >
      {/* 1. Floating Top Circular Product Dish/Cup Image (Exact reference layout) */}
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 sm:w-26 sm:h-26 rounded-full overflow-hidden bg-white border-4 border-white shadow-[0_6px_20px_rgba(0,0,0,0.08)] flex items-center justify-center p-1 z-10">
        <div className="relative w-full h-full rounded-full overflow-hidden bg-[#F4F7F5]">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover"
          />
        </div>
      </div>

      {/* 2. Top Right: Favorite Heart Icon */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsLiked(!isLiked);
        }}
        className="absolute top-4 right-4 text-slate-300 hover:text-rose-500 transition-colors p-1 z-10"
        aria-label="Favorite"
      >
        <Heart
          className={`w-4 h-4 transition-transform ${
            isLiked ? 'fill-rose-500 text-rose-500 scale-110' : 'text-slate-300'
          }`}
        />
      </button>

      {/* 3. Top Left: Stock Status Alert Badge */}
      {isOutOfStock ? (
        <span className="absolute top-4 left-4 px-2 py-0.5 rounded-md bg-rose-500 text-white text-[10px] font-bold z-10">
          HABIS
        </span>
      ) : capacity <= 3 ? (
        <span className="absolute top-4 left-4 px-2 py-0.5 rounded-md bg-amber-500 text-white text-[10px] font-bold animate-pulse z-10">
          Sisa {capacity}
        </span>
      ) : null}

      {/* 4. Center Content: Product Title & Preparation Time Row */}
      <div>
        <div className="flex items-center justify-between gap-2 mt-1">
          <h3 className="font-extrabold text-sm sm:text-base text-slate-900 tracking-tight truncate font-display">
            {product.name}
          </h3>
          <div className="flex items-center gap-1 text-slate-400 shrink-0">
            <Clock className="w-3.5 h-3.5 stroke-[2]" />
            <span className="text-[11px] font-medium font-mono">
              {product.prepTimeMinutes ? `${product.prepTimeMinutes} min` : '2 min'}
            </span>
          </div>
        </div>

        {/* Multi-line Description Text */}
        <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
          {product.description || '100% buah asli segar dipadu gula tebu alami & es kristal murni tanpa pengawet.'}
        </p>
      </div>

      {/* 5. Bottom Row: Price on left & "add to cart +" Button on right (Exact reference) */}
      <div className="flex items-center justify-between mt-5 pt-3.5 border-t border-slate-100">
        <span className="font-extrabold text-sm sm:text-base text-[#1A6B51] font-mono">
          Rp {product.basePrice.toLocaleString('id-ID')}
        </span>

        {/* Button with Shimmer / Hover Mengkilat HANYA pada tombol */}
        <button
          type="button"
          disabled={isOutOfStock}
          onClick={(e) => {
            e.stopPropagation();
            if (!isOutOfStock) {
              setSelectedProductForModifier(product);
            }
          }}
          className={`relative overflow-hidden group/btn px-3.5 py-1.5 rounded-xl font-bold transition-all shadow-xs flex items-center justify-center gap-1 select-none ${
            isOutOfStock
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
              : 'bg-gradient-to-r from-[#1A6B51] via-[#207c5e] to-[#1A6B51] hover:brightness-110 text-white shadow-sm shadow-[#1A6B51]/20 hover:shadow-md hover:shadow-[#1A6B51]/30 active:scale-95'
          }`}
          title={isOutOfStock ? 'Bahan baku habis' : 'Tambah ke pesanan'}
        >
          {/* Shimmer / Efek Mengkilat HANYA pada tombol saat tombol di-hover */}
          {!isOutOfStock && (
            <span className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 ease-in-out bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none transform -skew-x-12" />
          )}

          {isOutOfStock ? (
            <span className="relative z-10 text-[11px]">Habis</span>
          ) : (
            <span className="relative z-10 flex items-center gap-1 text-xs font-bold">
              <span>add to cart</span>
              <span className="text-sm font-extrabold leading-none">+</span>
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
