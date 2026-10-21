import type { Rabbit } from '@/types'

interface RabbitSelectorProps {
  rabbits?: Rabbit[]
  selected?: Rabbit | null
  onSelect?: (rabbit: Rabbit) => void
}

/**
 * Molecule: dropdown/display for selecting the active rabbit.
 * In week 4 there is only one rabbit; multi-rabbit support is prepared for week 5.
 */
export function RabbitSelector({ rabbits = [], selected, onSelect }: RabbitSelectorProps) {
  if (!selected && rabbits.length === 0) {
    return (
      <div className="text-sm text-text-secondary" aria-live="polite">
        Cargando…
      </div>
    )
  }

  const current = selected ?? rabbits[0]

  if (!current) return null

  // Single-rabbit display — no dropdown needed yet
  if (rabbits.length <= 1) {
    return (
      <div className="flex items-center gap-2">
        {/* Rabbit icon */}
        <span aria-hidden="true" className="text-xl">🐇</span>
        <span className="font-semibold text-text">{current.name}</span>
      </div>
    )
  }

  // Multi-rabbit selector (week 5+)
  return (
    <div>
      <label htmlFor="rabbit-select" className="sr-only">
        Seleccionar conejo
      </label>
      <select
        id="rabbit-select"
        value={current.id}
        onChange={(e) => {
          const rabbit = rabbits.find((r) => r.id === e.target.value)
          if (rabbit && onSelect) onSelect(rabbit)
        }}
        className="text-sm font-semibold text-text bg-transparent border-none focus:ring-2 focus:ring-green rounded"
      >
        {rabbits.map((r) => (
          <option key={r.id} value={r.id}>
            🐇 {r.name}
          </option>
        ))}
      </select>
    </div>
  )
}
