import React, { useState } from 'react';
import { Calculator } from "lucide-react";
import { BaseConverter } from './BaseConverter';
import { TimeFreq } from './TimeFreq';
import { PadBinary } from './PadBinary';
import { SizeConverter } from './SizeConverter';
import { Throughput } from './Throughput';
import { AsciiHex } from './AsciiHex';
import { Pow2Calculator } from './Pow2Calculator';
import { BitInverter } from './BitInverter';
import { TruthTable } from './TruthTable';
import { KMapSolver } from './KMapSolver';
import { XorCalculator } from './XorCalculator';
import { ModuleManager } from './ModuleManager';

export default function ConversionSuite() {
  const registry = {
    inverter: { title: "Bit Inverter", node: <BitInverter /> },
    pow2: { title: "2^n Calculator", node: <Pow2Calculator /> },
    base: { title: "Base Converter", node: <BaseConverter /> },
    timefreq: { title: "Time ↔ Frequency", node: <TimeFreq /> },
    pad: { title: "Pad Binary", node: <PadBinary /> },
    size: { title: "Size Converter", node: <SizeConverter /> },
    throughput: { title: "Throughput", node: <Throughput /> },
    ascii: { title: "ASCII ↔ Hex", node: <AsciiHex /> },
    truthtable: { title: "Truth Table", node: <TruthTable /> },
    kmap: { title: "K-Map Solver", node: <KMapSolver /> },
    xor: { title: "XOR Calculator", node: <XorCalculator /> },
  };

  const defaultModules = [
    { key: "inverter", title: registry.inverter.title, visible: true },
    { key: "pow2", title: registry.pow2.title, visible: true },
    { key: "base", title: registry.base.title, visible: true },
    { key: "timefreq", title: registry.timefreq.title, visible: true },
    { key: "pad", title: registry.pad.title, visible: true },
    { key: "size", title: registry.size.title, visible: true },
    { key: "throughput", title: registry.throughput.title, visible: true },
    { key: "ascii", title: registry.ascii.title, visible: true },
    { key: "truthtable", title: registry.truthtable.title, visible: true },
    { key: "kmap", title: registry.kmap.title, visible: true },
    { key: "xor", title: registry.xor.title, visible: true },
  ];

  const [modules, setModules] = useState(() => {
    try {
      const saved = localStorage.getItem("ce-conv-modules");
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure all modules exist and are visible
        const merged = defaultModules.map(defaultModule => {
          const savedModule = parsed.find(m => m.key === defaultModule.key);
          return savedModule || defaultModule;
        });
        return merged;
      }
    } catch {
      // Ignore errors when parsing localStorage
    }
    return defaultModules;
  });

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-zinc-950 via-black to-zinc-900 text-zinc-100">
      <header className="sticky top-0 z-10 backdrop-blur bg-black/40 border-b border-zinc-800">
        <div className="w-full sm:w-[70%] mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="h-8 w-8 rounded-xl bg-indigo-600 grid place-items-center shadow-lg"><Calculator size={18} /></div>
            <div>
              <h1 className="text-lg sm:text-xl font-semibold tracking-wide">CE Dark Conversions</h1>
              <p className="text-xs text-zinc-400 hidden sm:block">Everyday engineering calculators</p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <ModuleManager modules={modules} setModules={setModules} />
            <a href="#" className="text-xs text-zinc-400 hover:text-zinc-200">v0.4.0</a>
          </div>
        </div>
      </header>
      <main className="w-full sm:w-[70%] mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-4 sm:space-y-6">
        <div className="space-y-4 sm:space-y-5">
          {modules.filter((m) => m.visible).map((m) => (
            <React.Fragment key={m.key}>{registry[m.key]?.node}</React.Fragment>
          ))}
        </div>
      </main>
      <footer className="w-full sm:w-[70%] mx-auto px-3 sm:px-4 pb-6 sm:pb-10 pt-4 text-xs text-zinc-500">
        <p>Tips: Use underscores in numbers for readability. Signed two's complement view is available for binary input.</p>
      </footer>
    </div>
  );
}
