'use client';

import React, { useState } from 'react';
import { PosProvider, usePos } from '@/context/PosContext';
import { SidebarDashboard, DashboardTab } from '@/components/dashboard/SidebarDashboard';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { ProductManagerSection } from '@/components/dashboard/ProductManagerSection';
import { PosOrdersSection } from '@/components/dashboard/PosOrdersSection';
import { ShiftAuditSection } from '@/components/dashboard/ShiftAuditSection';
import { KpiCardsSection } from '@/components/dashboard/KpiCardsSection';
import { SalesChartSection } from '@/components/dashboard/SalesChartSection';
import { PromoManagerSection } from '@/components/dashboard/PromoManagerSection';
import { BomViewerSection } from '@/components/dashboard/BomViewerSection';

const TAB_TITLES: Record<DashboardTab, string> = {
  ANALYTICS: 'Ringkasan & Analitik Bisnis',
  PRODUCTS: 'Manajemen Katalog & Resep Produk (CRUD)',
  POS_ORDERS: 'Live Monitor Transaksi Kasir POS',
  SHIFT_AUDIT: 'Audit Kas & Rekonsiliasi Tutup Shift',
  BOM: 'Master Resep & Formula BOM Inventaris',
  PROMO: 'Kelola Promo GUI Monitor Pelanggan',
};

function DashboardContent() {
  const { products, recentOrders } = usePos();
  const [activeTab, setActiveTab] = useState<DashboardTab>('ANALYTICS');
  const [dateRange, setDateRange] = useState('TODAY');

  return (
    <div className="min-h-screen bg-[#081210] text-slate-100 flex flex-row font-sans selection:bg-[#00B14F] selection:text-white">
      {/* 1. Left Sidebar Navigation */}
      <SidebarDashboard
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        ordersCount={recentOrders.length}
        productsCount={products.length}
      />

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto no-scrollbar">
        {/* Top Header */}
        <DashboardHeader
          dateRange={dateRange}
          setDateRange={setDateRange}
          activeTabTitle={TAB_TITLES[activeTab]}
        />

        {/* Tab Sections */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-8 pb-12">
          {/* Tab 1: Analitik & KPI Bisnis */}
          {activeTab === 'ANALYTICS' && (
            <div className="space-y-8 animate-in fade-in duration-200">
              <KpiCardsSection />
              <SalesChartSection />
            </div>
          )}

          {/* Tab 2: Full GUI CRUD Manajemen Produk & Resep */}
          {activeTab === 'PRODUCTS' && (
            <div className="animate-in fade-in duration-200">
              <ProductManagerSection />
            </div>
          )}

          {/* Tab 3: Live Transaksi Kasir POS */}
          {activeTab === 'POS_ORDERS' && (
            <div className="animate-in fade-in duration-200">
              <PosOrdersSection />
            </div>
          )}

          {/* Tab 4: Rekonsiliasi & Audit Kas Kasir */}
          {activeTab === 'SHIFT_AUDIT' && (
            <div className="animate-in fade-in duration-200">
              <ShiftAuditSection />
            </div>
          )}

          {/* Tab 5: Master Resep BOM */}
          {activeTab === 'BOM' && (
            <div className="animate-in fade-in duration-200">
              <BomViewerSection />
            </div>
          )}

          {/* Tab 6: Kelola Promo GUI */}
          {activeTab === 'PROMO' && (
            <div className="animate-in fade-in duration-200">
              <PromoManagerSection />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function OwnerDashboardPage() {
  return (
    <PosProvider>
      <DashboardContent />
    </PosProvider>
  );
}
