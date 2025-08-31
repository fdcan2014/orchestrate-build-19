import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, Store, AuditLog, SystemStats } from '@/types/admin';
import { useToast } from '@/hooks/use-toast';

interface AdminContextType {
  currentUser: User | null;
  currentStore: Store | null;
  stores: Store[];
  users: User[];
  roles: UserRole[];
  systemStats: SystemStats | null;
  auditLogs: AuditLog[];
  
  // User management
  createUser: (userData: Partial<User>) => Promise<boolean>;
  updateUser: (userId: string, userData: Partial<User>) => Promise<boolean>;
  deleteUser: (userId: string) => Promise<boolean>;
  blockUser: (userId: string) => Promise<boolean>;
  unblockUser: (userId: string) => Promise<boolean>;
  
  // Store management
  createStore: (storeData: Partial<Store>) => Promise<boolean>;
  updateStore: (storeId: string, storeData: Partial<Store>) => Promise<boolean>;
  deleteStore: (storeId: string) => Promise<boolean>;
  
  // Role management
  createRole: (roleData: Partial<UserRole>) => Promise<boolean>;
  updateRole: (roleId: string, roleData: Partial<UserRole>) => Promise<boolean>;
  deleteRole: (roleId: string) => Promise<boolean>;
  
  // Permissions
  hasPermission: (module: string, action: string, resourceId?: string) => boolean;
  
  // Audit
  logAction: (action: string, resource: string, details?: any) => void;
  
  // Utils
  switchStore: (storeId: string) => void;
  loading: boolean;
  error: string | null;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentStore, setCurrentStore] = useState<Store | null>(null);
  const [stores, setStores] = useState<Store[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [systemStats, setSystemStats] = useState<SystemStats | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Mock data for development
  useEffect(() => {
    const loadMockData = () => {
      // Mock user roles
      const mockRoles: UserRole[] = [
        {
          id: 'super_admin',
          name: 'Super Admin',
          level: 'super_admin',
          description: 'Acesso completo ao sistema',
          permissions: [
            { id: '1', module: '*', action: '*' },
          ],
          created_at: new Date().toISOString(),
        },
        {
          id: 'admin_loja',
          name: 'Admin da Loja',
          level: 'admin_loja',
          description: 'Administrador da loja',
          permissions: [
            { id: '2', module: 'users', action: 'create' },
            { id: '3', module: 'users', action: 'read' },
            { id: '4', module: 'users', action: 'update' },
            { id: '5', module: 'products', action: '*' },
            { id: '6', module: 'sales', action: '*' },
            { id: '7', module: 'reports', action: 'read' },
          ],
          created_at: new Date().toISOString(),
        },
        {
          id: 'vendedor',
          name: 'Vendedor',
          level: 'vendedor',
          description: 'Vendedor da loja',
          permissions: [
            { id: '8', module: 'products', action: 'read' },
            { id: '9', module: 'sales', action: 'create' },
            { id: '10', module: 'sales', action: 'read' },
            { id: '11', module: 'customers', action: '*' },
          ],
          created_at: new Date().toISOString(),
        },
      ];

      // Mock stores
      const mockStores: Store[] = [
        {
          id: 'store_001',
          name: 'Loja Principal',
          slug: 'loja-principal',
          email: 'contato@loja.com',
          phone: '(11) 99999-9999',
          address: {
            street: 'Rua Principal',
            number: '123',
            neighborhood: 'Centro',
            city: 'São Paulo',
            state: 'SP',
            zipcode: '01000-000',
            country: 'Brasil',
          },
          plan: {
            id: 'professional',
            name: 'Profissional',
            type: 'professional',
            price: 99.90,
            billing_cycle: 'monthly',
            limits: {
              users: 10,
              products: 1000,
              stores: 3,
              sales_per_month: 10000,
              storage_gb: 50,
              api_calls_per_hour: 1000,
            },
            features: ['multi_store', 'crm', 'reports', 'integrations'],
            auto_renew: true,
          },
          status: 'active',
          settings: {
            currency: 'BRL',
            timezone: 'America/Sao_Paulo',
            language: 'pt-BR',
            tax_config: {
              tax_rate: 0.05,
              tax_included: true,
            },
            payment_methods: ['money', 'credit_card', 'pix'],
            theme: {
              primary_color: '#3b82f6',
              secondary_color: '#64748b',
              background_color: '#ffffff',
              font_family: 'Inter',
            },
            inventory_policy: 'exclusive',
            features: {
              multi_store: true,
              inventory_management: true,
              crm: true,
              reports: true,
              integrations: true,
              custom_domain: false,
              white_label: false,
            },
          },
          owner_id: 'user_001',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ];

      // Mock users
      const mockUsers: User[] = [
        {
          id: 'user_001',
          name: 'João Silva',
          email: 'joao@admin.com',
          role: mockRoles[0], // Super Admin
          stores: ['store_001'],
          status: 'active',
          last_login: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          metadata: {
            two_factor_enabled: true,
            last_password_change: new Date().toISOString(),
            failed_login_attempts: 0,
            preferences: {
              language: 'pt-BR',
              timezone: 'America/Sao_Paulo',
              theme: 'light',
              notifications: {
                email: true,
                whatsapp: true,
                push: true,
                sales_alerts: true,
                stock_alerts: true,
                system_alerts: true,
              },
            },
          },
        },
        {
          id: 'user_002',
          name: 'Maria Santos',
          email: 'maria@loja.com',
          role: mockRoles[1], // Admin da Loja
          stores: ['store_001'],
          status: 'active',
          last_login: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          metadata: {
            two_factor_enabled: false,
            last_password_change: new Date().toISOString(),
            failed_login_attempts: 0,
            preferences: {
              language: 'pt-BR',
              timezone: 'America/Sao_Paulo',
              theme: 'light',
              notifications: {
                email: true,
                whatsapp: false,
                push: true,
                sales_alerts: true,
                stock_alerts: true,
                system_alerts: false,
              },
            },
          },
        },
      ];

      // Mock system stats
      const mockStats: SystemStats = {
        total_stores: 157,
        active_stores: 142,
        total_users: 1245,
        active_users: 890,
        total_sales_today: 15420.50,
        total_revenue_month: 485690.25,
        server_status: 'healthy',
        api_response_time: 120,
        storage_used_gb: 125.5,
        storage_limit_gb: 500,
      };

      setRoles(mockRoles);
      setStores(mockStores);
      setUsers(mockUsers);
      setCurrentUser(mockUsers[0]);
      setCurrentStore(mockStores[0]);
      setSystemStats(mockStats);
      setLoading(false);
    };

    loadMockData();
  }, []);

  const hasPermission = (module: string, action: string, resourceId?: string): boolean => {
    if (!currentUser) return false;
    
    const permissions = currentUser.role.permissions;
    
    // Super admin has all permissions
    if (permissions.some(p => p.module === '*' && p.action === '*')) {
      return true;
    }
    
    // Check specific permission
    return permissions.some(p => 
      (p.module === module || p.module === '*') &&
      (p.action === action || p.action === '*') &&
      (!resourceId || !p.resource || p.resource === resourceId)
    );
  };

  const logAction = (action: string, resource: string, details?: any) => {
    if (!currentUser) return;
    
    const log: AuditLog = {
      id: Date.now().toString(),
      user_id: currentUser.id,
      user_name: currentUser.name,
      store_id: currentStore?.id,
      action,
      resource,
      details,
      ip_address: '192.168.1.1', // Em produção viria do request
      user_agent: navigator.userAgent,
      timestamp: new Date().toISOString(),
    };
    
    setAuditLogs(prev => [log, ...prev.slice(0, 99)]); // Manter últimos 100
  };

  const createUser = async (userData: Partial<User>): Promise<boolean> => {
    try {
      const newUser: User = {
        id: Date.now().toString(),
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone,
        role: userData.role || roles[2], // Default to Vendedor
        stores: userData.stores || [],
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        metadata: {
          two_factor_enabled: false,
          last_password_change: new Date().toISOString(),
          failed_login_attempts: 0,
          preferences: {
            language: 'pt-BR',
            timezone: 'America/Sao_Paulo',
            theme: 'light',
            notifications: {
              email: true,
              whatsapp: false,
              push: true,
              sales_alerts: true,
              stock_alerts: true,
              system_alerts: false,
            },
          },
        },
      };
      
      setUsers(prev => [...prev, newUser]);
      logAction('create_user', 'user', { user_id: newUser.id });
      
      toast({
        title: "Usuário criado",
        description: `${newUser.name} foi criado com sucesso`,
      });
      
      return true;
    } catch (error) {
      toast({
        title: "Erro ao criar usuário",
        description: "Ocorreu um erro inesperado",
        variant: "destructive",
      });
      return false;
    }
  };

  const updateUser = async (userId: string, userData: Partial<User>): Promise<boolean> => {
    try {
      setUsers(prev => prev.map(user => 
        user.id === userId 
          ? { ...user, ...userData, updated_at: new Date().toISOString() }
          : user
      ));
      
      logAction('update_user', 'user', { user_id: userId, changes: userData });
      
      toast({
        title: "Usuário atualizado",
        description: "Dados atualizados com sucesso",
      });
      
      return true;
    } catch (error) {
      toast({
        title: "Erro ao atualizar usuário",
        description: "Ocorreu um erro inesperado",
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteUser = async (userId: string): Promise<boolean> => {
    try {
      setUsers(prev => prev.filter(user => user.id !== userId));
      logAction('delete_user', 'user', { user_id: userId });
      
      toast({
        title: "Usuário excluído",
        description: "Usuário removido com sucesso",
      });
      
      return true;
    } catch (error) {
      toast({
        title: "Erro ao excluir usuário",
        description: "Ocorreu um erro inesperado",
        variant: "destructive",
      });
      return false;
    }
  };

  const blockUser = async (userId: string): Promise<boolean> => {
    return await updateUser(userId, { status: 'blocked' });
  };

  const unblockUser = async (userId: string): Promise<boolean> => {
    return await updateUser(userId, { status: 'active' });
  };

  const createStore = async (storeData: Partial<Store>): Promise<boolean> => {
    // Implementation similar to createUser
    return true;
  };

  const updateStore = async (storeId: string, storeData: Partial<Store>): Promise<boolean> => {
    // Implementation similar to updateUser
    return true;
  };

  const deleteStore = async (storeId: string): Promise<boolean> => {
    // Implementation similar to deleteUser
    return true;
  };

  const createRole = async (roleData: Partial<UserRole>): Promise<boolean> => {
    // Implementation for role management
    return true;
  };

  const updateRole = async (roleId: string, roleData: Partial<UserRole>): Promise<boolean> => {
    // Implementation for role management
    return true;
  };

  const deleteRole = async (roleId: string): Promise<boolean> => {
    // Implementation for role management
    return true;
  };

  const switchStore = (storeId: string) => {
    const store = stores.find(s => s.id === storeId);
    if (store) {
      setCurrentStore(store);
      logAction('switch_store', 'store', { store_id: storeId });
    }
  };

  const value: AdminContextType = {
    currentUser,
    currentStore,
    stores,
    users,
    roles,
    systemStats,
    auditLogs,
    createUser,
    updateUser,
    deleteUser,
    blockUser,
    unblockUser,
    createStore,
    updateStore,
    deleteStore,
    createRole,
    updateRole,
    deleteRole,
    hasPermission,
    logAction,
    switchStore,
    loading,
    error,
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}