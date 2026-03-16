import { useNavigate } from "react-router-dom";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { BottomNav } from "@/components/layout/BottomNav";
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
        <MobileLayout>
            <div className="min-h-screen bg-slate-900 relative">
                {/* Admin Header */}
                <div className="p-6 pt-12 pb-20">
                    <div className="flex justify-between items-start mb-8">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-primary/20 rounded-lg">
                                    <ShieldCheck className="w-5 h-5 text-primary" />
                                </div>
                                <h1 className="text-xl font-bold text-white">Admin Console</h1>
                            </div>
                            <p className="text-slate-400 text-sm">
                                Managing platform-wide oral screenings
                            </p>
                        </div>
                        <button className="p-2 rounded-full bg-slate-800 text-slate-300">
                            <Bell className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-4 backdrop-blur-sm">
                            <div className="flex items-center gap-2 mb-2">
                                <BarChart3 className="w-4 h-4 text-primary" />
                                <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total</span>
                            </div>
                            <p className="text-2xl font-bold text-white tracking-tight">{stats.total || 0}</p>
                            <p className="text-[10px] text-slate-500 mt-1">Global screening count</p>
                        </div>
                        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-4 backdrop-blur-sm">
                            <div className="flex items-center gap-2 mb-2">
                                <Users className="w-4 h-4 text-success" />
                                <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Today</span>
                            </div>
                            <p className="text-2xl font-bold text-white tracking-tight">{stats.today}</p>
                            <p className="text-[10px] text-slate-500 mt-1">Screenings performed today</p>
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="bg-background rounded-t-[2.5rem] -mt-10 min-h-[60vh] p-6 pb-24 border-t border-slate-200/10">
                    <div className="flex items-center justify-between mb-6 pt-2">
                        <h2 className="text-lg font-bold text-foreground">Global Activity</h2>
                        <button
                            onClick={() => navigate("/records")}
                            className="text-primary text-sm font-semibold flex items-center gap-1 hover:bg-primary/5 px-2 py-1 rounded-lg"
                        >
                            View all <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="space-y-3">
                        {loading ? (
                            Array(3).fill(0).map((_, i) => (
                                <div key={i} className="h-20 bg-muted animate-pulse rounded-2xl" />
                            ))
                        ) : recentScreenings.length === 0 ? (
                            <div className="bg-card/50 border border-dashed rounded-2xl p-10 text-center">
                                <FolderOpen className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-20" />
                                <p className="text-muted-foreground text-sm font-medium">No screenings recorded yet</p>
                            </div>
                        ) : (
                            recentScreenings.map((screening) => (
                                <button
                                    key={screening.id}
                                    onClick={() => navigate(`/records/${screening.id}`)}
                                    className="w-full bg-card hover:bg-accent/40 rounded-2xl p-4 flex items-center justify-between border border-border/50 transition-all hover:shadow-md group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center font-bold text-muted-foreground text-xs uppercase tracking-tighter">
                                            ID
                                        </div>
                                        <div className="text-left">
                                            <p className="font-bold text-sm text-foreground">
                                                Patient: {screening.patient_id}
                                            </p>
                                            <p className="text-[11px] font-medium text-muted-foreground mt-0.5">
                                                {screening.created_at ? formatDistanceToNow(new Date(screening.created_at), { addSuffix: true }) : ""}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <RiskBadge level={(screening.risk_level as any) || "low"} />
                                        <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                </button>
                            ))
                        )}
                    </div>

                    <div className="mt-8 grid grid-cols-1 gap-4">
                        <div className="bg-primary/5 border border-primary/10 rounded-2xl p-5 flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="font-bold text-foreground">User Management</p>
                                <p className="text-xs text-muted-foreground">Manage dentists and health workers</p>
                            </div>
                            <button className="bg-primary text-primary-foreground text-xs font-bold px-4 py-2 rounded-xl shadow-lg shadow-primary/20">
                                Coming Soon
                            </button>
                        </div>
                    </div>
                </div>

                <BottomNav />
            </div>
        </MobileLayout>
    );
}
