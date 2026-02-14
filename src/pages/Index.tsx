import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Activity, Pill, Brain, Bell, ArrowRight, Shield, BarChart3 } from "lucide-react";

const features = [
  { icon: Pill, title: "Medication Tracking", desc: "Log daily intake and never miss a dose with smart reminders." },
  { icon: Brain, title: "AI Health Assistant", desc: "Chat with our AI to understand symptoms and get guidance." },
  { icon: Bell, title: "Doctor Alerts", desc: "Automatic risk-based alerts connect you to your care team." },
  { icon: Shield, title: "Secure & Private", desc: "Role-based access and audit logs protect your health data." },
  { icon: BarChart3, title: "Adherence Analytics", desc: "Visualize your medication streaks and health trends." },
  { icon: Activity, title: "Side-Effect Detection", desc: "AI correlates symptoms with medications to detect patterns." },
];

const steps = [
  { num: "01", title: "Sign up", desc: "Create your account in seconds." },
  { num: "02", title: "Add medications", desc: "Enter your prescriptions and schedule." },
  { num: "03", title: "Track daily", desc: "Log intake and symptoms each day." },
  { num: "04", title: "Get AI insights", desc: "Receive personalized health recommendations." },
];

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="border-b border-border/50 bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <Activity className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>SignalRX</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild><Link to="/auth">Sign in</Link></Button>
            <Button asChild><Link to="/auth">Get Started</Link></Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-4 py-20 md:py-28 text-center max-w-3xl">
        <div className="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-sm font-medium px-3 py-1 rounded-full mb-6">
          <Activity className="h-3.5 w-3.5" /> AI-Powered Health Monitoring
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight mb-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Monitor medication adherence with{" "}
          <span className="text-primary">intelligent AI</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-8">
          SignalRX tracks your prescriptions, detects side-effect patterns, and connects you with your doctor when it matters most.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Button size="lg" asChild>
            <Link to="/auth">Start Free <ArrowRight className="ml-1 h-4 w-4" /></Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link to="/auth">Sign in</Link>
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-10" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Everything you need for smarter health tracking
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
          {features.map((f) => (
            <div key={f.title} className="group rounded-xl border border-border bg-card p-6 hover:shadow-md transition-shadow">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <f.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold text-base mb-1">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-muted/40 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            How it works
          </h2>
          <div className="grid gap-8 md:grid-cols-4 max-w-4xl mx-auto">
            {steps.map((s) => (
              <div key={s.num} className="text-center">
                <div className="text-3xl font-extrabold text-primary/20 mb-2">{s.num}</div>
                <h3 className="font-semibold mb-1">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Ready to take control of your health?
        </h2>
        <p className="text-muted-foreground mb-6">Join SignalRX today — it's free to get started.</p>
        <Button size="lg" asChild>
          <Link to="/auth">Create your account <ArrowRight className="ml-1 h-4 w-4" /></Link>
        </Button>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-6">
        <div className="container mx-auto px-4 flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary" />
            <span>SignalRX</span>
          </div>
          <span>© {new Date().getFullYear()} SignalRX. Prototype — synthetic data only.</span>
        </div>
      </footer>
    </div>
  );
}
