import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAlerts, useUpdateAlert } from "@/hooks/useAlerts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, AlertTriangle, Activity, Search, Check, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import AppHeader from "@/components/AppHeader";
import Footer from "@/components/Footer";
import ShimmerSkeleton from "@/components/ui/ShimmerSkeleton";
import EmptyState from "@/components/ui/EmptyState";
import MotionCard from "@/components/ui/MotionCard";

function PatientList() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const { data: profiles, isLoading } = useQuery({
    queryKey: ["doctor-patients"],
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("*").order("created_at", { ascending: false }).limit(50);
      if (error) throw error;
      return data;
    },
  });

  const filtered = profiles?.filter(p =>
    `${p.first_name} ${p.last_name} `.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Card className="border-border/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-display">Patients</CardTitle>
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search patients…" className="pl-8 bg-secondary/50 border-border/50" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {isLoading && [1, 2, 3].map(i => <ShimmerSkeleton key={i} className="h-14 w-full" />)}
        {!isLoading && !filtered?.length && (
          <EmptyState icon={<Users className="h-6 w-6 text-primary" />} title="No patients found" description="Patients will appear here when they join your practice." />
        )}
        {filtered?.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.03 }}
            className="flex items-center justify-between p-3 rounded-xl bg-secondary/50 border border-border/30 hover:border-primary/20 transition-colors"
          >
            <div>
              <p className="font-medium text-sm">{p.first_name} {p.last_name}</p>
              <p className="text-xs text-muted-foreground">Joined {format(new Date(p.created_at), "MMM d, yyyy")}</p>
            </div>
            <Button size="sm" variant="ghost" className="gap-1 text-primary hover:bg-primary/10" onClick={() => navigate(`/doctor/patient/${p.user_id}`)}>
              <Eye className="h-3.5 w-3.5" /> View
            </Button>
          </motion.div>
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
    low: "bg-primary/10 text-primary border-primary/20",
    medium: "bg-warning/10 text-warning border-warning/20",
    high: "bg-destructive/10 text-destructive border-destructive/20",
    critical: "bg-destructive text-destructive-foreground border-destructive",
  };

  const handleUpdate = (id: string, status: "acknowledged" | "resolved") => {
    updateAlert.mutate({ id, status }, {
      onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
      onSuccess: () => toast({ title: `Alert ${status}` }),
    });
  };

  return (
    <Card className="border-border/50">
      <CardHeader><CardTitle className="text-lg font-display">Active Alerts</CardTitle></CardHeader>
      <CardContent className="space-y-2">
        {isLoading && [1, 2].map(i => <ShimmerSkeleton key={i} className="h-20 w-full" />)}
        {!isLoading && !alerts?.length && (
          <EmptyState icon={<AlertTriangle className="h-6 w-6 text-primary" />} title="No active alerts" description="All clear — no patients need attention right now." />
        )}
        {alerts?.map((a, i) => (
          <motion.div
            key={a.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-xl border border-border/50 bg-secondary/30 p-4 space-y-3"
          >
            <div className="flex items-center justify-between">
              <Badge className={`border ${severityColors[a.severity] ?? ""}`}>{a.severity}</Badge>
              <span className="text-xs text-muted-foreground">{format(new Date(a.created_at), "MMM d, h:mm a")}</span>
            </div>
            <p className="text-sm">{a.message}</p>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="border-border/50" onClick={() => handleUpdate(a.id, "acknowledged")} disabled={updateAlert.isPending}>
                <Check className="h-3.5 w-3.5 mr-1" /> Acknowledge
              </Button>
              <Button size="sm" variant="outline" className="border-border/50" onClick={() => handleUpdate(a.id, "resolved")} disabled={updateAlert.isPending}>
                Resolve
              </Button>
            </div>
          </motion.div>
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

      <main className="container mx-auto px-4 py-8 space-y-8 flex-1">
        <motion.h1
          className="text-2xl md:text-3xl font-bold font-display"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Doctor Dashboard
        </motion.h1>

        <div className="grid gap-4 md:grid-cols-3">
          <MotionCard delay={0} className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-destructive/10 border border-destructive/20 flex items-center justify-center shrink-0">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Alerts</p>
              <p className="text-2xl font-bold font-display">{alerts?.length ?? 0}</p>
            </div>
          </MotionCard>
          <MotionCard delay={0.08} className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Patients</p>
              <p className="text-2xl font-bold font-display">—</p>
            </div>
          </MotionCard>
          <MotionCard delay={0.16} className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
              <Activity className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg. Adherence</p>
              <p className="text-2xl font-bold font-display">—</p>
            </div>
          </MotionCard>
        </div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Tabs defaultValue="alerts">
            <TabsList className="bg-secondary/50 border border-border/50">
              <TabsTrigger value="alerts">Alerts</TabsTrigger>
              <TabsTrigger value="patients">Patients</TabsTrigger>
            </TabsList>
            <TabsContent value="alerts"><AlertsList /></TabsContent>
            <TabsContent value="patients"><PatientList /></TabsContent>
          </Tabs>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
