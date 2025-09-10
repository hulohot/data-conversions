Title: Persist module arrangement/visibility on desktop

Summary
- Save the Tools list state (order and visibility) to `localStorage` on desktop, matching the existing mobile behavior.

Motivation
- Currently, only the mobile `ModuleManager` persists changes via `localStorage`. Desktop users lose their customized order/visibility after refresh.

Implementation Notes
- In `src/components/ConversionSuite.jsx`, add a `useEffect` that writes `modules` to `localStorage` whenever it changes.
- Key: `ce-conv-modules` to remain consistent with existing mobile implementation.

Acceptance Criteria
- Reordering tools on desktop persists after refresh.
- Toggling visibility on desktop persists after refresh.
- No change to existing mobile persistence.

