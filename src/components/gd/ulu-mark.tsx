export function UluMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {/* leaf — growth */}
      <path
        d="M12 7.6 C 12 4.2 14.6 2.6 17.2 2.6 C 16.7 5.7 14.7 7.4 12 7.6 Z"
        fill="currentColor"
      />
      {/* stem */}
      <path d="M12 7.2 L12 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      {/* breadfruit body */}
      <ellipse cx="12" cy="15" rx="6.2" ry="6.7" stroke="currentColor" strokeWidth="1.6" />
      {/* skin texture */}
      <circle cx="9.9" cy="13.4" r="0.75" fill="currentColor" />
      <circle cx="13.5" cy="13.8" r="0.75" fill="currentColor" />
      <circle cx="11.3" cy="16.7" r="0.75" fill="currentColor" />
      <circle cx="14.3" cy="16.9" r="0.75" fill="currentColor" />
    </svg>
  );
}
