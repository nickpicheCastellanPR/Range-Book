export function WaveDivider({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 28"
      preserveAspectRatio="none"
      width="100%"
      height="20"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M0,18 C25,8 50,8 75,18 C100,28 125,28 150,18 C175,8 200,8 225,18 C250,28 275,28 300,18 C325,8 350,8 375,18 C387,23 393,23 400,18 L400,28 L0,28 Z"
        fill="var(--accent-dim)"
      />
      <path
        d="M0,14 C25,4 50,4 75,14 C100,24 125,24 150,14 C175,4 200,4 225,14 C250,24 275,24 300,14 C325,4 350,4 375,14 C387,19 393,19 400,14 L400,28 L0,28 Z"
        fill="var(--accent)"
      />
      <path
        d="M0,14 C25,4 50,4 75,14 C100,24 125,24 150,14 C175,4 200,4 225,14 C250,24 275,24 300,14 C325,4 350,4 375,14 C387,19 393,19 400,14"
        fill="none"
        stroke="var(--foam)"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
