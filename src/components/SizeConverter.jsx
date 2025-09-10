import React, { useMemo, useState } from 'react';
import { Calculator } from "lucide-react";
import { sizeUnitsBinary, sizeUnitsDecimal } from '../utils/conversionUtils';
import {
  ToolCard,
  Label,
  TextInput,
  Select,
  Row,
  Readout
} from './UIComponents';

export function SizeConverter() {
  const [val, setVal] = useState("");
  const [unit, setUnit] = useState("B");
  const bits = useMemo(() => {
    const v = Number(val);
    if (!isFinite(v) || v < 0) return null;
    const all = [...sizeUnitsBinary, ...sizeUnitsDecimal];
    const found = all.find((u) => u.key === unit);
    if (!found) return null;
    return v * found.factor;
  }, [val, unit]);
  const outputs = useMemo(() => {
    if (bits == null) return null;
    const bin = sizeUnitsBinary.map((u) => ({ unit: u.key, value: bits / u.factor }));
    const dec = sizeUnitsDecimal.map((u) => ({ unit: u.key, value: bits / u.factor }));
    return { bin, dec };
  }, [bits]);

  return (
    <ToolCard
      title="Size Converter (bits/bytes, IEC & SI)"
      icon={<Calculator className="text-indigo-400" size={18} />}
      footer={
        <div className="space-y-2">
          <div>
            <span className="text-zinc-400">Example: </span>
            <span className="font-mono text-zinc-300">1 KB = 1000 bytes (SI) vs 1 KiB = 1024 bytes (IEC)</span>
          </div>
          <div className="text-xs">
            <span>Convert between different size units, distinguishing SI (decimal) and IEC (binary) prefixes. </span>
            <a href="https://en.wikipedia.org/wiki/Binary_prefix" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 underline">
              Learn about binary prefixes
            </a>
            {" | "}
            <a href="https://en.wikipedia.org/wiki/Byte" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 underline">
              Byte definition
            </a>
          </div>
        </div>
      }
    >
      <Row>
        <div>
          <Label>Value</Label>
          <TextInput value={val} onChange={setVal} placeholder="e.g., 256" />
        </div>
        <div>
          <Label>Unit</Label>
          <Select value={unit} onChange={setUnit} options={[...sizeUnitsBinary, ...sizeUnitsDecimal].map((u) => ({ label: u.key, value: u.key }))} />
        </div>
      </Row>
      <Row>
        <div>
          <Label>Binary Prefixes (IEC)</Label>
          <div className="grid grid-cols-2 gap-2">
            {outputs?.bin.map((x) => (<Readout key={x.unit} label={x.unit} value={x.value} />)) || <div className="text-zinc-500">—</div>}
          </div>
        </div>
        <div>
          <Label>Decimal Prefixes (SI)</Label>
          <div className="grid grid-cols-2 gap-2">
            {outputs?.dec.map((x) => (<Readout key={x.unit} label={x.unit} value={x.value} />)) || <div className="text-zinc-500">—</div>}
          </div>
        </div>
      </Row>
    </ToolCard>
  );
}
