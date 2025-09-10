import React, { useMemo, useState } from 'react';
import { Calculator, Info } from "lucide-react";
import {
  parseBigInt,
  toBase,
  twosComplementToSigned
} from '../utils/conversionUtils';
import {
  ToolCard,
  Label,
  TextInput,
  NumberInput,
  Select,
  Row,
  CopyButton
} from './UIComponents';

export function BaseConverter() {
  const [input, setInput] = useState("");
  const [inBase, setInBase] = useState("2");
  const [customBase, setCustomBase] = useState(10);
  const [bits, setBits] = useState(32);
  const [useTwos, setUseTwos] = useState(false);
  const baseVal = inBase === "custom" ? customBase : Number(inBase);
  const parsed = useMemo(() => parseBigInt(input.trim(), baseVal), [input, baseVal]);
  const unsigned = useMemo(() => {
    if (parsed === null) return null;
    return { bin: toBase(parsed, 2), oct: toBase(parsed, 8), dec: parsed.toString(10), hex: toBase(parsed, 16) };
  }, [parsed]);
  const signed = useMemo(() => {
    try {
      if (!useTwos) return null;
      if (baseVal !== 2) return null;
      const clean = input.replace(/[_\s]/g, "");
      if (!/^[-]?[01]+$/.test(clean)) return null;
      const s = clean.startsWith("-") ? clean.slice(1) : clean;
      const width = s.length;
      const val = twosComplementToSigned(s);
      return { width, dec: val.toString(10), hex: val < 0n ? "-0x" + (-val).toString(16) : "0x" + val.toString(16) };
    } catch { return null; }
  }, [input, baseVal, useTwos]);
  const padOut = useMemo(() => {
    if (!unsigned?.bin) return "";
    const w = Math.max(bits, unsigned.bin.length);
    return unsigned.bin.padStart(w, "0");
  }, [unsigned, bits]);
  const allOut = useMemo(() => parsed === null ? { bin: "", oct: "", dec: "", hex: "", padded: "" } : { bin: unsigned.bin, oct: unsigned.oct, dec: unsigned.dec, hex: unsigned.hex, padded: padOut }, [parsed, unsigned, padOut]);

  return (
    <ToolCard
      title="Base & Two's Complement"
      icon={<Calculator className="text-indigo-400" size={18} />}
      footer={
        <div className="space-y-2">
          <div>
            <span className="text-zinc-400">Example: </span>
            <span className="font-mono text-zinc-300">255 (dec) → 11111111 (bin) → FF (hex)</span>
          </div>
          <div className="flex items-start gap-2">
            <Info size={14} className="mt-0.5"/>
            <div className="text-xs">
              <span>Convert between binary, octal, decimal, and hexadecimal bases. Supports two's complement for signed binary interpretation. </span>
              <a href="https://en.wikipedia.org/wiki/Positional_notation" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 underline">
                Learn about positional notation
              </a>
              {" | "}
              <a href="https://en.wikipedia.org/wiki/Two%27s_complement" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 underline">
                Two's complement
              </a>
            </div>
          </div>
        </div>
      }
    >
      <Row>
        <div>
          <Label>Input</Label>
          <TextInput value={input} onChange={setInput} placeholder="e.g. 101101 or FF or 1234" />
        </div>
        <div>
          <Label>Input Base</Label>
          <Select value={inBase} onChange={setInBase} options={[{ label: "Binary (2)", value: "2" },{ label: "Octal (8)", value: "8" },{ label: "Decimal (10)", value: "10" },{ label: "Hex (16)", value: "16" },{ label: "Custom", value: "custom" }]} />
          {inBase === "custom" && (
            <div className="mt-2">
              <NumberInput value={customBase} onChange={(v) => setCustomBase(Math.max(2, Math.min(36, Math.floor(v))))} placeholder="2..36" />
            </div>
          )}
        </div>
      </Row>
      <Row>
        <div className="flex items-center gap-2">
          <input id="twos" type="checkbox" className="accent-indigo-500" checked={useTwos} onChange={(e) => setUseTwos(e.target.checked)} />
          <Label><span className="font-medium text-zinc-300">Interpret as Two's Complement (binary input)</span></Label>
        </div>
        <div>
          <Label>Target Bits (padding)</Label>
          <NumberInput value={bits} onChange={setBits} />
        </div>
      </Row>
      <Row>
        <div>
          <Label>Binary</Label>
          <TextInput value={allOut.bin} readOnly />
        </div>
        <div>
          <Label>Octal</Label>
          <TextInput value={allOut.oct} readOnly />
        </div>
      </Row>
      <Row>
        <div>
          <Label>Decimal</Label>
          <TextInput value={allOut.dec} readOnly />
        </div>
        <div>
          <Label>Hex</Label>
          <TextInput value={allOut.hex} readOnly />
        </div>
      </Row>
      <div>
        <Label>Binary (padded)</Label>
        <div className="flex gap-2">
          <TextInput value={allOut.padded} readOnly />
          <CopyButton text={allOut.padded} />
        </div>
      </div>
      {signed && (<div className="mt-3 text-sm text-emerald-300 font-mono">Signed (two's, width {signed.width}): dec {signed.dec}, hex {signed.hex}</div>)}
    </ToolCard>
  );
}
