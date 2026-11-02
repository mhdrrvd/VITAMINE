'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Product } from '@/types';
import { usePos } from '@/context/PosContext';
import { Plus, Heart } from 'lucide-react';

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
      className={`relative flex flex-col justify-between p-3 rounded-2xl bg-white dark:bg-[#0F1E1B] border transition-all duration-300 select-none group ${
        isOutOfStock
          ? 'opacity-60 border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 grayscale cursor-not-allowed'
          : 'border-slate-200/70 dark:border-slate-800 shadow-2xs hover:shadow-md hover:border-[#1A6B51]/30 dark:hover:border-[#00B14F]/30'
      }`}
    >
      {/* 1. Product Image with Square Rounded Container (Exact Reference Layout) */}
      <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-[#F3F6F5] dark:bg-[#1E2926] flex items-center justify-center p-2.5">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          className="object-contain group-hover:scale-105 transition-transform duration-300"
          unoptimized
        />

        {/* Stock Badge if low / habis */}
        {isOutOfStock ? (
          <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-rose-500 text-white text-[9px] font-black z-10 shadow-xs">
            HABIS
          </span>
        ) : capacity <= 3 ? (
          <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-amber-500 text-white text-[9px] font-black animate-pulse z-10 shadow-xs">
            Sisa {capacity}
          </span>
        ) : null}

        {/* Favorite Heart (Optional subtle action) */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsLiked(!isLiked);
          }}
          className="absolute top-2 right-2 p-1 rounded-full bg-white/70 dark:bg-black/30 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Favorite"
        >
          <Heart
            className={`w-3.5 h-3.5 ${
              isLiked ? 'fill-rose-500 text-rose-500' : 'text-slate-400'
            }`}
          />
        </button>
      </div>

      {/* 2. Title */}
      <div className="mt-2.5 mb-2">
        <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate" title={product.name}>
          {product.name}
        </h3>
        <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate mt-0.5">
          {product.description ? product.description.split('.')[0] : 'Jus Buah Segar Alami'}
        </p>
      </div>

      {/* 3. Bottom Row: Price & Add Button */}
      <div className="flex items-center justify-between pt-1">
        <span className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white font-mono">
          Rp {product.basePrice.toLocaleString('id-ID')}
        </span>

        {/* Teal "+" Button (Exact Reference Design) */}
        <button
          type="button"
          disabled={isOutOfStock}
          onClick={(e) => {
            e.stopPropagation();
            if (!isOutOfStock) {
              setSelectedProductForModifier(product);
            }
          }}
          className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all cursor-pointer shadow-2xs ${
            isOutOfStock
              ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
              : 'bg-[#1A6B51] hover:bg-[#14533F] dark:bg-[#00B14F] dark:hover:bg-[#00873C] text-white hover:scale-105 active:scale-95'
          }`}
          title="Tambah ke Pesanan"
        >
          <Plus className="w-4 h-4 stroke-[2.8]" />
        </button>
      </div>
    </div>
  );
}
