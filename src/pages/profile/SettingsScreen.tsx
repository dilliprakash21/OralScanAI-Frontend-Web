import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ActionButton } from "@/components/ui/ActionButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { LogOut, Trash2, Shield, Lock, Bell, Moon, Languages, ChevronRight, Loader2 } from "lucide-react";

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
    <DashboardLayout>
      <div className="max-w-6xl mx-auto py-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 px-4">
          <div>
            <h1 className="text-3xl font-black text-foreground mb-1">System Configurations</h1>
            <p className="text-muted-foreground font-medium">Fine-tune your application preferences and security settings</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 px-4 animate-fade-in">
          {/* Left: Preferences & Identity */}
          <div className="lg:col-span-7 space-y-8">
            {/* Preferences Section */}
            <div className="bg-card border border-border/50 rounded-[2.5rem] p-8 md:p-10 shadow-sm space-y-8">
               <h3 className="text-xl font-black text-foreground uppercase tracking-widest flex items-center gap-3">
                  <div className="w-2 h-8 bg-primary rounded-full" />
                  App Preferences
               </h3>

               <div className="space-y-4">
                  {[
                    { 
                      icon: Bell, 
                      label: "Push Notifications", 
                      desc: "Receive real-time alerts for screenings and system updates", 
                      active: notificationsEnabled, 
                      action: toggleNotifications 
                    },
                    { 
                      icon: Moon, 
                      label: "Dark Interface", 
                      desc: "Toggle between light and high-contrast dark visual modes", 
                      active: isDarkMode, 
                      action: toggleDarkMode 
                    },
                  ].map((item) => (
                    <button
                      key={item.label}
                      onClick={item.action}
                      className="w-full group flex items-center justify-between p-6 rounded-3xl border-2 border-border/50 bg-secondary/5 hover:border-primary/30 transition-all duration-300 text-left"
                    >
                      <div className="flex items-center gap-6">
                         <div className={`w-12 h-12 rounded-2xl bg-background flex items-center justify-center shadow-sm group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 ${item.active ? "bg-primary/10 text-primary" : ""}`}>
                            <item.icon className="w-6 h-6" />
                         </div>
                         <div>
                            <p className="text-lg font-black text-foreground">{item.label}</p>
                            <p className="text-xs text-muted-foreground font-medium">{item.desc}</p>
                         </div>
                      </div>
                      <div className={`w-14 h-8 rounded-full relative transition-all duration-300 ${item.active ? "bg-primary shadow-lg shadow-primary/20" : "bg-muted"}`}>
                        <div className={`absolute top-1.5 w-5 h-5 bg-white rounded-full shadow-sm transition-all duration-300 ${item.active ? "right-1.5" : "left-1.5"}`} />
                      </div>
                    </button>
                  ))}

                  <div className="flex items-center justify-between p-6 rounded-3xl bg-secondary/10 border border-border/50">
                    <div className="flex items-center gap-6">
                       <div className="w-12 h-12 rounded-2xl bg-background flex items-center justify-center shadow-sm">
                          <Languages className="w-6 h-6 text-primary" />
                       </div>
                       <div>
                          <p className="text-lg font-black text-foreground">Localization</p>
                          <p className="text-xs text-muted-foreground font-medium">Selected system language and region</p>
                       </div>
                    </div>
                    <span className="text-sm font-black text-primary bg-primary/10 px-4 py-1.5 rounded-full uppercase tracking-widest">English</span>
                  </div>
               </div>
            </div>

            {/* Account Info */}
            <div className="bg-card border border-border/50 rounded-[2.5rem] p-8 md:p-10 shadow-sm relative overflow-hidden">
               <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-black text-foreground uppercase tracking-widest flex items-center gap-3">
                     <div className="w-2 h-8 bg-primary rounded-full" />
                     Credential Management
                  </h3>
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                     <Shield className="w-6 h-6 text-primary" />
                  </div>
               </div>
               
               <div className="space-y-6">
                  <div className="bg-secondary/10 rounded-3xl p-6 border border-border/50 flex items-center justify-between group cursor-default">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-background flex items-center justify-center shadow-sm">
                           <Lock className="w-6 h-6 text-muted-foreground" />
                        </div>
                        <div>
                           <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">SECURE IDENTITY</p>
                           <p className="text-lg font-black text-foreground truncate">{user?.email}</p>
                        </div>
                     </div>
                     <span className="text-[10px] font-black text-white bg-foreground px-3 py-1.5 rounded-lg uppercase tracking-widest">{profile?.role}</span>
                  </div>

                  <button
                    onClick={() => navigate("/change-password")}
                    className="w-full p-6 flex items-center justify-between rounded-3xl border-2 border-border/80 hover:border-primary hover:bg-primary/5 transition-all text-left group"
                  >
                    <div className="flex items-center gap-4">
                       <p className="text-base font-black text-foreground">UPDATE ACCOUNT PASSWORD</p>
                    </div>
                    <ChevronRight className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-all group-hover:translate-x-2" />
                  </button>
               </div>
            </div>
          </div>

          {/* Right: Security & Session */}
          <div className="lg:col-span-5 space-y-8">
            {/* Danger Zone */}
            <div className="bg-destructive/5 border-2 border-destructive/20 rounded-[2.5rem] p-8 md:p-10 shadow-sm space-y-8">
               <div className="space-y-4">
                  <h3 className="text-xl font-black text-destructive uppercase tracking-widest flex items-center gap-3">
                     <div className="w-2 h-8 bg-destructive rounded-full" />
                     Critical Security
                  </h3>
                  <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                     Once an account is purged, all clinical records, history, and credentials 
                     are permanently redacted from our medical cloud storage.
                  </p>
               </div>

               <div className="space-y-6">
                  <div className="space-y-3">
                    <Label className="text-[11px] font-black text-foreground uppercase tracking-widest ml-1">Authentication Required</Label>
                    <Input
                      type="password"
                      placeholder="Enter password to confirm purge..."
                      className="h-14 rounded-2xl border-2 border-destructive/20 focus:border-destructive bg-white text-base font-medium px-6 outline-none transition-all shadow-inner"
                      value={deletePassword}
                      onChange={(e) => setDeletePassword(e.target.value)}
                    />
                  </div>
                  <button
                    onClick={handleDelete}
                    disabled={loading || !deletePassword}
                    className="w-full py-5 rounded-[1.5rem] bg-destructive text-white font-black tracking-widest uppercase hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-destructive/20 disabled:opacity-50 flex items-center justify-center gap-3"
                  >
                    {loading ? (
                       <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                       <Trash2 className="w-6 h-6" />
                    )}
                    PURGE ACCOUNT PERMANENTLY
                  </button>
               </div>
            </div>

            <button
              onClick={handleLogout}
              className="w-full max-w-sm mx-auto py-5 bg-secondary border-2 border-border/80 rounded-[1.5rem] flex items-center justify-center gap-4 text-primary font-black uppercase tracking-widest hover:bg-secondary/80 active:scale-[0.95] transition-all shadow-lg"
            >
              <LogOut className="w-6 h-6" />
              TERMINATE SESSION
            </button>

            <div className="text-center pt-8">
               <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-40">
                OralScan AI Platform • Clinical Suite • v2.0.4-WS
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
