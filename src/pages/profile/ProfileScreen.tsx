import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { BottomNav } from "@/components/layout/BottomNav";
import { User, Settings, FileText, Info, Cloud, LogOut, ChevronRight, HelpCircle } from "lucide-react";
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

  const displayName = profile?.name || user?.user_metadata?.name || "User";
  const displayEmail = profile?.email || user?.email || "";
  const displayPhone = profile?.phone || user?.user_metadata?.phone || "Not provided";
  const displayRole = profile?.role || user?.user_metadata?.role || "";
  const displayClinic = profile?.clinic || profile?.hospital || "Not set";
  const avatarUrl = profile?.avatar_url;

  return (
    <MobileLayout noPadding className="pb-20">
      <ScreenHeader title="Profile" showBack={false} />

      <div className="flex-1 px-4 py-6 overflow-auto">
        {/* Profile Card */}
        <div className="bg-card rounded-2xl p-5 border border-border/50 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center bg-primary/10">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User className="w-8 h-8 text-primary" />
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-foreground">{displayName}</h2>
              <p className="text-sm text-muted-foreground capitalize">{displayRole.replace("-", " ")}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{displayEmail}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-muted/50 rounded-xl p-3">
              <p className="text-xs text-muted-foreground">Phone</p>
              <p className="text-sm font-medium text-foreground mt-0.5">{displayPhone}</p>
            </div>
            <div className="bg-muted/50 rounded-xl p-3">
              <p className="text-xs text-muted-foreground">Hospital / Clinic</p>
              <p className="text-sm font-medium text-foreground mt-0.5">{displayClinic}</p>
            </div>
          </div>

          <button onClick={() => navigate("/edit-profile")}
            className="mt-4 w-full h-11 bg-accent rounded-xl text-primary font-medium text-sm">
            Edit Profile
          </button>
        </div>

        {/* Menu */}
        <div className="space-y-2">
          {menuItems.map((item) => (
            <button key={item.path} onClick={() => navigate(item.path)}
              className="w-full bg-card rounded-xl p-4 border border-border/50 flex items-center gap-3">
              <div className="w-9 h-9 bg-accent rounded-xl flex items-center justify-center">
                <item.icon className="w-5 h-5 text-primary" />
              </div>
              <span className="flex-1 text-left text-sm font-medium text-foreground">{item.label}</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
          ))}

          <button onClick={handleLogout}
            className="w-full bg-destructive/5 border border-destructive/20 rounded-xl p-4 flex items-center gap-3">
            <div className="w-9 h-9 bg-destructive/10 rounded-xl flex items-center justify-center">
              <LogOut className="w-5 h-5 text-destructive" />
            </div>
            <span className="flex-1 text-left text-sm font-medium text-destructive">Sign Out</span>
          </button>
        </div>
      </div>
      <BottomNav />
    </MobileLayout>
  );
}
