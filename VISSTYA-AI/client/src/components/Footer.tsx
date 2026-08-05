import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="border-t border-[hsl(var(--border))]">
      <div className="container flex flex-col gap-8 py-12 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm">
          <Logo />
          <p className="mt-4 text-sm leading-relaxed text-[hsl(var(--muted))]">
            Visstya is an evidence-based verification platform. It does not
            decide what is true — it analyses the media, the claims and the
            record, then shows you how well the evidence holds up.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-10 md:grid-cols-3">
          <div>
            <p className="section-label">Product</p>
            <ul className="mt-3 space-y-2 text-sm text-[hsl(var(--muted))]">
              <li><a className="transition-colors hover:text-[hsl(var(--foreground))]" href="#how-it-works">How it works</a></li>
              <li><a className="transition-colors hover:text-[hsl(var(--foreground))]" href="#modules">Analysis modules</a></li>
              <li><a className="transition-colors hover:text-[hsl(var(--foreground))]" href="#scale">Trust scale</a></li>
            </ul>
          </div>
          <div>
            <p className="section-label">Platform</p>
            <ul className="mt-3 space-y-2 text-sm text-[hsl(var(--muted))]">
              <li><a className="transition-colors hover:text-[hsl(var(--foreground))]" href="/verify">Verify content</a></li>
              <li><a className="transition-colors hover:text-[hsl(var(--foreground))]" href="/history">Verification history</a></li>
              <li><a className="transition-colors hover:text-[hsl(var(--foreground))]" href="/dashboard">Dashboard</a></li>
            </ul>
          </div>
          <div>
            <p className="section-label">Company</p>
            <ul className="mt-3 space-y-2 text-sm text-[hsl(var(--muted))]">
              <li><a className="transition-colors hover:text-[hsl(var(--foreground))]" href="/settings">Privacy</a></li>
              <li><a className="transition-colors hover:text-[hsl(var(--foreground))]" href="/settings">Data controls</a></li>
              <li><a className="transition-colors hover:text-[hsl(var(--foreground))]" href="/settings">Account</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-[hsl(var(--border))]">
        <div className="container flex flex-col items-center justify-between gap-2 py-5 text-xs text-[hsl(var(--muted))] sm:flex-row">
          <span>© 2026 Visstya AI. Evidence over assertion.</span>
          <span>Demo build — reports are illustrative mock data.</span>
        </div>
      </div>
    </footer>
  );
}
