import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DateRange } from "react-day-picker";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from "recharts";
import { 
  CalendarIcon, 
  Download, 
  FileText, 
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle,
  DollarSign
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

export function RelatoriosSuporte() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(2024, 0, 1),
    to: new Date(),
  });

  // Dados simulados para os gráficos
  const osStatusData = [
    { name: 'Abertas', value: 45, color: '#3b82f6' },
    { name: 'Em Manutenção', value: 78, color: '#f59e0b' },
    { name: 'Aguardando Peça', value: 23, color: '#eab308' },
    { name: 'Concluídas', value: 156, color: '#10b981' },
    { name: 'Entregues', value: 134, color: '#6b7280' },
  ];

  const osDefeitoData = [
    { defeito: 'Tela Quebrada', quantidade: 45, valor: 22500 },
    { defeito: 'Bateria', quantidade: 32, valor: 9600 },
    { defeito: 'Água/Umidade', quantidade: 28, valor: 14000 },
    { defeito: 'Software', quantidade: 22, valor: 4400 },
    { defeito: 'Conectores', quantidade: 18, valor: 5400 },
    { defeito: 'Câmera', quantidade: 15, valor: 7500 },
  ];

  const osTecnicoData = [
    { tecnico: 'Carlos', abertas: 12, concluidas: 45, tempo_medio: 3.2 },
    { tecnico: 'Ana', abertas: 8, concluidas: 52, tempo_medio: 2.8 },
    { tecnico: 'José', abertas: 15, concluidas: 38, tempo_medio: 4.1 },
    { tecnico: 'Maria', abertas: 10, concluidas: 41, tempo_medio: 3.5 },
  ];

  const tempoResolucaoData = [
    { mes: 'Jan', tempo: 3.5 },
    { mes: 'Fev', tempo: 3.2 },
    { mes: 'Mar', tempo: 2.8 },
    { mes: 'Abr', tempo: 3.1 },
    { mes: 'Mai', tempo: 2.9 },
    { mes: 'Jun', tempo: 3.3 },
  ];

  const receitaData = [
    { mes: 'Jan', receita: 45600 },
    { mes: 'Fev', receita: 52300 },
    { mes: 'Mar', receita: 48900 },
    { mes: 'Abr', receita: 56700 },
    { mes: 'Mai', receita: 61200 },
    { mes: 'Jun', receita: 58900 },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const COLORS = ['#3b82f6', '#f59e0b', '#eab308', '#10b981', '#6b7280'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Relatórios Técnicos</h1>
          <p className="text-muted-foreground">
            Análises e estatísticas do suporte técnico
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <FileText className="mr-2 h-4 w-4" />
            Exportar PDF
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exportar Excel
          </Button>
        </div>
      </div>

      {/* Filtros de Data */}
      <Card>
        <CardHeader>
          <CardTitle>Período de Análise</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-center">
            <div className="grid gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-[280px] justify-start text-left font-normal",
                      !dateRange && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange?.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "LLL dd, y", { locale: ptBR })} -{" "}
                          {format(dateRange.to, "LLL dd, y", { locale: ptBR })}
                        </>
                      ) : (
                        format(dateRange.from, "LLL dd, y", { locale: ptBR })
                      )
                    ) : (
                      <span>Selecione o período</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={2}
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <Select defaultValue="todos">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Técnico" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Técnicos</SelectItem>
                <SelectItem value="carlos">Carlos</SelectItem>
                <SelectItem value="ana">Ana</SelectItem>
                <SelectItem value="jose">José</SelectItem>
                <SelectItem value="maria">Maria</SelectItem>
              </SelectContent>
            </Select>

            <Button>Aplicar Filtros</Button>
          </div>
        </CardContent>
      </Card>

      {/* Cards de Resumo */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de OS</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">436</div>
            <p className="text-xs text-muted-foreground">
              +12% em relação ao período anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tempo Médio</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.2 dias</div>
            <p className="text-xs text-muted-foreground">
              -0.3 dias em relação ao período anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conclusão</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87%</div>
            <p className="text-xs text-muted-foreground">
              +5% em relação ao período anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 324.560</div>
            <p className="text-xs text-muted-foreground">
              +18% em relação ao período anterior
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* OS por Status */}
        <Card>
          <CardHeader>
            <CardTitle>OS por Status</CardTitle>
            <CardDescription>Distribuição das ordens de serviço por status</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={osStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {osStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* OS por Defeito */}
        <Card>
          <CardHeader>
            <CardTitle>OS por Tipo de Defeito</CardTitle>
            <CardDescription>Defeitos mais comuns e receita gerada</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={osDefeitoData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="defeito" />
                <YAxis />
                <Tooltip formatter={(value, name) => {
                  if (name === 'valor') return formatCurrency(Number(value));
                  return value;
                }} />
                <Legend />
                <Bar dataKey="quantidade" fill="#3b82f6" name="Quantidade" />
                <Bar dataKey="valor" fill="#10b981" name="Receita (R$)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Performance por Técnico */}
        <Card>
          <CardHeader>
            <CardTitle>Performance por Técnico</CardTitle>
            <CardDescription>OS abertas vs concluídas por técnico</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={osTecnicoData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="tecnico" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="abertas" fill="#f59e0b" name="Abertas" />
                <Bar dataKey="concluidas" fill="#10b981" name="Concluídas" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Tempo de Resolução */}
        <Card>
          <CardHeader>
            <CardTitle>Tempo Médio de Resolução</CardTitle>
            <CardDescription>Evolução do tempo médio por mês</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={tempoResolucaoData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip formatter={(value) => `${value} dias`} />
                <Legend />
                <Line type="monotone" dataKey="tempo" stroke="#3b82f6" strokeWidth={2} name="Tempo (dias)" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Receita Mensal */}
      <Card>
        <CardHeader>
          <CardTitle>Receita Mensal</CardTitle>
          <CardDescription>Evolução da receita gerada pelo suporte técnico</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={receitaData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Legend />
              <Bar dataKey="receita" fill="#10b981" name="Receita (R$)" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Relatórios Detalhados */}
      <Card>
        <CardHeader>
          <CardTitle>Relatórios Detalhados</CardTitle>
          <CardDescription>Gere relatórios específicos para análise detalhada</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" className="h-20 flex-col">
              <FileText className="h-6 w-6 mb-2" />
              <span>OS por Cliente</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Clock className="h-6 w-6 mb-2" />
              <span>Tempos por Marca</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <TrendingUp className="h-6 w-6 mb-2" />
              <span>Peças Utilizadas</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <DollarSign className="h-6 w-6 mb-2" />
              <span>Margem de Lucro</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}