import { Logo } from "./Logo";
import { ArrowRight, Disc3, Menu, Settings, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useLocation } from "wouter";
import { WheelMenu } from "./WheelMenu";
import { useLanguage } from "@/contexts/LanguageContext";

export function Navbar() {
  const { t } = useLanguage();
  const [location, setLocation] = useLocation();
  const [open, setOpen] = useState(false);
  const [wheelOpen, setWheelOpen] = useState(false);

  const MENU_LINKS = [
    { href: "/dashboard", label: t("nav.dashboard") },
    { href: "/verify", label: t("nav.verify") },
    { href: "/history", label: t("nav.history") },
    { href: "/settings", label: t("nav.settings") },
  ];

  const ANCHOR_LINKS = [
    { href: "/#how-it-works", label: t("nav.howItWorks") },
    { href: "/#modules", label: t("nav.modules") },
    { href: "/#scale", label: t("nav.trustScale") },
  ];

  const go = (href: string) => {
    setOpen(false);
    if (href.startsWith("/#")) {
      const id = href.slice(2);
      const onLanding = window.location.pathname === "/";
      if (onLanding) {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      } else {
        setLocation("/");
        setTimeout(() => {
          document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
        }, 80);
      }
    } else {
      setLocation(href);
    }
  };

  const isActive = (href: string) => location.startsWith(href);

  return (
    <header className="sticky top-0 z-40 border-b border-[hsl(var(--border))] bg-[hsl(var(--background))/85] backdrop-blur-md">
      <div className="container flex min-h-14 flex-wrap items-center justify-between gap-y-1">
        <button
          type="button"
          onClick={() => setLocation("/")}
          className="shrink-0"
          aria-label={t("nav.visstyaHome")}
        >
          <Logo />
        </button>

        {/* Desktop navigation */}
        <nav className="hidden flex-wrap items-center gap-1 md:flex">
          {MENU_LINKS.filter((item) => item.href !== "/settings").map((item) => (
            <button
              key={item.href}
              type="button"
              onClick={() => go(item.href)}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm transition-colors",
                isActive(item.href)
                  ? "bg-[hsl(var(--secondary))] font-medium text-[hsl(var(--foreground))]"
                  : "text-[hsl(var(--muted))] hover:bg-[hsl(var(--secondary))] hover:text-[hsl(var(--foreground))]"
              )}
            >
              {item.label}
            </button>
          ))}
          <span className="mx-2 hidden h-4 w-px bg-[hsl(var(--border))] xl:block" />
          {ANCHOR_LINKS.map((item) => (
            <button
              key={item.href}
              type="button"
              onClick={() => go(item.href)}
              className="hidden rounded-md px-3 py-1.5 text-sm text-[hsl(var(--muted))] transition-colors hover:bg-[hsl(var(--secondary))] hover:text-[hsl(var(--foreground))] xl:block"
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setWheelOpen(true)}
            className="hidden items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium text-[hsl(var(--muted))] transition-colors hover:bg-[hsl(var(--secondary))] hover:text-[hsl(var(--foreground))] md:inline-flex"
            aria-label={t("nav.openNavigationWheel")}
          >
            <Disc3 className="size-4" />
            {t("common.menu")}
          </button>
          <button
            type="button"
            onClick={() => setLocation("/dashboard")}
            className="hidden rounded-md px-3 py-1.5 text-sm font-medium text-[hsl(var(--foreground))] transition-colors hover:bg-[hsl(var(--secondary))] lg:block"
          >
            {t("common.signIn")}
          </button>
          <button
            type="button"
            onClick={() => setLocation("/verify")}
            className="hidden min-h-9 items-center gap-1.5 rounded-md bg-[hsl(var(--primary))] px-4 text-sm font-medium text-[hsl(var(--primary-foreground))] transition-all duration-200 hover:opacity-90 active:scale-[0.98] md:inline-flex"
          >
            {t("nav.verifyContent")}
            <ArrowRight className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => setLocation("/settings")}
            className="hidden size-9 items-center justify-center rounded-md text-[hsl(var(--foreground))] transition-colors hover:bg-[hsl(var(--secondary))] md:inline-flex"
            aria-label={t("nav.settings")}
          >
            <Settings className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="inline-flex size-9 items-center justify-center rounded-md text-[hsl(var(--foreground))] transition-colors hover:bg-[hsl(var(--secondary))] md:hidden"
            aria-label={open ? t("common.menu") : t("common.menu")}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile navigation */}
      {open && (
        <div className="border-t border-[hsl(var(--border))] bg-[hsl(var(--background))] md:hidden">
          <div className="container flex flex-col gap-1 py-3">
            {MENU_LINKS.map((item) => (
              <button
                key={item.href}
                type="button"
                onClick={() => go(item.href)}
                className={cn(
                  "flex items-center justify-between rounded-md px-3 py-2.5 text-sm transition-colors",
                  isActive(item.href)
                    ? "bg-[hsl(var(--secondary))] font-medium text-[hsl(var(--foreground))]"
                    : "text-[hsl(var(--foreground))] hover:bg-[hsl(var(--secondary))]"
                )}
              >
                {item.label}
                <ArrowRight className="size-4 text-[hsl(var(--muted))]" />
              </button>
            ))}
            <div className="my-1 h-px bg-[hsl(var(--border))]" />
            {ANCHOR_LINKS.map((item) => (
              <button
                key={item.href}
                type="button"
                onClick={() => go(item.href)}
                className="rounded-md px-3 py-2.5 text-left text-sm text-[hsl(var(--muted))] transition-colors hover:bg-[hsl(var(--secondary))] hover:text-[hsl(var(--foreground))]"
              >
                {item.label}
              </button>
            ))}
            <div className="my-1 h-px bg-[hsl(var(--border))]" />
            <button
              type="button"
              onClick={() => setLocation("/verify")}
              className="mt-1 inline-flex min-h-10 items-center justify-center gap-2 rounded-md bg-[hsl(var(--primary))] px-4 text-sm font-medium text-[hsl(var(--primary-foreground))] transition-all duration-200 hover:opacity-90"
            >
              {t("nav.verifyContent")}
              <ArrowRight className="size-4" />
            </button>
          </div>
        </div>
      )}

      <WheelMenu open={wheelOpen} onClose={() => setWheelOpen(false)} />
    </header>
  );
}
