import React, { useMemo, useState } from 'react';
import { Calculator } from "lucide-react";
import { formatNumber } from '../utils/conversionUtils';
import {
  ToolCard,
  Label,
  NumberInput,
  Row,
  TextInput
} from './UIComponents';

export function RCAreaOptimizer() {
  const [capDensity, setCapDensity] = useState(1e-15);
  const [sheetResistance, setSheetResistance] = useState(100);
  const [resistorWidth, setResistorWidth] = useState(1);
  const [tau, setTau] = useState(1e-9);

  const optimalValues = useMemo(() => {
    const values = [capDensity, sheetResistance, resistorWidth, tau];
    const allValid = values.every((value) => isFinite(value) && value > 0);
    if (!allValid) return null;

    const denominator = capDensity * resistorWidth ** 2;
    if (!isFinite(denominator) || denominator <= 0) return null;

    const resistance = Math.sqrt((tau * sheetResistance) / denominator);
    if (!isFinite(resistance) || resistance <= 0) return null;

    const capacitance = tau / resistance;
    if (!isFinite(capacitance) || capacitance <= 0) return null;

    return { resistance, capacitance };
  }, [capDensity, resistorWidth, sheetResistance, tau]);

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
            <span className="font-mono text-zinc-300">Cdensity [F/um^2], Rsheet [ohms/square], W [um], tau [s]</span>
          </div>
          <div>
            <span className="text-zinc-400">Example: </span>
            <span className="font-mono text-zinc-300">tau=1e-9, Rsheet=100, Cdensity=1e-15, W=1 -&gt; Ropt~1e4 ohms, Copt~1e-13 F</span>
          </div>
        </div>
      }
    >
      <Row>
        <div>
          <Label>Capacitance Density (F/um^2)</Label>
          <NumberInput value={capDensity} onChange={setCapDensity} />
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
          <Label>Target tau (R*C seconds)</Label>
          <NumberInput value={tau} onChange={setTau} />
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
