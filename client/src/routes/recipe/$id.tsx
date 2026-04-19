import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect, useCallback } from 'react'
import { useRecipe } from '@/hooks/use-recipe'
import { RecipeLoading } from '@/routes/recipe/-recipe-loading'
import { Button } from '@/components/button'
import type {
  RecipeIngredientResponse,
  RecipeResponse,
} from '@/api/kochservice.schemas'

export const Route = createFileRoute('/recipe/$id')({
  component: RecipePage,
})

function RecipePage() {
  const { id } = Route.useParams()
  const { data, isLoading, error } = useRecipe(id)
  const [kmOpen, setKmOpen] = useState(false)
  const [kmStep, setKmStep] = useState(0)
  const [checked, setChecked] = useState<Set<number>>(new Set())
  const [portions, setPortions] = useState(2)
  const [mobileTab, setMobileTab] = useState<'zutaten' | 'schritte'>('zutaten')

  const openKochmodus = useCallback(() => {
    setKmOpen(true)
    setKmStep(0)
  }, [])
  const closeKochmodus = useCallback(() => setKmOpen(false), [])
  const navKM = useCallback(
    (delta: number) => {
      setKmStep((s) =>
        Math.max(
          0,
          Math.min((data?.data?.instructions?.length ?? 1) - 1, s + delta),
        ),
      )
    },
    [data?.data?.instructions?.length],
  )

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (document.activeElement as HTMLElement)?.tagName
      if (e.key === 'Escape') {
        closeKochmodus()
        return
      }
      if (
        !kmOpen &&
        e.code === 'Space' &&
        !['INPUT', 'TEXTAREA', 'BUTTON'].includes(tag)
      ) {
        e.preventDefault()
        openKochmodus()
        return
      }
      if (kmOpen) {
        if (e.key === 'ArrowRight' || e.code === 'Space') {
          e.preventDefault()
          navKM(1)
        }
        if (e.key === 'ArrowLeft') navKM(-1)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [kmOpen, openKochmodus, closeKochmodus, navKM])

  if (isLoading) return <RecipeLoading />
  if (error || !data?.data)
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center text-ink-2 font-hand">
        Rezept nicht gefunden.
      </div>
    )

  const recipe: RecipeResponse = data.data

  const toggleCheck = (i: number) =>
    setChecked((c) => {
      const n = new Set(c)
      n.has(i) ? n.delete(i) : n.add(i)
      return n
    })

  const scaledAmount = (amount: number) => {
    const scaled = (amount * portions) / 2
    return Number.isInteger(scaled) ? String(scaled) : scaled.toFixed(1)
  }

  return (
    <>
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* ── Hero ── */}
        <div className="grid grid-cols-1 md:grid-cols-[1.3fr_1fr] gap-6 mb-6">
          <div className="aspect-[16/10] border-2 border-ink rounded-card shadow-ink-card hatched flex items-center justify-center text-ink-3 font-mono text-xs">
            [ {recipe.name.toLowerCase()} ]
          </div>
          <div className="flex flex-col justify-center">
            <h1 className="font-head text-5xl text-ink leading-tight mb-3">
              {recipe.name}
            </h1>
            <div className="flex flex-wrap gap-3 text-sm text-ink-2 mb-5">
              <span>
                <span className="font-head text-xl text-ink">
                  {recipe.ingredients.length}
                </span>{' '}
                Zutaten
              </span>
              <span>
                <span className="font-head text-xl text-ink">
                  {recipe.instructions.length}
                </span>{' '}
                Schritte
              </span>
              {recipe.tags.map((t) => (
                <span
                  key={t.id}
                  className="border border-ink-3 rounded px-2 py-0.5 text-xs font-hand text-ink-2"
                >
                  {t.name}
                </span>
              ))}
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button size="sm">＋ Speichern</Button>
              <Button size="sm">⎙ Drucken</Button>
              <Button size="sm">⇪ Teilen</Button>
            </div>
          </div>
        </div>

        {/* ── Kochmodus CTA ── */}
        <button
          onClick={openKochmodus}
          className="w-full flex items-center gap-4 border-2 border-ink rounded-card bg-accent text-white p-4 shadow-ink-lg mb-6 hover:-translate-x-px hover:-translate-y-px transition-transform active:translate-x-0 active:translate-y-0"
        >
          <div className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center text-xl shrink-0">
            ▶
          </div>
          <div className="flex-1 text-left">
            <div className="font-head text-2xl leading-tight">
              Kochmodus starten
            </div>
            <div className="text-sm opacity-90">
              Schritt für Schritt · großer Text · Bildschirm bleibt an
            </div>
          </div>
          <kbd className="font-mono text-[11px] border border-white/70 rounded px-2 py-1 opacity-80 hidden md:block">
            SPACE
          </kbd>
        </button>

        <div className="border-t-2 border-dashed border-ink-3 mb-6" />

        {/* ── Desktop: 2-column body ── */}
        <div className="hidden md:grid grid-cols-[280px_1fr] gap-8">
          {/* Ingredients sidebar */}
          <div>
            <h3 className="font-head text-3xl text-ink mb-3">
              Zutaten{' '}
              <span className="font-hand text-sm text-ink-3">
                (für {portions})
              </span>
            </h3>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center border-2 border-ink rounded-full overflow-hidden bg-paper">
                <button
                  onClick={() => setPortions((p) => Math.max(1, p - 1))}
                  className="px-3 py-1 font-head text-xl hover:bg-paper-2 transition-colors"
                >
                  −
                </button>
                <span className="px-2 font-hand text-sm">{portions} Port.</span>
                <button
                  onClick={() => setPortions((p) => p + 1)}
                  className="px-3 py-1 font-head text-xl hover:bg-paper-2 transition-colors"
                >
                  ＋
                </button>
              </div>
            </div>
            <IngredientList
              ingredients={recipe.ingredients}
              checked={checked}
              onToggle={toggleCheck}
              scaledAmount={scaledAmount}
            />
            <div className="mt-4 pt-3 border-t border-dashed border-ink-3 text-xs text-ink-3">
              ⇢ Einkaufsliste · ⇢ Alles abhaken
            </div>
          </div>

          {/* Steps */}
          <div>
            <h3 className="font-head text-3xl text-ink mb-4">Zubereitung</h3>
            <ol className="flex flex-col gap-5">
              {recipe.instructions.map((step, i) => (
                <li key={i} className="flex gap-3">
                  <div
                    className={`w-9 h-9 rounded-full border-2 border-ink flex items-center justify-center font-head text-xl shrink-0 mt-0.5 ${i === 0 ? 'bg-accent text-white' : 'bg-paper'}`}
                  >
                    {i + 1}
                  </div>
                  <p className="text-base leading-relaxed mt-1 text-ink">
                    {step}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* ── Mobile body ── */}
        <div className="md:hidden">
          <Button
            variant="accent"
            className="w-full justify-center mb-4"
            onClick={openKochmodus}
          >
            ▶ Kochmodus starten
          </Button>
          <div className="flex border-2 border-ink rounded-full overflow-hidden mb-5 p-1 gap-1">
            {(['zutaten', 'schritte'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setMobileTab(tab)}
                className={`flex-1 py-2 text-sm font-hand rounded-full capitalize transition-colors ${mobileTab === tab ? 'bg-ink text-paper' : 'text-ink hover:bg-paper-2'}`}
              >
                {tab === 'zutaten' ? 'Zutaten' : 'Schritte'}
              </button>
            ))}
          </div>
          {mobileTab === 'zutaten' ? (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center border-2 border-ink rounded-full overflow-hidden bg-paper">
                  <button
                    onClick={() => setPortions((p) => Math.max(1, p - 1))}
                    className="px-3 py-1 font-head text-xl"
                  >
                    −
                  </button>
                  <span className="px-2 font-hand text-sm">
                    {portions} Port.
                  </span>
                  <button
                    onClick={() => setPortions((p) => p + 1)}
                    className="px-3 py-1 font-head text-xl"
                  >
                    ＋
                  </button>
                </div>
              </div>
              <IngredientList
                ingredients={recipe.ingredients}
                checked={checked}
                onToggle={toggleCheck}
                scaledAmount={scaledAmount}
                mobile
              />
            </div>
          ) : (
            <ol className="flex flex-col gap-4">
              {recipe.instructions.map((step, i) => (
                <li key={i} className="flex gap-3">
                  <div
                    className={`w-8 h-8 rounded-full border-2 border-ink flex items-center justify-center font-head text-lg shrink-0 mt-0.5 ${i === 0 ? 'bg-accent text-white' : 'bg-paper'}`}
                  >
                    {i + 1}
                  </div>
                  <p className="text-sm leading-relaxed mt-1">{step}</p>
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>

      {/* ── Kochmodus overlay ── */}
      {kmOpen && (
        <KochmodusOverlay
          recipe={recipe}
          step={kmStep}
          onNav={navKM}
          onClose={closeKochmodus}
        />
      )}
    </>
  )
}

/* ── Ingredient list (shared desktop + mobile) ── */
function IngredientList({
  ingredients,
  checked,
  onToggle,
  scaledAmount,
  mobile = false,
}: {
  ingredients: RecipeIngredientResponse[]
  checked: Set<number>
  onToggle: (i: number) => void
  scaledAmount: (n: number) => string
  mobile?: boolean
}) {
  return (
    <ul className="flex flex-col gap-2">
      {ingredients.map((ing, i) => (
        <li
          key={i}
          className={`flex items-center gap-3 ${mobile ? 'py-2 border-b border-dashed border-ink-3' : ''} text-sm transition-colors ${checked.has(i) ? 'text-ink-3 line-through' : 'text-ink'}`}
        >
          <button
            onClick={() => onToggle(i)}
            className={`w-5 h-5 border-2 border-ink rounded flex items-center justify-center shrink-0 transition-colors ${checked.has(i) ? 'bg-ink text-paper' : 'bg-paper hover:bg-paper-2'}`}
          >
            {checked.has(i) && <span className="text-xs leading-none">✓</span>}
          </button>
          <span
            className={`font-head ${mobile ? 'text-base w-16' : 'text-lg w-20'} shrink-0`}
          >
            {scaledAmount(ing.amount)} {ing.measurement}
          </span>
          <span>{ing.ingredient_name}</span>
        </li>
      ))}
    </ul>
  )
}

/* ── Kochmodus fullscreen overlay ── */
function KochmodusOverlay({
  recipe,
  step,
  onNav,
  onClose,
}: {
  recipe: RecipeResponse
  step: number
  onNav: (delta: number) => void
  onClose: () => void
}) {
  const total = recipe.instructions.length
  const [kmChecked, setKmChecked] = useState<Set<number>>(new Set())
  const [timerSecs, setTimerSecs] = useState<number | null>(null)
  const [timerRunning, setTimerRunning] = useState(false)

  useEffect(() => {
    setKmChecked(new Set())
    setTimerSecs(null)
    setTimerRunning(false)
  }, [step])

  useEffect(() => {
    if (!timerRunning || timerSecs === null) return
    if (timerSecs <= 0) {
      setTimerRunning(false)
      return
    }
    const t = setTimeout(() => setTimerSecs((s) => (s ?? 0) - 1), 1000)
    return () => clearTimeout(t)
  }, [timerRunning, timerSecs])

  const fmtTime = (s: number) =>
    `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

  return (
    <div
      className="fixed inset-0 z-50 bg-paper flex flex-col animate-[slideUp_.25s_ease-out]"
      style={{ animation: 'slideUp .25s ease-out' }}
    >
      <style>{`@keyframes slideUp { from { transform: translateY(16px); opacity: 0 } to { transform: none; opacity: 1 } }`}</style>

      {/* Top bar */}
      <div className="flex items-center gap-3 px-6 py-4 border-b-2 border-ink bg-paper">
        <div>
          <div className="font-head text-2xl text-ink leading-tight">
            Kochmodus · {recipe.name}
          </div>
          <div className="text-xs text-ink-3 font-mono">
            {recipe.ingredients.length} Zutaten · {total} Schritte · Bildschirm
            bleibt aktiv
          </div>
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <Button size="sm" onClick={() => onNav(-1)} disabled={step === 0}>
            ← Zurück
          </Button>
          <Button
            size="sm"
            variant="dark"
            onClick={() => onNav(1)}
            disabled={step === total - 1}
          >
            Weiter →
          </Button>
          <Button size="sm" onClick={onClose}>
            ✕ Schließen
          </Button>
        </div>
      </div>

      {/* Progress dots */}
      <div className="flex items-center gap-2 px-6 py-4 border-b border-dashed border-ink-3 overflow-x-auto">
        {recipe.instructions.map((_, i) => (
          <>
            <button
              key={i}
              onClick={() => onNav(i - step)}
              className={`w-7 h-7 rounded-full border-2 border-ink flex items-center justify-center font-head text-base shrink-0 transition-transform ${
                i < step
                  ? 'bg-ink text-paper'
                  : i === step
                    ? 'bg-accent text-white scale-110'
                    : 'bg-paper text-ink'
              }`}
            >
              {i + 1}
            </button>
            {i < total - 1 && (
              <div className="flex-1 h-0.5 bg-ink opacity-20 min-w-2" />
            )}
          </>
        ))}
        <span className="font-head text-lg ml-3 shrink-0 text-ink">
          {recipe.instructions[step]?.slice(0, 40)}…
        </span>
      </div>

      {/* Main content */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-[1.4fr_1fr] overflow-hidden">
        {/* Step content */}
        <div className="flex flex-col justify-center px-10 md:px-12 py-8 overflow-auto">
          <div className="font-mono text-xs text-ink-3 tracking-widest uppercase mb-2">
            Schritt {step + 1} von {total}
          </div>
          <p className="font-hand text-xl md:text-2xl leading-relaxed text-ink">
            {recipe.instructions[step]}
          </p>
        </div>

        {/* Sidebar */}
        <div className="border-l-2 border-ink bg-paper-2 px-8 py-8 overflow-auto flex flex-col gap-6">
          {/* Ingredients (all shown in cook mode) */}
          <div>
            <h4 className="font-head text-2xl text-ink mb-3">Alle Zutaten</h4>
            <ul className="flex flex-col gap-3 text-base">
              {recipe.ingredients.map((ing, i) => (
                <li
                  key={i}
                  className={`flex items-center gap-3 ${kmChecked.has(i) ? 'text-ink-3 line-through' : 'text-ink'}`}
                >
                  <button
                    onClick={() =>
                      setKmChecked((c) => {
                        const n = new Set(c)
                        n.has(i) ? n.delete(i) : n.add(i)
                        return n
                      })
                    }
                    className={`w-5 h-5 border-2 border-ink rounded flex items-center justify-center shrink-0 transition-colors ${kmChecked.has(i) ? 'bg-ink text-paper' : 'bg-paper'}`}
                  >
                    {kmChecked.has(i) && <span className="text-xs">✓</span>}
                  </button>
                  <span className="font-head text-xl w-24 shrink-0">
                    {ing.amount} {ing.measurement}
                  </span>
                  <span className="text-sm">{ing.ingredient_name}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Timer */}
          <div className="border-2 border-ink rounded-card bg-paper p-4 shadow-ink-card flex items-center gap-4">
            <div>
              <div className="font-head text-4xl text-accent leading-none">
                {timerSecs !== null ? fmtTime(timerSecs) : '—'}
              </div>
              <div className="text-xs text-ink-2 mt-1">Timer</div>
            </div>
            <div className="flex gap-2 ml-auto">
              {timerSecs === null ? (
                <>
                  {[5, 10, 15].map((min) => (
                    <button
                      key={min}
                      onClick={() => {
                        setTimerSecs(min * 60)
                        setTimerRunning(false)
                      }}
                      className="px-2 py-1 border border-ink rounded text-xs font-hand hover:bg-paper-2"
                    >
                      {min}m
                    </button>
                  ))}
                </>
              ) : (
                <>
                  <Button size="sm" onClick={() => setTimerRunning((r) => !r)}>
                    {timerRunning ? '⏸' : '▶'}
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      setTimerSecs(null)
                      setTimerRunning(false)
                    }}
                  >
                    ⟲
                  </Button>
                </>
              )}
            </div>
          </div>

          <div className="text-xs text-ink-3 font-mono border-t border-dashed border-ink-3 pt-3">
            <kbd className="border border-ink rounded px-1">→</kbd> weiter ·{' '}
            <kbd className="border border-ink rounded px-1">ESC</kbd> schließen
          </div>
        </div>
      </div>

      {/* Bottom nav */}
      <div className="flex items-center gap-3 px-6 py-4 border-t-2 border-ink bg-paper">
        <Button onClick={() => onNav(-1)} disabled={step === 0}>
          ← Schritt zurück
        </Button>
        <div className="flex-1 text-center font-mono text-xs text-ink-3">
          Schritt <strong className="text-ink">{step + 1}</strong> von{' '}
          <strong className="text-ink">{total}</strong>
        </div>
        {step < total - 1 ? (
          <Button variant="accent" onClick={() => onNav(1)}>
            Weiter →
          </Button>
        ) : (
          <Button variant="dark" onClick={onClose}>
            ✓ Fertig — Guten Appetit!
          </Button>
        )}
      </div>
    </div>
  )
}
