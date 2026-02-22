"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" },
  }),
};

const agents = [
  {
    name: "Gateway Agent",
    location: "edge-ai.space",
    color: "#FF6B35",
    icon: "🚀",
    role: "First contact. Understands what visitors need, qualifies leads, and routes them to the right product agent — with full context.",
  },
  {
    name: "Sales Agent",
    location: "haba.casa",
    color: "#4A9FF5",
    icon: "💼",
    role: "Deep product knowledge. Handles pricing, demos, and conversions. Picks up exactly where the Gateway left off — no repeated questions.",
  },
  {
    name: "Support Agent",
    location: "haba.casa",
    color: "#34D399",
    icon: "🛠️",
    role: "Technical troubleshooting, feature updates, and proactive health checks. Can communicate directly with a customer's personal agent.",
  },
  {
    name: "Andrita (Personal)",
    location: "Customer's premises",
    color: "#A78BFA",
    icon: "✨",
    role: "The customer's own AI. Manages their environment, learns their routines, stores their data locally. The agent that truly knows them.",
  },
  {
    name: "Business Analytics",
    location: "Internal",
    color: "#FBBF24",
    icon: "📊",
    role: "Full visibility across the customer journey — conversion rates, support patterns, fleet health. Drives product decisions.",
  },
];

const journey = [
  {
    step: 1,
    title: "Discovery",
    desc: "A visitor lands on edge-ai.space. The Gateway Agent engages, understands their needs, and identifies the right product.",
    agent: "Gateway Agent",
    color: "#FF6B35",
  },
  {
    step: 2,
    title: "Handover",
    desc: "Context is seamlessly passed — name, interests, budget signals, conversation summary. The visitor never repeats themselves.",
    agent: "Orchestrator",
    color: "#F472B6",
  },
  {
    step: 3,
    title: "Sales & Conversion",
    desc: "The Sales Agent picks up naturally. Walks through pricing, schedules demos, handles objections. Knows everything already discussed.",
    agent: "Sales Agent",
    color: "#4A9FF5",
  },
  {
    step: 4,
    title: "Onboarding",
    desc: "On purchase, a Jetson device ships pre-configured. The customer's own Andrita agent activates, set up with preferences learned during sales.",
    agent: "Andrita",
    color: "#A78BFA",
  },
  {
    step: 5,
    title: "Living With It",
    desc: "Andrita manages their space daily — lights, heating, cameras, energy. All data stays local. The home just works.",
    agent: "Andrita",
    color: "#A78BFA",
  },
  {
    step: 6,
    title: "Ongoing Support",
    desc: "The Support Agent can reach out to a customer's Andrita — with consent — to push updates, diagnose issues, or suggest improvements.",
    agent: "Support Agent",
    color: "#34D399",
  },
];

export default function ArchitecturePage() {
  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white overflow-hidden">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-xl bg-[#0a0a0f]/80 border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
            <span className="text-[#FF6B35]">◆</span> Edge AI
          </Link>
          <Link href="/" className="text-sm text-white/50 hover:text-white transition">
            ← Back to Home
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-[#FF6B35] text-sm font-medium tracking-wider uppercase mb-4">
              Architecture
            </p>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              Agents that work{" "}
              <span className="bg-gradient-to-r from-[#FF6B35] to-[#FF8A5B] bg-clip-text text-transparent">
                together.
              </span>
            </h1>
            <p className="text-lg text-white/60 max-w-2xl mx-auto leading-relaxed">
              From first click to daily life — a seamless ecosystem of AI agents
              that route, sell, support, and manage. No customer ever repeats
              themselves. No agent ever works alone.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Architecture Diagram */}
      <section className="pb-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="relative rounded-2xl border border-white/10 bg-white/[0.02] p-8 md:p-12 backdrop-blur-sm"
          >
            {/* Cloud Layer */}
            <div className="mb-12">
              <p className="text-xs font-medium text-white/30 uppercase tracking-wider mb-6">
                ☁️ Platform Agents — Edge-AI Cloud (Railway)
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {agents.slice(0, 3).map((agent, i) => (
                  <motion.div
                    key={agent.name}
                    custom={i}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeUp}
                    className="rounded-xl border border-white/10 bg-white/[0.03] p-5 hover:bg-white/[0.06] transition"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">{agent.icon}</span>
                      <div>
                        <h3 className="font-semibold text-sm">{agent.name}</h3>
                        <p className="text-xs" style={{ color: agent.color }}>
                          {agent.location}
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-white/50 leading-relaxed">
                      {agent.role}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Arrow */}
            <div className="flex justify-center my-6">
              <div className="flex flex-col items-center gap-2">
                <div className="w-px h-8 bg-gradient-to-b from-[#FF6B35]/50 to-[#A78BFA]/50" />
                <div className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-white/40">
                  Orchestrator — Routes, passes context, logs everything
                </div>
                <div className="w-px h-8 bg-gradient-to-b from-[#A78BFA]/50 to-transparent" />
              </div>
            </div>

            {/* Edge Layer */}
            <div className="mb-8">
              <p className="text-xs font-medium text-white/30 uppercase tracking-wider mb-6">
                🏠 Edge Agent — Customer&apos;s Premises (Jetson)
              </p>
              <motion.div
                custom={4}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="rounded-xl border border-[#A78BFA]/20 bg-[#A78BFA]/[0.04] p-6 max-w-lg mx-auto"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">✨</span>
                  <div>
                    <h3 className="font-semibold">Andrita — Personal AI Agent</h3>
                    <p className="text-xs text-[#A78BFA]">
                      Runs locally • Data never leaves
                    </p>
                  </div>
                </div>
                <p className="text-sm text-white/50 leading-relaxed mb-4">
                  {agents[3].role}
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Home Automation",
                    "Voice Control",
                    "Security",
                    "Energy",
                    "Routines",
                    "Local Qdrant DB",
                  ].map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-full bg-[#A78BFA]/10 text-[#A78BFA] text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Sync Layer */}
            <div className="flex justify-center">
              <div className="px-6 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-center">
                <p className="text-xs text-white/30 uppercase tracking-wider mb-1">
                  Federated Sync
                </p>
                <p className="text-sm text-white/50">
                  Anonymised learnings only — every 6h — personal data never
                  leaves the premises
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Customer Journey */}
      <section className="pb-24 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              The Customer Journey
            </h2>
            <p className="text-white/50 max-w-xl mx-auto">
              From curious visitor to a home that runs itself — every step
              handled by the right agent, with full context.
            </p>
          </motion.div>

          <div className="space-y-6">
            {journey.map((step, i) => (
              <motion.div
                key={step.step}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="flex gap-6 items-start"
              >
                <div
                  className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg text-white"
                  style={{
                    background: `linear-gradient(135deg, ${step.color}, ${step.color}88)`,
                    boxShadow: `0 4px 16px ${step.color}33`,
                  }}
                >
                  {step.step}
                </div>
                <div className="flex-1 pb-6 border-b border-white/5">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-lg">{step.title}</h3>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{
                        background: `${step.color}15`,
                        color: step.color,
                      }}
                    >
                      {step.agent}
                    </span>
                  </div>
                  <p className="text-white/50 leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Agent-to-Agent Communication */}
      <section className="pb-24 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Agent-to-Agent{" "}
              <span className="bg-gradient-to-r from-[#34D399] to-[#A78BFA] bg-clip-text text-transparent">
                Synergy
              </span>
            </h2>
            <p className="text-white/50 max-w-xl mx-auto">
              Your personal Andrita isn&apos;t isolated. It&apos;s part of a network —
              getting smarter, getting updates, getting help.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Support → Andrita */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="rounded-xl border border-[#34D399]/20 bg-[#34D399]/[0.03] p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="text-lg">🛠️</span>
                <span className="text-sm font-medium text-[#34D399]">→</span>
                <span className="text-lg">✨</span>
                <h3 className="font-semibold ml-2">Support → Your Andrita</h3>
              </div>
              <ul className="space-y-3 text-sm text-white/50">
                <li className="flex gap-2">
                  <span className="text-[#34D399]">•</span>
                  Push new capabilities and model updates
                </li>
                <li className="flex gap-2">
                  <span className="text-[#34D399]">•</span>
                  Proactive health checks on your system
                </li>
                <li className="flex gap-2">
                  <span className="text-[#34D399]">•</span>
                  Diagnose issues remotely (with your consent)
                </li>
                <li className="flex gap-2">
                  <span className="text-[#34D399]">•</span>
                  Suggest optimisations from fleet-wide learnings
                </li>
              </ul>
            </motion.div>

            {/* Andrita → Support */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="rounded-xl border border-[#A78BFA]/20 bg-[#A78BFA]/[0.03] p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="text-lg">✨</span>
                <span className="text-sm font-medium text-[#A78BFA]">→</span>
                <span className="text-lg">🛠️</span>
                <h3 className="font-semibold ml-2">Your Andrita → Support</h3>
              </div>
              <ul className="space-y-3 text-sm text-white/50">
                <li className="flex gap-2">
                  <span className="text-[#A78BFA]">•</span>
                  Report persistent errors it can&apos;t resolve alone
                </li>
                <li className="flex gap-2">
                  <span className="text-[#A78BFA]">•</span>
                  Forward your support requests with diagnostics
                </li>
                <li className="flex gap-2">
                  <span className="text-[#A78BFA]">•</span>
                  Share anonymised system health data
                </li>
                <li className="flex gap-2">
                  <span className="text-[#A78BFA]">•</span>
                  Request specialist knowledge for complex automations
                </li>
              </ul>
            </motion.div>
          </div>

          {/* Consent callout */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-8 rounded-xl border border-[#FBBF24]/20 bg-[#FBBF24]/[0.03] p-6 text-center"
          >
            <p className="text-sm text-[#FBBF24] font-medium mb-2">
              🔒 Always With Your Consent
            </p>
            <p className="text-sm text-white/50 max-w-lg mx-auto">
              Your Andrita agent is the gatekeeper. No cloud agent can access
              your system without explicit permission. You control what&apos;s shared,
              always.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Data Privacy */}
      <section className="pb-24 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 md:p-12"
          >
            <h2 className="text-2xl font-bold mb-8 text-center">
              Data Flow & Privacy
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="rounded-xl bg-[#A78BFA]/[0.05] border border-[#A78BFA]/20 p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <span>🏠</span> Your Premises
                </h3>
                <ul className="space-y-2 text-sm text-white/50">
                  <li>✓ Personal preferences</li>
                  <li>✓ Camera feeds</li>
                  <li>✓ Voice commands</li>
                  <li>✓ Daily routines</li>
                  <li>✓ Family information</li>
                </ul>
                <div className="mt-4 px-3 py-2 rounded-lg bg-[#A78BFA]/10 text-xs text-[#A78BFA] font-medium text-center">
                  NEVER LEAVES YOUR PREMISES
                </div>
              </div>
              <div className="rounded-xl bg-[#FF6B35]/[0.05] border border-[#FF6B35]/20 p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <span>☁️</span> Edge-AI Cloud
                </h3>
                <ul className="space-y-2 text-sm text-white/50">
                  <li>✓ Anonymised usage metrics</li>
                  <li>✓ Conversation analytics</li>
                  <li>✓ Fleet health statistics</li>
                  <li>✓ Support ticket data</li>
                  <li>✓ Aggregate insights</li>
                </ul>
                <div className="mt-4 px-3 py-2 rounded-lg bg-[#FF6B35]/10 text-xs text-[#FF6B35] font-medium text-center">
                  NO PERSONAL DATA — EVER
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-32 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-4">
              Ready to meet your agent?
            </h2>
            <p className="text-white/50 mb-8">
              Start your journey on haba.casa — our Sales Agent is standing by.
            </p>
            <div className="flex gap-4 justify-center">
              <a
                href="https://www.haba.casa"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#FF6B35] to-[#FF8A5B] text-white font-medium hover:opacity-90 transition"
              >
                Visit HabaCasa →
              </a>
              <Link
                href="/"
                className="px-6 py-3 rounded-xl border border-white/10 text-white/70 hover:text-white hover:border-white/20 transition"
              >
                Back to Home
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
