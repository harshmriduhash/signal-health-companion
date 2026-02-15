import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useLogSymptom } from "@/hooks/useSymptoms";
import { useToast } from "@/hooks/use-toast";
import { ClipboardList } from "lucide-react";

export default function SymptomLogDialog() {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [severity, setSeverity] = useState([3]);
  const logSymptom = useLogSymptom();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    logSymptom.mutate({ symptom_text: text, severity: severity[0] }, {
      onSuccess: () => {
        setOpen(false);
        setText(""); setSeverity([3]);
        toast({ title: "Symptom logged" });
      },
      onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
    });
  };

  const severityLabels = ["", "Mild", "Minor", "Moderate", "Severe", "Critical"];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-1"><ClipboardList className="h-4 w-4" /> Log Symptom</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Log a Symptom</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>What are you experiencing?</Label>
            <Input required value={text} onChange={e => setText(e.target.value)} placeholder="e.g. Headache, nausea…" />
          </div>
          <div className="space-y-2">
            <Label>Severity: {severity[0]}/5 — {severityLabels[severity[0]]}</Label>
            <Slider min={1} max={5} step={1} value={severity} onValueChange={setSeverity} />
          </div>
          <Button type="submit" className="w-full" disabled={logSymptom.isPending}>
            {logSymptom.isPending ? "Logging…" : "Log Symptom"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
