import React, { useEffect, useState } from 'react';
import { Calculator } from "lucide-react";
import { version } from '../../package.json';
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
import { AESCalculator } from './AESCalculator';
import { ModuleManager } from './ModuleManager';

export default function ConversionSuite() {
  const [showDesktopSidebar, setShowDesktopSidebar] = useState(() => {
    // Sidebar starts closed by default
    return false;
  });
  const [filterQuery, setFilterQuery] = useState("");

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
    aes: { title: "AES Calculator", node: <AESCalculator /> },
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
    { key: "aes", title: registry.aes.title, visible: true },
  ];

  const [modules, setModules] = useState(() => {
    try {
      const saved = localStorage.getItem("ce-conv-modules");
      if (saved) {
        const parsed = JSON.parse(saved);
        // Preserve saved order; re-hydrate titles from registry; append any new defaults
        const seen = new Set();
        const validSaved = Array.isArray(parsed)
          ? parsed
              .filter((m) => m && registry[m.key])
              .map((m) => {
                seen.add(m.key);
                return { key: m.key, title: registry[m.key].title, visible: Boolean(m.visible) };
              })
          : [];
        const missing = defaultModules.filter((d) => !seen.has(d.key));
        return [...validSaved, ...missing];
      }
    } catch {
      // Ignore errors when parsing localStorage
    }
    return defaultModules;
  });

  // Persist module state on desktop as well (previously only mobile saved via ModuleManager)
  useEffect(() => {
    try {
      localStorage.setItem("ce-conv-modules", JSON.stringify(modules));
    } catch {
      // Swallow persistence errors silently
    }
  }, [modules]);

  const isDesktop = typeof window !== 'undefined' && !('ontouchstart' in window || navigator.maxTouchPoints > 0);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-zinc-950 via-black to-zinc-900 text-zinc-100">
      {/* Desktop Sidebar */}
      {isDesktop && showDesktopSidebar && (
        <div className="fixed left-0 top-0 h-full w-80 bg-zinc-900/95 backdrop-blur border-r border-zinc-800 shadow-xl z-40 overflow-y-auto">
          {/* Sidebar Header with Toggle */}
          <div className="p-4 border-b border-zinc-800">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-zinc-200">Tool Manager</h3>
              <button
                onClick={() => setShowDesktopSidebar(false)}
                className="cursor-pointer select-none text-xs px-2 py-1 rounded border border-zinc-700 bg-zinc-800/60 text-zinc-300 hover:text-zinc-100 hover:border-zinc-500 transition-colors"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-zinc-400">Drag to reorder • Toggle to show/hide</p>
            <div className="mt-3">
              <input
                type="text"
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                placeholder="Filter tools..."
                className="w-full rounded-lg bg-zinc-950 border border-zinc-800 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-zinc-200 placeholder-zinc-500"
                aria-label="Filter tools"
              />
            </div>
          </div>

          {/* Tools List */}
          <div className="p-4">
            <ul className="space-y-2">
              {modules
                .filter((m) => m.title.toLowerCase().includes(filterQuery.trim().toLowerCase()))
                .map((m, i) => (
                <li key={m.key}
                    draggable={filterQuery.trim() === ''}
                    onDragStart={(e) => {
                      if (filterQuery.trim() !== '') return;
                      e.dataTransfer.setData("text/plain", String(i));
                    }}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      if (filterQuery.trim() !== '') return;
                      const from = Number(e.dataTransfer.getData("text/plain"));
                      if (Number.isNaN(from) || from === i) return;
                      const next = [...modules];
                      const [moved] = next.splice(from, 1);
                      next.splice(i, 0, moved);
                      setModules(next);
                    }}
                    className={`flex items-center justify-between gap-2 px-3 py-3 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700 transition-colors ${filterQuery.trim() === '' ? 'cursor-move' : ''}`}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <span className={`font-mono text-zinc-400 ${filterQuery.trim() === '' ? 'cursor-grab' : ''}`}>≡</span>
                    <span className="text-sm text-zinc-200 flex-1">{m.title}</span>
                  </div>
                  <label className="inline-flex items-center gap-2 text-xs text-zinc-300">
                    <input
                      type="checkbox"
                      className="accent-indigo-500 w-4 h-4"
                      checked={m.visible}
                      onChange={() => {
                        setModules(modules.map(mod =>
                          mod.key === m.key ? { ...mod, visible: !mod.visible } : mod
                        ));
                      }}
                    />
                    {m.visible ? "On" : "Off"}
                  </label>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Sidebar Toggle Button (only when sidebar is hidden) */}
      {!showDesktopSidebar && isDesktop && (
        <button
          onClick={() => setShowDesktopSidebar(true)}
          className="fixed top-1/2 left-4 transform -translate-y-1/2 z-50 cursor-pointer select-none px-4 py-3 rounded-r-lg border border-zinc-700 bg-zinc-900/90 backdrop-blur text-zinc-300 hover:text-zinc-100 hover:border-zinc-500 hover:bg-zinc-800/90 transition-all duration-200 shadow-lg group"
          title="Open Tool Manager"
        >
          <div className="flex items-center gap-2">
            <div className="w-1 h-6 bg-indigo-500 rounded-full group-hover:bg-indigo-400 transition-colors"></div>
            <span className="text-sm font-medium">Tools</span>
          </div>
        </button>
      )}

      <header className={`sticky top-0 z-10 backdrop-blur bg-black/40 border-b border-zinc-800 ${isDesktop && showDesktopSidebar ? 'ml-80' : ''}`}>
        <div className={`w-full ${isDesktop ? 'sm:w-full' : 'sm:w-[70%]'} mx-auto px-4 py-4 flex items-center justify-between transition-all duration-200`}>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="h-8 w-8 rounded-xl bg-indigo-600 grid place-items-center shadow-lg"><Calculator size={18} /></div>
            <div>
              <h1 className="text-lg sm:text-xl font-semibold tracking-wide">CE Dark Conversions</h1>
              <p className="text-xs text-zinc-400 hidden sm:block">Everyday engineering calculators</p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            {!isDesktop && <ModuleManager modules={modules} setModules={setModules} />}
            <a href="#" className="text-xs text-zinc-400 hover:text-zinc-200">v{version}</a>
          </div>
        </div>
      </header>

      <main className={`px-3 sm:px-4 py-4 sm:py-6 space-y-4 sm:space-y-6 transition-all duration-200 ${isDesktop && showDesktopSidebar ? 'ml-80' : 'w-full sm:w-[70%] mx-auto'}`}>
        <div className="space-y-4 sm:space-y-5">
          {modules.filter((m) => m.visible).map((m) => (
            <React.Fragment key={m.key}>{registry[m.key]?.node}</React.Fragment>
          ))}
        </div>
      </main>

      <footer className={`px-3 sm:px-4 pb-6 sm:pb-10 pt-4 text-xs text-zinc-500 transition-all duration-200 ${isDesktop && showDesktopSidebar ? 'ml-80' : 'w-full sm:w-[70%] mx-auto'}`}>
        <p>Tips: Use underscores in numbers for readability. Signed two's complement view is available for binary input.</p>
      </footer>
    </div>
  );
}
