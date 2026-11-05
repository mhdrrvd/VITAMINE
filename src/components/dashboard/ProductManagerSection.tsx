'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { usePos } from '@/context/PosContext';
import { Product, ProductCategory, RecipeItem } from '@/types';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Star,
  Check,
  X,
  Layers,
  Sparkles,
  Info,
  DollarSign,
  TrendingUp,
  Package,
  AlertTriangle,
  RotateCcw,
  Download,
  CheckSquare,
  Square,
} from 'lucide-react';
import { exportToCsv } from '@/lib/export-utils';

const CATEGORY_LABELS: Record<ProductCategory, string> = {
  REGULAR: 'Regular',
  MIX_FRUIT: 'Mix Fruit',
  VIT_A: 'Paket Vit-A',
  VIT_B: 'Paket Vit-B',
  VIT_C: 'Paket Vit-C',
  SINGLE_FRUIT: 'Jus Tunggal',
  VITAMIN_PACKAGE: 'Paket Vitamin',
  ADDON: 'Add-on',
};

const PRESET_IMAGES = [
  { label: 'Mangga Harum Manis', url: '/images/products/mangga-pet-v3.jpg' },
  { label: 'Alpukat Mentega', url: '/images/products/alpukat-pet-v3.jpg' },
  { label: 'Buah Naga Merah', url: '/images/products/buahnaga-pet-v3.jpg' },
  { label: 'Jeruk Sunkist', url: '/images/products/jeruk-pet-v3.jpg' },
  { label: 'Paket Sunset Vit-C', url: '/images/products/mix-pet-v3.jpg' },
  { label: 'Imun Booster Vit-C', url: '/images/products/vitc-pet-v3.jpg' },
  { label: 'Wortel Segar', url: '/images/products/wortel-pet-v3.jpg' },
  { label: 'Tomat Segar', url: '/images/products/tomat-pet-v3.jpg' },
];

export function ProductManagerSection() {
  const {
    products,
    ingredients,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleProductActive,
    getCupCapacity,
  } = usePos();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<{
    name: string;
    category: ProductCategory;
    basePrice: number;
    imageUrl: string;
    description: string;
    prepTimeMinutes: number;
    isFavorite: boolean;
    isActive: boolean;
    vitamins: ('A' | 'B' | 'C')[];
    recipe: RecipeItem[];
  }>({
    name: '',
    category: 'REGULAR',
    basePrice: 20000,
    imageUrl: '/images/products/mangga-pet-v3.jpg',
    description: '',
    prepTimeMinutes: 2,
    isFavorite: false,
    isActive: true,
    vitamins: ['C'],
    recipe: [
      { ingredientId: 'ing-mangga', quantityRequired: 150 },
      { ingredientId: 'ing-gula', quantityRequired: 30, isFlatOverhead: true },
      { ingredientId: 'ing-cup', quantityRequired: 1, isFlatOverhead: true },
      { ingredientId: 'ing-tutup', quantityRequired: 1, isFlatOverhead: true },
    ],
  });

  // Calculate HPP (Cost of Goods Sold from BOM ingredients)
  const calculateHpp = (recipe: RecipeItem[]) => {
    return recipe.reduce((total, item) => {
      const ing = ingredients.find((i) => i.id === item.ingredientId);
      if (!ing) return total;
      return total + item.quantityRequired * ing.costPerUnit;
    }, 0);
  };

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      selectedCategory === 'ALL' ||
      (selectedCategory === 'FAVORITE' && p.isFavorite) ||
      p.category === selectedCategory;

    const matchesSearch =
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      CATEGORY_LABELS[p.category]?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      category: 'REGULAR',
      basePrice: 22000,
      imageUrl: '/images/products/mangga-pet-v3.jpg',
      description: '',
      prepTimeMinutes: 2,
      isFavorite: false,
      isActive: true,
      vitamins: ['C'],
      recipe: [
        { ingredientId: ingredients[0]?.id || 'ing-mangga', quantityRequired: 150 },
        { ingredientId: 'ing-gula', quantityRequired: 30, isFlatOverhead: true },
        { ingredientId: 'ing-cup', quantityRequired: 1, isFlatOverhead: true },
        { ingredientId: 'ing-tutup', quantityRequired: 1, isFlatOverhead: true },
      ],
    });
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      basePrice: product.basePrice,
      imageUrl: product.imageUrl || '/images/products/mangga-pet-v3.jpg',
      description: product.description || '',
      prepTimeMinutes: product.prepTimeMinutes || 2,
      isFavorite: Boolean(product.isFavorite),
      isActive: product.isActive,
      vitamins: product.vitamins || [],
      recipe: [...product.recipe],
    });
    setIsModalOpen(true);
  };

  // Save Product (Create or Update)
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Nama produk tidak boleh kosong!');
      return;
    }
    if (formData.basePrice <= 0) {
      alert('Harga jual produk harus lebih besar dari Rp 0!');
      return;
    }
    if (formData.recipe.length === 0) {
      alert('Resep BOM wajib memiliki minimal 1 bahan baku!');
      return;
    }

    if (editingProduct) {
      // Update
      const updated: Product = {
        ...editingProduct,
        ...formData,
      };
      updateProduct(updated);
    } else {
      // Create
      addProduct({
        ...formData,
        id: `prod-${Date.now()}`,
      });
    }

    setIsModalOpen(false);
  };

  // Handle recipe builder changes
  const handleRecipeChange = (index: number, field: 'ingredientId' | 'quantityRequired', value: any) => {
    const updatedRecipe = [...formData.recipe];
    if (field === 'quantityRequired') {
      updatedRecipe[index].quantityRequired = Math.max(0, Number(value));
    } else {
      updatedRecipe[index].ingredientId = value;
    }
    setFormData({ ...formData, recipe: updatedRecipe });
  };

  const handleAddRecipeRow = () => {
    setFormData({
      ...formData,
      recipe: [
        ...formData.recipe,
        { ingredientId: ingredients[0]?.id || 'ing-gula', quantityRequired: 10 },
      ],
    });
  };

  const handleRemoveRecipeRow = (index: number) => {
    setFormData({
      ...formData,
      recipe: formData.recipe.filter((_, i) => i !== index),
    });
  };

  const toggleVitamin = (vit: 'A' | 'B' | 'C') => {
    const exists = formData.vitamins.includes(vit);
    setFormData({
      ...formData,
      vitamins: exists
        ? formData.vitamins.filter((v) => v !== vit)
        : [...formData.vitamins, vit],
    });
  };

  // Bulk actions
  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filteredProducts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredProducts.map((p) => p.id));
    }
  };

  const handleBatchToggleStatus = (targetActive: boolean) => {
    selectedIds.forEach((id) => {
      const prod = products.find((p) => p.id === id);
      if (prod && prod.isActive !== targetActive) {
        toggleProductActive(id);
      }
    });
    setSelectedIds([]);
  };

  const handleBatchDelete = () => {
    if (confirm(`Yakin ingin menghapus ${selectedIds.length} produk terpilih?`)) {
      selectedIds.forEach((id) => deleteProduct(id));
      setSelectedIds([]);
    }
  };

  const handleExportProducts = () => {
    const headers = ['ID Produk', 'Nama Menu', 'Kategori', 'Harga Jual', 'Status', 'Favorit', 'Jumlah Bahan BOM'];
    const rows = products.map((p) => [
      p.id,
      p.name,
      CATEGORY_LABELS[p.category] || p.category,
      p.basePrice,
      p.isActive ? 'AKTIF' : 'NONAKTIF',
      p.isFavorite ? 'YA' : 'TIDAK',
      p.recipe.length,
    ]);
    exportToCsv(`katalog-menu-vitamine-${new Date().toISOString().slice(0, 10)}`, headers, rows);
  };

  // Stats calculation
  const totalProducts = products.length;
  const activeProducts = products.filter((p) => p.isActive).length;
  const favoriteProducts = products.filter((p) => p.isFavorite).length;

  return (
    <div className="space-y-6">
      {/* 1. Header & Quick Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-[#0F1E1B] border border-white/10 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-white font-display tracking-tight">
              Manajemen Katalog Menu Buah
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-[#00E565]/20 text-[#00E565] text-xs font-mono font-bold border border-[#00E565]/30">
              CRUD Active
            </span>
          </div>
          <p className="text-xs text-white/60 mt-1 max-w-2xl">
            Kelola menu jus buah, harga jual final kasir, foto tampilan, formula resep BOM, dan status ketersediaan di layar POS.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto">
          <button
            type="button"
            onClick={handleExportProducts}
            className="px-4 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#00E565]" />
            <span>Export Katalog</span>
          </button>

          <button
            type="button"
            onClick={handleOpenCreate}
            className="btn-kilat px-5 py-2.5 rounded-2xl bg-[#00B14F] hover:bg-[#00E565] text-white hover:text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#00B14F]/30 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Tambah Menu Baru</span>
          </button>
        </div>
      </div>

      {/* 2. Metric Mini Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        <div className="p-4 rounded-2xl bg-[#0F1E1B] border border-white/10 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-white/60">Total Menu</span>
            <div className="text-2xl font-black text-white font-mono mt-0.5">{totalProducts}</div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-white/5 text-[#00E565] flex items-center justify-center">
            <Package className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0F1E1B] border border-white/10 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-white/60">Aktif di Kasir POS</span>
            <div className="text-2xl font-black text-[#00E565] font-mono mt-0.5">{activeProducts}</div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-[#00E565]/15 text-[#00E565] flex items-center justify-center">
            <Check className="w-5 h-5 stroke-[2.5]" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0F1E1B] border border-white/10 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-white/60">Menu Favorit (Quick Pick)</span>
            <div className="text-2xl font-black text-amber-400 font-mono mt-0.5">{favoriteProducts}</div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center">
            <Star className="w-5 h-5 fill-amber-400" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0F1E1B] border border-white/10 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-white/60">Rata-Rata Margin HPP</span>
            <div className="text-2xl font-black text-[#00E565] font-mono mt-0.5">~69.2%</div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-[#00E565]/15 text-[#00E565] flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 3. Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-2xl bg-[#0F1E1B] border border-white/10">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full sm:w-auto pb-1 sm:pb-0">
          {[
            { id: 'ALL', label: 'Semua Menu' },
            { id: 'FAVORITE', label: '★ Favorit' },
            { id: 'REGULAR', label: 'Regular' },
            { id: 'MIX_FRUIT', label: 'Mix Fruit' },
            { id: 'VIT_A', label: 'Vit-A' },
            { id: 'VIT_B', label: 'Vit-B' },
            { id: 'VIT_C', label: 'Vit-C' },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-[#00B14F] text-white shadow-xs'
                  : 'bg-white/5 text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari menu jus..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-[#00E565] transition-all"
          />
        </div>
      </div>

      {/* Bulk Action Bar */}
      {selectedIds.length > 0 && (
        <div className="p-3 px-5 rounded-2xl bg-[#00B14F] text-white flex flex-wrap items-center justify-between gap-3 shadow-lg shadow-[#00B14F]/30 animate-in slide-in-from-top-2">
          <div className="flex items-center gap-2 text-xs font-bold">
            <CheckSquare className="w-4 h-4" />
            <span>{selectedIds.length} menu terpilih</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleBatchToggleStatus(true)}
              className="px-3 py-1 rounded-xl bg-white/20 hover:bg-white text-white hover:text-slate-950 text-xs font-bold transition-colors cursor-pointer"
            >
              Aktifkan di POS
            </button>
            <button
              type="button"
              onClick={() => handleBatchToggleStatus(false)}
              className="px-3 py-1 rounded-xl bg-white/20 hover:bg-white text-white hover:text-slate-950 text-xs font-bold transition-colors cursor-pointer"
            >
              Nonaktifkan di POS
            </button>
            <button
              type="button"
              onClick={handleBatchDelete}
              className="px-3 py-1 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              Hapus Terpilih
            </button>
            <button
              type="button"
              onClick={() => setSelectedIds([])}
              className="p-1 rounded-lg hover:bg-white/20 text-white/80 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 4. Product Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredProducts.map((product) => {
          const hpp = calculateHpp(product.recipe);
          const margin = Math.round(((product.basePrice - hpp) / product.basePrice) * 100);
          const capacity = getCupCapacity(product);

          return (
            <div
              key={product.id}
              className={`p-4 rounded-3xl bg-[#0F1E1B] border transition-all duration-200 flex flex-col justify-between ${
                product.isActive
                  ? 'border-white/10 hover:border-[#00B14F]/50 shadow-sm'
                  : 'border-white/5 opacity-60 bg-[#081210]'
              }`}
            >
              <div>
                {/* Header: Image, Title & Favorite */}
                <div className="flex gap-3.5 mb-3">
                  <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-[#081210] border border-white/10 shrink-0">
                    <Image
                      src={product.imageUrl || '/images/products/mangga-pet-v3.jpg'}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                    {product.isFavorite && (
                      <span className="absolute top-1 left-1 w-5 h-5 rounded-md bg-amber-500 text-slate-950 flex items-center justify-center shadow-xs">
                        <Star className="w-3 h-3 fill-slate-950" />
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1.5">
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleToggleSelect(product.id)}
                          className="text-white/40 hover:text-white transition-colors cursor-pointer"
                          title="Pilih produk untuk tindakan massal"
                        >
                          {selectedIds.includes(product.id) ? (
                            <CheckSquare className="w-4 h-4 text-[#00E565]" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-white/5 text-[#00E565] border border-white/10">
                          {CATEGORY_LABELS[product.category] || product.category}
                        </span>
                      </div>

                      {/* Status Toggle Switch */}
                      <button
                        type="button"
                        onClick={() => toggleProductActive(product.id)}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                          product.isActive
                            ? 'bg-[#00E565]/20 text-[#00E565] border border-[#00E565]/30'
                            : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        }`}
                        title="Klik untuk ubah status tampil di mesin kasir"
                      >
                        {product.isActive ? 'Aktif di POS' : 'Nonaktif'}
                      </button>
                    </div>

                    <h3 className="font-extrabold text-white text-sm mt-1.5 truncate">
                      {product.name}
                    </h3>

                    {/* Vitamin Pills */}
                    {product.vitamins && product.vitamins.length > 0 && (
                      <div className="flex items-center gap-1 mt-1">
                        {product.vitamins.map((v) => (
                          <span
                            key={v}
                            className="text-[9px] font-bold font-mono px-1 py-0.2 rounded bg-orange-500/15 text-orange-400 border border-orange-500/20"
                          >
                            Vit-{v}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Price, HPP, & Margin Analysis */}
                <div className="p-3 rounded-2xl bg-white/5 border border-white/5 space-y-2 mb-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-white/60 font-medium">Harga Jual Kasir</span>
                    <span className="text-sm font-black text-white font-mono">
                      Rp {product.basePrice.toLocaleString('id-ID')}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-mono pt-1.5 border-t border-white/5">
                    <div className="text-white/60">
                      HPP Resep:{' '}
                      <span className="text-white font-bold">
                        Rp {Math.round(hpp).toLocaleString('id-ID')}
                      </span>
                    </div>
                    <div className="text-[#00E565] font-bold">
                      Margin: {margin}%
                    </div>
                  </div>
                </div>

                {/* BOM Ingredients summary preview */}
                <div className="space-y-1 mb-3">
                  <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider block">
                    Formula BOM ({product.recipe.length} Bahan):
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {product.recipe.map((r, i) => {
                      const ing = ingredients.find((ingred) => ingred.id === r.ingredientId);
                      return (
                        <span
                          key={i}
                          className="text-[10px] px-2 py-0.5 rounded-lg bg-[#081210] border border-white/5 text-white/80 font-mono"
                        >
                          {ing?.name.split(' ')[0] || r.ingredientId}: {r.quantityRequired}
                          {ing?.unit === 'GRAM' ? 'g' : ing?.unit === 'ML' ? 'ml' : 'pc'}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Bottom: Stock Capacity & Actions */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                <div className="text-[11px] font-mono">
                  {capacity > 10 ? (
                    <span className="text-[#00E565] font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00E565]" />
                      Sisa: {capacity} Cup
                    </span>
                  ) : capacity > 0 ? (
                    <span className="text-amber-400 font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      Sisa: {capacity} Cup (Kritis)
                    </span>
                  ) : (
                    <span className="text-rose-400 font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                      Bahan Habis
                    </span>
                  )}
                </div>

                {/* Edit & Delete Action Buttons */}
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(product)}
                    className="p-1.5 rounded-xl bg-white/5 hover:bg-[#00B14F] text-white/80 hover:text-white transition-colors cursor-pointer"
                    title="Edit Menu & Resep"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeleteConfirmId(product.id)}
                    className="p-1.5 rounded-xl bg-white/5 hover:bg-rose-600 text-white/80 hover:text-white transition-colors cursor-pointer"
                    title="Hapus Produk"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 5. Create / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150 select-none">
          <div className="w-full max-w-2xl bg-[#0F1E1B] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-5 border-b border-white/10 flex items-center justify-between bg-[#0B1E19]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#00B14F]/20 text-[#00E565] flex items-center justify-center">
                  <Package className="w-5 h-5 stroke-[2.4]" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white font-display">
                    {editingProduct ? 'Edit Menu Jus & Resep BOM' : 'Tambah Menu Jus Buah Baru'}
                  </h3>
                  <p className="text-[11px] text-white/60">
                    Konfigurasi nama, harga jual kasir, dan formula bahan baku per cup.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form Content */}
            <form onSubmit={handleSaveProduct} className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-5">
              {/* Basic Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-white/70 block mb-1">
                    Nama Menu Produk *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Contoh: Jus Mangga Harum Manis"
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#00E565] font-semibold"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-white/70 block mb-1">
                    Kategori Menu
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-[#0B1E19] border border-white/10 text-xs text-white focus:outline-none focus:border-[#00E565] font-semibold"
                  >
                    <option value="REGULAR">Regular (Jus Tunggal)</option>
                    <option value="MIX_FRUIT">Mix Fruit (Campuran)</option>
                    <option value="VIT_A">Paket Vitamin A</option>
                    <option value="VIT_B">Paket Vitamin B</option>
                    <option value="VIT_C">Paket Vitamin C</option>
                    <option value="ADDON">Add-on / Tambahan</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-white/70 block mb-1">
                    Harga Jual Bersih Kasir (Rp) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1000}
                    step={1000}
                    value={formData.basePrice}
                    onChange={(e) => setFormData({ ...formData, basePrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-[#00E565] font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-white/70 block mb-1">
                    Estimasi Waktu Racik (Menit)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={15}
                    value={formData.prepTimeMinutes}
                    onChange={(e) => setFormData({ ...formData, prepTimeMinutes: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-[#00E565] font-mono"
                  />
                </div>
              </div>

              {/* Photo Selector Presets */}
              <div>
                <label className="text-[11px] font-bold text-white/70 block mb-1.5">
                  Foto Produk (Pilih Preset atau Masukkan URL)
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 mb-2">
                  {PRESET_IMAGES.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setFormData({ ...formData, imageUrl: preset.url })}
                      className={`relative w-full aspect-square rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                        formData.imageUrl === preset.url
                          ? 'border-[#00E565] scale-105 shadow-md'
                          : 'border-white/10 hover:border-white/30 opacity-70 hover:opacity-100'
                      }`}
                      title={preset.label}
                    >
                      <Image src={preset.url} alt={preset.label} fill className="object-cover" />
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="URL Foto Gambar Custom..."
                  className="w-full px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white/80 focus:outline-none focus:border-[#00E565] font-mono text-[11px]"
                />
              </div>

              {/* Toggles & Vitamins */}
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-white">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="w-4 h-4 accent-[#00B14F] rounded cursor-pointer"
                    />
                    <span>Aktifkan di Kasir POS</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-white">
                    <input
                      type="checkbox"
                      checked={formData.isFavorite}
                      onChange={(e) => setFormData({ ...formData, isFavorite: e.target.checked })}
                      className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                    />
                    <span className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      Menu Favorit
                    </span>
                  </label>
                </div>

                {/* Vitamin Tags Multi-select */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-semibold text-white/60 mr-1">Vitamins:</span>
                  {(['A', 'B', 'C'] as const).map((vit) => (
                    <button
                      key={vit}
                      type="button"
                      onClick={() => toggleVitamin(vit)}
                      className={`w-7 h-7 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                        formData.vitamins.includes(vit)
                          ? 'bg-orange-500 text-white shadow-xs'
                          : 'bg-white/5 text-white/50 hover:bg-white/10'
                      }`}
                    >
                      {vit}
                    </button>
                  ))}
                </div>
              </div>

              {/* BOM Recipe Formula Builder */}
              <div className="space-y-3 pt-2 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-extrabold text-white flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-orange-400" />
                      <span>Formula Resep Bill of Materials (BOM)</span>
                    </h4>
                    <p className="text-[11px] text-white/60">
                      Bahan yang otomatis dipotong dari stok saat 1 cup jus ini dijual.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddRecipeRow}
                    className="px-3 py-1 rounded-xl bg-white/5 hover:bg-[#00B14F] text-[#00E565] hover:text-white border border-[#00B14F]/30 hover:border-[#00B14F] text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3 stroke-[3]" />
                    <span>Tambah Bahan</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {formData.recipe.map((item, idx) => {
                    const ing = ingredients.find((i) => i.id === item.ingredientId);
                    const subCost = (ing?.costPerUnit || 0) * item.quantityRequired;

                    return (
                      <div
                        key={idx}
                        className="flex items-center gap-2 p-2 rounded-xl bg-white/5 border border-white/5"
                      >
                        {/* Ingredient Select */}
                        <select
                          value={item.ingredientId}
                          onChange={(e) => handleRecipeChange(idx, 'ingredientId', e.target.value)}
                          className="flex-1 px-2.5 py-1.5 rounded-lg bg-[#0B1E19] border border-white/10 text-xs text-white focus:outline-none focus:border-[#00E565] font-semibold"
                        >
                          {ingredients.map((ingred) => (
                            <option key={ingred.id} value={ingred.id}>
                              {ingred.name} ({ingred.unit === 'GRAM' ? 'gr' : ingred.unit === 'ML' ? 'ml' : 'pcs'})
                            </option>
                          ))}
                        </select>

                        {/* Quantity Input */}
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            min={1}
                            value={item.quantityRequired}
                            onChange={(e) => handleRecipeChange(idx, 'quantityRequired', e.target.value)}
                            className="w-20 px-2 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white text-right font-mono font-bold focus:outline-none focus:border-[#00E565]"
                          />
                          <span className="text-[11px] font-mono text-white/60 w-8">
                            {ing?.unit === 'GRAM' ? 'gr' : ing?.unit === 'ML' ? 'ml' : 'pcs'}
                          </span>
                        </div>

                        {/* Cost preview */}
                        <span className="text-[11px] font-mono text-[#00E565] font-semibold w-24 text-right hidden sm:inline">
                          Rp {Math.round(subCost).toLocaleString('id-ID')}
                        </span>

                        {/* Remove */}
                        <button
                          type="button"
                          onClick={() => handleRemoveRecipeRow(idx)}
                          disabled={formData.recipe.length <= 1}
                          className="p-1 rounded-lg hover:bg-rose-600 text-white/50 hover:text-white transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* HPP & Margin Summary Bar */}
                <div className="p-3 rounded-2xl bg-[#00B14F]/10 border border-[#00B14F]/20 flex items-center justify-between text-xs font-mono">
                  <div className="text-white/80">
                    Total HPP Resep:{' '}
                    <span className="font-bold text-white">
                      Rp {Math.round(calculateHpp(formData.recipe)).toLocaleString('id-ID')}
                    </span>
                  </div>
                  <div className="text-[#00E565] font-bold">
                    Estimasi Gross Margin:{' '}
                    {Math.round(
                      ((formData.basePrice - calculateHpp(formData.recipe)) / formData.basePrice) * 100
                    )}
                    %
                  </div>
                </div>
              </div>

              {/* Form Action Buttons */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-white/10 hover:bg-white/5 text-xs font-bold text-white/70 hover:text-white transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="btn-kilat px-6 py-2.5 rounded-xl bg-[#00B14F] hover:bg-[#00E565] text-white hover:text-slate-950 font-black text-xs shadow-lg shadow-[#00B14F]/30 transition-all cursor-pointer"
                >
                  {editingProduct ? 'Perbarui Menu' : 'Simpan Menu Baru'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150 select-none">
          <div className="w-full max-w-sm bg-[#0F1E1B] border border-white/10 rounded-3xl p-6 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6 stroke-[2.2]" />
            </div>

            <div>
              <h4 className="text-base font-extrabold text-white">Hapus Produk Ini?</h4>
              <p className="text-xs text-white/60 mt-1">
                Produk ini akan dihapus permanen dari daftar katalog kasir POS.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-white transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteProduct(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-black text-white shadow-md shadow-rose-600/30 transition-colors cursor-pointer"
              >
                Hapus Menu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

