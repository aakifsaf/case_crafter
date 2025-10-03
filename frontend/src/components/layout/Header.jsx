// src/components/layout/Header.jsx
import { useState } from 'react'
import { BellIcon, MagnifyingGlassIcon, Bars3Icon } from '@heroicons/react/24/outline'
import { useProjectStore } from '../../stores/useProjectStore'
import { useAuthStore } from '../../stores/useAuthStore'

export const Header = ({ onMenuClick }) => {
  const [showNotifications, setShowNotifications] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const { currentProject } = useProjectStore()
  const { user, logout } = useAuthStore()

  return (
    <header className="bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-700/50 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Left section */}
          <div className="flex items-center">
            <button
              type="button"
              className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300"
              onClick={onMenuClick}
            >
              <span className="sr-only">Open sidebar</span>
              <Bars3Icon className="h-7 w-7" aria-hidden="true" />
            </button>
            
            <div className="hidden md:ml-6 md:flex md:items-center md:space-x-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                CaseCrafter AI
              </h1>
              {currentProject && (
                <div className="flex items-center text-gray-300">
                  <span className="mx-2 text-blue-400">/</span>
                  <span className="text-sm bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
                    {currentProject.name}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Search section */}
          <div className="flex-1 flex justify-center px-2 lg:ml-6 lg:justify-end">
            <div className="max-w-lg w-full lg:max-w-xs">
              <label htmlFor="search" className="sr-only">
                Search
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="search"
                  name="search"
                  className="block w-full pl-10 pr-3 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300"
                  placeholder="Search projects, documents..."
                  type="search"
                />
              </div>
            </div>
          </div>

          {/* Right section */}
          <div className="flex items-center space-x-6">
            {/* Notifications */}
            <button
              className="p-2 rounded-xl bg-gray-800 border border-gray-700 text-gray-400 hover:text-white hover:bg-gray-700/50 hover:border-blue-400/30 transition-all duration-300 transform hover:scale-110"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <span className="sr-only">View notifications</span>
              <BellIcon className="h-6 w-6" aria-hidden="true" />
            </button>

            {/* User menu */}
            <div className="relative">
              <button
                className="flex text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-transform duration-300 hover:scale-110"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <span className="sr-only">Open user menu</span>
                <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                  <span className="text-white text-sm font-bold">U</span>
                </div>
              </button>

              {/* User dropdown menu */}
              {showUserMenu && (
                <div className="origin-top-right absolute right-0 mt-3 w-56 rounded-2xl bg-gray-800 border border-gray-700/50 shadow-2xl py-2 backdrop-blur-sm z-50">
                  <a
                    href="#profile"
                    className="block px-6 py-3 text-sm text-gray-300 hover:text-white hover:bg-gray-700/50 transition-all duration-300"
                  >
                    Your Profile
                  </a>
                  <a
                    href="#settings"
                    className="block px-6 py-3 text-sm text-gray-300 hover:text-white hover:bg-gray-700/50 transition-all duration-300"
                  >
                    Settings
                  </a>
                  <a
                    href="/login"
                    className="block px-6 py-3 text-sm text-gray-300 hover:text-white hover:bg-gray-700/50 transition-all duration-300"
                    onClick={logout}
                  >
                    Sign out
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Notifications panel */}
      {showNotifications && (
        <div className="absolute right-4 mt-3 w-80 bg-gray-800 rounded-2xl border border-gray-700/50 shadow-2xl z-50 backdrop-blur-sm">
          <div className="p-6 border-b border-gray-700">
            <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Notifications
            </h3>
          </div>
          <div className="max-h-96 overflow-y-auto">
            <div className="p-6 border-b border-gray-700/50">
              <p className="text-sm text-gray-400">No new notifications</p>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
