import React, { useMemo, useState } from 'react';
import { Zap } from "lucide-react";
import { parseBigInt, toBase } from '../utils/conversionUtils';
import {
  ToolCard,
  Label,
  TextInput,
  Select,
  Row,
  CopyButton
} from './UIComponents';

export function XorCalculator() {
  const [val1, setVal1] = useState("");
  const [val2, setVal2] = useState("");
  const [base1, setBase1] = useState("2");
  const [base2, setBase2] = useState("2");
  const [bits, setBits] = useState(32);

  const base1Num = Number(base1);
  const base2Num = Number(base2);

  const value1Big = useMemo(() => parseBigInt(val1, base1Num), [val1, base1Num]);
  const value2Big = useMemo(() => parseBigInt(val2, base2Num), [val2, base2Num]);

  const xorResult = useMemo(() => {
    if (value1Big == null || value2Big == null) return null;

    // Perform XOR operation
    const result = value1Big ^ value2Big;

    // Convert to different bases
    const bin = toBase(result, 2);
    const oct = toBase(result, 8);
    const dec = result.toString(10);
    const hex = toBase(result, 16);

    return { result, bin, oct, dec, hex };
  }, [value1Big, value2Big]);

  const paddedResult = useMemo(() => {
    if (!xorResult?.bin) return { bin: "", oct: "", dec: "", hex: "" };

    const paddedBin = xorResult.bin.padStart(bits, "0");

    // Calculate padded versions for other bases
    const paddedResultBig = BigInt("0b" + paddedBin);
    const paddedOct = toBase(paddedResultBig, 8);
    const paddedDec = paddedResultBig.toString(10);
    const paddedHex = toBase(paddedResultBig, 16);

    return {
      bin: paddedBin,
      oct: paddedOct,
      dec: paddedDec,
      hex: paddedHex
    };
  }, [xorResult, bits]);

  const inputValid = val1.trim() !== "" && val2.trim() !== "" && value1Big != null && value2Big != null;

  return (
    <ToolCard
      title="XOR Calculator"
      icon={<Zap className="text-indigo-400" size={18} />}
      footer={
        <div className="flex items-start gap-2">
          <span>Perform bitwise XOR operation on two values. Results shown in all bases with optional bit padding.</span>
        </div>
      }
    >
      <Row>
        <div>
          <Label>Value 1</Label>
          <TextInput
            value={val1}
            onChange={setVal1}
            placeholder={`e.g. ${base1Num === 2 ? '1101' : base1Num === 16 ? 'A5' : base1Num === 8 ? '255' : '13'}`}
          />
        </div>
        <div>
          <Label>Base 1</Label>
          <Select
            value={base1}
            onChange={setBase1}
            options={[
              { label: "Binary (2)", value: "2" },
              { label: "Octal (8)", value: "8" },
              { label: "Decimal (10)", value: "10" },
              { label: "Hex (16)", value: "16" }
            ]}
          />
        </div>
      </Row>

      <Row>
        <div>
          <Label>Value 2</Label>
          <TextInput
            value={val2}
            onChange={setVal2}
            placeholder={`e.g. ${base2Num === 2 ? '1011' : base2Num === 16 ? 'B3' : base2Num === 8 ? '263' : '179'}`}
          />
        </div>
        <div>
          <Label>Base 2</Label>
          <Select
            value={base2}
            onChange={setBase2}
            options={[
              { label: "Binary (2)", value: "2" },
              { label: "Octal (8)", value: "8" },
              { label: "Decimal (10)", value: "10" },
              { label: "Hex (16)", value: "16" }
            ]}
          />
        </div>
      </Row>

      <Row>
        <div>
          <Label>Bit Width (padding)</Label>
          <TextInput
            value={bits.toString()}
            onChange={(v) => setBits(Math.max(1, parseInt(v) || 32))}
            placeholder="32"
          />
        </div>
        <div>
          <Label>Operation</Label>
          <TextInput value="XOR ⊕" readOnly />
        </div>
      </Row>

      {inputValid && xorResult && (
        <div className="space-y-3">
          <div>
            <Label>XOR Result (Binary)</Label>
            <div className="flex gap-2">
              <TextInput value={xorResult.bin} readOnly />
              <CopyButton text={xorResult.bin} />
            </div>
          </div>

          <Row>
            <div>
              <Label>Octal</Label>
              <div className="flex gap-2">
                <TextInput value={xorResult.oct} readOnly />
                <CopyButton text={xorResult.oct} />
              </div>
            </div>
            <div>
              <Label>Decimal</Label>
              <div className="flex gap-2">
                <TextInput value={xorResult.dec} readOnly />
                <CopyButton text={xorResult.dec} />
              </div>
            </div>
          </Row>

          <Row>
            <div>
              <Label>Hexadecimal</Label>
              <div className="flex gap-2">
                <TextInput value={xorResult.hex} readOnly />
                <CopyButton text={xorResult.hex} />
              </div>
            </div>
            <div>
              <Label>Binary (padded)</Label>
              <div className="flex gap-2">
                <TextInput value={paddedResult.bin} readOnly />
                <CopyButton text={paddedResult.bin} />
              </div>
            </div>
          </Row>

          <div className="text-sm text-zinc-400">
            <div>Input 1: {val1} (base {base1}) = {value1Big?.toString(2)}₂</div>
            <div>Input 2: {val2} (base {base2}) = {value2Big?.toString(2)}₂</div>
            <div className="mt-1 font-mono">Result: {xorResult.bin}₂ ({bits}-bit padded: {paddedResult.bin})</div>
          </div>
        </div>
      )}

      {(!inputValid && (val1.trim() || val2.trim())) && (
        <div className="mt-4 p-3 rounded-xl bg-red-900/20 border border-red-800">
          <p className="text-red-400 text-sm">
            {!value1Big && val1.trim() ? "Invalid Value 1 format for selected base" :
             !value2Big && val2.trim() ? "Invalid Value 2 format for selected base" :
             "Please enter valid values in both fields"}
          </p>
        </div>
      )}
    </ToolCard>
  );
}
