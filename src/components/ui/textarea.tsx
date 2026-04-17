import * as React from 'react'
import { cn } from '@/lib/utils'

export interface TextareaProps extends React.ComponentProps<'textarea'> {
  maxLength?: number
  showCount?: boolean
}

export function Textarea({ className, maxLength, showCount, ...props }: TextareaProps) {
  const value = typeof props.value === 'string' ? props.value : ''

  return (
    <div className="relative">
      <textarea
        maxLength={maxLength}
        className={cn(
          'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none',
          className,
        )}
        {...props}
      />
      {showCount && maxLength && (
        <span className="absolute bottom-2 right-3 text-xs text-muted-foreground">
          {value.length}/{maxLength}
        </span>
      )}
    </div>
  )
}
