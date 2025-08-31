import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Users,
  Store,
  DollarSign,
  TrendingUp,
  Activity,
  Server,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  Settings,
  Shield
} from "lucide-react";
import { useAdmin } from "@/contexts/AdminContext";
import { SystemAlerts } from "@/components/admin/SystemAlerts";
import { RecentActivity } from "@/components/admin/RecentActivity";
import { StoresList } from "@/components/admin/StoresList";
import { UsersList } from "@/components/admin/UsersList";

export default function AdminDashboard() {
  const { currentUser, systemStats, hasPermission } = useAdmin();
  const [activeTab, setActiveTab] = useState("overview");

  const isSuperAdmin = currentUser?.role.level === 'super_admin';

  if (!systemStats) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p>Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  const getServerStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'error': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getServerStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-4 w-4" />;
      case 'warning': return <AlertTriangle className="h-4 w-4" />;
      case 'error': return <AlertTriangle className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            {isSuperAdmin ? 'Dashboard Admin' : 'Dashboard da Loja'}
          </h1>
          <p className="text-muted-foreground">
            {isSuperAdmin 
              ? 'Visão geral do sistema completo'
              : 'Gerencie sua loja e operações'
            }
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant={currentUser?.status === 'active' ? 'default' : 'destructive'}>
            {currentUser?.role.name}
          </Badge>
          
          {hasPermission('system', 'read') && (
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Configurações
            </Button>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="stores">Lojas</TabsTrigger>
          <TabsTrigger value="users">Usuários</TabsTrigger>
          <TabsTrigger value="system">Sistema</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {isSuperAdmin && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total de Lojas</CardTitle>
                  <Store className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{systemStats.total_stores}</div>
                  <p className="text-xs text-muted-foreground">
                    {systemStats.active_stores} ativas
                  </p>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{systemStats.active_users}</div>
                <p className="text-xs text-muted-foreground">
                  +{systemStats.total_users - systemStats.active_users} inativos
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Vendas Hoje</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  R$ {systemStats.total_sales_today.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <p className="text-xs text-muted-foreground">
                  +20.1% em relação a ontem
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Receita Mensal</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  R$ {systemStats.total_revenue_month.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <p className="text-xs text-muted-foreground">
                  +15.3% vs mês anterior
                </p>
              </CardContent>
            </Card>
          </div>

          {/* System Health */}
          {isSuperAdmin && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Status do Sistema
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={getServerStatusColor(systemStats.server_status)}>
                        {getServerStatusIcon(systemStats.server_status)}
                      </div>
                      <span className="font-medium">Servidores</span>
                    </div>
                    <Badge variant={systemStats.server_status === 'healthy' ? 'default' : 'destructive'}>
                      {systemStats.server_status === 'healthy' ? 'Saudável' : 'Problema'}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Tempo de resposta da API</span>
                      <span>{systemStats.api_response_time}ms</span>
                    </div>
                    <Progress value={Math.min(systemStats.api_response_time / 10, 100)} />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Armazenamento usado</span>
                      <span>{systemStats.storage_used_gb}GB / {systemStats.storage_limit_gb}GB</span>
                    </div>
                    <Progress value={(systemStats.storage_used_gb / systemStats.storage_limit_gb) * 100} />
                  </div>
                </CardContent>
              </Card>

              <SystemAlerts />
            </div>
          )}

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RecentActivity />
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Métricas Rápidas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Planos Ativos</span>
                    <span>142 lojas</span>
                  </div>
                  <div className="grid grid-cols-4 gap-1">
                    <div className="bg-green-200 h-2 rounded"></div>
                    <div className="bg-blue-200 h-2 rounded"></div>
                    <div className="bg-yellow-200 h-2 rounded"></div>
                    <div className="bg-purple-200 h-2 rounded"></div>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Free: 45</span>
                    <span>Basic: 52</span>
                    <span>Pro: 35</span>
                    <span>Enterprise: 10</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Renovações este mês</span>
                    <span className="text-green-600">89%</span>
                  </div>
                  <Progress value={89} />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Novos usuários (30d)</span>
                    <span>+234</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    15% a mais que o mês anterior
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Stores Tab */}
        <TabsContent value="stores">
          <StoresList />
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users">
          <UsersList />
        </TabsContent>

        {/* System Tab */}
        <TabsContent value="system" className="space-y-6">
          {hasPermission('system', 'read') ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="h-5 w-5" />
                  Configurações do Sistema
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>Configurações avançadas do sistema serão implementadas aqui.</p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <Shield className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-muted-foreground">
                  Você não tem permissão para acessar as configurações do sistema.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}