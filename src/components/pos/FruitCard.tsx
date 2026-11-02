'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Product } from '@/types';
import { usePos } from '@/context/PosContext';
import { Plus } from 'lucide-react';

interface FruitCardProps {
  product: Product;
}

export function FruitCard({ product }: FruitCardProps) {
  const { getCupCapacity, setSelectedProductForModifier } = usePos();
  const capacity = getCupCapacity(product);
  const isOutOfStock = capacity <= 0;

  return (
    <motion.div
      whileHover={!isOutOfStock ? { y: -4, transition: { duration: 0.2, ease: 'easeOut' } } : undefined}
      whileTap={!isOutOfStock ? { scale: 0.98 } : undefined}
      onClick={() => {
        if (!isOutOfStock) {
          setSelectedProductForModifier(product);
        }
      }}
      className={`group relative flex flex-col justify-between p-3 sm:p-3.5 rounded-2xl bg-white border select-none transition-all duration-200 ${
        isOutOfStock
          ? 'opacity-50 border-slate-200 bg-slate-50/70 cursor-not-allowed grayscale'
          : 'border-slate-200/80 hover:border-[#8EB69B] hover:shadow-md hover:shadow-[#235347]/5 cursor-pointer'
      }`}
    >
      {/* 1. Image Container (Clean minimalist rounded frame) */}
      <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-[#F4F7F5] mb-2.5 flex items-center justify-center">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300 ease-out"
        />

        {/* Live Stock Badge */}
        <div className="absolute top-2 right-2">
          {isOutOfStock ? (
            <span className="px-2 py-0.5 rounded-md bg-rose-600 text-white text-[10px] font-bold shadow-xs">
              HABIS
            </span>
          ) : capacity <= 3 ? (
            <span className="px-2 py-0.5 rounded-md bg-amber-500 text-white text-[10px] font-bold shadow-xs animate-pulse">
              Sisa {capacity}
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-md bg-[#DAF1DE]/95 backdrop-blur-xs text-[#235347] text-[10px] font-bold tracking-tight border border-[#8EB69B]/30 shadow-2xs">
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
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100/90">
          <span className="font-extrabold text-[#051F20] text-xs sm:text-sm font-mono tracking-tight">
            Rp {product.basePrice.toLocaleString('id-ID')}
          </span>

          <motion.button
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.85 }}
            type="button"
            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
              isOutOfStock
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-[#235347] text-white group-hover:bg-[#163832] shadow-2xs'
            }`}
            aria-label={`Tambah ${product.name}`}
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
