import { type HTMLAttributes, forwardRef } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ hover = false, className = '', children, ...props }, ref) => (
    <div
      ref={ref}
      className={`bg-paper border-2 border-ink rounded-card shadow-ink-card ${hover ? 'transition-all hover:-translate-y-0.5 hover:shadow-ink-lg cursor-pointer' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  ),
)
Card.displayName = 'Card'
