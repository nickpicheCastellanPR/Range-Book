import type { ComponentType } from "react";
import { AnchorIcon, CompassNavIcon, LogbookIcon, WheelIcon } from "./icons/NavIcons";

export type Screen = "bag" | "log" | "rangefinder" | "settings";

const ITEMS: { key: Screen; label: string; Icon: ComponentType }[] = [
  { key: "bag", label: "Bag", Icon: AnchorIcon },
  { key: "log", label: "Log", Icon: LogbookIcon },
  { key: "rangefinder", label: "Finder", Icon: CompassNavIcon },
  { key: "settings", label: "Settings", Icon: WheelIcon },
];

export function BottomNav({
  active,
  onChange,
}: {
  active: Screen;
  onChange: (s: Screen) => void;
}) {
  return (
    <nav className="bottom-nav">
      {ITEMS.map((item) => (
        <button
          key={item.key}
          className={`nav-item${active === item.key ? " active" : ""}`}
          onClick={() => onChange(item.key)}
        >
          <span className="icon">
            <item.Icon />
          </span>
          <span className="label">{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
