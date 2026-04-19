import { type ReactNode, useState, createContext, useContext } from 'react'

const TabsCtx = createContext<{ active: string; setActive: (v: string) => void }>({
  active: '',
  setActive: () => {},
})

export function Tabs({ defaultValue, children, className = '' }: { defaultValue: string; children: ReactNode; className?: string }) {
  const [active, setActive] = useState(defaultValue)
  return (
    <TabsCtx.Provider value={{ active, setActive }}>
      <div className={className}>{children}</div>
    </TabsCtx.Provider>
  )
}

export function TabsList({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`flex border-b-2 border-ink gap-1 ${className}`}>{children}</div>
  )
}

export function TabsTrigger({ value, children }: { value: string; children: ReactNode }) {
  const { active, setActive } = useContext(TabsCtx)
  return (
    <button
      onClick={() => setActive(value)}
      className={`px-4 py-2 font-hand text-sm border-b-2 -mb-0.5 transition-colors ${active === value ? 'border-accent text-ink font-bold' : 'border-transparent text-ink-2 hover:text-ink'}`}
    >
      {children}
    </button>
  )
}

export function TabsContent({ value, children }: { value: string; children: ReactNode }) {
  const { active } = useContext(TabsCtx)
  if (active !== value) return null
  return <div>{children}</div>
}
