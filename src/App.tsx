import { useState } from 'react'
import { Shell, type NavPage } from './components/layout/Shell'
import { KPICards }       from './components/dashboard/KPICards'
import { CommissionGap }  from './components/dashboard/CommissionGap'
import { RevenueChart }   from './components/dashboard/RevenueChart'
import { AIInsightCard }  from './components/dashboard/AIInsightCard'
import { ActiveLeads }    from './components/dashboard/ActiveLeads'
import { revenueData }    from './data/revenueData'

function App() {
  const [activePage, setActivePage] = useState<NavPage>('dashboard')

  return (
    <Shell activePage={activePage} onNavigate={setActivePage}>
      {activePage === 'dashboard' && (
        <div className="space-y-6">
          <KPICards />
          <CommissionGap />
          <RevenueChart />
          <AIInsightCard data={revenueData} />
          <ActiveLeads />
        </div>
      )}

      {activePage !== 'dashboard' && (
        <div className="flex h-64 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/40">
          <p className="text-sm text-zinc-500">
            {activePage.charAt(0).toUpperCase() + activePage.slice(1)} — coming soon
          </p>
        </div>
      )}
    </Shell>
  )
}

export default App
