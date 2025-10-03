import { useState, useEffect } from 'react'
import { 
  Cog6ToothIcon, 
  DocumentTextIcon, 
  ArrowPathRoundedSquareIcon,
  ServerStackIcon,
  CheckBadgeIcon 
} from '@heroicons/react/24/outline'

export const ProjectSettings = ({ projectId }) => {
  const [isVisible, setIsVisible] = useState(false)
  const [hoveredItem, setHoveredItem] = useState(null)

  useEffect(() => {
    setIsVisible(true)
    return () => setIsVisible(false)
  }, [])

  return (
    <div className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-95"></div>
      
      {/* Animated grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      
      {/* Glassmorphism container */}
      <div 
        className={`relative backdrop-blur-md bg-white/5 rounded-2xl border border-white/10 shadow-2xl p-8 transition-all duration-1000 ease-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
        style={{
          background: 'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.05)'
        }}
      >
        {/* Header */}
        <div className="flex items-center mb-8">
          <div className="relative">
            <div className="absolute -inset-1 bg-blue-500/20 blur-md rounded-full"></div>
            <Cog6ToothIcon className="relative h-8 w-8 text-blue-400" />
          </div>
          <h2 className="ml-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-2xl font-bold text-transparent">
            Project Settings
          </h2>
        </div>
        
        <div className="space-y-8">
          {/* Project Information Section */}
          <div 
            className="group"
            onMouseEnter={() => setHoveredItem('info')}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <div className="flex items-center mb-6">
              <div className={`p-2 rounded-lg bg-blue-500/10 transition-all duration-300 ${
                hoveredItem === 'info' ? 'scale-110' : ''
              }`}>
                <DocumentTextIcon className="h-5 w-5 text-blue-400" />
              </div>
              <h3 className="ml-3 text-lg font-semibold text-white">Project Information</h3>
            </div>
            
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">Project Name</label>
                <input
                  type="text"
                  className="w-full bg-gray-800/50 border border-gray-600/30 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300 hover:border-gray-500/50"
                  placeholder="Enter project name"
                  defaultValue="My Project"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">Description</label>
                <textarea
                  rows={3}
                  className="w-full bg-gray-800/50 border border-gray-600/30 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300 hover:border-gray-500/50 resize-none"
                  placeholder="Describe your project"
                  defaultValue="Project description"
                />
              </div>
            </div>
          </div>

          {/* Export Settings Section */}
          <div 
            className="group"
            onMouseEnter={() => setHoveredItem('export')}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <div className="flex items-center mb-6">
              <div className={`p-2 rounded-lg bg-purple-500/10 transition-all duration-300 ${
                hoveredItem === 'export' ? 'scale-110' : ''
              }`}>
                <ArrowPathRoundedSquareIcon className="h-5 w-5 text-purple-400" />
              </div>
              <h3 className="ml-3 text-lg font-semibold text-white">Export Settings</h3>
            </div>
            
            <div className="space-y-4">
              {[
                { id: 'steps', label: 'Include test steps in export', icon: CheckBadgeIcon, color: 'green' },
                { id: 'results', label: 'Include expected results', icon: ServerStackIcon, color: 'blue' },
                { id: 'data', label: 'Include test data', icon: DocumentTextIcon, color: 'purple' }
              ].map((item) => (
                <label 
                  key={item.id}
                  className="flex items-center p-3 rounded-xl bg-gray-800/30 border border-gray-600/20 hover:border-gray-500/40 hover:bg-gray-700/30 transition-all duration-300 cursor-pointer group/checkbox"
                >
                  <div className={`relative flex items-center justify-center w-5 h-5 mr-3 rounded border border-${item.color}-400/30 bg-${item.color}-500/10 group-hover/checkbox:bg-${item.color}-500/20 transition-colors duration-300`}>
                    <input 
                      type="checkbox" 
                      className="absolute opacity-0 cursor-pointer"
                      defaultChecked={item.id !== 'data'}
                    />
                    <CheckBadgeIcon className={`w-3 h-3 text-${item.color}-400 opacity-0 group-hover/checkbox:opacity-100 transition-opacity duration-300`} />
                  </div>
                  <span className="text-sm text-gray-200 group-hover/checkbox:text-white transition-colors duration-300">
                    {item.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-6">
            <button className="px-6 py-3 text-sm font-medium text-gray-300 bg-gray-800/50 border border-gray-600/30 rounded-xl hover:bg-gray-700/50 hover:text-white hover:border-gray-500/40 transition-all duration-300 transform hover:-translate-y-0.5">
              Cancel
            </button>
            <button className="px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl hover:from-blue-500 hover:to-purple-500 transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-blue-500/25">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}