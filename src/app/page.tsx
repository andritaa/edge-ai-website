"use client";

import { ArrowRight, ExternalLink, MessageCircle, X, Send, Shield, Code2, Bot, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";

/* ─── animation helpers ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
};

/* ─── chatbot ─── */
function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; text: string }[]>([
    { role: "assistant", text: "Hi! I'm the Edge AI assistant. Ask me anything about our products, philosophy, or how we work." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const msg = input.trim();
    setInput("");
    setMessages((m) => [...m, { role: "user", text: msg }]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg }),
      });
      const data = await res.json();
      setMessages((m) => [...m, { role: "assistant", text: data.reply || "Sorry, I couldn't process that." }]);
    } catch {
      setMessages((m) => [...m, { role: "assistant", text: "Something went wrong. Try again later." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* trigger */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-lg cursor-pointer"
        aria-label="Toggle chat"
      >
        {open ? <X size={20} /> : <MessageCircle size={20} />}
      </button>

      {/* window */}
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.95 }}
          className="fixed bottom-20 right-6 z-50 w-[360px] max-w-[calc(100vw-48px)] h-[450px] max-h-[calc(100vh-120px)] bg-[#111] border border-[#222] rounded-xl flex flex-col overflow-hidden shadow-2xl"
        >
          {/* header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#222]">
            <div>
              <p className="text-sm font-medium">Edge AI Assistant</p>
              <p className="text-xs text-[#666]">Powered by Claude</p>
            </div>
            <button onClick={() => setOpen(false)} className="text-[#666] hover:text-white cursor-pointer">
              <X size={16} />
            </button>
          </div>

          {/* messages */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] px-3.5 py-2.5 rounded-lg text-sm leading-relaxed ${
                  m.role === "user"
                    ? "self-end bg-white text-black"
                    : "self-start bg-[#1a1a1a] text-[#ccc]"
                }`}
              >
                {m.text}
              </div>
            ))}
            {loading && (
              <div className="self-start bg-[#1a1a1a] rounded-lg px-3.5 py-2.5 flex gap-1">
                <span className="w-1.5 h-1.5 bg-[#666] rounded-full animate-pulse" />
                <span className="w-1.5 h-1.5 bg-[#666] rounded-full animate-pulse [animation-delay:150ms]" />
                <span className="w-1.5 h-1.5 bg-[#666] rounded-full animate-pulse [animation-delay:300ms]" />
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* input */}
          <div className="flex gap-3 p-4 border-t border-[#222]">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Ask anything..."
              className="flex-1 bg-[#1a1a1a] border border-[#333] rounded-lg px-3.5 py-2.5 text-sm text-white outline-none focus:border-[#444] placeholder:text-[#555]"
            />
            <button
              onClick={send}
              disabled={loading || !input.trim()}
              className="bg-white text-black rounded-lg px-3.5 py-2.5 disabled:opacity-50 cursor-pointer hover:bg-gray-100 transition-colors"
            >
              <Send size={16} />
            </button>
          </div>
        </motion.div>
      )}
    </>
  );
}

/* ─── main page ─── */
export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 h-[60px] flex items-center justify-between bg-black/80 backdrop-blur-xl border-b border-white/5">
        <a href="/" className="font-semibold text-base tracking-tight">
          Edge AI
        </a>
        <div className="flex items-center gap-8">
          <a href="#products" className="text-sm text-[#888] hover:text-white transition-colors hidden sm:block">
            Products
          </a>
          <a href="#about" className="text-sm text-[#888] hover:text-white transition-colors hidden sm:block">
            About
          </a>
          <a href="#contact" className="text-sm text-[#888] hover:text-white transition-colors hidden sm:block">
            Contact
          </a>
          <a href="/architecture" className="text-sm text-[#888] hover:text-white transition-colors hidden sm:block">
            Architecture
          </a>
          <a
            href="/admin"
            className="text-sm text-white flex items-center gap-1 hover:opacity-80 transition-opacity"
          >
            Dashboard <ChevronRight size={14} />
          </a>
        </div>
      </nav>

      {/* hero */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={stagger}
        className="pt-[180px] pb-[120px] px-6 max-w-[900px] mx-auto"
      >
        <motion.h1
          variants={fadeUp}
          className="text-[clamp(48px,8vw,80px)] font-medium tracking-[-0.03em] leading-[1.05] mb-8 font-[family-name:var(--font-display)]"
        >
          AI that runs
          <br />
          <span className="text-[#666]">on your hardware.</span>
        </motion.h1>
        <motion.p variants={fadeUp} className="text-lg text-[#888] max-w-[480px] leading-relaxed mb-12">
          We build autonomous agents using open-source models. No cloud. No data leaving your network.
          We use the same technology to run our own business.
        </motion.p>
        <motion.div variants={fadeUp} className="flex gap-4 flex-wrap">
          <a
            href="#products"
            className="text-sm font-medium text-black bg-white px-6 py-3 rounded-md inline-flex items-center gap-2 hover:bg-gray-100 transition-colors"
          >
            View products <ArrowRight size={16} />
          </a>
          <a
            href="#about"
            className="text-sm font-medium text-white border border-[#333] px-6 py-3 rounded-md hover:border-[#555] transition-colors"
          >
            How it works
          </a>
        </motion.div>
      </motion.section>

      {/* pillars */}
      <section className="border-t border-[#1a1a1a] py-20 px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="max-w-[900px] mx-auto grid grid-cols-1 sm:grid-cols-3 gap-12"
        >
          {[
            { icon: <Shield size={20} className="text-[#444] mb-4" />, label: "Privacy", desc: "Data stays on your network. No external API calls." },
            { icon: <Code2 size={20} className="text-[#444] mb-4" />, label: "Open Source", desc: "Models you can inspect, modify, and trust." },
            { icon: <Bot size={20} className="text-[#444] mb-4" />, label: "Autonomous", desc: "Agents that act, not just respond." },
          ].map((p) => (
            <motion.div key={p.label} variants={fadeUp}>
              {p.icon}
              <p className="text-xs text-[#666] uppercase tracking-[0.1em] mb-2">{p.label}</p>
              <p className="text-[15px] text-[#ccc] leading-relaxed">{p.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* products */}
      <section id="products" className="py-20 px-6 bg-[#0a0a0a]">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="max-w-[900px] mx-auto"
        >
          <motion.div variants={fadeUp}>
            <p className="text-xs text-[#666] uppercase tracking-[0.1em] mb-4">Products</p>
            <h2 className="text-[clamp(32px,5vw,48px)] font-medium tracking-[-0.02em] mb-16 font-[family-name:var(--font-display)]">
              Two products.
              <br />
              <span className="text-[#666]">Same philosophy.</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <motion.a
              variants={fadeUp}
              href="https://ai.haba.casa"
              target="_blank"
              rel="noopener noreferrer"
              className="group p-8 bg-[#111] rounded-lg border border-[#1a1a1a] hover:border-[#2a2a2a] transition-colors block"
            >
              <div className="flex justify-between items-start mb-6">
                <span className="text-xs text-green-500 uppercase tracking-[0.1em]">Spaces</span>
                <ExternalLink size={16} className="text-[#444] group-hover:text-[#666] transition-colors" />
              </div>
              <h3 className="text-2xl font-medium mb-3">Haba Casa</h3>
              <p className="text-[15px] text-[#888] leading-relaxed">
                AI for physical environments. Homes, offices, and factories that manage themselves.
              </p>
            </motion.a>

            <motion.div
              variants={fadeUp}
              className="p-8 bg-[#111] rounded-lg border border-[#1a1a1a]"
            >
              <div className="mb-6">
                <span className="text-xs text-amber-500 uppercase tracking-[0.1em]">Business</span>
              </div>
              <h3 className="text-2xl font-medium mb-3">The AI Agency</h3>
              <p className="text-[15px] text-[#888] leading-relaxed">
                Agents for operations. Support, scheduling, and workflows that run autonomously.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* about + process */}
      <section id="about" className="py-20 px-6 border-t border-[#1a1a1a]">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="max-w-[900px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-20"
        >
          <motion.div variants={fadeUp}>
            <p className="text-xs text-[#666] uppercase tracking-[0.1em] mb-4">About</p>
            <h2 className="text-[clamp(28px,4vw,40px)] font-medium tracking-[-0.02em] mb-6 font-[family-name:var(--font-display)]">
              We use what
              <br />
              we build.
            </h2>
            <p className="text-[15px] text-[#888] leading-[1.7] mb-4">
              Our scheduling, customer support, and operations are managed by the same AI agents we
              build for customers.
            </p>
            <p className="text-[15px] text-[#888] leading-[1.7] mb-8">
              The assistant in the corner runs on our stack. Ask it anything.
            </p>
            <p className="text-xs text-[#666]">Powered by Claude</p>
          </motion.div>

          <motion.div variants={fadeUp}>
            <p className="text-xs text-[#666] uppercase tracking-[0.1em] mb-6">Process</p>
            <div className="flex flex-col gap-6">
              {[
                { n: "01", title: "Deploy", desc: "Install on your hardware" },
                { n: "02", title: "Connect", desc: "Link your systems and data" },
                { n: "03", title: "Configure", desc: "Define goals and constraints" },
                { n: "04", title: "Run", desc: "Monitor or let it operate" },
              ].map((s) => (
                <div key={s.n} className="flex gap-5">
                  <span className="text-xs text-[#444] font-mono pt-0.5">{s.n}</span>
                  <div>
                    <p className="text-[15px] font-medium mb-1">{s.title}</p>
                    <p className="text-sm text-[#666]">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* CTA / contact */}
      <section id="contact" className="py-20 px-6 bg-[#0a0a0a] text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="max-w-[500px] mx-auto"
        >
          <motion.h2 variants={fadeUp} className="text-[32px] font-medium tracking-[-0.02em] mb-4 font-[family-name:var(--font-display)]">
            Get started
          </motion.h2>
          <motion.p variants={fadeUp} className="text-[15px] text-[#888] mb-8">
            Explore the dashboard or talk to our assistant.
          </motion.p>
          <motion.div variants={fadeUp} className="flex gap-4 justify-center flex-wrap">
            <a
              href="/admin"
              className="text-sm font-medium text-black bg-white px-6 py-3 rounded-md inline-flex items-center gap-2 hover:bg-gray-100 transition-colors"
            >
              Dashboard <ArrowRight size={16} />
            </a>
            <a
              href="mailto:hello@edge-ai.space"
              className="text-sm font-medium text-[#888] px-6 py-3 hover:text-white transition-colors"
            >
              Contact
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* footer */}
      <footer className="py-8 px-6 border-t border-[#1a1a1a]">
        <div className="max-w-[900px] mx-auto flex justify-between items-center">
          <span className="text-xs text-[#444]">© {new Date().getFullYear()} Edge AI Ltd</span>
          <div className="flex gap-6">
            <a
              href="https://github.com/haba-create"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[#666] hover:text-white transition-colors"
            >
              GitHub
            </a>
            <a href="mailto:hello@edge-ai.space" className="text-xs text-[#666] hover:text-white transition-colors">
              Contact
            </a>
          </div>
        </div>
      </footer>

      {/* chatbot */}
      <Chatbot />
    </main>
  );
}
