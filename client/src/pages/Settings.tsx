import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { languages } from "@/locales";

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="panel p-6">
      <p className="text-base font-medium text-[hsl(var(--foreground))]">{title}</p>
      {description && (
        <p className="mt-1 text-sm leading-relaxed text-[hsl(var(--muted))]">{description}</p>
      )}
      <div className="mt-5">{children}</div>
    </div>
  );
}

function RetentionOption({
  label,
  detail,
  selected,
  onClick,
}: {
  label: string;
  detail: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        "w-full rounded-lg border px-4 py-3 text-left transition-colors " +
        (selected
          ? "border-[hsl(var(--foreground))] bg-[hsl(var(--secondary))]"
          : "border-[hsl(var(--border))] hover:bg-[hsl(var(--secondary))/40]")
      }
    >
      <p className="text-sm font-medium text-[hsl(var(--foreground))]">{label}</p>
      <p className="mt-0.5 text-xs text-[hsl(var(--muted))]">{detail}</p>
    </button>
  );
}

export default function Settings() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme, switchable } = useTheme();
  const { t, code, setCode } = useLanguage();
  const [name, setName] = useState(user?.name ?? "Guest Mode");
  const [email] = useState(user?.email ?? "guest@gmail.com");
  const [publicProfile, setPublicProfile] = useState(true);
  const [shareReports, setShareReports] = useState(true);
  const [retention, setRetention] = useState("none");

  return (
    <AppShell>
      <div className="settings-page container max-w-3xl py-10 md:py-14">
        <div className="fade-in text-center">
          <p className="section-label">{t("settings.eyebrow")}</p>
          <h1 className="mt-3 text-balance text-3xl md:text-4xl">{t("settings.title")}</h1>
          <p className="mx-auto mt-3 max-w-xl text-[hsl(var(--muted))]">
            {t("settings.detail")}
          </p>
        </div>

        <div className="mt-8 space-y-6">
          {/* Appearance */}
          <Section
            title={t("settings.appearanceTitle")}
            description={t("settings.appearanceDetail")}
          >
            {switchable && toggleTheme ? (
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-[hsl(var(--foreground))]">
                    {theme === "dark" ? t("settings.darkMode") : t("settings.lightMode")}
                  </p>
                  <p className="text-xs text-[hsl(var(--muted))]">
                    {t("settings.themeToggleDetail")}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={toggleTheme}
                  aria-label={t("settings.toggleDarkModeAria")}
                >
                  {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-[hsl(var(--foreground))]">{t("settings.darkMode")}</p>
                  <p className="text-xs text-[hsl(var(--muted))]">{t("settings.themeDisabled")}</p>
                </div>
                <Switch checked={false} disabled />
              </div>
            )}
          </Section>

          {/* Language */}
          <Section
            title={t("settings.languageTitle")}
            description={t("settings.languageDetail")}
          >
            <select
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="h-10 w-full rounded-md border border-[hsl(var(--input))] bg-[hsl(var(--card))] px-3 text-sm outline-none focus:border-[hsl(var(--foreground))] sm:w-64"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.label}
                </option>
              ))}
            </select>
            <p className="mt-2 text-xs text-[hsl(var(--muted))]">
              {t("settings.moreLanguages")}
            </p>
          </Section>

          {/* Profile */}
          <Section title={t("settings.profileTitle")} description={t("settings.profileDetail")}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="s-name" className="mb-1.5 block text-sm font-medium text-[hsl(var(--foreground))]">
                  {t("settings.name")}
                </label>
                <input
                  id="s-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-10 w-full rounded-md border border-[hsl(var(--input))] bg-[hsl(var(--card))] px-3 text-sm outline-none focus:border-[hsl(var(--foreground))]"
                />
              </div>
              <div>
                <label htmlFor="s-email" className="mb-1.5 block text-sm font-medium text-[hsl(var(--foreground))]">
                  {t("settings.email")}
                </label>
                <input
                  id="s-email"
                  value={email}
                  readOnly
                  className="h-10 w-full rounded-md border border-[hsl(var(--input))] bg-[hsl(var(--secondary))] px-3 text-sm text-[hsl(var(--muted))] outline-none"
                />
              </div>
            </div>
            <div className="mt-4">
              <Button
                size="sm"
                onClick={() => toast.success(t("settings.savedToast"))}
              >
                {t("settings.saveChanges")}
              </Button>
            </div>
          </Section>

          {/* Privacy */}
          <Section
            title={t("settings.privacyTitle")}
            description={t("settings.privacyDetail")}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-[hsl(var(--foreground))]">{t("settings.publicProfile")}</p>
                  <p className="text-xs text-[hsl(var(--muted))]">{t("settings.publicProfileDetail")}</p>
                </div>
                <Switch checked={publicProfile} onCheckedChange={setPublicProfile} />
              </div>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-[hsl(var(--foreground))]">{t("settings.shareableReports")}</p>
                  <p className="text-xs text-[hsl(var(--muted))]">{t("settings.shareableReportsDetail")}</p>
                </div>
                <Switch checked={shareReports} onCheckedChange={setShareReports} />
              </div>
            </div>
          </Section>

          {/* Verification history */}
          <Section
            title={t("settings.historyTitle")}
            description={t("settings.historyDetail")}
          >
            <Button
              size="sm"
              variant="outline"
              onClick={() => toast.success(t("settings.historyClearedToast"))}
            >
              {t("settings.clearHistory")}
            </Button>
          </Section>

          {/* Data controls */}
          <Section
            title={t("settings.dataTitle")}
            description={t("settings.dataDetail")}
          >
            <div className="flex flex-wrap gap-3">
              <Button
                size="sm"
                variant="outline"
                onClick={() => toast.success(t("settings.exportToast"))}
              >
                {t("settings.exportData")}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => toast.success(t("settings.deleteToast"))}
              >
                {t("settings.deleteData")}
              </Button>
            </div>
          </Section>

          {/* Media retention */}
          <Section
            title={t("settings.retentionTitle")}
            description={t("settings.retentionDetail")}
          >
            <div className="grid gap-3 sm:grid-cols-3">
              <RetentionOption
                label={t("settings.retentionNone")}
                detail={t("settings.retentionNoneDetail")}
                selected={retention === "none"}
                onClick={() => setRetention("none")}
              />
              <RetentionOption
                label={t("settings.retention30")}
                detail={t("settings.retention30Detail")}
                selected={retention === "30"}
                onClick={() => setRetention("30")}
              />
              <RetentionOption
                label={t("settings.retentionKeep")}
                detail={t("settings.retentionKeepDetail")}
                selected={retention === "keep"}
                onClick={() => setRetention("keep")}
              />
            </div>
            <p className="mt-4 text-xs leading-relaxed text-[hsl(var(--muted))]">
              {t("settings.retentionNote")}
            </p>
          </Section>

          {/* Account */}
          <Section title={t("settings.accountTitle")} description={t("settings.accountDetail")}>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                void logout();
                window.location.href = "/";
              }}
            >
              {t("common.signOut")}
            </Button>
          </Section>
        </div>
      </div>
    </AppShell>
  );
}
