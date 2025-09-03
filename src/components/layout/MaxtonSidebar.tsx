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
    <aside className={cn(
      "h-screen flex flex-col bg-sidebar-background text-sidebar-foreground transition-all duration-300 ease-in-out overflow-hidden",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className={cn("flex items-center gap-3", isCollapsed && "justify-center")}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-glow">
            <Home className="w-5 h-5 text-primary-foreground" />
          </div>
          {!isCollapsed && (
            <div>
              <h1 className="font-bold text-lg bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Maxton</h1>
              <p className="text-xs text-muted-foreground">Admin Dashboard</p>
            </div>
          )}
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="text-muted-foreground hover:text-foreground hover:bg-accent p-1.5"
        >
          {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation - com rolagem independente */}
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto custom-scrollbar">
        {menuItems.map((item) => (
          <div key={item.title}>
            {item.items ? (
              <div>
                <button
                  onClick={() => toggleGroup(item.title)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200",
                    "hover:bg-accent hover:text-accent-foreground group",
                    isGroupActive(item.items) 
                      ? "bg-gradient-to-r from-primary/20 to-secondary/10 text-primary border-l-2 border-primary" 
                      : "text-muted-foreground",
                    isCollapsed && "justify-center"
                  )}
                >
                  <div className={cn(
                    "p-1.5 rounded-lg transition-all duration-200",
                    isGroupActive(item.items) 
                      ? "bg-gradient-to-br from-primary to-secondary text-primary-foreground shadow-glow" 
                      : "group-hover:bg-muted"
                  )}>
                    <item.icon className="w-4 h-4" />
                  </div>
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
                  <div className="ml-6 mt-1 space-y-0.5 border-l-2 border-border pl-4 animate-fade-in">
                    {item.items.map((subItem) => (
                      <NavLink
                        key={subItem.url}
                        to={subItem.url}
                        className={({ isActive }) => cn(
                          "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200",
                          "hover:bg-accent hover:text-accent-foreground",
                          isActive 
                            ? "bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-glow" 
                            : "text-muted-foreground"
                        )}
                      >
                        <div className={cn(
                          "w-1.5 h-1.5 rounded-full transition-all duration-200",
                          isActive ? "bg-primary-foreground shadow-glow" : "bg-muted-foreground"
                        )} />
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
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group",
                  "hover:bg-accent hover:text-accent-foreground",
                  isActive 
                    ? "bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-glow" 
                    : "text-muted-foreground",
                  isCollapsed && "justify-center"
                )}
              >
                {({ isActive }) => (
                  <>
                    <div className={cn(
                      "p-1.5 rounded-lg transition-all duration-200",
                      isActive 
                        ? "bg-primary-foreground/20" 
                        : "group-hover:bg-muted"
                    )}>
                      <item.icon className="w-4 h-4" />
                    </div>
                    {!isCollapsed && <span className="font-medium">{item.title}</span>}
                  </>
                )}
              </NavLink>
            )}
          </div>
        ))}
      </nav>

      {/* Footer */}
      {!isCollapsed && (
        <div className="p-4 border-t border-sidebar-border bg-gradient-to-r from-primary/5 to-secondary/5">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-card">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-glow">
              <User className="w-4 h-4 text-primary-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">Admin User</p>
              <p className="text-xs text-muted-foreground truncate">admin@maxton.com</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}