import type { Club } from "../types";
import { groupClubs } from "../lib/clubGrouping";

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
  const filtered = clubs.filter((c) => includeInactive || c.active);
  const groups = groupClubs(filtered);

  return (
    <select
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      style={{ width: "100%" }}
    >
      <option value="" disabled>
        Select a club…
      </option>
      {groups.map(({ group, clubs: groupClubList }) => (
        <optgroup key={group} label={group}>
          {groupClubList.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
              {!c.active ? " (retired)" : ""}
            </option>
          ))}
        </optgroup>
      ))}
    </select>
  );
}
