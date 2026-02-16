import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Pill, Activity, ClipboardList, Brain, AlertTriangle, TrendingUp, ShieldCheck } from "lucide-react";
import { format, subDays } from "date-fns";
import AppHeader from "@/components/AppHeader";
import AdherenceChart from "@/components/charts/AdherenceChart";

const severityLabels = ["", "Mild", "Minor", "Moderate", "Severe", "Critical"];
const severityColors = ["", "text-success", "text-accent", "text-warning", "text-destructive", "text-destructive"];
const riskColors: Record<string, string> = {
  low: "bg-success/10 text-success",
  medium: "bg-warning/10 text-warning",
  high: "bg-destructive/10 text-destructive",
  critical: "bg-destructive text-destructive-foreground",
};
const typeIcons: Record<string, any> = {
  adherence: TrendingUp,
  side_effect: AlertTriangle,
  risk: ShieldCheck,
};

export default function DoctorPatientDetail() {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["doctor-patient-profile", patientId],
    enabled: !!patientId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", patientId!)
        .single();
      if (error) throw error;
      return data;
    },
  });

  const { data: medications } = useQuery({
    queryKey: ["doctor-patient-meds", patientId],
    enabled: !!patientId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("medications")
        .select("*")
        .eq("user_id", patientId!)
        .eq("active", true)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: medLogs } = useQuery({
    queryKey: ["doctor-patient-medlogs", patientId],
    enabled: !!patientId,
    queryFn: async () => {
      const since = subDays(new Date(), 14).toISOString();
      const { data, error } = await supabase
        .from("medication_logs")
        .select("*")
        .eq("user_id", patientId!)
        .gte("logged_at", since)
        .order("logged_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: symptoms } = useQuery({
    queryKey: ["doctor-patient-symptoms", patientId],
    enabled: !!patientId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("symptom_logs")
        .select("*")
        .eq("user_id", patientId!)
        .order("logged_at", { ascending: false })
        .limit(30);
      if (error) throw error;
      return data;
    },
  });

  const { data: recommendations } = useQuery({
    queryKey: ["doctor-patient-recs", patientId],
    enabled: !!patientId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ai_recommendations")
        .select("*")
        .eq("patient_id", patientId!)
        .order("created_at", { ascending: false })
        .limit(20);
      if (error) throw error;
      return data;
    },
  });

  const { data: alerts } = useQuery({
    queryKey: ["doctor-patient-alerts", patientId],
    enabled: !!patientId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("alerts")
        .select("*")
        .eq("patient_id", patientId!)
        .order("created_at", { ascending: false })
        .limit(20);
      if (error) throw error;
      return data;
    },
  });

  // Compute adherence stats
  const totalLogs = medLogs?.length ?? 0;
  const takenLogs = medLogs?.filter(l => l.taken)?.length ?? 0;
  const adherenceRate = totalLogs > 0 ? Math.round((takenLogs / totalLogs) * 100) : 0;

  const alertSeverityColors: Record<string, string> = {
    low: "bg-success/10 text-success",
    medium: "bg-warning/10 text-warning",
    high: "bg-destructive/10 text-destructive",
    critical: "bg-destructive text-destructive-foreground",
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader badge={{ label: "Doctor", className: "bg-primary/10 text-primary" }} />

      <main className="container mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/doctor")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          {profileLoading ? (
            <Skeleton className="h-8 w-48" />
          ) : (
            <div>
              <h1 className="text-2xl font-bold font-display">
                {profile?.first_name} {profile?.last_name}
              </h1>
              <p className="text-sm text-muted-foreground">
                Patient since {profile ? format(new Date(profile.created_at), "MMMM yyyy") : "—"}
              </p>
            </div>
          )}
        </div>

        {/* Summary Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Medications</CardTitle>
              <Pill className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{medications?.length ?? 0}</p>
              <p className="text-xs text-muted-foreground">active prescriptions</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">14-Day Adherence</CardTitle>
              <Activity className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{adherenceRate}%</p>
              <p className="text-xs text-muted-foreground">{takenLogs}/{totalLogs} doses taken</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Symptoms</CardTitle>
              <ClipboardList className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{symptoms?.length ?? 0}</p>
              <p className="text-xs text-muted-foreground">logged recently</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Alerts</CardTitle>
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{alerts?.filter(a => a.status === "active")?.length ?? 0}</p>
              <p className="text-xs text-muted-foreground">require attention</p>
            </CardContent>
          </Card>
        </div>

        {/* Adherence Chart */}
        <AdherenceChart medLogs={medLogs ?? []} medications={medications ?? []} />

        <Tabs defaultValue="medications">
          <TabsList>
            <TabsTrigger value="medications">Medications</TabsTrigger>
            <TabsTrigger value="symptoms">Symptoms</TabsTrigger>
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
          </TabsList>

          <TabsContent value="medications">
            <Card>
              <CardHeader><CardTitle className="text-lg">Active Medications</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {!medications?.length && <p className="text-sm text-muted-foreground text-center py-4">No medications.</p>}
                {medications?.map(med => (
                  <div key={med.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <Pill className="h-4 w-4 text-primary" />
                      <div>
                        <p className="font-medium text-sm">{med.drug_name}</p>
                        <p className="text-xs text-muted-foreground">{med.dosage} · {med.schedule}</p>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">Added {format(new Date(med.created_at), "MMM d, yyyy")}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="symptoms">
            <Card>
              <CardHeader><CardTitle className="text-lg">Symptom History</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {!symptoms?.length && <p className="text-sm text-muted-foreground text-center py-4">No symptoms logged.</p>}
                {symptoms?.map(s => (
                  <div key={s.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                    <div>
                      <p className="text-sm font-medium">{s.symptom_text}</p>
                      <p className="text-xs text-muted-foreground">{format(new Date(s.logged_at), "MMM d, h:mm a")}</p>
                    </div>
                    <span className={`text-xs font-medium ${severityColors[s.severity]}`}>
                      {severityLabels[s.severity]}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights">
            <Card>
              <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Brain className="h-5 w-5 text-primary" /> AI Recommendations</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {!recommendations?.length && <p className="text-sm text-muted-foreground text-center py-4">No AI insights yet.</p>}
                {recommendations?.map(rec => {
                  const Icon = typeIcons[rec.recommendation_type] ?? Brain;
                  return (
                    <div key={rec.id} className="rounded-lg border border-border p-3 space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium capitalize">{rec.recommendation_type.replace("_", " ")}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {rec.risk_level && <Badge className={riskColors[rec.risk_level] ?? ""}>{rec.risk_level}</Badge>}
                          <span className="text-xs text-muted-foreground">{format(new Date(rec.created_at), "MMM d")}</span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{rec.explanation}</p>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alerts">
            <Card>
              <CardHeader><CardTitle className="text-lg">Alert History</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {!alerts?.length && <p className="text-sm text-muted-foreground text-center py-4">No alerts.</p>}
                {alerts?.map(a => (
                  <div key={a.id} className="rounded-lg border border-border p-3 space-y-1">
                    <div className="flex items-center justify-between">
                      <Badge className={alertSeverityColors[a.severity] ?? ""}>{a.severity}</Badge>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">{a.status}</Badge>
                        <span className="text-xs text-muted-foreground">{format(new Date(a.created_at), "MMM d, h:mm a")}</span>
                      </div>
                    </div>
                    <p className="text-sm">{a.message}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
