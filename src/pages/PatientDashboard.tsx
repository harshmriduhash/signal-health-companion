import { useAuth } from "@/contexts/AuthContext";
import { useMedications, useTodayLogs } from "@/hooks/useMedications";
import { useSymptoms } from "@/hooks/useSymptoms";
import { useRecommendations } from "@/hooks/useRecommendations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Pill, ClipboardList, Brain } from "lucide-react";
import AppHeader from "@/components/AppHeader";
import MedicationList from "@/components/patient/MedicationList";
import AddMedicationDialog from "@/components/patient/AddMedicationDialog";
import SymptomLogDialog from "@/components/patient/SymptomLogDialog";
import AIChatDialog from "@/components/patient/AIChatDialog";
import RecommendationCards from "@/components/patient/RecommendationCards";
import SymptomsList from "@/components/patient/SymptomsList";

export default function PatientDashboard() {
  const { user } = useAuth();
  const { data: meds } = useMedications();
  const { data: todayLogs } = useTodayLogs();
  const { data: symptoms } = useSymptoms(5);
  const { data: recs } = useRecommendations();

  const adherenceToday = meds?.length
    ? Math.round(((todayLogs?.filter(l => l.taken)?.length ?? 0) / meds.length) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      <main className="container mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold font-display">Good day 👋</h1>
            <p className="text-muted-foreground">Here's your health overview for today.</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <AddMedicationDialog />
            <SymptomLogDialog />
            <AIChatDialog />
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Medications</CardTitle>
              <Pill className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{meds?.length ?? 0}</p>
              <p className="text-xs text-muted-foreground">active prescriptions</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Today's Adherence</CardTitle>
              <Activity className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{adherenceToday}%</p>
              <p className="text-xs text-muted-foreground">{todayLogs?.filter(l => l.taken)?.length ?? 0}/{meds?.length ?? 0} taken</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Recent Symptoms</CardTitle>
              <ClipboardList className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{symptoms?.length ?? 0}</p>
              <p className="text-xs text-muted-foreground">logged recently</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">AI Insights</CardTitle>
              <Brain className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{recs?.length ?? 0}</p>
              <p className="text-xs text-muted-foreground">recommendations</p>
            </CardContent>
          </Card>
        </div>

        {/* Medication tracking + Symptoms side by side */}
        <div className="grid gap-6 lg:grid-cols-2">
          <MedicationList />
          <SymptomsList />
        </div>

        {/* AI Insights */}
        <RecommendationCards />
      </main>
    </div>
  );
}
