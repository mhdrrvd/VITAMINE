'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PosProvider, usePos } from '@/context/PosContext';
import { SidebarPOS } from '@/components/pos/SidebarPOS';
import { HeaderPOS } from '@/components/pos/HeaderPOS';
import { MetricsRow } from '@/components/pos/MetricsRow';
import { FruitCard } from '@/components/pos/FruitCard';
import { CartPanel } from '@/components/pos/CartPanel';
import { ModifierModal } from '@/components/pos/ModifierModal';
import { StockCheckerModal } from '@/components/pos/StockCheckerModal';
import { MorningStockModal } from '@/components/pos/MorningStockModal';
import { StockReturnModal } from '@/components/pos/StockReturnModal';
import { CashOpnameModal } from '@/components/pos/CashOpnameModal';
import { ShiftOpenModal } from '@/components/pos/ShiftOpenModal';
import { ReceiptPrintView } from '@/components/pos/ReceiptPrintView';
import { LayoutGrid } from 'lucide-react';

const CATEGORIES = [
  { id: 'ALL', label: 'All Menu' },
  { id: 'SINGLE_FRUIT', label: 'Jus Buah Tunggal' },
  { id: 'VITAMIN_PACKAGE', label: 'Paket Multi-Vitamin' },
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
    const matchesCategory =
      selectedCategory === 'ALL' ||
      (selectedCategory === 'SINGLE_FRUIT' && p.category === 'SINGLE_FRUIT') ||
      (selectedCategory === 'VITAMIN_PACKAGE' && p.category === 'VITAMIN_PACKAGE');

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
    <div className="min-h-screen bg-[#F4F7F5] flex overflow-x-hidden font-sans">
      {/* 1. Left Sidebar (PosyMart style, 240px) */}
      <SidebarPOS />

      {/* 2. Main Work Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <HeaderPOS />

        {/* 4 Summary Metric Cards */}
        <MetricsRow />

        {/* Split POS Workspace: Product Catalog on LEFT, Current Sale Cart on RIGHT */}
        <main className="p-6 sm:p-8 pt-4 flex-1 flex flex-col lg:flex-row gap-6 items-start">
          {/* Left / Center: Product Menu & Fruit Cards Grid */}
          <section className="flex-1 min-w-0 w-full flex flex-col gap-4">
            {/* Minimalist Category Pills Bar with Smooth Framer Motion */}
            <div className="flex items-center justify-between gap-3 bg-white p-2 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                {CATEGORIES.map((cat) => {
                  const isActive = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`relative px-4 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap select-none ${
                        isActive
                          ? 'text-white'
                          : 'text-slate-600 hover:text-[#051F20] hover:bg-slate-100/70'
                      }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeCategoryPill"
                          className="absolute inset-0 bg-[#235347] rounded-xl shadow-xs"
                          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        />
                      )}
                      <span className="relative z-10">{cat.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="hidden sm:flex items-center gap-2 pr-2 text-xs font-semibold text-slate-500">
                <span className="text-[11px] text-slate-400 font-mono">
                  {filteredProducts.length} items
                </span>
                <div className="p-1.5 rounded-lg border border-slate-200 bg-slate-50 text-[#235347]">
                  <LayoutGrid className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>

            {/* 4-Column Product Cards Grid */}
            {filteredProducts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="py-20 text-center text-slate-400 bg-white rounded-2xl border border-slate-200/80 shadow-xs"
              >
                <p className="font-bold text-slate-700">Tidak ada menu yang sesuai</p>
                <p className="text-xs text-slate-400 mt-1">Coba cari dengan kata kunci lain.</p>
              </motion.div>
            ) : (
              <motion.div
                layout
                className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3.5"
              >
                <AnimatePresence>
                  {filteredProducts.map((product) => (
                    <FruitCard key={product.id} product={product} />
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </section>

          {/* Right: Current Sale Cart Panel (As requested: keranjang ada di kanan) */}
          <CartPanel />
        </main>
      </div>

      {/* Modals & Hardware views */}
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
