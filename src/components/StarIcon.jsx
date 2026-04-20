export function StarIcon({ filled = false }) {
  return (
    <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 24 24">
      <path
        d="m12 2.8 2.82 5.72 6.31.92-4.57 4.45 1.08 6.28L12 17.2l-5.64 2.97 1.08-6.28-4.57-4.45 6.31-.92L12 2.8Z"
        fill={filled ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}
