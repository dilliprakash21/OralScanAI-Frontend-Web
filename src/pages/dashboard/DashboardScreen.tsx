import { useNavigate } from "react-router-dom";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { BottomNav } from "@/components/layout/BottomNav";
import { Plus, Tent, FolderOpen, BarChart3, Bell, X } from "lucide-react";
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
    <MobileLayout>
      <div className="min-h-screen bg-primary relative">
        <div className="p-4 pt-12">
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <img src="/logo.png" alt="OralScan" className="w-8 h-8 object-contain" />
                <h1 className="text-2xl font-bold text-primary-foreground">OralScan AI</h1>
              </div>
              <p className="text-primary-foreground/80">
                Welcome back, {profile?.name || profile?.email || "User"}
              </p>
            </div>
            <button
              onClick={() => setShowNotifications(true)}
              className="relative p-2 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors"
            >
              <Bell className="w-6 h-6 text-primary-foreground" />
              {notifications.filter((n) => !n.read).length > 0 && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-destructive rounded-full flex items-center justify-center">
                  <span className="text-xs text-destructive-foreground font-bold">
                    {notifications.filter((n) => !n.read).length}
                  </span>
                </div>
              )}
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-primary-foreground/10 rounded-lg p-4 text-center">
              <p className="text-primary-foreground/80 text-sm">Today</p>
              <p className="text-primary-foreground text-2xl font-bold">{stats.today}</p>
            </div>
            <div className="bg-primary-foreground/10 rounded-lg p-4 text-center">
              <p className="text-primary-foreground/80 text-sm">This Week</p>
              <p className="text-primary-foreground text-2xl font-bold">{stats.week}</p>
            </div>
            <div className="bg-primary-foreground/10 rounded-lg p-4 text-center">
              <p className="text-primary-foreground/80 text-sm">Low Risk</p>
              <p className="text-primary-foreground text-2xl font-bold">{stats.lowRiskPercent}%</p>
            </div>
          </div>
        </div>

        <div className="bg-background rounded-t-3xl flex-1 p-6 pb-24">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4 mb-8">
            {quickActions.map((action) => (
              <button
                key={action.label}
                onClick={action.action}
                className="bg-card rounded-xl p-4 text-left hover:shadow-md transition-shadow"
              >
                <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center mb-3`}>
                  <action.icon className={`w-6 h-6 ${action.textColor}`} />
                </div>
                <h3 className="font-semibold mb-1">{action.label}</h3>
                <p className="text-sm text-muted-foreground">{action.description}</p>
              </button>
            ))}
          </div>

          <h2 className="text-xl font-bold mb-4">Recent Screenings</h2>
          <div className="space-y-3">
            {recentScreenings.length === 0 ? (
              <div className="bg-card rounded-xl p-6 text-center">
                <p className="text-muted-foreground">No screenings yet</p>
              </div>
            ) : (
              recentScreenings.map((screening) => (
                <button
                  key={screening.id}
                  onClick={() => navigate(`/records/${screening.id}`)}
                  className="w-full bg-card rounded-xl p-4 flex items-center justify-between hover:shadow-md transition-shadow"
                >
                  <div>
                    <p className="font-semibold">Patient ID: {screening.patient_id}</p>
                    <p className="text-sm text-muted-foreground">
                      {screening.created_at ? formatDistanceToNow(new Date(screening.created_at), { addSuffix: true }) : ""}
                    </p>
                  </div>
                  <RiskBadge level={(screening.risk_level as any) || "low"} />
                </button>
              ))
            )}
          </div>
        </div>

        {showNotifications && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
            <div className="bg-background w-full max-h-[80vh] rounded-t-3xl p-6 overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Notifications</h2>
                <button onClick={() => setShowNotifications(false)} className="p-2 rounded-full hover:bg-muted">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {notifications.length > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="text-sm text-primary underline underline-offset-4 mb-4"
                >
                  Mark all as read
                </button>
              )}

              <div className="space-y-3">
                {notifications.length === 0 ? (
                  <div className="bg-card rounded-xl p-6 text-center">
                    <p className="text-muted-foreground">No notifications</p>
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`bg-card rounded-xl p-4 ${notification.read ? "opacity-60" : ""}`}
                    >
                      <p className="font-medium">{notification.text}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {notification.created_at ? formatDistanceToNow(new Date(notification.created_at), { addSuffix: true }) : ""}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        <BottomNav />
      </div>
    </MobileLayout>
  );
}
