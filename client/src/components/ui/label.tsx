import { type LabelHTMLAttributes, forwardRef } from 'react'

export const Label = forwardRef<HTMLLabelElement, LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className = '', ...props }, ref) => (
    <label
      ref={ref}
      className={`text-sm font-hand text-ink ${className}`}
      {...props}
    />
  ),
)
Label.displayName = 'Label'
