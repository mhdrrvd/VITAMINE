'use client';

import React from 'react';
import { usePos } from '@/context/PosContext';
import { ThermalPrinter58mm } from '@/lib/printer-escpos';

export function ReceiptPrintView() {
  const { lastOrder } = usePos();

  if (!lastOrder) return null;

  const receiptText = ThermalPrinter58mm.generateReceiptText(lastOrder);

  return (
    <div id="thermal-receipt-print" className="hidden print:block">
      <pre className="font-mono text-[11px] leading-tight whitespace-pre text-black">
        {receiptText}
      </pre>
    </div>
  );
}

