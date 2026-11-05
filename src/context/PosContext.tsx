'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  User,
  Shift,
  Ingredient,
  Product,
  CartItem,
  Order,
  OrderType,
  DeliveryPlatform,
  OrderStatus,
  PaymentMethod,
  CustomOptions,
  StockMovement,
  CashDenominationCount,
} from '@/types';
import {
  INITIAL_USERS,
  INITIAL_INGREDIENTS,
  INITIAL_PRODUCTS,
  INITIAL_RECENT_ORDERS,
} from '@/lib/mock-data';
import { ThermalPrinter58mm } from '@/lib/printer-escpos';

interface PosContextType {
  // Auth & Shift
  currentUser: User;
  currentShift: Shift | null;
  openShift: (startingCash: number) => void;
  closeShift: (
    actualCash: number,
    discrepancy: number,
    note: string,
    denominations: CashDenominationCount[]
  ) => Order | null;

  // Catalog & Inventory
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  addProduct: (product: Omit<Product, 'id'> | Product) => Product;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  toggleProductActive: (productId: string) => void;
  ingredients: Ingredient[];
  getCupCapacity: (product: Product) => number;
  addMorningStock: (stockInputs: { ingredientId: string; quantity: number }[]) => void;
  receiveMorningStock: (stockInputs: { ingredientId: string; quantity: number }[]) => void;
  returnStock: (returnInputs: { ingredientId: string; quantity: number; isWaste: boolean; reason: string }[]) => void;

  // Cart & Transaction
  cart: CartItem[];
  addToCart: (product: Product, options: CustomOptions, quantity?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, delta: number) => void;
  clearCart: () => void;
  cartTotal: number;

  // Checkout
  paymentMethod: PaymentMethod;
  setPaymentMethod: (method: PaymentMethod) => void;
  cashTendered: number;
  setCashTendered: (amount: number) => void;
  changeGiven: number;
  processCheckout: (meta?: {
    orderType?: OrderType;
    deliveryPlatform?: DeliveryPlatform;
    deliveryRefNumber?: string;
  }) => Promise<Order | null>;

  // Recent Orders & Printing
  recentOrders: Order[];
  lastOrder: Order | null;
  reprintReceipt: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;

  // Modal Controls
  isOrderModalOpen: boolean;
  setIsOrderModalOpen: (open: boolean) => void;
  isHistoryModalOpen: boolean;
  setIsHistoryModalOpen: (open: boolean) => void;
  isStockModalOpen: boolean;
  setIsStockModalOpen: (open: boolean) => void;
  isMorningStockModalOpen: boolean;
  setIsMorningStockModalOpen: (open: boolean) => void;
  isReturnStockModalOpen: boolean;
  setIsReturnStockModalOpen: (open: boolean) => void;
  isCashOpnameModalOpen: boolean;
  setIsCashOpnameModalOpen: (open: boolean) => void;
  selectedProductForModifier: Product | null;
  setSelectedProductForModifier: (prod: Product | null) => void;

  // Search & Filter
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
}

const PosContext = createContext<PosContextType | undefined>(undefined);

export function PosProvider({ children }: { children: React.ReactNode }) {
  // Default Cashier User
  const [currentUser] = useState<User>(INITIAL_USERS[0]);

  // Shift State
  const [currentShift, setCurrentShift] = useState<Shift | null>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('vitamine_current_shift');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error(e);
        }
      }
    }
    // Default open shift for convenience if not closed
    return {
      id: 'shift-101',
      userId: INITIAL_USERS[0].id,
      userName: INITIAL_USERS[0].name,
      startTime: new Date().toISOString(),
      startingCash: 200000,
      systemCashTotal: 200000,
      status: 'OPEN',
    };
  });

  // Ingredients (Live Inventory)
  const [ingredients, setIngredients] = useState<Ingredient[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('vitamine_ingredients');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error(e);
        }
      }
    }
    return INITIAL_INGREDIENTS;
  });

  // Products (Live Menu Catalog with LocalStorage persistence)
  const [products, setProducts] = useState<Product[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('vitamine_products');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error(e);
        }
      }
    }
    return INITIAL_PRODUCTS;
  });

  // Save products to local storage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('vitamine_products', JSON.stringify(products));
    }
  }, [products]);

  // CRUD Product Actions
  const addProduct = (newProd: Omit<Product, 'id'> | Product): Product => {
    const id = 'id' in newProd && newProd.id ? newProd.id : `prod-${Date.now()}`;
    const productToAdd: Product = { ...newProd, id };
    setProducts((prev) => [productToAdd, ...prev]);
    return productToAdd;
  };

  const updateProduct = (updatedProd: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updatedProd.id ? updatedProd : p)));
  };

  const deleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const toggleProductActive = (productId: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, isActive: !p.isActive } : p))
    );
  };

  // Cart
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CASH');
  const [cashTendered, setCashTendered] = useState<number>(0);
  const [recentOrders, setRecentOrders] = useState<Order[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('vitamine_recent_orders');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error(e);
        }
      }
    }
    return INITIAL_RECENT_ORDERS;
  });
  const [lastOrder, setLastOrder] = useState<Order | null>(null);

  // Modals
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [isMorningStockModalOpen, setIsMorningStockModalOpen] = useState(false);
  const [isReturnStockModalOpen, setIsReturnStockModalOpen] = useState(false);
  const [isCashOpnameModalOpen, setIsCashOpnameModalOpen] = useState(false);
  const [selectedProductForModifier, setSelectedProductForModifier] = useState<Product | null>(null);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  // Save state to local storage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('vitamine_ingredients', JSON.stringify(ingredients));
      if (currentShift) {
        localStorage.setItem('vitamine_current_shift', JSON.stringify(currentShift));
      } else {
        localStorage.removeItem('vitamine_current_shift');
      }
    }
  }, [ingredients, currentShift]);

  // Calculate Cup Capacity per Product based on BOM
  const getCupCapacity = useCallback(
    (product: Product): number => {
      let maxCups = Infinity;
      for (const recipeItem of product.recipe) {
        const ing = ingredients.find((i) => i.id === recipeItem.ingredientId);
        if (!ing) return 0;
        const cupsPossible = Math.floor(ing.currentStock / recipeItem.quantityRequired);
        if (cupsPossible < maxCups) {
          maxCups = cupsPossible;
        }
      }
      return maxCups === Infinity ? 0 : maxCups;
    },
    [ingredients]
  );

  // Cart Calculations
  const cartTotal = cart.reduce((sum, item) => sum + item.subtotal, 0);
  const changeGiven = paymentMethod === 'CASH' && cashTendered >= cartTotal ? cashTendered - cartTotal : 0;

  // Add to Cart with Recipe Verification & Quantity Support
  const addToCart = (product: Product, options: CustomOptions, qtyToAdd: number = 1) => {
    const qty = Math.max(1, qtyToAdd);
    const capacity = getCupCapacity(product);
    const existingInCart = cart.filter((i) => i.productId === product.id).reduce((sum, i) => sum + i.quantity, 0);

    if (capacity < existingInCart + qty) {
      alert(`Stok bahan baku untuk ${product.name} tidak mencukupi untuk menambah ${qty} porsi! (Sisa kapasitas: ${Math.max(0, capacity - existingInCart)} cup)`);
      return;
    }

    // Size large extra price
    const extraPrice = options.size === 'LARGE' ? 5000 : 0;
    const unitPrice = product.basePrice + extraPrice;

    // Check if identical item (same options) exists
    const existingItemIndex = cart.findIndex(
      (item) =>
        item.productId === product.id &&
        item.options.sugarLevel === options.sugarLevel &&
        item.options.iceLevel === options.iceLevel &&
        item.options.size === options.size
    );

    if (existingItemIndex > -1) {
      const updated = [...cart];
      updated[existingItemIndex].quantity += qty;
      updated[existingItemIndex].subtotal = updated[existingItemIndex].quantity * updated[existingItemIndex].unitPrice;
      setCart(updated);
    } else {
      const newItem: CartItem = {
        id: `cart-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        productId: product.id,
        name: product.name,
        unitPrice,
        quantity: qty,
        subtotal: unitPrice * qty,
        options,
        imageUrl: product.imageUrl,
      };
      setCart([...cart, newItem]);
    }
  };

  const removeFromCart = (cartItemId: string) => {
    setCart(cart.filter((item) => item.id !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, delta: number) => {
    setCart(
      cart
        .map((item) => {
          if (item.id === cartItemId) {
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;

            // Check BOM capacity
            const prod = products.find((p) => p.id === item.productId);
            if (prod && delta > 0) {
              const capacity = getCupCapacity(prod);
              const totalInCart = cart
                .filter((i) => i.productId === item.productId)
                .reduce((sum, i) => sum + i.quantity, 0);
              if (totalInCart >= capacity) {
                alert(`Bahan tidak mencukupi untuk menambah porsi!`);
                return item;
              }
            }

            return {
              ...item,
              quantity: newQty,
              subtotal: newQty * item.unitPrice,
            };
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => {
    setCart([]);
    setCashTendered(0);
  };

  // Shift Management
  const openShift = (startingCash: number) => {
    const newShift: Shift = {
      id: `shift-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      startTime: new Date().toISOString(),
      startingCash,
      systemCashTotal: startingCash,
      status: 'OPEN',
    };
    setCurrentShift(newShift);
  };

  const closeShift = (
    actualCash: number,
    discrepancy: number,
    note: string,
    denominations: CashDenominationCount[]
  ) => {
    if (!currentShift) return null;
    const closedShift: Shift = {
      ...currentShift,
      endTime: new Date().toISOString(),
      actualCashCounted: actualCash,
      cashDiscrepancy: discrepancy,
      note,
      status: 'CLOSED',
    };
    setCurrentShift(null);
    return null;
  };

  // Morning Stock In
  const addMorningStock = (stockInputs: { ingredientId: string; quantity: number }[]) => {
    setIngredients((prev) =>
      prev.map((ing) => {
        const input = stockInputs.find((s) => s.ingredientId === ing.id);
        if (input && input.quantity > 0) {
          return {
            ...ing,
            currentStock: ing.currentStock + input.quantity,
            updatedAt: new Date().toISOString(),
          };
        }
        return ing;
      })
    );
  };

  // Return Stock
  const returnStock = (
    returnInputs: { ingredientId: string; quantity: number; isWaste: boolean; reason: string }[]
  ) => {
    setIngredients((prev) =>
      prev.map((ing) => {
        const input = returnInputs.find((r) => r.ingredientId === ing.id);
        if (input && input.quantity > 0) {
          return {
            ...ing,
            currentStock: Math.max(0, ing.currentStock - input.quantity),
            updatedAt: new Date().toISOString(),
          };
        }
        return ing;
      })
    );
  };

  // Process Checkout & Print
  const processCheckout = async (meta?: {
    orderType?: OrderType;
    deliveryPlatform?: DeliveryPlatform;
    deliveryRefNumber?: string;
  }): Promise<Order | null> => {
    if (cart.length === 0) return null;
    if (paymentMethod === 'CASH' && cashTendered < cartTotal) {
      alert(`Uang tunai kurang! Tagihan: Rp ${cartTotal.toLocaleString('id-ID')}, Diterima: Rp ${cashTendered.toLocaleString('id-ID')}`);
      return null;
    }

    const orderNumber = `VIT-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder: Order = {
      id: `order-${Date.now()}`,
      orderNumber,
      shiftId: currentShift?.id || 'no-shift',
      cashierId: currentUser.id,
      cashierName: currentUser.name,
      items: [...cart],
      totalAmount: cartTotal,
      paymentMethod,
      orderType: meta?.orderType || 'PICK_UP',
      deliveryPlatform: meta?.deliveryPlatform,
      deliveryRefNumber: meta?.deliveryRefNumber,
      status: 'PREPARING',
      cashTendered: paymentMethod === 'CASH' ? cashTendered : undefined,
      changeGiven: paymentMethod === 'CASH' ? changeGiven : undefined,
      isPrinted: true,
      createdAt: new Date().toISOString(),
    };

    // 1. Atomic BOM Deduction
    const updatedIngredients = [...ingredients];
    for (const item of cart) {
      const prod = products.find((p) => p.id === item.productId);
      if (prod) {
        for (const recipeItem of prod.recipe) {
          const ingIndex = updatedIngredients.findIndex((i) => i.id === recipeItem.ingredientId);
          if (ingIndex > -1) {
            const deduction = recipeItem.quantityRequired * item.quantity;
            updatedIngredients[ingIndex].currentStock = Math.max(
              0,
              updatedIngredients[ingIndex].currentStock - deduction
            );
          }
        }
      }
    }
    setIngredients(updatedIngredients);

    // 2. Update Cash in Shift if Cash payment
    if (paymentMethod === 'CASH' && currentShift) {
      setCurrentShift({
        ...currentShift,
        systemCashTotal: currentShift.systemCashTotal + cartTotal,
      });
    }

    // 3. Save Order & History
    const updatedOrders = [newOrder, ...recentOrders];
    setRecentOrders(updatedOrders);
    setLastOrder(newOrder);
    if (typeof window !== 'undefined') {
      localStorage.setItem('vitamine_recent_orders', JSON.stringify(updatedOrders));
    }

    // 4. Direct ESC/POS Print (or browser print trigger)
    try {
      await ThermalPrinter58mm.printDirectSerial(newOrder);
    } catch (e) {
      console.warn('Direct WebUSB printing not active; using browser print fallback', e);
    }

    // 6. Clear Cart
    clearCart();

    return newOrder;
  };

  const reprintReceipt = (order: Order) => {
    setLastOrder(order);
    try {
      ThermalPrinter58mm.printDirectSerial(order);
    } catch (e) {
      console.warn('Direct WebUSB printing not active', e);
    }
    setTimeout(() => {
      window.print();
    }, 200);
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setRecentOrders((prev) => {
      const updated = prev.map((o) => (o.id === orderId ? { ...o, status } : o));
      if (typeof window !== 'undefined') {
        localStorage.setItem('vitamine_recent_orders', JSON.stringify(updated));
      }
      return updated;
    });
  };

  return (
    <PosContext.Provider
      value={{
        currentUser,
        currentShift,
        openShift,
        closeShift,
        products,
        setProducts,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleProductActive,
        ingredients,
        getCupCapacity,
        addMorningStock,
        receiveMorningStock: addMorningStock,
        returnStock,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        paymentMethod,
        setPaymentMethod,
        cashTendered,
        setCashTendered,
        changeGiven,
        processCheckout,
        recentOrders,
        lastOrder,
        reprintReceipt,
        updateOrderStatus,
        isOrderModalOpen,
        setIsOrderModalOpen,
        isHistoryModalOpen,
        setIsHistoryModalOpen,
        isStockModalOpen,
        setIsStockModalOpen,
        isMorningStockModalOpen,
        setIsMorningStockModalOpen,
        isReturnStockModalOpen,
        setIsReturnStockModalOpen,
        isCashOpnameModalOpen,
        setIsCashOpnameModalOpen,
        selectedProductForModifier,
        setSelectedProductForModifier,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
      }}
    >
      {children}
    </PosContext.Provider>
  );
}

export function usePos() {
  const context = useContext(PosContext);
  if (!context) {
    throw new Error('usePos must be used within a PosProvider');
  }
  return context;
}

