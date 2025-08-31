import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Activity,
  User,
  Store,
  Settings,
  DollarSign,
  Package,
  Shield,
  Trash2
} from "lucide-react";
import { useAdmin } from "@/contexts/AdminContext";

export function RecentActivity() {
  const { auditLogs } = useAdmin();

  const getActionIcon = (action: string) => {
    if (action.includes('user')) return <User className="h-4 w-4" />;
    if (action.includes('store')) return <Store className="h-4 w-4" />;
    if (action.includes('sale')) return <DollarSign className="h-4 w-4" />;
    if (action.includes('product')) return <Package className="h-4 w-4" />;
    if (action.includes('config')) return <Settings className="h-4 w-4" />;
    if (action.includes('delete')) return <Trash2 className="h-4 w-4" />;
    if (action.includes('block')) return <Shield className="h-4 w-4" />;
    return <Activity className="h-4 w-4" />;
  };

  const getActionColor = (action: string) => {
    if (action.includes('create')) return 'text-green-600';
    if (action.includes('update')) return 'text-blue-600';
    if (action.includes('delete')) return 'text-red-600';
    if (action.includes('block')) return 'text-orange-600';
    return 'text-gray-600';
  };

  const getActionDescription = (log: any) => {
    switch (log.action) {
      case 'create_user':
        return 'criou um novo usuário';
      case 'update_user':
        return 'atualizou dados de usuário';
      case 'delete_user':
        return 'excluiu um usuário';
      case 'switch_store':
        return 'trocou de loja';
      case 'create_sale':
        return 'registrou uma venda';
      case 'update_product':
        return 'atualizou produto';
      default:
        return log.action.replace('_', ' ');
    }
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const logTime = new Date(timestamp);
    const diffMs = now.getTime() - logTime.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor(diffMs / (1000 * 60));

    if (diffHours > 0) {
      return `há ${diffHours}h`;
    } else if (diffMins > 0) {
      return `há ${diffMins}min`;
    } else {
      return 'agora';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Atividade Recente
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px]">
          <div className="space-y-3">
            {auditLogs.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">
                Nenhuma atividade registrada
              </p>
            ) : (
              auditLogs.slice(0, 10).map((log) => (
                <div key={log.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50">
                  <div className={`p-1.5 rounded-full bg-muted ${getActionColor(log.action)}`}>
                    {getActionIcon(log.action)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm truncate">
                        {log.user_name}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {getActionDescription(log)}
                      </span>
                    </div>
                    
                    {log.resource && (
                      <div className="flex items-center gap-1 mb-1">
                        <Badge variant="outline" className="text-xs">
                          {log.resource}
                        </Badge>
                        {log.store_id && (
                          <Badge variant="secondary" className="text-xs">
                            Loja
                          </Badge>
                        )}
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {getTimeAgo(log.timestamp)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {log.ip_address}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}