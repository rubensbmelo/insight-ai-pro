import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import {
  LayoutDashboard,
  Users,
  Package,
  DollarSign,
  BarChart2,
  Settings,
  Search,
  Bell,
  Menu,
  Zap,
  ChevronRight,
} from 'lucide-react'
import { clsx } from 'clsx'

// ─── Types ───────────────────────────────────────────────────────────────────

export type NavPage =
  | 'dashboard'
  | 'leads'
  | 'tonnage'
  | 'commissions'
  | 'reports'
  | 'settings'

interface NavItem {
  id: NavPage
  label: string
  icon: LucideIcon
}

interface ShellProps {
  activePage: NavPage
  onNavigate: (page: NavPage) => void
  children: React.ReactNode
}

// ─── Constants ───────────────────────────────────────────────────────────────

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard',   label: 'Dashboard',   icon: LayoutDashboard },
  { id: 'leads',       label: 'Leads',       icon: Users           },
  { id: 'tonnage',     label: 'Tonnage',     icon: Package         },
  { id: 'commissions', label: 'Commissions', icon: DollarSign      },
  { id: 'reports',     label: 'Reports',     icon: BarChart2       },
  { id: 'settings',    label: 'Settings',    icon: Settings        },
]

const PAGE_LABELS: Record<NavPage, string> = {
  dashboard:   'Dashboard',
  leads:       'Leads',
  tonnage:     'Tonnage',
  commissions: 'Commissions',
  reports:     'Reports',
  settings:    'Settings',
}

// ─── Shell ───────────────────────────────────────────────────────────────────

export function Shell({ activePage, onNavigate, children }: ShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setSidebarOpen(false)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleNavigate = (page: NavPage) => {
    onNavigate(page)
    setSidebarOpen(false)
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#09090b]">
      {/* ── Desktop sidebar ───────────────────────────────────────────── */}
      <aside className="hidden lg:flex w-64 flex-shrink-0 flex-col border-r border-zinc-800 bg-zinc-950">
        <SidebarContent activePage={activePage} onNavigate={handleNavigate} />
      </aside>

      {/* ── Mobile sidebar + overlay ──────────────────────────────────── */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              key="drawer"
              initial={{ x: -256 }}
              animate={{ x: 0 }}
              exit={{ x: -256 }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              className="fixed left-0 top-0 z-50 flex h-full w-64 flex-col border-r border-zinc-800 bg-zinc-950 lg:hidden"
            >
              <SidebarContent activePage={activePage} onNavigate={handleNavigate} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── Main area ─────────────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar
          activePage={activePage}
          onMenuClick={() => setSidebarOpen(true)}
        />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

// ─── Sidebar Content ─────────────────────────────────────────────────────────

interface SidebarContentProps {
  activePage: NavPage
  onNavigate: (page: NavPage) => void
}

function SidebarContent({ activePage, onNavigate }: SidebarContentProps) {
  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex items-center gap-2.5 border-b border-zinc-800 px-5 py-4">
        <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md bg-indigo-500/15 ring-1 ring-indigo-500/30">
          <Zap className="h-3.5 w-3.5 text-indigo-400" />
        </div>
        <span className="text-sm font-semibold tracking-tight text-zinc-100">
          Insight<span className="text-indigo-400">AI</span>
        </span>
        <span className="ml-auto rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide bg-indigo-500/10 text-indigo-400 ring-1 ring-indigo-500/20">
          Pro
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-0.5 px-3 py-4">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const isActive = activePage === item.id
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={clsx(
                'group flex w-full items-center gap-3 rounded-md px-2.5 py-2 text-sm font-medium transition-all duration-150',
                isActive
                  ? 'bg-indigo-500/10 text-indigo-300 ring-1 ring-inset ring-indigo-500/20'
                  : 'text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-100'
              )}
            >
              <Icon
                className={clsx(
                  'h-4 w-4 flex-shrink-0 transition-colors duration-150',
                  isActive
                    ? 'text-indigo-400'
                    : 'text-zinc-500 group-hover:text-zinc-300'
                )}
              />
              <span className="flex-1 text-left">{item.label}</span>
              {isActive && (
                <ChevronRight className="h-3.5 w-3.5 text-indigo-400/50" />
              )}
            </button>
          )
        })}
      </nav>

      {/* User profile */}
      <div className="border-t border-zinc-800 px-3 py-3">
        <div className="flex items-center gap-3 rounded-md px-2.5 py-2">
          <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 text-xs font-bold text-white">
            A
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium text-zinc-200">Alex Morgan</p>
            <p className="truncate text-[11px] text-zinc-500">Senior Sales Rep</p>
          </div>
          <div className="h-2 w-2 flex-shrink-0 rounded-full bg-emerald-500" title="Online" />
        </div>
      </div>
    </div>
  )
}

// ─── TopBar ──────────────────────────────────────────────────────────────────

interface TopBarProps {
  activePage: NavPage
  onMenuClick: () => void
}

function TopBar({ activePage, onMenuClick }: TopBarProps) {
  return (
    <header className="flex h-14 flex-shrink-0 items-center gap-4 border-b border-zinc-800 bg-zinc-950/80 px-4 backdrop-blur-sm lg:px-6">
      {/* Mobile: hamburger */}
      <button
        onClick={onMenuClick}
        aria-label="Open navigation menu"
        className="flex h-8 w-8 items-center justify-center rounded-md text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-100 lg:hidden"
      >
        <Menu className="h-4 w-4" />
      </button>

      {/* Desktop: breadcrumb */}
      <div className="hidden items-center gap-1.5 text-sm lg:flex">
        <span className="text-zinc-500">InsightAI</span>
        <ChevronRight className="h-3.5 w-3.5 text-zinc-700" />
        <span className="font-medium text-zinc-200">{PAGE_LABELS[activePage]}</span>
      </div>

      {/* AI Command Bar */}
      <div className="flex flex-1 justify-center">
        <div className="relative w-full max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Ask InsightAI anything..."
            className={clsx(
              'h-8 w-full rounded-md border border-zinc-800 bg-zinc-900',
              'pl-8 pr-16 text-sm text-zinc-300 placeholder:text-zinc-600',
              'transition-all duration-200',
              'focus:border-indigo-500/50 focus:outline-none',
              'focus:ring-2 focus:ring-indigo-500/20',
            )}
          />
          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-0.5">
            <kbd className="rounded border border-zinc-700 bg-zinc-800 px-1 py-px text-[10px] font-medium text-zinc-500">
              ⌘K
            </kbd>
          </div>
        </div>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2">
        <button
          aria-label="Notifications"
          className="relative flex h-8 w-8 items-center justify-center rounded-md text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-100"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-indigo-500" />
        </button>
        <div
          className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 text-xs font-bold text-white"
          aria-label="User menu"
        >
          A
        </div>
      </div>
    </header>
  )
}
