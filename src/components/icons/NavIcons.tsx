const common = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/** Anchor — the bag: what you carry. */
export function AnchorIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" {...common}>
      <circle cx="12" cy="5" r="2.2" />
      <path d="M12 7.2V21" />
      <path d="M7 11H3.5C4 15.5 7.5 19 12 21" />
      <path d="M17 11h3.5C20 15.5 16.5 19 12 21" />
      <path d="M8 11h8" />
    </svg>
  );
}

/** Open logbook — logging a session. */
export function LogbookIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" {...common}>
      <path d="M12 6.5C10 5 6.5 4.5 4 5v13.5c2.5-.5 6 0 8 1.5" />
      <path d="M12 6.5c2-1.5 5.5-2 8-1.5v13.5c-2.5-.5-6 0-8 1.5V6.5Z" />
      <path d="M7 9h3M7 12h3M14 9h3M14 12h3" />
    </svg>
  );
}

/** Compass — finding the right club. */
export function CompassNavIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" {...common}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M14.8 9.2 12 12l-2.8 2.8L12 12Z" fill="currentColor" stroke="none" />
      <path d="M14.8 9.2 12 12 9.2 14.8" />
    </svg>
  );
}

/** Ship's wheel — settings / trim the course. */
export function WheelIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" {...common}>
      <circle cx="12" cy="12" r="3.4" />
      <circle cx="12" cy="12" r="8.4" />
      <path d="M12 3.6V8.6M12 15.4V20.4M3.6 12H8.6M15.4 12H20.4M5.9 5.9l3.5 3.5M14.6 14.6l3.5 3.5M18.1 5.9l-3.5 3.5M9.4 14.6l-3.5 3.5" />
    </svg>
  );
}
