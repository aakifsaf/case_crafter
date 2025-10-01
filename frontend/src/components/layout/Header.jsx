// src/components/layout/Header.jsx
import { useState } from 'react'
import { BellIcon, MagnifyingGlassIcon, Bars3Icon } from '@heroicons/react/24/outline'
import { useProjectStore } from '../../stores/useProjectStore'

export const Header = ({ onMenuClick }) => {
  const [showNotifications, setShowNotifications] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const { currentProject } = useProjectStore()

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left section */}
          <div className="flex items-center">
            <button
              type="button"
              className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              onClick={onMenuClick}
            >
              <span className="sr-only">Open sidebar</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
            
            <div className="hidden md:ml-6 md:flex md:items-center md:space-x-4">
              <h1 className="text-xl font-semibold text-gray-900">
                CaseCrafter AI
              </h1>
              {currentProject && (
                <div className="flex items-center text-gray-500">
                  <span className="mx-2">/</span>
                  <span className="text-sm">{currentProject.name}</span>
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
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Search projects, documents..."
                  type="search"
                />
              </div>
            </div>
          </div>

          {/* Right section */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button
              className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <span className="sr-only">View notifications</span>
              <BellIcon className="h-6 w-6" aria-hidden="true" />
            </button>

            {/* User menu */}
            <div className="relative ml-3">
              <div>
                <button
                  className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  <span className="sr-only">Open user menu</span>
                  <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                    <span className="text-white text-sm font-medium">U</span>
                  </div>
                </button>
              </div>

              {/* User dropdown menu */}
              {showUserMenu && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <a
                    href="#profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Your Profile
                  </a>
                  <a
                    href="#settings"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Settings
                  </a>
                  <a
                    href="#logout"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
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
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Notifications</h3>
          </div>
          <div className="max-h-96 overflow-y-auto">
            <div className="p-4 border-b border-gray-100">
              <p className="text-sm text-gray-600">No new notifications</p>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}