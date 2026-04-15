import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Clock,
  Package,
  AlertTriangle,
  ArrowUpRight,
  Users,
} from 'lucide-react'
import { clsx } from 'clsx'
import { leads, type Lead, type LeadStatus } from '../../data/leadsData'

// ─── Types ───────────────────────────────────────────────────────────────────

type FilterStatus = 'all' | LeadStatus

interface StatusConfig {
  label: string
  badge: string
  dotClass: string
  pulse: boolean
}

// ─── Config ──────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<LeadStatus, StatusConfig> = {
  hot: {
    label: 'Hot',
    badge: 'bg-orange-500/10 text-orange-400 ring-orange-500/20',
    dotClass: 'bg-orange-500',
    pulse: true,
  },
  cooling: {
    label: 'Cooling',
    badge: 'bg-amber-500/10 text-amber-400 ring-amber-500/20',
    dotClass: 'bg-amber-500',
    pulse: false,
  },
  'at-risk': {
    label: 'At Risk',
    badge: 'bg-rose-500/10 text-rose-400 ring-rose-500/20',
    dotClass: 'bg-rose-500',
    pulse: false,
  },
}

const STATUS_SORT_ORDER: Record<LeadStatus, number> = {
  hot: 0,
  cooling: 1,
  'at-risk': 2,
}

const FILTER_TABS: { id: FilterStatus; label: string }[] = [
  { id: 'all',      label: 'All'      },
  { id: 'hot',      label: 'Hot'      },
  { id: 'cooling',  label: 'Cooling'  },
  { id: 'at-risk',  label: 'At Risk'  },
]

// ─── Formatters ──────────────────────────────────────────────────────────────

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

function formatTonnage(value: number): string {
  return `${value.toLocaleString('en-US')} t`
}

function formatRelativeDate(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date('2026-04-15') // pinned to project date
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays}d ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`
  return `${Math.floor(diffDays / 30)}mo ago`
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

// ─── Sub-components ──────────────────────────────────────────────────────────

interface TrendBadgeProps {
  trend: number
}

function TrendBadge({ trend }: TrendBadgeProps) {
  if (trend > 0) {
    return (
      <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-emerald-400">
        <TrendingUp className="h-3 w-3" />+{trend}%
      </span>
    )
  }
  if (trend < 0) {
    return (
      <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-rose-400">
        <TrendingDown className="h-3 w-3" />{trend}%
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-zinc-500">
      <Minus className="h-3 w-3" />0%
    </span>
  )
}

interface StatusBadgeProps {
  status: LeadStatus
}

function StatusBadge({ status }: StatusBadgeProps) {
  const cfg = STATUS_CONFIG[status]
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1',
        cfg.badge
      )}
    >
      {cfg.pulse ? (
        /* Pulsing dot for "Hot" — signals active buying urgency */
        <span className="relative flex h-1.5 w-1.5">
          <span
            className={clsx(
              'absolute inline-flex h-full w-full animate-ping rounded-full opacity-75',
              cfg.dotClass
            )}
          />
          <span
            className={clsx(
              'relative inline-flex h-1.5 w-1.5 rounded-full',
              cfg.dotClass
            )}
          />
        </span>
      ) : status === 'at-risk' ? (
        <AlertTriangle className="h-3 w-3" />
      ) : (
        <Clock className="h-3 w-3" />
      )}
      {cfg.label}
    </span>
  )
}

// ─── Lead Row ────────────────────────────────────────────────────────────────

interface LeadRowProps {
  lead: Lead
  index: number
}

function LeadRow({ lead, index }: LeadRowProps) {
  return (
    <motion.tr
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * 0.045, ease: 'easeOut' }}
      className="group cursor-pointer transition-colors duration-100 hover:bg-zinc-800/30"
    >
      {/* Client */}
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-zinc-800 text-xs font-semibold text-zinc-300 ring-1 ring-zinc-700">
            {getInitials(lead.clientName)}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-zinc-200 transition-colors group-hover:text-zinc-50">
              {lead.clientName}
            </p>
            <p className="truncate text-xs text-zinc-500">{lead.company}</p>
          </div>
        </div>
      </td>

      {/* Region */}
      <td className="px-4 py-3.5">
        <span className="text-xs text-zinc-400">{lead.region}</span>
      </td>

      {/* Last Order */}
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-1.5">
          <Clock className="h-3 w-3 flex-shrink-0 text-zinc-600" />
          <span
            className={clsx(
              'text-xs',
              lead.status === 'at-risk' ? 'text-rose-400' : 'text-zinc-400'
            )}
          >
            {formatRelativeDate(lead.lastOrderDate)}
          </span>
        </div>
      </td>

      {/* Tonnage */}
      <td className="px-4 py-3.5 text-right">
        <div className="flex items-center justify-end gap-1">
          <Package className="h-3 w-3 text-zinc-600" />
          <span className="text-sm font-medium text-zinc-200">
            {formatTonnage(lead.totalTonnage)}
          </span>
        </div>
        <p className="mt-px text-[11px] text-zinc-600">
          {lead.ordersThisMonth} order{lead.ordersThisMonth !== 1 ? 's' : ''} this mo.
        </p>
      </td>

      {/* Commission */}
      <td className="px-4 py-3.5 text-right">
        <span className="text-sm font-semibold text-indigo-300">
          {formatCurrency(lead.commissionValue)}
        </span>
        <p className="mt-px text-[11px] text-zinc-600">YTD</p>
      </td>

      {/* Monthly Trend */}
      <td className="px-4 py-3.5 text-right">
        <TrendBadge trend={lead.monthlyTrend} />
      </td>

      {/* Status */}
      <td className="px-5 py-3.5 text-right">
        <StatusBadge status={lead.status} />
      </td>
    </motion.tr>
  )
}

// ─── ActiveLeads ─────────────────────────────────────────────────────────────

export function ActiveLeads() {
  const [activeFilter, setActiveFilter] = useState<FilterStatus>('all')

  const counts: Record<FilterStatus, number> = {
    all:      leads.length,
    hot:      leads.filter((l) => l.status === 'hot').length,
    cooling:  leads.filter((l) => l.status === 'cooling').length,
    'at-risk': leads.filter((l) => l.status === 'at-risk').length,
  }

  const filtered =
    activeFilter === 'all' ? leads : leads.filter((l) => l.status === activeFilter)

  // Primary sort: status urgency. Secondary: commission value desc.
  const sorted = [...filtered].sort((a, b) => {
    const byStatus = STATUS_SORT_ORDER[a.status] - STATUS_SORT_ORDER[b.status]
    return byStatus !== 0 ? byStatus : b.commissionValue - a.commissionValue
  })

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50">
      {/* ── Header ──────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-4 border-b border-zinc-800 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-indigo-500/10 ring-1 ring-indigo-500/20">
            <Users className="h-4 w-4 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-zinc-100">Active Leads</h2>
            <p className="text-xs text-zinc-500">
              Sorted by priority · commission
            </p>
          </div>
        </div>
        <button className="flex items-center gap-1 text-xs font-medium text-indigo-400 transition-colors hover:text-indigo-300">
          View all
          <ArrowUpRight className="h-3 w-3" />
        </button>
      </div>

      {/* ── Filter tabs ─────────────────────────────────────────────── */}
      <div className="flex items-center gap-1 border-b border-zinc-800 px-4 py-2.5">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id)}
            className={clsx(
              'flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-all duration-150',
              activeFilter === tab.id
                ? 'bg-zinc-800 text-zinc-100'
                : 'text-zinc-500 hover:text-zinc-300'
            )}
          >
            {tab.label}
            <span
              className={clsx(
                'rounded-full px-1.5 py-px text-[10px] font-medium',
                activeFilter === tab.id
                  ? 'bg-zinc-700 text-zinc-300'
                  : 'bg-zinc-800/80 text-zinc-600'
              )}
            >
              {counts[tab.id]}
            </span>
          </button>
        ))}
      </div>

      {/* ── Table ───────────────────────────────────────────────────── */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-800/60">
              {(
                [
                  ['Client',      'text-left  px-5'],
                  ['Region',      'text-left  px-4'],
                  ['Last Order',  'text-left  px-4'],
                  ['Tonnage YTD', 'text-right px-4'],
                  ['Commission',  'text-right px-4'],
                  ['MoM Trend',   'text-right px-4'],
                  ['Status',      'text-right px-5'],
                ] as [string, string][]
              ).map(([label, cls]) => (
                <th
                  key={label}
                  className={clsx(
                    'py-3 text-[11px] font-medium uppercase tracking-wider text-zinc-500',
                    cls
                  )}
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60">
            {sorted.map((lead, i) => (
              <LeadRow key={lead.id} lead={lead} index={i} />
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Footer ──────────────────────────────────────────────────── */}
      <div className="border-t border-zinc-800 px-5 py-3">
        <p className="text-[11px] text-zinc-600">
          Showing {sorted.length} of {leads.length} clients · Live data · Updated just now
        </p>
      </div>
    </div>
  )
}
