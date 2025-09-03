import { MaxtonCard } from "./MaxtonCard";
import { MaxtonTable } from "./MaxtonTable";
import { MaxtonStatsGrid } from "./MaxtonStatsGrid";
import { MaxtonChartCard } from "./MaxtonChartCard";
import { MaxtonActivityFeed } from "./MaxtonActivityFeed";
import { MaxtonNotifications } from "./MaxtonNotifications";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  DollarSign, 
  ShoppingCart, 
  Users, 
  Package,
  TrendingUp,
  TrendingDown,
  Eye,
  MoreHorizontal,
  Calendar,
  Clock,
  BarChart3,
  PieChart
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// Sample data
const recentSales = [
  {
    id: "VND-001",
    customer: "João Silva",
    amount: "R$ 1.259,00",
    status: "Concluída",
    date: "15/01/2024",
    items: 3
  },
  {
    id: "VND-002", 
    customer: "Maria Santos",
    amount: "R$ 892,50",
    status: "Pendente",
    date: "15/01/2024",
    items: 2
  },
  {
    id: "VND-003",
    customer: "Pedro Costa",
    amount: "R$ 2.150,75",
    status: "Concluída",
    date: "14/01/2024",
    items: 5
  }
];

const topProducts = [
  {
    name: "Smartphone Galaxy S24",
    sales: 128,
    revenue: "R$ 294.872,00",
    trend: "up"
  },
  {
    name: "iPhone 15 Pro",
    sales: 89,
    revenue: "R$ 204.611,00", 
    trend: "up"
  },
  {
    name: "Notebook Dell",
    sales: 45,
    revenue: "R$ 157.455,00",
    trend: "down"
  }
];

const recentCustomers = [
  {
    name: "Ana Costa",
    email: "ana@email.com",
    orders: 12,
    spent: "R$ 3.450,00",
    initials: "AC"
  },
  {
    name: "Carlos Lima", 
    email: "carlos@email.com",
    orders: 8,
    spent: "R$ 2.890,00",
    initials: "CL"
  },
  {
    name: "Lucia Santos",
    email: "lucia@email.com", 
    orders: 15,
    spent: "R$ 4.120,00",
    initials: "LS"
  }
];

export function MaxtonDashboard() {
  const salesColumns = [
    { key: 'id', label: 'ID' },
    { key: 'customer', label: 'Cliente' },
    { 
      key: 'status', 
      label: 'Status',
      render: (value: string) => (
        <Badge variant={value === 'Concluída' ? 'default' : 'secondary'}>
          {value}
        </Badge>
      )
    },
    { key: 'amount', label: 'Valor' },
    { key: 'date', label: 'Data' }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Bem-vindo ao painel administrativo</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
            <Calendar className="w-4 h-4 mr-2" />
            Hoje
          </Button>
          <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md">
            <TrendingUp className="w-4 h-4 mr-2" />
            Relatório
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <MaxtonStatsGrid />

      {/* Charts and Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart */}
        <div className="lg:col-span-2">
          <MaxtonChartCard
            title="Vendas por Mês"
            subtitle="Evolução das vendas ao longo do ano"
            value="R$ 324.560"
            change="+18.2%"
            changeType="positive"
          >
            <div className="h-80 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 text-blue-500 mx-auto mb-2" />
                <p className="text-gray-600">Gráfico de vendas seria renderizado aqui</p>
                <p className="text-sm text-gray-500">Integração com Recharts ou Chart.js</p>
              </div>
            </div>
          </MaxtonChartCard>
        </div>

        {/* Top Products */}
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="text-lg font-semibold text-gray-900">Top Produtos</CardTitle>
            <p className="text-sm text-gray-500">Produtos mais vendidos</p>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 text-sm">{product.name}</h4>
                    <p className="text-xs text-gray-500">{product.sales} vendas</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-sm text-gray-900">{product.revenue}</p>
                    <div className="flex items-center gap-1">
                      {product.trend === 'up' ? (
                        <TrendingUp className="w-3 h-3 text-green-500" />
                      ) : (
                        <TrendingDown className="w-3 h-3 text-red-500" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Sales Table */}
        <div>
          <MaxtonTable
            title="Vendas Recentes"
            subtitle="Últimas transações realizadas"
            columns={salesColumns}
            data={recentSales}
            actions={{
              view: (row) => console.log('View', row),
              edit: (row) => console.log('Edit', row),
            }}
          />
        </div>

        {/* Recent Customers */}
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="text-lg font-semibold text-gray-900">Clientes Recentes</CardTitle>
            <p className="text-sm text-gray-500">Novos clientes cadastrados</p>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-4">
              {recentCustomers.map((customer, index) => (
                <div key={index} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white font-medium">
                      {customer.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 text-sm">{customer.name}</h4>
                    <p className="text-xs text-gray-500">{customer.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-sm text-gray-900">{customer.spent}</p>
                    <p className="text-xs text-gray-500">{customer.orders} pedidos</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity and Notifications Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MaxtonActivityFeed />
        <MaxtonNotifications />
      </div>
      {/* Progress Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-gray-900">Meta Mensal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Progresso</span>
                <span className="font-medium text-gray-900">75%</span>
              </div>
              <Progress value={75} className="h-2" />
              <p className="text-xs text-gray-500">R$ 75.000 de R$ 100.000</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-gray-900">Satisfação</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Avaliação</span>
                <span className="font-medium text-gray-900">4.8/5.0</span>
              </div>
              <Progress value={96} className="h-2" />
              <p className="text-xs text-gray-500">Baseado em 245 avaliações</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-gray-900">Conversão</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Taxa</span>
                <span className="font-medium text-gray-900">12.5%</span>
              </div>
              <Progress value={12.5} className="h-2" />
              <p className="text-xs text-gray-500">Visitantes que compraram</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}