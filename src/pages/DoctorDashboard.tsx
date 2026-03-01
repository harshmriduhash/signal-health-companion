import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAlerts, useUpdateAlert } from "@/hooks/useAlerts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, AlertTriangle, Activity, Search, Check, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import AppHeader from "@/components/AppHeader";
import Footer from "@/components/Footer";

function PatientList() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const { data: profiles, isLoading } = useQuery({
    queryKey: ["doctor-patients"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return data;
    },
  });

  const filtered = profiles?.filter(p =>
    `${p.first_name} ${p.last_name} `.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Patients</CardTitle>
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search patients…" className="pl-8" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {isLoading && [1, 2, 3].map(i => <Skeleton key={i} className="h-14 w-full" />)}
        {!isLoading && !filtered?.length && <p className="text-sm text-muted-foreground text-center py-4">No patients found.</p>}
        {filtered?.map(p => (
          <div key={p.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
            <div>
              <p className="font-medium text-sm">{p.first_name} {p.last_name}</p>
              <p className="text-xs text-muted-foreground">Joined {format(new Date(p.created_at), "MMM d, yyyy")}</p>
            </div>
            <Button size="sm" variant="ghost" className="gap-1" onClick={() => navigate(`/doctor/patient/${p.user_id}`)}><Eye className="h-3.5 w-3.5" /> View</Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function AlertsList() {
  const { data: alerts, isLoading } = useAlerts({ status: "active" });
  const updateAlert = useUpdateAlert();
  const { toast } = useToast();

  const severityColors: Record<string, string> = {
    low: "bg-success/10 text-success",
    medium: "bg-warning/10 text-warning",
    high: "bg-destructive/10 text-destructive",
    critical: "bg-destructive text-destructive-foreground",
  };

  const handleUpdate = (id: string, status: "acknowledged" | "resolved") => {
    updateAlert.mutate({ id, status }, {
      onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
      onSuccess: () => toast({ title: `Alert ${status}` }),
    });
  };

  return (
    <Card>
      <CardHeader><CardTitle className="text-lg">Active Alerts</CardTitle></CardHeader>
      <CardContent className="space-y-2">
        {isLoading && [1, 2].map(i => <Skeleton key={i} className="h-16 w-full" />)}
        {!isLoading && !alerts?.length && <p className="text-sm text-muted-foreground text-center py-4">No active alerts 🎉</p>}
        {alerts?.map(a => (
          <div key={a.id} className="rounded-lg border border-border p-3 space-y-2">
            <div className="flex items-center justify-between">
              <Badge className={severityColors[a.severity] ?? ""}>{a.severity}</Badge>
              <span className="text-xs text-muted-foreground">{format(new Date(a.created_at), "MMM d, h:mm a")}</span>
            </div>
            <p className="text-sm">{a.message}</p>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => handleUpdate(a.id, "acknowledged")} disabled={updateAlert.isPending}>
                <Check className="h-3.5 w-3.5 mr-1" /> Acknowledge
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleUpdate(a.id, "resolved")} disabled={updateAlert.isPending}>
                Resolve
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export default function DoctorDashboard() {
  const { data: alerts } = useAlerts({ status: "active" });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppHeader />

      <main className="container mx-auto px-4 py-8 space-y-6 flex-1">
        <h1 className="text-2xl font-bold font-display">Doctor Dashboard</h1>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Alerts</CardTitle>
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{alerts?.length ?? 0}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Patients</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">—</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Adherence</CardTitle>
              <Activity className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">—</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="alerts">
          <TabsList>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
            <TabsTrigger value="patients">Patients</TabsTrigger>
          </TabsList>
          <TabsContent value="alerts"><AlertsList /></TabsContent>
          <TabsContent value="patients"><PatientList /></TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
}
