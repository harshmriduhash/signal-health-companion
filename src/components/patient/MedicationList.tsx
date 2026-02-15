import { useMedications, useTodayLogs, useLogMedication } from "@/hooks/useMedications";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Check, X, Pill } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function MedicationList() {
  const { data: meds, isLoading } = useMedications();
  const { data: logs } = useTodayLogs();
  const logMed = useLogMedication();
  const { toast } = useToast();

  const loggedIds = new Set(logs?.map(l => l.medication_id));

  const handleLog = (medId: string, taken: boolean) => {
    logMed.mutate({ medicationId: medId, taken }, {
      onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader><CardTitle className="text-lg">Today's Medications</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-9 w-24" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader><CardTitle className="text-lg">Today's Medications</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        {!meds?.length && (
          <p className="text-sm text-muted-foreground py-4 text-center">No medications added yet.</p>
        )}
        {meds?.map(med => {
          const logged = loggedIds.has(med.id);
          return (
            <div key={med.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <Pill className="h-4 w-4 text-primary" />
                <div>
                  <p className="font-medium text-sm">{med.drug_name}</p>
                  <p className="text-xs text-muted-foreground">{med.dosage} · {med.schedule}</p>
                </div>
              </div>
              {logged ? (
                <span className="text-xs font-medium text-success bg-success/10 px-2 py-1 rounded-full">Logged ✓</span>
              ) : (
                <div className="flex gap-1.5">
                  <Button size="sm" variant="outline" className="h-8 gap-1 text-success border-success/30 hover:bg-success/10" onClick={() => handleLog(med.id, true)} disabled={logMed.isPending}>
                    <Check className="h-3.5 w-3.5" /> Take
                  </Button>
                  <Button size="sm" variant="outline" className="h-8 gap-1 text-destructive border-destructive/30 hover:bg-destructive/10" onClick={() => handleLog(med.id, false)} disabled={logMed.isPending}>
                    <X className="h-3.5 w-3.5" /> Skip
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
