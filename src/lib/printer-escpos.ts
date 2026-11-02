// ESC/POS Thermal Printer Driver for 58mm (32 characters per line)
import { Order } from '@/types';

export class ThermalPrinter58mm {
  private static readonly MAX_COLS = 32;

  // Format two strings aligned to left and right: e.g. "Total Net" and "Rp 47.000"
  public static formatRow(left: string, right: string): string {
    const spaceCount = this.MAX_COLS - left.length - right.length;
    if (spaceCount <= 0) {
      return `${left.slice(0, this.MAX_COLS - right.length - 1)} ${right}\n`;
    }
    return `${left}${' '.repeat(spaceCount)}${right}\n`;
  }

  public static formatSeparator(): string {
    return `${'-'.repeat(this.MAX_COLS)}\n`;
  }

  public static formatDoubleSeparator(): string {
    return `${'='.repeat(this.MAX_COLS)}\n`;
  }

  // Generate plain text receipt for 58mm printer
  public static generateReceiptText(order: Order): string {
    let receipt = '';

    // Header Center
    receipt += '        VITAMINE JUICE BAR      \n';
    receipt += '   Fresh, Healthy, Energizing   \n';
    receipt += '     Jl. Segar Sehat No. 10     \n';
    receipt += this.formatDoubleSeparator();

    receipt += this.formatRow('No Order:', order.orderNumber);
    receipt += this.formatRow('Waktu:', new Date(order.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }));
    receipt += this.formatRow('Kasir:', order.cashierName);
    const serviceLabel = order.orderType === 'DELIVERY'
      ? `DELIVERY (${order.deliveryPlatform || 'ONLINE'})`
      : 'PICK UP';
    receipt += this.formatRow('Layanan:', serviceLabel);
    if (order.deliveryRefNumber) {
      receipt += this.formatRow('Ref Ojol:', order.deliveryRefNumber);
    }
    receipt += this.formatSeparator();

    // Items
    for (const item of order.items) {
      const itemTitle = `${item.quantity}x ${item.name}`;
      const subtotalStr = `Rp ${item.subtotal.toLocaleString('id-ID')}`;
      receipt += this.formatRow(itemTitle, subtotalStr);

      const modifiers: string[] = [];
      if (item.options.sugarLevel !== '100%') modifiers.push(`Gula: ${item.options.sugarLevel}`);
      if (item.options.iceLevel !== 'NORMAL') modifiers.push(`Es: ${item.options.iceLevel}`);
      if (item.options.size === 'LARGE') modifiers.push('Size Large (+5rb)');

      if (modifiers.length > 0) {
        receipt += `   (${modifiers.join(', ')})\n`;
      }
    }

    receipt += this.formatSeparator();
    receipt += this.formatRow('TOTAL NETT:', `Rp ${order.totalAmount.toLocaleString('id-ID')}`);
    receipt += this.formatRow('Metode Bayar:', order.paymentMethod);

    if (order.paymentMethod === 'CASH') {
      const cash = order.cashTendered || order.totalAmount;
      const change = order.changeGiven || 0;
      receipt += this.formatRow('Tunai:', `Rp ${cash.toLocaleString('id-ID')}`);
      receipt += this.formatRow('Kembalian:', `Rp ${change.toLocaleString('id-ID')}`);
    }

    receipt += this.formatDoubleSeparator();
    receipt += '      TERIMA KASIH ATAS         \n';
    receipt += '      KUNJUNGAN ANDA!           \n';
    receipt += '   IG: @vitamine.freshjuice     \n\n\n\n';

    return receipt;
  }

  // Convert string to ESC/POS binary buffer
  public static generateEscPosBuffer(order: Order): Uint8Array {
    const text = this.generateReceiptText(order);
    const encoder = new TextEncoder();
    const textBytes = encoder.encode(text);

    // ESC @ (Initialize) + textBytes + GS V 66 0 (Paper cut)
    const initCmd = new Uint8Array([0x1B, 0x40]);
    const cutCmd = new Uint8Array([0x1D, 0x56, 0x42, 0x00]);

    const totalLength = initCmd.length + textBytes.length + cutCmd.length;
    const buffer = new Uint8Array(totalLength);

    buffer.set(initCmd, 0);
    buffer.set(textBytes, initCmd.length);
    buffer.set(cutCmd, initCmd.length + textBytes.length);

    return buffer;
  }

  // Direct print via Web Serial API (Chrome)
  public static async printDirectSerial(order: Order): Promise<boolean> {
    if (typeof navigator !== 'undefined' && 'serial' in navigator) {
      try {
        const nav = navigator as unknown as { serial: { requestPort: () => Promise<{ open: (opt: { baudRate: number }) => Promise<void>; writable: WritableStream<Uint8Array>; close: () => Promise<void> }> } };
        const port = await nav.serial.requestPort();
        await port.open({ baudRate: 9600 });
        const writer = port.writable.getWriter();
        const data = this.generateEscPosBuffer(order);
        await writer.write(data);
        writer.releaseLock();
        await port.close();
        return true;
      } catch (err) {
        console.warn('Web Serial print skipped or failed:', err);
      }
    }
    return false;
  }
}

