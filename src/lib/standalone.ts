interface NavigatorStandalone extends Navigator {
  standalone?: boolean;
}

/** True when running installed (Home Screen / desktop PWA), not a normal browser tab. */
export function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  const iosStandalone = (window.navigator as NavigatorStandalone).standalone === true;
  const displayModeStandalone = window.matchMedia?.("(display-mode: standalone)").matches ?? false;
  return iosStandalone || displayModeStandalone;
}
