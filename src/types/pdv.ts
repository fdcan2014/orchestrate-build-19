export interface ProductVariation {
  id: string;
  name: string; // Ex: "Cor", "Tamanho"
  value: string; // Ex: "Azul", "M"
  price_adjustment: number; // Valor adicional/desconto
  stock?: number; // Estoque específico da variação
}

export interface ProductComposition {
  product_id: string;
  quantity: number;
  unit_cost?: number;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  barcode: string;
  sku: string;
  stock: number;
  category: string;
  image?: string;
  description?: string;
  weight?: number;
  unit?: 'kg' | 'g' | 'un' | 'm' | 'cm';
  
  // Recursos avançados
  type: 'simple' | 'variable' | 'composite' | 'fractional';
  variations?: ProductVariation[];
  composition?: ProductComposition[]; // Para produtos compostos
  is_fractional?: boolean; // Para produtos vendidos por peso/metro
  min_stock?: number; // Estoque mínimo
  max_stock?: number; // Estoque máximo
  cost_price?: number; // Preço de custo
  manage_stock?: boolean; // Se gerencia estoque
  track_stock?: boolean; // Se rastrear movimentações
}

export interface CartItem extends Product {
  quantity: number;
  notes?: string;
  discount?: number;
  totalPrice?: number;
  selected_variations?: ProductVariation[]; // Variações selecionadas
  fractional_quantity?: number; // Para produtos fracionados (ex: 1.5kg)
  fractional_unit?: string; // Unidade fracionada (kg, metros, etc)
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  document?: string;
  address?: string;
  loyaltyPoints: number;
  totalPurchases: number;
  lastPurchase: string;
  birthday?: string;
}

export interface PaymentMethod {
  id: 'money' | 'credit_card' | 'debit_card' | 'pix' | 'digital_wallet';
  name: string;
  icon: any;
  color: string;
}

export interface PaymentSplit {
  id: string;
  method: PaymentMethod['id'];
  amount: number;
  installments?: number;
  reference?: string;
}

export interface Sale {
  id: string;
  items: CartItem[];
  customer?: Customer;
  payments: PaymentSplit[];
  subtotal: number;
  taxes: number;
  discount: number;
  total: number;
  cashier: string;
  timestamp: string;
  receipt?: string;
  notes?: string;
}

export interface CashRegister {
  id: string;
  name: string;
  store_id: string;
  initial_amount: number;
  current_amount: number;
  opened_at: string;
  opened_by: string;
  closed_at?: string;
  closed_by?: string;
  status: 'open' | 'closed';
  transactions: CashTransaction[];
}

export interface CashTransaction {
  id: string;
  type: 'sale' | 'supply' | 'withdrawal';
  amount: number;
  description: string;
  timestamp: string;
  user: string;
}

export interface Promotion {
  id: string;
  name: string;
  type: 'percentage' | 'fixed' | 'buy_x_get_y';
  value: number;
  conditions: any;
  active: boolean;
  start_date: string;
  end_date: string;
}