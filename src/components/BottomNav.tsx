export type Screen = "bag" | "log" | "rangefinder" | "settings";

const ITEMS: { key: Screen; label: string; icon: string }[] = [
  { key: "bag", label: "Bag", icon: "🏌️" },
  { key: "log", label: "Log", icon: "📝" },
  { key: "rangefinder", label: "Finder", icon: "🎯" },
  { key: "settings", label: "Settings", icon: "⚙️" },
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
          <span className="icon">{item.icon}</span>
          <span className="label">{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
