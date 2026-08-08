import { Logo } from "./Logo";
import { useLanguage } from "@/contexts/LanguageContext";

export function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="border-t border-[hsl(var(--border))]">
      <div className="container flex flex-col gap-8 py-12 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm">
          <Logo />
          <p className="mt-4 text-sm leading-relaxed text-[hsl(var(--muted))]">
            {t("footer.tagline")}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-10 md:grid-cols-3">
          <div>
            <p className="section-label">{t("footer.product")}</p>
            <ul className="mt-3 space-y-2 text-sm text-[hsl(var(--muted))]">
              <li><a className="transition-colors hover:text-[hsl(var(--foreground))]" href="#how-it-works">{t("footer.howItWorks")}</a></li>
              <li><a className="transition-colors hover:text-[hsl(var(--foreground))]" href="#modules">{t("footer.analysisModules")}</a></li>
              <li><a className="transition-colors hover:text-[hsl(var(--foreground))]" href="#scale">{t("footer.trustScale")}</a></li>
            </ul>
          </div>
          <div>
            <p className="section-label">{t("footer.platform")}</p>
            <ul className="mt-3 space-y-2 text-sm text-[hsl(var(--muted))]">
              <li><a className="transition-colors hover:text-[hsl(var(--foreground))]" href="/verify">{t("footer.verifyContent")}</a></li>
              <li><a className="transition-colors hover:text-[hsl(var(--foreground))]" href="/history">{t("footer.verificationHistory")}</a></li>
              <li><a className="transition-colors hover:text-[hsl(var(--foreground))]" href="/dashboard">{t("footer.dashboard")}</a></li>
            </ul>
          </div>
          <div>
            <p className="section-label">{t("footer.company")}</p>
            <ul className="mt-3 space-y-2 text-sm text-[hsl(var(--muted))]">
              <li><a className="transition-colors hover:text-[hsl(var(--foreground))]" href="/settings">{t("footer.privacy")}</a></li>
              <li><a className="transition-colors hover:text-[hsl(var(--foreground))]" href="/settings">{t("footer.dataControls")}</a></li>
              <li><a className="transition-colors hover:text-[hsl(var(--foreground))]" href="/settings">{t("footer.account")}</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-[hsl(var(--border))]">
        <div className="container flex flex-col items-center justify-between gap-2 py-5 text-xs text-[hsl(var(--muted))] sm:flex-row">
          <span>{t("footer.copyright")}</span>
          <span>{t("footer.demoBuild")}</span>
        </div>
      </div>
    </footer>
  );
}
