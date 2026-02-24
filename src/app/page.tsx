"use client";

import { ArrowRight, ExternalLink, Shield, Code2, ChevronRight,
         Home as HomeIcon, Building2, BarChart3, Check, Star, Lock, Server, Zap,
         Mail, Github, Twitter, Linkedin } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import Logo from "@/components/Logo";

/* ─── animation helpers ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" as const } },
};

/* ─── typewriter effect ─── */
function TypewriterText({
  text,
  delay = 0,
  speed = 50,
  className = ""
}: {
  text: string;
  delay?: number;
  speed?: number;
  className?: string;
}) {
  const [displayText, setDisplayText] = useState("");
  const [startTyping, setStartTyping] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setStartTyping(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    if (!startTyping) return;

    let i = 0;
    const typingTimer = setInterval(() => {
      if (i < text.length) {
        setDisplayText(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(typingTimer);
      }
    }, speed);

    return () => clearInterval(typingTimer);
  }, [startTyping, text, speed]);

  return (
    <span className={className}>
      {displayText}
      <motion.span
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="inline-block"
      >
        |
      </motion.span>
    </span>
  );
}


/* ─── main page ─── */
export default function Home() {
  const [emailInput, setEmailInput] = useState("");

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter signup
    console.log("Newsletter signup:", emailInput);
    setEmailInput("");
  };

  return (
    <main className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Navigation */}
      <Navigation variant="default" />

      {/* Subtle background pattern */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }} />
      </div>

      {/* Hero Section with Animated Gradient Text */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={stagger}
        className="relative pt-[140px] pb-[120px] px-6 max-w-[1000px] mx-auto"
      >
        {/* Logo showcase */}
        <motion.div
          variants={fadeUp}
          className="flex justify-center mb-12"
        >
          <Logo size="lg" className="h-16 w-auto" />
        </motion.div>

        <motion.h1
          variants={fadeUp}
          className="text-[clamp(48px,8vw,88px)] font-bold tracking-[-0.04em] leading-[1.02] mb-8 text-center font-[family-name:var(--font-display)]"
        >
          AI agents that run
          <br />
          <span className="bg-gradient-to-r from-[#FF6B35] via-[#ff8c5a] to-[#ffa366] bg-clip-text text-transparent">
            <TypewriterText text="on your hardware" delay={1000} speed={80} />
          </span>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="text-xl text-[#888] max-w-[600px] mx-auto text-center leading-relaxed mb-12"
        >
          Deploy autonomous AI agents powered by open-source models. No cloud dependencies.
          Complete privacy. Your data never leaves your building.
        </motion.p>

        <motion.div
          variants={fadeUp}
          className="flex gap-4 justify-center flex-wrap"
        >
          <motion.a
            href="/signup"
            whileHover={{ scale: 1.02, boxShadow: "0 20px 40px rgba(255, 107, 53, 0.3)" }}
            whileTap={{ scale: 0.98 }}
            className="bg-gradient-to-r from-[#FF6B35] to-[#e55a24] text-white px-8 py-4 rounded-xl font-medium inline-flex items-center gap-2 shadow-xl shadow-[#FF6B35]/20 border border-white/10"
          >
            Get Started <ArrowRight size={18} />
          </motion.a>
          <motion.a
            href="#products"
            whileHover={{ scale: 1.02, backgroundColor: "#1a1a1a" }}
            whileTap={{ scale: 0.98 }}
            className="border border-[#333] text-white px-8 py-4 rounded-xl font-medium hover:border-[#555] transition-all backdrop-blur-sm"
          >
            Learn More
          </motion.a>
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          variants={fadeUp}
          className="flex justify-center items-center gap-8 mt-16 text-sm text-[#666]"
        >
          <div className="flex items-center gap-2">
            <Shield size={16} className="text-[#FF6B35]" />
            Privacy First
          </div>
          <div className="flex items-center gap-2">
            <Code2 size={16} className="text-[#FF6B35]" />
            Open Source
          </div>
          <div className="flex items-center gap-2">
            <Server size={16} className="text-[#FF6B35]" />
            Local Deployment
          </div>
        </motion.div>
      </motion.section>

      {/* Enhanced Product Cards Section */}
      <section id="products" className="py-24 px-6 bg-[#0a0a0a] border-t border-[#1a1a1a]">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="max-w-[1200px] mx-auto"
        >
          <motion.div variants={fadeUp} className="text-center mb-20">
            <p className="text-sm text-[#FF6B35] uppercase tracking-[0.15em] mb-6 font-medium">Products</p>
            <h2 className="text-[clamp(36px,6vw,56px)] font-bold tracking-[-0.03em] mb-6 font-[family-name:var(--font-display)]">
              Three products.
              <br />
              <span className="text-[#666]">One philosophy.</span>
            </h2>
            <p className="text-lg text-[#888] max-w-[600px] mx-auto">
              AI solutions that respect your privacy while delivering enterprise-grade automation
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <HomeIcon size={32} className="text-[#FF6B35]" />,
                category: "Spaces",
                name: "HabaCasa",
                description: "Smart environments that manage themselves. Homes, offices, and factories with integrated AI automation.",
                features: ["Voice control", "Energy optimization", "Predictive maintenance", "Privacy by design"],
                link: "https://ai.haba.casa",
                external: true,
                color: "from-green-500/20 to-emerald-500/20",
                badge: "Available Now"
              },
              {
                icon: <Building2 size={32} className="text-[#FF6B35]" />,
                category: "Business",
                name: "AI Agency",
                description: "Autonomous agents for operations. Customer support, scheduling, and complex workflows that run 24/7.",
                features: ["Multi-channel support", "Workflow automation", "Integration ready", "Scalable deployment"],
                link: "#",
                external: false,
                color: "from-blue-500/20 to-cyan-500/20",
                badge: "Coming Soon"
              },
              {
                icon: <BarChart3 size={32} className="text-[#FF6B35]" />,
                category: "Analytics",
                name: "Edge Analytics",
                description: "Real-time insights and predictive analytics. Process data locally with enterprise-grade security.",
                features: ["Real-time processing", "Custom dashboards", "Predictive models", "API integrations"],
                link: "#",
                external: false,
                color: "from-purple-500/20 to-pink-500/20",
                badge: "Beta"
              }
            ].map((product, i) => (
              <motion.div
                key={product.name}
                variants={scaleIn}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative bg-gradient-to-br from-[#111] to-[#0a0a0a] rounded-2xl border border-[#1a1a1a] p-8 hover:border-[#FF6B35]/30 transition-all duration-500 overflow-hidden"
              >
                {/* Background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${product.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                <div className="relative z-10">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-[#1a1a1a] rounded-xl flex items-center justify-center group-hover:bg-[#FF6B35]/10 transition-colors">
                        {product.icon}
                      </div>
                      <div>
                        <span className="text-xs text-[#888] uppercase tracking-[0.1em] block mb-1">{product.category}</span>
                        <span className={`text-xs px-3 py-1 rounded-full ${
                          product.badge === "Available Now" ? "bg-green-500/20 text-green-400" :
                          product.badge === "Beta" ? "bg-yellow-500/20 text-yellow-400" :
                          "bg-blue-500/20 text-blue-400"
                        }`}>
                          {product.badge}
                        </span>
                      </div>
                    </div>
                    {product.external && (
                      <ExternalLink size={16} className="text-[#444] group-hover:text-[#FF6B35] transition-colors" />
                    )}
                  </div>

                  <h3 className="text-2xl font-bold mb-4 group-hover:text-[#FF6B35] transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-[15px] text-[#ccc] leading-relaxed mb-6">
                    {product.description}
                  </p>

                  {/* Features */}
                  <ul className="space-y-2 mb-8">
                    {product.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-3 text-sm text-[#888]">
                        <Check size={14} className="text-[#FF6B35] flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <motion.a
                    href={product.link}
                    {...(product.external && { target: "_blank", rel: "noopener noreferrer" })}
                    whileHover={{ x: 4 }}
                    className="inline-flex items-center gap-2 text-sm text-[#FF6B35] font-medium group-hover:text-white transition-colors"
                  >
                    {product.external ? "Explore" : "Learn More"}
                    <ChevronRight size={14} />
                  </motion.a>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* How It Works - 3 Step Visual */}
      <section className="py-24 px-6 border-t border-[#1a1a1a]">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="max-w-[1000px] mx-auto"
        >
          <motion.div variants={fadeUp} className="text-center mb-20">
            <p className="text-sm text-[#FF6B35] uppercase tracking-[0.15em] mb-6 font-medium">How It Works</p>
            <h2 className="text-[clamp(36px,6vw,48px)] font-bold tracking-[-0.03em] mb-6 font-[family-name:var(--font-display)]">
              Deploy in minutes.
              <br />
              <span className="text-[#666]">Scale with confidence.</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connection lines */}
            <div className="hidden md:block absolute top-1/2 left-1/3 right-1/3 h-px bg-gradient-to-r from-[#FF6B35]/50 via-[#FF6B35] to-[#FF6B35]/50 transform -translate-y-1/2 z-0" />

            {[
              {
                step: "01",
                title: "Sign Up",
                description: "Create your Edge AI account and choose your deployment plan",
                icon: <Mail size={24} className="text-[#FF6B35]" />
              },
              {
                step: "02",
                title: "Deploy Edge Device",
                description: "Install our lightweight agent on your hardware or cloud infrastructure",
                icon: <Server size={24} className="text-[#FF6B35]" />
              },
              {
                step: "03",
                title: "AI Runs Locally",
                description: "Your autonomous agents start working immediately with complete privacy",
                icon: <Zap size={24} className="text-[#FF6B35]" />
              }
            ].map((step, i) => (
              <motion.div
                key={step.step}
                variants={fadeUp}
                className="relative z-10 text-center"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="w-16 h-16 bg-gradient-to-r from-[#FF6B35] to-[#e55a24] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-[#FF6B35]/30"
                >
                  {step.icon}
                </motion.div>
                <div className="mb-4">
                  <span className="text-xs text-[#666] font-mono block mb-2">{step.step}</span>
                  <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                  <p className="text-[15px] text-[#888] leading-relaxed max-w-[280px] mx-auto">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Trust/Security Section */}
      <section className="py-24 px-6 bg-[#0a0a0a] border-t border-[#1a1a1a]">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="max-w-[1000px] mx-auto text-center"
        >
          <motion.div variants={fadeUp} className="mb-12">
            <div className="w-20 h-20 bg-gradient-to-r from-[#FF6B35] to-[#e55a24] rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-[#FF6B35]/30">
              <Lock size={32} className="text-white" />
            </div>
            <h2 className="text-[clamp(32px,5vw,44px)] font-bold tracking-[-0.03em] mb-6 font-[family-name:var(--font-display)]">
              Your data never
              <br />
              <span className="text-[#FF6B35]">leaves your building</span>
            </h2>
            <p className="text-lg text-[#888] max-w-[600px] mx-auto leading-relaxed">
              Complete privacy by design. All processing happens locally on your infrastructure.
              No external API calls. No data collection. No exceptions.
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16"
          >
            {[
              {
                icon: <Shield size={24} className="text-[#FF6B35]" />,
                title: "Zero External Dependencies",
                description: "Models run entirely on your hardware with no internet requirements"
              },
              {
                icon: <Lock size={24} className="text-[#FF6B35]" />,
                title: "Enterprise Security",
                description: "Bank-level encryption and security standards built into every component"
              },
              {
                icon: <Server size={24} className="text-[#FF6B35]" />,
                title: "Air-Gap Compatible",
                description: "Deploy in completely isolated networks without compromising functionality"
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="p-6 bg-[#111] rounded-xl border border-[#1a1a1a] hover:border-[#FF6B35]/30 transition-colors"
              >
                <div className="w-12 h-12 bg-[#1a1a1a] rounded-lg flex items-center justify-center mx-auto mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-semibold mb-3">{feature.title}</h3>
                <p className="text-sm text-[#888] leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Testimonials/Social Proof */}
      <section className="py-24 px-6 border-t border-[#1a1a1a]">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="max-w-[1200px] mx-auto"
        >
          <motion.div variants={fadeUp} className="text-center mb-20">
            <p className="text-sm text-[#FF6B35] uppercase tracking-[0.15em] mb-6 font-medium">Trusted By</p>
            <h2 className="text-[clamp(32px,5vw,44px)] font-bold tracking-[-0.03em] mb-6 font-[family-name:var(--font-display)]">
              Trusted by <span className="text-[#FF6B35]">500+</span> environments
            </h2>
            <p className="text-lg text-[#888] max-w-[600px] mx-auto">
              From smart homes to enterprise factories, organizations trust Edge AI for mission-critical automation
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                quote: "Edge AI transformed our smart building management. 40% energy savings in the first quarter.",
                author: "Sarah Chen",
                role: "Facilities Director",
                company: "TechCorp",
                avatar: "SC",
                rating: 5
              },
              {
                quote: "The privacy-first approach was exactly what we needed. Our data stays secure while AI does the heavy lifting.",
                author: "Michael Torres",
                role: "Security Chief",
                company: "DataSafe Inc",
                avatar: "MT",
                rating: 5
              },
              {
                quote: "Deployment was surprisingly simple. Our customer support is now 24/7 automated while maintaining quality.",
                author: "Alex Kim",
                role: "Operations VP",
                company: "StartupXYZ",
                avatar: "AK",
                rating: 5
              }
            ].map((testimonial, i) => (
              <motion.div
                key={i}
                variants={scaleIn}
                whileHover={{ y: -4 }}
                className="bg-[#0a0a0a] p-8 rounded-xl border border-[#1a1a1a] hover:border-[#FF6B35]/30 transition-all"
              >
                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, idx) => (
                    <Star key={idx} size={14} className="text-[#FF6B35] fill-current" />
                  ))}
                </div>

                <p className="text-[15px] text-[#ccc] leading-relaxed mb-6 italic">
                  "{testimonial.quote}"
                </p>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-[#FF6B35] to-[#e55a24] rounded-full flex items-center justify-center text-sm font-bold text-white">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{testimonial.author}</p>
                    <p className="text-xs text-[#666]">{testimonial.role}, {testimonial.company}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Pricing Preview */}
      <section className="py-24 px-6 bg-[#0a0a0a] border-t border-[#1a1a1a]">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="max-w-[1000px] mx-auto"
        >
          <motion.div variants={fadeUp} className="text-center mb-20">
            <p className="text-sm text-[#FF6B35] uppercase tracking-[0.15em] mb-6 font-medium">Pricing</p>
            <h2 className="text-[clamp(32px,5vw,44px)] font-bold tracking-[-0.03em] mb-6 font-[family-name:var(--font-display)]">
              Simple, transparent pricing
            </h2>
            <p className="text-lg text-[#888] max-w-[600px] mx-auto">
              Choose the plan that fits your needs. All plans include local deployment and full privacy.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Starter",
                price: "$99",
                period: "/month",
                description: "Perfect for small teams and personal projects",
                features: [
                  "Up to 5 agents",
                  "Basic integrations",
                  "Email support",
                  "Local deployment",
                  "Open source models"
                ],
                cta: "Start Free Trial",
                popular: false
              },
              {
                name: "Pro",
                price: "$299",
                period: "/month",
                description: "For growing businesses and advanced automation",
                features: [
                  "Unlimited agents",
                  "Advanced integrations",
                  "Priority support",
                  "Custom models",
                  "API access",
                  "Analytics dashboard"
                ],
                cta: "Start Free Trial",
                popular: true
              },
              {
                name: "Enterprise",
                price: "Custom",
                period: "",
                description: "For large organizations with complex requirements",
                features: [
                  "Everything in Pro",
                  "Dedicated support",
                  "Custom integrations",
                  "SLA guarantees",
                  "Training & onboarding",
                  "Advanced security"
                ],
                cta: "Contact Sales",
                popular: false
              }
            ].map((plan, i) => (
              <motion.div
                key={plan.name}
                variants={scaleIn}
                className={`relative p-8 rounded-2xl border transition-all ${
                  plan.popular
                    ? "border-[#FF6B35] bg-gradient-to-b from-[#FF6B35]/5 to-transparent scale-105"
                    : "border-[#1a1a1a] bg-[#111] hover:border-[#333]"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-[#FF6B35] to-[#e55a24] text-white text-sm px-4 py-2 rounded-full font-medium">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                  <div className="flex items-end justify-center gap-1 mb-2">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    {plan.period && <span className="text-[#666] mb-1">{plan.period}</span>}
                  </div>
                  <p className="text-sm text-[#888]">{plan.description}</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <Check size={16} className="text-[#FF6B35] flex-shrink-0" />
                      <span className="text-sm text-[#ccc]">{feature}</span>
                    </li>
                  ))}
                </ul>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-3 px-6 rounded-xl font-medium transition-all ${
                    plan.popular
                      ? "bg-gradient-to-r from-[#FF6B35] to-[#e55a24] text-white shadow-lg shadow-[#FF6B35]/20"
                      : "bg-[#1a1a1a] text-white border border-[#333] hover:bg-[#222]"
                  }`}
                >
                  {plan.cta}
                </motion.button>
              </motion.div>
            ))}
          </div>

          <motion.p variants={fadeUp} className="text-center text-sm text-[#666] mt-12">
            All plans include 30-day free trial • No setup fees • Cancel anytime
          </motion.p>
        </motion.div>
      </section>

      {/* Enhanced Footer with Newsletter */}
      <footer className="py-16 px-6 border-t border-[#1a1a1a]">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="max-w-[1200px] mx-auto"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <motion.div variants={fadeUp} className="md:col-span-1">
              <Logo size="md" className="mb-6" />
              <p className="text-sm text-[#888] leading-relaxed mb-6">
                AI agents that respect your privacy while delivering enterprise automation.
              </p>
              <div className="flex gap-4">
                {[
                  { icon: <Github size={18} />, href: "https://github.com/haba-create", label: "GitHub" },
                  { icon: <Twitter size={18} />, href: "#", label: "Twitter" },
                  { icon: <Linkedin size={18} />, href: "#", label: "LinkedIn" }
                ].map((social, i) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    whileHover={{ scale: 1.1, y: -2 }}
                    className="w-10 h-10 bg-[#1a1a1a] rounded-lg flex items-center justify-center text-[#666] hover:text-[#FF6B35] hover:bg-[#222] transition-all"
                    aria-label={social.label}
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Products */}
            <motion.div variants={fadeUp}>
              <h4 className="font-semibold mb-6">Products</h4>
              <ul className="space-y-3">
                {["HabaCasa", "AI Agency", "Edge Analytics"].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm text-[#888] hover:text-white transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Company */}
            <motion.div variants={fadeUp}>
              <h4 className="font-semibold mb-6">Company</h4>
              <ul className="space-y-3">
                {["About", "Architecture", "Security", "Contact"].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm text-[#888] hover:text-white transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Newsletter */}
            <motion.div variants={fadeUp}>
              <h4 className="font-semibold mb-6">Stay Updated</h4>
              <p className="text-sm text-[#888] mb-4">
                Get the latest updates on Edge AI development and releases.
              </p>
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col gap-3">
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="Enter your email"
                  className="bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-[#FF6B35]/50 focus:ring-1 focus:ring-[#FF6B35]/20 placeholder:text-[#555]"
                  required
                />
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-gradient-to-r from-[#FF6B35] to-[#e55a24] text-white py-3 px-4 rounded-lg font-medium transition-all shadow-lg shadow-[#FF6B35]/20"
                >
                  Subscribe
                </motion.button>
              </form>
            </motion.div>
          </div>

          {/* Bottom bar */}
          <motion.div
            variants={fadeUp}
            className="pt-8 border-t border-[#1a1a1a] flex flex-col md:flex-row justify-between items-center gap-4"
          >
            <p className="text-xs text-[#666]">
              © {new Date().getFullYear()} Edge-AI LTD. All rights reserved.
            </p>
            <div className="flex gap-6">
              {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((item) => (
                <a key={item} href="#" className="text-xs text-[#666] hover:text-white transition-colors">
                  {item}
                </a>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </footer>


      {/* Custom scrollbar styles */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #333;
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}</style>
    </main>
  );
}