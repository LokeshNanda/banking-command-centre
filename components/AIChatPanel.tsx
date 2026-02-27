"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useOpenAIKey } from "@/contexts/OpenAIKeyContext";
import { useToast } from "@/contexts/ToastContext";
import type { ExtendedMetricsPayload } from "@/lib/mockBankingData";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface AIChatPanelProps {
  data: ExtendedMetricsPayload;
  isOpen: boolean;
  onClose: () => void;
}

export function AIChatPanel({ data, isOpen, onClose }: AIChatPanelProps) {
  const { apiKey, setApiKey, hasKey } = useOpenAIKey();
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [keyInputValue, setKeyInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && hasKey) {
      inputRef.current?.focus();
    }
  }, [isOpen, hasKey]);

  const handleSaveKey = () => {
    const trimmed = keyInputValue.trim();
    if (trimmed) {
      setApiKey(trimmed);
      setKeyInputValue("");
      setShowKeyInput(false);
      toast("API key saved. Your key is stored locally and never sent to our servers.", "success");
    }
  };

  const handleRemoveKey = () => {
    setApiKey(null);
    setShowKeyInput(false);
    setKeyInputValue("");
    toast("API key removed", "info");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    if (!hasKey) {
      setShowKeyInput(true);
      toast("Add your OpenAI API key to start chatting", "info");
      return;
    }

    setInput("");
    const userMessage: ChatMessage = { role: "user", content: text };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          messages: messages.map((m) => ({ role: m.role, content: m.content })),
          apiKey,
          dashboardData: data,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error ?? "Failed to get response");
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: json.reply },
      ]);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      toast(msg, "error");
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Sorry, I couldn't process that: ${msg}. Check that your API key is valid.`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const suggestedPrompts = [
    "Summarise our key risk areas",
    "What's driving NPA in our portfolio?",
    "Liquidity position and recommendations",
    "Customer churn risk overview",
    "Fraud and anomaly highlights",
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            aria-hidden="true"
          />
          <motion.div
            initial={{ x: 320, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 320, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-slate-900/95 border-l border-slate-700/50 shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-700/50 shrink-0">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                <h2 className="text-lg font-semibold text-white">
                  AI Chat
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                aria-label="Close chat"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* API Key setup */}
            {!hasKey && (
              <div className="p-4 border-b border-slate-700/50 space-y-3">
                <p className="text-sm text-slate-400">
                  Add your OpenAI API key to chat about your dashboard data. Your key is stored locally and never sent to our servers.
                </p>
                {showKeyInput ? (
                  <div className="space-y-2">
                    <input
                      type="password"
                      value={keyInputValue}
                      onChange={(e) => setKeyInputValue(e.target.value)}
                      placeholder="sk-..."
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none text-sm"
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleSaveKey}
                        className="px-3 py-1.5 text-sm rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setShowKeyInput(false);
                          setKeyInputValue("");
                        }}
                        className="px-3 py-1.5 text-sm rounded-lg border border-slate-600 text-slate-400 hover:text-white"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowKeyInput(true)}
                    className="px-3 py-2 text-sm rounded-lg border border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 transition-colors"
                  >
                    Add OpenAI API Key
                  </button>
                )}
              </div>
            )}

            {hasKey && (
              <div className="px-4 py-2 border-b border-slate-700/50 flex items-center justify-between">
                <span className="text-xs text-slate-500">Using your API key</span>
                <button
                  onClick={handleRemoveKey}
                  className="text-xs text-slate-500 hover:text-red-400"
                >
                  Remove key
                </button>
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && hasKey && (
                <div className="space-y-3">
                  <p className="text-sm text-slate-500">
                    Ask anything about your dashboard. I have access to KPIs, credit risk, liquidity, customer data, fraud signals, and more.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {suggestedPrompts.map((prompt) => (
                      <button
                        key={prompt}
                        onClick={() => setInput(prompt)}
                        className="px-3 py-1.5 text-xs rounded-full border border-slate-600 text-slate-400 hover:border-cyan-500/50 hover:text-cyan-400 transition-colors"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                      msg.role === "user"
                        ? "bg-cyan-600/30 text-cyan-100"
                        : "bg-slate-800/80 text-slate-200 border border-slate-700/50"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-slate-800/80 border border-slate-700/50 rounded-lg px-3 py-2">
                    <span className="inline-flex gap-1">
                      <span className="w-2 h-2 rounded-full bg-cyan-500 animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-2 rounded-full bg-cyan-500 animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 rounded-full bg-cyan-500 animate-bounce" style={{ animationDelay: "300ms" }} />
                    </span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            {hasKey && (
              <form onSubmit={handleSubmit} className="p-4 border-t border-slate-700/50 shrink-0">
                <div className="flex gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about your dashboard..."
                    disabled={loading}
                    className="flex-1 px-4 py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={loading || !input.trim()}
                    className="px-4 py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed text-white transition-colors"
                  >
                    Send
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
