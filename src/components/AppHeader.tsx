import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Activity, LogOut, LayoutDashboard, Users, Shield } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

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
    ...(isDoctor ? [{ to: "/doctor", label: "Doctor Dashboard", icon: Users }] : []),
    ...(isAdmin ? [{ to: "/admin", label: "Admin Panel", icon: Shield }] : []),
  ];

  const displayBadge = badge ?? (
    isAdmin ? { label: "Admin", className: "bg-destructive/10 text-destructive border-destructive/20" } :
    isDoctor ? { label: "Doctor", className: "bg-primary/10 text-primary border-primary/20" } :
    { label: "Patient", className: "bg-accent/10 text-accent border-accent/20" }
  );

  return (
    <motion.header
      className="border-b border-border/30 bg-background/60 backdrop-blur-xl sticky top-0 z-50"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Activity className="h-4 w-4 text-primary" />
            </div>
            <span className="text-lg font-bold font-display">MedPulse</span>
          </Link>
          {displayBadge && (
            <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium border ${displayBadge.className ?? "bg-primary/10 text-primary border-primary/20"}`}>
              {displayBadge.label}
            </span>
          )}
          <nav className="hidden md:flex items-center gap-1 ml-4">
            {navItems.map(item => (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200",
                  location.pathname === item.to || location.pathname.startsWith(item.to + "/")
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
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
          <Button variant="ghost" size="icon" onClick={signOut} title="Sign out" className="hover:bg-destructive/10 hover:text-destructive transition-colors">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.header>
  );
}
