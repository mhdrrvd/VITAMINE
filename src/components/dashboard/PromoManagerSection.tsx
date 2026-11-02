'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { PromoSlide } from '@/types';
import { INITIAL_PROMOS } from '@/lib/mock-data';
import {
  Image as ImageIcon,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Clock,
  Sparkles,
  CheckCircle2,
  Tv,
} from 'lucide-react';

export function PromoManagerSection() {
  const [promos, setPromos] = useState<PromoSlide[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('vitamine_promos');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error(e);
        }
      }
    }
    return INITIAL_PROMOS;
  });

  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newDuration, setNewDuration] = useState(5);
  const [isSaved, setIsSaved] = useState(false);

  // Reorder slide up
  const moveSlide = (index: number, direction: 'UP' | 'DOWN') => {
    const targetIndex = direction === 'UP' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= promos.length) return;

    const updated = [...promos];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    // re-assign display orders
    const reordered = updated.map((p, idx) => ({ ...p, displayOrder: idx + 1 }));
    setPromos(reordered);
  };

  // Toggle active
  const toggleActive = (id: string) => {
    setPromos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p))
    );
  };

  // Delete slide
  const deleteSlide = (id: string) => {
    if (promos.length <= 1) {
      alert('Minimal harus menyisakan 1 banner promo aktif!');
      return;
    }
    setPromos((prev) => prev.filter((p) => p.id !== id));
  };

  // Add new slide
  const handleAddSlide = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newImageUrl) {
      alert('Silakan isi judul dan tautan gambar banner!');
      return;
    }

    const newSlide: PromoSlide = {
      id: `promo-${Date.now()}`,
      title: newTitle,
      imageUrl: newImageUrl,
      durationSeconds: newDuration,
      displayOrder: promos.length + 1,
      isActive: true,
    };

    setPromos([...promos, newSlide]);
    setNewTitle('');
    setNewImageUrl('');
    setNewDuration(5);
    setIsAdding(false);
  };

  // Save updates to localStorage
  const savePromos = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('vitamine_promos', JSON.stringify(promos));
    }
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Apply Bar */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white font-display flex items-center gap-2">
            <Tv className="w-5 h-5 text-orange-400" />
            <span>GUI Manajemen Promo & Banner Outlet</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Ubah urutan, durasi tayang, atau kelola materi promosi jus outlet Anda.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsAdding(!isAdding)}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4 text-orange-400" />
            <span>Tambah Banner</span>
          </button>

          <button
            type="button"
            onClick={savePromos}
            className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-extrabold flex items-center gap-2 shadow-glow-citrus transition-all active:scale-95"
          >
            {isSaved ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Tersimpan!</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Simpan Perubahan</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Add Banner Form Drawer */}
      {isAdding && (
        <form
          onSubmit={handleAddSlide}
          className="p-6 rounded-2xl bg-slate-850 border border-slate-700 shadow-md space-y-4 animate-in fade-in"
        >
          <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">
            Form Tambah Banner Promo Baru
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            <div className="sm:col-span-5">
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Judul Promosi
              </label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Contoh: Diskon 20% Paket VIT-C Imun Booster"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 focus:border-orange-500 rounded-xl text-xs text-white focus:outline-none"
              />
            </div>

            <div className="sm:col-span-5">
              <label className="text-xs font-bold text-slate-300 block mb-1">
                URL Gambar Banner (Rasio 16:9 / Resolusi 1920x1080)
              </label>
              <input
                type="url"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 focus:border-orange-500 rounded-xl text-xs text-white focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Durasi (Detik)
              </label>
              <input
                type="number"
                min={3}
                max={30}
                value={newDuration}
                onChange={(e) => setNewDuration(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 focus:border-orange-500 rounded-xl text-xs text-white font-mono text-center focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-400"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold"
            >
              Tambahkan ke Daftar
            </button>
          </div>
        </form>
      )}

      {/* Promo Slide List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {promos.map((promo, idx) => (
          <div
            key={promo.id}
            className={`p-4 rounded-2xl border transition-all ${
              promo.isActive
                ? 'bg-slate-900 border-slate-800 hover:border-slate-700'
                : 'bg-slate-950/60 border-slate-900 opacity-60'
            }`}
          >
            {/* Banner Preview Image */}
            <div className="relative w-full aspect-16/9 rounded-xl overflow-hidden bg-slate-800 mb-3">
              <Image
                src={promo.imageUrl}
                alt={promo.title}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover"
              />
              <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/60 text-white text-[10px] font-mono font-bold backdrop-blur-xs">
                Slide #{idx + 1}
              </div>
              <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-black/60 text-orange-400 text-[10px] font-mono font-bold flex items-center gap-1 backdrop-blur-xs">
                <Clock className="w-3 h-3" />
                {promo.durationSeconds}s
              </div>
            </div>

            {/* Slide Title */}
            <h4 className="font-bold text-white text-sm line-clamp-1 mb-3">
              {promo.title}
            </h4>

            {/* Actions Bar */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              {/* Order buttons */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={idx === 0}
                  onClick={() => moveSlide(idx, 'UP')}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300 transition-colors"
                  title="Pindah ke Atas"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  disabled={idx === promos.length - 1}
                  onClick={() => moveSlide(idx, 'DOWN')}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300 transition-colors"
                  title="Pindah ke Bawah"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Toggle switch & Delete */}
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-300">
                  <span>{promo.isActive ? 'Aktif' : 'Nonaktif'}</span>
                  <input
                    type="checkbox"
                    checked={promo.isActive}
                    onChange={() => toggleActive(promo.id)}
                    className="w-4 h-4 accent-orange-500 rounded cursor-pointer"
                  />
                </label>

                <button
                  type="button"
                  onClick={() => deleteSlide(promo.id)}
                  className="text-slate-500 hover:text-rose-400 p-1 rounded transition-colors"
                  title="Hapus Banner"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

