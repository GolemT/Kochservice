import { type ButtonHTMLAttributes, forwardRef } from 'react'

type Variant = 'default' | 'accent' | 'dark' | 'outline' | 'destructive'
type Size = 'default' | 'sm' | 'lg' | 'icon'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
}

const base =
  'inline-flex items-center justify-center gap-2 font-hand font-bold border-2 border-ink rounded-sketchy-sm cursor-pointer transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed disabled:active:translate-x-0 disabled:active:translate-y-0'

const variants: Record<Variant, string> = {
  default:     'bg-paper text-ink shadow-ink-sm hover:shadow-ink',
  accent:      'bg-accent text-white shadow-ink-sm hover:shadow-ink',
  dark:        'bg-ink text-paper shadow-ink-sm hover:shadow-ink',
  outline:     'bg-transparent text-ink shadow-ink-sm hover:shadow-ink',
  destructive: 'bg-red-600 text-white border-red-900 shadow-[2px_2px_0_#7f1d1d] hover:shadow-[3px_3px_0_#7f1d1d]',
}

const sizes: Record<Size, string> = {
  default: 'px-4 py-2 text-sm',
  sm:      'px-3 py-1.5 text-xs',
  lg:      'px-6 py-3 text-base',
  icon:    'w-9 h-9 p-0',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'default', size = 'default', className = '', children, ...props }, ref) => (
    <button
      ref={ref}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  ),
)
Button.displayName = 'Button'
