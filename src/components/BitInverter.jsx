import React, { useMemo, useState } from 'react';
import { SwitchCamera } from "lucide-react";
import { parseBigInt, toBase } from '../utils/conversionUtils';
import {
  ToolCard,
  Label,
  TextInput,
  NumberInput,
  Select,
  Row,
  CopyButton
} from './UIComponents';

export function BitInverter() {
  const [val, setVal] = useState("");
  const [base, setBase] = useState("2");
  const [bits, setBits] = useState(0);

  const baseNum = Number(base);

  const inferredBits = useMemo(() => {
    const s = val.replace(/[_\s]/g, "").toLowerCase();
    if (!s) return 0;
    if (baseNum === 2) return s.replace(/[^01]/g, "").length;
    if (baseNum === 16) return s.replace(/[^0-9a-f]/g, "").length * 4;
    if (baseNum === 8) return s.replace(/[^0-7]/g, "").length * 3;
    return 0;
  }, [val, baseNum]);

  const width = useMemo(() => {
    const b = Math.max(0, Math.floor(bits || 0));
    return b > 0 ? b : inferredBits;
  }, [bits, inferredBits]);

  const valueBig = useMemo(() => parseBigInt(val, baseNum), [val, baseNum]);

  const reversed = useMemo(() => {
    if (valueBig == null) return { bin: "", same: "" };
    const rawBin = toBase(valueBig < 0n ? -valueBig : valueBig, 2);
    const w = Math.max(width, rawBin === "0" ? 1 : rawBin.length);
    const padded = rawBin.padStart(w, "0");
    const rev = padded.split("").reverse().join("");
    if (baseNum === 2) return { bin: rev, same: rev };
    if (baseNum === 16) {
      const hexLen = Math.ceil(rev.length / 4);
      const paddedRev = rev.padStart(hexLen * 4, "0");
      const hex = BigInt("0b" + paddedRev).toString(16);
      return { bin: rev, same: hex.padStart(hexLen, "0") };
    }
    if (baseNum === 8) {
      const octLen = Math.ceil(rev.length / 3);
      const paddedRev = rev.padStart(octLen * 3, "0");
      const oct = BigInt("0b" + paddedRev).toString(8);
      return { bin: rev, same: oct.padStart(octLen, "0") };
    }
    const dec = BigInt("0b" + rev).toString(10);
    return { bin: rev, same: dec };
  }, [valueBig, baseNum, width]);

  return (
    <ToolCard
      title="Bit Inverter (MSB⇄LSB)"
      icon={<SwitchCamera className="text-indigo-400" size={18} />}
      footer={
        <div className="space-y-2">
          <div>
            <span className="text-zinc-400">Example: </span>
            <span className="font-mono text-zinc-300">1101 → 1011 (MSB↔LSB swap)</span>
          </div>
          <div className="text-xs">
            <span>Reverses bit order (MSB becomes LSB). Useful for endianness conversion or bit manipulation. </span>
            <a href="https://en.wikipedia.org/wiki/Bit_numbering" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 underline">
              Learn about bit numbering
            </a>
            {" | "}
            <a href="https://en.wikipedia.org/wiki/Endianness" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 underline">
              Endianness
            </a>
          </div>
        </div>
      }
    >
      <Row>
        <div>
          <Label>Input</Label>
          <TextInput value={val} onChange={setVal} placeholder="e.g. 1101 or 0xA5 (enter hex without 0x)" />
        </div>
        <div>
          <Label>Base</Label>
          <Select value={base} onChange={setBase} options={[{ label: "Bin", value: "2" }, { label: "Oct", value: "8" }, { label: "Dec", value: "10" }, { label: "Hex", value: "16" }]} />
        </div>
      </Row>
      <Row>
        <div>
          <Label>Bit Width (optional)</Label>
          <NumberInput value={bits} onChange={setBits} />
        </div>
        <div>
          <Label>Inferred Width</Label>
          <TextInput value={String(inferredBits || "")} readOnly />
        </div>
      </Row>
      <Row>
        <div>
          <Label>Reversed (binary)</Label>
          <div className="flex gap-2">
            <TextInput value={reversed.bin} readOnly />
            <CopyButton text={reversed.bin} />
          </div>
        </div>
        <div>
          <Label>Reversed (same base)</Label>
          <div className="flex gap-2">
            <TextInput value={reversed.same} readOnly />
            <CopyButton text={reversed.same} />
          </div>
        </div>
      </Row>
    </ToolCard>
  );
}
