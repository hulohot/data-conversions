import React, { useMemo, useState } from 'react';
import { Calculator } from "lucide-react";
import {
  ToolCard,
  Label,
  TextInput,
  Row,
  TextAreaReadOnly,
  CopyButton
} from './UIComponents';

export function AsciiHex() {
  const [ascii, setAscii] = useState("");
  const toHex = useMemo(() => Array.from(ascii).map((c) => c.charCodeAt(0).toString(16).padStart(2, "0")).join(" "), [ascii]);
  const fromHex = (hex) => {
    const clean = String(hex).replace(/[^0-9a-fA-F]/g, "");
    if (clean.length % 2 !== 0) return "";
    let out = "";
    for (let i = 0; i < clean.length; i += 2) out += String.fromCharCode(parseInt(clean.slice(i, i + 2), 16));
    return out;
  };
  const [hexIn, setHexIn] = useState("");
  const asciiFromHex = useMemo(() => fromHex(hexIn), [hexIn]);

  return (
    <ToolCard
      title="ASCII ↔ Hex"
      icon={<Calculator className="text-indigo-400" size={18} />}
      footer={
        <div className="space-y-2">
          <div>
            <span className="text-zinc-400">Example: </span>
            <span className="font-mono text-zinc-300">"Hello" → 48 65 6c 6c 6f</span>
          </div>
          <div className="text-xs">
            <span>Convert between ASCII text and hexadecimal representation. </span>
            <a href="https://en.wikipedia.org/wiki/ASCII" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 underline">
              Learn more about ASCII
            </a>
          </div>
        </div>
      }
    >
      <Row>
        <div>
          <Label>ASCII → Hex</Label>
          <TextInput value={ascii} onChange={setAscii} placeholder="Enter ASCII text" mono={false} />
          <div className="mt-2 flex gap-2">
            <TextAreaReadOnly value={toHex} />
            <CopyButton text={toHex} />
          </div>
        </div>
        <div>
          <Label>Hex → ASCII</Label>
          <TextInput value={hexIn} onChange={setHexIn} placeholder="e.g., 48 65 6c 6c 6f" />
          <div className="mt-2">
            <TextAreaReadOnly value={asciiFromHex} mono={false} />
          </div>
        </div>
      </Row>
    </ToolCard>
  );
}
