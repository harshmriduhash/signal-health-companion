import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Shield, ScrollText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { motion } from "framer-motion";
import AppHeader from "@/components/AppHeader";
import Footer from "@/components/Footer";
import ShimmerSkeleton from "@/components/ui/ShimmerSkeleton";
import EmptyState from "@/components/ui/EmptyState";
import MotionCard from "@/components/ui/MotionCard";
import type { Database } from "@/integrations/supabase/types";

type AppRole = Database["public"]["Enums"]["app_role"];

function UserManagement() {
  const { toast } = useToast();
  const qc = useQueryClient();

  const { data: users, isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const { data: profiles, error } = await supabase.from("profiles").select("*").order("created_at", { ascending: false }).limit(100);
      if (error) throw error;
      const { data: roles } = await supabase.from("user_roles").select("*");
      return profiles.map(p => ({
        ...p,
        roles: roles?.filter(r => r.user_id === p.user_id).map(r => r.role) ?? [],
      }));
    },
  });

  const assignRole = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: AppRole }) => {
      const { error } = await supabase.from("user_roles").insert({ user_id: userId, role });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-users"] });
      toast({ title: "Role assigned" });
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const roleColors: Record<string, string> = {
    patient: "bg-primary/10 text-primary border-primary/20",
    doctor: "bg-accent/10 text-accent border-accent/20",
    admin: "bg-destructive/10 text-destructive border-destructive/20",
  };

  return (
    <Card className="border-border/50">
      <CardHeader><CardTitle className="text-lg font-display">Users</CardTitle></CardHeader>
      <CardContent className="space-y-2">
        {isLoading && [1, 2, 3].map(i => <ShimmerSkeleton key={i} className="h-14 w-full" />)}
        {users?.map((u, i) => (
          <motion.div
            key={u.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.03 }}
            className="flex items-center justify-between p-3 rounded-xl bg-secondary/50 border border-border/30 flex-wrap gap-2"
          >
            <div>
              <p className="font-medium text-sm">{u.first_name} {u.last_name}</p>
              <div className="flex gap-1 mt-1">
                {u.roles.map(r => <Badge key={r} className={`text-xs border ${roleColors[r] ?? ""}`}>{r}</Badge>)}
              </div>
            </div>
            <Select onValueChange={role => assignRole.mutate({ userId: u.user_id, role: role as AppRole })}>
              <SelectTrigger className="w-36 h-8 text-xs bg-secondary/50 border-border/50">
                <SelectValue placeholder="Add role…" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="patient">Patient</SelectItem>
                <SelectItem value="doctor">Doctor</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
}

function AuditLog() {
  const { data, isLoading } = useQuery({
    queryKey: ["audit-logs"],
    queryFn: async () => {
      const { data, error } = await supabase.from("audit_logs").select("*").order("created_at", { ascending: false }).limit(50);
      if (error) throw error;
      return data;
    },
  });

  return (
    <Card className="border-border/50">
      <CardHeader><CardTitle className="text-lg font-display">Audit Log</CardTitle></CardHeader>
      <CardContent className="space-y-2">
        {isLoading && [1, 2, 3, 4].map(i => <ShimmerSkeleton key={i} className="h-12 w-full" />)}
        {!isLoading && !data?.length && (
          <EmptyState icon={<ScrollText className="h-6 w-6 text-primary" />} title="No audit entries" description="Activity logs will appear here as users interact with the system." />
        )}
        {data?.map((log, i) => (
          <motion.div
            key={log.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.03 }}
            className="flex items-center justify-between p-3 rounded-xl bg-secondary/50 border border-border/30"
          >
            <p className="text-sm"><span className="font-medium">{log.action}</span> on <span className="text-muted-foreground">{log.entity_type}</span></p>
            <span className="text-xs text-muted-foreground">{format(new Date(log.created_at), "MMM d, h:mm a")}</span>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
}

export default function AdminDashboard() {
  const { data: users } = useQuery({
    queryKey: ["admin-user-count"],
    queryFn: async () => {
      const { count } = await supabase.from("profiles").select("*", { count: "exact", head: true });
      return count ?? 0;
    },
  });

  const { data: alertCount } = useQuery({
    queryKey: ["admin-alert-count"],
    queryFn: async () => {
      const { count } = await supabase.from("alerts").select("*", { count: "exact", head: true }).eq("status", "active");
      return count ?? 0;
    },
  });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppHeader />

      <main className="container mx-auto px-4 py-8 space-y-8 flex-1">
        <motion.h1
          className="text-2xl md:text-3xl font-bold font-display"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Admin Panel
        </motion.h1>

        <div className="grid gap-4 md:grid-cols-4">
          <MotionCard delay={0} className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Users</p>
              <p className="text-2xl font-bold font-display">{users ?? 0}</p>
            </div>
          </MotionCard>
          <MotionCard delay={0.08} className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-destructive/10 border border-destructive/20 flex items-center justify-center shrink-0">
              <Shield className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Alerts</p>
              <p className="text-2xl font-bold font-display">{alertCount ?? 0}</p>
            </div>
          </MotionCard>
        </div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Tabs defaultValue="users">
            <TabsList className="bg-secondary/50 border border-border/50">
              <TabsTrigger value="users">Users & Roles</TabsTrigger>
              <TabsTrigger value="audit">Audit Log</TabsTrigger>
            </TabsList>
            <TabsContent value="users"><UserManagement /></TabsContent>
            <TabsContent value="audit"><AuditLog /></TabsContent>
          </Tabs>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
