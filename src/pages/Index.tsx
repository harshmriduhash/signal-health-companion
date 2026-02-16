import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Activity, Pill, Brain, Bell, ArrowRight, Shield, BarChart3, Check, Star, ChevronDown } from "lucide-react";
import { useState } from "react";
import Footer from "@/components/Footer";

const features = [
  { icon: Pill, title: "Medication Tracking", desc: "Log daily intake and never miss a dose. Simple take/skip buttons make it effortless for patients of all ages." },
  { icon: Brain, title: "AI Health Assistant", desc: "24/7 conversational AI that understands your medications and symptoms. Get instant answers without calling the doctor." },
  { icon: Bell, title: "Doctor Alerts", desc: "Automatic risk-based alerts notify your care team when patterns indicate trouble — before emergencies happen." },
  { icon: Shield, title: "Secure & Private", desc: "Role-based access control, row-level security, and audit logs protect every piece of health data." },
  { icon: BarChart3, title: "Adherence Analytics", desc: "Visualize medication streaks, daily adherence rates, and health trends with interactive charts." },
  { icon: Activity, title: "Side-Effect Detection", desc: "AI correlates symptoms with medications to detect adverse reactions early and flag them for review." },
];

const steps = [
  { num: "01", title: "Sign up", desc: "Create your account in seconds with just an email and password." },
  { num: "02", title: "Add medications", desc: "Enter your prescriptions with dosage and schedule information." },
  { num: "03", title: "Track daily", desc: "Log your medication intake and any symptoms each day with two taps." },
  { num: "04", title: "Get AI insights", desc: "Receive personalized recommendations and keep your doctor informed automatically." },
];

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    desc: "For individual patients getting started",
    features: ["Up to 5 medications", "Daily tracking", "Basic symptom log", "AI chat (10 messages/day)"],
    cta: "Get Started Free",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$9",
    period: "/month",
    desc: "For patients who want full AI insights",
    features: ["Unlimited medications", "Advanced analytics", "Unlimited AI chat", "Side-effect detection", "Priority support"],
    cta: "Start Pro Trial",
    highlight: true,
  },
  {
    name: "Clinic",
    price: "$49",
    period: "/month",
    desc: "For doctors and small practices",
    features: ["Up to 50 patients", "Doctor dashboard", "Alert management", "Patient detail views", "Adherence charts", "Audit logs"],
    cta: "Contact Sales",
    highlight: false,
  },
];

const testimonials = [
  {
    quote: "SignalRX helped me catch a patient's dangerous non-adherence pattern before it led to hospitalization. The AI alerts are a game-changer.",
    name: "Dr. Sarah Chen",
    role: "Internal Medicine, Stanford Health",
    rating: 5,
  },
  {
    quote: "I used to forget my medications all the time. Now the tracking is so simple that I haven't missed a dose in 3 months.",
    name: "Michael Torres",
    role: "Patient, Type 2 Diabetes",
    rating: 5,
  },
  {
    quote: "The AI assistant correctly identified that my headaches were a side effect of my new prescription. Saved me weeks of confusion.",
    name: "Linda Patel",
    role: "Patient, Hypertension",
    rating: 5,
  },
];

const faqs = [
  {
    q: "Is my health data secure?",
    a: "Absolutely. SignalRX uses row-level security policies, role-based access control, and encrypted connections. Your data is only accessible to you and your authorized care team.",
  },
  {
    q: "Can my doctor see my data?",
    a: "Only if they have a doctor account and you're in their patient list. Doctors can view your medication history, symptoms, and adherence analytics to provide better care.",
  },
  {
    q: "How does the AI assistant work?",
    a: "Our AI assistant is powered by advanced language models trained on medical knowledge. It can answer questions about your medications, help interpret symptoms, and provide general health guidance. It's not a replacement for your doctor — think of it as a knowledgeable health companion.",
  },
  {
    q: "Is SignalRX HIPAA compliant?",
    a: "SignalRX is currently in prototype stage with synthetic data. For production deployment with real patient data, we offer HIPAA-compliant infrastructure with BAA agreements for healthcare organizations.",
  },
  {
    q: "Can I export my data?",
    a: "Yes. You can export your medication history, symptom logs, and adherence data in CSV format at any time. Your data belongs to you.",
  },
];

export default function Index() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="border-b border-border/50 bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <Activity className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold tracking-tight font-display">SignalRX</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">How It Works</a>
            <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
            <a href="#testimonials" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Testimonials</a>
            <a href="#faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">FAQ</a>
          </nav>
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
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight mb-6 font-display">
          Monitor medication adherence with{" "}
          <span className="text-primary">intelligent AI</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-8">
          SignalRX tracks your prescriptions, detects side-effect patterns, and connects you with your doctor when it matters most. Reducing the $300B medication non-adherence crisis, one patient at a time.
        </p>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <Button size="lg" asChild>
            <Link to="/auth">Start Free <ArrowRight className="ml-1 h-4 w-4" /></Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link to="/auth">Sign in</Link>
          </Button>
        </div>
        <div className="mt-8 flex items-center justify-center gap-6 text-sm text-muted-foreground">
          <span className="flex items-center gap-1"><Check className="h-4 w-4 text-success" /> Free to start</span>
          <span className="flex items-center gap-1"><Check className="h-4 w-4 text-success" /> No credit card</span>
          <span className="flex items-center gap-1"><Check className="h-4 w-4 text-success" /> RBAC security</span>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="container mx-auto px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-3 font-display">
          Everything you need for smarter health tracking
        </h2>
        <p className="text-center text-muted-foreground mb-10 max-w-xl mx-auto">
          From medication logging to AI-powered insights, SignalRX gives patients and doctors the tools to improve health outcomes.
        </p>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
          {features.map((f) => (
            <div key={f.title} className="group rounded-xl border border-border bg-card p-6 hover:shadow-md transition-shadow">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <f.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold text-base mb-1">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="bg-muted/40 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-3 font-display">
            How it works
          </h2>
          <p className="text-center text-muted-foreground mb-10 max-w-lg mx-auto">
            Get started in under 2 minutes. No complex setup required.
          </p>
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

      {/* Pricing */}
      <section id="pricing" className="container mx-auto px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-3 font-display">
          Simple, transparent pricing
        </h2>
        <p className="text-center text-muted-foreground mb-10 max-w-lg mx-auto">
          Start free and upgrade as you grow. No hidden fees.
        </p>
        <div className="grid gap-6 md:grid-cols-3 max-w-4xl mx-auto">
          {plans.map(plan => (
            <Card key={plan.name} className={`relative ${plan.highlight ? "border-primary shadow-lg shadow-primary/10" : ""}`}>
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full">
                  Most Popular
                </div>
              )}
              <CardContent className="p-6 space-y-4">
                <div>
                  <h3 className="font-bold text-lg">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground">{plan.desc}</p>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-sm text-muted-foreground">{plan.period}</span>
                </div>
                <ul className="space-y-2">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-success shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button className="w-full" variant={plan.highlight ? "default" : "outline"} asChild>
                  <Link to="/auth">{plan.cta}</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="bg-muted/40 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 font-display">
            Trusted by patients and doctors
          </h2>
          <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
            {testimonials.map(t => (
              <Card key={t.name}>
                <CardContent className="p-6 space-y-4">
                  <div className="flex gap-0.5">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-warning text-warning" />
                    ))}
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">"{t.quote}"</p>
                  <div>
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="container mx-auto px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 font-display">
          Frequently asked questions
        </h2>
        <div className="max-w-2xl mx-auto space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="rounded-lg border border-border bg-card">
              <button
                className="w-full flex items-center justify-between p-4 text-left"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <span className="font-medium text-sm">{faq.q}</span>
                <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
              </button>
              {openFaq === i && (
                <div className="px-4 pb-4 text-sm text-muted-foreground leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 font-display">
          Ready to take control of your health?
        </h2>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          Join thousands of patients and doctors using SignalRX to improve medication outcomes. Free to get started.
        </p>
        <Button size="lg" asChild>
          <Link to="/auth">Create your account <ArrowRight className="ml-1 h-4 w-4" /></Link>
        </Button>
      </section>

      <Footer />
    </div>
  );
}
