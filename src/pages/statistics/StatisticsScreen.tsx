import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { BottomNav } from "@/components/layout/BottomNav";
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
    <MobileLayout showBottomNav={true}>
      <ScreenHeader title="Statistics" onBack={() => navigate("/dashboard")} />

      <div className="p-4 space-y-6 pb-24">
        {loading ? (
          <div className="flex items-center justify-center py-10 text-muted-foreground">
            <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading...
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-10 text-destructive font-semibold">
            Failed to load stats. Please try again later.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-card rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-5 h-5 text-primary" />
                  <p className="font-semibold">Total</p>
                </div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-muted-foreground">All screenings</p>
              </div>
              <div className="bg-card rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  <p className="font-semibold">This Week</p>
                </div>
                <p className="text-2xl font-bold">{stats.thisWeek}</p>
                <p className="text-sm text-muted-foreground">Last 7 days</p>
              </div>
              <div className="bg-card rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-5 h-5 text-primary" />
                  <p className="font-semibold">Avg Confidence</p>
                </div>
                <p className="text-2xl font-bold">{stats.avgConfidence}</p>
                <p className="text-sm text-muted-foreground">AI confidence</p>
              </div>
              <div className="bg-card rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-primary" />
                  <p className="font-semibold">High Risk</p>
                </div>
                <p className="text-2xl font-bold">{stats.high}</p>
                <p className="text-sm text-muted-foreground">Flagged cases</p>
              </div>
            </div>

            <div className="bg-card rounded-xl p-4">
              <h3 className="font-semibold mb-3">Daily Screenings (7 days)</h3>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dailyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="count" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-card rounded-xl p-4">
              <h3 className="font-semibold mb-3">Risk Distribution</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={80} label>
                      {pieData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}
      </div>

      <BottomNav />
    </MobileLayout>
  );
}
