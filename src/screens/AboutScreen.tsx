import { WaveDivider } from "../components/art/WaveDivider";

export function AboutScreen({ onBack }: { onBack: () => void }) {
  return (
    <div className="stack">
      <button className="btn btn-ghost" onClick={onBack}>
        ← Back to settings
      </button>

      <h2 style={{ fontSize: 22 }}>About Range Book</h2>
      <WaveDivider />

      <p className="text-dim">
        A personal yardage book: log range sessions to build real carry/total numbers per club, then use those
        numbers on the course to pick a club for a given shot. Everything below explains how it works.
      </p>

      <div className="card">
        <div className="card-title">Installing on your phone</div>
        <p className="text-dim">
          <strong>iPhone:</strong> open this page in <strong>Safari</strong> (not Chrome) → tap the Share icon →{" "}
          <strong>Add to Home Screen</strong>. You'll get an icon that opens full-screen, no browser bar.
        </p>
        <p className="text-dim" style={{ marginTop: 8 }}>
          <strong>Android:</strong> open in Chrome → tap the three-dot menu (top right) →{" "}
          <strong>Install app</strong> or <strong>Add to Home screen</strong>.
        </p>
        <p className="text-faint" style={{ marginTop: 8 }}>
          Once installed it keeps working with no signal — it caches itself and reads your data locally, so it's
          fine at a range or course with spotty service.
        </p>
      </div>

      <div className="card">
        <div className="card-title">Your bag</div>
        <p className="text-dim">
          Add clubs from the grouped quick-add list (Woods, Hybrids, Irons, Wedges, Putter), or type a custom
          name. The bag view groups and sorts them the same way automatically — no manual reordering needed.
        </p>
        <p className="text-dim" style={{ marginTop: 8 }}>
          <strong>Retire</strong> hides a club from pickers but keeps its history — use this if you swap a club
          out but might bring it back. <strong>Delete</strong> removes it and its logged sessions permanently.
        </p>
      </div>

      <div className="card">
        <div className="card-title">Logging a session</div>
        <p className="text-dim">
          Pick a club and a swing length — the four positions match a clock face on the backswing: 7:30 (knee),
          9:00 (hip), 10:30 (shoulder), or full swing.
        </p>
        <p className="text-dim" style={{ marginTop: 8 }}>
          Hit 10 shots and enter each one's carry, total, and dispersion (yards left/right of your target line —
          negative for left, positive for right). We drop the 2 shortest and 2 longest carries and average the
          remaining 6, so one chunked shot or one flush strike doesn't skew the number.
        </p>
        <p className="text-dim" style={{ marginTop: 8 }}>
          Log more sessions for the same club/swing-length over time and the average updates to reflect all of
          them — it doesn't just replace the old number, it blends in.
        </p>
      </div>

      <div className="card">
        <div className="card-title">Club detail & trends</div>
        <p className="text-dim">
          Tap any club in the Bag to see its average carry, total, rollout, and dispersion per swing length, plus
          a trend line across sessions. "Longest carry" is a separate number — your single best recorded shot,
          pulled from the raw data including the outliers the trimmed average drops, so it answers "if I really
          catch one, how far does it go?"
        </p>
      </div>

      <div className="card">
        <div className="card-title">Rangefinder</div>
        <p className="text-dim">
          Enter the distance to your target, pick the lie you're hitting from, and it lists every club/swing-length
          combo ranked by how close its total distance lands to that number — closest first.
        </p>
        <p className="text-dim" style={{ marginTop: 8 }}>
          Lie changes the numbers (rough and sand carry shorter) — the percentage shows right on each lie button,
          and every card shows the unadjusted fairway number underneath so you can see exactly what changed.
        </p>
        <p className="text-dim" style={{ marginTop: 8 }}>
          If there's a hazard to carry (bunker, water), fill in <strong>Must carry</strong> — anything that
          wouldn't clear it is left off the list entirely, rather than just ranked lower.
        </p>
      </div>

      <div className="card">
        <div className="card-title">Your data</div>
        <p className="text-dim">
          Everything is stored locally on your device only — there's no account, no server, and nobody else can
          see it, including other people you share this app's link with (they get their own separate, empty bag).
        </p>
        <p className="text-dim" style={{ marginTop: 8 }}>
          Since there's no cloud backup, use <strong>Export backup</strong> in Settings occasionally — especially
          before a phone upgrade — to save a JSON file you can re-import later. Importing replaces all current
          data, so it asks you to confirm first.
        </p>
      </div>
    </div>
  );
}
