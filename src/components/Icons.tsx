// Hand-authored inline SVG icons (no lucide-react / component library — the
// excluded-deps list forbids it). Ported from the marks in design.html. Each
// icon is aria-hidden by default; semantic meaning is carried by adjacent text.

interface IconProps {
  size?: number;
  className?: string;
}

/** The SnowRaven raven + clover-leaf wordmark mark. */
export function RavenMark({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M5 19c0-5.5 4.2-9.5 9.6-9.5 2.4 0 3.9.8 5.1 1.9l4.6-2.2c.6-.3 1.2.4.8.95L22.7 14c.7 1.1 1.1 2.5 1.1 4 0 5.2-4 8.5-9.2 8.5H6.4c-.6 0-.9-.7-.5-1.15L8 23.2C6.1 22.4 5 20.9 5 19Z" />
      <circle cx="13" cy="15.4" r="1.35" fill="var(--sr-bg)" />
      <path d="M27.6 6.1c-1.9.2-3.2 1-3.9 2.2.9.5 2.4.4 3.4-.4.2 1.3-.2 2.6-1.1 3.3 1.5.2 3-1 3.3-2.8.3-1.6-.4-2.4-1.7-2.3Z" />
    </svg>
  );
}

/** Copy / clipboard glyph. */
export function CopyIcon({ size = 12, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      className={className}
      aria-hidden="true"
    >
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M5 15V5a2 2 0 0 1 2-2h10" />
    </svg>
  );
}

/** Check / success glyph. */
export function CheckIcon({ size = 12 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      aria-hidden="true"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

/** Alert / info circle glyph. */
export function AlertIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v5" />
      <path d="M12 16h.01" />
    </svg>
  );
}

/** Map-pin glyph (the calm not-on-checklist state). */
export function PinIcon({ size = 22 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <path d="M12 22s8-4.5 8-11.8A8 8 0 0 0 4 10.2C4 17.5 12 22 12 22Z" />
      <circle cx="12" cy="10" r="2.6" />
    </svg>
  );
}

/** Key glyph (missing-keys nudge). */
export function KeyIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <path d="m15.5 7.5-7 7a3.5 3.5 0 1 1-2-2l1.6-1.6" />
      <circle cx="16.5" cy="6.5" r="3.5" />
    </svg>
  );
}

/** Right-arrow glyph (Go to Settings →). */
export function ArrowRightIcon({ size = 13 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      aria-hidden="true"
    >
      <path d="M5 12h14M13 5l7 7-7 7" />
    </svg>
  );
}

/** Shield glyph (permission grant). */
export function ShieldIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <path d="M12 22s8-3 8-10V5l-8-3-8 3v7c0 7 8 10 8 10Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

/** Eye glyph (reveal a masked key). */
export function EyeIcon({ size = 17 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

/** Eye-off glyph (hide a revealed key). */
export function EyeOffIcon({ size = 17 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <path d="M9.9 4.2A9.1 9.1 0 0 1 12 4c6.5 0 10 7 10 7a13.2 13.2 0 0 1-2.2 3" />
      <path d="M6.6 6.6A13.2 13.2 0 0 0 2 11s3.5 7 10 7a9.1 9.1 0 0 0 4.4-1.1" />
      <path d="m3 3 18 18" />
    </svg>
  );
}

/** Lock glyph (the privacy line). */
export function LockIcon({ size = 15 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <rect x="4" y="10" width="16" height="11" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </svg>
  );
}
