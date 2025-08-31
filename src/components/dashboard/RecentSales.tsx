import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const recentSales = [
  {
    id: "1",
    customer: "João Silva",
    email: "joao@email.com",
    amount: "R$ 1.259,00",
    initials: "JS"
  },
  {
    id: "2", 
    customer: "Maria Santos",
    email: "maria@email.com",
    amount: "R$ 892,50",
    initials: "MS"
  },
  {
    id: "3",
    customer: "Pedro Costa",
    email: "pedro@email.com", 
    amount: "R$ 2.150,75",
    initials: "PC"
  },
  {
    id: "4",
    customer: "Ana Oliveira",
    email: "ana@email.com",
    amount: "R$ 756,25",
    initials: "AO"
  },
  {
    id: "5",
    customer: "Carlos Lima",
    email: "carlos@email.com",
    amount: "R$ 1.890,00",
    initials: "CL"
  }
];

export function RecentSales() {
  return (
    <Card className="card-gradient">
      <CardHeader>
        <CardTitle>Vendas Recentes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentSales.map((sale) => (
            <div key={sale.id} className="flex items-center space-x-4">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-primary/10 text-primary font-medium">
                  {sale.initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">{sale.customer}</p>
                <p className="text-sm text-muted-foreground">{sale.email}</p>
              </div>
              <div className="font-medium text-success">{sale.amount}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}