import DarkVeil from "@/components/DarkVeil";
import DotField from "@/components/DotField/DotField";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { ScoreBar } from "@/components/ScoreBar";
import { TrustScale, TrustScore } from "@/components/TrustScore";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { SAMPLE_REPORT_84 } from "@/mock/data";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import { useEffect } from "react";
import { useLocation } from "wouter";

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
  const { t } = useLanguage();
  const sample = SAMPLE_REPORT_84;

  const STEPS = [
    { n: "01", title: t("home.step1Title"), detail: t("home.step1Detail") },
    { n: "02", title: t("home.step2Title"), detail: t("home.step2Detail") },
    { n: "03", title: t("home.step3Title"), detail: t("home.step3Detail") },
    { n: "04", title: t("home.step4Title"), detail: t("home.step4Detail") },
    { n: "05", title: t("home.step5Title"), detail: t("home.step5Detail") },
  ];

  const MODULES = [
    { n: "01", title: t("home.metadataTitle"), max: 15, detail: t("home.metadataDetail") },
    { n: "02", title: t("home.visionTitle"), max: 25, detail: t("home.visionDetail") },
    { n: "03", title: t("home.weatherTitle"), max: 25, detail: t("home.weatherDetail") },
    { n: "04", title: t("home.evidenceTitle"), max: 35, detail: t("home.evidenceDetail") },
  ];

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
            {t("home.heroEyebrow")}
          </p>
          <h1
            className="heading-glow stagger-item mt-5 max-w-4xl text-balance text-[2.5rem] leading-[1.05] text-[hsl(var(--foreground))] md:text-6xl lg:text-7xl"
            style={{ animationDelay: "0.08s" }}
          >
            {t("home.heroTitleLine1")}
            <br />
            <span className="text-[hsl(var(--muted))]">
              {t("home.heroTitleLine2")}
            </span>
          </h1>
          <p
            className="stagger-item mt-6 max-w-xl text-lg leading-relaxed text-[hsl(var(--muted))]"
            style={{ animationDelay: "0.14s" }}
          >
            {t("home.heroDetail")}
          </p>
          <div
            className="stagger-item mt-9 flex flex-wrap items-center justify-center gap-3"
            style={{ animationDelay: "0.2s" }}
          >
            <button
              type="button"
              onClick={() => setLocation("/verify")}
              className={`inline-flex min-h-11 items-center gap-2 rounded-md bg-[hsl(var(--primary))] px-6 transition-all duration-200 hover:opacity-90 active:scale-[0.98] ${
                theme === "dark" ? "text-base font-bold" : "text-sm font-medium"
              } text-[hsl(var(--primary-foreground))]`}
            >
              {t("nav.verifyContent")}
              {theme === "light" && <ArrowRight className="size-4" />}
            </button>
            <button
              type="button"
              onClick={() =>
                document
                  .getElementById("how-it-works")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className={`inline-flex min-h-11 items-center rounded-md px-6 transition-all duration-200 hover:bg-[hsl(var(--secondary))] active:scale-[0.98] ${
                theme === "dark"
                  ? "border border-white/50 text-base font-bold text-[hsl(var(--foreground))] shadow-[0_0_10px_rgba(255,255,255,0.35),0_0_22px_rgba(255,255,255,0.15)]"
                  : "border border-[hsl(var(--border))] text-sm font-medium text-[hsl(var(--foreground))]"
              }`}
            >
              {t("nav.seeHowItWorks")}
            </button>
          </div>

          {/* Sample report card */}
          <div
            className="scale-in mt-16 w-full max-w-xl md:mt-20"
            style={{ animationDelay: "0.26s" }}
          >
            <div className="panel p-6 text-left shadow-[0_1px_2px_rgba(0,0,0,0.04),0_16px_40px_rgba(0,0,0,0.07)] md:p-8">
              <div className="flex items-center justify-between">
                <p className="section-label text-glow-accent">{t("home.sampleReport")}</p>
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
                  label={t("home.metadataTitle")}
                  score={sample.modules.metadata.score}
                  max={15}
                  barClassName="bar-glow-success"
                />
                <ScoreBar
                  label={t("home.visionTitle")}
                  score={sample.modules.vision.score}
                  max={25}
                  barClassName="bar-glow-success"
                />
                <ScoreBar
                  label={t("home.weatherTitle")}
                  score={sample.modules.weather.score}
                  max={25}
                  barClassName="bar-glow-success"
                />
                <ScoreBar
                  label={t("home.evidenceTitle")}
                  score={sample.modules.evidence.score}
                  max={35}
                  barClassName="bar-glow-false"
                />
              </div>

              <div className="mt-6 border-t border-[hsl(var(--border))] pt-4">
                <p className="text-xs text-[hsl(var(--muted))]">
                  {t("home.sourceSummary", {
                    total: sample.sources.length,
                    corroborate: sample.sources.filter(
                      s => s.label === "Supporting"
                    ).length,
                    contradict: 0,
                  })}
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
            eyebrow={t("home.workflowEyebrow")}
            eyebrowClassName="eyebrow-glow"
            title={t("home.workflowTitle")}
            titleClassName="section-title-glow"
            className="reveal"
            detail={t("home.workflowDetail")}
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
          eyebrow={t("home.modulesEyebrow")}
          eyebrowClassName="eyebrow-glow"
          title={t("home.modulesTitle")}
          titleClassName="section-title-glow"
          className="reveal"
          detail={t("home.modulesDetail")}
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
                    {t("home.points", { points: mod.max })}
                  </span>
                ) : (
                  <>
                    <span className="font-mono text-xs text-[hsl(var(--muted))]">
                      {mod.n}
                    </span>
                    <span className="text-xs text-[hsl(var(--muted))]">
                      {t("home.weight", { weight: mod.max })}
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
            eyebrow={t("home.scaleEyebrow")}
            eyebrowClassName="eyebrow-glow"
            title={t("home.scaleTitle")}
            titleClassName="section-title-glow"
            className="reveal"
            detail={t("home.scaleDetail")}
          />

          <div className="reveal panel mx-auto mt-10 max-w-xl p-6">
            <span className="sample-badge inline-block px-2 py-1 text-[11px] font-extrabold uppercase tracking-wide text-[hsl(var(--foreground))]">
              {t("home.samplePlacement")}
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
        <div
          className={
            theme === "dark"
              ? "reveal panel-border-only panel-white-glow relative flex flex-col items-center gap-6 overflow-hidden px-6 py-14 text-center shadow-[0_0_16px_rgba(255,255,255,0.15)] md:py-16"
              : "reveal panel-subtle flex flex-col items-center gap-6 px-6 py-14 text-center md:py-16"
          }
        >
          {theme === "dark" && (
            <div className="pointer-events-none absolute inset-0 z-0">
              <DotField
                dotRadius={2.2}
                dotSpacing={14}
                bulgeStrength={67}
                glowRadius={160}
                sparkle={false}
                waveAmplitude={0}
                gradientFrom="rgba(168, 85, 247, 0.65)"
                gradientTo="rgba(180, 151, 207, 0.5)"
              />
            </div>
          )}
          <div className={theme === "dark" ? "relative z-10 flex flex-col items-center gap-6" : "flex flex-col items-center gap-6"}>
            <p className="reveal section-label eyebrow-glow" style={{ animationDelay: "0.1s" }}>
              {t("home.ctaEyebrow")}
            </p>
            <h2
              className={`reveal section-title-glow max-w-xl text-balance`}
              style={{ animationDelay: "0.2s" }}
            >
              {t("home.ctaTitle")}
            </h2>
            <button
              type="button"
              onClick={() => setLocation("/verify")}
              className={`inline-flex min-h-11 items-center gap-2 rounded-md px-7 text-sm font-medium transition-all duration-200 hover:opacity-90 active:scale-[0.98] ${
                theme === "dark"
                  ? "bg-[hsl(261_88%_60%)] text-white"
                  : "bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]"
              }`}
            >
              {t("nav.verifyContent")}
              <ArrowRight className="size-4" />
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
