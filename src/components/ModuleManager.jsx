import React, { useState, useEffect, useRef } from 'react';

export function ModuleManager({ modules, setModules }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [filterQuery, setFilterQuery] = useState("");
  const containerRef = useRef(null);
  const isMobile = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);

  useEffect(() => { localStorage.setItem("ce-conv-modules", JSON.stringify(modules)); }, [modules]);

  // Close mobile dropdown when clicking outside
  useEffect(() => {
    if (!isMobile) return;

    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setMobileOpen(false);
      }
    };

    if (mobileOpen) {
      document.addEventListener('touchstart', handleClickOutside);
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [mobileOpen, isMobile]);

  const toggle = (key) => {
    setModules(modules.map((m) => (m.key === key ? { ...m, visible: !m.visible } : m)));
  };

  // Only render on mobile - desktop sidebar is handled in ConversionSuite
  if (!isMobile) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className="relative"
    >
      <div
        className="cursor-pointer select-none text-xs px-3 py-2 rounded-full border border-zinc-700 bg-zinc-900/60 text-zinc-300 hover:text-zinc-100 hover:border-zinc-500 transition touch-manipulation"
        onClick={() => setMobileOpen(!mobileOpen)}
        onTouchStart={(e) => {
          e.preventDefault();
          // On mobile, prevent the click from also firing
          if (isMobile) {
            setMobileOpen(!mobileOpen);
          }
        }}
      >
        Arrange
      </div>
      <div className={`absolute right-0 mt-2 w-64 sm:w-72 max-w-[calc(100vw-2rem)] rounded-lg sm:rounded-2xl border border-zinc-800 bg-black/80 backdrop-blur p-3 shadow-2xl ${mobileOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1 pointer-events-none"} transition-all duration-200 z-50`}
      >
        <div className="text-xs text-zinc-400 mb-2">Tap to toggle visibility</div>
        <div className="mb-2">
          <input
            type="text"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder="Filter tools..."
            className="w-full rounded-lg bg-zinc-950 border border-zinc-800 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 text-xs text-zinc-200 placeholder-zinc-500"
            aria-label="Filter tools"
          />
        </div>
        <ul className="space-y-2">
          {modules
            .filter((m) => m.title.toLowerCase().includes(filterQuery.trim().toLowerCase()))
            .map((m) => (
            <li key={m.key}
                className="flex items-center justify-between gap-2 px-2 py-3 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 touch-manipulation">
              <div className="flex items-center gap-2 flex-1">
                <span className="text-sm text-zinc-200 flex-1">{m.title}</span>
              </div>
              <label className="inline-flex items-center gap-2 text-xs text-zinc-300 touch-manipulation">
                <input
                  type="checkbox"
                  className="accent-indigo-500 w-4 h-4"
                  checked={m.visible}
                  onChange={() => toggle(m.key)}
                />
                {m.visible ? "Visible" : "Hidden"}
              </label>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
