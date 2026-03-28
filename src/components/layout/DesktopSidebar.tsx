import { Home, FolderOpen, BarChart3, User, LogOut, Shield } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  { icon: Home, label: "Home", path: "/dashboard", roles: ["dentist", "health_worker"] },
  { icon: Shield, label: "Admin", path: "/admin", roles: ["admin"] },
  { icon: FolderOpen, label: "Records", path: "/records", roles: ["dentist", "health_worker"] },
  { icon: BarChart3, label: "Statistics", path: "/statistics", roles: ["dentist", "health_worker", "admin"] },
  { icon: User, label: "Profile", path: "/profile", roles: ["dentist", "health_worker", "admin"] },
];

export function DesktopSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile, signOut } = useAuth();
  const role = profile?.role;

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  const filteredNavItems = navItems.filter(item => 
    !item.roles || (role && item.roles.includes(role))
  );

  return (
    <aside className="desktop-sidebar p-6">
      <div className="flex flex-col items-center gap-4 mb-10 px-2 outline-none">
        <div className="w-20 h-20 bg-white border border-border/20 rounded-2xl p-1 shadow-md flex items-center justify-center overflow-hidden">
          <img src="/logo.png" alt="OralScan AI" className="w-full h-full object-contain" />
        </div>
        <span className="text-2xl font-black text-foreground tracking-tighter uppercase leading-none text-center">OralScan AI</span>
      </div>

      <nav className="flex-1 space-y-2">
        {filteredNavItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive 
                  ? "bg-primary text-primary-foreground shadow-md" 
                  : "text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="mt-auto pt-6 border-t border-border">
        <div className="px-4 py-4 mb-4 bg-secondary/50 rounded-xl">
          <p className="text-xs text-muted-foreground uppercase font-semibold mb-1">Logged in as</p>
          <p className="text-sm font-bold truncate">{profile?.name || "User"}</p>
          <p className="text-xs text-muted-foreground capitalize">{role?.replace("_", " ")}</p>
        </div>
        
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-destructive hover:bg-destructive/10 transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}
