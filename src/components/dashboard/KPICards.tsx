import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import { TrendingUp, TrendingDown, Percent, Package, UserCheck } from 'lucide-react'
import { clsx } from 'clsx'
import { revenueData } from '../../data/revenueData'
import { leads } from '../../data/leadsData'

// ─── Types ───────────────────────────────────────────────────────────────────

interface KPICard {
  label: string
  value: string
  delta: number       // percentage, positive = growth
  sublabel: string    // context shown below the delta
  icon: LucideIcon
  iconBg: string      // complete Tailwind class — must be a literal for v4 detection
  iconRing: string
  iconColor: string
}

// ─── Formatters ──────────────────────────────────────────────────────────────

const usd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  notation: 'compact',
  maximumFractionDigits: 1,
})

// ─── Derived data ────────────────────────────────────────────────────────────

const last = revenueData[revenueData.length - 1]
const prev = revenueData[revenueData.length - 2]

const totalRevenue     = revenueData.reduce((s, d) => s + d.sales, 0)
const totalCommissions = revenueData.reduce((s, d) => s + d.commissions, 0)
const totalTonnage     = revenueData.reduce((s, d) => s + d.tonnage, 0)

const revDelta  = ((last.sales       - prev.sales)       / prev.sales)       * 100
const commDelta = ((last.commissions - prev.commissions)  / prev.commissions) * 100
const tonnDelta = ((last.tonnage     - prev.tonnage)      / prev.tonnage)     * 100

// Active clients: hot leads count; delta = avg MoM trend of hot leads
const hotLeads      = leads.filter((l) => l.status === 'hot')
const clientDelta   = hotLeads.reduce((s, l) => s + l.monthlyTrend, 0) / hotLeads.length

const CARDS: KPICard[] = [
  {
    label:     'Total Revenue',
    value:     usd.format(totalRevenue),
    delta:     revDelta,
    sublabel:  `${last.month} vs ${prev.month}`,
    icon:      TrendingUp,
    iconBg:    'bg-indigo-500/10',
    iconRing:  'ring-indigo-500/20',
    iconColor: 'text-indigo-400',
  },
  {
    label:     'Total Commissions',
    value:     usd.format(totalCommissions),
    delta:     commDelta,
    sublabel:  `${last.month} vs ${prev.month}`,
    icon:      Percent,
    iconBg:    'bg-violet-500/10',
    iconRing:  'ring-violet-500/20',
    iconColor: 'text-violet-400',
  },
  {
    label:     'Tonnage YTD',
    value:     `${totalTonnage.toLocaleString('en-US')} t`,
    delta:     tonnDelta,
    sublabel:  `${last.month} vs ${prev.month}`,
    icon:      Package,
    iconBg:    'bg-emerald-500/10',
    iconRing:  'ring-emerald-500/20',
    iconColor: 'text-emerald-400',
  },
  {
    label:     'Active Clients',
    value:     String(hotLeads.length),
    delta:     clientDelta,
    sublabel:  'avg MoM trend',
    icon:      UserCheck,
    iconBg:    'bg-sky-500/10',
    iconRing:  'ring-sky-500/20',
    iconColor: 'text-sky-400',
  },
]

// ─── Delta badge ─────────────────────────────────────────────────────────────

interface DeltaBadgeProps {
  delta: number
  sublabel: string
}

function DeltaBadge({ delta, sublabel }: DeltaBadgeProps) {
  const positive = delta >= 0
  const Icon = positive ? TrendingUp : TrendingDown
  return (
    <div className="flex items-center gap-1.5">
      <span
        className={clsx(
          'inline-flex items-center gap-1 text-xs font-semibold',
          positive ? 'text-emerald-400' : 'text-rose-400'
        )}
      >
        <Icon className="h-3 w-3" />
        {positive ? '+' : ''}
        {delta.toFixed(1)}%
      </span>
      <span className="text-xs text-zinc-600">{sublabel}</span>
    </div>
  )
}

// ─── KPICards ─────────────────────────────────────────────────────────────────

export function KPICards() {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {CARDS.map((card, i) => {
        const Icon = card.icon
        return (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.1, ease: 'easeOut' }}
            className="rounded-xl border border-zinc-800 bg-zinc-900/50 px-5 py-4"
          >
            {/* Icon + label row */}
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-500">{card.label}</span>
              <div
                className={clsx(
                  'flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md ring-1',
                  card.iconBg,
                  card.iconRing
                )}
              >
                <Icon className={clsx('h-3.5 w-3.5', card.iconColor)} />
              </div>
            </div>

            {/* Main value */}
            <p className="mb-1.5 text-2xl font-bold tracking-tight text-zinc-100">
              {card.value}
            </p>

            {/* Delta */}
            <DeltaBadge delta={card.delta} sublabel={card.sublabel} />
          </motion.div>
        )
      })}
    </div>
  )
}
