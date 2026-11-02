# 🍊 VITAMINE — Smart POS & Juice Bar Operations

> Sistem Kasir & Manajemen Stok Bahan Mentah Buah Terintegrasi untuk Outlet Minuman Jus Segar "VITAMINE".

![Version](https://img.shields.io/badge/version-1.0.0--MVP-orange.svg)
![Next.js](https://img.shields.io/badge/Next.js-16.4.3-black.svg)
![React](https://img.shields.io/badge/React-19.3.1-blue.svg)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

---

## 🌟 Fitur Utama

- **Katalog Kartu Buah Interaktif (*Fruit Cards UI*):** Navigasi visual menu jus dengan foto buah asli, label harga net final, dan status ketersediaan stok real-time (*Sisa Cup / Habis*).
- **Otomasi Pemotongan Resep (*Bill of Materials - BOM*):** Setiap cup transaksi otomatis memotong gramatur buah segar, gula cair, cup, tutup, dan sedotan secara atomik di inventaris.
- **Navigasi Cepat Keyboard & Mouse (Sub-Second Ergonomics):**
  - <kbd>F2</kbd> : Cari Menu
  - <kbd>F4</kbd> : Cek Stok Real-Time
  - <kbd>F8</kbd> : Bayar Tunai & Fokus Numpad
  - <kbd>F9</kbd> : Bayar QRIS Statis
  - <kbd>Enter</kbd> : Proses Checkout & Cetak Struk
  - <kbd>Esc</kbd> : Tutup Modal / Batal Pilihan
- **Struk Thermal 58mm (Direct ESC/POS):** Format cetak 32-kolom terintegrasi via WebUSB / Web Serial API di browser Chrome tanpa dialog OS yang lambat.
- **Kebijakan Transaksi Final (*No-Void*):** Transaksi yang struknya telah dicetak terkunci permanen demi akurasi pembukuan dan audit kasir.
- **Serah Terima Shift & Cash Opname:** Perhitungan fisik uang kas per pecahan (Rp100rb, Rp50rb, dst.), kalkulasi selisih otomatis (*Balance / Minus / Surplus*), dan catatan wajib saat ada variansi.
- **Manajemen Stok Harian:** Form *Order Stok Pagi* (penerimaan bahan) dan *Retur Stok* (klasifikasi *Waste/Busuk* vs *Kembali ke Chiller*).
- **Dual-Screen Customer Display:** Sinkronisasi antar-layar via `BroadcastChannel API` (Layar Idle: Fullscreen Promo Slider; Layar Aktif: Split-Screen 60% Keranjang & 40% Mini Promo).

---

## 🚀 Quick Start

### 1. Instalasi Dependensi
```bash
npm install
```

### 2. Jalankan Mode Pengembangan (Dev Server)
```bash
npm run dev
```
Buka browser di **[http://localhost:3000/pos](http://localhost:3000/pos)**.

### 3. Build Produksi
```bash
npm run build
npm start
```

---

## 📂 Struktur Direktori Proyek

```
VITAMINE/
├── PRD.md                  # Dokumen Product Requirement Document lengkap (v1.1.0)
├── DESIGN_BRIEF.md         # Dokumen Design Brief & Token UI/UX
├── src/
│   ├── app/
│   │   ├── globals.css     # Tailwind CSS tokens & Print styling 58mm
│   │   ├── layout.tsx      # Root HTML Layout & Google Fonts
│   │   ├── page.tsx        # Landing Page Verifikasi Sistem
│   │   └── pos/
│   │       └── page.tsx    # Layar Utama POS Meja Kasir
│   ├── components/pos/
│   │   ├── NavbarPOS.tsx         # Header POS & Hardware Indicators
│   │   ├── FruitCard.tsx         # Kartu Menu Buah & Live Cup Counter
│   │   ├── ModifierModal.tsx     # Popover Sugar/Ice/Size Customization
│   │   ├── CartPanel.tsx         # Sticky Cart & Fast Numpad Payment Hub
│   │   ├── StockCheckerModal.tsx # Cek Stok Real-Time (F4)
│   │   ├── MorningStockModal.tsx # Input Penerimaan Stok Pagi
│   │   ├── StockReturnModal.tsx  # Retur Sisa Bahan (Waste vs Chiller)
│   │   ├── CashOpnameModal.tsx   # Rekonsiliasi Kas Laci Serah Terima
│   │   ├── ShiftOpenModal.tsx    # Modal Buka Shift Kasir
│   │   └── ReceiptPrintView.tsx  # Hidden 58mm Thermal Print Layout
│   ├── context/
│   │   └── PosContext.tsx  # State Management Kasir, Shift, & BOM Engine
│   ├── lib/
│   │   ├── broadcast.ts    # Dual-Screen BroadcastChannel Synchronizer
│   │   ├── mock-data.ts    # Master Resep Buah & Inventory Awal
│   │   └── printer-escpos.ts # Driver ESC/POS Thermal 58mm
│   └── types/
│       └── index.ts        # TypeScript Type Definitions
├── package.json
└── tailwind.config.ts
```

---

## 🎨 Design Tokens

- **Brand Primary (Citrus Sunrise):** `#FF6B00`
- **Success / In-Stock (Fresh Lime):** `#10B981`
- **Danger / Waste (Pulp Berry):** `#E11D48`
- **Warning / Low Stock (Sunshine Lemon):** `#F59E0B`
- **Neutral Surface:** `#0B0F17` (Dark Obsidian) & `#F8FAFC` (Light Slate POS Canvas)

---

## 📄 Dokumentasi Lengkap
- [PRD.md](file:///d:/MRIOR/VITAMINE/PRD.md)
- [DESIGN_BRIEF.md](file:///d:/MRIOR/VITAMINE/DESIGN_BRIEF.md)

&copy; 2026 VITAMINE Juice Bar. All rights reserved.

