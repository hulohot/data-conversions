import React, { useState, useEffect, useRef } from 'react';

export function ModuleManager({ modules, setModules }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const isMobile = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);

  useEffect(() => { localStorage.setItem("ce-conv-modules", JSON.stringify(modules)); }, [modules]);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!isMobile) return;

    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('touchstart', handleClickOutside);
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [open, isMobile]);

  const onDragStart = (e, index) => {
    // Prevent dragging on mobile
    if (isMobile) {
      e.preventDefault();
      return;
    }
    e.dataTransfer.setData("text/plain", String(index));
  };

  const onDragOver = (e) => {
    if (isMobile) return;
    e.preventDefault();
  };

  const onDrop = (e, index) => {
    if (isMobile) return;
    e.preventDefault();
    const from = Number(e.dataTransfer.getData("text/plain"));
    if (Number.isNaN(from)) return;
    if (from === index) return;
    const next = [...modules];
    const [m] = next.splice(from, 1);
    next.splice(index, 0, m);
    setModules(next);
  };

  const toggle = (key) => {
    setModules(modules.map((m) => (m.key === key ? { ...m, visible: !m.visible } : m)));
  };

  return (
    <div
      ref={containerRef}
      className="relative group"
      {...(!isMobile && {
        onMouseEnter: () => setOpen(true),
        onMouseLeave: () => setOpen(false)
      })}
    >
      <div
        className="cursor-pointer select-none text-xs px-3 py-2 rounded-full border border-zinc-700 bg-zinc-900/60 text-zinc-300 hover:text-zinc-100 hover:border-zinc-500 transition touch-manipulation"
        onClick={() => setOpen(!open)}
        onTouchStart={(e) => {
          e.preventDefault();
          // On mobile, prevent the click from also firing
          if (isMobile) {
            setOpen(!open);
          }
        }}
      >
        Arrange
      </div>
      <div className={`absolute right-0 mt-2 w-64 sm:w-72 max-w-[calc(100vw-2rem)] rounded-lg sm:rounded-2xl border border-zinc-800 bg-black/80 backdrop-blur p-3 shadow-2xl ${open ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1 pointer-events-none"} transition-all duration-200`}
        onDragOver={onDragOver}
      >
        <div className="text-xs text-zinc-400 mb-2">
          {isMobile ? "Tap to toggle visibility" : "Drag to reorder • Toggle to show/hide"}
        </div>
        <ul className="space-y-2">
          {modules.map((m, i) => (
            <li key={m.key}
                draggable={!isMobile}
                onDragStart={(e) => onDragStart(e, i)}
                onDrop={(e) => onDrop(e, i)}
                className="flex items-center justify-between gap-2 px-2 py-3 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 touch-manipulation">
              <div className="flex items-center gap-2 flex-1">
                {!isMobile && <span className="font-mono text-zinc-400 cursor-grab">≡</span>}
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
