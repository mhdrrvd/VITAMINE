'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Product } from '@/types';
import { usePos } from '@/context/PosContext';
import { Star, Heart, Plus } from 'lucide-react';

interface FruitCardProps {
  product: Product;
}

export function FruitCard({ product }: FruitCardProps) {
  const { getCupCapacity, setSelectedProductForModifier } = usePos();
  const [isLiked, setIsLiked] = useState(false);

  const capacity = getCupCapacity(product);
  const isOutOfStock = capacity <= 0;

  return (
    <motion.div
      whileHover={!isOutOfStock ? { y: -4, transition: { duration: 0.2, ease: 'easeOut' } } : undefined}
      className={`group relative flex flex-col justify-between p-5 rounded-3xl bg-white border transition-all duration-300 select-none ${
        isOutOfStock
          ? 'opacity-60 border-slate-200 bg-slate-50/70 cursor-not-allowed grayscale'
          : 'border-slate-100 hover:border-[#8EB69B]/60 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-md hover:shadow-[#1A6B51]/5 cursor-pointer'
      }`}
      onClick={() => {
        if (!isOutOfStock) {
          setSelectedProductForModifier(product);
        }
      }}
    >
      {/* 1. Top Right: Favorite Heart Icon */}
      <div className="flex items-center justify-between">
        {/* Subtle Stock Tag */}
        {isOutOfStock ? (
          <span className="px-2 py-0.5 rounded-md bg-rose-500 text-white text-[10px] font-bold">
            HABIS
          </span>
        ) : capacity <= 3 ? (
          <span className="px-2 py-0.5 rounded-md bg-amber-500 text-white text-[10px] font-bold animate-pulse">
            Sisa {capacity}
          </span>
        ) : (
          <span className="text-[10px] font-semibold text-slate-400">
            {capacity} cup siap
          </span>
        )}

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsLiked(!isLiked);
          }}
          className="text-slate-300 hover:text-rose-500 transition-colors p-1"
          aria-label="Favorite"
        >
          <Heart
            className={`w-4 h-4 transition-transform ${
              isLiked ? 'fill-rose-500 text-rose-500 scale-110' : ''
            }`}
          />
        </button>
      </div>

      {/* 2. Center: Circular Product Image (Clean isolated presentation) */}
      <div className="relative w-36 h-36 aspect-square rounded-full overflow-hidden bg-[#F8FAF9] mx-auto my-3 flex items-center justify-center p-2 group-hover:scale-105 transition-transform duration-300 ease-out shadow-xs">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover rounded-full"
        />
      </div>

      {/* 3. Product Title & Price Row */}
      <div className="mt-1">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-[#1A6B51] transition-colors truncate">
            {product.name}
          </h3>
          <span className="font-extrabold text-sm sm:text-base text-[#1A6B51] font-mono shrink-0">
            Rp {product.basePrice.toLocaleString('id-ID')}
          </span>
        </div>

        {/* Subtitle / Recipe Description */}
        <p className="text-[11px] text-slate-400 mt-1 line-clamp-1 leading-snug">
          100% Buah Asli &bull; Gula Tebu &bull; Es Kristal
        </p>
      </div>

      {/* 4. Bottom Row: Star Rating & Add to cart button */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
        <div className="flex items-center gap-1">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span className="font-bold text-xs text-slate-700">5.0</span>
        </div>

        <motion.button
          whileHover={!isOutOfStock ? { scale: 1.05 } : undefined}
          whileTap={!isOutOfStock ? { scale: 0.95 } : undefined}
          type="button"
          disabled={isOutOfStock}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs ${
            isOutOfStock
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
              : 'bg-[#1A6B51] hover:bg-[#14533F] text-white'
          }`}
        >
          {isOutOfStock ? 'Habis' : 'Add to cart'}
        </motion.button>
      </div>
    </motion.div>
  );
}
