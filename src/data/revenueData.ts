export interface RevenueDataPoint {
  month: string
  sales: number       // USD — gross sales revenue
  commissions: number // USD — earned commissions (~13% of sales)
  tonnage: number     // metric tons shipped
}

// 6 months ending April 2026 — commercial rep, packaging & cardboard materials
export const revenueData: RevenueDataPoint[] = [
  { month: 'Nov', sales:  87400, commissions: 10490, tonnage: 412 },
  { month: 'Dec', sales: 103200, commissions: 13420, tonnage: 501 },
  { month: 'Jan', sales:  91800, commissions: 11930, tonnage: 441 },
  { month: 'Feb', sales: 119600, commissions: 15550, tonnage: 578 },
  { month: 'Mar', sales: 137400, commissions: 17860, tonnage: 664 },
  { month: 'Apr', sales: 148900, commissions: 19360, tonnage: 721 },
]
