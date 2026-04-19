import { createFileRoute, Link } from '@tanstack/react-router'
import { useInfiniteRecipes } from '@/hooks/use-recipe'
import type { RecipeResponse } from '@/api/kochservice.schemas'
import { Button } from '@/components/button'
import { Card } from '@/components/card'

export const Route = createFileRoute('/')({
  component: LandingPage,
})

function LandingPage() {
  const { data } = useInfiniteRecipes(4)
  const recipes = data?.pages[0]?.data.recipes ?? []

  return (
    <div className="min-h-screen bg-paper-2">
      <main className="max-w-5xl mx-auto px-4 flex flex-col gap-24 py-12">
        <Hero />
        <HateList />
        <HowItWorks />
        <PopularRecipes recipes={recipes} />
        <Features />
        <BigCta />
        <Footer />
      </main>
    </div>
  )
}

function Hero() {
  return (
    <section className="flex flex-col md:flex-row items-start gap-10 md:gap-16 pt-4">
      <div className="flex-1 min-w-0">
        <div className="font-mono text-[11px] text-ink-3 tracking-widest uppercase mb-3">
          Rezepte · ohne Theater
        </div>
        <h1 className="font-head font-bold leading-[0.9] text-[clamp(48px,8vw,96px)] text-ink mb-4 max-w-[11ch]">
          Einfach. Kochen.{' '}
          <span className="bg-accent text-white px-2 inline-block -rotate-1 shadow-ink-md border-2 border-ink">
            Ohne Bla.
          </span>
        </h1>
        <p className="text-lg leading-relaxed text-ink-2 max-w-[44ch] mb-6">
          Kochservice ist die Rezeptseite, die direkt zum Rezept kommt. Keine
          Lebensgeschichten, keine Pop-ups, keine endlosen Werbeblöcke. Nur das,
          was du brauchst, um zu kochen.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button variant="accent">🔍 Rezepte entdecken</Button>
          <Button>＋ Kostenlos registrieren</Button>
        </div>
        <div className="mt-4 text-xs text-ink-3">
          · kein Abo · keine Cookies · keine „was ist eigentlich…" · einfach
          Rezepte.
        </div>
      </div>

      <div className="relative w-full md:w-80 shrink-0 aspect-[4/3] md:aspect-square border-2 border-ink rounded-card shadow-ink-hero hatched flex items-center justify-center">
        <span className="text-ink-3 font-hand text-sm">
          [ foto — gedeckter tisch ]
        </span>
        <div className="absolute -top-3 -right-2 bg-accent text-white border-2 border-ink px-3 py-1.5 font-head text-xl shadow-ink-sm rotate-6">
          Neu!
        </div>
        <div className="absolute bottom-6 -left-4 bg-paper border-2 border-ink px-3 py-1.5 font-head text-lg shadow-ink-sm -rotate-3">
          20 Min
        </div>
        <div className="absolute top-[40%] -right-6 bg-paper border-2 border-ink px-3 py-1.5 font-hand text-xs shadow-ink-sm rotate-3 hidden md:block">
          ← kein Popup hier
        </div>
      </div>
    </section>
  )
}

function HateList() {
  const items = [
    {
      title: 'Lebensgeschichten',
      desc: '„Als mein Opa 1952 in der Toskana…" — nope.',
    },
    {
      title: 'Pop-ups',
      desc: 'Kein Newsletter-Overlay. Keine App-Empfehlung.',
    },
    { title: 'Werbeblöcke', desc: 'Keine Banner zwischen jedem Schritt.' },
    {
      title: 'SEO-Bloat',
      desc: 'Kein „Warum dieses Rezept funktioniert" FAQ.',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
      <h3 className="col-span-full font-head text-3xl text-ink mb-1">
        Was wir weggelassen haben:
      </h3>
      {items.map(({ title, desc }) => (
        <div key={title} className="flex items-start gap-3 text-sm text-ink-2">
          <span className="font-head text-3xl text-accent leading-none shrink-0 -mt-1">
            ✗
          </span>
          <div>
            <b className="text-ink block font-head text-lg">{title}</b>
            {desc}
          </div>
        </div>
      ))}
    </div>
  )
}

function HowItWorks() {
  const steps = [
    {
      num: '1',
      title: 'Suchen',
      desc: 'Tipp ein was du willst — oder was du im Kühlschrank hast. Filter nach Zeit, Diät, Schwierigkeit.',
      preview: '🔍 „pasta limone" · 20 Min · vegetarisch',
    },
    {
      num: '2',
      title: 'Lesen',
      desc: 'Rezept direkt. Zutaten links, Schritte rechts. Portionen skalieren mit einem Klick.',
      preview: '200 g Spaghetti · 1 Zitrone · 80 g Parmesan …',
    },
    {
      num: '3',
      title: 'Kochen',
      desc: 'Kochmodus: ein Schritt auf dem Bildschirm, großer Text, inline Timer, Bildschirm bleibt wach.',
      preview: '▶ Schritt 3 von 6 · ⏱ 9:00 · Pasta al dente kochen',
    },
  ]

  return (
    <section>
      <h2 className="font-head text-4xl text-ink mb-2">Wie es funktioniert</h2>
      <p className="text-ink-2 mb-8">Drei Schritte. Mehr brauchst du nicht.</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {steps.map(({ num, title, desc, preview }) => (
          <Card key={num} className="p-5 flex flex-col gap-2">
            <div className="font-head text-5xl font-bold text-accent leading-none">
              {num}
            </div>
            <h3 className="font-head text-2xl text-ink">{title}</h3>
            <p className="text-sm text-ink-2 leading-relaxed flex-1">{desc}</p>
            <div className="mt-2 text-xs font-mono text-ink-3 bg-paper-2 border border-dashed border-ink-3 rounded px-3 py-2">
              {preview}
            </div>
          </Card>
        ))}
      </div>
    </section>
  )
}

function PopularRecipes({ recipes }: { recipes: RecipeResponse[] }) {
  const placeholders = [
    { name: 'Pasta al Limone', tag: 'schnell' },
    { name: 'Ofengemüse mit Tahini', tag: 'meal prep' },
    { name: 'Miso-Lauch-Suppe', tag: 'leicht' },
    { name: 'Hähnchen-Curry', tag: 'familie' },
  ]

  const displayed =
    recipes.length > 0
      ? recipes.slice(0, 4)
      : placeholders.map(
          (p, i) =>
            ({
              id: String(i),
              name: p.name,
              tags: [{ id: String(i), name: p.tag }],
              ingredients: [],
              instructions: [],
            }) satisfies RecipeResponse,
        )

  return (
    <section>
      <h2 className="font-head text-4xl text-ink mb-2">Beliebt diese Woche</h2>
      <p className="text-ink-2 mb-8">
        Handverlesen. Nicht algorithmisch. Keine Sponsored-Rezepte.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {displayed.map((recipe) => (
          <Link
            key={recipe.id}
            to="/recipe/$id"
            params={{ id: recipe.id }}
            className="block"
          >
            <Card hover className="overflow-hidden lg:h-72">
              <div className="aspect-4/3 hatched flex items-center justify-center border-b-2 border-ink">
                <span className="text-ink-3 font-hand text-xs">
                  [ {recipe.name.toLowerCase()} ]
                </span>
              </div>
              <div className="p-3">
                <h4 className="font-head text-xl text-ink leading-tight">
                  {recipe.name}
                </h4>
                <div className="flex gap-2 text-xs text-ink-3 mt-1">
                  <span>✦ {recipe.instructions.length} Schritte</span>
                  <span>·</span>
                  <span>{recipe.ingredients.length} Zutaten</span>
                </div>
                {recipe.tags[0] && (
                  <span className="mt-2 inline-block text-xs font-hand border border-ink-3 rounded px-2 py-0.5 text-ink-2">
                    {recipe.tags[0].name}
                  </span>
                )}
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  )
}

function Features() {
  const items = [
    {
      icon: '×2',
      title: 'Portionen skalieren',
      desc: 'Ein Klick, alle Mengen passen sich an. Ohne Taschenrechner.',
    },
    {
      icon: '⏱',
      title: 'Timer inline',
      desc: 'Timer starten direkt aus dem Schritt. Pfeift, wenn fertig.',
    },
    {
      icon: '☀',
      title: 'Bildschirm wach',
      desc: 'Im Kochmodus bleibt das Display an. Keine klebrigen Fingerabdrücke.',
    },
    {
      icon: '✓',
      title: 'Zutaten abhaken',
      desc: 'Was du schon im Schrank hast, streichst du durch.',
    },
    {
      icon: '🛒',
      title: 'Einkaufsliste',
      desc: 'Fehlende Zutaten auf eine Liste. Pro Rezept oder für die Woche.',
    },
    {
      icon: '🌙',
      title: 'Dark Mode',
      desc: 'Abends kochen ohne Blendung. Respektiert Systemeinstellung.',
    },
  ]

  return (
    <section>
      <h2 className="font-head text-4xl text-ink mb-2">
        Kleine Dinge, die Kochen einfacher machen
      </h2>
      <p className="text-ink-2 mb-8">
        Details, die du erst merkst, wenn sie da sind — oder wenn sie fehlen.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map(({ icon, title, desc }) => (
          <Card key={title} className="p-5 flex flex-col gap-2">
            <div className="font-head text-4xl text-accent leading-none">
              {icon}
            </div>
            <h4 className="font-head text-2xl text-ink">{title}</h4>
            <p className="text-sm text-ink-2 leading-relaxed">{desc}</p>
          </Card>
        ))}
      </div>
    </section>
  )
}

function BigCta() {
  return (
    <section className="bg-ink text-paper border-2 border-ink rounded-card shadow-ink-hero p-8 md:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
      <div>
        <h2 className="font-head text-5xl md:text-6xl leading-[0.95] mb-2">
          Bereit zu kochen?
        </h2>
        <p className="opacity-80 text-base max-w-[44ch]">
          Konto erstellen ist optional. Rezepte sind sowieso komplett lesbar —
          Login nur, wenn du speichern oder planen willst.
        </p>
      </div>
      <div className="flex flex-wrap gap-3 shrink-0">
        <Button
          variant="default"
          className="border-paper text-paper bg-transparent hover:bg-paper hover:text-ink"
        >
          🔍 Stöbern
        </Button>
        <Button variant="accent">＋ Konto erstellen</Button>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-8 pb-4">
      <div className="col-span-2 md:col-span-1">
        <div className="flex items-center gap-2 font-head text-2xl text-ink mb-2">
          <span className="w-3 h-3 rounded-full bg-accent shadow-ink-sm shrink-0" />
          Kochservice
        </div>
        <p className="text-ink-3 text-xs max-w-[32ch] leading-relaxed">
          Rezepte, wie ein Freund sie dir erklären würde. Ohne Umschweife.
        </p>
      </div>

      <FooterCol
        title="Entdecken"
        links={['Alle Rezepte', 'Kategorien', 'Zufallsrezept 🎲', 'Planer']}
      />
      <FooterCol
        title="Konto"
        links={['Anmelden', 'Registrieren', 'Gespeichert', 'Einkaufsliste']}
      />
      <FooterCol
        title="Über"
        links={['Manifest', 'Kontakt', 'Impressum', 'Datenschutz']}
      />

      <div className="col-span-full flex justify-between pt-5 mt-2 border-t border-dashed border-ink-3 text-[11px] text-ink-3 font-mono">
        <span>kochservice.golemt.org · 2026</span>
        <span>made mit viel Butter · keine Cookies 🍪 hier</span>
      </div>
    </footer>
  )
}

function FooterCol({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <h5 className="font-head text-xl text-ink mb-3">{title}</h5>
      <div className="flex flex-col gap-2">
        {links.map((l) => (
          <a
            key={l}
            href="#"
            className="text-sm text-ink-2 hover:text-ink font-hand transition-colors"
          >
            {l}
          </a>
        ))}
      </div>
    </div>
  )
}
