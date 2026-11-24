import type { ReactNode } from 'react'

const icons = {
  search: (
    <>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m16 16 5 5" />
    </>
  ),
  filter: (
    <>
      <path d="M3 6h18M3 12h18M3 18h18" />
      <circle cx="14" cy="6" r="2" fill="currentColor" />
      <circle cx="8" cy="12" r="2" fill="currentColor" />
      <circle cx="15" cy="18" r="2" fill="currentColor" />
    </>
  ),
  chevron: <path d="m9 6 6 6-6 6" />,
  download: <path d="M12 3v12m-4-4 4 4 4-4M4 16v4h16v-4" />,
  location: (
    <>
      <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  education: <path d="m2 9 10-5 10 5-10 5L2 9Zm4 2v6c4 3 8 3 12 0v-6m4-2v7" />,
  salary: (
    <>
      <ellipse cx="15" cy="5" rx="6" ry="2.5" />
      <ellipse cx="8" cy="12" rx="6" ry="2.5" />
      <path d="M2 12v6c0 1.5 3 2.5 6 2.5s6-1 6-2.5v-6M2 15c0 1.5 3 2.5 6 2.5s6-1 6-2.5m7-10v10c0 1.3-2 2.3-5 2.5m5-7c0 1.3-2 2.3-5 2.5" />
    </>
  ),
  experience: (
    <>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M8 7V4h8v3M3 12l9 3 9-3" />
    </>
  ),
  person: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M3 21v-2c0-5 18-5 18 0v2H3Z" />
    </>
  ),
  people: (
    <>
      <circle cx="12" cy="7" r="3" />
      <path d="M6 20v-2c0-4 12-4 12 0v2H6ZM6 6a3 3 0 0 0 0 6m12-6a3 3 0 0 1 0 6M5 15c-2 0-3 1-3 3m17-3c2 0 3 1 3 3" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M7 3v4m10-4v4M3 10h18" />
    </>
  ),
  shield: (
    <path d="m12 22 3-2c4-3 5-6 5-12V5l-8-3-8 3v3c0 6 1 9 5 12l3 2Zm0-14v6m0 3h.01" />
  ),
  category: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </>
  ),
  bonus: (
    <path d="M4 11h16v10H4V11Zm-2-5h20v5H2V6Zm10 0v15m0-15c-8 0-7-6-4-4 2 0 4 4 4 4Zm0 0c8 0 7-6 4-4-2 0-4 4-4 4Z" />
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 6v6l4 2" />
    </>
  ),
  phone: (
    <path d="M7 3 4 4c-4 4 11 19 15 15l2-3-5-3-2 2c-3-1-5-3-6-6l2-2-3-4Z" />
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </>
  ),
} satisfies Record<string, ReactNode>

export type IconName = keyof typeof icons

export default function Icon({
  name,
  size = 24,
}: {
  name: IconName
  size?: number
}) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {icons[name]}
    </svg>
  )
}
