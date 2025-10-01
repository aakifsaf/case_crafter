import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export const useAuthStore = create(
  devtools((set, get) => ({
    // State
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,

    // Actions
    setLoading: (loading) => set({ loading, error: loading ? null : get().error }),
    setError: (error) => set({ error }),
    clearError: () => set({ error: null }),

    // Login action
    login: async (email, password) => {
      set({ loading: true, error: null })
      try {
        // Simulate API call - replace with actual API
        const response = await new Promise((resolve) => 
          setTimeout(() => resolve({ 
            data: { 
              user: { id: 1, email, name: 'Demo User' }, 
              token: 'demo-token' 
            } 
          }), 1000)
        )
        
        const { user, token } = response.data
        localStorage.setItem('auth_token', token)
        localStorage.setItem('user', JSON.stringify(user))
        
        set({ 
          user, 
          isAuthenticated: true, 
          loading: false 
        })
        
        return user
      } catch (error) {
        set({ 
          error: error.message || 'Login failed', 
          loading: false 
        })
        throw error
      }
    },

    // Register action
    register: async (userData) => {
      set({ loading: true, error: null })
      try {
        // Simulate API call - replace with actual API
        const response = await new Promise((resolve) => 
          setTimeout(() => resolve({ 
            data: { 
              user: { id: 2, ...userData }, 
              token: 'demo-token' 
            } 
          }), 1000)
        )
        
        const { user, token } = response.data
        localStorage.setItem('auth_token', token)
        localStorage.setItem('user', JSON.stringify(user))
        
        set({ 
          user, 
          isAuthenticated: true, 
          loading: false 
        })
        
        return user
      } catch (error) {
        set({ 
          error: error.message || 'Registration failed', 
          loading: false 
        })
        throw error
      }
    },

    // Logout action
    logout: () => {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user')
      set({ 
        user: null, 
        isAuthenticated: false 
      })
    },

    // Check authentication status
    checkAuth: () => {
      const token = localStorage.getItem('auth_token')
      const user = localStorage.getItem('user')
      
      if (token && user) {
        set({ 
          user: JSON.parse(user), 
          isAuthenticated: true 
        })
      }
    },

    // Update user profile
    updateProfile: async (profileData) => {
      set({ loading: true })
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const updatedUser = { ...get().user, ...profileData }
        localStorage.setItem('user', JSON.stringify(updatedUser))
        
        set({ 
          user: updatedUser, 
          loading: false 
        })
        
        return updatedUser
      } catch (error) {
        set({ 
          error: error.message || 'Profile update failed', 
          loading: false 
        })
        throw error
      }
    }
  }))
)