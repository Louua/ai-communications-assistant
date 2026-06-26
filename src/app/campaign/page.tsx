"use client";

import { useState, useEffect } from "react";
import { 
  MessageSquare, Copy, Check, RotateCcw, AlertCircle, History, 
  Trash2, Send, Sparkles, User, FileText, Settings 
} from "lucide-react";

interface HistoryItem {
  id: string;
  timestamp: string;
  goal: string;
  audience: string;
  tone: string;
  keyPoints: string;
  result: string;
}

export default function CampaignPage() {
  const [form, setForm] = useState({ goal: "", audience: "", tone: "Upbeat & Inspiring", keyPoints: "" });
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Load history from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("comms_campaign_history");
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  // Save history to localStorage
  const saveHistory = (newHistory: HistoryItem[]) => {
    setHistory(newHistory);
    localStorage.setItem("comms_campaign_history", JSON.stringify(newHistory));
  };

  async function generate(overrideForm = form) {
    if (!overrideForm.goal.trim() || !overrideForm.audience.trim() || !overrideForm.tone.trim()) {
      setError("Please fill out all required fields (Goal, Audience, and Tone).");
      return;
    }

    setError("");
    setLoading(true);
    setResult("");

    try {
      const res = await fetch("/api/campaign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(overrideForm),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      setResult(data.result);

      // Add to history
      const newHistoryItem: HistoryItem = {
        id: Math.random().toString(36).substring(2, 9),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        ...overrideForm,
        result: data.result,
      };
      saveHistory([newHistoryItem, ...history.slice(0, 9)]); // Keep last 10
    } catch (err: any) {
      setError(err.message || "Failed to generate campaign message.");
    } finally {
      setLoading(false);
    }
  }

  const handleCopy = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Could not copy text", err);
    }
  };

  const handleSelectHistory = (item: HistoryItem) => {
    setForm({
      goal: item.goal,
      audience: item.audience,
      tone: item.tone,
      keyPoints: item.keyPoints,
    });
    setResult(item.result);
    setError("");
  };

  const clearHistory = () => {
    saveHistory([]);
  };

  return (
    <div className="relative flex-1 bg-slate-950 p-6 md:p-10">
      <div className="absolute top-0 right-0 h-[300px] w-[300px] rounded-full bg-indigo-500/5 blur-[100px]" />
      
      <div className="max-w-6xl mx-auto space-y-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center space-x-2 text-indigo-400 mb-1">
              <MessageSquare className="h-5 w-5" />
              <span className="text-sm font-semibold tracking-wider uppercase">Feature Tool</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white">Campaign Message Drafter</h1>
            <p className="text-slate-400 text-sm mt-1">
              Draft clean, engaging internal emails, announcements or Slack messages.
            </p>
          </div>
        </div>

        {/* Workspace Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Inputs Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-6 backdrop-blur-md space-y-5">
              <div className="flex items-center space-x-2 text-slate-300 font-bold border-b border-white/5 pb-3">
                <Settings className="h-4 w-4 text-indigo-400" />
                <span>Message Configuration</span>
              </div>

              {error && (
                <div className="flex items-start space-x-2.5 rounded-lg border border-red-500/20 bg-red-500/10 p-3.5 text-sm text-red-300">
                  <AlertCircle className="h-5 w-5 shrink-0 text-red-400" />
                  <span>{error}</span>
                </div>
              )}

              {/* Goal Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center">
                  Campaign Goal / Purpose <span className="text-red-400 ml-0.5">*</span>
                </label>
                <input
                  type="text"
                  className="w-full rounded-lg border border-white/10 bg-slate-950 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none transition-colors"
                  placeholder="e.g. Announce Q3 product roadmap or promote volunteer day"
                  value={form.goal}
                  onChange={(e) => setForm({ ...form, goal: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Target Audience */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center">
                    Target Audience <span className="text-red-400 ml-0.5">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-lg border border-white/10 bg-slate-950 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none transition-colors"
                    placeholder="e.g. All staff, Engineering, Managers"
                    value={form.audience}
                    onChange={(e) => setForm({ ...form, audience: e.target.value })}
                  />
                </div>

                {/* Tone select */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center">
                    Message Tone <span className="text-red-400 ml-0.5">*</span>
                  </label>
                  <select
                    className="w-full rounded-lg border border-white/10 bg-slate-950 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none transition-colors"
                    value={form.tone}
                    onChange={(e) => setForm({ ...form, tone: e.target.value })}
                  >
                    <option value="Upbeat & Inspiring">Upbeat & Inspiring</option>
                    <option value="Professional & Formal">Professional & Formal</option>
                    <option value="Casual & Friendly">Casual & Friendly</option>
                    <option value="Urgent & Action-oriented">Urgent & Action-oriented</option>
                    <option value="Empathetic & Supportive">Empathetic & Supportive</option>
                  </select>
                </div>
              </div>

              {/* Key Points */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center">
                  Key Points / Context (One per line)
                </label>
                <textarea
                  className="w-full h-32 rounded-lg border border-white/10 bg-slate-950 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none transition-colors resize-none"
                  placeholder="- Beta test starts July 1st&#10;- Feedback required by July 15th&#10;- Slack channel: #beta-q3"
                  value={form.keyPoints}
                  onChange={(e) => setForm({ ...form, keyPoints: e.target.value })}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-2">
                <button
                  onClick={() => generate()}
                  disabled={loading}
                  className="flex-1 flex items-center justify-center space-x-2 rounded-lg bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 px-5 py-3 text-sm font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-indigo-500/20 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      <span>Drafting Message...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span>Draft Message</span>
                    </>
                  )}
                </button>
                
                {result && (
                  <button
                    onClick={() => generate()}
                    disabled={loading}
                    className="flex items-center justify-center p-3 rounded-lg border border-white/10 text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                    title="Regenerate"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Results & History Panel */}
          <div className="space-y-6">
            {/* Generation Results */}
            <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-6 backdrop-blur-md flex flex-col min-h-[350px]">
              <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
                <div className="flex items-center space-x-2 text-slate-300 font-bold">
                  <Sparkles className="h-4 w-4 text-indigo-400" />
                  <span>Generated Draft</span>
                </div>
                {result && (
                  <button
                    onClick={handleCopy}
                    className="flex items-center space-x-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-semibold px-2 py-1 rounded bg-indigo-500/10 border border-indigo-500/20 transition-all cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="h-3.5 w-3.5" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>Copy Draft</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              {loading ? (
                <div className="flex-1 flex flex-col justify-center space-y-4 animate-pulse">
                  <div className="h-4 bg-white/5 rounded w-3/4" />
                  <div className="h-4 bg-white/5 rounded" />
                  <div className="h-4 bg-white/5 rounded" />
                  <div className="h-4 bg-white/5 rounded w-5/6" />
                  <div className="h-4 bg-white/5 rounded w-1/2" />
                </div>
              ) : result ? (
                <div className="flex-1 overflow-auto whitespace-pre-wrap text-sm text-slate-300 bg-slate-950/65 border border-white/5 rounded-xl p-4 leading-relaxed font-sans select-text">
                  {result}
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-6 border border-dashed border-white/5 rounded-xl bg-slate-950/20">
                  <FileText className="h-10 w-10 text-slate-600 mb-3" />
                  <p className="text-slate-500 text-sm font-medium">Your generated message draft will appear here.</p>
                </div>
              )}
            </div>

            {/* History Panel */}
            <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-6 backdrop-blur-md">
              <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
                <div className="flex items-center space-x-2 text-slate-300 font-bold">
                  <History className="h-4 w-4 text-indigo-400" />
                  <span>Recent Drafts</span>
                </div>
                {history.length > 0 && (
                  <button
                    onClick={clearHistory}
                    className="text-slate-500 hover:text-red-400 transition-colors p-1"
                    title="Clear history"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              {history.length > 0 ? (
                <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                  {history.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleSelectHistory(item)}
                      className="w-full text-left p-3 rounded-lg bg-slate-950/50 hover:bg-slate-950 border border-white/5 hover:border-indigo-500/30 transition-all flex justify-between items-start cursor-pointer group"
                    >
                      <div className="truncate pr-2">
                        <p className="text-xs font-semibold text-slate-300 truncate group-hover:text-indigo-400 transition-colors">
                          {item.goal}
                        </p>
                        <span className="text-[10px] text-slate-500 block mt-1">
                          Audience: {item.audience} • Tone: {item.tone}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 whitespace-nowrap bg-white/5 px-1.5 py-0.5 rounded">
                        {item.timestamp}
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 text-xs text-center py-4">No recent drafts generated yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
