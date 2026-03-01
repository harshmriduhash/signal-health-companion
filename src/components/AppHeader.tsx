import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Activity, LogOut, LayoutDashboard, Users, Shield, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

interface AppHeaderProps {
  badge?: { label: string; className?: string };
}

export default function AppHeader({ badge }: AppHeaderProps) {
  const { user, roles, signOut } = useAuth();
  const location = useLocation();

  const isDoctor = roles.includes("doctor");
  const isAdmin = roles.includes("admin");
  const isPatient = roles.includes("patient");

  const navItems = [
    ...(isPatient ? [{ to: "/patient", label: "Dashboard", icon: LayoutDashboard }] : []),
    ...(isDoctor ? [
      { to: "/doctor", label: "Doctor Dashboard", icon: Users },
    ] : []),
    ...(isAdmin ? [{ to: "/admin", label: "Admin Panel", icon: Shield }] : []),
  ];

  // Determine badge automatically if not provided
  const displayBadge = badge ?? (
    isAdmin ? { label: "Admin", className: "bg-destructive/10 text-destructive" } :
    isDoctor ? { label: "Doctor", className: "bg-primary/10 text-primary" } :
    { label: "Patient", className: "bg-accent/10 text-accent" }
  );

  return (
    <header className="border-b border-border bg-card sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="flex items-center gap-2">
            <Activity className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold font-display">SignalRX</span>
          </Link>
          {displayBadge && (
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${displayBadge.className ?? "bg-primary/10 text-primary"}`}>
              {displayBadge.label}
            </span>
          )}
          <nav className="hidden md:flex items-center gap-1 ml-4">
            {navItems.map(item => (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                  location.pathname === item.to || location.pathname.startsWith(item.to + "/")
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground hidden sm:inline">{user?.email}</span>
          <Button variant="ghost" size="icon" onClick={signOut} title="Sign out">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
