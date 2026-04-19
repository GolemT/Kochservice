import { type HTMLAttributes } from 'react'

export function Badge({ className = '', ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={`inline-block text-xs font-hand border border-ink-3 rounded px-2 py-0.5 text-ink-2 ${className}`}
      {...props}
    />
  )
}
