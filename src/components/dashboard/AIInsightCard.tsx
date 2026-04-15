import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import type { RevenueDataPoint } from '../../data/revenueData'

// ─── Types ───────────────────────────────────────────────────────────────────

interface Insight {
  emoji: string
  text: string
}

interface AIInsightCardProps {
  data: RevenueDataPoint[]
}

// ─── Month sequence for projection label ─────────────────────────────────────

const MONTH_SEQUENCE = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
]

// ─── Formatters ──────────────────────────────────────────────────────────────

const usd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

// ─── Insight computation ─────────────────────────────────────────────────────

function computeInsights(data: RevenueDataPoint[]): Insight[] {
  const last    = data[data.length - 1]
  const prev    = data[data.length - 2]

  // Best month by gross sales
  const best     = data.reduce((acc, d) => (d.sales > acc.sales ? d : acc))
  const bestIdx  = data.indexOf(best)
  const bestMoM  =
    bestIdx > 0
      ? ((best.sales - data[bestIdx - 1].sales) / data[bestIdx - 1].sales) * 100
      : 0

  // Commission rate on the latest month
  const commRate = (last.commissions / last.sales) * 100

  // Commission advice based on rate
  const commAdvice =
    commRate < 12.5
      ? 'push higher-margin SKUs to improve yield'
      : commRate < 14
      ? 'explore premium product lines for upside'
      : 'strong margin discipline — maintain the mix'

  // Next-month projection using the latest MoM growth rate
  const momGrowthRate = (last.sales - prev.sales) / prev.sales
  const projected     = Math.round(last.sales * (1 + momGrowthRate))

  const lastMonthIdx  = MONTH_SEQUENCE.indexOf(last.month)
  const nextMonthName = MONTH_SEQUENCE[(lastMonthIdx + 1) % 12]

  return [
    {
      emoji: '📈',
      text: `${best.month} was your strongest month — ${usd.format(best.sales)} in sales, up +${bestMoM.toFixed(0)}% MoM`,
    },
    {
      emoji: commRate < 14 ? '⚠️' : '✅',
      text: `Commission rate holding at ${commRate.toFixed(1)}% — ${commAdvice}`,
    },
    {
      emoji: '🎯',
      text: `At current pace, you'll close ${nextMonthName} at ~${usd.format(projected)}`,
    },
  ]
}

// ─── AIInsightCard ───────────────────────────────────────────────────────────

export function AIInsightCard({ data }: AIInsightCardProps) {
  const insights = computeInsights(data)

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      // Distinct card treatment: indigo left border signals AI origin
      className="overflow-hidden rounded-xl border border-zinc-800 border-l-2 border-l-indigo-500 bg-zinc-900/50"
    >
      {/* ── Header ──────────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-4 border-b border-zinc-800 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-indigo-500/10 ring-1 ring-indigo-500/20">
            <Sparkles className="h-4 w-4 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-zinc-100">AI Insights</h2>
            <p className="text-xs text-zinc-500">Powered by InsightAI · Updated just now</p>
          </div>
        </div>
        <span className="rounded-full bg-indigo-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-indigo-400 ring-1 ring-indigo-500/20">
          Live
        </span>
      </div>

      {/* ── Insight lines ──────────────────────────────────────── */}
      <div className="divide-y divide-zinc-800/60">
        {insights.map((insight, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25, delay: 0.1 + i * 0.08, ease: 'easeOut' }}
            className="flex items-start gap-3 px-5 py-3.5"
          >
            <span className="mt-px flex-shrink-0 text-base leading-none" role="img" aria-hidden="true">
              {insight.emoji}
            </span>
            <p className="text-sm leading-relaxed text-zinc-300">{insight.text}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
