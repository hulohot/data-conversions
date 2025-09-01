import React, { useMemo, useState } from 'react';
import { Calculator } from "lucide-react";
import {
  ToolCard,
  Label,
  TextInput,
  NumberInput,
  Select,
  Row,
  CopyButton
} from './UIComponents';

export function PadBinary() {
  const [bin, setBin] = useState("");
  const [len, setLen] = useState(8);
  const [dir, setDir] = useState("left");
  const cleaned = bin.replace(/[^01]/g, "");
  const out = useMemo(() => (dir === "left" ? cleaned.padStart(len, "0") : cleaned.padEnd(len, "0")), [cleaned, len, dir]);

  return (
    <ToolCard
      title="Pad Binary"
      icon={<Calculator className="text-indigo-400" size={18} />}
      footer={<span>Quickly left/right pad a binary string with zeros to a specific length.</span>}
    >
      <Row>
        <div>
          <Label>Binary Input</Label>
          <TextInput value={bin} onChange={setBin} placeholder="e.g. 1011" />
        </div>
        <div>
          <Label>Target Length</Label>
          <NumberInput value={len} onChange={setLen} />
        </div>
      </Row>
      <Row>
        <div>
          <Label>Direction</Label>
          <Select value={dir} onChange={setDir} options={[{ label: "Pad Left", value: "left" }, { label: "Pad Right", value: "right" }]} />
        </div>
        <div className="flex items-end">
          <CopyButton text={out} />
        </div>
      </Row>
      <div>
        <Label>Output</Label>
        <TextInput value={out} readOnly />
      </div>
    </ToolCard>
  );
}
