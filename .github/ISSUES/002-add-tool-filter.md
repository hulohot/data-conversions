Title: Add tool filter to Tool Manager (desktop + mobile)

Summary
- Add a simple text filter to quickly find tools by name in the Tool Manager.

Motivation
- The list of tools is growing. Scrolling to find a specific one adds friction, especially on mobile.

Implementation Notes
- Desktop: In `src/components/ConversionSuite.jsx`, add a small search input in the sidebar header; filter the list by title.
- Mobile: In `src/components/ModuleManager.jsx`, add a small search input at the top of the dropdown; filter the list by title.
- Filtering should be case-insensitive and non-destructive (does not modify saved state), just narrows the visible list in the manager views.

Acceptance Criteria
- Typing in the filter input reduces the list to matching tools in both desktop and mobile managers.
- Clearing the filter shows all tools again.
- No change to how modules are shown in the main content area (filter only affects the manager views).

