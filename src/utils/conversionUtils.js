import { useState } from 'react';

export function useClipboard() {
  const [copied, setCopied] = useState(false);
  const copy = async (text) => {
    try {
      await navigator.clipboard.writeText(text || "");
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch (e) {
      console.error(e);
    }
  };
  return { copied, copy };
}

export function parseBigInt(input, base) {
  try {
    if (!base || base < 2 || base > 36) return null;
    const s = String(input || "");
    if (s.trim() === "") return null;
    const neg = s.startsWith("-");
    const clean = (neg ? s.slice(1) : s).replace(/[_\s]/g, "").toLowerCase();
    const alphabet = "0123456789abcdefghijklmnopqrstuvwxyz";
    let value = 0n;
    for (const ch of clean) {
      const idx = alphabet.indexOf(ch);
      if (idx < 0 || idx >= base) return null;
      value = value * BigInt(base) + BigInt(idx);
    }
    return neg ? -value : value;
  } catch {
    return null;
  }
}

export function toBase(value, base) {
  const alphabet = "0123456789abcdefghijklmnopqrstuvwxyz";
  if (value === 0n) return "0";
  const neg = value < 0n;
  let v = neg ? -value : value;
  let out = "";
  while (v > 0n) {
    const rem = v % BigInt(base);
    out = alphabet[Number(rem)] + out;
    v = v / BigInt(base);
  }
  return neg ? "-" + out : out;
}

export function twosComplementToSigned(bin) {
  const n = BigInt(bin.length);
  const value = BigInt("0b" + bin);
  const msb = (value >> (n - 1n)) & 1n;
  if (msb === 0n) return value;
  const mod = 1n << n;
  return value - mod;
}

export function formatNumber(n) {
  if (!isFinite(n)) return "";
  const abs = Math.abs(n);
  if (abs !== 0 && (abs < 1e-3 || abs >= 1e6)) return n.toExponential(6);
  return n.toLocaleString(undefined, { maximumFractionDigits: 9 });
}

export function formatBigIntDecimal(bi) {
  let s = bi.toString(10);
  const neg = s[0] === "-";
  if (neg) s = s.slice(1);
  let out = "";
  for (let i = 0; i < s.length; i++) {
    const idx = s.length - 1 - i;
    out = s[idx] + out;
    if (i % 3 === 2 && i !== s.length - 1) out = "," + out;
  }
  return neg ? "-" + out : out;
}

export const timeUnits = [
  { key: "s", factor: 1 },
  { key: "ms", factor: 1e-3 },
  { key: "us", factor: 1e-6 },
  { key: "ns", factor: 1e-9 },
  { key: "ps", factor: 1e-12 },
];

export const freqUnits = [
  { key: "Hz", factor: 1 },
  { key: "kHz", factor: 1e3 },
  { key: "MHz", factor: 1e6 },
  { key: "GHz", factor: 1e9 },
];

export const sizeUnitsBinary = [
  { key: "b", factor: 1 },
  { key: "B", factor: 8 },
  { key: "KiB", factor: 8 * 1024 },
  { key: "MiB", factor: 8 * 1024 ** 2 },
  { key: "GiB", factor: 8 * 1024 ** 3 },
  { key: "TiB", factor: 8 * 1024 ** 4 },
];

export const sizeUnitsDecimal = [
  { key: "kb", factor: 1e3 },
  { key: "kB", factor: 8e3 },
  { key: "MB", factor: 8e6 },
  { key: "GB", factor: 8e9 },
  { key: "TB", factor: 8e12 },
];
