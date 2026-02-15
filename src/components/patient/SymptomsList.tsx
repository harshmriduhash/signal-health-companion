import { useSymptoms } from "@/hooks/useSymptoms";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

const severityLabels = ["", "Mild", "Minor", "Moderate", "Severe", "Critical"];
const severityColors = ["", "text-success", "text-accent", "text-warning", "text-destructive", "text-destructive"];

export default function SymptomsList() {
  const { data, isLoading } = useSymptoms(10);

  if (isLoading) {
    return (
      <Card>
        <CardHeader><CardTitle className="text-lg">Recent Symptoms</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-12 w-full" />)}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader><CardTitle className="text-lg">Recent Symptoms</CardTitle></CardHeader>
      <CardContent className="space-y-2">
        {!data?.length && <p className="text-sm text-muted-foreground text-center py-4">No symptoms logged yet.</p>}
        {data?.map(s => (
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
  );
}
