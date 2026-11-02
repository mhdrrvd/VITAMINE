'use client';

import React, { useEffect } from 'react';
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
import { LayoutGrid } from 'lucide-react';

const CATEGORIES = [
  { id: 'ALL', label: 'All' },
  { id: 'FAVORITE', label: 'Favorite' },
  { id: 'REGULAR', label: 'Regular' },
  { id: 'MIX_FRUIT', label: 'Mix Fruit' },
  { id: 'VIT_A', label: 'Vit-A' },
  { id: 'VIT_B', label: 'Vit-B' },
  { id: 'VIT_C', label: 'Vit-C' },
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
      // ⌘K or F2: Focus Search
      if (e.key === 'F2' || (e.key === 'k' && (e.metaKey || e.ctrlKey))) {
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
    <div className="h-screen w-screen overflow-hidden flex bg-[#F3F6F5] dark:bg-[#081210] font-sans select-none transition-colors duration-300 pl-24">
      {/* Floating Navbar di Samping Kiri (Hanya Sebesar Tombol) */}
      <SidebarPOS />

      {/* 2. Main Center Work Area (Header & Menu Catalog) */}
      <div className="flex-1 h-screen flex flex-col min-w-0 overflow-hidden">
        {/* Top Header: Greeting, Search, Bell, Darkmode & 4 KPI Metric Cards */}
        <HeaderPOS />

        {/* Menu Catalog (Kategori & Grid Produk) */}
        <div className="flex-1 flex flex-col overflow-hidden px-6 pb-6 pt-1 min-h-0">
          {/* Category Navigation Pills Bar & Grid Layout Toggle */}
          <div className="flex items-center justify-between pb-3 shrink-0">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              {CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id as any)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                      isActive
                        ? 'bg-[#1A6B51] dark:bg-[#00B14F] text-white shadow-xs'
                        : 'bg-white dark:bg-[#0F1E1B] text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/80'
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>

            <div className="p-2 rounded-xl bg-white dark:bg-[#0F1E1B] border border-slate-200/80 dark:border-slate-800 text-[#1A6B51] dark:text-[#00B14F] shadow-2xs shrink-0">
              <LayoutGrid className="w-4 h-4 stroke-[2.2]" />
            </div>
          </div>

          {/* Scrollable Product Cards Grid (Lebar & Leluasa) */}
          <main className="flex-1 overflow-y-auto no-scrollbar pr-1 pb-6">
            {filteredProducts.length === 0 ? (
              <div className="py-20 text-center text-slate-400 bg-white dark:bg-[#0F1E1B] rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
                <p className="font-bold text-slate-700 dark:text-slate-200">Tidak ada menu yang sesuai</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Coba cari dengan kata kunci lain atau pilih kategori lain.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3.5">
                {filteredProducts.map((product) => (
                  <FruitCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* 3. Right Column: Cart Panel (Perkecil 15%, Full Height h-screen) */}
      <div className="w-[315px] lg:w-[340px] xl:w-[365px] shrink-0 h-screen flex flex-col overflow-hidden border-l border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0F1E1B] shadow-2xl z-20 transition-colors duration-300">
        <CartPanel />
      </div>

      {/* Modals & Hardware Views */}
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
