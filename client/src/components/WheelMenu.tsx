import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useLocation } from "wouter";
import { X, ArrowRight, Disc3 } from "lucide-react";
import { motion } from "framer-motion";
import OptionWheel from "./ui/option-wheel/OptionWheel";
import { useLanguage } from "@/contexts/LanguageContext";

function activeIndexFor(location: string): number {
  let best = 0;
  let bestLen = -1;
  WHEEL_ITEMS_FOR_SELECTION.forEach((item, index) => {
    const len =
      item.href === "/"
        ? location === "/" || location === ""
          ? 0
          : -1
        : location.startsWith(item.href)
          ? item.href.length
          : -1;
    if (len > bestLen) {
      bestLen = len;
      best = index;
    }
  });
  return best;
}

const WHEEL_ITEMS_FOR_SELECTION = [
  { href: "/" },
  { href: "/dashboard" },
  { href: "/verify" },
  { href: "/history" },
  { href: "/settings" },
];

export function WheelMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { t } = useLanguage();
  const [location, setLocation] = useLocation();
  const [selected, setSelected] = useState(activeIndexFor(location));

  const WHEEL_ITEMS = [
    { label: t("nav.home"), href: "/", description: t("nav.wheel.homeDesc") },
    { label: t("nav.dashboard"), href: "/dashboard", description: t("nav.wheel.dashboardDesc") },
    { label: t("nav.verify"), href: "/verify", description: t("nav.wheel.verifyDesc") },
    { label: t("nav.history"), href: "/history", description: t("nav.wheel.historyDesc") },
    { label: t("nav.settings"), href: "/settings", description: t("nav.wheel.settingsDesc") },
  ];

  useEffect(() => {
    if (!open) return;
    setSelected(activeIndexFor(location));
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, location, onClose]);

  if (!open) return null;

  const item = WHEEL_ITEMS[selected];

  const go = (href: string) => {
    onClose();
    setLocation(href);
  };

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
      className="fixed inset-0 z-50"
      role="dialog"
      aria-modal="true"
      aria-label={t("nav.wheel.navigation")}
    >
      <div
        className="absolute inset-0 bg-[hsl(0_0%_4%/0.92)] backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="absolute inset-x-0 top-0 z-10 flex min-h-14 flex-wrap items-center justify-between gap-y-1 px-4 md:px-6">
        <button
          type="button"
          onClick={onClose}
          className="inline-flex items-center gap-2 text-sm text-[#a6a6a6] transition-colors hover:text-white"
        >
          <Disc3 className="size-4" />
          Visstya
        </button>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex size-9 items-center justify-center rounded-md text-[#a6a6a6] transition-colors hover:bg-white/10 hover:text-white"
          aria-label={t("nav.wheel.close")}
        >
          <X className="size-5" />
        </button>
      </div>

      <div className="relative z-10 flex h-full items-center justify-center">
        <div className="flex w-[min(92vw,480px)] flex-col items-center">
          <div className="h-[360px] w-full">
            <OptionWheel
              key={activeIndexFor(location)}
              items={WHEEL_ITEMS.map((i) => i.label)}
              defaultSelected={selected}
              onChange={(index) => setSelected(index)}
              textColor="#a6a6a6"
              activeColor="#ffffff"
              side="left"
              fontSize={2.5}
              spacing={1.5}
              curve={1}
              tilt={6}
              blur={1.5}
              fade={0.22}
              inset={64}
            />
          </div>

          <div className="mt-2 flex w-full flex-col items-center gap-3 text-center">
            <div className="flex h-4 items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-white/80" />
              <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#a6a6a6]">
                {t("nav.wheel.selected")}
              </span>
            </div>
            <p className="text-2xl font-medium text-white">{item.label}</p>
            <p className="text-sm text-[#a6a6a6]">{item.description}</p>
            <button
              type="button"
              onClick={() => go(item.href)}
              className="mt-1 inline-flex min-h-10 items-center gap-2 rounded-md bg-white px-5 text-sm font-medium text-[hsl(0_0%_4%)] transition-all duration-200 hover:bg-[#e5e5e5] active:scale-[0.98]"
            >
              {t("nav.wheel.openItem", { label: item.label })}
              <ArrowRight className="size-4" />
            </button>
            <p className="mt-2 text-xs text-[hsl(0_0%_45%)]">
              {t("nav.wheel.hint")}
            </p>
          </div>
        </div>
      </div>
    </motion.div>,
    document.body
  );
}
