import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Users, FolderOpen, BarChart3, Bell, ShieldCheck, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { RiskBadge } from "@/components/ui/RiskBadge";
import { api } from "@/lib/api";
import { formatDistanceToNow } from "date-fns";

export default function AdminDashboardScreen() {
    const navigate = useNavigate();
    const { profile } = useAuth();
    const [recentScreenings, setRecentScreenings] = useState<any[]>([]);
    const [stats, setStats] = useState({ today: 0, week: 0, total: 0, lowRiskPercent: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [screeningsRes, statsRes] = await Promise.all([
                    api.screenings.list({ limit: 10 }),
                    api.screenings.stats()
                ]);
                setRecentScreenings(screeningsRes.screenings || []);
                setStats(statsRes as any);
            } catch (err) {
                console.error("Failed to fetch admin data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <DashboardLayout>
            <div className="relative">
                {/* Admin Header */}
                <div className="mb-8">
                    <div className="flex justify-between items-start mb-6">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="p-2 bg-primary/10 rounded-xl">
                                    <ShieldCheck className="w-6 h-6 text-primary" />
                                </div>
                                <h1 className="text-3xl font-bold text-foreground">Admin Console</h1>
                            </div>
                            <p className="text-muted-foreground font-medium">
                                System-wide screening overview and platform management
                            </p>
                        </div>
                        <button className="p-3 rounded-xl bg-card border border-border text-muted-foreground hover:bg-secondary transition-colors">
                            <Bell className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/20">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <BarChart3 className="w-5 h-5 text-primary" />
                                </div>
                                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Total</span>
                            </div>
                            <p className="text-4xl font-black text-foreground tracking-tight">{stats.total || 0}</p>
                            <p className="text-xs text-muted-foreground mt-2 font-medium">Lifetime screenings</p>
                        </div>
                        <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm transition-all hover:shadow-md hover:border-success/20">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 bg-success/10 rounded-lg">
                                    <Users className="w-5 h-5 text-success" />
                                </div>
                                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Today</span>
                            </div>
                            <p className="text-4xl font-black text-foreground tracking-tight">{stats.today}</p>
                            <p className="text-xs text-muted-foreground mt-2 font-medium">Screenings performed today</p>
                        </div>
                        <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm transition-all hover:shadow-md hover:border-warning/20">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 bg-warning/10 rounded-lg">
                                    <BarChart3 className="w-5 h-5 text-warning" />
                                </div>
                                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Growth</span>
                            </div>
                            <p className="text-4xl font-black text-foreground tracking-tight">{stats.week || 0}</p>
                            <p className="text-xs text-muted-foreground mt-2 font-medium">Increase this week</p>
                        </div>
                        <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm transition-all hover:shadow-md hover:border-info/20">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 bg-info/10 rounded-lg">
                                    <ShieldCheck className="w-5 h-5 text-info" />
                                </div>
                                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Efficiency</span>
                            </div>
                            <p className="text-4xl font-black text-foreground tracking-tight">{stats.lowRiskPercent}%</p>
                            <p className="text-xs text-muted-foreground mt-2 font-medium">Low risk ratio</p>
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                                Global Activity
                                <span className="text-xs font-normal text-muted-foreground bg-muted px-2 py-1 rounded-full">Real-time</span>
                            </h2>
                            <button
                                onClick={() => navigate("/records")}
                                className="text-primary text-sm font-bold flex items-center gap-1 hover:underline"
                            >
                                View all <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="space-y-3">
                            {loading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <div key={i} className="h-24 bg-muted/30 rounded-2xl animate-pulse" />
                                ))
                            ) : recentScreenings.length === 0 ? (
                                <div className="bg-card border border-dashed rounded-3xl p-16 text-center">
                                    <FolderOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-10" />
                                    <p className="text-muted-foreground font-bold">No data flowing yet</p>
                                </div>
                            ) : (
                                recentScreenings.map((screening) => (
                                    <button
                                        key={screening.id}
                                        onClick={() => navigate(`/records/${screening.id}`)}
                                        className="w-full bg-card hover:bg-secondary/30 rounded-2xl p-5 flex items-center justify-between border border-border/20 transition-all hover:shadow-lg group"
                                    >
                                        <div className="flex items-center gap-5">
                                            <div className="w-14 h-14 bg-secondary rounded-2xl flex items-center justify-center font-black text-secondary-foreground text-sm uppercase">
                                                ID
                                            </div>
                                            <div className="text-left">
                                                <p className="font-black text-lg text-foreground">
                                                    #{screening.patient_id.slice(-6).toUpperCase()}
                                                </p>
                                                <p className="text-xs font-bold text-muted-foreground mt-1 flex items-center gap-2 uppercase tracking-wide">
                                                    Patient: {screening.patient_id}
                                                </p>
                                                <p className="text-xs text-muted-foreground mt-1 font-medium italic opacity-70">
                                                    {screening.created_at ? formatDistanceToNow(new Date(screening.created_at), { addSuffix: true }) : ""}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <RiskBadge level={(screening.risk_level as any) || "low"} />
                                            <div className="w-10 h-10 rounded-xl bg-background border border-border flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-sm">
                                                <ChevronRight className="w-5 h-5 text-primary" />
                                            </div>
                                        </div>
                                    </button>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-xl font-bold text-foreground">Management Tools</h2>
                        <div className="grid grid-cols-1 gap-4">
                            <div className="bg-primary/5 border border-primary/10 rounded-[2rem] p-8 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                                    <Users className="w-24 h-24 text-primary" />
                                </div>
                                <div className="space-y-3 relative z-10">
                                    <h3 className="font-black text-2xl text-foreground">User Directory</h3>
                                    <p className="text-sm text-muted-foreground font-medium pr-10">
                                        Manage internal dentists and health worker credentials and access levels
                                    </p>
                                    <button className="bg-primary text-primary-foreground text-xs font-black px-6 py-3 rounded-xl shadow-xl shadow-primary/20 mt-4 active:scale-95 transition-all">
                                        AVAILABLE SOON
                                    </button>
                                </div>
                            </div>

                            <div className="bg-success/5 border border-success/10 rounded-[2rem] p-8 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                                    <BarChart3 className="w-24 h-24 text-success" />
                                </div>
                                <div className="space-y-3 relative z-10">
                                    <h3 className="font-black text-2xl text-foreground">Platform Analytics</h3>
                                    <p className="text-sm text-muted-foreground font-medium pr-10">
                                        Advanced heatmap visualizations and statistical reporting for health boards
                                    </p>
                                    <button 
                                        onClick={() => navigate("/statistics")}
                                        className="bg-success text-success-foreground text-xs font-black px-6 py-3 rounded-xl shadow-xl shadow-success/20 mt-4 active:scale-95 transition-all"
                                    >
                                        GOTO ANALYTICS
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
