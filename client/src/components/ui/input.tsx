import { type InputHTMLAttributes, forwardRef } from 'react'

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className = '', ...props }, ref) => (
    <input
      ref={ref}
      className={`w-full px-3 py-2 border-2 border-ink rounded-sketchy-sm bg-paper text-ink font-hand text-sm placeholder:text-ink-3 outline-none focus:shadow-ink-sm transition-all ${className}`}
      {...props}
    />
  ),
)
Input.displayName = 'Input'
