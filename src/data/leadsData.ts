export type LeadStatus = 'hot' | 'cooling' | 'at-risk'

export interface Lead {
  id: string
  clientName: string
  company: string
  industry: string
  region: string
  lastOrderDate: string  // ISO 8601
  totalTonnage: number   // metric tons, year-to-date
  commissionValue: number // USD, year-to-date
  status: LeadStatus
  monthlyTrend: number   // % change vs previous month (positive = growth)
  ordersThisMonth: number
  avgOrderSize: number   // metric tons per order
}

export const leads: Lead[] = [
  {
    id: 'lead-001',
    clientName: 'Chen Wei',
    company: 'Pacific Commodities Ltd',
    industry: 'Commodities Trading',
    region: 'East Asia',
    lastOrderDate: '2026-04-14',
    totalTonnage: 2310,
    commissionValue: 41580,
    status: 'hot',
    monthlyTrend: 31,
    ordersThisMonth: 9,
    avgOrderSize: 257,
  },
  {
    id: 'lead-002',
    clientName: 'Marcus Webb',
    company: 'Atlas Steel Group',
    industry: 'Steel & Metals',
    region: 'North America',
    lastOrderDate: '2026-04-14',
    totalTonnage: 1842,
    commissionValue: 28340,
    status: 'hot',
    monthlyTrend: 23,
    ordersThisMonth: 7,
    avgOrderSize: 263,
  },
  {
    id: 'lead-003',
    clientName: 'Raj Patel',
    company: 'Gulf Construction Materials',
    industry: 'Construction',
    region: 'Middle East',
    lastOrderDate: '2026-04-13',
    totalTonnage: 1560,
    commissionValue: 24890,
    status: 'hot',
    monthlyTrend: 18,
    ordersThisMonth: 6,
    avgOrderSize: 260,
  },
  {
    id: 'lead-004',
    clientName: 'Priya Sharma',
    company: 'Meridian Chemicals',
    industry: 'Chemical Distribution',
    region: 'South Asia',
    lastOrderDate: '2026-04-12',
    totalTonnage: 1205,
    commissionValue: 19720,
    status: 'hot',
    monthlyTrend: 15,
    ordersThisMonth: 5,
    avgOrderSize: 241,
  },
  {
    id: 'lead-005',
    clientName: 'David Kowalski',
    company: 'Nordic Bulk Logistics',
    industry: 'Bulk Transport',
    region: 'Europe',
    lastOrderDate: '2026-04-08',
    totalTonnage: 987,
    commissionValue: 15640,
    status: 'cooling',
    monthlyTrend: -8,
    ordersThisMonth: 2,
    avgOrderSize: 493,
  },
  {
    id: 'lead-006',
    clientName: 'James Okafor',
    company: 'West Africa Agro Exports',
    industry: 'Agricultural Commodities',
    region: 'West Africa',
    lastOrderDate: '2026-04-01',
    totalTonnage: 785,
    commissionValue: 9870,
    status: 'cooling',
    monthlyTrend: -12,
    ordersThisMonth: 1,
    avgOrderSize: 392,
  },
  {
    id: 'lead-007',
    clientName: 'Sofia Reyes',
    company: 'Andean Mining Corp',
    industry: 'Mining & Extraction',
    region: 'South America',
    lastOrderDate: '2026-03-28',
    totalTonnage: 654,
    commissionValue: 11230,
    status: 'at-risk',
    monthlyTrend: -34,
    ordersThisMonth: 0,
    avgOrderSize: 327,
  },
  {
    id: 'lead-008',
    clientName: 'Elena Vasquez',
    company: 'Iberian Industrial Supplies',
    industry: 'Industrial Materials',
    region: 'Europe',
    lastOrderDate: '2026-03-15',
    totalTonnage: 421,
    commissionValue: 6540,
    status: 'at-risk',
    monthlyTrend: -41,
    ordersThisMonth: 0,
    avgOrderSize: 210,
  },
]
