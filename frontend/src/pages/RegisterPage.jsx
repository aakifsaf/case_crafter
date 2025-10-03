import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/useAuthStore'
import { EyeIcon, EyeSlashIcon, XCircleIcon } from '@heroicons/react/24/outline'

export const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    company: '',
    acceptTerms: false
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [mounted, setMounted] = useState(false)

  const { register, isAuthenticated, loading, error, clearError } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/projects', { replace: true })
    }
  }, [isAuthenticated, navigate])

  useEffect(() => {
    clearError()
  }, [formData, clearError])

  useEffect(() => {
    let strength = 0
    if (formData.password.length >= 8) strength++
    if (/[A-Z]/.test(formData.password)) strength++
    if (/[0-9]/.test(formData.password)) strength++
    if (/[^A-Za-z0-9]/.test(formData.password)) strength++
    setPasswordStrength(strength)
  }, [formData.password])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      clearError()
      useAuthStore.getState().setError('Passwords do not match')
      return
    }

    if (!formData.acceptTerms) {
      clearError()
      useAuthStore.getState().setError('Please accept the terms and conditions')
      return
    }

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        company: formData.company
      })
    } catch (error) {
      // Error handled by store
    }
  }

  const getPasswordStrengthColor = () => {
    if (passwordStrength === 0) return 'bg-gray-500'
    if (passwordStrength <= 2) return 'bg-red-500'
    if (passwordStrength === 3) return 'bg-yellow-500'
    return 'bg-gradient-to-r from-green-400 to-cyan-500'
  }

  const getPasswordStrengthText = () => {
    if (passwordStrength === 0) return 'Enter a password'
    if (passwordStrength <= 2) return 'Weak'
    if (passwordStrength === 3) return 'Good'
    return 'Strong'
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 animate-pulse"></div>
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 animate-moveGradient"></div>
      
      <div className={`max-w-md w-full space-y-8 transform transition-all duration-1000 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        {/* Logo with glow effect */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/50 mb-6">
            <span className="text-white font-bold text-2xl tracking-tighter">AQ</span>
          </div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
            Create Your Account
          </h2>
          <p className="text-slate-300 text-lg">
            Join the future of requirement analysis
          </p>
          <p className="mt-2 text-sm text-slate-400">
            Or{' '}
            <Link
              to="/login"
              className="font-medium text-cyan-400 hover:text-cyan-300 transition-colors duration-200 hover:underline"
            >
              sign in to your existing account
            </Link>
          </p>
        </div>

        {/* Glassmorphism form card */}
        <div className="bg-slate-800/30 backdrop-blur-md rounded-3xl border border-slate-700/50 p-8 shadow-2xl shadow-slate-900/50">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-xl bg-red-400/10 p-4 border border-red-400/20 backdrop-blur-sm">
                <div className="flex items-center">
                  <XCircleIcon className="h-5 w-5 text-red-400 mr-2" />
                  <span className="text-red-200 text-sm">{error}</span>
                </div>
              </div>
            )}

            <div className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="w-full px-4 py-3 bg-slate-800/40 border border-slate-600/30 rounded-xl text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/30 transition-all duration-300"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>

              <div>
                <label htmlFor="company" className="block text-sm font-medium text-slate-300 mb-2">
                  Company (Optional)
                </label>
                <input
                  id="company"
                  name="company"
                  type="text"
                  className="w-full px-4 py-3 bg-slate-800/40 border border-slate-600/30 rounded-xl text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/30 transition-all duration-300"
                  placeholder="Your Company"
                  value={formData.company}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="w-full px-4 py-3 bg-slate-800/40 border border-slate-600/30 rounded-xl text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/30 transition-all duration-300"
                  placeholder="email@company.com"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    className="w-full px-4 py-3 bg-slate-800/40 border border-slate-600/30 rounded-xl text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/30 transition-all duration-300 pr-12"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-cyan-400 transition-colors duration-200"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
                
                {formData.password && (
                  <div className="mt-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-slate-400">Password strength</span>
                      <span className="text-xs font-medium text-cyan-300">
                        {getPasswordStrengthText()}
                      </span>
                    </div>
                    <div className="w-full bg-slate-700/30 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ease-out ${getPasswordStrengthColor()}`}
                        style={{ width: `${(passwordStrength / 4) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-300 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    className="w-full px-4 py-3 bg-slate-800/40 border border-slate-600/30 rounded-xl text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/30 transition-all duration-300 pr-12"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-cyan-400 transition-colors duration-200"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center">
                <input
                  id="acceptTerms"
                  name="acceptTerms"
                  type="checkbox"
                  required
                  className="h-5 w-5 bg-slate-800/40 border border-slate-600/30 rounded focus:ring-cyan-500/50 focus:ring-offset-slate-900 checked:bg-cyan-500/50 transition-all duration-200"
                  checked={formData.acceptTerms}
                  onChange={handleChange}
                  disabled={loading}
                />
                <label htmlFor="acceptTerms" className="ml-3 block text-sm text-slate-300">
                  I agree to the{' '}
                  <a href="#" className="text-cyan-400 hover:text-cyan-300 transition-colors duration-200">
                    Terms
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-cyan-400 hover:text-cyan-300 transition-colors duration-200">
                    Privacy Policy
                  </a>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl font-medium shadow-lg shadow-blue-500/30 hover:shadow-cyan-500/40 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Creating Account...
                </div>
              ) : (
                <span className="flex items-center justify-center">
                  Create Account
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
