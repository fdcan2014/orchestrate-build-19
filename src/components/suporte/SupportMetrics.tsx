import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from "recharts";
import {
  Clock,
  TrendingUp,
  Users,
  MessageSquare,
  Star,
  Target,
  Award,
  Activity
} from "lucide-react";

interface SupportMetrics {
  response_time_avg: number;
  resolution_time_avg: number;
  satisfaction_score: number;
  first_contact_resolution: number;
  tickets_resolved_today: number;
  tickets_pending: number;
  agent_utilization: number;
  sla_compliance: number;
}

export function SupportMetrics() {
  const [metrics, setMetrics] = useState<SupportMetrics>({
    response_time_avg: 2.5,
    resolution_time_avg: 4.2,
    satisfaction_score: 4.6,
    first_contact_resolution: 78,
    tickets_resolved_today: 23,
    tickets_pending: 12,
    agent_utilization: 85,
    sla_compliance: 92
  });

  const responseTimeData = [
    { hour: '09:00', time: 1.2 },
    { hour: '10:00', time: 2.1 },
    { hour: '11:00', time: 1.8 },
    { hour: '12:00', time: 3.2 },
    { hour: '13:00', time: 2.5 },
    { hour: '14:00', time: 1.9 },
    { hour: '15:00', time: 2.8 },
    { hour: '16:00', time: 2.2 },
    { hour: '17:00', time: 1.5 },
  ];

  const ticketVolumeData = [
    { day: 'Seg', tickets: 45, resolved: 42 },
    { day: 'Ter', tickets: 52, resolved: 48 },
    { day: 'Qua', tickets: 38, resolved: 35 },
    { day: 'Qui', tickets: 61, resolved: 58 },
    { day: 'Sex', tickets: 49, resolved: 46 },
    { day: 'Sáb', tickets: 23, resolved: 21 },
    { day: 'Dom', tickets: 15, resolved: 14 },
  ];

  const satisfactionData = [
    { rating: '5 estrelas', count: 156, color: '#10b981' },
    { rating: '4 estrelas', count: 89, color: '#3b82f6' },
    { rating: '3 estrelas', count: 34, color: '#f59e0b' },
    { rating: '2 estrelas', count: 12, color: '#ef4444' },
    { rating: '1 estrela', count: 5, color: '#dc2626' },
  ];

  const agentPerformanceData = [
    { agent: 'Ana', resolved: 45, avg_time: 3.2, satisfaction: 4.8 },
    { agent: 'Carlos', resolved: 38, avg_time: 4.1, satisfaction: 4.5 },
    { agent: 'Maria', resolved: 42, avg_time: 3.8, satisfaction: 4.7 },
    { agent: 'João', resolved: 35, avg_time: 4.5, satisfaction: 4.3 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Métricas de Suporte</h1>
        <p className="text-muted-foreground">
          Acompanhe a performance e qualidade do atendimento
        </p>
      </div>

      {/* KPIs Principais */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tempo de Resposta</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.response_time_avg}h</div>
            <div className="flex items-center gap-2 mt-2">
              <Progress value={75} className="flex-1" />
              <span className="text-xs text-green-600">-15%</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Meta: 2h
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Satisfação</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.satisfaction_score}/5.0</div>
            <div className="flex items-center gap-2 mt-2">
              <Progress value={metrics.satisfaction_score * 20} className="flex-1" />
              <span className="text-xs text-green-600">+0.2</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Baseado em 296 avaliações
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolução 1º Contato</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.first_contact_resolution}%</div>
            <div className="flex items-center gap-2 mt-2">
              <Progress value={metrics.first_contact_resolution} className="flex-1" />
              <span className="text-xs text-green-600">+5%</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Meta: 80%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">SLA Compliance</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.sla_compliance}%</div>
            <div className="flex items-center gap-2 mt-2">
              <Progress value={metrics.sla_compliance} className="flex-1" />
              <span className="text-xs text-green-600">+3%</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Meta: 95%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Tempo de Resposta por Hora */}
        <Card>
          <CardHeader>
            <CardTitle>Tempo de Resposta por Hora</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={responseTimeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value}h`, 'Tempo médio']} />
                <Line 
                  type="monotone" 
                  dataKey="time" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Volume de Tickets */}
        <Card>
          <CardHeader>
            <CardTitle>Volume de Tickets (Última Semana)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={ticketVolumeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="tickets" fill="#3b82f6" name="Recebidos" />
                <Bar dataKey="resolved" fill="#10b981" name="Resolvidos" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Distribuição de Satisfação */}
        <Card>
          <CardHeader>
            <CardTitle>Distribuição de Satisfação</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={satisfactionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ rating, percent }) => `${rating} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {satisfactionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Performance dos Agentes */}
        <Card>
          <CardHeader>
            <CardTitle>Performance dos Agentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {agentPerformanceData.map((agent) => (
                <div key={agent.agent} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{agent.agent.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{agent.agent}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span>{agent.resolved} resolvidos</span>
                      <span>{agent.avg_time}h médio</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-500" />
                        <span>{agent.satisfaction}</span>
                      </div>
                    </div>
                  </div>
                  <Progress value={(agent.resolved / 50) * 100} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alertas e Recomendações */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-800">
              <Activity className="h-5 w-5" />
              Alertas de Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                <span className="text-sm">Tempo de resposta acima da meta em 3 categorias</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full" />
                <span className="text-sm">12 tickets vencidos precisam de atenção</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                <span className="text-sm">Pico de volume detectado às 14h</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <TrendingUp className="h-5 w-5" />
              Conquistas da Semana
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-green-600" />
                <span className="text-sm">Meta de satisfação atingida (4.6/5.0)</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-green-600" />
                <span className="text-sm">156 tickets resolvidos no primeiro contato</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-green-600" />
                <span className="text-sm">Todos os agentes com performance acima de 4.0</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}