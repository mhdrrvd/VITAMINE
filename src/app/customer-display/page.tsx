'use client';

import React, { useState, useEffect } from 'react';
import { CartItem, Order, PromoSlide } from '@/types';
import { INITIAL_PROMOS } from '@/lib/mock-data';
import { DisplayBroadcastManager, DisplayMessage } from '@/lib/broadcast';
import { PromoCarousel } from '@/components/customer/PromoCarousel';
import { LiveCartView } from '@/components/customer/LiveCartView';
import { CompletionView } from '@/components/customer/CompletionView';
import { Maximize2, Minimize2, Wifi } from 'lucide-react';

export default function CustomerDisplayPage() {
  const [promos, setPromos] = useState<PromoSlide[]>(INITIAL_PROMOS);
  const [displayState, setDisplayState] = useState<'IDLE' | 'CART_ACTIVE' | 'COMPLETED'>('IDLE');
  const [cartData, setCartData] = useState<{
    items: CartItem[];
    subtotal: number;
    totalAmount: number;
    paymentMethod?: string;
    cashTendered?: number;
    changeGiven?: number;
  }>({
    items: [],
    subtotal: 0,
    totalAmount: 0,
    paymentMethod: 'CASH',
    cashTendered: 0,
    changeGiven: 0,
  });

  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isConnected, setIsConnected] = useState(true);

  // Initialize listener
  useEffect(() => {
    const bm = new DisplayBroadcastManager();

    // Check last saved state in localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('vitamine_display_state');
      if (saved) {
        try {
          const parsed: DisplayMessage = JSON.parse(saved);
          handleMessage(parsed);
        } catch (e) {
          console.error(e);
        }
      }
    }

    bm.onMessage((msg: DisplayMessage) => {
      setIsConnected(true);
      handleMessage(msg);
    });

    return () => {
      bm.close();
    };
  }, []);

  const handleMessage = (msg: DisplayMessage) => {
    if (msg.type === 'CART_UPDATED' && msg.cart) {
      if (msg.cart.items && msg.cart.items.length > 0) {
        setCartData(msg.cart);
        setDisplayState('CART_ACTIVE');
      } else {
        setDisplayState('IDLE');
      }
    } else if (msg.type === 'TRANSACTION_COMPLETED' && msg.order) {
      setCompletedOrder(msg.order);
      setDisplayState('COMPLETED');
    } else if (msg.type === 'DISPLAY_IDLE') {
      setDisplayState('IDLE');
      setCartData({
        items: [],
        subtotal: 0,
        totalAmount: 0,
        paymentMethod: 'CASH',
        cashTendered: 0,
        changeGiven: 0,
      });
    } else if (msg.type === 'PROMO_UPDATED' && msg.promos) {
      setPromos(msg.promos);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  return (
    <div className="w-screen h-screen overflow-hidden bg-slate-950 relative font-sans">
      {/* 1. View Switcher based on State */}
      {displayState === 'COMPLETED' && completedOrder ? (
        <CompletionView
          order={completedOrder}
          onDone={() => {
            setDisplayState('IDLE');
            setCompletedOrder(null);
          }}
        />
      ) : displayState === 'CART_ACTIVE' && cartData.items.length > 0 ? (
        <LiveCartView
          items={cartData.items}
          subtotal={cartData.subtotal}
          totalAmount={cartData.totalAmount}
          paymentMethod={cartData.paymentMethod}
          cashTendered={cartData.cashTendered}
          changeGiven={cartData.changeGiven}
          promos={promos}
        />
      ) : (
        <PromoCarousel promos={promos} />
      )}

      {/* Floating Controls Bar (top right, semi-transparent) */}
      <div className="absolute top-4 right-4 z-40 flex items-center gap-2 opacity-30 hover:opacity-100 transition-opacity">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[11px] font-semibold text-emerald-400 border border-white/10 shadow-sm">
          <Wifi className="w-3.5 h-3.5" />
          <span>Kasir Terhubung</span>
        </div>

        <button
          onClick={toggleFullscreen}
          title="Toggle Fullscreen (F11)"
          className="p-2 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md border border-white/10 shadow-sm transition-transform active:scale-95"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}
