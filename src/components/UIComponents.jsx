import React from 'react';
import { Copy, RefreshCcw, Calculator, Info, Check, SwitchCamera } from "lucide-react";
import { useClipboard, formatNumber } from '../utils/conversionUtils';

export function ToolCard({ title, icon, children, footer }) {
  return (
    <div className="bg-zinc-900/70 backdrop-blur border border-zinc-800 rounded-2xl p-5 shadow-xl hover:shadow-2xl transition-shadow duration-300">
      <div className="flex items-center gap-2 mb-4 text-zinc-200">
        {icon}
        <h2 className="text-lg font-semibold tracking-wide">{title}</h2>
      </div>
      <div className="space-y-3 text-zinc-200">{children}</div>
      {footer && <div className="mt-4 pt-3 border-t border-zinc-800 text-sm text-zinc-400">{footer}</div>}
    </div>
  );
}

export function Label({ children }) {
  return <label className="text-sm text-zinc-400">{children}</label>;
}

export function TextInput({ value, onChange, placeholder, mono = true, readOnly = false }) {
  return (
    <input
      className={`w-full rounded-xl bg-zinc-950 border border-zinc-800 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 ${mono ? "font-mono" : "font-sans"}`}
      value={value}
      onChange={onChange ? (e) => onChange(e.target.value) : undefined}
      placeholder={placeholder}
      readOnly={readOnly || !onChange}
    />
  );
}

export function NumberInput({ value, onChange, placeholder }) {
  return (
    <input
      type="number"
      className="w-full rounded-xl bg-zinc-950 border border-zinc-800 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      placeholder={placeholder}
    />
  );
}

export function Select({ value, onChange, options }) {
  return (
    <select
      className="w-full rounded-xl bg-zinc-950 border border-zinc-800 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {options.map((o) => (
        <option key={String(o.value)} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

export function Row({ children }) {
  return <div className="grid grid-cols-1 md:grid-cols-2 gap-3">{children}</div>;
}

export function Actions({ onReset, onCopy }) {
  return (
    <div className="flex items-center gap-2">
      {onReset && (
        <button onClick={onReset} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-100">
          <RefreshCcw size={16} /> Reset
        </button>
      )}
      {onCopy && (
        <button onClick={onCopy} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white">
          <Copy size={16} /> Copy
        </button>
      )}
    </div>
  );
}

export function Readout({ label, value }) {
  const text = isFinite(value) ? formatNumber(value) : "";
  return (
    <div className="flex items-center justify-between rounded-xl bg-zinc-950 border border-zinc-800 px-3 py-2 font-mono">
      <span className="text-zinc-400">{label}</span>
      <span className="text-zinc-100">{text}</span>
    </div>
  );
}

export function TextAreaReadOnly({ value, mono = true }) {
  return (
    <textarea readOnly value={value} className={`w-full h-24 rounded-xl bg-zinc-950 border border-zinc-800 px-3 py-2 outline-none ${mono ? "font-mono" : "font-sans"} text-zinc-100`} />
  );
}

export function CopyButton({ text }) {
  const { copied, copy } = useClipboard();
  return (
    <button onClick={() => copy(text)} className={`flex items-center gap-2 px-3 py-2 rounded-xl ${copied ? "bg-emerald-600" : "bg-indigo-600 hover:bg-indigo-500"} text-white`}>
      {copied ? <Check size={16} /> : <Copy size={16} />} {copied ? "Copied" : "Copy"}
    </button>
  );
}
