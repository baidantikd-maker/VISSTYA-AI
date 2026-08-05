import { BadgeCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  onDark = false,
}: {
  className?: string;
  onDark?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <span className="relative flex size-6 items-center justify-center rounded-full border border-[hsl(var(--foreground))] bg-transparent">
        <BadgeCheck className="size-4 text-[hsl(var(--foreground))]" strokeWidth={1.75} />
      </span>
      <span
        className={cn(
          "text-[17px] font-semibold tracking-tight",
          onDark ? "text-[hsl(var(--background))]" : "text-[hsl(var(--foreground))]"
        )}
      >
        Visstya <span className="font-normal text-[hsl(var(--muted))]">AI</span>
      </span>
    </span>
  );
}
