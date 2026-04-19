import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { useTheme } from 'next-themes'
import { Moon, Sun, Menu, X } from 'lucide-react'
import { Button } from '@/components/button'

export function Navbar() {
  const { resolvedTheme, setTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <>
      {/* Floating nav bar */}
      <div className="sticky top-3 z-50 px-4">
        <nav className="max-w-5xl mx-auto bg-paper border-2 border-ink rounded-nav shadow-ink flex items-center gap-3 px-4 py-2">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-2 font-head text-2xl text-ink mr-2 shrink-0">
            <span className="w-3 h-3 rounded-full bg-accent shadow-ink-sm shrink-0" />
            Kochservice
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1 flex-1">
            <Link
              to="/"
              className="px-3 py-1 font-hand text-sm text-ink-2 hover:text-ink rounded-sketchy-sm transition-colors"
              activeProps={{ className: 'px-3 py-1 nav-active' }}
              activeOptions={{ exact: true }}
            >
              Rezepte
            </Link>
            <a className="px-3 py-1 font-hand text-sm text-ink-2 hover:text-ink rounded-sketchy-sm transition-colors cursor-pointer">Kategorien</a>
            <a className="px-3 py-1 font-hand text-sm text-ink-2 hover:text-ink rounded-sketchy-sm transition-colors cursor-pointer">Gespeichert</a>
            <a className="px-3 py-1 font-hand text-sm text-ink-2 hover:text-ink rounded-sketchy-sm transition-colors cursor-pointer">Planer</a>
          </div>

          {/* Search — desktop */}
          <div className="hidden md:flex items-center gap-2 flex-1 max-w-sm border-2 border-ink rounded-sketchy-sm px-3 py-1 bg-paper-2">
            <span className="text-ink-3 text-sm">🔍</span>
            <input
              className="flex-1 bg-transparent font-hand text-sm text-ink placeholder:text-ink-3 outline-none"
              placeholder='z.B. „pasta al limone"'
            />
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-2 ml-auto">
            <button
              className="w-8 h-8 flex items-center justify-center border-2 border-ink rounded-sketchy-sm bg-paper text-ink shadow-ink-sm hover:shadow-ink transition-all active:translate-x-px active:translate-y-px active:shadow-none"
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              aria-label="Theme umschalten"
            >
              {isDark ? <Sun size={14} /> : <Moon size={14} />}
            </button>
            <Button className="hidden md:inline-flex py-1.5 px-3 text-xs">Anmelden</Button>

            {/* Hamburger — mobile only */}
            <button
              className="md:hidden w-8 h-8 flex items-center justify-center border-2 border-ink rounded-sketchy-sm bg-paper text-ink shadow-ink-sm"
              onClick={() => setDrawerOpen(true)}
              aria-label="Menü öffnen"
            >
              <Menu size={16} />
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile drawer backdrop */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-40 bg-ink/40"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* Mobile drawer panel */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-72 bg-paper border-l-2 border-ink shadow-ink-xl flex flex-col transition-transform duration-300 ${drawerOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-center justify-between p-4 border-b-2 border-ink">
          <span className="font-head text-xl text-ink">Menü</span>
          <button
            className="w-8 h-8 flex items-center justify-center border-2 border-ink rounded-sketchy-sm"
            onClick={() => setDrawerOpen(false)}
            aria-label="Menü schließen"
          >
            <X size={16} />
          </button>
        </div>

        {/* Search — mobile */}
        <div className="flex items-center gap-2 border-2 border-ink rounded-sketchy-sm mx-4 mt-4 px-3 py-2 bg-paper-2">
          <span className="text-ink-3 text-sm">🔍</span>
          <input
            className="flex-1 bg-transparent font-hand text-sm text-ink placeholder:text-ink-3 outline-none"
            placeholder='z.B. „pasta al limone"'
          />
        </div>

        <nav className="flex flex-col gap-1 p-4 flex-1">
          {[
            { label: 'Rezepte', href: '/' },
            { label: 'Kategorien', href: '#' },
            { label: 'Gespeichert', href: '#' },
            { label: 'Planer', href: '#' },
          ].map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="px-3 py-3 font-hand text-base text-ink-2 hover:text-ink hover:bg-paper-2 rounded-sketchy-sm transition-colors border-b border-dashed border-ink-3 last:border-0"
              onClick={() => setDrawerOpen(false)}
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="p-4 border-t-2 border-ink">
          <Button className="w-full justify-center">Anmelden</Button>
        </div>
      </div>
    </>
  )
}
