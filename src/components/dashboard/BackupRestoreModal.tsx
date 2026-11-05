'use client';

import React, { useState } from 'react';
import { Database, Download, Upload, Check, AlertTriangle, X, RefreshCw } from 'lucide-react';
import { exportToJson } from '@/lib/export-utils';

interface BackupRestoreModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BackupRestoreModal({ isOpen, onClose }: BackupRestoreModalProps) {
  const [importStatus, setImportStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleBackup = () => {
    if (typeof window === 'undefined') return;

    const backupData = {
      timestamp: new Date().toISOString(),
      store: 'VITAMINE Indomaret Mabar',
      version: '1.0.0',
      data: {
        products: localStorage.getItem('vitamine_products')
          ? JSON.parse(localStorage.getItem('vitamine_products')!)
          : null,
        ingredients: localStorage.getItem('vitamine_ingredients')
          ? JSON.parse(localStorage.getItem('vitamine_ingredients')!)
          : null,
        recentOrders: localStorage.getItem('vitamine_recent_orders')
          ? JSON.parse(localStorage.getItem('vitamine_recent_orders')!)
          : null,
        currentShift: localStorage.getItem('vitamine_current_shift')
          ? JSON.parse(localStorage.getItem('vitamine_current_shift')!)
          : null,
        promos: localStorage.getItem('vitamine_promos')
          ? JSON.parse(localStorage.getItem('vitamine_promos')!)
          : null,
      },
    };

    exportToJson(`vitamine-backup-${new Date().toISOString().slice(0, 10)}`, backupData);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.data) {
          if (parsed.data.products) {
            localStorage.setItem('vitamine_products', JSON.stringify(parsed.data.products));
          }
          if (parsed.data.ingredients) {
            localStorage.setItem('vitamine_ingredients', JSON.stringify(parsed.data.ingredients));
          }
          if (parsed.data.recentOrders) {
            localStorage.setItem('vitamine_recent_orders', JSON.stringify(parsed.data.recentOrders));
          }
          if (parsed.data.promos) {
            localStorage.setItem('vitamine_promos', JSON.stringify(parsed.data.promos));
          }
          setImportStatus('Data backup berhasil dipulihkan! Halaman akan memuat ulang...');
          setTimeout(() => {
            window.location.reload();
          }, 1200);
        } else {
          alert('Format berkas backup tidak valid.');
        }
      } catch (err) {
        alert('Gagal membaca berkas JSON: ' + String(err));
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-150 select-none">
      <div className="w-full max-w-md bg-[#0F1E1B] border border-white/15 rounded-3xl p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#00B14F]/20 text-[#00E565] flex items-center justify-center">
              <Database className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-white">Cadangkan & Pulihkan Data</h4>
              <p className="text-[11px] text-white/50">Database Lokal VITAMINE POS</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/10 text-white/50 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {importStatus ? (
          <div className="p-4 rounded-2xl bg-[#00B14F]/20 border border-[#00B14F]/30 text-[#00E565] text-xs font-bold text-center space-y-1">
            <Check className="w-5 h-5 mx-auto" />
            <p>{importStatus}</p>
          </div>
        ) : (
          <div className="space-y-3.5">
            {/* Backup Button */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <span className="text-xs font-bold text-white block">1. Ekspor Cadangan (Backup)</span>
              <p className="text-[11px] text-white/60">
                Unduh seluruh data produk, resep BOM, stok bahan, riwayat transaksi kasir, dan audit shift ke berkas JSON.
              </p>
              <button
                type="button"
                onClick={handleBackup}
                className="btn-kilat w-full py-2 px-3 rounded-xl bg-[#00B14F] hover:bg-[#00E565] text-white hover:text-slate-950 text-xs font-black flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh File JSON Cadangan</span>
              </button>
            </div>

            {/* Restore File Input */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <span className="text-xs font-bold text-white block">2. Pulihkan Cadangan (Restore)</span>
              <p className="text-[11px] text-white/60">
                Unggah berkas JSON cadangan yang telah diunduh sebelumnya untuk mengembalikan data toko.
              </p>
              <label className="w-full py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center justify-center gap-2 border border-white/10 transition-colors cursor-pointer block text-center">
                <Upload className="w-3.5 h-3.5 inline mr-1" />
                <span>Pilih Berkas JSON Cadangan</span>
                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={onClose}
          className="w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs font-bold transition-colors cursor-pointer"
        >
          Tutup
        </button>
      </div>
    </div>
  );
}
