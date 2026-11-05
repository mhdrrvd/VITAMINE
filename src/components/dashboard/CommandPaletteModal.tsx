'use client';

import React, { useState, useEffect } from 'react';
import {
  Search,
  BarChart3,
  ShoppingBag,
  Receipt,
  Calculator,
  Layers,
  Image as ImageIcon,
  ExternalLink,
  Volume2,
  X,
  CornerDownLeft,
} from 'lucide-react';
import { DashboardTab } from './SidebarDashboard';
import { soundEffects } from '@/lib/audio-effects';

interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: DashboardTab) => void;
}

export function CommandPaletteModal({
  isOpen,
  onClose,
  onSelectTab,
}: CommandPaletteModalProps) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Trigger open handled by parent
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const commands = [
    {
      id: 'ANALYTICS',
      title: 'Buka Ringkasan & Analitik Bisnis',
      category: 'Navigasi',
      icon: BarChart3,
      action: () => {
        soundEffects.playClick();
        onSelectTab('ANALYTICS');
        onClose();
      },
    },
    {
      id: 'PRODUCTS',
      title: 'Buka Katalog Menu & Manajemen Produk (CRUD)',
      category: 'Navigasi',
      icon: ShoppingBag,
      action: () => {
        soundEffects.playClick();
        onSelectTab('PRODUCTS');
        onClose();
      },
    },
    {
      id: 'POS_ORDERS',
      title: 'Lihat Live Monitor Transaksi Kasir POS',
      category: 'Navigasi',
      icon: Receipt,
      action: () => {
        soundEffects.playClick();
        onSelectTab('POS_ORDERS');
        onClose();
      },
    },
    {
      id: 'SHIFT_AUDIT',
      title: 'Buka Rekonsiliasi & Audit Kas Shift',
      category: 'Navigasi',
      icon: Calculator,
      action: () => {
        soundEffects.playClick();
        onSelectTab('SHIFT_AUDIT');
        onClose();
      },
    },
    {
      id: 'BOM',
      title: 'Buka Master Resep & Formula BOM',
      category: 'Navigasi',
      icon: Layers,
      action: () => {
        soundEffects.playClick();
        onSelectTab('BOM');
        onClose();
      },
    },
    {
      id: 'PROMO',
      title: 'Kelola Slider Promo Pelanggan GUI',
      category: 'Navigasi',
      icon: ImageIcon,
      action: () => {
        soundEffects.playClick();
        onSelectTab('PROMO');
        onClose();
      },
    },
    {
      id: 'POS_TERMINAL',
      title: 'Buka Meja Kasir POS di Tab Baru',
      category: 'Tindakan Cepat',
      icon: ExternalLink,
      action: () => {
        soundEffects.playCashRegister();
        window.open('/pos', '_blank');
        onClose();
      },
    },
    {
      id: 'TOGGLE_SOUND',
      title: 'Toggle Audio Sound Effects',
      category: 'Pengaturan',
      icon: Volume2,
      action: () => {
        soundEffects.toggleMute();
        onClose();
      },
    },
  ];

  const filtered = commands.filter((c) =>
    c.title.toLowerCase().includes(query.toLowerCase()) ||
    c.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-150 select-none">
      <div className="w-full max-w-xl bg-[#0F1E1B] border border-white/15 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-white/10 flex items-center gap-3">
          <Search className="w-5 h-5 text-[#00E565] shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ketik perintah atau cari navigasi menu..."
            className="flex-1 bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none font-medium"
          />
          <kbd className="hidden sm:inline px-2 py-0.5 rounded bg-white/10 text-white/50 text-[10px] font-mono">
            ESC
          </kbd>
        </div>

        {/* Command List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1 no-scrollbar">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-xs text-white/40 font-mono">
              Tidak ada perintah yang sesuai.
            </div>
          ) : (
            filtered.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={item.action}
                  className="w-full text-left p-3 rounded-2xl flex items-center justify-between text-xs transition-colors hover:bg-[#00B14F] hover:text-white text-white/80 group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-white/5 group-hover:bg-white/20 flex items-center justify-center text-white/80 group-hover:text-white">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-white group-hover:text-white">
                        {item.title}
                      </div>
                      <div className="text-[10px] text-white/50 group-hover:text-white/80 font-mono">
                        {item.category}
                      </div>
                    </div>
                  </div>

                  <CornerDownLeft className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-2.5 px-4 border-t border-white/10 bg-[#081210] flex items-center justify-between text-[11px] text-white/40 font-mono">
          <span>Tekan ESC untuk menutup</span>
          <span>VITAMINE Command Palette</span>
        </div>
      </div>
    </div>
  );
}
