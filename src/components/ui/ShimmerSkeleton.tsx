import { cn } from "@/lib/utils";

interface Props {
  className?: string;
  variant?: "text" | "card" | "circle" | "stat";
}

export default function ShimmerSkeleton({ className, variant = "text" }: Props) {
  if (variant === "card") {
    return (
      <div className={cn("rounded-xl border border-border bg-card p-6 space-y-4", className)}>
        <div className="skeleton-shimmer h-4 w-1/3 rounded-md" />
        <div className="skeleton-shimmer h-8 w-1/2 rounded-md" />
        <div className="skeleton-shimmer h-3 w-2/3 rounded-md" />
      </div>
    );
  }

  if (variant === "circle") {
    return <div className={cn("skeleton-shimmer rounded-full w-10 h-10", className)} />;
  }

  if (variant === "stat") {
    return (
      <div className={cn("rounded-xl border border-border bg-card p-6", className)}>
        <div className="flex items-center justify-between mb-3">
          <div className="skeleton-shimmer h-3 w-24 rounded-md" />
          <div className="skeleton-shimmer h-4 w-4 rounded" />
        </div>
        <div className="skeleton-shimmer h-8 w-16 rounded-md mb-1" />
        <div className="skeleton-shimmer h-3 w-20 rounded-md" />
      </div>
    );
  }

  return <div className={cn("skeleton-shimmer h-4 rounded-md", className)} />;
}
