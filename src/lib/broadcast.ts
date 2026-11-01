import { CartItem, Order, PromoSlide } from '@/types';

export const DISPLAY_CHANNEL_NAME = 'vitamine_display_channel';

export type DisplayMessageType =
  | 'CART_UPDATED'
  | 'TRANSACTION_COMPLETED'
  | 'DISPLAY_IDLE'
  | 'PROMO_UPDATED';

export interface DisplayMessage {
  type: DisplayMessageType;
  cart?: {
    items: CartItem[];
    subtotal: number;
    totalAmount: number;
    paymentMethod?: string;
    cashTendered?: number;
    changeGiven?: number;
  };
  order?: Order;
  promos?: PromoSlide[];
  timestamp: number;
}

export class DisplayBroadcastManager {
  private channel: BroadcastChannel | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      this.channel = new BroadcastChannel(DISPLAY_CHANNEL_NAME);
    }
  }

  public sendMessage(msg: DisplayMessage) {
    if (this.channel) {
      this.channel.postMessage(msg);
    }
    // Fallback to localStorage for cross-tab event
    if (typeof window !== 'undefined') {
      localStorage.setItem('vitamine_display_state', JSON.stringify(msg));
    }
  }

  public onMessage(callback: (msg: DisplayMessage) => void) {
    if (this.channel) {
      this.channel.onmessage = (event) => {
        callback(event.data);
      };
    }
    // Storage event fallback
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (event) => {
        if (event.key === 'vitamine_display_state' && event.newValue) {
          try {
            const data = JSON.parse(event.newValue);
            callback(data);
          } catch (e) {
            console.error('Failed to parse display state:', e);
          }
        }
      });
    }
  }

  public close() {
    if (this.channel) {
      this.channel.close();
    }
  }
}

