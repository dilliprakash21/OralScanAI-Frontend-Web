import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import { Activity, Users, TrendingUp, AlertTriangle, Loader2 } from "lucide-react";
import { format, subDays, startOfDay } from "date-fns";
import { api } from "@/lib/api";

interface Stats {
  total: number;
  low: number;
  medium: number;
  high: number;
  thisWeek: number;
  avgConfidence: number;
}

export default function StatisticsScreen() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats>({ total: 0, low: 0, medium: 0, high: 0, thisWeek: 0, avgConfidence: 0 });
  const [dailyData, setDailyData] = useState<Array<{ date: string; count: number }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(false);
      try {
        // Fetch enough screenings to build charts (adjust if you have huge data)
        const res = await api.screenings.list({ limit: 2000 });
        const rows = res.screenings || [];

        const now = new Date();
        const weekStart = subDays(now, 6);

        let low = 0, medium = 0, high = 0, confSum = 0, confN = 0, thisWeek = 0;

        // build map for last 7 days
        const dayKeys = Array.from({ length: 7 }).map((_, i) => format(subDays(now, 6 - i), "MMM d"));
        const counts: Record<string, number> = Object.fromEntries(dayKeys.map((k) => [k, 0]));

        for (const r of rows) {
          const risk = (r.risk_level || "low").toLowerCase();
          if (risk === "high") high++;
          else if (risk === "medium") medium++;
          else low++;

          if (typeof r.ai_confidence === "number") {
            confSum += r.ai_confidence;
            confN += 1;
          }

          if (r.created_at) {
            const d = new Date(r.created_at);
            if (d >= weekStart) thisWeek += 1;

            const key = format(d, "MMM d");
            if (key in counts) counts[key] += 1;
          }
        }

        setStats({
          total: rows.length,
          low,
          medium,
          high,
          thisWeek,
          avgConfidence: confN ? Math.round((confSum / confN) * 100) / 100 : 0,
        });

        setDailyData(dayKeys.map((k) => ({ date: k, count: counts[k] })));
      } catch (e) {
        setError(true);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const pieData = useMemo(
    () => ([
      { name: "Low", value: stats.low },
      { name: "Medium", value: stats.medium },
      { name: "High", value: stats.high },
    ]),
    [stats]
  );

  const COLORS = ["#22c55e", "#f59e0b", "#ef4444"];

  return (
    <DashboardLayout>
      <div className="relative">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-foreground mb-1">Analytics Dashboard</h1>
          <p className="text-muted-foreground font-medium">Real-time platform performance and screening trends</p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-muted-foreground space-y-4">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
            <p className="font-bold uppercase tracking-widest text-xs">Synchronizing platform data...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-24 text-destructive bg-destructive/5 rounded-[3rem] border border-dashed border-destructive/20">
            <AlertTriangle className="w-12 h-12 mb-4" />
            <h3 className="text-xl font-bold">Data Synchronization Failed</h3>
            <p className="text-sm opacity-80 mt-1">Please check your network connection and try again.</p>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-card border border-border/50 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-primary/10 rounded-xl">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-xs font-black text-muted-foreground uppercase tracking-wider">Total</span>
                </div>
                <p className="text-4xl font-black text-foreground">{stats.total}</p>
                <p className="text-xs text-muted-foreground mt-2 font-medium">Lifetime screenings</p>
              </div>
              
              <div className="bg-card border border-border/50 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-success/10 rounded-xl">
                    <TrendingUp className="w-5 h-5 text-success" />
                  </div>
                  <span className="text-xs font-black text-muted-foreground uppercase tracking-wider">Activity</span>
                </div>
                <p className="text-4xl font-black text-foreground">{stats.thisWeek}</p>
                <p className="text-xs text-muted-foreground mt-2 font-medium">Cases this week</p>
              </div>

              <div className="bg-card border border-border/50 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-info/10 rounded-xl">
                    <Activity className="w-5 h-5 text-info" />
                  </div>
                  <span className="text-xs font-black text-muted-foreground uppercase tracking-wider">AI Confidence</span>
                </div>
                <p className="text-4xl font-black text-foreground">{stats.avgConfidence}%</p>
                <p className="text-xs text-muted-foreground mt-2 font-medium">Average system accuracy</p>
              </div>

              <div className="bg-card border border-border/50 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-destructive/10 rounded-xl">
                    <AlertTriangle className="w-5 h-5 text-destructive" />
                  </div>
                  <span className="text-xs font-black text-muted-foreground uppercase tracking-wider">High Risk</span>
                </div>
                <p className="text-4xl font-black text-foreground">{stats.high}</p>
                <p className="text-xs text-muted-foreground mt-2 font-medium">Urgent attention needed</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-card border border-border/50 rounded-[2.5rem] p-8 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-bold">Screening Velocity</h3>
                  <span className="text-xs font-bold text-muted-foreground bg-muted px-3 py-1 rounded-full uppercase">Last 7 Days</span>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dailyData}>
                      <defs>
                        <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={1} />
                          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.6} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
                      <XAxis 
                        dataKey="date" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12, fontWeight: 600 }}
                      />
                      <YAxis 
                        allowDecimals={false} 
                        axisLine={false} 
                        tickLine={false}
                        tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12, fontWeight: 600 }}
                      />
                      <Tooltip 
                        cursor={{ fill: 'hsl(var(--muted))', opacity: 0.4 }}
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      />
                      <Bar dataKey="count" fill="url(#barGradient)" radius={[6, 6, 0, 0]} barSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-card border border-border/50 rounded-[2.5rem] p-8 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-bold">Risk Distribution</h3>
                  <span className="text-xs font-bold text-muted-foreground bg-muted px-3 py-1 rounded-full uppercase">Current Snapshot</span>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie 
                        data={pieData} 
                        dataKey="value" 
                        nameKey="name" 
                        cx="50%" 
                        cy="50%" 
                        innerRadius={80} 
                        outerRadius={120} 
                        paddingAngle={8}
                        stroke="none"
                      >
                        {pieData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      />
                      <Legend 
                         verticalAlign="bottom" 
                         height={36} 
                         iconType="circle"
                         formatter={(value) => <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{value}</span>}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
