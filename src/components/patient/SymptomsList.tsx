import { useSymptoms } from "@/hooks/useSymptoms";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardList } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import ShimmerSkeleton from "@/components/ui/ShimmerSkeleton";
import EmptyState from "@/components/ui/EmptyState";

const severityLabels = ["", "Mild", "Minor", "Moderate", "Severe", "Critical"];
const severityColors = ["", "text-primary", "text-primary", "text-warning", "text-destructive", "text-destructive"];
const severityBgs = ["", "bg-primary/10", "bg-primary/10", "bg-warning/10", "bg-destructive/10", "bg-destructive/10"];

export default function SymptomsList() {
  const { data, isLoading } = useSymptoms(10);

  if (isLoading) {
    return (
      <Card className="border-border/50">
        <CardHeader><CardTitle className="text-lg font-display">Recent Symptoms</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {[1, 2, 3].map(i => <ShimmerSkeleton key={i} className="h-14 w-full" />)}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/50">
      <CardHeader><CardTitle className="text-lg font-display">Recent Symptoms</CardTitle></CardHeader>
      <CardContent className="space-y-2">
        {!data?.length && (
          <EmptyState
            icon={<ClipboardList className="h-6 w-6 text-accent" />}
            title="No symptoms logged"
            description="Log symptoms as they occur to help your AI assistant detect patterns."
          />
        )}
        {data?.map((s, i) => (
          <motion.div
            key={s.id}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-center justify-between p-3 rounded-xl bg-secondary/50 border border-border/30"
          >
            <div>
              <p className="text-sm font-medium">{s.symptom_text}</p>
              <p className="text-xs text-muted-foreground">{format(new Date(s.logged_at), "MMM d, h:mm a")}</p>
            </div>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${severityColors[s.severity]} ${severityBgs[s.severity]}`}>
              {severityLabels[s.severity]}
            </span>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
}
