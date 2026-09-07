import type { Club } from "../types";

export function ClubPicker({
  clubs,
  value,
  onChange,
  includeInactive = false,
}: {
  clubs: Club[];
  value: string | null;
  onChange: (clubId: string) => void;
  includeInactive?: boolean;
}) {
  const list = clubs
    .filter((c) => includeInactive || c.active)
    .sort((a, b) => a.order - b.order);

  return (
    <select
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      style={{ width: "100%" }}
    >
      <option value="" disabled>
        Select a club…
      </option>
      {list.map((c) => (
        <option key={c.id} value={c.id}>
          {c.name}
          {!c.active ? " (retired)" : ""}
        </option>
      ))}
    </select>
  );
}
