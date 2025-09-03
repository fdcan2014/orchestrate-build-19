import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MaxtonCard } from "@/components/maxton/MaxtonCard";
import { MaxtonWelcomeCard } from "@/components/maxton/MaxtonWelcomeCard";
import { 
  DollarSign, 
  ShoppingCart, 
  Users, 
  Package,
  TrendingUp,
  Activity,
  CreditCard,
  Eye,
  Monitor,
  Tablet,
  Smartphone
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();
  const userName = user?.user_metadata?.display_name || user?.email?.split('@')[0] || 'Admin';

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header com Welcome Card */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Analysis
          </p>
        </div>
        <Button className="bg-gradient-to-r from-primary to-secondary hover:shadow-glow text-primary-foreground rounded-xl">
          Settings
        </Button>
      </div>

      {/* Welcome Card */}
      <MaxtonWelcomeCard userName={userName} />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-cyan-500/20 via-cyan-600/10 to-transparent border-0 shadow-xl rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">$82.7K</div>
            <p className="text-xs text-emerald-400 mt-2 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              12.5% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-500/20 via-purple-600/10 to-transparent border-0 shadow-xl rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Clicks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">82.7K</div>
            <p className="text-xs text-purple-400 mt-2">
              12.5% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-pink-500/20 via-pink-600/10 to-transparent border-0 shadow-xl rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Views</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">68.4K</div>
            <p className="text-xs text-pink-400 mt-2">
              35K users increased from last month
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-amber-500/20 via-amber-600/10 to-transparent border-0 shadow-xl rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Accounts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">85,247</div>
            <p className="text-xs text-amber-400 mt-2 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              23.7% growth
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Revenue Chart */}
        <Card className="bg-card border-0 shadow-xl rounded-2xl">
          <CardHeader>
            <CardTitle className="text-foreground">Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end justify-between gap-2">
              {[20, 35, 30, 50, 25, 20, 45, 35, 30, 40, 50, 35].map((height, i) => (
                <div key={i} className="flex-1 relative group">
                  <div
                    className="w-full bg-gradient-to-t from-cyan-500 to-cyan-400 rounded-t-lg transition-all duration-300 hover:from-cyan-400 hover:to-cyan-300"
                    style={{ height: `${height * 2}%` }}
                  />
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-card px-1 py-0.5 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                    {height}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-3 text-xs text-muted-foreground">
              {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month) => (
                <span key={month}>{month.slice(0, 1)}</span>
              ))}
            </div>
            <div className="mt-6 p-4 bg-muted/30 rounded-xl">
              <p className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-cyan-500 bg-clip-text text-transparent">68.9%</p>
              <p className="text-sm text-emerald-400 flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3" />
                +54.5%
              </p>
              <p className="text-xs text-muted-foreground mt-1">Average monthly sale for every author</p>
            </div>
          </CardContent>
        </Card>

        {/* Device Type Chart */}
        <Card className="bg-card border-0 shadow-xl rounded-2xl">
          <CardHeader>
            <CardTitle className="text-foreground">Device Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative w-48 h-48 mx-auto">
              <svg className="w-48 h-48 transform -rotate-90">
                <circle
                  cx="96"
                  cy="96"
                  r="70"
                  stroke="transparent"
                  strokeWidth="20"
                  fill="none"
                />
                <circle
                  cx="96"
                  cy="96"
                  r="70"
                  stroke="url(#desktop-gradient)"
                  strokeWidth="20"
                  fill="none"
                  strokeDasharray="154 440"
                  strokeLinecap="round"
                />
                <circle
                  cx="96"
                  cy="96"
                  r="70"
                  stroke="url(#tablet-gradient)"
                  strokeWidth="20"
                  fill="none"
                  strokeDasharray="211 440"
                  strokeDashoffset="-154"
                  strokeLinecap="round"
                />
                <circle
                  cx="96"
                  cy="96"
                  r="70"
                  stroke="url(#mobile-gradient)"
                  strokeWidth="20"
                  fill="none"
                  strokeDasharray="119 440"
                  strokeDashoffset="-365"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="desktop-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#06b6d4" />
                    <stop offset="100%" stopColor="#0891b2" />
                  </linearGradient>
                  <linearGradient id="tablet-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f97316" />
                    <stop offset="100%" stopColor="#ea580c" />
                  </linearGradient>
                  <linearGradient id="mobile-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#059669" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-3xl font-bold text-foreground">68%</p>
                  <p className="text-xs text-muted-foreground">Total Views</p>
                </div>
              </div>
            </div>
            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-gradient-to-r from-cyan-500 to-cyan-600" />
                  <Monitor className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Desktop</span>
                </div>
                <span className="text-sm font-medium text-foreground">35%</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-gradient-to-r from-orange-500 to-orange-600" />
                  <Tablet className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Tablet</span>
                </div>
                <span className="text-sm font-medium text-foreground">48%</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600" />
                  <Smartphone className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Mobile</span>
                </div>
                <span className="text-sm font-medium text-foreground">27%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}