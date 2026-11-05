# 🍊 VITAMINE — Smart POS & Juice Bar Operations

> Sistem Kasir & Manajemen Stok Bahan Mentah Buah Terintegrasi untuk Outlet Minuman Jus Segar "VITAMINE".

![Version](https://img.shields.io/badge/version-1.0.0--MVP-orange.svg)
![Next.js](https://img.shields.io/badge/Next.js-16.4.3-black.svg)
![React](https://img.shields.io/badge/React-19.3.1-blue.svg)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

---

## 🌟 Fitur Utama

- **Executive Management Dashboard:**
  - **Left Sidebar Navigation:** Navigasi vertikal terstruktur dengan audio feedback, indikator status shift, dan switcher cabang outlet multi-store.
  - **Katalog Produk & Formula Resep (Full CRUD GUI):** Manajemen produk mandiri lengkap dengan pencarian, filter kategori, batch active toggle, serta modal edit harga dan formula resep BOM.
  - **Live Monitor Transaksi POS & Simulasi Antrean:** Pemantauan real-time transaksi kasir masuk, pemisahan metode bayar (Tunai & QRIS), pratinjau struk thermal 58mm, dan simulasi order kasir interaktif.
  - **Rekonsiliasi & Audit Kasir Shift:** Ringkasan cash opname laci kasir, audit selisih (*variance ledger*), dan pelacakan riwayat pergantian shift.
  - **Master Resep BOM & Kalkulator HPP:** Rincian kebutuhan gramatur bahan baku per cup, analisis persentase margin keuntungan (*gross profit margin*), dan simulasi biaya modal.
  - **Pusat Cadangan Data (*Backup & Restore*):** Ekspor & impor seluruh database toko (katalog produk, stok bahan, dan riwayat pesanan) ke file format JSON terenkapsulasi.
  - **Ekspor Laporan Cepat:** Unduh data transaksi dan audit shift kasir dalam format CSV dan JSON hanya dengan 1-klik.
  - **Command Palette Cepat (<kbd>Ctrl+K</kbd> / <kbd>⌘K</kbd>):** Pintasan pencarian universal untuk navigasi instan antar tab dan aksi sistem.
  - **Desain Adaptif & Mobile Drawer:** Tampilan responsif yang mulus di perangkat desktop, tablet, maupun layar smartphone kasir.
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
- **Terminal Kasir POS:** [http://localhost:3000/pos](http://localhost:3000/pos)
- **Executive Dashboard:** [http://localhost:3000/dashboard](http://localhost:3000/dashboard)

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
│   │   ├── pos/
│   │   │   └── page.tsx    # Layar Utama POS Meja Kasir
│   │   └── dashboard/
│   │       └── page.tsx    # Executive Left-Sidebar Dashboard Hub
│   ├── components/
│   │   ├── pos/            # Komponen POS, Kartu Buah, Numpad, & Modal Kasir
│   │   └── dashboard/      # Sidebar, Header, Product CRUD, Live Orders, Audit Kas, BOM Calculator
│   ├── context/
│   │   └── PosContext.tsx  # State Management Kasir, Shift, & BOM Engine
│   ├── lib/
│   │   ├── audio-effects.ts # Web Audio Synthesizer (SFX Click & Beep)
│   │   ├── export-utils.ts  # CSV & JSON Reporting Engine
│   │   ├── broadcast.ts    # Dual-Screen BroadcastChannel Synchronizer
│   │   ├── mock-data.ts    # Master Resep Buah & Inventory Awal
│   │   └── printer-escpos.ts # Driver ESC/POS Thermal 58mm
│   └── types/
│       └── index.ts        # TypeScript Type Definitions
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

