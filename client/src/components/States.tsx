import type { ReactNode } from "react";

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[hsl(var(--border))] px-6 py-16 text-center">
      {icon && <div className="mb-4 text-[hsl(var(--muted))]">{icon}</div>}
      <p className="text-[15px] font-medium text-[hsl(var(--foreground))]">{title}</p>
      {description && (
        <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-[hsl(var(--muted))]">
          {description}
        </p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export function LoadingState({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
      <div className="flex items-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="size-1.5 rounded-full bg-[hsl(var(--muted))]"
            style={{ animation: `pulse-dot 1.2s ease-in-out ${i * 0.15}s infinite` }}
          />
        ))}
      </div>
      <p className="text-sm text-[hsl(var(--muted))]">{label}</p>
    </div>
  );
}

export function ErrorState({
  title = "Something went wrong",
  description = "We could not load this page. Please try again.",
  action,
}: {
  title?: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[hsl(var(--border))] px-6 py-16 text-center">
      <p className="text-[15px] font-medium text-[hsl(var(--foreground))]">{title}</p>
      <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-[hsl(var(--muted))]">
        {description}
      </p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
