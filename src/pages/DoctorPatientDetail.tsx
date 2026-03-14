import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Pill, Activity, ClipboardList, Brain, AlertTriangle, TrendingUp, ShieldCheck, Sparkles } from "lucide-react";
import { format, subDays } from "date-fns";
import { motion } from "framer-motion";
import AppHeader from "@/components/AppHeader";
import Footer from "@/components/Footer";
import AdherenceChart from "@/components/charts/AdherenceChart";
import ShimmerSkeleton from "@/components/ui/ShimmerSkeleton";
import MotionCard from "@/components/ui/MotionCard";
import ProgressRing from "@/components/ui/ProgressRing";
import EmptyState from "@/components/ui/EmptyState";

const severityLabels = ["", "Mild", "Minor", "Moderate", "Severe", "Critical"];
const severityColors = ["", "text-primary", "text-primary", "text-warning", "text-destructive", "text-destructive"];
const severityBgs = ["", "bg-primary/10", "bg-primary/10", "bg-warning/10", "bg-destructive/10", "bg-destructive/10"];
const riskColors: Record<string, string> = {
  low: "bg-primary/10 text-primary border-primary/20",
  medium: "bg-warning/10 text-warning border-warning/20",
  high: "bg-destructive/10 text-destructive border-destructive/20",
  critical: "bg-destructive text-destructive-foreground border-destructive",
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
      const { data, error } = await supabase.from("profiles").select("*").eq("user_id", patientId!).single();
      if (error) throw error;
      return data;
    },
  });

  const { data: medications } = useQuery({
    queryKey: ["doctor-patient-meds", patientId],
    enabled: !!patientId,
    queryFn: async () => {
      const { data, error } = await supabase.from("medications").select("*").eq("user_id", patientId!).eq("active", true).order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: medLogs } = useQuery({
    queryKey: ["doctor-patient-medlogs", patientId],
    enabled: !!patientId,
    queryFn: async () => {
      const since = subDays(new Date(), 14).toISOString();
      const { data, error } = await supabase.from("medication_logs").select("*").eq("user_id", patientId!).gte("logged_at", since).order("logged_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: symptoms } = useQuery({
    queryKey: ["doctor-patient-symptoms", patientId],
    enabled: !!patientId,
    queryFn: async () => {
      const { data, error } = await supabase.from("symptom_logs").select("*").eq("user_id", patientId!).order("logged_at", { ascending: false }).limit(30);
      if (error) throw error;
      return data;
    },
  });

  const { data: recommendations } = useQuery({
    queryKey: ["doctor-patient-recs", patientId],
    enabled: !!patientId,
    queryFn: async () => {
      const { data, error } = await supabase.from("ai_recommendations").select("*").eq("patient_id", patientId!).order("created_at", { ascending: false }).limit(20);
      if (error) throw error;
      return data;
    },
  });

  const { data: alerts } = useQuery({
    queryKey: ["doctor-patient-alerts", patientId],
    enabled: !!patientId,
    queryFn: async () => {
      const { data, error } = await supabase.from("alerts").select("*").eq("patient_id", patientId!).order("created_at", { ascending: false }).limit(20);
      if (error) throw error;
      return data;
    },
  });

  const totalLogs = medLogs?.length ?? 0;
  const takenLogs = medLogs?.filter(l => l.taken)?.length ?? 0;
  const adherenceRate = totalLogs > 0 ? Math.round((takenLogs / totalLogs) * 100) : 0;

  const alertSeverityColors: Record<string, string> = {
    low: "bg-primary/10 text-primary border-primary/20",
    medium: "bg-warning/10 text-warning border-warning/20",
    high: "bg-destructive/10 text-destructive border-destructive/20",
    critical: "bg-destructive text-destructive-foreground border-destructive",
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppHeader />

      <main className="container mx-auto px-4 py-8 space-y-8 flex-1">
        <motion.div className="flex items-center gap-3" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
          <Button variant="ghost" size="icon" onClick={() => navigate("/doctor")} className="hover:bg-primary/10">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          {profileLoading ? (
            <ShimmerSkeleton className="h-8 w-48" />
          ) : (
            <div>
              <h1 className="text-2xl font-bold font-display">{profile?.first_name} {profile?.last_name}</h1>
              <p className="text-sm text-muted-foreground">Patient since {profile ? format(new Date(profile.created_at), "MMMM yyyy") : "—"}</p>
            </div>
          )}
        </motion.div>

        <div className="grid gap-4 md:grid-cols-4">
          <MotionCard delay={0} className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
              <Pill className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Medications</p>
              <p className="text-2xl font-bold font-display">{medications?.length ?? 0}</p>
            </div>
          </MotionCard>
          <MotionCard delay={0.08} className="flex items-center gap-4">
            <ProgressRing value={adherenceRate} size={56} strokeWidth={5} />
            <div>
              <p className="text-sm text-muted-foreground">14-Day Adherence</p>
              <p className="text-xs text-muted-foreground">{takenLogs}/{totalLogs} doses</p>
            </div>
          </MotionCard>
          <MotionCard delay={0.16} className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
              <ClipboardList className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Symptoms</p>
              <p className="text-2xl font-bold font-display">{symptoms?.length ?? 0}</p>
            </div>
          </MotionCard>
          <MotionCard delay={0.24} className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-destructive/10 border border-destructive/20 flex items-center justify-center shrink-0">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Alerts</p>
              <p className="text-2xl font-bold font-display">{alerts?.filter(a => a.status === "active")?.length ?? 0}</p>
            </div>
          </MotionCard>
        </div>

        <AdherenceChart medLogs={medLogs ?? []} medications={medications ?? []} />

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Tabs defaultValue="medications">
            <TabsList className="bg-secondary/50 border border-border/50">
              <TabsTrigger value="medications">Medications</TabsTrigger>
              <TabsTrigger value="symptoms">Symptoms</TabsTrigger>
              <TabsTrigger value="insights">AI Insights</TabsTrigger>
              <TabsTrigger value="alerts">Alerts</TabsTrigger>
            </TabsList>

            <TabsContent value="medications">
              <Card className="border-border/50">
                <CardHeader><CardTitle className="text-lg font-display">Active Medications</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                  {!medications?.length && <EmptyState icon={<Pill className="h-6 w-6 text-primary" />} title="No medications" description="This patient hasn't added any medications yet." />}
                  {medications?.map((med, i) => (
                    <motion.div key={med.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }} className="flex items-center justify-between p-3 rounded-xl bg-secondary/50 border border-border/30">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center"><Pill className="h-4 w-4 text-primary" /></div>
                        <div>
                          <p className="font-medium text-sm">{med.drug_name}</p>
                          <p className="text-xs text-muted-foreground">{med.dosage} · {med.schedule}</p>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">Added {format(new Date(med.created_at), "MMM d, yyyy")}</span>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="symptoms">
              <Card className="border-border/50">
                <CardHeader><CardTitle className="text-lg font-display">Symptom History</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                  {!symptoms?.length && <EmptyState icon={<ClipboardList className="h-6 w-6 text-accent" />} title="No symptoms logged" description="No symptom data available for this patient." />}
                  {symptoms?.map((s, i) => (
                    <motion.div key={s.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }} className="flex items-center justify-between p-3 rounded-xl bg-secondary/50 border border-border/30">
                      <div>
                        <p className="text-sm font-medium">{s.symptom_text}</p>
                        <p className="text-xs text-muted-foreground">{format(new Date(s.logged_at), "MMM d, h:mm a")}</p>
                      </div>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${severityColors[s.severity]} ${severityBgs[s.severity]}`}>{severityLabels[s.severity]}</span>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="insights">
              <Card className="border-border/50">
                <CardHeader><CardTitle className="text-lg flex items-center gap-2 font-display"><div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center"><Sparkles className="h-4 w-4 text-primary" /></div> AI Recommendations</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  {!recommendations?.length && <EmptyState icon={<Brain className="h-6 w-6 text-primary" />} title="No AI insights yet" description="AI recommendations will appear as the patient logs more data." />}
                  {recommendations?.map((rec, i) => {
                    const Icon = typeIcons[rec.recommendation_type] ?? Brain;
                    return (
                      <motion.div key={rec.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="rounded-xl border border-border/50 bg-secondary/30 p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center"><Icon className="h-3.5 w-3.5 text-primary" /></div>
                            <span className="text-sm font-medium capitalize font-display">{rec.recommendation_type.replace("_", " ")}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {rec.risk_level && <Badge className={`border ${riskColors[rec.risk_level] ?? ""}`}>{rec.risk_level}</Badge>}
                            <span className="text-xs text-muted-foreground">{format(new Date(rec.created_at), "MMM d")}</span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{rec.explanation}</p>
                      </motion.div>
                    );
                  })}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="alerts">
              <Card className="border-border/50">
                <CardHeader><CardTitle className="text-lg font-display">Alert History</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                  {!alerts?.length && <EmptyState icon={<AlertTriangle className="h-6 w-6 text-destructive" />} title="No alerts" description="No alerts have been triggered for this patient." />}
                  {alerts?.map((a, i) => (
                    <motion.div key={a.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="rounded-xl border border-border/50 bg-secondary/30 p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <Badge className={`border ${alertSeverityColors[a.severity] ?? ""}`}>{a.severity}</Badge>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs border-border/50">{a.status}</Badge>
                          <span className="text-xs text-muted-foreground">{format(new Date(a.created_at), "MMM d, h:mm a")}</span>
                        </div>
                      </div>
                      <p className="text-sm">{a.message}</p>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
