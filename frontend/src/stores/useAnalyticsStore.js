import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { analyticsService } from '../services/apiService'

export const useAnalyticsStore = create((set, get) => ({
  analytics: null,
  loading: false,
  
  fetchAnalytics: async (timeRange) => {
    set({ loading: true })
    try {
      const response = await analyticsService.getAnalytics(timeRange)
      set({ analytics: response.data, loading: false })
    } catch (error) {
      set({ error: error.message, loading: false })
    }
  }
}))