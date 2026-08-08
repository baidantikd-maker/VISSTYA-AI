import type { ClaimContext } from "@/mock/types";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";

export function ClaimForm({
  value,
  onChange,
}: {
  value: ClaimContext;
  onChange: (claim: ClaimContext) => void;
}) {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const isDark = theme === "dark";

  return (
    <div className="space-y-6">
      <div>
        <Label
          htmlFor="claim-event"
          className={cn("mb-2 block", isDark && "text-[hsl(261_88%_60%)]")}
        >
          {t("claimForm.question")}
        </Label>
        <textarea
          id="claim-event"
          value={value.event}
          onChange={(e) => onChange({ ...value, event: e.target.value })}
          placeholder={t("claimForm.eventPlaceholder")}
          rows={3}
          className={cn(
            "w-full resize-none rounded-md border bg-[hsl(var(--card))] px-3 py-2.5 text-sm leading-relaxed outline-none transition-colors",
            isDark
              ? "border-[hsl(261_88%_60%)] text-[hsl(261_88%_60%)] placeholder:text-[hsl(261_88%_60%)] placeholder:opacity-60 focus:border-[hsl(261_88%_60%)]"
              : "border-[hsl(var(--input))] placeholder:text-[hsl(var(--muted))] focus:border-[hsl(var(--foreground))]"
          )}
        />
        <p
          className={cn(
            "mt-1.5 text-xs leading-relaxed",
            isDark
              ? "text-[hsl(261_88%_60%)] opacity-80"
              : "text-[hsl(var(--muted))]"
          )}
        >
          {t("claimForm.eventHelper")}
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <Label
            htmlFor="claim-location"
            className={cn("mb-2 block", isDark && "text-[hsl(261_88%_60%)]")}
          >
            {t("claimForm.location")}{" "}
            <span
              className={cn(
                isDark ? "text-[hsl(261_88%_60%)] opacity-70" : "text-[hsl(var(--muted))]"
              )}
            >
              {t("claimForm.optional")}
            </span>
          </Label>
          <input
            id="claim-location"
            value={value.location ?? ""}
            onChange={(e) => onChange({ ...value, location: e.target.value })}
            placeholder={t("claimForm.locationPlaceholder")}
            className={cn(
              "h-10 w-full rounded-md border bg-[hsl(var(--card))] px-3 text-sm outline-none transition-colors",
              isDark
                ? "border-[hsl(261_88%_60%)] text-[hsl(261_88%_60%)] placeholder:text-[hsl(261_88%_60%)] placeholder:opacity-60 focus:border-[hsl(261_88%_60%)]"
                : "border-[hsl(var(--input))] placeholder:text-[hsl(var(--muted))] focus:border-[hsl(var(--foreground))]"
            )}
          />
        </div>
        <div>
          <Label
            htmlFor="claim-date"
            className={cn("mb-2 block", isDark && "text-[hsl(261_88%_60%)]")}
          >
            {t("claimForm.dateLabel")}{" "}
            <span
              className={cn(
                isDark ? "text-[hsl(261_88%_60%)] opacity-70" : "text-[hsl(var(--muted))]"
              )}
            >
              {t("claimForm.optional")}
            </span>
          </Label>
          <input
            id="claim-date"
            type="date"
            value={value.date ?? ""}
            onChange={(e) => onChange({ ...value, date: e.target.value })}
            className={cn(
              "h-10 w-full rounded-md border bg-[hsl(var(--card))] px-3 text-sm outline-none transition-colors",
              isDark
                ? "border-[hsl(261_88%_60%)] text-[hsl(261_88%_60%)] focus:border-[hsl(261_88%_60%)]"
                : "border-[hsl(var(--input))] focus:border-[hsl(var(--foreground))]"
            )}
          />
        </div>
      </div>

      <div
        className={cn(
          "card-glow rounded-lg border bg-[hsl(var(--secondary))/40] px-4 py-3",
          isDark ? "border-[hsl(261_88%_60%)]" : "border-[hsl(var(--border))]"
        )}
      >
        <p
          className={cn(
            "text-xs leading-relaxed",
            isDark
              ? "text-[hsl(261_88%_60%)] opacity-80"
              : "text-[hsl(var(--muted))]"
          )}
        >
          {t("claimForm.note")}
        </p>
      </div>
    </div>
  );
}
