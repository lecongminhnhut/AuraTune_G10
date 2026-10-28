const paths = {
  home: <><path d="m3 10 9-7 9 7" /><path d="M5 9v11h14V9M9 20v-6h6v6" /></>,
  search: <><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 4.5 4.5" /></>,
  compass: <><circle cx="12" cy="12" r="9" /><path d="m15.8 8.2-2.4 5.2-5.2 2.4 2.4-5.2 5.2-2.4Z" /></>,
  chart: <><path d="M4 19V5M4 19h17" /><path d="m7 15 4-5 3 2 5-7" /></>,
  library: <><path d="M4 5h15M4 10h15M4 15h9" /><path d="M3 3v16M20 4v14" /></>,
  plus: <><path d="M12 5v14M5 12h14" /></>,
  arrowLeft: <><path d="m15 18-6-6 6-6" /></>,
  arrowRight: <><path d="m9 18 6-6-6-6" /></>,
  play: <><path d="m8 5 12 7-12 7V5Z" fill="currentColor" stroke="none" /></>,
  pause: <><path d="M8 5h3v14H8zM15 5h3v14h-3z" fill="currentColor" stroke="none" /></>,
  heart: <><path d="M20.8 8.8c0 4.1-8.8 10-8.8 10S3.2 12.9 3.2 8.8A4.7 4.7 0 0 1 12 6.4a4.7 4.7 0 0 1 8.8 2.4Z" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3.5 2" /></>,
  more: <><circle cx="5" cy="12" r="1" fill="currentColor" /><circle cx="12" cy="12" r="1" fill="currentColor" /><circle cx="19" cy="12" r="1" fill="currentColor" /></>,
  shuffle: <><path d="m18 14 3 3-3 3M3 7h2.5c4.5 0 7 10 11.5 10H21M18 4l3 3-3 3M3 17h2.5c1.4 0 2.7-1.3 4-3M15 7h2c1.5 0 2.7-1.2 4-3" /></>,
  previous: <><path d="M6 5v14M19 6l-9 6 9 6V6Z" /></>,
  next: <><path d="M18 5v14M5 6l9 6-9 6V6Z" /></>,
  repeat: <><path d="m17 2 3 3-3 3M4 11V9a4 4 0 0 1 4-4h12M7 22l-3-3 3-3M20 13v2a4 4 0 0 1-4 4H4" /></>,
  volume: <><path d="M4 10v4h4l5 4V6l-5 4H4Z" /><path d="M16 9a5 5 0 0 1 0 6M18.5 6.5a9 9 0 0 1 0 11" /></>,
  queue: <><path d="M4 6h16M4 11h10M4 16h10" /><path d="m17 14 4 2.5-4 2.5v-5Z" /></>,
  lyrics: <><path d="M4 5h16M4 10h16M4 15h11" /><path d="M18 14v5M18 14l3-1" /></>,
  monitor: <><rect x="3" y="4" width="18" height="13" rx="2" /><path d="M8 21h8M12 17v4" /></>,
  bell: <><path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" /></>,
  check: <><path d="m5 12 4 4L19 6" /></>,
  spark: <><path d="m12 3 1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7L12 3Z" /><path d="m19 16 .8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8L19 16Z" /></>,
  headphones: <><path d="M3 13v-1a9 9 0 0 1 18 0v1" /><path d="M5 12h2a2 2 0 0 1 2 2v4H7a4 4 0 0 1-4-4v-1a1 1 0 0 1 1-1ZM19 12h-2a2 2 0 0 0-2 2v4h2a4 4 0 0 0 4-4v-1a1 1 0 0 0-1-1Z" /></>,
  close: <><path d="m6 6 12 12M18 6 6 18" /></>,
  user: <><circle cx="12" cy="8" r="3.5" /><path d="M5 20a7 7 0 0 1 14 0" /></>,
  download: <><path d="M12 3v11" /><path d="m7 10 5 5 5-5M4 20h16" /></>,
}

export default function Icon({ name, size = 20, className = '', strokeWidth = 1.8 }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name] ?? paths.spark}
    </svg>
  )
}
