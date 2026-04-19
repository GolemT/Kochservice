interface SeparatorProps {
  orientation?: 'horizontal' | 'vertical'
  className?: string
}

export function Separator({ orientation = 'horizontal', className = '' }: SeparatorProps) {
  return orientation === 'vertical'
    ? <div className={`w-px bg-ink-3 self-stretch ${className}`} />
    : <div className={`h-px w-full bg-ink-3 ${className}`} />
}
