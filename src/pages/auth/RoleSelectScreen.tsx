import { useNavigate } from "react-router-dom";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { Stethoscope, Heart, Shield } from "lucide-react";

export default function RoleSelectScreen() {
  const navigate = useNavigate();

  const roles = [
    {
      id: "dentist",
      icon: Stethoscope,
      title: "Dentist",
      description: "Licensed dental professional conducting screenings",
    },
    {
      id: "health-worker",
      icon: Heart,
      title: "Health Worker",
      description: "Community health worker trained in oral screening",
    },
    {
      id: "admin",
      icon: Shield,
      title: "Admin",
      description: "Platform administrator with full access to all records",
    },
  ];

  const handleRoleSelect = (role: string) => {
    localStorage.setItem("userRole", role);
    navigate("/signup");
  };

  return (
    <MobileLayout className="justify-center py-8">
      <div className="text-center mb-10 animate-fade-in">
        <h1 className="text-2xl font-bold text-foreground">
          Select Your Role
        </h1>
        <p className="text-muted-foreground mt-2">
          Choose your professional role to continue
        </p>
      </div>

      <div className="space-y-4">
        {roles.map((role, index) => (
          <button
            key={role.id}
            onClick={() => handleRoleSelect(role.id)}
            className="card-dashboard w-full text-left flex items-center gap-5 animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center flex-shrink-0">
              <role.icon className="w-8 h-8 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-foreground text-lg">{role.title}</p>
              <p className="text-sm text-muted-foreground mt-1">{role.description}</p>
            </div>
          </button>
        ))}
      </div>
    </MobileLayout>
  );
}
