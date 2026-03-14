import { useRecommendations } from "@/hooks/useRecommendations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, AlertTriangle, TrendingUp, ShieldCheck, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import ShimmerSkeleton from "@/components/ui/ShimmerSkeleton";
import EmptyState from "@/components/ui/EmptyState";

const riskColors: Record<string, string> = {
  low: "bg-primary/10 text-primary border-primary/20",
  medium: "bg-warning/10 text-warning border-warning/20",
  high: "bg-destructive/10 text-destructive border-destructive/20",
  critical: "bg-destructive text-destructive-foreground border-destructive",
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
      <Card className="border-border/50">
        <CardHeader><CardTitle className="text-lg font-display">AI Insights</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {[1, 2].map(i => <ShimmerSkeleton key={i} className="h-24 w-full" />)}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2 font-display">
          <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          AI Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {!data?.length && (
          <EmptyState
            icon={<Brain className="h-6 w-6 text-primary" />}
            title="No AI insights yet"
            description="Keep logging your medications and symptoms to receive personalized recommendations."
          />
        )}
        {data?.map((rec, i) => {
          const Icon = typeIcons[rec.recommendation_type] ?? Brain;
          return (
            <motion.div
              key={rec.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="rounded-xl border border-border/50 bg-secondary/30 p-4 space-y-2 hover:border-primary/20 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <span className="text-sm font-medium capitalize font-display">{rec.recommendation_type.replace("_", " ")}</span>
                </div>
                {rec.risk_level && <Badge className={`text-xs border ${riskColors[rec.risk_level] ?? ""}`}>{rec.risk_level}</Badge>}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{rec.explanation}</p>
              {rec.confidence_score && (
                <div className="flex items-center gap-2">
                  <div className="h-1.5 flex-1 rounded-full bg-border overflow-hidden">
                    <motion.div
                      className="h-full bg-primary rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.round(Number(rec.confidence_score) * 100)}%` }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">{Math.round(Number(rec.confidence_score) * 100)}%</span>
                </div>
              )}
            </motion.div>
          );
        })}
      </CardContent>
    </Card>
  );
}
