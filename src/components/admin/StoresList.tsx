import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Store,
  Plus,
  Search,
  MoreVertical,
  Edit,
  Settings,
  BarChart3,
  Users,
  DollarSign,
  Calendar,
  ExternalLink
} from "lucide-react";
import { useAdmin } from "@/contexts/AdminContext";

export function StoresList() {
  const { stores, currentUser, hasPermission } = useAdmin();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPlan, setFilterPlan] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedStore, setSelectedStore] = useState<any>(null);
  const [showStoreDetails, setShowStoreDetails] = useState(false);

  const isSuperAdmin = currentUser?.role.level === 'super_admin';

  const filteredStores = stores.filter(store => {
    const matchesSearch = store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         store.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlan = filterPlan === "all" || store.plan.type === filterPlan;
    const matchesStatus = filterStatus === "all" || store.status === filterStatus;
    
    return matchesSearch && matchesPlan && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default">Ativa</Badge>;
      case 'inactive':
        return <Badge variant="secondary">Inativa</Badge>;
      case 'suspended':
        return <Badge variant="destructive">Suspensa</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPlanBadge = (plan: any) => {
    const colorMap: { [key: string]: string } = {
      free: 'bg-gray-100 text-gray-800',
      basic: 'bg-blue-100 text-blue-800',
      professional: 'bg-green-100 text-green-800',
      enterprise: 'bg-purple-100 text-purple-800',
    };

    return (
      <Badge variant="outline" className={colorMap[plan.type] || 'bg-gray-100 text-gray-800'}>
        {plan.name}
      </Badge>
    );
  };

  const openStoreDetails = (store: any) => {
    setSelectedStore(store);
    setShowStoreDetails(true);
  };

  const calculatePlanUsage = (store: any) => {
    // Mock usage data - em produção viria do banco
    return {
      users: { current: 5, limit: store.plan.limits.users },
      products: { current: 150, limit: store.plan.limits.products },
      sales: { current: 450, limit: store.plan.limits.sales_per_month },
      storage: { current: 2.5, limit: store.plan.limits.storage_gb },
    };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Store className="h-6 w-6" />
            {isSuperAdmin ? 'Todas as Lojas' : 'Minhas Lojas'}
          </h2>
          <p className="text-muted-foreground">
            {isSuperAdmin 
              ? 'Gerencie todas as lojas do sistema'
              : 'Gerencie suas lojas e filiais'
            }
          </p>
        </div>
        
        {hasPermission('stores', 'create') && (
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nova Loja
          </Button>
        )}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={filterPlan} onValueChange={setFilterPlan}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por plano" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os planos</SelectItem>
                <SelectItem value="free">Gratuito</SelectItem>
                <SelectItem value="basic">Básico</SelectItem>
                <SelectItem value="professional">Profissional</SelectItem>
                <SelectItem value="enterprise">Enterprise</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="active">Ativa</SelectItem>
                <SelectItem value="inactive">Inativa</SelectItem>
                <SelectItem value="suspended">Suspensa</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Stores Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Lojas ({filteredStores.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Loja</TableHead>
                <TableHead>Plano</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Criada em</TableHead>
                {isSuperAdmin && <TableHead>Receita</TableHead>}
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStores.map((store) => (
                <TableRow key={store.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{store.name}</div>
                      <div className="text-sm text-muted-foreground">{store.email}</div>
                      {store.domain && (
                        <div className="text-sm text-blue-600 flex items-center gap-1">
                          <ExternalLink className="h-3 w-3" />
                          {store.domain}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {getPlanBadge(store.plan)}
                    <div className="text-sm text-muted-foreground">
                      R$ {store.plan.price.toFixed(2)}/{store.plan.billing_cycle === 'monthly' ? 'mês' : 'ano'}
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(store.status)}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {new Date(store.created_at).toLocaleDateString('pt-BR')}
                    </div>
                  </TableCell>
                  {isSuperAdmin && (
                    <TableCell>
                      <div className="font-medium text-green-600">
                        R$ 2.450,00
                      </div>
                      <div className="text-sm text-muted-foreground">
                        este mês
                      </div>
                    </TableCell>
                  )}
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openStoreDetails(store)}>
                          <BarChart3 className="h-4 w-4 mr-2" />
                          Ver Detalhes
                        </DropdownMenuItem>
                        
                        {hasPermission('stores', 'update') && (
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                        )}
                        
                        <DropdownMenuItem>
                          <Settings className="h-4 w-4 mr-2" />
                          Configurações
                        </DropdownMenuItem>
                        
                        {store.domain && (
                          <DropdownMenuSeparator />
                        )}
                        
                        {store.domain && (
                          <DropdownMenuItem>
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Visitar Loja
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Store Details Dialog */}
      <Dialog open={showStoreDetails} onOpenChange={setShowStoreDetails}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalhes da Loja - {selectedStore?.name}</DialogTitle>
          </DialogHeader>
          
          {selectedStore && (
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Informações Básicas</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <span className="text-sm font-medium">Nome:</span>
                      <p>{selectedStore.name}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Email:</span>
                      <p>{selectedStore.email}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Telefone:</span>
                      <p>{selectedStore.phone}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Status:</span>
                      <div className="mt-1">
                        {getStatusBadge(selectedStore.status)}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Plano Atual</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      {getPlanBadge(selectedStore.plan)}
                    </div>
                    <div>
                      <span className="text-sm font-medium">Valor:</span>
                      <p>R$ {selectedStore.plan.price.toFixed(2)}/{selectedStore.plan.billing_cycle === 'monthly' ? 'mês' : 'ano'}</p>
                    </div>
                    {selectedStore.plan.expires_at && (
                      <div>
                        <span className="text-sm font-medium">Expira em:</span>
                        <p>{new Date(selectedStore.plan.expires_at).toLocaleDateString('pt-BR')}</p>
                      </div>
                    )}
                    <div>
                      <span className="text-sm font-medium">Renovação automática:</span>
                      <p>{selectedStore.plan.auto_renew ? 'Ativada' : 'Desativada'}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Usage Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Uso do Plano</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {(() => {
                      const usage = calculatePlanUsage(selectedStore);
                      return [
                        { key: 'users', label: 'Usuários', icon: Users },
                        { key: 'products', label: 'Produtos', icon: Store },
                        { key: 'sales', label: 'Vendas/mês', icon: DollarSign },
                        { key: 'storage', label: 'Armazenamento (GB)', icon: BarChart3 },
                      ].map(({ key, label, icon: Icon }) => {
                        const data = usage[key as keyof typeof usage];
                        const percentage = (data.current / data.limit) * 100;
                        
                        return (
                          <div key={key} className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Icon className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm font-medium">{label}</span>
                            </div>
                            <div className="space-y-1">
                              <div className="flex justify-between text-sm">
                                <span>{data.current}</span>
                                <span className="text-muted-foreground">/ {data.limit}</span>
                              </div>
                              <Progress value={percentage} />
                              <div className="text-xs text-muted-foreground">
                                {percentage.toFixed(1)}% utilizado
                              </div>
                            </div>
                          </div>
                        );
                      });
                    })()}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Atividade Recente</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Última venda</span>
                      <span className="text-muted-foreground">há 2 horas</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Último login</span>
                      <span className="text-muted-foreground">há 1 dia</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Produtos adicionados</span>
                      <span className="text-muted-foreground">5 esta semana</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}