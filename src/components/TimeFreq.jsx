import React, { useMemo, useState } from 'react';
import { Calculator } from "lucide-react";
import { timeUnits, freqUnits } from '../utils/conversionUtils';
import {
  ToolCard,
  Label,
  TextInput,
  Select,
  Row,
  Actions,
  Readout
} from './UIComponents';

export function TimeFreq() {
  const [periodVal, setPeriodVal] = useState("");
  const [periodUnit, setPeriodUnit] = useState("ns");
  const [freqVal, setFreqVal] = useState("");
  const [freqUnit, setFreqUnit] = useState("MHz");
  const periodSeconds = useMemo(() => {
    const v = Number(periodVal);
    if (!isFinite(v) || v <= 0) return null;
    const u = timeUnits.find((u) => u.key === periodUnit);
    return v * u.factor;
  }, [periodVal, periodUnit]);
  const freqHz = useMemo(() => {
    const v = Number(freqVal);
    if (!isFinite(v) || v <= 0) return null;
    const u = freqUnits.find((u) => u.key === freqUnit);
    return v * u.factor;
  }, [freqVal, freqUnit]);
  const displayFreqs = useMemo(() => {
    const hz = periodSeconds != null ? 1 / periodSeconds : freqHz != null ? freqHz : null;
    if (hz == null) return null;
    return freqUnits.map((u) => ({ unit: u.key, value: hz / u.factor }));
  }, [periodSeconds, freqHz]);
  const displayPeriods = useMemo(() => {
    const s = freqHz != null ? 1 / freqHz : periodSeconds != null ? periodSeconds : null;
    if (s == null) return null;
    return timeUnits.map((u) => ({ unit: u.key, value: s / u.factor }));
  }, [freqHz, periodSeconds]);
  const reset = () => { setPeriodVal(""); setFreqVal(""); };

  return (
    <ToolCard 
      title="Time ↔ Frequency" 
      icon={<Calculator className="text-indigo-400" size={18} />} 
      footer={
        <div className="space-y-2">
          <div>
            <span className="text-zinc-400">Example: </span>
            <span className="font-mono text-zinc-300">10 ns period = 100 MHz frequency</span>
          </div>
          <div className="text-xs">
            <span>Convert between time period and frequency (T = 1/f). Enter either value to calculate the other. </span>
            <a href="https://en.wikipedia.org/wiki/Frequency" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 underline">
              Learn about frequency
            </a>
            {" | "}
            <a href="https://en.wikipedia.org/wiki/Clock_signal" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 underline">
              Clock signals
            </a>
          </div>
        </div>
      }
    >
      <Row>
        <div>
          <Label>Period</Label>
          <div className="grid grid-cols-3 gap-2">
            <TextInput value={periodVal} onChange={setPeriodVal} placeholder="value" />
            <Select value={periodUnit} onChange={setPeriodUnit} options={timeUnits.map((u) => ({ label: u.key, value: u.key }))} />
            <button onClick={() => setPeriodVal("1")} className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-100">1 {periodUnit}</button>
          </div>
        </div>
        <div>
          <Label>Frequency</Label>
          <div className="grid grid-cols-3 gap-2">
            <TextInput value={freqVal} onChange={setFreqVal} placeholder="value" />
            <Select value={freqUnit} onChange={setFreqUnit} options={freqUnits.map((u) => ({ label: u.key, value: u.key }))} />
            <button onClick={() => setFreqVal("1")} className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-100">1 {freqUnit}</button>
          </div>
        </div>
      </Row>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <Label>Derived Frequencies</Label>
          <div className="grid grid-cols-2 gap-2">
            {displayFreqs?.map((x) => (<Readout key={x.unit} label={x.unit} value={x.value} />)) || <div className="text-zinc-500">—</div>}
          </div>
        </div>
        <div>
          <Label>Derived Periods</Label>
          <div className="grid grid-cols-2 gap-2">
            {displayPeriods?.map((x) => (<Readout key={x.unit} label={x.unit} value={x.value} />)) || <div className="text-zinc-500">—</div>}
          </div>
        </div>
      </div>
      <Actions onReset={reset} />
    </ToolCard>
  );
}
