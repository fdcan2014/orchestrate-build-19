export interface Category {
  id: string;
  name: string;
  description?: string;
  parent_id?: string;
  color?: string;
  icon?: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
  children?: Category[];
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  sku: string;
  barcode?: string;
  category_id?: string;
  brand?: string;
  price: number;
  cost_price?: number;
  min_stock: number;
  status: 'active' | 'inactive';
  is_service: boolean;
  has_variations: boolean;
  weight?: number;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
  };
  images?: string[];
  created_at: string;
  updated_at: string;
  category?: Category;
  stock_levels?: ProductStock[];
  variations?: ProductVariation[];
}

export interface ProductStock {
  id: string;
  product_id: string;
  store_id: string;
  quantity: number;
  reserved_quantity: number;
  available_quantity: number;
  last_movement?: string;
  updated_at: string;
  store?: {
    id: string;
    name: string;
  };
}

export interface ProductVariation {
  id: string;
  product_id: string;
  name: string;
  sku: string;
  barcode?: string;
  price: number;
  cost_price?: number;
  attributes: Record<string, string>; // e.g., { "color": "red", "size": "M" }
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
  stock_levels?: ProductStock[];
}

export interface CreateProductData {
  name: string;
  description?: string;
  sku: string;
  barcode?: string;
  category_id?: string;
  brand?: string;
  price: number;
  cost_price?: number;
  min_stock: number;
  status: 'active' | 'inactive';
  is_service: boolean;
  has_variations: boolean;
  weight?: number;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
  };
  images?: string[];
}

export interface CreateCategoryData {
  name: string;
  description?: string;
  parent_id?: string;
  color?: string;
  icon?: string;
  status: 'active' | 'inactive';
}