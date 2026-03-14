import { useAuth } from "@/contexts/AuthContext";
import { useMedications, useTodayLogs } from "@/hooks/useMedications";
import { useSymptoms } from "@/hooks/useSymptoms";
import { useRecommendations } from "@/hooks/useRecommendations";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { subDays } from "date-fns";
import { Pill, ClipboardList, Brain } from "lucide-react";
import { motion } from "framer-motion";
import AppHeader from "@/components/AppHeader";
import Footer from "@/components/Footer";
import MedicationList from "@/components/patient/MedicationList";
import AddMedicationDialog from "@/components/patient/AddMedicationDialog";
import SymptomLogDialog from "@/components/patient/SymptomLogDialog";
import AIChatDialog from "@/components/patient/AIChatDialog";
import RecommendationCards from "@/components/patient/RecommendationCards";
import SymptomsList from "@/components/patient/SymptomsList";
import AdherenceChart from "@/components/charts/AdherenceChart";
import ShimmerSkeleton from "@/components/ui/ShimmerSkeleton";
import ProgressRing from "@/components/ui/ProgressRing";
import MotionCard from "@/components/ui/MotionCard";

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.08 } },
};

export default function PatientDashboard() {
  const { user } = useAuth();
  const { data: meds, isLoading: medsLoading } = useMedications();
  const { data: todayLogs } = useTodayLogs();
  const { data: symptoms } = useSymptoms(5);
  const { data: recs } = useRecommendations();

  const { data: medLogs14 } = useQuery({
    queryKey: ["medication_logs_14d", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const since = subDays(new Date(), 14).toISOString();
      const { data, error } = await supabase
        .from("medication_logs")
        .select("*")
        .eq("user_id", user!.id)
        .gte("logged_at", since)
        .order("logged_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const adherenceToday = meds?.length
    ? Math.round(((todayLogs?.filter(l => l.taken)?.length ?? 0) / meds.length) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppHeader />

      <main className="container mx-auto px-4 py-8 space-y-8 flex-1">
        <motion.div
          className="flex items-center justify-between flex-wrap gap-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div>
            <h1 className="text-2xl md:text-3xl font-bold font-display">Good day 👋</h1>
            <p className="text-muted-foreground">Here's your health overview for today.</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <AddMedicationDialog />
            <SymptomLogDialog />
            <AIChatDialog />
          </div>
        </motion.div>

        {/* Stats */}
        {medsLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map(i => <ShimmerSkeleton key={i} variant="stat" />)}
          </div>
        ) : (
          <motion.div
            className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            <MotionCard delay={0} className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                <Pill className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Medications</p>
                <p className="text-2xl font-bold font-display">{meds?.length ?? 0}</p>
                <p className="text-xs text-muted-foreground">active prescriptions</p>
              </div>
            </MotionCard>

            <MotionCard delay={0.08} className="flex items-center gap-4">
              <ProgressRing value={adherenceToday} size={56} strokeWidth={5} />
              <div>
                <p className="text-sm text-muted-foreground">Today's Adherence</p>
                <p className="text-xs text-muted-foreground">{todayLogs?.filter(l => l.taken)?.length ?? 0}/{meds?.length ?? 0} taken</p>
              </div>
            </MotionCard>

            <MotionCard delay={0.16} className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                <ClipboardList className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Recent Symptoms</p>
                <p className="text-2xl font-bold font-display">{symptoms?.length ?? 0}</p>
                <p className="text-xs text-muted-foreground">logged recently</p>
              </div>
            </MotionCard>

            <MotionCard delay={0.24} className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                <Brain className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">AI Insights</p>
                <p className="text-2xl font-bold font-display">{recs?.length ?? 0}</p>
                <p className="text-xs text-muted-foreground">recommendations</p>
              </div>
            </MotionCard>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <AdherenceChart medLogs={medLogs14 ?? []} medications={meds ?? []} />
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-2">
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
            <MedicationList />
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
            <SymptomsList />
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <RecommendationCards />
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
