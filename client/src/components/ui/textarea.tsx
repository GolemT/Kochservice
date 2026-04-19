import { type TextareaHTMLAttributes, forwardRef } from 'react'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  showCount?: boolean
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = '', showCount: _showCount, ...props }, ref) => (
    <textarea
      ref={ref}
      className={`w-full px-3 py-2 border-2 border-ink rounded-sketchy-sm bg-paper text-ink font-hand text-sm placeholder:text-ink-3 outline-none focus:shadow-ink-sm transition-all resize-y ${className}`}
      {...props}
    />
  ),
)
Textarea.displayName = 'Textarea'
