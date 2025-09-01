import React, { useMemo, useState } from 'react';
import { Calculator } from "lucide-react";
import { freqUnits } from '../utils/conversionUtils';
import {
  ToolCard,
  Label,
  NumberInput,
  Select,
  Row,
  Readout
} from './UIComponents';

export function Throughput() {
  const [widthBits, setWidthBits] = useState(32);
  const [freq, setFreq] = useState(100);
  const [freqUnit, setFreqUnit] = useState("MHz");
  const hz = useMemo(() => {
    const u = freqUnits.find((x) => x.key === freqUnit);
    return freq * u.factor;
  }, [freq, freqUnit]);
  const bitsPerSec = useMemo(() => widthBits * hz, [widthBits, hz]);
  const bytesPerSec = useMemo(() => bitsPerSec / 8, [bitsPerSec]);
  const gbps = bitsPerSec / 1e9;
  const mbps = bitsPerSec / 1e6;
  const MBps = bytesPerSec / 1e6;
  const MiBps = bytesPerSec / (1024 ** 2);

  return (
    <ToolCard
      title="Throughput from Bus × Clock"
      icon={<Calculator className="text-indigo-400" size={18} />}
      footer={<span>Assumes one data transfer per clock.</span>}
    >
      <Row>
        <div>
          <Label>Bus Width (bits/transfer)</Label>
          <NumberInput value={widthBits} onChange={setWidthBits} />
        </div>
        <div>
          <Label>Clock</Label>
          <div className="grid grid-cols-2 gap-2">
            <NumberInput value={freq} onChange={setFreq} />
            <Select value={freqUnit} onChange={setFreqUnit} options={freqUnits.map((u) => ({ label: u.key, value: u.key }))} />
          </div>
        </div>
      </Row>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <Readout label="Gb/s" value={gbps} />
        <Readout label="Mb/s" value={mbps} />
        <Readout label="MB/s (SI)" value={MBps} />
        <Readout label="MiB/s (IEC)" value={MiBps} />
      </div>
    </ToolCard>
  );
}
