import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Activity,
  ShoppingCart,
  User,
  Package,
  DollarSign,
  Clock
} from "lucide-react";

interface ActivityItem {
  id: string;
  type: 'sale' | 'user' | 'product' | 'system';
  title: string;
  description: string;
  user: string;
  time: string;
  amount?: string;
}

const mockActivities: ActivityItem[] = [
  {
    id: '1',
    type: 'sale',
    title: 'Nova venda processada',
    description: 'Venda VND-001 para João Silva',
    user: 'Maria Santos',
    time: '2 min atrás',
    amount: 'R$ 1.259,00'
  },
  {
    id: '2',
    type: 'user',
    title: 'Novo usuário cadastrado',
    description: 'Pedro Costa foi adicionado como vendedor',
    user: 'Admin',
    time: '15 min atrás'
  },
  {
    id: '3',
    type: 'product',
    title: 'Produto atualizado',
    description: 'Preço do iPhone 15 Pro foi alterado',
    user: 'Ana Oliveira',
    time: '1 hora atrás'
  },
  {
    id: '4',
    type: 'sale',
    title: 'Venda cancelada',
    description: 'Venda VND-002 foi cancelada pelo cliente',
    user: 'Carlos Lima',
    time: '2 horas atrás',
    amount: 'R$ 892,50'
  },
  {
    id: '5',
    type: 'system',
    title: 'Backup realizado',
    description: 'Backup automático dos dados concluído',
    user: 'Sistema',
    time: '3 horas atrás'
  }
];

export function MaxtonActivityFeed() {
  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'sale':
        return <ShoppingCart className="h-4 w-4 text-green-600" />;
      case 'user':
        return <User className="h-4 w-4 text-blue-600" />;
      case 'product':
        return <Package className="h-4 w-4 text-purple-600" />;
      case 'system':
        return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getActivityBg = (type: ActivityItem['type']) => {
    switch (type) {
      case 'sale':
        return 'bg-green-100';
      case 'user':
        return 'bg-blue-100';
      case 'product':
        return 'bg-purple-100';
      case 'system':
        return 'bg-gray-100';
    }
  };

  const getUserInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <Card className="maxton-card">
      <CardHeader className="border-b border-gray-100">
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-gray-700" />
          <span className="text-lg font-semibold text-gray-900">Atividade Recente</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-96">
          <div className="p-4 space-y-4">
            {mockActivities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className={`p-2 rounded-full ${getActivityBg(activity.type)}`}>
                  {getActivityIcon(activity.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900">
                        {activity.title}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {activity.description}
                      </p>
                      
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="bg-gray-200 text-gray-700 text-xs">
                              {getUserInitials(activity.user)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs text-gray-500">{activity.user}</span>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-500">{activity.time}</span>
                        </div>
                      </div>
                    </div>
                    
                    {activity.amount && (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        {activity.amount}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}