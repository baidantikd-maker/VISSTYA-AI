import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocation } from "wouter";

export default function NotFound() {
  const [, setLocation] = useLocation();
  const { t } = useLanguage();

  return (
    <div className="flex min-h-screen flex-col bg-[hsl(var(--background))]">
      <Navbar />
      <main className="container flex flex-1 flex-col items-center justify-center py-24 text-center">
        <p className="font-mono text-7xl font-light tracking-tight text-[hsl(var(--foreground))]">
          404
        </p>
        <h1 className="mt-4 text-2xl text-[hsl(var(--foreground))]">{t("notFound.title")}</h1>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-[hsl(var(--muted))]">
          {t("notFound.detail")}
        </p>
        <button
          type="button"
          onClick={() => setLocation("/")}
          className="mt-8 inline-flex min-h-10 items-center rounded-md bg-[hsl(var(--primary))] px-5 text-sm font-medium text-[hsl(var(--primary-foreground))] transition-opacity hover:opacity-90"
        >
          {t("notFound.backHome")}
        </button>
      </main>
      <Footer />
    </div>
  );
}
