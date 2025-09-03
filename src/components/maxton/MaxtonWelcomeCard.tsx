import { Card, CardContent } from "@/components/ui/card";
import { User2 } from "lucide-react";

interface MaxtonWelcomeCardProps {
  userName?: string;
  todaySales?: string;
  growthRate?: string;
  activeUsers?: string;
  totalUsers?: string;
}

export function MaxtonWelcomeCard({
  userName = "Jhon Anderson",
  todaySales = "$65.4K",
  growthRate = "78.4%",
  activeUsers = "42.5K",
  totalUsers = "97.4K"
}: MaxtonWelcomeCardProps) {
  return (
    <Card className="bg-gradient-to-br from-[#6366f1] via-[#8b5cf6] to-[#d946ef] border-0 shadow-2xl rounded-3xl overflow-hidden relative h-[320px]">
      <CardContent className="p-8 h-full flex flex-col justify-between relative z-10">
        {/* Welcome Section */}
        <div className="flex items-start justify-between">
          <div className="space-y-4 flex-1">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                <User2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-white/80 text-sm">Welcome back</p>
                <h2 className="text-white text-2xl font-bold">{userName}!</h2>
              </div>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 gap-8 mt-6">
              <div>
                <p className="text-white text-3xl font-bold">{todaySales}</p>
                <p className="text-white/70 text-sm mt-1">Today's Sales</p>
                <div className="h-1 w-16 bg-gradient-to-r from-emerald-400 to-emerald-300 rounded-full mt-2" />
              </div>
              <div>
                <p className="text-white text-3xl font-bold">{growthRate}</p>
                <p className="text-white/70 text-sm mt-1">Growth Rate</p>
                <div className="h-1 w-16 bg-gradient-to-r from-rose-400 to-rose-300 rounded-full mt-2" />
              </div>
            </div>
          </div>

          {/* Right side stats */}
          <div className="space-y-6 text-right">
            <div>
              <p className="text-white text-2xl font-bold">{activeUsers}</p>
              <p className="text-white/70 text-sm">Active Users</p>
            </div>
            <div>
              <p className="text-white text-2xl font-bold">{totalUsers}</p>
              <p className="text-white/70 text-sm">Total Users</p>
            </div>
          </div>
        </div>

        {/* Progress Circle */}
        <div className="absolute bottom-6 right-8">
          <div className="relative w-24 h-24">
            <svg className="w-24 h-24 transform -rotate-90">
              <circle
                cx="48"
                cy="48"
                r="40"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="48"
                cy="48"
                r="40"
                stroke="url(#gradient)"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 40 * 0.78} ${2 * Math.PI * 40}`}
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#34d399" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white text-xl font-bold">78%</span>
            </div>
          </div>
          <p className="text-white/70 text-xs mt-2 text-center">24K users increased from last month</p>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl" />
      </CardContent>
    </Card>
  );
}