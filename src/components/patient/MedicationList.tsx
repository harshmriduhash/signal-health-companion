import { useMedications, useTodayLogs, useLogMedication } from "@/hooks/useMedications";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, X, Pill } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import ShimmerSkeleton from "@/components/ui/ShimmerSkeleton";
import EmptyState from "@/components/ui/EmptyState";

export default function MedicationList() {
  const { data: meds, isLoading } = useMedications();
  const { data: logs } = useTodayLogs();
  const logMed = useLogMedication();
  const { toast } = useToast();

  const loggedIds = new Set(logs?.map(l => l.medication_id));

  const handleLog = (medId: string, taken: boolean) => {
    logMed.mutate({ medicationId: medId, taken }, {
      onSuccess: () => {
        toast({ title: taken ? "✓ Medication taken" : "Medication skipped" });
      },
      onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
    });
  };

  if (isLoading) {
    return (
      <Card className="border-border/50">
        <CardHeader><CardTitle className="text-lg font-display">Today's Medications</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3].map(i => <ShimmerSkeleton key={i} className="h-16 w-full" />)}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/50">
      <CardHeader><CardTitle className="text-lg font-display">Today's Medications</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        {!meds?.length && (
          <EmptyState
            icon={<Pill className="h-6 w-6 text-primary" />}
            title="No medications yet"
            description="Add your first medication to start tracking your daily intake."
          />
        )}
        <AnimatePresence>
          {meds?.map((med, i) => {
            const logged = loggedIds.has(med.id);
            return (
              <motion.div
                key={med.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center justify-between p-3 rounded-xl bg-secondary/50 border border-border/30 hover:border-border/60 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Pill className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{med.drug_name}</p>
                    <p className="text-xs text-muted-foreground">{med.dosage} · {med.schedule}</p>
                  </div>
                </div>
                {logged ? (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-xs font-medium text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-full"
                  >
                    Logged ✓
                  </motion.span>
                ) : (
                  <div className="flex gap-1.5">
                    <Button size="sm" variant="outline" className="h-8 gap-1 border-primary/20 text-primary hover:bg-primary/10" onClick={() => handleLog(med.id, true)} disabled={logMed.isPending}>
                      <Check className="h-3.5 w-3.5" /> Take
                    </Button>
                    <Button size="sm" variant="outline" className="h-8 gap-1 border-destructive/20 text-destructive hover:bg-destructive/10" onClick={() => handleLog(med.id, false)} disabled={logMed.isPending}>
                      <X className="h-3.5 w-3.5" /> Skip
                    </Button>
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
