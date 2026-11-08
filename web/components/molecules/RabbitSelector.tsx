import type { Rabbit } from '@/types'
import { IconTile } from '@/components/atoms/Icon'
import { getServerPrefs } from '@/lib/i18n/server'

interface RabbitSelectorProps {
  rabbits?: Rabbit[]
  selected?: Rabbit | null
  onSelect?: (rabbit: Rabbit) => void
}

/**
 * Molecule: dropdown/display for selecting the active rabbit.
 * In week 4 there is only one rabbit; multi-rabbit support is prepared for week 5.
 */
export async function RabbitSelector({ rabbits = [], selected, onSelect }: RabbitSelectorProps) {
  const { t } = await getServerPrefs()

  if (!selected && rabbits.length === 0) {
    return (
      <div className="text-sm text-white/80" aria-live="polite">
        {t.common.loading}
      </div>
    )
  }

  const current = selected ?? rabbits[0]

  if (!current) return null

  // Single-rabbit display — no dropdown needed yet
  if (rabbits.length <= 1) {
    return (
      <div className="flex items-center gap-2">
        <IconTile name="rabbit" size={36} />
        <span className="font-semibold">{current.name}</span>
      </div>
    )
  }

  // Multi-rabbit selector (week 5+)
  return (
    <div>
      <label htmlFor="rabbit-select" className="sr-only">
        {t.dashboard.rabbitSelect}
      </label>
      <select
        id="rabbit-select"
        value={current.id}
        onChange={(e) => {
          const rabbit = rabbits.find((r) => r.id === e.target.value)
          if (rabbit && onSelect) onSelect(rabbit)
        }}
        className="text-sm font-semibold text-inherit bg-transparent border-none focus:ring-2 focus:ring-white rounded [&>option]:text-[#0B2E2A]"
      >
        {rabbits.map((r) => (
          <option key={r.id} value={r.id}>
            {r.name}
          </option>
        ))}
      </select>
    </div>
  )
}
