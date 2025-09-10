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
      footer={
        <div className="space-y-2">
          <div>
            <span className="text-zinc-400">Example: </span>
            <span className="font-mono text-zinc-300">32-bit @ 100 MHz = 3.2 Gb/s = 400 MB/s</span>
          </div>
          <div className="text-xs">
            <span>Calculate data throughput from bus width and clock frequency. Assumes one transfer per clock cycle. </span>
            <a href="https://en.wikipedia.org/wiki/Throughput" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 underline">
              Learn about throughput
            </a>
            {" | "}
            <a href="https://en.wikipedia.org/wiki/Bus_(computing)" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 underline">
              Computer bus
            </a>
          </div>
        </div>
      }
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
