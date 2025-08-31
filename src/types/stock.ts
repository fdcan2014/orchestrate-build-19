export interface StockMovement {
  id: string;
  product_id: string;
  type: 'in' | 'out' | 'adjustment' | 'transfer';
  quantity: number;
  previous_stock: number;
  new_stock: number;
  reason: string;
  user_id: string;
  store_id: string;
  timestamp: string;
  reference?: string; // Referência da venda, compra, etc.
}

export interface StockAlert {
  id: string;
  product_id: string;
  product_name: string;
  current_stock: number;
  min_stock: number;
  alert_type: 'low_stock' | 'out_of_stock' | 'overstock';
  store_id: string;
  created_at: string;
  resolved: boolean;
}

export interface InventoryCount {
  id: string;
  product_id: string;
  expected_quantity: number;
  actual_quantity: number;
  difference: number;
  user_id: string;
  store_id: string;
  timestamp: string;
  notes?: string;
}

export interface StockTransfer {
  id: string;
  from_store_id: string;
  to_store_id: string;
  product_id: string;
  quantity: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  requested_by: string;
  confirmed_by?: string;
  created_at: string;
  confirmed_at?: string;
}