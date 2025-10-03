import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { authService } from '../services/apiService'

// Token management helpers
const tokenService = {
  getToken: () => {
    try {
      return localStorage.getItem('auth_token')
    } catch (error) {
      console.error('Error getting token:', error)
      return null
    }
  },
  
  setToken: (token) => {
    try {
      localStorage.setItem('auth_token', token)
    } catch (error) {
      console.error('Error setting token:', error)
    }
  },
  
  removeToken: () => {
    try {
      localStorage.removeItem('auth_token')
    } catch (error) {
      console.error('Error removing token:', error)
    }
  },
  
  getRefreshToken: () => {
    try {
      return localStorage.getItem('refresh_token')
    } catch (error) {
      console.error('Error getting refresh token:', error)
      return null
    }
  },
  
  setRefreshToken: (token) => {
    try {
      localStorage.setItem('refresh_token', token)
    } catch (error) {
      console.error('Error setting refresh token:', error)
    }
  },
  
  removeRefreshToken: () => {
    try {
      localStorage.removeItem('refresh_token')
    } catch (error) {
      console.error('Error removing refresh token:', error)
    }
  },
}

export const useAuthStore = create(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null,

        // Actions
        setLoading: (loading) => set({ 
          loading, 
          error: loading ? null : get().error 
        }),

        setError: (error) => set({ error }),
        
        clearError: () => set({ error: null }),

        // Login with actual API
        login: async (email, password) => {
          set({ loading: true, error: null })
          
          try {
            const response = await authService.login(email, password)
            console.log('Login response:', response.data)
            const { user, access_token, resfresh_token } = response.data

            // Store tokens
            tokenService.setToken(access_token)
            if (resfresh_token) {
              tokenService.setRefreshToken(resfresh_token)
            }

            set({ 
              user, 
              isAuthenticated: true, 
              loading: false 
            })

            return user
          } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Login failed'
            set({ 
              error: errorMessage, 
              loading: false 
            })
            throw error
          }
        },

        // Register with actual API
        register: async (userData) => {
          set({ loading: true, error: null })
          
          try {
            const response = await authService.register(userData)
            console.log('Registration response:', response.data)
            const { user, access_token, resfresh_token } = response.data

            // Store tokens
            tokenService.setToken(access_token)
            if (resfresh_token) {
              tokenService.setRefreshToken(resfresh_token)
            }

            set({ 
              user, 
              isAuthenticated: true, 
              loading: false 
            })

            return user
          } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Registration failed'
            set({ 
              error: errorMessage, 
              loading: false 
            })
            throw error
          }
        },

        // Logout with API call
        logout: async () => {
          try {
            // Call logout endpoint to invalidate token on server
            await authService.logout()
          } catch (error) {
            console.error('Logout API call failed:', error)
            // Continue with client-side logout even if API call fails
          } finally {
            // Always clear client-side state
            tokenService.removeToken()
            tokenService.removeRefreshToken()
            set({ 
              user: null, 
              isAuthenticated: false,
              error: null
            })
          }
        },

        // Check authentication status with token validation
        checkAuth: async () => {
          const token = tokenService.getToken()
          
          if (!token) {
            set({ isAuthenticated: false, user: null })
            return false
          }

          set({ loading: true })
          
          try {
            // Verify token is still valid by fetching current user
            const response = await authService.getCurrentUser()
            const { user } = response.data

            set({ 
              user, 
              isAuthenticated: true, 
              loading: false 
            })
            return true
          } catch (error) {
            // Token is invalid, clear auth state
            console.error('Auth check failed:', error)
            tokenService.removeToken()
            tokenService.removeRefreshToken()
            set({ 
              user: null, 
              isAuthenticated: false, 
              loading: false 
            })
            return false
          }
        },

        // Update user profile
        updateProfile: async (profileData) => {
          set({ loading: true })
          
          try {
            const response = await authService.updateProfile(profileData)
            const { user } = response.data

            set({ 
              user, 
              loading: false 
            })

            return user
          } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Profile update failed'
            set({ 
              error: errorMessage, 
              loading: false 
            })
            throw error
          }
        },

        // Change password
        changePassword: async (currentPassword, newPassword) => {
          set({ loading: true, error: null })
          
          try {
            await authService.changePassword(currentPassword, newPassword)
            set({ loading: false })
          } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Password change failed'
            set({ 
              error: errorMessage, 
              loading: false 
            })
            throw error
          }
        },

        // Forgot password
        forgotPassword: async (email) => {
          set({ loading: true, error: null })
          
          try {
            await authService.forgotPassword(email)
            set({ loading: false })
          } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Password reset request failed'
            set({ 
              error: errorMessage, 
              loading: false 
            })
            throw error
          }
        },

        // Reset password
        resetPassword: async (token, password) => {
          set({ loading: true, error: null })
          
          try {
            await authService.resetPassword(token, password)
            set({ loading: false })
          } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Password reset failed'
            set({ 
              error: errorMessage, 
              loading: false 
            })
            throw error
          }
        },

        // Verify email
        verifyEmail: async (token) => {
          set({ loading: true, error: null })
          
          try {
            const response = await authService.verifyEmail(token)
            const { user } = response.data

            set({ 
              user, 
              loading: false 
            })

            return user
          } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Email verification failed'
            set({ 
              error: errorMessage, 
              loading: false 
            })
            throw error
          }
        },

        // Resend verification email
        resendVerification: async (email) => {
          set({ loading: true, error: null })
          
          try {
            await authService.resendVerification(email)
            set({ loading: false })
          } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Failed to resend verification email'
            set({ 
              error: errorMessage, 
              loading: false 
            })
            throw error
          }
        },

        // Refresh token (for automatic token renewal)
        refreshToken: async () => {
          const refreshToken = tokenService.getRefreshToken()
          
          if (!refreshToken) {
            throw new Error('No refresh token available')
          }

          try {
            const response = await authService.refreshToken(refreshToken)
            const { token, refreshToken: newRefreshToken } = response.data

            // Update tokens
            tokenService.setToken(token)
            if (newRefreshToken) {
              tokenService.setRefreshToken(newRefreshToken)
            }

            return token
          } catch (error) {
            // Refresh failed, logout user
            get().logout()
            throw error
          }
        }
      }),
      {
        name: 'auth-storage',
        partialize: (state) => ({ 
          user: state.user,
          isAuthenticated: state.isAuthenticated
        })
      }
    )
  )
)