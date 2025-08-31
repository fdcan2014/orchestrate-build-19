import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertTriangle,
  Info,
  CheckCircle,
  XCircle,
  Bell,
  X
} from "lucide-react";
import { SystemAlert } from "@/types/admin";

export function SystemAlerts() {
  const [alerts, setAlerts] = useState<SystemAlert[]>([
    {
      id: '1',
      type: 'warning',
      title: 'Uso de armazenamento alto',
      message: 'Você está usando 85% do armazenamento disponível. Considere fazer upgrade.',
      target: 'global',
      priority: 'medium',
      status: 'active',
      created_at: new Date().toISOString(),
    },
    {
      id: '2',
      type: 'info',
      title: 'Nova funcionalidade disponível',
      message: 'O sistema de relatórios avançados foi liberado para planos Professional.',
      target: 'global',
      priority: 'low',
      status: 'active',
      created_at: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: '3',
      type: 'error',
      title: 'Falha na integração',
      message: 'A integração do gateway de pagamento está apresentando intermitência.',
      target: 'global',
      priority: 'high',
      status: 'active',
      created_at: new Date(Date.now() - 7200000).toISOString(),
    },
    {
      id: '4',
      type: 'success',
      title: 'Backup concluído',
      message: 'Backup automático dos dados foi realizado com sucesso.',
      target: 'global',
      priority: 'low',
      status: 'active',
      created_at: new Date(Date.now() - 10800000).toISOString(),
    },
  ]);

  const getAlertIcon = (type: SystemAlert['type']) => {
    switch (type) {
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'info':
        return <Info className="h-4 w-4 text-blue-500" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
  };

  const getAlertColor = (type: SystemAlert['type']) => {
    switch (type) {
      case 'error':
        return 'border-l-red-500 bg-red-50';
      case 'warning':
        return 'border-l-yellow-500 bg-yellow-50';
      case 'info':
        return 'border-l-blue-500 bg-blue-50';
      case 'success':
        return 'border-l-green-500 bg-green-50';
    }
  };

  const getPriorityBadge = (priority: SystemAlert['priority']) => {
    switch (priority) {
      case 'critical':
        return <Badge variant="destructive">Crítico</Badge>;
      case 'high':
        return <Badge variant="destructive">Alto</Badge>;
      case 'medium':
        return <Badge variant="secondary">Médio</Badge>;
      case 'low':
        return <Badge variant="outline">Baixo</Badge>;
    }
  };

  const dismissAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const alertTime = new Date(timestamp);
    const diffMs = now.getTime() - alertTime.getTime();
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
          <Bell className="h-5 w-5" />
          Alertas do Sistema
          {alerts.length > 0 && (
            <Badge variant="secondary">{alerts.length}</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px]">
          <div className="space-y-3">
            {alerts.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">
                Nenhum alerta ativo
              </p>
            ) : (
              alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-3 rounded-lg border-l-4 ${getAlertColor(alert.type)}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-2 flex-1">
                      {getAlertIcon(alert.type)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-sm">{alert.title}</h4>
                          {getPriorityBadge(alert.priority)}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {alert.message}
                        </p>
                        <div className="text-xs text-muted-foreground">
                          {getTimeAgo(alert.created_at)}
                        </div>
                      </div>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => dismissAlert(alert.id)}
                      className="h-6 w-6 p-0 ml-2"
                    >
                      <X className="h-3 w-3" />
                    </Button>
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