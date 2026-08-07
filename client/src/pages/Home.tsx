import DarkVeil from "@/components/DarkVeil";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { ScoreBar } from "@/components/ScoreBar";
import { TrustScale, TrustScore } from "@/components/TrustScore";
import { useTheme } from "@/contexts/ThemeContext";
import { SAMPLE_REPORT_84 } from "@/mock/data";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import { useEffect } from "react";
import { useLocation } from "wouter";

const STEPS = [
  {
    n: "01",
    title: "Upload",
    detail: "Drop a photo, video or pasted URL into the verification queue.",
  },
  {
    n: "02",
    title: "Parse",
    detail: "Capture metadata, location, timestamps and editing history.",
  },
  {
    n: "03",
    title: "Analyze",
    detail: "Vision and weather signals are checked against the record.",
  },
  {
    n: "04",
    title: "Corroborate",
    detail: "Dated, independent sources are gathered and compared.",
  },
  {
    n: "05",
    title: "Report",
    detail: "You get a scored, sourced report — not a black-box verdict.",
  },
];

const MODULES = [
  {
    n: "01",
    title: "Metadata",
    max: 15,
    detail:
      "Capture time, GPS, camera model and editing history — checked for internal consistency and provenance.",
  },
  {
    n: "02",
    title: "Vision",
    max: 25,
    detail:
      "Scene, objects, weather cues and generation artifacts, analysed across the full frame.",
  },
  {
    n: "03",
    title: "Weather",
    max: 25,
    detail:
      "Observational records, advisories and river gauges compared with what the media appears to show.",
  },
  {
    n: "04",
    title: "Evidence",
    max: 35,
    detail:
      "Dated, independent reporting and official statements weighed for corroboration — or contradiction.",
  },
];

function SectionHeading({
  eyebrow,
  title,
  detail,
  eyebrowClassName,
  titleClassName,
  className,
}: {
  eyebrow: string;
  title: string;
  detail?: string;
  eyebrowClassName?: string;
  titleClassName?: string;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto max-w-2xl text-center", className)}>
      <p
        className={`section-label${eyebrowClassName ? ` ${eyebrowClassName}` : ""}`}
      >
        {eyebrow}
      </p>
      <h2
        className={`mt-3 text-balance${titleClassName ? ` ${titleClassName}` : ""}`}
      >
        {title}
      </h2>
      {detail && (
        <p className="mt-4 leading-relaxed text-[hsl(var(--muted))]">
          {detail}
        </p>
      )}
    </div>
  );
}

export default function Home() {
  const [, setLocation] = useLocation();
  const { theme } = useTheme();
  const sample = SAMPLE_REPORT_84;

  useEffect(() => {
    const els = Array.from(
      document.querySelectorAll<HTMLElement>(".reveal")
    );
    if (!("IntersectionObserver" in window)) {
      els.forEach(el => el.classList.add("revealed"));
      return;
    }
    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.15 }
    );
    els.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-[hsl(var(--background))]">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden="true"
        >
          {theme === "dark" && (
            <DarkVeil
              scanlineIntensity={0.58}
              speed={1.1}
              scanlineFrequency={4}
            />
          )}
          <div className="absolute inset-0 bg-[hsl(var(--background))/75]" />
        </div>

        <div className="container relative flex flex-col items-center pt-20 pb-16 text-center md:pt-28 md:pb-20">
          <p
            className="section-label stagger-item"
            style={{ animationDelay: "0.02s" }}
          >
            Evidence-based verification
          </p>
          <h1
            className="heading-glow stagger-item mt-5 max-w-4xl text-balance text-[2.5rem] leading-[1.05] text-[hsl(var(--foreground))] md:text-6xl lg:text-7xl"
            style={{ animationDelay: "0.08s" }}
          >
            Don't ask if it's AI.
            <br />
            <span className="text-[hsl(var(--muted))]">
              Ask if the evidence supports it.
            </span>
          </h1>
          <p
            className="stagger-item mt-6 max-w-xl text-lg leading-relaxed text-[hsl(var(--muted))]"
            style={{ animationDelay: "0.14s" }}
          >
            Visstya analyses the media, the claims and the record — then shows
            you exactly how the evidence holds up. Metadata, vision, weather and
            dated sources, scored and laid out in one place.
          </p>
          <div
            className="stagger-item mt-9 flex flex-wrap items-center justify-center gap-3"
            style={{ animationDelay: "0.2s" }}
          >
            <button
              type="button"
              onClick={() => setLocation("/verify")}
              className={`inline-flex h-11 items-center gap-2 rounded-md bg-[hsl(var(--primary))] px-6 transition-all duration-200 hover:opacity-90 active:scale-[0.98] ${
                theme === "dark" ? "text-base font-bold" : "text-sm font-medium"
              } text-[hsl(var(--primary-foreground))]`}
            >
              Verify Content
              {theme === "light" && <ArrowRight className="size-4" />}
            </button>
            <button
              type="button"
              onClick={() =>
                document
                  .getElementById("how-it-works")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className={`inline-flex h-11 items-center rounded-md px-6 transition-all duration-200 hover:bg-[hsl(var(--secondary))] active:scale-[0.98] ${
                theme === "dark"
                  ? "border border-white/50 text-base font-bold text-[hsl(var(--foreground))] shadow-[0_0_10px_rgba(255,255,255,0.35),0_0_22px_rgba(255,255,255,0.15)]"
                  : "border border-[hsl(var(--border))] text-sm font-medium text-[hsl(var(--foreground))]"
              }`}
            >
              See how it works
            </button>
          </div>

          {/* Sample report card */}
          <div
            className="scale-in mt-16 w-full max-w-xl md:mt-20"
            style={{ animationDelay: "0.26s" }}
          >
            <div className="panel p-6 text-left shadow-[0_1px_2px_rgba(0,0,0,0.04),0_16px_40px_rgba(0,0,0,0.07)] md:p-8">
              <div className="flex items-center justify-between">
                <p className="section-label text-glow-accent">Sample report</p>
                <span className="chip-location rounded-full px-2.5 py-0.5 text-[11px]">
                  {sample.claim.location}
                </span>
              </div>

              <p className="mt-4 text-[15px] font-medium leading-snug text-[hsl(var(--foreground))]">
                {sample.claim.event}
              </p>

              <div className="mt-6 flex justify-center">
                <TrustScore score={sample.totalScore} />
              </div>

              <div className="mt-7 space-y-4">
                <ScoreBar
                  label="Metadata"
                  score={sample.modules.metadata.score}
                  max={15}
                  barClassName="bar-glow-success"
                />
                <ScoreBar
                  label="Vision"
                  score={sample.modules.vision.score}
                  max={25}
                  barClassName="bar-glow-success"
                />
                <ScoreBar
                  label="Weather"
                  score={sample.modules.weather.score}
                  max={25}
                  barClassName="bar-glow-success"
                />
                <ScoreBar
                  label="Evidence"
                  score={sample.modules.evidence.score}
                  max={35}
                  barClassName="bar-glow-false"
                />
              </div>

              <div className="mt-6 border-t border-[hsl(var(--border))] pt-4">
                <p className="text-xs text-[hsl(var(--muted))]">
                  {sample.sources.length} independent sources examined ·{" "}
                  {sample.sources.filter(s => s.label === "Supporting").length}{" "}
                  corroborate · 0 contradict
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section
        id="how-it-works"
        className="scroll-mt-20 border-y border-[hsl(var(--border))] bg-[hsl(var(--card))] py-16 md:py-24"
      >
        <div className="container">
          <SectionHeading
            eyebrow="Workflow"
            eyebrowClassName="eyebrow-glow"
            title="From media to a scored evidence report"
            titleClassName="section-title-glow"
            className="reveal"
            detail="Five stages, each traceable. Nothing about the process is hidden — every score in the final report points back to evidence."
          />

          <div className="mt-12 grid gap-px overflow-hidden rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--border))] md:grid-cols-5">
            {STEPS.map((step, i) => (
              <div
                key={step.n}
                className="reveal card-glow bg-[hsl(var(--card))] p-6 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[hsl(var(--secondary))/30]"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <div className="flex items-center justify-between">
                  <span className="step-number font-mono text-xs">{step.n}</span>
                </div>
                <p className="step-title mt-5 text-xl font-bold">
                  {step.title}
                </p>
                <p className="step-detail mt-2 text-xs leading-relaxed">
                  {step.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modules */}
      <section id="modules" className="scroll-mt-20 container py-16 md:py-24">
        <SectionHeading
          eyebrow="Analysis modules"
          eyebrowClassName="eyebrow-glow"
          title="Four signals, one score"
          titleClassName="section-title-glow"
          className="reveal"
          detail="The trust score combines four weighted modules. You can expand each one in any report to see exactly what was checked."
        />

        <div className="mx-auto mt-12 grid max-w-5xl gap-4 md:grid-cols-2 lg:grid-cols-4">
          {MODULES.map((mod, i) => (
            <div
              key={mod.n}
              className="reveal panel panel-hover-glow flex flex-col p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)]"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div className="flex items-center justify-between">
                {theme === "dark" ? (
                  <span className="ml-auto text-xs font-bold text-[hsl(261_88%_60%)]">
                    {mod.max} points
                  </span>
                ) : (
                  <>
                    <span className="font-mono text-xs text-[hsl(var(--muted))]">
                      {mod.n}
                    </span>
                    <span className="text-xs text-[hsl(var(--muted))]">
                      weight /{mod.max}
                    </span>
                  </>
                )}
              </div>
              <p className="module-title mt-5">{mod.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-[hsl(var(--muted))]">
                {mod.detail}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Trust scale */}
      <section
        id="scale"
        className="scroll-mt-20 border-y border-[hsl(var(--border))] bg-[hsl(var(--card))] py-16 md:py-24"
      >
        <div className="container">
          <SectionHeading
            eyebrow="Trust scale"
            eyebrowClassName="eyebrow-glow"
            title="Three bands, one horizontal scale"
            titleClassName={
              theme === "dark"
                ? "section-title-glow whitespace-nowrap!"
                : "section-title-glow"
            }
            className="reveal"
            detail="Every report places the claim on the same 0–100 scale. Under 40 is unsupported, 40–79 is partially supported, and 80 or above is well-supported by the evidence. The score is always a starting point — the sources are the substance."
          />

          <div className="reveal panel mx-auto mt-10 max-w-xl p-6">
            <span className="sample-badge inline-block px-2 py-1 text-[11px] font-extrabold uppercase tracking-wide text-[hsl(var(--foreground))]">
              Sample placement
            </span>
            <div className="mt-6 flex items-baseline justify-center gap-2">
              <TrustScore score={84} animated={false} size="md" />
            </div>
            <TrustScale score={84} className="mt-6" />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="container py-16 md:py-24">
        <div className="reveal panel-subtle flex flex-col items-center gap-6 px-6 py-14 text-center md:py-16">
          <p className="reveal section-label eyebrow-glow" style={{ animationDelay: "0.1s" }}>
            Ready when you are
          </p>
          <h2
            className={`reveal section-title-glow max-w-xl text-balance${theme === "dark" ? " whitespace-nowrap!" : ""}`}
            style={{ animationDelay: "0.2s" }}
          >
            Have something you don't trust?
          </h2>
          <button
            type="button"
            onClick={() => setLocation("/verify")}
            className={`inline-flex h-11 items-center gap-2 rounded-md px-7 text-sm font-medium transition-all duration-200 hover:opacity-90 active:scale-[0.98] ${
              theme === "dark"
                ? "bg-[hsl(261_88%_60%)] text-white"
                : "bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]"
            }`}
          >
            Verify Content
            <ArrowRight className="size-4" />
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
