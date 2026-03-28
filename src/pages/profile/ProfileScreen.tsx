import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { User, Settings, FileText, Info, Cloud, LogOut, ChevronRight, HelpCircle, Phone, MapPin } from "lucide-react";
import { toast } from "sonner";

export default function ProfileScreen() {
  const navigate = useNavigate();
  const { profile, user, signOut } = useAuth();

  const menuItems = [
    { icon: Settings, label: "Settings", path: "/settings" },
    { icon: Cloud, label: "Sync & Backup", path: "/settings/sync" },
    { icon: FileText, label: "Clinical Disclaimer", path: "/disclaimer" },
    { icon: Info, label: "About Plaque & Gingival Index", path: "/about-indices" },
    { icon: HelpCircle, label: "Help & Support", path: "/help" },
  ];

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
    toast.success("Signed out successfully");
  };

  const displayName = profile?.name || (user as any)?.user_metadata?.name || "User";
  const displayEmail = profile?.email || user?.email || "";
  const displayPhone = profile?.phone || (user as any)?.user_metadata?.phone || "Not provided";
  const displayRole = profile?.role || (user as any)?.user_metadata?.role || "";
  const displayClinic = profile?.clinic || profile?.hospital || "Not set";
  const avatarUrl = profile?.avatar_url;

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto py-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 px-4">
          <div>
            <h1 className="text-3xl font-black text-foreground mb-1">Provider Profile</h1>
            <p className="text-muted-foreground font-medium">Manage your professional credentials and account preferences</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 px-4 animate-fade-in">
          {/* Left: Profile Overview */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-card border border-border/50 rounded-[2.5rem] p-8 md:p-10 shadow-sm relative overflow-hidden">
               {/* Decorative Background */}
               <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/5 rounded-full blur-2xl" />
               
               <div className="relative z-10 flex flex-col items-center text-center space-y-6">
                  <div className="relative group">
                     <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                     <div className="relative w-32 h-32 rounded-full border-4 border-background shadow-2xl overflow-hidden bg-secondary/50 flex items-center justify-center">
                        {avatarUrl ? (
                          <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-16 h-16 text-primary" />
                        )}
                     </div>
                  </div>

                  <div className="space-y-1">
                     <h2 className="text-2xl font-black text-foreground">{displayName}</h2>
                     <p className="text-sm font-black text-primary uppercase tracking-widest">{displayRole.replace("-", " ")}</p>
                     <p className="text-xs text-muted-foreground font-medium">{displayEmail}</p>
                  </div>

                  <div className="w-full pt-6 border-t border-border/50 grid grid-cols-1 gap-4">
                     {[
                       { label: "PHONE CONTACT", value: displayPhone, icon: Phone },
                       { label: "PRIMARY FACILITY", value: displayClinic, icon: MapPin },
                     ].map(({ label, value, icon: Icon }) => (
                       <div key={label} className="bg-secondary/10 rounded-2xl p-4 flex items-center gap-4 text-left group hover:bg-primary/5 transition-all">
                          <div className="w-10 h-10 rounded-xl bg-background flex items-center justify-center shrink-0 shadow-sm group-hover:scale-110 transition-transform">
                             <Icon className="w-5 h-5 text-primary" />
                          </div>
                          <div className="min-w-0">
                             <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{label}</p>
                             <p className="text-sm font-bold text-foreground truncate">{value}</p>
                          </div>
                       </div>
                     ))}
                  </div>

                  <button 
                    onClick={() => navigate("/edit-profile")}
                    className="w-full py-4 rounded-2xl bg-foreground text-background font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl"
                  >
                    EDIT ACCOUNT BIO
                  </button>
               </div>
            </div>
          </div>

          {/* Right: Detailed Settings & Preferences */}
          <div className="lg:col-span-8 flex flex-col gap-6">
             <div className="bg-card border border-border/50 rounded-[2.5rem] p-8 md:p-10 shadow-sm">
                <h3 className="text-xl font-black text-foreground mb-8 uppercase tracking-widest flex items-center gap-3">
                   <div className="w-2 h-8 bg-primary rounded-full" />
                   System Management
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {menuItems.map((item) => (
                     <button 
                       key={item.path} 
                       onClick={() => navigate(item.path)}
                       className="group flex flex-col p-6 rounded-3xl border-2 border-border/50 bg-secondary/5 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 text-left relative overflow-hidden"
                     >
                       <div className="absolute -top-4 -right-4 w-16 h-16 bg-primary/5 rounded-full group-hover:scale-150 transition-transform" />
                       <div className="flex items-center justify-between mb-4 relative z-10">
                          <div className="w-12 h-12 rounded-2xl bg-background flex items-center justify-center shadow-sm group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                             <item.icon className="w-6 h-6" />
                          </div>
                          <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-all group-hover:translate-x-1" />
                       </div>
                       <p className="text-lg font-black text-foreground mb-1 relative z-10">{item.label}</p>
                       <p className="text-xs text-muted-foreground font-medium relative z-10">Manage system {item.label.toLowerCase()} and configurations</p>
                     </button>
                   ))}

                   <button 
                     onClick={handleLogout}
                     className="group flex flex-col p-6 rounded-3xl border-2 border-destructive/20 bg-destructive/5 hover:border-destructive/50 hover:bg-destructive/10 transition-all duration-300 text-left relative overflow-hidden"
                   >
                     <div className="absolute -top-4 -right-4 w-16 h-16 bg-destructive/5 rounded-full" />
                     <div className="flex items-center justify-between mb-4 relative z-10">
                        <div className="w-12 h-12 rounded-2xl bg-background flex items-center justify-center shadow-sm group-hover:bg-destructive group-hover:text-white transition-all duration-300">
                           <LogOut className="w-6 h-6" />
                        </div>
                     </div>
                     <p className="text-lg font-black text-destructive mb-1 relative z-10">Sign Out</p>
                     <p className="text-xs text-destructive/60 font-medium relative z-10">Securely terminate the current session</p>
                   </button>
                </div>
             </div>

             <div className="p-8 bg-secondary/20 rounded-[2rem] border border-border/50 flex items-center justify-between">
                <div>
                  <p className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-1">Platform Version</p>
                  <p className="text-sm font-black text-foreground font-mono">2.0.4-WEB-STABLE</p>
                </div>
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                   <p className="text-[10px] font-black text-muted-foreground uppercase tracking-tighter">Connected to secure cloud</p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
