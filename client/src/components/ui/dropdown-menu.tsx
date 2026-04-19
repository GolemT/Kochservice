import { type ReactNode } from 'react'

export function DropdownMenu({ children }: { children: ReactNode }) {
  return <div className="relative inline-block">{children}</div>
}

export function DropdownMenuTrigger({ children }: { asChild?: boolean; children: ReactNode }) {
  return <>{children}</>
}

export function DropdownMenuContent({ children }: { children: ReactNode; align?: string }) {
  return (
    <div className="absolute right-0 mt-1 z-50 min-w-32 bg-paper border-2 border-ink rounded-sketchy-sm shadow-ink-md flex flex-col">
      {children}
    </div>
  )
}

export function DropdownMenuItem({ onClick, children }: { onClick?: () => void; children: ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-2 text-sm font-hand text-ink hover:bg-paper-2 text-left w-full"
    >
      {children}
    </button>
  )
}
