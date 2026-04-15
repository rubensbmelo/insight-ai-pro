import { motion } from 'framer-motion'
import { DollarSign } from 'lucide-react'
import { clsx } from 'clsx'
import { revenueData } from '../../data/revenueData'

// ─── Derived data ─────────────────────────────────────────────────────────────

// Current month = latest entry in data
const currentMonth = revenueData[revenueData.length - 1]
const earned       = currentMonth.commissions

// Target: 15% above the best commission month — a realistic stretch goal
const bestCommission = Math.max(...revenueData.map((d) => d.commissions))
const monthlyTarget  = Math.round(bestCommission * 1.15)

// ─── Helpers ─────────────────────────────────────────────────────────────────

const usd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

function getThreshold(pct: number): 'below' | 'on-track' | 'excellent' {
  if (pct >= 90) return 'excellent'
  if (pct >= 70) return 'on-track'
  return 'below'
}

const THRESHOLD_STYLES = {
  below:     { bar: 'bg-rose-500',   text: 'text-rose-400',   label: 'Behind target' },
  'on-track':{ bar: 'bg-indigo-500', text: 'text-indigo-400', label: 'On track'      },
  excellent: { bar: 'bg-emerald-500',text: 'text-emerald-400',label: 'Excellent'      },
} as const

// ─── CommissionGap ────────────────────────────────────────────────────────────

export function CommissionGap() {
  const pct       = Math.min((earned / monthlyTarget) * 100, 100)
  const threshold = getThreshold(pct)
  const styles    = THRESHOLD_STYLES[threshold]

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50">
      {/* ── Header ───────────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-4 border-b border-zinc-800 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-indigo-500/10 ring-1 ring-indigo-500/20">
            <DollarSign className="h-4 w-4 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-zinc-100">Commission Progress</h2>
            <p className="text-xs text-zinc-500">{currentMonth.month} · Monthly target</p>
          </div>
        </div>

        {/* Status badge */}
        <span
          className={clsx(
            'rounded-full px-2.5 py-1 text-xs font-medium ring-1',
            threshold === 'below'
              ? 'bg-rose-500/10 text-rose-400 ring-rose-500/20'
              : threshold === 'excellent'
              ? 'bg-emerald-500/10 text-emerald-400 ring-emerald-500/20'
              : 'bg-indigo-500/10 text-indigo-400 ring-indigo-500/20'
          )}
        >
          {styles.label}
        </span>
      </div>

      {/* ── Body ─────────────────────────────────────────────────── */}
      <div className="px-5 py-4">
        {/* Earned / target figures */}
        <div className="mb-3 flex items-end justify-between">
          <div>
            <span className="text-2xl font-bold tracking-tight text-zinc-100">
              {usd.format(earned)}
            </span>
            <span className="ml-2 text-sm text-zinc-500">earned</span>
          </div>
          <div className="text-right">
            <span className={clsx('text-lg font-bold tracking-tight', styles.text)}>
              {pct.toFixed(1)}%
            </span>
            <p className="text-xs text-zinc-600">of {usd.format(monthlyTarget)} target</p>
          </div>
        </div>

        {/* Progress bar track */}
        <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
          {/* Animated fill — width grows from 0% to actual pct on mount */}
          <motion.div
            className={clsx('relative h-full overflow-hidden rounded-full', styles.bar)}
            initial={{ width: '0%' }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.9, ease: 'easeOut', delay: 0.15 }}
          >
            {/* Shimmer — slides across the filled bar on infinite loop */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              animate={{ x: ['-100%', '200%'] }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                repeatDelay: 1.5,
                ease: 'easeInOut',
              }}
            />
          </motion.div>
        </div>

        {/* Scale labels */}
        <div className="mt-1.5 flex justify-between">
          <span className="text-[10px] text-zinc-700">$0</span>
          <span className="text-[10px] text-zinc-700">70%</span>
          <span className="text-[10px] text-zinc-700">90%</span>
          <span className="text-[10px] text-zinc-700">{usd.format(monthlyTarget)}</span>
        </div>
      </div>
    </div>
  )
}
