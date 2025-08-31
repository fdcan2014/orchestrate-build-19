// Tipos para o sistema administrativo

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  stores: string[]; // IDs das lojas que o usuário tem acesso
  status: 'active' | 'inactive' | 'blocked';
  last_login?: string;
  created_at: string;
  updated_at: string;
  metadata?: UserMetadata;
}

export interface UserMetadata {
  two_factor_enabled: boolean;
  last_password_change: string;
  failed_login_attempts: number;
  blocked_until?: string;
  preferences: {
    language: string;
    timezone: string;
    theme: 'light' | 'dark';
    notifications: NotificationPreferences;
  };
}

export interface NotificationPreferences {
  email: boolean;
  whatsapp: boolean;
  push: boolean;
  sales_alerts: boolean;
  stock_alerts: boolean;
  system_alerts: boolean;
}

export interface UserRole {
  id: string;
  name: string;
  level: 'super_admin' | 'admin_loja' | 'gerente' | 'vendedor' | 'cliente';
  permissions: Permission[];
  description?: string;
  created_at: string;
}

export interface Permission {
  id: string;
  module: string; // 'users', 'products', 'sales', 'reports', etc.
  action: string; // 'create', 'read', 'update', 'delete', 'list'
  resource?: string; // ID específico do recurso (opcional)
}

export interface Store {
  id: string;
  name: string;
  slug: string; // Para subdomínio
  domain?: string; // Domínio customizado
  cnpj?: string;
  email: string;
  phone: string;
  address: StoreAddress;
  plan: SubscriptionPlan;
  status: 'active' | 'inactive' | 'suspended';
  settings: StoreSettings;
  owner_id: string;
  created_at: string;
  updated_at: string;
}

export interface StoreAddress {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipcode: string;
  country: string;
}

export interface StoreSettings {
  currency: string;
  timezone: string;
  language: string;
  tax_config: TaxConfig;
  payment_methods: string[];
  theme: StoreTheme;
  inventory_policy: 'shared' | 'exclusive';
  features: StoreFeatures;
}

export interface TaxConfig {
  tax_rate: number;
  tax_included: boolean;
  fiscal_number?: string;
  state_registration?: string;
}

export interface StoreTheme {
  primary_color: string;
  secondary_color: string;
  logo_url?: string;
  favicon_url?: string;
  background_color: string;
  font_family: string;
}

export interface StoreFeatures {
  multi_store: boolean;
  inventory_management: boolean;
  crm: boolean;
  reports: boolean;
  integrations: boolean;
  custom_domain: boolean;
  white_label: boolean;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  type: 'free' | 'basic' | 'professional' | 'enterprise';
  price: number;
  billing_cycle: 'monthly' | 'yearly';
  limits: PlanLimits;
  features: string[];
  expires_at?: string;
  auto_renew: boolean;
}

export interface PlanLimits {
  users: number;
  products: number;
  stores: number;
  sales_per_month: number;
  storage_gb: number;
  api_calls_per_hour: number;
}

export interface AuditLog {
  id: string;
  user_id: string;
  user_name: string;
  store_id?: string;
  action: string;
  resource: string;
  resource_id?: string;
  details: any;
  ip_address: string;
  user_agent: string;
  timestamp: string;
}

export interface SystemAlert {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  target: 'global' | 'store' | 'user';
  target_id?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'active' | 'read' | 'dismissed';
  expires_at?: string;
  created_at: string;
}

export interface Plugin {
  id: string;
  name: string;
  description: string;
  version: string;
  author: string;
  category: string;
  price: number;
  icon_url?: string;
  status: 'active' | 'inactive' | 'available';
  required_plan: string[];
  settings?: PluginSettings;
  installed_stores: string[];
}

export interface PluginSettings {
  [key: string]: any;
}

export interface Integration {
  id: string;
  name: string;
  type: 'payment' | 'shipping' | 'marketing' | 'crm' | 'erp';
  provider: string;
  config: IntegrationConfig;
  status: 'connected' | 'disconnected' | 'error';
  last_sync?: string;
  store_id: string;
}

export interface IntegrationConfig {
  api_key?: string;
  secret?: string;
  webhook_url?: string;
  settings: { [key: string]: any };
}

export interface SystemStats {
  total_stores: number;
  active_stores: number;
  total_users: number;
  active_users: number;
  total_sales_today: number;
  total_revenue_month: number;
  server_status: 'healthy' | 'warning' | 'error';
  api_response_time: number;
  storage_used_gb: number;
  storage_limit_gb: number;
}