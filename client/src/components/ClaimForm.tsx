import type { ClaimContext } from "@/mock/types";
import { Label } from "@/components/ui/label";

const EVENT_HELPER =
  "State the claim as precisely as you can. More context helps Visstya compare the content against external evidence.";

export function ClaimForm({
  value,
  onChange,
}: {
  value: ClaimContext;
  onChange: (claim: ClaimContext) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="claim-event" className="mb-2 block">
          What is the claim?
        </Label>
        <textarea
          id="claim-event"
          value={value.event}
          onChange={(e) => onChange({ ...value, event: e.target.value })}
          placeholder="e.g. A video shows a flooded metro station in Mumbai after heavy rain"
          rows={3}
          className="w-full resize-none rounded-md border border-[hsl(var(--input))] bg-[hsl(var(--card))] px-3 py-2.5 text-sm leading-relaxed outline-none transition-colors placeholder:text-[hsl(var(--muted))] focus:border-[hsl(var(--foreground))]"
        />
        <p className="mt-1.5 text-xs leading-relaxed text-[hsl(var(--muted))]">
          {EVENT_HELPER}
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <Label htmlFor="claim-location" className="mb-2 block">
            Location <span className="text-[hsl(var(--muted))]">(optional)</span>
          </Label>
          <input
            id="claim-location"
            value={value.location ?? ""}
            onChange={(e) => onChange({ ...value, location: e.target.value })}
            placeholder="e.g. Dharavi, Mumbai"
            className="h-10 w-full rounded-md border border-[hsl(var(--input))] bg-[hsl(var(--card))] px-3 text-sm outline-none transition-colors placeholder:text-[hsl(var(--muted))] focus:border-[hsl(var(--foreground))]"
          />
        </div>
        <div>
          <Label htmlFor="claim-date" className="mb-2 block">
            When is it claimed to have happened?{" "}
            <span className="text-[hsl(var(--muted))]">(optional)</span>
          </Label>
          <input
            id="claim-date"
            type="date"
            value={value.date ?? ""}
            onChange={(e) => onChange({ ...value, date: e.target.value })}
            className="h-10 w-full rounded-md border border-[hsl(var(--input))] bg-[hsl(var(--card))] px-3 text-sm outline-none transition-colors focus:border-[hsl(var(--foreground))]"
          />
        </div>
      </div>

      <div className="card-glow rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--secondary))/40] px-4 py-3">
        <p className="text-xs leading-relaxed text-[hsl(var(--muted))]">
          Visstya does not decide what is true. It gathers evidence — metadata,
          visual analysis, weather records and dated sources — and shows you how
          well the claim holds up.
        </p>
      </div>
    </div>
  );
}
