'use client';

import React, { useState } from 'react';
import { NavbarDashboard } from '@/components/dashboard/NavbarDashboard';
import { KpiCardsSection } from '@/components/dashboard/KpiCardsSection';
import { SalesChartSection } from '@/components/dashboard/SalesChartSection';
import { PromoManagerSection } from '@/components/dashboard/PromoManagerSection';
import { ShiftAuditSection } from '@/components/dashboard/ShiftAuditSection';
import { BomViewerSection } from '@/components/dashboard/BomViewerSection';

export default function OwnerDashboardPage() {
  const [activeTab, setActiveTab] = useState<'ANALYTICS' | 'PROMO' | 'BOM' | 'AUDIT'>('ANALYTICS');
  const [dateRange, setDateRange] = useState('TODAY');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-orange-500 selection:text-white">
      {/* 1. Header Navigation */}
      <NavbarDashboard
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        dateRange={dateRange}
        setDateRange={setDateRange}
      />

      {/* 2. Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto space-y-8">
        {activeTab === 'ANALYTICS' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Animated KPI Cards */}
            <KpiCardsSection />

            {/* Hourly Peak Chart & Fruit Breakdown */}
            <SalesChartSection />
          </div>
        )}

        {activeTab === 'PROMO' && (
          <div className="animate-in fade-in duration-200">
            <PromoManagerSection />
          </div>
        )}

        {activeTab === 'BOM' && (
          <div className="animate-in fade-in duration-200">
            <BomViewerSection />
          </div>
        )}

        {activeTab === 'AUDIT' && (
          <div className="animate-in fade-in duration-200">
            <ShiftAuditSection />
          </div>
        )}
      </main>
    </div>
  );
}

