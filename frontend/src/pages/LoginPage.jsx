import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../stores/useAuthStore'
import { EyeIcon, EyeSlashIcon, XCircleIcon, SparklesIcon } from '@heroicons/react/24/outline'

export const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [mounted, setMounted] = useState(false)
  
  const { login, isAuthenticated, loading, error, clearError } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from?.pathname || '/projects'

  useEffect(() => {
    setMounted(true)
    if (isAuthenticated) {
      navigate(from, { replace: true })
    }
  }, [isAuthenticated, navigate, from])

  useEffect(() => {
    clearError()
  }, [email, password, clearError])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await login(email, password)
    } catch (error) {
      // Error handled by store
    }
  }

  const handleDemoLogin = async () => {
    setEmail('demo@automagicqa.com')
    setPassword('demo123')
    try {
      await login('demo@automagicqa.com', 'demo123')
    } catch (error) {
      // Error handled by store
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      
      <div className="max-w-md w-full space-y-8 z-10 px-4 sm:px-6 lg:px-8 py-12">
        
          <div className="text-center">
            <div className="mx-auto h-20 w-20 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg mb-6 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-2xl animate-pulse"></div>
              <span className="text-white font-bold text-3xl relative z-10">AQ</span>
              <SparklesIcon className="h-5 w-5 text-cyan-200 absolute -top-1 -right-1 animate-ping" />
            </div>
            <h2 className="mt-2 text-4xl font-bold bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">
              Welcome back
            </h2>
            <p className="mt-3 text-sm text-gray-300">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="font-medium text-cyan-400 hover:text-cyan-300 transition-all duration-300 hover:glow-cyan-500"
              >
                Sign up here
              </Link>
            </p>
          </div>
        <div className={`bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl p-8 pt-0 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-xl bg-red-400/10 p-4 border border-red-400/20 backdrop-blur-sm">
                <div className="flex items-center">
                  <XCircleIcon className="h-5 w-5 text-red-400 mr-2" />
                  <p className="text-sm font-medium text-red-200">
                    {error}
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-5">
              <div>
                <label htmlFor="email-address" className="block text-sm font-medium text-cyan-100 mb-3">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="w-full px-4 py-3.5 bg-black/20 border border-cyan-500/20 rounded-xl focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/30 focus:outline-none transition-all duration-300 placeholder:text-gray-400 text-white backdrop-blur-sm"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-cyan-100 mb-3">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    className="w-full px-4 py-3.5 pr-12 bg-black/20 border border-cyan-500/20 rounded-xl focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/30 focus:outline-none transition-all duration-300 placeholder:text-gray-400 text-white backdrop-blur-sm"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-cyan-200/70 hover:text-cyan-400 transition-all duration-300 hover:scale-110"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-cyan-400 focus:ring-cyan-400/50 border-gray-600 rounded bg-black/20"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-cyan-100">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-cyan-400 hover:text-cyan-300 transition-all duration-300">
                  Forgot password?
                </a>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 text-white py-3.5 px-4 rounded-xl font-medium hover:from-cyan-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-400/50 disabled:opacity-50 transition-all duration-500 transform hover:scale-[1.02] shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 relative overflow-hidden group"
            >
              <span className="relative z-10">
                {loading ? (
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  </div>
                ) : (
                  'Sign in'
                )}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </button>

            <div className="relative mt-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-cyan-500/20" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-transparent text-cyan-200/70">Or continue with demo</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={loading}
              className="w-full bg-black/20 border border-cyan-500/20 text-cyan-100 py-3.5 px-4 rounded-xl font-medium hover:bg-cyan-500/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-400/50 disabled:opacity-50 transition-all duration-300 transform hover:scale-[1.02] backdrop-blur-sm hover:border-cyan-400/40 group"
            >
              <span className="relative z-10">Try Demo Account</span>
              <div className="absolute inset-0 bg-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"></div>
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}