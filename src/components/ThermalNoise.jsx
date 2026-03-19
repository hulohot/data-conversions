import React, { useMemo, useState } from 'react';
import { Calculator } from "lucide-react";
import { formatNumber } from '../utils/conversionUtils';
import {
  ToolCard,
  Label,
  NumberInput,
  Select,
  Row,
  TextInput
} from './UIComponents';

const BOLTZMANN_CONSTANT = 1.380649e-23;
const RESISTANCE_UNITS = [
  { key: "ohm", label: "ohms", factor: 1 },
  { key: "kohm", label: "kOhm", factor: 1e3 },
  { key: "mohm", label: "MOhm", factor: 1e6 },
];
const BANDWIDTH_UNITS = [
  { key: "hz", label: "Hz", factor: 1 },
  { key: "khz", label: "kHz", factor: 1e3 },
  { key: "mhz", label: "MHz", factor: 1e6 },
  { key: "ghz", label: "GHz", factor: 1e9 },
];
const TEMPERATURE_UNITS = [
  { key: "c", label: "Celsius" },
  { key: "k", label: "Kelvin" },
];

export function ThermalNoise() {
  const [resistance, setResistance] = useState(1);
  const [resistanceUnit, setResistanceUnit] = useState("kohm");
  const [temperature, setTemperature] = useState(25);
  const [temperatureUnit, setTemperatureUnit] = useState("c");
  const [bandwidth, setBandwidth] = useState(1000);
  const [bandwidthUnit, setBandwidthUnit] = useState("khz");

  const resistanceOhms = useMemo(() => {
    if (!isFinite(resistance) || resistance < 0) return null;
    const unit = RESISTANCE_UNITS.find((u) => u.key === resistanceUnit);
    return unit ? resistance * unit.factor : null;
  }, [resistance, resistanceUnit]);

  const temperatureKelvin = useMemo(() => {
    if (!isFinite(temperature)) return null;
    const kelvin = temperatureUnit === "c" ? temperature + 273.15 : temperature;
    return kelvin >= 0 ? kelvin : null;
  }, [temperature, temperatureUnit]);

  const bandwidthHz = useMemo(() => {
    if (!isFinite(bandwidth) || bandwidth < 0) return null;
    const unit = BANDWIDTH_UNITS.find((u) => u.key === bandwidthUnit);
    return unit ? bandwidth * unit.factor : null;
  }, [bandwidth, bandwidthUnit]);

  const voltage = useMemo(() => {
    if (
      resistanceOhms == null ||
      temperatureKelvin == null ||
      bandwidthHz == null
    ) {
      return null;
    }

    return Math.sqrt(4 * BOLTZMANN_CONSTANT * temperatureKelvin * resistanceOhms * bandwidthHz);
  }, [resistanceOhms, temperatureKelvin, bandwidthHz]);

  const voltageText = voltage == null ? "" : formatNumber(voltage);

  return (
    <ToolCard
      title="Resistor Thermal Noise"
      icon={<Calculator className="text-indigo-400" size={18} />}
      footer={
        <div className="space-y-2">
          <div>
            <span className="text-zinc-400">Formula: </span>
            <span className="font-mono text-zinc-300">V = sqrt(4 k T R B)</span>
          </div>
          <div>
            <span className="text-zinc-400">Example: </span>
            <span className="font-mono text-zinc-300">R=1 kOhm, T=25 Celsius, B=1000 kHz -&gt; V~4.06e-6 V rms</span>
          </div>
          <div className="text-xs">
            <span>Johnson-Nyquist noise voltage (rms) for a resistor over a measurement bandwidth. </span>
            <a href="https://en.wikipedia.org/wiki/Johnson%E2%80%93Nyquist_noise" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 underline">
              Learn about thermal noise
            </a>
          </div>
        </div>
      }
    >
      <Row>
        <div>
          <Label>Resistance (R)</Label>
          <div className="grid grid-cols-2 gap-2">
            <NumberInput value={resistance} onChange={setResistance} />
            <Select
              value={resistanceUnit}
              onChange={setResistanceUnit}
              options={RESISTANCE_UNITS.map((u) => ({ label: u.label, value: u.key }))}
            />
          </div>
        </div>
        <div>
          <Label>Temperature (T)</Label>
          <div className="grid grid-cols-2 gap-2">
            <NumberInput value={temperature} onChange={setTemperature} />
            <Select
              value={temperatureUnit}
              onChange={setTemperatureUnit}
              options={TEMPERATURE_UNITS.map((u) => ({ label: u.label, value: u.key }))}
            />
          </div>
        </div>
      </Row>
      <Row>
        <div>
          <Label>Bandwidth (B)</Label>
          <div className="grid grid-cols-2 gap-2">
            <NumberInput value={bandwidth} onChange={setBandwidth} />
            <Select
              value={bandwidthUnit}
              onChange={setBandwidthUnit}
              options={BANDWIDTH_UNITS.map((u) => ({ label: u.label, value: u.key }))}
            />
          </div>
        </div>
        <div>
          <Label>Voltage (V rms)</Label>
          <TextInput value={voltageText} readOnly />
        </div>
      </Row>
    </ToolCard>
  );
}
