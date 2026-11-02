'use client';

import React, { useEffect } from 'react';
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

        {/* Split POS Workspace (Current Sale Cart on Left, Product Catalog on Right) */}
        <main className="p-6 sm:p-8 pt-4 flex-1 flex flex-col lg:flex-row gap-6 items-start">
          {/* Left: Current Sale Cart Panel */}
          <CartPanel />

          {/* Right: Product Menu & Fruit Cards Grid */}
          <section className="flex-1 min-w-0 w-full flex flex-col gap-4">
            {/* Category Pills Bar (PosyMart style) */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                <button
                  type="button"
                  onClick={() => setSelectedCategory('ALL')}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                    selectedCategory === 'ALL'
                      ? 'bg-[#235347] text-white shadow-xs'
                      : 'bg-[#DAF1DE] text-[#163832] hover:bg-[#c3e6ca]'
                  }`}
                >
                  All
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedCategory('SINGLE_FRUIT')}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                    selectedCategory === 'SINGLE_FRUIT'
                      ? 'bg-[#235347] text-white shadow-xs'
                      : 'bg-[#DAF1DE] text-[#163832] hover:bg-[#c3e6ca]'
                  }`}
                >
                  Jus Buah Tunggal
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedCategory('VITAMIN_PACKAGE')}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                    selectedCategory === 'VITAMIN_PACKAGE'
                      ? 'bg-[#235347] text-white shadow-xs'
                      : 'bg-[#DAF1DE] text-[#163832] hover:bg-[#c3e6ca]'
                  }`}
                >
                  Paket Multi-Vitamin (Vit-A, Vit-C)
                </button>
              </div>

              <div className="hidden sm:flex items-center p-1.5 rounded-xl border border-slate-200 bg-white text-slate-500">
                <LayoutGrid className="w-4 h-4 text-[#235347]" />
              </div>
            </div>

            {/* 4-Column Product Cards Grid */}
            {filteredProducts.length === 0 ? (
              <div className="py-20 text-center text-slate-400 bg-white rounded-2xl border border-slate-200/80">
                <p className="font-bold text-slate-700">Tidak ada menu yang sesuai</p>
                <p className="text-xs text-slate-400 mt-1">Coba cari dengan kata kunci lain.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3.5">
                {filteredProducts.map((product) => (
                  <FruitCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </section>
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
