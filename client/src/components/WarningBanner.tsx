import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export function WarningBanner({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-lg border border-average bg-average px-4 py-3.5",
        className
      )}
    >
      <AlertTriangle className="mt-0.5 size-4 shrink-0 text-average" />
      <div>
        <p className="text-sm font-medium text-[hsl(var(--foreground))]">{title}</p>
        <div className="mt-1 text-sm leading-relaxed text-[hsl(var(--foreground))]/80">
          {children}
        </div>
      </div>
    </div>
  );
}
