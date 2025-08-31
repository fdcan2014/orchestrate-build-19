import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Package } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const stats = [
  {
    title: "Vendas do Mês",
    value: "R$ 45.231,89",
    change: "+20.1%",
    trend: "up",
    icon: DollarSign,
    color: "text-success"
  },
  {
    title: "Pedidos",
    value: "1.234",
    change: "+12.5%",
    trend: "up",
    icon: ShoppingCart,
    color: "text-primary"
  },
  {
    title: "Clientes Ativos",
    value: "573",
    change: "-2.3%",
    trend: "down",
    icon: Users,
    color: "text-warning"
  },
  {
    title: "Produtos",
    value: "2.845",
    change: "+5.2%",
    trend: "up",
    icon: Package,
    color: "text-muted-foreground"
  }
];

export function DashboardStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const IconComponent = stat.icon;
        const TrendIcon = stat.trend === "up" ? TrendingUp : TrendingDown;
        
        return (
          <Card key={stat.title} className="card-gradient">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <IconComponent className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center space-x-1 text-xs">
                <TrendIcon className={`h-3 w-3 ${
                  stat.trend === "up" ? "text-success" : "text-destructive"
                }`} />
                <span className={
                  stat.trend === "up" ? "text-success" : "text-destructive"
                }>
                  {stat.change}
                </span>
                <span className="text-muted-foreground">vs mês anterior</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}