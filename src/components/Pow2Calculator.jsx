import React, { useMemo, useState } from 'react';
import { Calculator } from "lucide-react";
import { formatBigIntDecimal } from '../utils/conversionUtils';
import {
  ToolCard,
  Label,
  NumberInput,
  Row,
  TextInput,
  TextAreaReadOnly,
  CopyButton
} from './UIComponents';

export function Pow2Calculator() {
  const [n, setN] = useState(10);
  const pow2 = useMemo(() => (n >= 0 ? (1n << BigInt(n)) : null), [n]);
  const minus1 = useMemo(() => (pow2 != null ? pow2 - 1n : null), [pow2]);
  const signedMax = useMemo(() => (n >= 1 ? (1n << BigInt(n - 1)) - 1n : 0n), [n]);
  const signedMin = useMemo(() => (n >= 1 ? -(1n << BigInt(n - 1)) : 0n), [n]);
  const bin = useMemo(() => (n >= 0 ? ("1" + "0".repeat(n)) : ""), [n]);
  const hex = useMemo(() => (pow2 != null ? pow2.toString(16) : ""), [pow2]);
  const dec = useMemo(() => (pow2 != null ? formatBigIntDecimal(pow2) : ""), [pow2]);
  const decMinus1 = useMemo(() => (minus1 != null ? formatBigIntDecimal(minus1) : ""), [minus1]);
  const signedMaxStr = useMemo(() => formatBigIntDecimal(signedMax), [signedMax]);
  const signedMinStr = useMemo(() => formatBigIntDecimal(signedMin), [signedMin]);
  const bytes = useMemo(() => (n - 3 >= 0 ? 1n << BigInt(n - 3) : 0n), [n]);
  const kib = useMemo(() => (n - 13 >= 0 ? 1n << BigInt(n - 13) : 0n), [n]);
  const mib = useMemo(() => (n - 23 >= 0 ? 1n << BigInt(n - 23) : 0n), [n]);
  const gib = useMemo(() => (n - 33 >= 0 ? 1n << BigInt(n - 33) : 0n), [n]);

  return (
    <ToolCard
      title="2^n Calculator"
      icon={<Calculator className="text-indigo-400" size={18} />}
      footer={<span>Compute powers of two and related limits.</span>}
    >
      <Row>
        <div>
          <Label>n</Label>
          <NumberInput value={n} onChange={setN} />
        </div>
        <div className="flex items-end"><div className="text-xs text-zinc-400">2^10≈1 Ki, 2^20≈1 Mi, 2^30≈1 Gi</div></div>
      </Row>
      <Row>
        <div>
          <Label>2^n (decimal)</Label>
          <div className="flex gap-2">
            <TextInput value={dec} readOnly />
            <CopyButton text={dec} />
          </div>
        </div>
        <div>
          <Label>2^n (hex)</Label>
          <div className="flex gap-2">
            <TextInput value={hex} readOnly />
            <CopyButton text={hex} />
          </div>
        </div>
      </Row>
      <Row>
        <div>
          <Label>2^n − 1 (max unsigned n-bit)</Label>
          <div className="flex gap-2">
            <TextInput value={decMinus1} readOnly />
            <CopyButton text={decMinus1} />
          </div>
        </div>
        <div>
          <Label>Binary (1 followed by n zeros)</Label>
          <div className="flex gap-2">
            <TextInput value={bin} readOnly />
            <CopyButton text={bin} />
          </div>
        </div>
      </Row>
      <Row>
        <div>
          <Label>Signed range (two's complement)</Label>
          <TextInput value={`min ${signedMinStr}  |  max ${signedMaxStr}`} readOnly />
        </div>
        <div>
          <Label>Sizes if 2^n bits</Label>
          <TextAreaReadOnly value={`Bytes: ${formatBigIntDecimal(bytes)}\nKiB:   ${formatBigIntDecimal(kib)}\nMiB:   ${formatBigIntDecimal(mib)}\nGiB:   ${formatBigIntDecimal(gib)}`} />
        </div>
      </Row>
    </ToolCard>
  );
}
