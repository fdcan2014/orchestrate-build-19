import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

const data = [
  { name: "Jan", total: 12500 },
  { name: "Fev", total: 15200 },
  { name: "Mar", total: 18900 },
  { name: "Abr", total: 16800 },
  { name: "Mai", total: 22100 },
  { name: "Jun", total: 25400 },
  { name: "Jul", total: 28200 },
  { name: "Ago", total: 31500 },
  { name: "Set", total: 29800 },
  { name: "Out", total: 35100 },
  { name: "Nov", total: 42300 },
  { name: "Dez", total: 45200 }
];

export function SalesChart() {
  return (
    <Card className="card-gradient">
      <CardHeader>
        <CardTitle>Vendas por Mês</CardTitle>
        <CardDescription>
          Evolução das vendas ao longo do ano
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="name" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `R$${value}`}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-md">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">
                            {label}
                          </span>
                          <span className="font-bold text-muted-foreground">
                            R$ {payload[0].value?.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar 
              dataKey="total" 
              fill="hsl(var(--primary))"
              radius={[4, 4, 0, 0]}
              className="opacity-80 hover:opacity-100 transition-opacity"
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}