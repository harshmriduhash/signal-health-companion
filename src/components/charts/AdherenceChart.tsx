import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { format, subDays, startOfDay } from "date-fns";
import { BarChart3 } from "lucide-react";
import { motion } from "framer-motion";

interface Props {
  medLogs: Array<{ logged_at: string; taken: boolean; medication_id: string }>;
  medications: Array<{ id: string; drug_name: string }>;
  days?: number;
}

const chartConfig = {
  taken: { label: "Taken", color: "hsl(var(--primary))" },
  missed: { label: "Missed", color: "hsl(var(--destructive))" },
};

export default function AdherenceChart({ medLogs, medications, days = 14 }: Props) {
  const data = useMemo(() => {
    const result = [];
    for (let i = days - 1; i >= 0; i--) {
      const day = startOfDay(subDays(new Date(), i));
      const dayStr = format(day, "yyyy-MM-dd");
      const dayLogs = medLogs.filter(l => l.logged_at.startsWith(dayStr));
      result.push({
        date: format(day, "MMM d"),
        taken: dayLogs.filter(l => l.taken).length,
        missed: dayLogs.filter(l => !l.taken).length,
      });
    }
    return result;
  }, [medLogs, days]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2 font-display">
            <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
              <BarChart3 className="h-4 w-4 text-primary" />
            </div>
            Adherence — Last {days} Days
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[250px] w-full">
            <BarChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="taken" stackId="a" fill="var(--color-taken)" radius={[0, 0, 0, 0]} />
              <Bar dataKey="missed" stackId="a" fill="var(--color-missed)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </motion.div>
  );
}
