import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Activity, LogOut } from "lucide-react";
import { Link } from "react-router-dom";

interface AppHeaderProps {
  badge?: { label: string; className?: string };
}

export default function AppHeader({ badge }: AppHeaderProps) {
  const { user, signOut } = useAuth();

  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <Link to="/dashboard" className="flex items-center gap-2">
            <Activity className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold font-display">SignalRX</span>
          </Link>
          {badge && (
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${badge.className ?? "bg-primary/10 text-primary"}`}>
              {badge.label}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground hidden sm:inline">{user?.email}</span>
          <Button variant="ghost" size="icon" onClick={signOut}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
