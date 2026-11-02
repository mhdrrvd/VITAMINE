'use client';

import React from 'react';
import Image from 'next/image';
import { Product } from '@/types';
import { usePos } from '@/context/PosContext';
import { Plus, AlertCircle } from 'lucide-react';

interface FruitCardProps {
  product: Product;
}

export function FruitCard({ product }: FruitCardProps) {
  const { getCupCapacity, setSelectedProductForModifier } = usePos();
  const capacity = getCupCapacity(product);
  const isOutOfStock = capacity <= 0;

  return (
    <div
      onClick={() => {
        if (!isOutOfStock) {
          setSelectedProductForModifier(product);
        }
      }}
      className={`group relative flex flex-col justify-between p-3.5 rounded-2xl bg-white border transition-all duration-200 select-none ${
        isOutOfStock
          ? 'opacity-60 border-slate-200 bg-slate-50 cursor-not-allowed grayscale'
          : 'border-slate-200/80 hover:border-[#8EB69B] hover:shadow-md cursor-pointer active:scale-[0.98]'
      }`}
    >
      {/* 1. Image Container (Clean centered like PosyMart) */}
      <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-[#F4F7F5] mb-2.5 flex items-center justify-center">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Live Stock Badge */}
        <div className="absolute top-2 right-2">
          {isOutOfStock ? (
            <span className="px-2 py-0.5 rounded-md bg-rose-600 text-white text-[10px] font-bold shadow-xs">
              HABIS
            </span>
          ) : capacity <= 3 ? (
            <span className="px-2 py-0.5 rounded-md bg-amber-500 text-white text-[10px] font-bold shadow-xs">
              Sisa {capacity}
            </span>
          ) : (
            <span className="px-1.5 py-0.5 rounded-md bg-[#DAF1DE] text-[#235347] text-[10px] font-bold shadow-2xs">
              {capacity} cup
            </span>
          )}
        </div>
      </div>

      {/* 2. Content */}
      <div className="flex flex-col justify-between flex-1">
        <h4 className="font-bold text-xs sm:text-sm text-[#051F20] line-clamp-1 leading-snug group-hover:text-[#235347] transition-colors">
          {product.name}
        </h4>

        {/* 3. Bottom Row: Price & Green `+` Button */}
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
          <span className="font-extrabold text-[#051F20] text-sm font-mono">
            Rp {product.basePrice.toLocaleString('id-ID')}
          </span>

          <div
            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
              isOutOfStock
                ? 'bg-slate-200 text-slate-400'
                : 'bg-[#235347] text-white group-hover:bg-[#163832] shadow-xs'
            }`}
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          </div>
        </div>
      </div>
    </div>
  );
}
