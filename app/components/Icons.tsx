import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement> & { size?: number }

const base = (size = 20) => ({ width: size, height: size, viewBox: '0 0 24 24' })

export function IconSun({ size = 20, ...props }: IconProps) {
  return (
    <svg {...base(size)} {...props} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.42-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  )
}

export function IconMoon({ size = 20, ...props }: IconProps) {
  return (
    <svg {...base(size)} {...props} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
    </svg>
  )
}

export function IconSearch({ size = 18, ...props }: IconProps) {
  return (
    <svg {...base(size)} {...props} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.2-3.2" />
    </svg>
  )
}

export function IconLoader({ size = 18, ...props }: IconProps) {
  return (
    <svg {...base(size)} {...props} fill="none" stroke="currentColor" strokeLinecap="round">
      <path d="M21 12a9 9 0 1 1-6.2-8.55" />
    </svg>
  )
}

export function IconChevronLeft({ size = 18, ...props }: IconProps) {
  return (
    <svg {...base(size)} {...props} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <path d="m15 18-6-6 6-6" />
    </svg>
  )
}

export function IconExternalLink({ size = 16, ...props }: IconProps) {
  return (
    <svg {...base(size)} {...props} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 3h7v7M10 14 21 3M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5" />
    </svg>
  )
}
