import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Plus, Tent, FolderOpen, BarChart3, Bell, X, User } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { RiskBadge } from "@/components/ui/RiskBadge";
import oralScanLogo from "@/assets/oralscan-logo.png";
import { formatDistanceToNow } from "date-fns";
import { api } from "@/lib/api";

interface RecentScreening {
  id: string;
  patient_id: string;
  risk_level: string | null;
  created_at: string | null;
}

export default function DashboardScreen() {
  const navigate = useNavigate();
  const { profile, user } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [recentScreenings, setRecentScreenings] = useState<RecentScreening[]>([]);
  const [stats, setStats] = useState({ today: 0, week: 0, lowRiskPercent: 0 });

  useEffect(() => {
    if (profile?.role === "admin") {
      navigate("/admin", { replace: true });
      return;
    }
    if (!user) return;

    api.notifications
      .list()
      .then((r) => setNotifications(r.notifications || []))
      .catch(() => setNotifications([]));

    api.screenings
      .list({ limit: 5 })
      .then((r) => setRecentScreenings((r.screenings || []) as any))
      .catch(() => setRecentScreenings([]));

    api.screenings
      .stats()
      .then((r) => setStats(r as any))
      .catch(() => setStats({ today: 0, week: 0, lowRiskPercent: 0 }));
  }, [user]);

  const handleMarkAllRead = async () => {
    await api.notifications.markAllRead();
    const r = await api.notifications.list();
    setNotifications(r.notifications || []);
  };

  const quickActions = [
    { icon: Plus, label: "New Screening", description: "Start a new assessment", color: "bg-primary", textColor: "text-primary-foreground", action: () => navigate("/new-screening") },
    { icon: Tent, label: "Camp Mode", description: "Mass screening workflow", color: "bg-success", textColor: "text-success-foreground", action: () => navigate("/camp-mode") },
    { icon: FolderOpen, label: "Records", description: "View patient records", color: "bg-secondary", textColor: "text-secondary-foreground", action: () => navigate("/records") },
    { icon: BarChart3, label: "Statistics", description: "View screening analytics", color: "bg-warning", textColor: "text-warning-foreground", action: () => navigate("/statistics") },
  ];

  return (
    <DashboardLayout>
      <div className="relative">
        <div className="mb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="md:hidden flex items-center gap-2 mb-2">
                <img src="/logo.png" alt="OralScan" className="w-8 h-8 object-contain" />
                <h1 className="text-2xl font-bold text-primary">OralScan AI</h1>
              </div>
              <h1 className="text-3xl font-bold hidden md:block text-foreground mb-1">Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome back, {profile?.name || profile?.email || "User"}
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowNotifications(true)}
                className="relative p-3 rounded-xl bg-card border border-border hover:bg-secondary transition-colors"
              >
                <Bell className="w-6 h-6 text-foreground" />
                {notifications.filter((n) => !n.read).length > 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-destructive rounded-full flex items-center justify-center border-2 border-background">
                    <span className="text-[10px] text-destructive-foreground font-bold">
                      {notifications.filter((n) => !n.read).length}
                    </span>
                  </div>
                )}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6 transition-all hover:shadow-md">
              <p className="text-primary/60 text-sm font-semibold uppercase tracking-wider mb-2">Today</p>
              <p className="text-primary text-3xl font-black">{stats.today}</p>
            </div>
            <div className="bg-success/5 border border-success/10 rounded-2xl p-6 transition-all hover:shadow-md">
              <p className="text-success/60 text-sm font-semibold uppercase tracking-wider mb-2">This Week</p>
              <p className="text-success text-3xl font-black">{stats.week}</p>
            </div>
            <div className="bg-warning/5 border border-warning/10 rounded-2xl p-6 transition-all hover:shadow-md">
              <p className="text-warning/60 text-sm font-semibold uppercase tracking-wider mb-2">Low Risk</p>
              <p className="text-warning text-3xl font-black">{stats.lowRiskPercent}%</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              Recent Screenings
              <span className="text-xs font-normal text-muted-foreground bg-muted px-2 py-1 rounded-full">{recentScreenings.length} total</span>
            </h2>
            <div className="space-y-3">
              {recentScreenings.length === 0 ? (
                <div className="bg-card rounded-2xl p-10 text-center border border-dashed border-border">
                  <FolderOpen className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-20" />
                  <p className="text-muted-foreground font-medium">No recent screenings found</p>
                  <button 
                    onClick={() => navigate("/new-screening")}
                    className="mt-4 text-primary font-semibold hover:underline"
                  >
                    Start your first screening
                  </button>
                </div>
              ) : (
                recentScreenings.map((screening) => (
                  <button
                    key={screening.id}
                    onClick={() => navigate(`/records/${screening.id}`)}
                    className="w-full bg-card rounded-2xl p-5 flex items-center justify-between border border-border/50 hover:border-primary/50 hover:shadow-lg transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center">
                        <User className="w-6 h-6 text-secondary-foreground" />
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-lg">Patient: {screening.patient_id}</p>
                        <p className="text-sm text-muted-foreground">
                          {screening.created_at ? formatDistanceToNow(new Date(screening.created_at), { addSuffix: true }) : ""}
                        </p>
                      </div>
                    </div>
                    <RiskBadge level={(screening.risk_level as any) || "low"} />
                  </button>
                ))
              )}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 gap-4">
              {quickActions.map((action) => (
                <button
                  key={action.label}
                  onClick={action.action}
                  className="bg-card rounded-2xl p-5 text-left border border-border/50 hover:border-primary/50 hover:shadow-lg transition-all flex items-start gap-4"
                >
                  <div className={`w-14 h-14 ${action.color} rounded-2xl flex items-center justify-center shrink-0 shadow-sm shadow-black/5`}>
                    <action.icon className={`w-7 h-7 ${action.textColor}`} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">{action.label}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{action.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {showNotifications && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-background w-full max-w-md rounded-3xl p-8 shadow-2xl animate-fade-in">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Notifications</h2>
                <button onClick={() => setShowNotifications(false)} className="p-2 rounded-xl hover:bg-muted transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {notifications.length > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="text-sm text-primary font-semibold hover:underline mb-6 block"
                >
                  Mark all as read
                </button>
              )}

              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                {notifications.length === 0 ? (
                  <div className="py-12 text-center">
                    <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-20" />
                    <p className="text-muted-foreground font-medium">No new notifications</p>
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-5 rounded-2xl border transition-all ${
                        notification.read 
                        ? "bg-muted/30 border-transparent opacity-60" 
                        : "bg-card border-border shadow-sm"
                      }`}
                    >
                      <p className="font-semibold leading-snug">{notification.text}</p>
                      <p className="text-xs text-muted-foreground mt-2 font-medium">
                        {notification.created_at ? formatDistanceToNow(new Date(notification.created_at), { addSuffix: true }) : ""}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
