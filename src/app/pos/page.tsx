'use client';

import React, { useEffect } from 'react';
import { PosProvider, usePos } from '@/context/PosContext';
import { NavbarPOS } from '@/components/pos/NavbarPOS';
import { FruitCard } from '@/components/pos/FruitCard';
import { CartPanel } from '@/components/pos/CartPanel';
import { ModifierModal } from '@/components/pos/ModifierModal';
import { StockCheckerModal } from '@/components/pos/StockCheckerModal';
import { MorningStockModal } from '@/components/pos/MorningStockModal';
import { StockReturnModal } from '@/components/pos/StockReturnModal';
import { CashOpnameModal } from '@/components/pos/CashOpnameModal';
import { ShiftOpenModal } from '@/components/pos/ShiftOpenModal';
import { ReceiptPrintView } from '@/components/pos/ReceiptPrintView';
import { Layers, Sparkles } from 'lucide-react';

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
        // Only trigger if not typing inside a modal or search input
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
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* 1. Header Navigation */}
      <NavbarPOS />

      {/* 2. Main Two-Column POS Layout */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Catalog Section (68% width on desktop) */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 pb-4 overflow-x-auto no-scrollbar">
            <button
              type="button"
              onClick={() => setSelectedCategory('ALL')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                selectedCategory === 'ALL'
                  ? 'bg-orange-500 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Semua Menu Jus
            </button>

            <button
              type="button"
              onClick={() => setSelectedCategory('SINGLE_FRUIT')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                selectedCategory === 'SINGLE_FRUIT'
                  ? 'bg-orange-500 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Jus Buah Tunggal
            </button>

            <button
              type="button"
              onClick={() => setSelectedCategory('VITAMIN_PACKAGE')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                selectedCategory === 'VITAMIN_PACKAGE'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Paket Multi-Vitamin (Vit-A, Vit-C)
            </button>
          </div>

          {/* Fruit Card Grid */}
          {filteredProducts.length === 0 ? (
            <div className="py-20 text-center text-slate-400">
              <p className="font-bold text-slate-700">Tidak ada menu yang sesuai</p>
              <p className="text-xs text-slate-400 mt-1">Coba cari kata kunci menu lainnya.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProducts.map((product) => (
                <FruitCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>

        {/* Right Sticky Cart Panel (32% width on desktop) */}
        <CartPanel />
      </div>

      {/* Popovers & Modals */}
      <ModifierModal />
      <StockCheckerModal />
      <MorningStockModal />
      <StockReturnModal />
      <CashOpnameModal />
      <ShiftOpenModal />

      {/* Hidden Thermal Receipt View for Print */}
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

