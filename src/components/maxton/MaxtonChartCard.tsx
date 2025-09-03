import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  TrendingUp, 
  Download, 
  MoreHorizontal,
  Calendar,
  Filter
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MaxtonChartCardProps {
  title: string;
  subtitle?: string;
  value?: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  period?: string;
  children?: React.ReactNode;
  actions?: boolean;
}

export function MaxtonChartCard({
  title,
  subtitle,
  value,
  change,
  changeType = 'neutral',
  period = "Últimos 30 dias",
  children,
  actions = true
}: MaxtonChartCardProps) {
  const getChangeColor = () => {
    switch (changeType) {
      case 'positive': return 'text-green-600 bg-green-50';
      case 'negative': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <Card className="maxton-card maxton-slide-up">
      <CardHeader className="border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-gray-900">{title}</CardTitle>
            {subtitle && (
              <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
            )}
          </div>
          
          {actions && (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
                <Calendar className="w-4 h-4 mr-1" />
                {period}
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white border border-gray-200">
                  <DropdownMenuItem className="text-gray-600 hover:bg-gray-50">
                    <Download className="mr-2 h-4 w-4" />
                    Exportar dados
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-gray-600 hover:bg-gray-50">
                    <Filter className="mr-2 h-4 w-4" />
                    Filtros avançados
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-gray-600 hover:bg-gray-50">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Ver relatório completo
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
        
        {(value || change) && (
          <div className="flex items-center gap-4 mt-4">
            {value && (
              <div className="text-2xl font-bold text-gray-900">{value}</div>
            )}
            {change && (
              <Badge className={`px-2 py-1 text-xs font-medium ${getChangeColor()}`}>
                <TrendingUp className="w-3 h-3 mr-1" />
                {change}
              </Badge>
            )}
          </div>
        )}
      </CardHeader>
      
      <CardContent className="p-6">
        {children || (
          <div className="h-64 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">Gráfico seria renderizado aqui</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}