import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Activity, Pill, Brain, Bell, ArrowRight, Shield, BarChart3, Check, Star, ChevronDown, Zap, Sparkles } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import Footer from "@/components/Footer";
import AnimatedBackground from "@/components/ui/AnimatedBackground";
import MotionCard from "@/components/ui/MotionCard";

const features = [
  { icon: Pill, title: "Medication Tracking", desc: "Log daily intake and never miss a dose. Simple take/skip buttons make it effortless for patients of all ages." },
  { icon: Brain, title: "AI Health Assistant", desc: "24/7 conversational AI that understands your medications and symptoms. Get instant answers without calling the doctor." },
  { icon: Bell, title: "Doctor Alerts", desc: "Automatic risk-based alerts notify your care team when patterns indicate trouble — before emergencies happen." },
  { icon: Shield, title: "Secure & Private", desc: "Role-based access control, row-level security, and audit logs protect every piece of health data." },
  { icon: BarChart3, title: "Adherence Analytics", desc: "Visualize medication streaks, daily adherence rates, and health trends with interactive charts." },
  { icon: Zap, title: "Side-Effect Detection", desc: "AI correlates symptoms with medications to detect adverse reactions early and flag them for review." },
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
    quote: "MedPulse helped me catch a patient's dangerous non-adherence pattern before it led to hospitalization. The AI alerts are a game-changer.",
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
  { q: "Is my health data secure?", a: "Absolutely. MedPulse uses row-level security policies, role-based access control, and encrypted connections. Your data is only accessible to you and your authorized care team." },
  { q: "Can my doctor see my data?", a: "Only if they have a doctor account and you're in their patient list. Doctors can view your medication history, symptoms, and adherence analytics to provide better care." },
  { q: "How does the AI assistant work?", a: "Our AI assistant is powered by advanced language models trained on medical knowledge. It can answer questions about your medications, help interpret symptoms, and provide general health guidance." },
  { q: "Is MedPulse HIPAA compliant?", a: "MedPulse is designed with HIPAA compliance in mind. For production deployment with real patient data, we offer HIPAA-compliant infrastructure with BAA agreements." },
  { q: "Can I export my data?", a: "Yes. You can export your medication history, symptom logs, and adherence data in CSV format at any time. Your data belongs to you." },
];

const stagger = {
  container: { transition: { staggerChildren: 0.08 } },
  item: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  },
};

export default function Index() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <AnimatedBackground />

      {/* Nav */}
      <header className="border-b border-border/30 bg-background/60 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Activity className="h-4 w-4 text-primary" />
            </div>
            <span className="text-xl font-bold tracking-tight font-display">MedPulse</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            {["Features", "How It Works", "Pricing", "Testimonials", "FAQ"].map(item => (
              <a key={item} href={`#${item.toLowerCase().replace(/\s+/g, "-")}`} className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200">
                {item}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild className="text-muted-foreground"><Link to="/auth">Sign in</Link></Button>
            <Button asChild className="glow-primary"><Link to="/auth">Get Started</Link></Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-4 pt-24 pb-20 md:pt-32 md:pb-28 text-center max-w-4xl relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary text-sm font-medium px-4 py-1.5 rounded-full mb-8">
            <Sparkles className="h-3.5 w-3.5" /> AI-Powered Health Monitoring
          </div>
        </motion.div>
        
        <motion.h1
          className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6 font-display"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Monitor medication{" "}
          <br className="hidden md:block" />
          adherence with{" "}
          <span className="text-primary">intelligent AI</span>
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          MedPulse tracks your prescriptions, detects side-effect patterns, and connects you with your doctor when it matters most.
        </motion.p>

        <motion.div
          className="flex items-center justify-center gap-4 flex-wrap"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Button size="lg" asChild className="h-12 px-8 text-base glow-primary">
            <Link to="/auth">Start Free <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="h-12 px-8 text-base border-border/50 bg-card/50 backdrop-blur-sm">
            <Link to="/auth">Sign in</Link>
          </Button>
        </motion.div>

        <motion.div
          className="mt-10 flex items-center justify-center gap-8 text-sm text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-primary" /> Free to start</span>
          <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-primary" /> No credit card</span>
          <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-primary" /> RBAC security</span>
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="container mx-auto px-4 py-20">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-display">
            Everything you need for smarter health tracking
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            From medication logging to AI-powered insights, MedPulse gives patients and doctors the tools to improve health outcomes.
          </p>
        </motion.div>
        <motion.div
          className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto"
          variants={stagger.container}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          {features.map((f, i) => (
            <MotionCard key={f.title} delay={i * 0.08}>
              <div className="h-10 w-10 rounded-lg bg-primary/10 border border-primary/10 flex items-center justify-center mb-4">
                <f.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold text-base mb-2 font-display">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </MotionCard>
          ))}
        </motion.div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-card/30 to-transparent" />
        <div className="container mx-auto px-4 relative">
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-display">How it works</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">Get started in under 2 minutes. No complex setup required.</p>
          </motion.div>
          <div className="grid gap-8 md:grid-cols-4 max-w-4xl mx-auto">
            {steps.map((s, i) => (
              <motion.div
                key={s.num}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="text-4xl font-bold text-primary/20 mb-3 font-display">{s.num}</div>
                <h3 className="font-semibold mb-1 font-display">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="container mx-auto px-4 py-20">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-display">Simple, transparent pricing</h2>
          <p className="text-muted-foreground max-w-lg mx-auto">Start free and upgrade as you grow. No hidden fees.</p>
        </motion.div>
        <div className="grid gap-5 md:grid-cols-3 max-w-4xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className={`relative h-full ${plan.highlight ? "border-primary/50 glow-primary" : "border-border/50"}`}>
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full">
                    Most Popular
                  </div>
                )}
                <CardContent className="p-6 space-y-5">
                  <div>
                    <h3 className="font-bold text-lg font-display">{plan.name}</h3>
                    <p className="text-sm text-muted-foreground">{plan.desc}</p>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold font-display">{plan.price}</span>
                    <span className="text-sm text-muted-foreground">{plan.period}</span>
                  </div>
                  <ul className="space-y-2.5">
                    {plan.features.map(f => (
                      <li key={f} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-primary shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Button className={`w-full ${plan.highlight ? "glow-primary" : ""}`} variant={plan.highlight ? "default" : "outline"} asChild>
                    <Link to="/auth">{plan.cta}</Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-card/30 to-transparent" />
        <div className="container mx-auto px-4 relative">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-center mb-14 font-display"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Trusted by patients and doctors
          </motion.h2>
          <div className="grid gap-5 md:grid-cols-3 max-w-5xl mx-auto">
            {testimonials.map((t, i) => (
              <MotionCard key={t.name} delay={i * 0.1} className="space-y-4">
                <div className="flex gap-0.5">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">"{t.quote}"</p>
                <div>
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </MotionCard>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="container mx-auto px-4 py-20">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-center mb-14 font-display"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Frequently asked questions
        </motion.h2>
        <div className="max-w-2xl mx-auto space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <button
                className="w-full flex items-center justify-between p-5 text-left group"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <span className="font-medium text-sm group-hover:text-primary transition-colors">{faq.q}</span>
                <motion.div animate={{ rotate: openFaq === i ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </motion.div>
              </button>
              <motion.div
                initial={false}
                animate={{ height: openFaq === i ? "auto" : 0, opacity: openFaq === i ? 1 : 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">
                  {faq.a}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-24 text-center relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-display">
            Ready to take control of your health?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Join thousands of patients and doctors using MedPulse to improve medication outcomes.
          </p>
          <Button size="lg" asChild className="h-12 px-8 text-base glow-primary">
            <Link to="/auth">Create your account <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
