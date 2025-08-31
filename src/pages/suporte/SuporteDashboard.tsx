import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Wrench, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Users,
  Package,
  TrendingUp,
  Calendar
} from "lucide-react";

interface DashboardStats {
  total_os: number;
  os_abertas: number;
  os_em_andamento: number;
  os_concluidas_mes: number;
  os_vencidas: number;
  tempo_medio_resolucao: number;
  sla_cumprido: number;
  receita_mes: number;
}

export function SuporteDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    total_os: 0,
    os_abertas: 0,
    os_em_andamento: 0,
    os_concluidas_mes: 0,
    os_vencidas: 0,
    tempo_medio_resolucao: 0,
    sla_cumprido: 0,
    receita_mes: 0,
  });

  const [osRecentes, setOsRecentes] = useState([
    {
      id: "1",
      numero: "OS-2024-001",
      cliente: "João Silva",
      dispositivo: "iPhone 14 Pro",
      status: "em_manutencao",
      prioridade: "alta",
      tecnico: "Carlos Técnico",
      data_abertura: "2024-01-15"
    },
    {
      id: "2", 
      numero: "OS-2024-002",
      cliente: "Maria Santos",
      dispositivo: "Samsung Galaxy S23",
      status: "aguardando_peca",
      prioridade: "media",
      tecnico: "Ana Técnica",
      data_abertura: "2024-01-14"
    },
    {
      id: "3",
      numero: "OS-2024-003", 
      cliente: "Pedro Costa",
      dispositivo: "MacBook Pro",
      status: "aberta",
      prioridade: "critica",
      tecnico: "José Técnico",
      data_abertura: "2024-01-13"
    }
  ]);

  useEffect(() => {
    // Simulando dados do dashboard
    setStats({
      total_os: 1247,
      os_abertas: 45,
      os_em_andamento: 78,
      os_concluidas_mes: 156,
      os_vencidas: 12,
      tempo_medio_resolucao: 3.2,
      sla_cumprido: 87,
      receita_mes: 45670.50,
    });
  }, []);

  const getStatusBadge = (status: string) => {
    const variants = {
      'aberta': 'bg-blue-100 text-blue-800',
      'aguardando_peca': 'bg-yellow-100 text-yellow-800', 
      'em_manutencao': 'bg-orange-100 text-orange-800',
      'concluida': 'bg-green-100 text-green-800',
      'entregue': 'bg-gray-100 text-gray-800',
      'cancelada': 'bg-red-100 text-red-800',
    };
    return variants[status as keyof typeof variants] || 'bg-gray-100 text-gray-800';
  };

  const getPrioridadeBadge = (prioridade: string) => {
    const variants = {
      'baixa': 'bg-gray-100 text-gray-800',
      'media': 'bg-blue-100 text-blue-800',
      'alta': 'bg-orange-100 text-orange-800', 
      'critica': 'bg-red-100 text-red-800',
    };
    return variants[prioridade as keyof typeof variants] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Técnico</h1>
        <p className="text-muted-foreground">
          Visão geral do suporte técnico e ordens de serviço
        </p>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">OS Abertas</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.os_abertas}</div>
            <p className="text-xs text-muted-foreground">
              +2 desde ontem
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Andamento</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.os_em_andamento}</div>
            <p className="text-xs text-muted-foreground">
              -3 desde ontem
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Concluídas (Mês)</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.os_concluidas_mes}</div>
            <p className="text-xs text-muted-foreground">
              +12% em relação ao mês anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">OS Vencidas</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.os_vencidas}</div>
            <p className="text-xs text-muted-foreground">
              Requer atenção imediata
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Métricas de Performance */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Tempo Médio de Resolução</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.tempo_medio_resolucao} dias</div>
            <Progress value={65} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              Meta: 3 dias
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">SLA Cumprido</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.sla_cumprido}%</div>
            <Progress value={stats.sla_cumprido} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              Meta: 90%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Receita do Mês</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {stats.receita_mes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              +15% em relação ao mês anterior
            </p>
          </CardContent>
        </Card>
      </div>

      {/* OS Recentes */}
      <Card>
        <CardHeader>
          <CardTitle>Ordens de Serviço Recentes</CardTitle>
          <CardDescription>
            Últimas OS abertas no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {osRecentes.map((os) => (
              <div key={os.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{os.numero}</p>
                    <Badge className={getStatusBadge(os.status)}>
                      {os.status.replace('_', ' ')}
                    </Badge>
                    <Badge className={getPrioridadeBadge(os.prioridade)}>
                      {os.prioridade}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {os.cliente} - {os.dispositivo}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Técnico: {os.tecnico} | Aberta em: {new Date(os.data_abertura).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {new Date(os.data_abertura).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}