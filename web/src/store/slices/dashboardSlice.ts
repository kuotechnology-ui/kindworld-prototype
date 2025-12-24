import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { LeaderboardEntry, PointsHistory } from '../../types'

interface DashboardState {
  pointsHistory: PointsHistory[]
  monthlyData: Record<string, PointsHistory[]>
  leaderboard: LeaderboardEntry[]
  selectedMonth: string
  loading: boolean
}

const generatePointsHistory = (month: string): PointsHistory[] => {
  const history: PointsHistory[] = []
  
  // Different base hours for different months
  const monthlyBaseHours = {
    'Dec 2025': 530,
    'Nov 2025': 485,
    'Oct 2025': 447,
    'Sept 2025': 415,
    'Aug 2025': 373
  }
  
  const baseHours = monthlyBaseHours[month as keyof typeof monthlyBaseHours] || 530
  const startHours = Math.max(baseHours - 50, 0)
  
  for (let i = 30; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    
    // Generate progressive growth throughout the month
    const dailyGrowth = (baseHours - startHours) / 30
    const currentHours = startHours + (30 - i) * dailyGrowth + Math.random() * 5
    
    history.push({
      date: date.toISOString().split('T')[0],
      points: Math.floor(currentHours), // Using points field to store hours
    })
  }
  return history
}

// Generate month-specific data
const generateMonthlyData = () => {
  return {
    'Dec 2025': generatePointsHistory('Dec 2025'),
    'Nov 2025': generatePointsHistory('Nov 2025'),
    'Oct 2025': generatePointsHistory('Oct 2025'),
    'Sept 2025': generatePointsHistory('Sept 2025'),
    'Aug 2025': generatePointsHistory('Aug 2025')
  }
}

const monthlyData = generateMonthlyData()

const initialState: DashboardState = {
  pointsHistory: monthlyData['Oct 2025'],
  monthlyData,
  leaderboard: [
    {
      userId: '2',
      displayName: 'Sarah Martinez',
      compassionPoints: 61500, // 1230 hours * 50
      rank: 1,
      change: 0,
    },
    {
      userId: '3',
      displayName: 'James Chen',
      compassionPoints: 59000, // 1180 hours * 50
      rank: 2,
      change: 1,
    },
    {
      userId: '4',
      displayName: 'Emma Patel',
      compassionPoints: 47500, // 950 hours * 50
      rank: 3,
      change: -1,
    },
    {
      userId: '1',
      displayName: 'Alex Chen',
      compassionPoints: 26500, // 530 hours * 50
      rank: 4,
      change: 2,
    },
    {
      userId: '5',
      displayName: 'Maria Johnson',
      compassionPoints: 21000, // 420 hours * 50
      rank: 5,
      change: 0,
    },
    {
      userId: '6',
      displayName: 'David Kim',
      compassionPoints: 19500, // 390 hours * 50
      rank: 6,
      change: 0,
    },
  ],
  selectedMonth: 'Oct 2025',
  loading: false,
}

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setSelectedMonth: (state, action: PayloadAction<string>) => {
      state.selectedMonth = action.payload
      // Update points history when month changes
      if (state.monthlyData[action.payload]) {
        state.pointsHistory = state.monthlyData[action.payload]
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
  },
})

export const { setSelectedMonth, setLoading } = dashboardSlice.actions
export default dashboardSlice.reducer
