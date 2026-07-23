"use client";

import { useState } from "react";
import { Sparkles, Send, Bot } from "lucide-react";

export function LegalAssistant() {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant', text: string }>>([
    { role: 'assistant', text: "Hello! I am your AI Legal Co-pilot. Tell me about your legal issue and I will help you formulate a precise brief for attorneys." }
  ]);
  const [loading, setLoading] = useState(false);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userMsg = query;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setQuery("");
    setLoading(true);

    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        text: `Analysis for "${userMsg}": To strengthen your position, make sure to detail the timeline, any contractual agreements involved, and your desired outcome. This will attract the most qualified attorneys.` 
      }]);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="bg-slate-900 text-white rounded-3xl p-8 shadow-xl border border-slate-800">
      <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-800">
        <div className="p-3 bg-slate-800 rounded-2xl text-emerald-400">
          <Bot className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-serif text-2xl tracking-tight text-white flex items-center gap-2">
            AI Legal Co-pilot <Sparkles className="w-4 h-4 text-amber-400" />
          </h3>
          <p className="text-xs text-slate-400 font-light">Instant case briefing & guidance assistant</p>
        </div>
      </div>

      <div className="space-y-4 mb-6 max-h-72 overflow-y-auto pr-2 text-sm">
        {messages.map((m, idx) => (
          <div key={idx} className={`p-4 rounded-2xl leading-relaxed ${m.role === 'user' ? 'bg-slate-800 text-slate-100 ml-6' : 'bg-slate-800/80 text-slate-200 mr-6 border border-slate-700/50'}`}>
            <span className="block text-[10px] font-semibold text-slate-400 mb-1 uppercase tracking-wider">{m.role === 'user' ? 'You' : 'AI Assistant'}</span>
            {m.text}
          </div>
        ))}
        {loading && (
          <div className="p-4 rounded-2xl bg-slate-800/80 text-slate-400 mr-6 text-sm animate-pulse">
            Analyzing legal context & generating recommendations...
          </div>
        )}
      </div>

      <form onSubmit={handleSend} className="flex gap-3">
        <input 
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Ask AI how to frame your case..."
          className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        <button type="submit" className="px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-medium transition-colors shadow-sm flex items-center justify-center">
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
