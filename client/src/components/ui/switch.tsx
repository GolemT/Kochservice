import { type InputHTMLAttributes, forwardRef } from 'react'

interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  onCheckedChange?: (checked: boolean) => void
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  ({ onCheckedChange, className = '', ...props }, ref) => (
    <input
      ref={ref}
      type="checkbox"
      className={`cursor-pointer accent-accent ${className}`}
      onChange={(e) => onCheckedChange?.(e.target.checked)}
      {...props}
    />
  ),
)
Switch.displayName = 'Switch'
