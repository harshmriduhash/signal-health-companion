import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAddMedication } from "@/hooks/useMedications";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";

export default function AddMedicationDialog() {
  const [open, setOpen] = useState(false);
  const [drugName, setDrugName] = useState("");
  const [dosage, setDosage] = useState("");
  const [schedule, setSchedule] = useState("");
  const addMed = useAddMedication();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addMed.mutate({ drug_name: drugName, dosage, schedule }, {
      onSuccess: () => {
        setOpen(false);
        setDrugName(""); setDosage(""); setSchedule("");
        toast({ title: "Medication added" });
      },
      onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1"><Plus className="h-3.5 w-3.5" /> Add Medication</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Add Medication</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Drug Name</Label>
            <Input required value={drugName} onChange={e => setDrugName(e.target.value)} placeholder="e.g. Metformin" />
          </div>
          <div className="space-y-2">
            <Label>Dosage</Label>
            <Input required value={dosage} onChange={e => setDosage(e.target.value)} placeholder="e.g. 500mg" />
          </div>
          <div className="space-y-2">
            <Label>Schedule</Label>
            <Input required value={schedule} onChange={e => setSchedule(e.target.value)} placeholder="e.g. Twice daily" />
          </div>
          <Button type="submit" className="w-full" disabled={addMed.isPending}>
            {addMed.isPending ? "Adding…" : "Add Medication"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
