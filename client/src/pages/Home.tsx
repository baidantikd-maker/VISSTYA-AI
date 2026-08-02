import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { ChevronRight, Shield, Zap, BarChart3 } from "lucide-react";
import { startLogin } from "@/const";

export default function Home() {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      setLocation("/verify");
    } else {
      startLogin();
    }
  };

  return (
    <div className="min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b bg-[hsl(var(--background))]/80 backdrop-blur-sm" style={{borderBottomColor: 'hsl(var(--border))'}}>
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-accent" />
            <span className="text-xl font-semibold">Visstya</span>
          </div>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Button
                  variant="ghost"
                  onClick={() => setLocation("/verify")}
                  className="text-sm"
                >
                  Verify
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setLocation("/history")}
                  className="text-sm"
                >
                  History
                </Button>
              </>
            ) : (
              <Button
                variant="default"
                onClick={startLogin}
                className="text-sm"
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32 lg:py-40">
        {/* Subtle background gradient */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-secondary via-background to-background" />

        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-8 stagger-item">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-balance">
                Trust Through Evidence
              </h1>
              <p className="text-lg md:text-xl text-[hsl(var(--muted))] leading-relaxed text-balance">
                Visstya AI helps you verify digital content by analyzing metadata, visual context, weather patterns, and corroborating evidence from trusted sources. Make informed decisions, not assumptions.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button
                size="lg"
                onClick={handleGetStarted}
                className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
              >
                Start Verifying
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => {
                  const element = document.getElementById("how-it-works");
                  element?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="how-it-works" className="py-20 md:py-32 border-t" style={{borderTopColor: 'hsl(var(--border))'}}>
        <div className="container">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold">How It Works</h2>
            <p className="text-lg text-[hsl(var(--muted))] max-w-2xl mx-auto">
              Four specialized verification modules analyze your media from different angles
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Module 1 */}
            <div className="card-minimal group">
              <div className="w-12 h-12 bg-[hsl(var(--secondary))] rounded-lg flex items-center justify-center mb-4 group-hover:bg-accent/10 transition-colors">
                <Shield className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Metadata Analysis</h3>
              <p className="text-sm text-[hsl(var(--muted))]">
                Extract EXIF data, GPS coordinates, and check for signs of tampering or editing.
              </p>
              <div className="mt-4 text-xs font-medium text-accent">Max 15 points</div>
            </div>

            {/* Module 2 */}
            <div className="card-minimal group">
              <div className="w-12 h-12 bg-[hsl(var(--secondary))] rounded-lg flex items-center justify-center mb-4 group-hover:bg-accent/10 transition-colors">
                <Zap className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Vision Analysis</h3>
              <p className="text-sm text-[hsl(var(--muted))]">
                AI analyzes visual content, objects, scene context, and consistency with your claim.
              </p>
              <div className="mt-4 text-xs font-medium text-accent">Max 25 points</div>
            </div>

            {/* Module 3 */}
            <div className="card-minimal group">
              <div className="w-12 h-12 bg-[hsl(var(--secondary))] rounded-lg flex items-center justify-center mb-4 group-hover:bg-accent/10 transition-colors">
                <BarChart3 className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Weather Verification</h3>
              <p className="text-sm text-[hsl(var(--muted))]">
                Cross-check location and date against historical weather data for consistency.
              </p>
              <div className="mt-4 text-xs font-medium text-accent">Max 25 points</div>
            </div>

            {/* Module 4 */}
            <div className="card-minimal group">
              <div className="w-12 h-12 bg-[hsl(var(--secondary))] rounded-lg flex items-center justify-center mb-4 group-hover:bg-accent/10 transition-colors">
                <Shield className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Evidence Corroboration</h3>
              <p className="text-sm text-[hsl(var(--muted))]">
                Search trusted sources like Reuters and PIB Fact Check for independent support.
              </p>
              <div className="mt-4 text-xs font-medium text-accent">Max 35 points</div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Score Explanation */}
      <section className="py-20 md:py-32 bg-[hsl(var(--secondary))]/30 border-t" style={{borderTopColor: 'hsl(var(--border))'}}>
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">Understanding Your Trust Score</h2>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-red-100 text-red-600">
                    <span className="text-lg font-bold">0–39</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">FALSE</h3>
                  <p className="text-[hsl(var(--muted))]">
                    Evidence strongly contradicts or fails to support the claim. High risk of misinformation.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-yellow-100 text-yellow-600">
                    <span className="text-lg font-bold">40–79</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">AVERAGE</h3>
                  <p className="text-[hsl(var(--muted))]">
                    Mixed or incomplete evidence. Review details carefully before trusting.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-green-100 text-green-600">
                    <span className="text-lg font-bold">80–100</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">TRUSTABLE</h3>
                  <p className="text-[hsl(var(--muted))]">
                    Strong multi-source support and consistency across modules.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 border-t" style={{borderTopColor: 'hsl(var(--border))'}}>
        <div className="container">
          <div className="max-w-2xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold">Ready to Verify?</h2>
              <p className="text-lg text-[hsl(var(--muted))]">
                Upload an image or video and provide context about the claim. Get your trust report in seconds.
              </p>
            </div>
            <Button
              size="lg"
              onClick={handleGetStarted}
              className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
            >
              Start Now
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 md:py-12 bg-[hsl(var(--secondary))]/20" style={{borderTopColor: 'hsl(var(--border))'}}>
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-accent" />
              <span className="font-semibold">Visstya AI</span>
            </div>
            <p className="text-sm text-[hsl(var(--muted))] text-center md:text-right">
              © 2026 Visstya AI. Transparent evidence-based trust for digital content.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
