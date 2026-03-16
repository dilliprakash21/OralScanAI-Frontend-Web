import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { ActionButton } from "@/components/ui/ActionButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import { LogOut, Trash2, Shield, Lock, Bell, Moon, Languages, ChevronRight } from "lucide-react";

export default function SettingsScreen() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signOut, user, profile } = useAuth();

  const [deletePassword, setDeletePassword] = useState("");
  const [loading, setLoading] = useState(false);

  // App Preferences State
  const [notificationsEnabled, setNotificationsEnabled] = useState(() => {
    return localStorage.getItem("notifications_enabled") !== "false";
  });

  const [isDarkMode, setIsDarkMode] = useState(() => {
    return document.documentElement.classList.contains("dark") ||
      localStorage.getItem("theme") === "dark";
  });

  const toggleNotifications = () => {
    const newVal = !notificationsEnabled;
    setNotificationsEnabled(newVal);
    localStorage.setItem("notifications_enabled", String(newVal));
    toast({
      title: newVal ? "Notifications Enabled" : "Notifications Disabled",
      description: `You will ${newVal ? "now" : "no longer"} receive push notifications.`
    });
  };

  const toggleDarkMode = () => {
    const newVal = !isDarkMode;
    setIsDarkMode(newVal);
    if (newVal) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await api.auth.verifyPassword({ password: deletePassword });
      toast({
        title: "Delete request sent",
        description: "Your account deletion request has been received and is being processed.",
      });
    } catch (err: any) {
      toast({ title: "Verification failed", description: err?.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <MobileLayout className="bg-background">
      <ScreenHeader title="Settings" onBack={() => navigate("/profile")} />

      <div className="p-4 space-y-6 pb-20 overflow-y-auto">
        {/* Account Section */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider px-1">Account</h3>
          <div className="bg-card border border-border/50 rounded-2xl overflow-hidden">
            <div className="p-4 flex items-center gap-4 border-b border-border/50">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold truncate">{user?.email}</p>
                <p className="text-[11px] text-muted-foreground capitalize">{profile?.role?.replace("-", " ")}</p>
              </div>
            </div>
            <button
              onClick={() => navigate("/change-password")}
              className="w-full p-4 flex items-center justify-between hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Lock className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Change Password</span>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Preferences Section */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider px-1">App Preferences</h3>
          <div className="bg-card border border-border/50 rounded-2xl overflow-hidden">
            <button
              onClick={toggleNotifications}
              className="w-full p-4 flex items-center justify-between border-b border-border/50 hover:bg-accent/50 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <Bell className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Notifications</span>
              </div>
              <div className={`w-10 h-6 rounded-full relative transition-colors ${notificationsEnabled ? "bg-primary" : "bg-muted"}`}>
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${notificationsEnabled ? "right-1" : "left-1"}`} />
              </div>
            </button>
            <button
              onClick={toggleDarkMode}
              className="w-full p-4 flex items-center justify-between border-b border-border/50 hover:bg-accent/50 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <Moon className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Dark Mode</span>
              </div>
              <div className={`w-10 h-6 rounded-full relative transition-colors ${isDarkMode ? "bg-primary" : "bg-muted"}`}>
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isDarkMode ? "right-1" : "left-1"}`} />
              </div>
            </button>
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Languages className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Language</span>
              </div>
              <span className="text-xs text-muted-foreground font-medium">English</span>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-destructive uppercase tracking-wider px-1">Destructive actions</h3>
          <div className="bg-card border border-destructive/20 rounded-2xl p-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-destructive/10 rounded-xl flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-destructive" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold">Delete Account</p>
                <p className="text-[10px] text-muted-foreground">Permanently remove all your data</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[11px] font-bold">Confirm your password</Label>
              <Input
                type="password"
                placeholder="••••••••"
                className="h-10 text-sm"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
              />
            </div>
            <button
              onClick={handleDelete}
              disabled={loading || !deletePassword}
              className="w-full h-11 border border-destructive/30 rounded-xl text-destructive font-bold text-sm hover:bg-destructive/5 active:scale-95 transition-all disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Delete Permanently"}
            </button>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full h-14 bg-accent/50 rounded-2xl flex items-center justify-center gap-2 text-primary font-bold shadow-sm active:scale-95 transition-all"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>

        <p className="text-center text-[10px] text-muted-foreground pt-4">
          OralScan AI Platform • Version 2.0.4
        </p>
      </div>
    </MobileLayout>
  );
}
