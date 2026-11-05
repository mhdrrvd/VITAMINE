'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  BarChart3,
  ShoppingBag,
  Receipt,
  Calculator,
  Layers,
  Image as ImageIcon,
  ExternalLink,
  ShieldCheck,
  UserCheck,
  Sparkles,
  Volume2,
  VolumeX,
  Database,
  X,
} from 'lucide-react';
import { soundEffects } from '@/lib/audio-effects';
import { BackupRestoreModal } from './BackupRestoreModal';

export type DashboardTab =
  | 'ANALYTICS'
  | 'PRODUCTS'
  | 'POS_ORDERS'
  | 'SHIFT_AUDIT'
  | 'BOM'
  | 'PROMO';

interface SidebarDashboardProps {
  activeTab: DashboardTab;
  setActiveTab: (tab: DashboardTab) => void;
  ordersCount?: number;
  productsCount?: number;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export function SidebarDashboard({
  activeTab,
  setActiveTab,
  ordersCount = 0,
  productsCount = 0,
  isMobileOpen = false,
  onCloseMobile,
}: SidebarDashboardProps) {
  const [isMuted, setIsMuted] = React.useState(false);
  const [isBackupModalOpen, setIsBackupModalOpen] = React.useState(false);

  React.useEffect(() => {
    setIsMuted(soundEffects.getIsMuted());
  }, []);

  const handleTabClick = (tab: DashboardTab) => {
    soundEffects.playClick();
    setActiveTab(tab);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  const handleToggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    const muted = soundEffects.toggleMute();
    setIsMuted(muted);
  };
  const navItems: {
    id: DashboardTab;
    label: string;
    sublabel: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
    badgeColor?: string;
  }[] = [
    {
      id: 'ANALYTICS',
      label: 'Analitik & Omzet',
      sublabel: 'Performa penjualan & KPI',
      icon: BarChart3,
    },
    {
      id: 'PRODUCTS',
      label: 'Katalog Produk (CRUD)',
      sublabel: 'Kelola menu & harga jual',
      icon: ShoppingBag,
      badge: productsCount > 0 ? `${productsCount} Menu` : 'CRUD',
      badgeColor: 'bg-[#00E565]/20 text-[#00E565] border border-[#00E565]/30',
    },
    {
      id: 'POS_ORDERS',
      label: 'Live Transaksi POS',
      sublabel: 'Pantau order kasir real-time',
      icon: Receipt,
      badge: 'Live',
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 animate-pulse',
    },
    {
      id: 'SHIFT_AUDIT',
      label: 'Audit Kas & Shift',
      sublabel: 'Rekonsiliasi cash opname kasir',
      icon: Calculator,
    },
    {
      id: 'BOM',
      label: 'Master Resep BOM',
      sublabel: 'Formula gramatur & potong stok',
      icon: Layers,
    },
    {
      id: 'PROMO',
      label: 'Kelola Promo GUI',
      sublabel: 'Slider monitor pelanggan',
      icon: ImageIcon,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/70 backdrop-blur-xs z-40 lg:hidden animate-in fade-in duration-200"
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 lg:z-40 w-72 lg:w-72 bg-[#0B1E19]/98 lg:bg-[#0B1E19]/95 backdrop-blur-xl border-r border-white/10 flex flex-col justify-between h-screen select-none shrink-0 transition-transform duration-300 ease-in-out ${
          isMobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* 1. Header Brand & Outlet Info */}
        <div className="p-4 lg:p-5 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-11 h-11 rounded-2xl bg-[#081210] border border-white/10 flex items-center justify-center p-1.5 shadow-md shrink-0">
                <Image
                  src="/images/logo-vm.png"
                  alt="VITAMINE Logo"
                  fill
                  className="object-contain p-1"
                  priority
                />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-white text-base tracking-tight font-display">
                    VITAMINE
                  </span>
                  <span className="px-1.5 py-0.2 rounded bg-orange-500/20 text-orange-400 text-[10px] font-mono font-bold border border-orange-500/30">
                    OWNER
                  </span>
                </div>
                <p className="text-[11px] text-[#00E565] font-medium truncate flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00E565] animate-pulse shrink-0" />
                  <span>Indomaret Mabar</span>
                </p>
              </div>
            </div>

            {/* Mobile Close Button */}
            {onCloseMobile && (
              <button
                type="button"
                onClick={onCloseMobile}
                className="lg:hidden p-1.5 rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Tutup Menu"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

      {/* 2. Main Navigation Menu */}
      <nav className="flex-1 overflow-y-auto no-scrollbar p-3 space-y-1.5" aria-label="Dashboard Menu">
        <div className="px-3 pt-2 pb-1.5 text-[10px] font-bold text-white/40 tracking-wider uppercase font-mono">
          Menu Operasional
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleTabClick(item.id)}
              className={`btn-kilat w-full text-left p-2.5 rounded-2xl flex items-center gap-3 transition-all duration-200 cursor-pointer relative overflow-hidden group ${
                isActive
                  ? 'bg-[#00B14F] text-white shadow-lg shadow-[#00B14F]/30 font-bold scale-[1.01]'
                  : 'text-white/70 hover:text-white hover:bg-[#00B14F] hover:shadow-md hover:shadow-[#00B14F]/25 hover:scale-[1.01]'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200 ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-white/5 text-white/80 group-hover:bg-white/20 group-hover:text-white'
                }`}
              >
                <Icon className="w-4.5 h-4.5 stroke-[2.2]" />
              </div>

              <div className="flex-1 min-w-0 leading-tight">
                <div className="text-xs font-bold truncate flex items-center justify-between gap-1">
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-md ${
                        item.badgeColor || 'bg-white/20 text-white'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
                <div
                  className={`text-[10px] truncate mt-0.5 ${
                    isActive ? 'text-white/85' : 'text-white/50 group-hover:text-white/80'
                  }`}
                >
                  {item.sublabel}
                </div>
              </div>
            </button>
          );
        })}
      </nav>

      {/* 3. Bottom Hub: POS Terminal Quick Launch & Profile */}
      <div className="p-3 border-t border-white/10 space-y-2 bg-[#081210]/60">
        {/* Quick Launch Terminal Kasir Button */}
        <Link
          href="/pos"
          target="_blank"
          className="btn-kilat w-full py-2.5 px-3 rounded-2xl bg-[#00B14F]/15 hover:bg-[#00B14F] text-[#00E565] hover:text-white border border-[#00B14F]/30 hover:border-[#00B14F] text-xs font-black flex items-center justify-between shadow-xs hover:shadow-lg hover:shadow-[#00B14F]/30 transition-all duration-200 group cursor-pointer"
          title="Buka Layar Terminal Kasir di Tab Baru"
        >
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#00B14F]/30 group-hover:bg-white/20 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4 stroke-[2.4]" />
            </div>
            <div className="text-left">
              <div className="font-bold text-xs leading-none">Terminal Kasir</div>
              <span className="text-[10px] font-mono text-white/60 group-hover:text-white/80">
                Layar Transaksi &rarr;
              </span>
            </div>
          </div>
          <ExternalLink className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100" />
        </Link>

        {/* Backup & Restore Action Button */}
        <button
          type="button"
          onClick={() => setIsBackupModalOpen(true)}
          className="w-full py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/5 text-[11px] font-bold flex items-center justify-between transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Database className="w-3.5 h-3.5 text-[#00E565]" />
            <span>Cadangan Database</span>
          </div>
          <span className="text-[10px] text-white/40 font-mono">JSON</span>
        </button>

        {/* User Card */}
        <div className="flex items-center justify-between p-2.5 rounded-2xl bg-white/5 border border-white/5">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center justify-center font-bold text-xs shrink-0">
              HW
            </div>
            <div className="min-w-0 leading-tight">
              <div className="text-xs font-bold text-white truncate">Hendra Wijaya</div>
              <div className="text-[10px] text-[#00E565] flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00E565]" />
                <span>Owner & Administrator</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleToggleSound}
              className="p-1 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-colors cursor-pointer"
              title={isMuted ? 'Aktifkan Suara Audio' : 'Bisukan Suara Audio'}
            >
              {isMuted ? (
                <VolumeX className="w-3.5 h-3.5 text-rose-400" />
              ) : (
                <Volume2 className="w-3.5 h-3.5 text-[#00E565]" />
              )}
            </button>
            <ShieldCheck className="w-4 h-4 text-[#00E565]/80 shrink-0" />
          </div>
        </div>
      </div>

      {/* Database Backup & Restore Modal */}
      <BackupRestoreModal
        isOpen={isBackupModalOpen}
        onClose={() => setIsBackupModalOpen(false)}
      />
    </aside>
    </>
  );
}

