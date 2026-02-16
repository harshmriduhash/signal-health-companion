import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { format, subDays, startOfDay } from "date-fns";
import { BarChart3 } from "lucide-react";

interface Props {
  medLogs: Array<{ logged_at: string; taken: boolean; medication_id: string }>;
  medications: Array<{ id: string; drug_name: string }>;
  days?: number;
}

const chartConfig = {
  taken: { label: "Taken", color: "hsl(var(--success))" },
  missed: { label: "Missed", color: "hsl(var(--destructive))" },
};

export default function AdherenceChart({ medLogs, medications, days = 14 }: Props) {
  const data = useMemo(() => {
    const result = [];
    for (let i = days - 1; i >= 0; i--) {
      const day = startOfDay(subDays(new Date(), i));
      const dayStr = format(day, "yyyy-MM-dd");
      const dayLogs = medLogs.filter(l => l.logged_at.startsWith(dayStr));
      const taken = dayLogs.filter(l => l.taken).length;
      const missed = dayLogs.filter(l => !l.taken).length;
      result.push({
        date: format(day, "MMM d"),
        taken,
        missed,
      });
    }
    return result;
  }, [medLogs, days]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" /> Adherence — Last {days} Days
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <BarChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} className="fill-muted-foreground" />
            <YAxis allowDecimals={false} tick={{ fontSize: 11 }} className="fill-muted-foreground" />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="taken" stackId="a" fill="var(--color-taken)" radius={[0, 0, 0, 0]} />
            <Bar dataKey="missed" stackId="a" fill="var(--color-missed)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
