import { useRecommendations } from "@/hooks/useRecommendations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Brain, AlertTriangle, TrendingUp, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const riskColors: Record<string, string> = {
  low: "bg-success/10 text-success",
  medium: "bg-warning/10 text-warning",
  high: "bg-destructive/10 text-destructive",
  critical: "bg-destructive text-destructive-foreground",
};

const typeIcons: Record<string, any> = {
  adherence: TrendingUp,
  side_effect: AlertTriangle,
  risk: ShieldCheck,
};

export default function RecommendationCards() {
  const { data, isLoading } = useRecommendations();

  if (isLoading) {
    return (
      <Card>
        <CardHeader><CardTitle className="text-lg">AI Insights</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {[1, 2].map(i => <Skeleton key={i} className="h-20 w-full" />)}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" /> AI Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {!data?.length && <p className="text-sm text-muted-foreground text-center py-4">No AI insights yet. Keep logging to get recommendations.</p>}
        {data?.map(rec => {
          const Icon = typeIcons[rec.recommendation_type] ?? Brain;
          return (
            <div key={rec.id} className="rounded-lg border border-border p-3 space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium capitalize">{rec.recommendation_type.replace("_", " ")}</span>
                </div>
                {rec.risk_level && <Badge className={riskColors[rec.risk_level] ?? ""}>{rec.risk_level}</Badge>}
              </div>
              <p className="text-sm text-muted-foreground">{rec.explanation}</p>
              {rec.confidence_score && (
                <p className="text-xs text-muted-foreground">Confidence: {Math.round(Number(rec.confidence_score) * 100)}%</p>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
