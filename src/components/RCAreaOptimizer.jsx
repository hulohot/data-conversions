import React, { useMemo, useState } from 'react';
import { Calculator } from "lucide-react";
import { formatNumber } from '../utils/conversionUtils';
import {
  ToolCard,
  Label,
  NumberInput,
  Row,
  Select,
  TextInput
} from './UIComponents';

const CAP_DENSITY_UNITS = [
  { key: "ff", label: "fF/um^2", factor: 1e-15 },
  { key: "pf", label: "pF/um^2", factor: 1e-12 },
  { key: "nf", label: "nF/um^2", factor: 1e-9 },
  { key: "uf", label: "uF/um^2", factor: 1e-6 },
  { key: "f", label: "F/um^2", factor: 1 },
];

const TAU_UNITS = [
  { key: "ns", label: "ns", factor: 1e-9 },
  { key: "us", label: "us", factor: 1e-6 },
  { key: "ms", label: "ms", factor: 1e-3 },
  { key: "s", label: "s", factor: 1 },
];

export function RCAreaOptimizer() {
  const [capDensity, setCapDensity] = useState(1);
  const [capDensityUnit, setCapDensityUnit] = useState("ff");
  const [sheetResistance, setSheetResistance] = useState(100);
  const [resistorWidth, setResistorWidth] = useState(1);
  const [tau, setTau] = useState(0.001);
  const [tauUnit, setTauUnit] = useState("us");

  const optimalValues = useMemo(() => {
    const values = [capDensity, sheetResistance, resistorWidth, tau];
    const allValid = values.every((value) => isFinite(value) && value > 0);
    if (!allValid) return null;

    const capDensityScale = CAP_DENSITY_UNITS.find((unit) => unit.key === capDensityUnit)?.factor;
    const tauScale = TAU_UNITS.find((unit) => unit.key === tauUnit)?.factor;
    if (!capDensityScale || !tauScale) return null;

    const capDensityFarads = capDensity * capDensityScale;
    const tauSeconds = tau * tauScale;
    const denominator = capDensityFarads * resistorWidth ** 2;
    if (!isFinite(denominator) || denominator <= 0) return null;

    const resistance = Math.sqrt((tauSeconds * sheetResistance) / denominator);
    if (!isFinite(resistance) || resistance <= 0) return null;

    const capacitance = tauSeconds / resistance;
    if (!isFinite(capacitance) || capacitance <= 0) return null;

    return { resistance, capacitance };
  }, [capDensity, capDensityUnit, resistorWidth, sheetResistance, tau, tauUnit]);

  return (
    <ToolCard
      title="RC Area Optimizer"
      icon={<Calculator className="text-indigo-400" size={18} />}
      footer={
        <div className="space-y-2">
          <div>
            <span className="text-zinc-400">Formulas: </span>
            <span className="font-mono text-zinc-300">Ropt = sqrt((tau * Rsheet) / (Cdensity * W^2)), Copt = tau / Ropt</span>
          </div>
          <div>
            <span className="text-zinc-400">Units: </span>
            <span className="font-mono text-zinc-300">Cdensity [selectable], Rsheet [ohms/square], W [um], tau [selectable]</span>
          </div>
          <div>
            <span className="text-zinc-400">Example: </span>
            <span className="font-mono text-zinc-300">tau=0.001, Rsheet=100, Cdensity=1, W=1 -&gt; Ropt~1e4 ohms, Copt~1e-13 F</span>
          </div>
        </div>
      }
    >
      <Row>
        <div>
          <Label>Capacitance Density</Label>
          <div className="grid grid-cols-2 gap-2">
            <NumberInput value={capDensity} onChange={setCapDensity} />
            <Select
              value={capDensityUnit}
              onChange={setCapDensityUnit}
              options={CAP_DENSITY_UNITS.map((unit) => ({ label: unit.label, value: unit.key }))}
            />
          </div>
        </div>
        <div>
          <Label>Sheet Resistance (ohms/square)</Label>
          <NumberInput value={sheetResistance} onChange={setSheetResistance} />
        </div>
      </Row>
      <Row>
        <div>
          <Label>Resistor Width (um)</Label>
          <NumberInput value={resistorWidth} onChange={setResistorWidth} />
        </div>
        <div>
          <Label>Target tau (R*C)</Label>
          <div className="grid grid-cols-2 gap-2">
            <NumberInput value={tau} onChange={setTau} />
            <Select
              value={tauUnit}
              onChange={setTauUnit}
              options={TAU_UNITS.map((unit) => ({ label: unit.label, value: unit.key }))}
            />
          </div>
        </div>
      </Row>
      <Row>
        <div>
          <Label>Optimal Resistance (ohms)</Label>
          <TextInput value={optimalValues ? formatNumber(optimalValues.resistance) : ""} readOnly />
        </div>
        <div>
          <Label>Optimal Capacitance (F)</Label>
          <TextInput value={optimalValues ? formatNumber(optimalValues.capacitance) : ""} readOnly />
        </div>
      </Row>
    </ToolCard>
  );
}
