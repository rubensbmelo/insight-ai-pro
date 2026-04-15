import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { TrendingUp } from 'lucide-react'
import { revenueData } from '../../data/revenueData'

// ─── Types ───────────────────────────────────────────────────────────────────

interface TooltipPayloadEntry {
  name: string
  value: number
  color: string
  dataKey: string
}

interface CustomTooltipProps {
  active?: boolean
  payload?: TooltipPayloadEntry[]
  label?: string
}

// ─── Constants ───────────────────────────────────────────────────────────────

const SERIES = [
  { dataKey: 'sales',       name: 'Sales Revenue', stroke: '#818cf8', gradientId: 'gradSales'       },
  { dataKey: 'commissions', name: 'Commissions',   stroke: '#94a3b8', gradientId: 'gradCommissions' },
  { dataKey: 'tonnage',     name: 'Tonnage',       stroke: '#34d399', gradientId: 'gradTonnage'     },
] as const

const GRADIENTS: { id: string; color: string; topOpacity: number }[] = [
  { id: 'gradSales',       color: '#6366f1', topOpacity: 0.30 },
  { id: 'gradCommissions', color: '#94a3b8', topOpacity: 0.22 },
  { id: 'gradTonnage',     color: '#10b981', topOpacity: 0.20 },
]

// ─── Formatters ──────────────────────────────────────────────────────────────

const usd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

function formatLeftAxis(value: number): string {
  return `$${(value / 1000).toFixed(0)}k`
}

function formatRightAxis(value: number): string {
  return `${value}t`
}

function formatTooltipValue(dataKey: string, value: number): string {
  if (dataKey === 'tonnage') return `${value.toLocaleString('en-US')} t`
  return usd.format(value)
}

// ─── Custom Tooltip ──────────────────────────────────────────────────────────

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null

  return (
    <div
      style={{
        backgroundColor: '#18181b',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '8px',
        padding: '12px 14px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
        minWidth: '200px',
      }}
    >
      <p style={{ fontSize: '11px', fontWeight: 500, color: '#71717a', marginBottom: '10px' }}>
        {label} 2025–2026
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
        {payload.map((entry) => (
          <div
            key={entry.dataKey}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '24px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  display: 'inline-block',
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  backgroundColor: entry.color,
                  flexShrink: 0,
                }}
              />
              <span style={{ fontSize: '12px', color: '#a1a1aa' }}>{entry.name}</span>
            </div>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#f4f4f5' }}>
              {formatTooltipValue(entry.dataKey, entry.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Legend Dot ──────────────────────────────────────────────────────────────

interface LegendItemProps {
  color: string
  label: string
}

function LegendItem({ color, label }: LegendItemProps) {
  return (
    <div className="flex items-center gap-1.5">
      <span
        className="h-2 w-2 rounded-full flex-shrink-0"
        style={{ backgroundColor: color }}
      />
      <span className="text-xs text-zinc-500">{label}</span>
    </div>
  )
}

// ─── RevenueChart ─────────────────────────────────────────────────────────────

export function RevenueChart() {
  return (
    <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50">
      {/* ── Card header ─────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-zinc-800 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-indigo-500/10 ring-1 ring-indigo-500/20">
            <TrendingUp className="h-4 w-4 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-zinc-100">Revenue Overview</h2>
            <p className="text-xs text-zinc-500">Last 6 months · Packaging &amp; Industrial</p>
          </div>
        </div>

        {/* Series legend */}
        <div className="flex items-center gap-4 pt-0.5">
          <LegendItem color="#818cf8" label="Sales Revenue" />
          <LegendItem color="#94a3b8" label="Commissions" />
          <LegendItem color="#34d399" label="Tonnage" />
        </div>
      </div>

      {/* ── Chart ───────────────────────────────────────────────────── */}
      <div className="h-72 w-full px-2 py-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={revenueData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>

            {/* Gradient definitions */}
            <defs>
              {GRADIENTS.map(({ id, color, topOpacity }) => (
                <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={color} stopOpacity={topOpacity} />
                  <stop offset="95%" stopColor={color} stopOpacity={0.01}       />
                </linearGradient>
              ))}
            </defs>

            {/* Grid — horizontal only, very subtle */}
            <CartesianGrid
              vertical={false}
              stroke="rgba(255,255,255,0.06)"
              strokeDasharray="3 3"
            />

            {/* X axis */}
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#71717a', fontSize: 12 }}
              dy={8}
            />

            {/* Left Y axis — monetary values */}
            <YAxis
              yAxisId="left"
              orientation="left"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#71717a', fontSize: 12 }}
              tickFormatter={formatLeftAxis}
              width={46}
            />

            {/* Right Y axis — tonnage */}
            <YAxis
              yAxisId="right"
              orientation="right"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#71717a', fontSize: 12 }}
              tickFormatter={formatRightAxis}
              width={40}
            />

            {/* Custom tooltip */}
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: 'rgba(255,255,255,0.07)', strokeWidth: 1 }}
            />

            {/* Areas */}
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="sales"
              name="Sales Revenue"
              stroke={SERIES[0].stroke}
              strokeWidth={1.5}
              fill={`url(#${SERIES[0].gradientId})`}
              dot={false}
              activeDot={{ r: 4, fill: SERIES[0].stroke, strokeWidth: 0 }}
            />
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="commissions"
              name="Commissions"
              stroke={SERIES[1].stroke}
              strokeWidth={1.5}
              fill={`url(#${SERIES[1].gradientId})`}
              dot={false}
              activeDot={{ r: 4, fill: SERIES[1].stroke, strokeWidth: 0 }}
            />
            <Area
              yAxisId="right"
              type="monotone"
              dataKey="tonnage"
              name="Tonnage"
              stroke={SERIES[2].stroke}
              strokeWidth={1.5}
              fill={`url(#${SERIES[2].gradientId})`}
              dot={false}
              activeDot={{ r: 4, fill: SERIES[2].stroke, strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
