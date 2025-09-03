import { MaxtonCard } from "./MaxtonCard";
import { 
  DollarSign, 
  ShoppingCart, 
  Users, 
  Package,
  TrendingUp,
  TrendingDown,
  Activity,
  Target
} from "lucide-react";

interface StatsData {
  sales: {
    value: string;
    change: string;
    trend: 'up' | 'down';
  };
  orders: {
    value: string;
    change: string;
    trend: 'up' | 'down';
  };
  customers: {
    value: string;
    change: string;
    trend: 'up' | 'down';
  };
  products: {
    value: string;
    change: string;
    trend: 'up' | 'down';
  };
}

interface MaxtonStatsGridProps {
  data?: StatsData;
}

const defaultData: StatsData = {
  sales: {
    value: "R$ 45.231,89",
    change: "+20.1% vs mês anterior",
    trend: 'up'
  },
  orders: {
    value: "1.234",
    change: "+12.5% vs mês anterior", 
    trend: 'up'
  },
  customers: {
    value: "573",
    change: "-2.3% vs mês anterior",
    trend: 'down'
  },
  products: {
    value: "2.845",
    change: "+5.2% vs mês anterior",
    trend: 'up'
  }
};

export function MaxtonStatsGrid({ data = defaultData }: MaxtonStatsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <MaxtonCard
        title="Vendas do Mês"
        value={data.sales.value}
        change={data.sales.change}
        changeType={data.sales.trend === 'up' ? 'positive' : 'negative'}
        icon={<DollarSign className="w-5 h-5" />}
        variant="gradient"
        className="maxton-fade-in"
      />
      
      <MaxtonCard
        title="Pedidos"
        value={data.orders.value}
        change={data.orders.change}
        changeType={data.orders.trend === 'up' ? 'positive' : 'negative'}
        icon={<ShoppingCart className="w-5 h-5" />}
        variant="gradient"
        className="maxton-fade-in"
      />
      
      <MaxtonCard
        title="Clientes Ativos"
        value={data.customers.value}
        change={data.customers.change}
        changeType={data.customers.trend === 'up' ? 'positive' : 'negative'}
        icon={<Users className="w-5 h-5" />}
        variant="gradient"
        className="maxton-fade-in"
      />
      
      <MaxtonCard
        title="Produtos"
        value={data.products.value}
        change={data.products.change}
        changeType={data.products.trend === 'up' ? 'positive' : 'negative'}
        icon={<Package className="w-5 h-5" />}
        variant="gradient"
        className="maxton-fade-in"
      />
    </div>
  );
}