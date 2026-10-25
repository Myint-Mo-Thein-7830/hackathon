import React, { useState } from 'react';
import { MessageSquare, Copy, Check, Send, ShieldCheck, Sparkles } from 'lucide-react';

export default function InquiryCopilot({ script, propertyType }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!script) return;
    navigator.clipboard.writeText(script);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="p-1 rounded-lg bg-indigo-500/20 text-indigo-400">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center space-x-1.5">
              <span>Landlord Inquiry Copilot</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 font-normal">
                Pre-Drafted Pushback
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Politely challenges detected red flags before you sign or pay any money.
            </p>
          </div>
        </div>

        <button
          id="copy-copilot-btn"
          onClick={handleCopy}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            copied
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/30'
              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-500/20 active:scale-95'
          }`}
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Copied to Clipboard!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Script</span>
            </>
          )}
        </button>
      </div>

      <div className="relative rounded-xl bg-slate-950/80 border border-slate-800 p-4 font-mono text-xs text-slate-200 leading-relaxed whitespace-pre-line shadow-inner">
        {script}
        <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-sans text-slate-400">
          <span className="flex items-center space-x-1">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Ready to paste directly into LINE or Facebook Messenger</span>
          </span>
          <span className="text-emerald-400 font-medium">Protect Your Deposit</span>
        </div>
      </div>
    </div>
  );
}
