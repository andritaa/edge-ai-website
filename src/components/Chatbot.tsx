"use client";

import { MessageCircle, X, Send, Bot, Minimize2, Star, Clock, DollarSign, Settings } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface Session {
  user?: {
    name?: string | null;
    email?: string;
  };
}

const SUGGESTED_PROMPTS = [
  {
    id: "what-is-edge-ai",
    text: "What is Edge AI?",
    icon: <Bot size={16} className="text-[#FF6B35]" />,
  },
  {
    id: "show-pricing",
    text: "Show me pricing",
    icon: <DollarSign size={16} className="text-[#FF6B35]" />,
  },
  {
    id: "book-demo",
    text: "I want to book a demo",
    icon: <Clock size={16} className="text-[#FF6B35]" />,
  },
  {
    id: "how-local-ai",
    text: "How does local AI work?",
    icon: <Settings size={16} className="text-[#FF6B35]" />,
  },
];

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>("");
  const [session, setSession] = useState<Session | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  // Initialize session and check auth
  useEffect(() => {
    // Generate or retrieve session ID from localStorage
    let storedSessionId = localStorage.getItem("chatbot-session-id");
    if (!storedSessionId) {
      storedSessionId = `anon-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem("chatbot-session-id", storedSessionId);
    }
    setSessionId(storedSessionId);

    // Check if user is authenticated
    const checkSession = async () => {
      try {
        const response = await fetch("/api/auth/session", {
          credentials: "include"
        });
        if (response.ok) {
          const sessionData = await response.json();
          if (sessionData?.user) {
            setSession(sessionData);
            // Update session ID for authenticated users
            const authSessionId = `user-${sessionData.user.id}`;
            setSessionId(authSessionId);
            localStorage.setItem("chatbot-session-id", authSessionId);
          }
        }
      } catch (error) {
        console.log("No active session");
      }
    };

    checkSession();
  }, []);

  // Set welcome message when component mounts
  useEffect(() => {
    if (sessionId && messages.length === 0) {
      const welcomeMessage = session?.user?.name
        ? `Welcome back, ${session.user.name}! I'm the Edge AI assistant. How can I help you today?`
        : "Hi! I'm the Edge AI assistant. I can help you explore our products, answer questions, or guide you through getting started. What would you like to know?";

      setMessages([{ role: "assistant", content: welcomeMessage }]);
    }
  }, [sessionId, session, messages.length]);

  // Auto-scroll to latest message
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (messageText: string = input.trim()) => {
    if (!messageText || loading) return;

    setInput("");
    const userMessage: Message = { role: "user", content: messageText };
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: messageText,
          sessionId
        }),
        credentials: "include"
      });

      const data = await response.json();
      const assistantMessage: Message = {
        role: "assistant",
        content: data.reply || "Sorry, I couldn't process that request."
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage: Message = {
        role: "assistant",
        content: "Something went wrong. Please try again later."
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestedPrompt = (prompt: { id: string; text: string; icon: React.ReactNode }) => {
    sendMessage(prompt.text);
  };

  const toggleOpen = () => {
    if (open && !minimized) {
      setOpen(false);
    } else if (open && minimized) {
      setMinimized(false);
    } else {
      setOpen(true);
      setMinimized(false);
    }
  };

  const handleMinimize = () => {
    setMinimized(true);
  };

  const handleClose = () => {
    setOpen(false);
    setMinimized(false);
  };

  // Render message with markdown support for assistant messages
  const renderMessage = (content: string, role: string) => {
    if (role === "assistant") {
      return (
        <ReactMarkdown
          components={{
            p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
            strong: ({ children }) => <strong className="font-semibold text-[#FF6B35]">{children}</strong>,
            a: ({ children, href }) => (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#FF6B35] hover:underline font-medium"
              >
                {children}
              </a>
            ),
            ul: ({ children }) => <ul className="list-disc list-inside space-y-1 mt-2">{children}</ul>,
            li: ({ children }) => <li className="text-white/90">{children}</li>,
            code: ({ children }) => (
              <code className="bg-[#1a1a1a] px-1 py-0.5 rounded text-[#FF6B35] text-xs font-mono">
                {children}
              </code>
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      );
    }
    return content;
  };

  return (
    <>
      {/* Floating chat trigger button */}
      <motion.button
        onClick={toggleOpen}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-r from-[#FF6B35] to-[#e55a24] text-white rounded-full flex items-center justify-center shadow-lg border border-white/10 backdrop-blur-sm"
        aria-label="Toggle chat"
      >
        <motion.div
          animate={{ rotate: open && !minimized ? 180 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          {open && !minimized ? <X size={22} /> : <MessageCircle size={22} />}
        </motion.div>
      </motion.button>

      {/* Chat window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              height: minimized ? "60px" : "480px"
            }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-48px)] bg-black/90 backdrop-blur-xl border border-white/10 rounded-2xl flex flex-col overflow-hidden shadow-2xl"
            style={{
              maxHeight: minimized ? "60px" : "calc(100vh-140px)",
              height: minimized ? "60px" : "480px"
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-[#FF6B35]/10 to-[#e55a24]/10 border-b border-white/10 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-[#FF6B35] to-[#e55a24] rounded-full flex items-center justify-center">
                  <Bot size={18} className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Edge AI Assistant</p>
                  <p className="text-xs text-gray-400 flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Online
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleMinimize}
                  className="text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
                  aria-label="Minimize chat"
                >
                  <Minimize2 size={16} />
                </button>
                <button
                  onClick={handleClose}
                  className="text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
                  aria-label="Close chat"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Messages area - hidden when minimized */}
            {!minimized && (
              <>
                <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 custom-scrollbar">
                  {messages.map((message, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.05 }}
                      className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                        message.role === "user"
                          ? "self-end bg-gradient-to-r from-[#FF6B35] to-[#e55a24] text-white shadow-lg"
                          : "self-start bg-gray-900/50 text-gray-100 border border-white/10"
                      }`}
                    >
                      {renderMessage(message.content, message.role)}
                    </motion.div>
                  ))}

                  {/* Show suggested prompts when chat is empty (only welcome message) */}
                  {messages.length === 1 && messages[0].role === "assistant" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.2 }}
                      className="space-y-3 mt-2"
                    >
                      <p className="text-xs text-white/60 font-medium uppercase tracking-wider">Suggested questions:</p>
                      <div className="grid grid-cols-1 gap-2">
                        {SUGGESTED_PROMPTS.map((prompt) => (
                          <motion.button
                            key={prompt.id}
                            onClick={() => handleSuggestedPrompt(prompt)}
                            whileHover={{ scale: 1.02, backgroundColor: "rgba(255, 107, 53, 0.1)" }}
                            whileTap={{ scale: 0.98 }}
                            className="flex items-center gap-3 p-3 rounded-xl border border-white/10 text-left text-sm text-white/80 hover:text-white hover:border-[#FF6B35]/30 transition-all group"
                          >
                            {prompt.icon}
                            <span className="group-hover:text-white transition-colors">{prompt.text}</span>
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Typing indicator */}
                  {loading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="self-start bg-gray-900/50 border border-white/10 rounded-2xl px-4 py-3 flex gap-1"
                    >
                      {[0, 1, 2].map((i) => (
                        <motion.span
                          key={i}
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                          className="w-2 h-2 bg-[#FF6B35] rounded-full"
                        />
                      ))}
                    </motion.div>
                  )}
                  <div ref={endRef} />
                </div>

                {/* Input area */}
                <div className="flex gap-3 p-4 border-t border-white/10 bg-black/30 flex-shrink-0">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                    placeholder="Ask about products, pricing, or book a demo..."
                    disabled={loading}
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-400 outline-none focus:border-[#FF6B35]/50 focus:ring-1 focus:ring-[#FF6B35]/20 transition-all disabled:opacity-50"
                  />
                  <motion.button
                    onClick={() => sendMessage()}
                    disabled={loading || !input.trim()}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-gradient-to-r from-[#FF6B35] to-[#e55a24] text-white rounded-xl px-4 py-3 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg flex items-center justify-center"
                  >
                    <Send size={16} />
                  </motion.button>
                </div>

                {/* Powered by footer */}
                <div className="px-4 py-2 border-t border-white/10 bg-black/30 flex-shrink-0">
                  <p className="text-xs text-white/40 text-center font-medium">
                    Powered by <span className="text-[#FF6B35] font-semibold">Edge AI</span>
                  </p>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom scrollbar styles */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </>
  );
}