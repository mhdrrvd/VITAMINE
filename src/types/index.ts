// Model data & types for VITAMINE Smart POS & Inventory

export type Role = 'CASHIER' | 'OWNER';

export interface User {
  id: string;
  name: string;
  username: string;
  role: Role;
  isActive: boolean;
}

export type ShiftStatus = 'OPEN' | 'CLOSED';

export interface Shift {
  id: string;
  userId: string;
  userName: string;
  startTime: string;
  endTime?: string;
  startingCash: number;
  systemCashTotal: number;
  actualCashCounted?: number;
  cashDiscrepancy?: number;
  note?: string;
  status: ShiftStatus;
}

export type IngredientUnit = 'GRAM' | 'ML' | 'PCS';

export interface Ingredient {
  id: string;
  name: string;
  unit: IngredientUnit;
  currentStock: number;
  minStockAlert: number;
  costPerUnit: number;
  updatedAt: string;
}

export interface RecipeItem {
  ingredientId: string;
  quantityRequired: number;
  isFlatOverhead?: boolean; // Liquid sugar, cup, straw, etc.
}

export interface Product {
  id: string;
  name: string;
  category: 'SINGLE_FRUIT' | 'VITAMIN_PACKAGE' | 'ADDON';
  basePrice: number; // Net final price (No tax)
  imageUrl: string;
  recipe: RecipeItem[];
  isActive: boolean;
  colorAccent?: string; // Hex color token for Fruit Card
}

export interface CustomOptions {
  sugarLevel: '100%' | '50%' | '0%';
  iceLevel: 'NORMAL' | 'LESS' | 'NO_ICE';
  size: 'REGULAR' | 'LARGE';
  selectedAddons?: string[];
}

export interface CartItem {
  id: string; // unique item uuid in cart
  productId: string;
  name: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
  options: CustomOptions;
  imageUrl: string;
}

export type OrderType = 'PICK_UP' | 'DELIVERY';
export type DeliveryPlatform = 'GOFOOD' | 'GRABFOOD' | 'SHOPEEFOOD';
export type PaymentMethod = 'CASH' | 'QRIS_STATIC';
export type OrderStatus = 'PREPARING' | 'READY' | 'COMPLETED';

export interface Order {
  id: string;
  orderNumber: string;
  shiftId: string;
  cashierId: string;
  cashierName: string;
  items: CartItem[];
  totalAmount: number; // Net final
  paymentMethod: PaymentMethod;
  orderType?: OrderType;
  deliveryPlatform?: DeliveryPlatform;
  deliveryRefNumber?: string;
  status?: OrderStatus;
  cashTendered?: number;
  changeGiven?: number;
  isPrinted: boolean;
  createdAt: string;
}

export type StockMovementType =
  | 'MORNING_IN'
  | 'SALES_DEDUCTION'
  | 'RETURN_WASTE'
  | 'RETURN_STORAGE'
  | 'ADJUSTMENT';

export interface StockMovement {
  id: string;
  ingredientId: string;
  ingredientName: string;
  userId: string;
  referenceId?: string; // orderId or shiftId
  movementType: StockMovementType;
  quantity: number;
  remainingStock: number;
  notes?: string;
  createdAt: string;
}

export interface PromoSlide {
  id: string;
  title: string;
  imageUrl: string;
  displayOrder: number;
  durationSeconds: number;
  isActive: boolean;
}

// Cash Opname Breakdown Interface
export interface CashDenominationCount {
  nominal: number;
  label: string;
  count: number;
  subtotal: number;
}

