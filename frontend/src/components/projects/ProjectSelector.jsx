import { useState } from 'react'
import { ChevronDownIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'

export const ProjectSelector = ({ projects, selectedProject, onProjectSelect, loading = false }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleProjectSelect = (project) => {
    onProjectSelect(project)
    setIsOpen(false)
    setSearchTerm('')
  }

  return (
    <div className="relative">
      {/* Selected Project Display */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={loading}
        className={`w-full flex items-center justify-between px-4 py-3 bg-gray-700 border-2 rounded-lg text-left transition-colors ${
          selectedProject 
            ? 'border-blue-500 text-white' 
            : 'border-gray-600 text-gray-400 hover:border-gray-500'
        } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <div className="flex-1">
          {selectedProject ? (
            <div>
              <div className="font-medium text-white">{selectedProject.name}</div>
              {selectedProject.description && (
                <div className="text-sm text-gray-400 truncate">
                  {selectedProject.description}
                </div>
              )}
            </div>
          ) : (
            <span>Select a project...</span>
          )}
        </div>
        <ChevronDownIcon 
          className={`h-5 w-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-10 w-full mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-lg max-h-80 overflow-hidden">
          {/* Search Input */}
          <div className="p-3 border-b border-gray-700">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
            </div>
          </div>

          {/* Projects List */}
          <div className="max-h-60 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-400">
                Loading projects...
              </div>
            ) : filteredProjects.length === 0 ? (
              <div className="p-4 text-center text-gray-400">
                {searchTerm ? 'No projects found' : 'No projects available'}
              </div>
            ) : (
              filteredProjects.map((project) => (
                <button
                  key={project.id}
                  onClick={() => handleProjectSelect(project)}
                  className={`w-full px-4 py-3 text-left hover:bg-gray-700 transition-colors ${
                    selectedProject?.id === project.id ? 'bg-blue-500/10 text-blue-400' : 'text-white'
                  }`}
                >
                  <div className="font-medium">{project.name}</div>
                  {project.description && (
                    <div className="text-sm text-gray-400 truncate">
                      {project.description}
                    </div>
                  )}
                  <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                    <span>{project.documents_count || 0} documents</span>
                    <span>{project.test_suite_count || 0} test suites</span>
                  </div>
                </button>
              ))
            )}
          </div>

          {/* Create New Project Option */}
          <div className="p-3 border-t border-gray-700">
            <button
              onClick={() => {
                setIsOpen(false)
                // You can add logic to create a new project here
                console.log('Create new project clicked')
              }}
              className="w-full px-4 py-2 text-blue-400 hover:bg-blue-500/10 rounded-md transition-colors text-sm font-medium"
            >
              + Create New Project
            </button>
          </div>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}