/** A passport with its machine-readable lines, one blacked out. */
export function Mark({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <rect x="4" y="2" width="24" height="28" rx="3" fill="none" stroke="currentColor" strokeWidth="2.5" />
      <circle cx="16" cy="10.5" r="3.5" fill="none" stroke="currentColor" strokeWidth="2" />
      <rect x="8" y="19" width="16" height="3" fill="currentColor" />
      <rect x="8" y="24" width="9" height="3" fill="currentColor" />
      <rect x="19" y="24" width="5" height="3" fill="#2e55c8" />
    </svg>
  );
}
