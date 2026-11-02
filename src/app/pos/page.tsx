'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PosProvider, usePos } from '@/context/PosContext';
import { SidebarPOS } from '@/components/pos/SidebarPOS';
import { HeaderPOS } from '@/components/pos/HeaderPOS';
import { FruitCard } from '@/components/pos/FruitCard';
import { CartPanel } from '@/components/pos/CartPanel';
import { ModifierModal } from '@/components/pos/ModifierModal';
import { StockCheckerModal } from '@/components/pos/StockCheckerModal';
import { MorningStockModal } from '@/components/pos/MorningStockModal';
import { StockReturnModal } from '@/components/pos/StockReturnModal';
import { CashOpnameModal } from '@/components/pos/CashOpnameModal';
import { ShiftOpenModal } from '@/components/pos/ShiftOpenModal';
import { HistoryModal } from '@/components/pos/HistoryModal';
import { OrderQueueModal } from '@/components/pos/OrderQueueModal';
import { ReceiptPrintView } from '@/components/pos/ReceiptPrintView';

const CATEGORIES = [
  { id: 'ALL', label: 'All' },
  { id: 'REGULAR', label: 'Regular' },
  { id: 'MIX_FRUIT', label: 'Mix Fruit' },
  { id: 'VIT_A', label: 'Vit-A' },
  { id: 'VIT_B', label: 'Vit-B' },
  { id: 'VIT_C', label: 'Vit-C' },
  { id: 'FAVORITE', label: 'Favorite' },
] as const;

function PosContent() {
  const {
    products,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setIsStockModalOpen,
    setPaymentMethod,
    processCheckout,
    cart,
    paymentMethod,
    cashTendered,
    cartTotal,
  } = usePos();

  // Filter products by category and search
  const filteredProducts = products.filter((p) => {
    let matchesCategory = true;
    if (selectedCategory === 'REGULAR') {
      matchesCategory = p.category === 'REGULAR' || p.category === 'SINGLE_FRUIT';
    } else if (selectedCategory === 'MIX_FRUIT') {
      matchesCategory = p.category === 'MIX_FRUIT' || p.category === 'VITAMIN_PACKAGE';
    } else if (selectedCategory === 'VIT_A') {
      matchesCategory = p.category === 'VIT_A' || (p.vitamins && p.vitamins.includes('A')) || p.id === 'prod-vita' || p.id === 'prod-mangga';
    } else if (selectedCategory === 'VIT_B') {
      matchesCategory = p.category === 'VIT_B' || (p.vitamins && p.vitamins.includes('B')) || p.id === 'prod-vitb' || p.id === 'prod-alpukat';
    } else if (selectedCategory === 'VIT_C') {
      matchesCategory = p.category === 'VIT_C' || (p.vitamins && p.vitamins.includes('C')) || p.id === 'prod-vitc' || p.id === 'prod-jeruk' || p.id === 'prod-buahnaga';
    } else if (selectedCategory === 'FAVORITE') {
      matchesCategory = Boolean(p.isFavorite) || p.id === 'prod-mangga' || p.id === 'prod-alpukat' || p.id === 'prod-vitc' || p.id === 'prod-mix-sunset';
    }

    const matchesSearch =
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // F2: Focus Search
      if (e.key === 'F2') {
        e.preventDefault();
        const searchInput = document.getElementById('pos-search-input') as HTMLInputElement | null;
        if (searchInput) {
          searchInput.focus();
          searchInput.select();
        }
      }

      // F4: Open Stock Checker
      if (e.key === 'F4') {
        e.preventDefault();
        setIsStockModalOpen(true);
      }

      // F8: Select Cash & Focus Input
      if (e.key === 'F8') {
        e.preventDefault();
        setPaymentMethod('CASH');
        const cashInput = document.getElementById('cash-tendered-input') as HTMLInputElement | null;
        if (cashInput) {
          cashInput.focus();
          cashInput.select();
        }
      }

      // F9: Select QRIS
      if (e.key === 'F9') {
        e.preventDefault();
        setPaymentMethod('QRIS_STATIC');
      }

      // Enter: Checkout if ready
      if (e.key === 'Enter' && cart.length > 0) {
        const activeTag = document.activeElement?.tagName.toLowerCase();
        if (activeTag !== 'textarea') {
          if (paymentMethod !== 'CASH' || cashTendered >= cartTotal) {
            e.preventDefault();
            processCheckout().then((order) => {
              if (order) {
                setTimeout(() => window.print(), 200);
              }
            });
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cart, paymentMethod, cashTendered, cartTotal, setIsStockModalOpen, setPaymentMethod, processCheckout]);

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#F8FAF9] dark:bg-[#081210] flex font-sans select-none transition-colors duration-300">
      {/* 1. Left Slim Icon Sidebar Rail (Locked, never moves) */}
      <SidebarPOS />

      {/* 2. Center Main Work Area (Fixed height, isolated menu scroll) */}
      <div className="flex-1 h-screen flex flex-col min-w-0 overflow-hidden">
        {/* Fixed Top Section: Dashboard Penjualan (Header yang lebih leluasa dan besar) */}
        <div className="shrink-0 bg-transparent z-20 border-b border-slate-200/70 dark:border-slate-800/80 shadow-[0_2px_12px_rgba(0,0,0,0.02)] dark:shadow-none transition-colors duration-300">
          <HeaderPOS />
        </div>

        {/* Scrollable Menu Catalog Area (The ONLY part that scrolls!) */}
        <main className="flex-1 overflow-y-auto px-8 pt-7 pb-20 no-scrollbar">
          {/* Section Heading & Category Navigation Pills Bar (Dipindahkan ke dalam section menu) */}
          <div className="mb-7">
            <div className="flex items-center justify-between mb-3.5">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight font-display transition-colors duration-300">
                  Find The Fresh Juice
                </h2>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                  Pilih menu jus segar & racikan buah kaya vitamin
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCategory('ALL')}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-[#1A6B51] dark:text-[#00B14F] hover:bg-[#FF7A00] hover:text-white dark:hover:bg-[#FF7A00] dark:hover:text-white transition-all duration-300 ease-out cursor-pointer shadow-2xs"
              >
                View All
              </button>
            </div>

            {/* Category Navigation Pills Bar */}
            <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar pb-1">
              {CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id as any)}
                    className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all duration-300 ease-out whitespace-nowrap select-none cursor-pointer ${
                      isActive
                        ? 'bg-[#FF7A00] text-white shadow-md shadow-[#FF7A00]/25 dark:bg-[#FF7A00] dark:text-white dark:shadow-[#FF7A00]/25 scale-[1.02]'
                        : 'bg-white dark:bg-[#0F1E1B] text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:bg-[#FF7A00] hover:text-white dark:hover:bg-[#FF7A00] dark:hover:text-white hover:shadow-md hover:shadow-[#FF7A00]/25'
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="py-20 text-center text-slate-400 bg-white dark:bg-[#0F1E1B] rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xs">
              <p className="font-bold text-slate-700 dark:text-slate-200">Tidak ada menu yang sesuai</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Coba cari dengan kata kunci lain atau pilih kategori lain.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-16 pt-2">
              {filteredProducts.map((product) => (
                <FruitCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* 3. Right: "My Order" Cart Panel (Locked to screen, never moves) */}
      <CartPanel />

      {/* Modals & Hardware views */}
      <HistoryModal />
      <OrderQueueModal />
      <ModifierModal />
      <StockCheckerModal />
      <MorningStockModal />
      <StockReturnModal />
      <CashOpnameModal />
      <ShiftOpenModal />
      <ReceiptPrintView />
    </div>
  );
}

export default function PosPage() {
  return (
    <PosProvider>
      <PosContent />
    </PosProvider>
  );
}
