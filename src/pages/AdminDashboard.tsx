import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Shield, ScrollText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import AppHeader from "@/components/AppHeader";
import Footer from "@/components/Footer";
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
    patient: "bg-primary/10 text-primary",
    doctor: "bg-accent/10 text-accent",
    admin: "bg-destructive/10 text-destructive",
  };

  return (
    <Card>
      <CardHeader><CardTitle className="text-lg">Users</CardTitle></CardHeader>
      <CardContent className="space-y-2">
        {isLoading && [1, 2, 3].map(i => <Skeleton key={i} className="h-14 w-full" />)}
        {users?.map(u => (
          <div key={u.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 flex-wrap gap-2">
            <div>
              <p className="font-medium text-sm">{u.first_name} {u.last_name}</p>
              <div className="flex gap-1 mt-1">
                {u.roles.map(r => <Badge key={r} className={`text-xs ${roleColors[r] ?? ""}`}>{r}</Badge>)}
              </div>
            </div>
            <Select onValueChange={(role) => assignRole.mutate({ userId: u.user_id, role: role as AppRole })}>
              <SelectTrigger className="w-36 h-8 text-xs">
                <SelectValue placeholder="Add role…" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="patient">Patient</SelectItem>
                <SelectItem value="doctor">Doctor</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function AuditLog() {
  const { data, isLoading } = useQuery({
    queryKey: ["audit-logs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("audit_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return data;
    },
  });

  return (
    <Card>
      <CardHeader><CardTitle className="text-lg">Audit Log</CardTitle></CardHeader>
      <CardContent className="space-y-2">
        {isLoading && [1, 2, 3, 4].map(i => <Skeleton key={i} className="h-10 w-full" />)}
        {!isLoading && !data?.length && <p className="text-sm text-muted-foreground text-center py-4">No audit entries yet.</p>}
        {data?.map(log => (
          <div key={log.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
            <div>
              <p className="text-sm"><span className="font-medium">{log.action}</span> on <span className="text-muted-foreground">{log.entity_type}</span></p>
            </div>
            <span className="text-xs text-muted-foreground">{format(new Date(log.created_at), "MMM d, h:mm a")}</span>
          </div>
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

      <main className="container mx-auto px-4 py-8 space-y-6 flex-1">
        <h1 className="text-2xl font-bold font-display">Admin Panel</h1>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent><p className="text-2xl font-bold">{users ?? 0}</p></CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Alerts</CardTitle>
              <Shield className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent><p className="text-2xl font-bold">{alertCount ?? 0}</p></CardContent>
          </Card>
        </div>

        <Tabs defaultValue="users">
          <TabsList>
            <TabsTrigger value="users">Users & Roles</TabsTrigger>
            <TabsTrigger value="audit">Audit Log</TabsTrigger>
          </TabsList>
          <TabsContent value="users"><UserManagement /></TabsContent>
          <TabsContent value="audit"><AuditLog /></TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
}
