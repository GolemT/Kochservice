import * as React from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from './popover'
import { Button } from './button'
import { Input } from './input'
import { cn } from '@/lib/utils'

export interface ComboboxOption {
  value: string
  label: string
}

interface ComboboxProps {
  options: ComboboxOption[]
  value: string
  onValueChange: (value: string) => void
  placeholder?: string
  searchPlaceholder?: string
  emptyText?: string
}

export function Combobox({
  options,
  value,
  onValueChange,
  placeholder = 'Select option',
  searchPlaceholder = 'Search...',
  emptyText = 'No results found.',
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState('')

  const filtered = options.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase()),
  )

  const selected = options.find((opt) => opt.value === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-normal"
        >
          {selected ? selected.label : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <div className="p-2 border-b">
          <Input
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8"
          />
        </div>
        <div className="max-h-48 overflow-y-auto">
          {filtered.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">{emptyText}</p>
          ) : (
            filtered.map((opt) => (
              <div
                key={opt.value}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-accent',
                  value === opt.value && 'bg-accent',
                )}
                onClick={() => {
                  onValueChange(opt.value)
                  setSearch('')
                  setOpen(false)
                }}
              >
                <Check
                  className={cn('h-4 w-4 shrink-0', value === opt.value ? 'opacity-100' : 'opacity-0')}
                />
                {opt.label}
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
