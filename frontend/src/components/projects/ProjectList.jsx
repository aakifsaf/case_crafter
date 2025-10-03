import { useEffect, useState } from 'react'
import { useProjectStore } from '../../stores/useProjectStore'
import { useAuthStore } from '../../stores/useAuthStore'
import { PlusIcon } from '@heroicons/react/24/outline'
import { ProjectCard } from './ProjectCard'
import { DocumentTextIcon } from '@heroicons/react/24/outline'

export const ProjectList = () => {
  const { projects, fetchProjects, createProject, loading } = useProjectStore()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newProjectName, setNewProjectName] = useState('')
  const [newProjectDescription, setNewProjectDescription] = useState('')

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  const handleCreateProject = async (e) => {
    e.preventDefault()
    if (!newProjectName.trim()) return

    try {
      await createProject({ name: newProjectName, description: newProjectDescription })
      setNewProjectName('')
      setNewProjectDescription('')
      fetchProjects()
      setShowCreateModal(false)

    } catch (error) {
      console.error('Failed to create project:', error)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          Projects
        </h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="group relative inline-flex items-center px-6 py-3 text-sm font-medium rounded-lg transition-all duration-300 bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          <PlusIcon className="h-5 w-5 mr-2 transition-transform duration-300 group-hover:rotate-90" />
          New Project
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 bg-gradient-to-br from-gray-600 to-gray-900 rounded-2xl p-1">
              <div className="w-full h-full bg-gray-900 rounded-2xl animate-pulse"></div>
            </div>
          ))}
        </div>
      ) : projects.length === 0 ? (
        // Empty state when no projects exist
        <div className="flex flex-col items-center justify-center py-4 px-4 text-center">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl border border-gray-700/50 p-12 max-w-2xl w-full">
            <div className="mx-auto w-24 h-24 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full flex items-center justify-center mb-6">
              <DocumentTextIcon className="h-12 w-12 text-gray-400" />
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-4">
              No Projects Yet
            </h2>
            
            <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto">
              Create your first project to start generating test cases from your business requirements documents.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setShowCreateModal(true)}
                className="group inline-flex items-center px-8 py-4 text-base font-medium rounded-lg transition-all duration-300 bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <PlusIcon className="h-6 w-6 mr-3 transition-transform duration-300 group-hover:rotate-90" />
                Create Your First Project
              </button>
              
              <button className="inline-flex items-center px-8 py-4 text-base font-medium rounded-lg border border-gray-600 text-gray-300 hover:text-white hover:border-gray-500 transition-all duration-300">
                View Documentation
              </button>
            </div>
            
            {/* Features list */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-blue-400 text-sm font-bold">1</span>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Create Project</h4>
                  <p className="text-gray-400 text-sm">Organize your test cases by project</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-purple-400 text-sm font-bold">2</span>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Upload BRD</h4>
                  <p className="text-gray-400 text-sm">Upload your business requirements document</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-pink-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-pink-400 text-sm font-bold">3</span>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Generate Tests</h4>
                  <p className="text-gray-400 text-sm">AI-powered test case generation</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div key={project.id} className="opacity-100">
              <ProjectCard project={project} />
            </div>
          ))}
        </div>
      )}

      {/* Create Project Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-8 w-full max-w-md">
            <div className="bg-gradient-to-b from-gray-900 to-gray-800 rounded-3xl border border-gray-700/50 shadow-2xl overflow-hidden">
              <div className="p-1 bg-gradient-to-r from-blue-500 to-purple-600">
                <div className="bg-gray-900 p-6 rounded-t-2xl">
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-6">
                    Create New Project
                  </h3>
                  <form onSubmit={handleCreateProject}>
                    <div className="flex flex-col space-y-4">
                    <input
                      type="text"
                      value={newProjectName}
                      onChange={(e) => setNewProjectName(e.target.value)}
                      placeholder="Enter project name"
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300"
                      autoFocus
                    />
                    <input
                      type="text"
                      value={newProjectDescription}
                      onChange={(e) => setNewProjectDescription(e.target.value)}
                      placeholder="Enter project description"
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300"
                      autoFocus
                    />
                    </div>
                    <div className="flex justify-end space-x-4 mt-8">
                      <button
                        type="button"
                        onClick={() => setShowCreateModal(false)}
                        className="px-6 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors duration-300"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
                      >
                        Create
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}