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
      className={`group relative flex flex-col justify-between p-3 rounded-2xl bg-white border transition-all duration-200 select-none ${
        isOutOfStock
          ? 'opacity-60 border-slate-200 bg-slate-50 cursor-not-allowed grayscale'
          : 'border-slate-200 hover:border-orange-500 hover:shadow-lg hover:-translate-y-1 cursor-pointer active:scale-[0.98]'
      }`}
    >
      {/* Top Media Container */}
      <div className="relative w-full aspect-4/3 rounded-xl overflow-hidden bg-slate-100 mb-3">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Status Badge */}
        <div className="absolute top-2 right-2">
          {isOutOfStock ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-600 text-white text-[11px] font-bold shadow-sm tracking-wide">
              <AlertCircle className="w-3 h-3" />
              HABIS
            </span>
          ) : capacity <= 3 ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500 text-white text-[11px] font-bold shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
              Sisa {capacity} Cup
            </span>
          ) : (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-500/90 text-white text-[11px] font-semibold backdrop-blur-xs">
              {capacity} Cup
            </span>
          )}
        </div>

        {/* Category Chip */}
        {product.category === 'VITAMIN_PACKAGE' && (
          <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-purple-600/90 text-white text-[10px] font-extrabold uppercase tracking-wider backdrop-blur-xs">
            Mix Vitamin
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 justify-between">
        <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2 group-hover:text-orange-600 transition-colors">
          {product.name}
        </h3>

        <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100">
          <div>
            <span className="text-[10px] text-slate-400 font-medium block uppercase tracking-wider">
              Harga Nett
            </span>
            <span className="font-extrabold text-orange-600 text-base">
              Rp {product.basePrice.toLocaleString('id-ID')}
            </span>
          </div>

          <div
            className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
              isOutOfStock
                ? 'bg-slate-200 text-slate-400'
                : 'bg-orange-50 text-orange-600 group-hover:bg-orange-500 group-hover:text-white shadow-xs'
            }`}
          >
            <Plus className="w-4 h-4 stroke-[3]" />
          </div>
        </div>
      </div>
    </div>
  );
}

