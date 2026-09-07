import { useEffect, useState } from "react";
import { isStandalone } from "../lib/standalone";

const DISMISS_KEY = "range-book:install-banner-dismissed";

export function InstallBanner({ onLearnMore }: { onLearnMore: () => void }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isStandalone()) return;
    try {
      if (localStorage.getItem(DISMISS_KEY) === "1") return;
    } catch {
      // ignore storage access issues, just show the banner
    }
    setVisible(true);
  }, []);

  if (!visible) return null;

  function dismiss() {
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      // ignore
    }
    setVisible(false);
  }

  return (
    <div className="install-banner">
      <p>Install this on your home screen for full-screen, offline access.</p>
      <div className="row" style={{ gap: 8, marginTop: 8 }}>
        <button className="btn btn-ghost" style={{ flex: 1 }} onClick={dismiss}>
          Dismiss
        </button>
        <button className="btn btn-primary" style={{ flex: 1 }} onClick={onLearnMore}>
          Show me how
        </button>
      </div>
    </div>
  );
}
