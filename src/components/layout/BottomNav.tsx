import { Home, FolderOpen, BarChart3, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const navItems = [
  { icon: Home, label: "Home", path: "/dashboard" },
  { icon: FolderOpen, label: "Records", path: "/records" },
  { icon: BarChart3, label: "Stats", path: "/statistics" },
  { icon: User, label: "Profile", path: "/profile" },
];

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="bottom-nav safe-bottom">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`bottom-nav-item ${isActive ? "active" : ""}`}
          >
            <item.icon className="w-6 h-6" />
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
