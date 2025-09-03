import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  Package, 
  ShoppingCart, 
  BarChart3,
  Settings,
  ChevronDown,
  Wrench,
  Menu,
  X,
  Home,
  FileText,
  Bell,
  User,
  CreditCard,
  Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const menuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Lojas",
    icon: Building2,
    items: [
      { title: "Gerenciar Lojas", url: "/lojas" },
      { title: "Nova Loja", url: "/lojas/nova" },
    ],
  },
  {
    title: "Usuários",
    icon: Users,
    items: [
      { title: "Gerenciar Usuários", url: "/usuarios" },
      { title: "Permissões", url: "/usuarios/permissoes" },
    ],
  },
  {
    title: "Produtos",
    icon: Package,
    items: [
      { title: "Catálogo", url: "/produtos" },
      { title: "Categorias", url: "/produtos/categorias" },
      { title: "Estoque", url: "/produtos/estoque" },
    ],
  },
  {
    title: "Vendas",
    icon: ShoppingCart,
    items: [
      { title: "PDV", url: "/vendas/pdv" },
      { title: "Histórico", url: "/vendas/historico" },
      { title: "Comissões", url: "/vendas/comissoes" },
    ],
  },
  {
    title: "Suporte Técnico",
    icon: Wrench,
    items: [
      { title: "Dashboard", url: "/suporte/dashboard" },
      { title: "Ordens de Serviço", url: "/suporte/ordens" },
      { title: "Nova OS", url: "/suporte/nova" },
      { title: "Clientes", url: "/suporte/clientes" },
      { title: "Peças", url: "/suporte/pecas" },
      { title: "Relatórios", url: "/suporte/relatorios" },
    ],
  },
  {
    title: "Relatórios",
    icon: BarChart3,
    items: [
      { title: "Financeiro", url: "/relatorios/financeiro" },
      { title: "Vendas", url: "/relatorios/vendas" },
      { title: "Produtos", url: "/relatorios/produtos" },
    ],
  },
  {
    title: "Configurações",
    url: "/configuracoes",
    icon: Settings,
  },
];

export function MaxtonSidebar({ isCollapsed, onToggle }: SidebarProps) {
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['Dashboard']);
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;
  const isGroupActive = (items?: { url: string }[]) => 
    items?.some(item => currentPath.startsWith(item.url));

  const toggleGroup = (title: string) => {
    if (isCollapsed) return;
    
    setExpandedGroups(prev => 
      prev.includes(title) 
        ? prev.filter(g => g !== title)
        : [...prev, title]
    );
  };

  return (
    <div className={cn(
      "maxton-sidebar flex flex-col h-full bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white transition-all duration-300 ease-in-out",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
        <div className={cn("flex items-center gap-3", isCollapsed && "justify-center")}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
            <Home className="w-5 h-5 text-white" />
          </div>
          {!isCollapsed && (
            <div>
              <h1 className="font-bold text-lg text-white">Maxton</h1>
              <p className="text-xs text-slate-300">Admin Dashboard</p>
            </div>
          )}
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="text-slate-300 hover:text-white hover:bg-slate-700/50 p-1.5"
        >
          {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <div key={item.title}>
            {item.items ? (
              <div>
                <button
                  onClick={() => toggleGroup(item.title)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200",
                    "hover:bg-slate-700/50 hover:text-white",
                    isGroupActive(item.items) 
                      ? "bg-gradient-to-r from-blue-600/20 to-blue-500/10 text-blue-300 border-r-2 border-blue-400" 
                      : "text-slate-300",
                    isCollapsed && "justify-center"
                  )}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {!isCollapsed && (
                    <>
                      <span className="flex-1 font-medium">{item.title}</span>
                      <ChevronDown className={cn(
                        "w-4 h-4 transition-transform duration-200",
                        expandedGroups.includes(item.title) ? "rotate-180" : ""
                      )} />
                    </>
                  )}
                </button>
                
                {!isCollapsed && expandedGroups.includes(item.title) && (
                  <div className="ml-6 mt-1 space-y-1 border-l border-slate-700/50 pl-4">
                    {item.items.map((subItem) => (
                      <NavLink
                        key={subItem.url}
                        to={subItem.url}
                        className={({ isActive }) => cn(
                          "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all duration-200",
                          "hover:bg-slate-700/30 hover:text-white",
                          isActive 
                            ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg" 
                            : "text-slate-400"
                        )}
                      >
                        <div className="w-2 h-2 rounded-full bg-current opacity-60" />
                        <span>{subItem.title}</span>
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <NavLink
                to={item.url!}
                className={({ isActive }) => cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                  "hover:bg-slate-700/50 hover:text-white",
                  isActive 
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg" 
                    : "text-slate-300",
                  isCollapsed && "justify-center"
                )}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && <span className="font-medium">{item.title}</span>}
              </NavLink>
            )}
          </div>
        ))}
      </nav>

      {/* Footer */}
      {!isCollapsed && (
        <div className="p-4 border-t border-slate-700/50">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">Admin User</p>
              <p className="text-xs text-slate-400 truncate">admin@maxton.com</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}