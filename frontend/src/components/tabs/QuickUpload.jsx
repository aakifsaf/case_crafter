import { useState } from 'react'
import { useProjectStore } from '../../stores/useProjectStore'
import { QuickDocumentUpload } from '../documents/QuickDocumentUpload'
import { useEffect } from 'react'
import { ProjectSelector } from '../projects/ProjectSelector'

export const QuickUpload = () => {
  const { projects, fetchProjects, createProject, loading } = useProjectStore()
  const [selectedProject, setSelectedProject] = useState(null)
  const [uploadMode, setUploadMode] = useState('existing')
  const [newProjectData, setNewProjectData] = useState({
    name: '',
    description: ''
  })
  const [createdProject, setCreatedProject] = useState(null)
  const [uploadReady, setUploadReady] = useState(false)

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  const handleCreateProject = async () => {
    if (!newProjectData.name.trim()) {
      alert('Please enter a project name')
      return
    }

    try {
      const project = await createProject(newProjectData)
      setCreatedProject(project)
      setSelectedProject(project)
      setUploadReady(true) // Mark upload as ready
      
      // Reset form (but keep the created project)
      setNewProjectData({
        name: '',
        description: ''
      })
    } catch (error) {
      console.error('Failed to create project:', error)
      alert('Failed to create project. Please try again.')
    }
  }

  const handleUploadModeChange = (mode) => {
    setUploadMode(mode)
    setSelectedProject(null)
    setCreatedProject(null)
    setUploadReady(false) // Reset upload ready state
  }

  // Determine which project ID to use
  const projectId = selectedProject?.id || createdProject?.id

  // Show upload section if:
  // - In existing mode AND project is selected OR
  // - In new mode AND project is created (uploadReady is true)
  const showUploadSection = 
    (uploadMode === 'existing' && selectedProject) ||
    (uploadMode === 'new' && uploadReady)

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white">Upload BRD Document</h1>
        <p className="text-gray-400 mt-2">Quickly upload and analyze your Business Requirements Document</p>
      </div>

      {/* Project Selection - Always show this section */}
      <div className="bg-gray-800 rounded-2xl p-6 mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">
          {showUploadSection ? 'Project Selected' : 'Select Project'}
        </h2>
        
        {!showUploadSection ? (
          <>
            <div className="flex gap-4 mb-6">
              <button
                onClick={() => handleUploadModeChange('existing')}
                className={`flex-1 py-3 px-4 rounded-lg border-2 transition-colors ${
                  uploadMode === 'existing' 
                    ? 'border-blue-500 bg-blue-500/10 text-white' 
                    : 'border-gray-600 text-gray-400 hover:border-gray-500'
                }`}
              >
                Existing Project
              </button>
              <button
                onClick={() => handleUploadModeChange('new')}
                className={`flex-1 py-3 px-4 rounded-lg border-2 transition-colors ${
                  uploadMode === 'new' 
                    ? 'border-blue-500 bg-blue-500/10 text-white' 
                    : 'border-gray-600 text-gray-400 hover:border-gray-500'
                }`}
              >
                New Project
              </button>
            </div>

            {uploadMode === 'existing' ? (
              <ProjectSelector
                projects={projects}
                selectedProject={selectedProject}
                onProjectSelect={setSelectedProject}
              />
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Project Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter project name"
                    value={newProjectData.name}
                    onChange={(e) => setNewProjectData({
                      ...newProjectData,
                      name: e.target.value
                    })}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    placeholder="Describe your project..."
                    value={newProjectData.description}
                    onChange={(e) => setNewProjectData({
                      ...newProjectData,
                      description: e.target.value
                    })}
                    rows={3}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  onClick={handleCreateProject}
                  disabled={loading || !newProjectData.name.trim()}
                  className="w-full py-3 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white font-medium transition-colors"
                >
                  {loading ? 'Creating Project...' : 'Create Project & Continue'}
                </button>
              </div>
            )}
          </>
        ) : (
          // Show project info when upload is ready
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-semibold text-lg">
                  {selectedProject?.name || createdProject?.name}
                </h3>
                {(selectedProject?.description || createdProject?.description) && (
                  <p className="text-gray-400 text-sm mt-1">
                    {selectedProject?.description || createdProject?.description}
                  </p>
                )}
                <p className="text-green-400 text-sm mt-2">
                  ✓ Ready for document upload
                </p>
              </div>
              <button
                onClick={() => {
                  setUploadReady(false)
                  setSelectedProject(null)
                  setCreatedProject(null)
                }}
                className="px-4 py-2 text-gray-400 hover:text-white border border-gray-600 hover:border-gray-500 rounded-lg transition-colors"
              >
                Change Project
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Document Upload Section */}
      {showUploadSection ? (
        <QuickDocumentUpload 
          projectId={projectId}
          key={projectId} // Force re-render when project changes
        />
      ) : (
        <div className="bg-gray-800 rounded-2xl p-12 text-center border-2 border-dashed border-gray-600">
          {uploadMode === 'existing' ? (
            <p className="text-gray-400 text-lg">Please select a project to upload documents</p>
          ) : (
            <div>
              <p className="text-gray-400 text-lg mb-2">Create a new project to get started</p>
              <p className="text-gray-500 text-sm">Enter a project name and click "Create Project & Continue"</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}