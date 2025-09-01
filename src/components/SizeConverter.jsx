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
      footer={<span>Converts between bits, bytes, and IEC vs SI prefixes.</span>}
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
