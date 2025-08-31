import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  Package, 
  ShoppingCart, 
  BarChart3,
  Settings,
  ChevronDown,
  Wrench
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState } from "react";

const menuItems = [
  {
    title: "Dashboard",
    url: "/",
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

export function AdminSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const currentPath = location.pathname;
  const [openGroups, setOpenGroups] = useState<string[]>([]);

  const isActive = (path: string) => currentPath === path;
  const isGroupActive = (items?: { url: string }[]) => 
    items?.some(item => currentPath.startsWith(item.url));

  const toggleGroup = (title: string) => {
    setOpenGroups(prev => 
      prev.includes(title) 
        ? prev.filter(g => g !== title)
        : [...prev, title]
    );
  };

  const getNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-primary text-primary-foreground font-medium hover:bg-primary/90" 
      : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground";

  return (
    <Sidebar 
      className={collapsed ? "w-16" : "w-64"} 
      collapsible="icon"
    >
      <SidebarContent className="gap-0">
        {/* Logo */}
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Building2 className="w-5 h-5 text-primary-foreground" />
            </div>
            {!collapsed && (
              <div>
                <h1 className="font-bold text-sidebar-foreground">SaaS Admin</h1>
                <p className="text-xs text-sidebar-foreground/60">Painel Modular</p>
              </div>
            )}
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {item.items ? (
                    <Collapsible
                      open={openGroups.includes(item.title) || isGroupActive(item.items)}
                      onOpenChange={() => toggleGroup(item.title)}
                    >
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                          className={
                            isGroupActive(item.items)
                              ? "bg-sidebar-accent text-sidebar-accent-foreground"
                              : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                          }
                        >
                          <item.icon className="w-4 h-4" />
                          {!collapsed && (
                            <>
                              <span>{item.title}</span>
                              <ChevronDown className="ml-auto w-4 h-4 transition-transform" />
                            </>
                          )}
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      {!collapsed && (
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item.items.map((subItem) => (
                              <SidebarMenuSubItem key={subItem.url}>
                                <SidebarMenuSubButton asChild>
                                  <NavLink 
                                    to={subItem.url} 
                                    className={getNavLinkClass}
                                  >
                                    <span>{subItem.title}</span>
                                  </NavLink>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      )}
                    </Collapsible>
                  ) : (
                    <SidebarMenuButton asChild>
                      <NavLink to={item.url!} className={getNavLinkClass}>
                        <item.icon className="w-4 h-4" />
                        {!collapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}