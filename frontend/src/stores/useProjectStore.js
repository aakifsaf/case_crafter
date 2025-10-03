import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { projectService, documentService, testService } from '../services/apiService'

export const useProjectStore = create(
  devtools((set, get) => ({
    // State
    projects: [],
    currentProject: null,
    documents: [],
    requirements: [],
    testSuites: [],
    traceabilityMatrix: null,
    loading: false,
    error: null,

    // Actions
    setLoading: (loading) => set({ loading, error: loading ? null : get().error }),
    setError: (error) => set({ error }),
    clearError: () => set({ error: null }),

    // Project actions
    fetchProjects: async () => {
      set({ loading: true })
      try {
        const response = await projectService.getProjects()
        // Assuming the backend returns the list directly or in a data property
        const projects = response.data || response
        set({ projects, loading: false })
      } catch (error) {
        set({ error: error.message, loading: false })
      }
    },

    setCurrentProject: (project) => {
      set({ currentProject: project })
    },

    createProject: async (projectData) => {
      set({ loading: true })
      try {
        const newProject = await projectService.createProject(projectData)
        set(state => ({
          projects: [...state.projects, newProject],
          currentProject: newProject,
          loading: false
        }))
        return newProject
      } catch (error) {
        set({ error: error.message, loading: false })
        throw error
      }
    },

    // Document actions
    uploadDocument: async (file, projectId) => {
      set({ loading: true })
      try {
        const document = await documentService.uploadDocument(file, projectId)
        set(state => ({
          documents: [...state.documents, document],
          loading: false
        }))
        return document
      } catch (error) {
        set({ error: error.message, loading: false })
        throw error
      }
    },

    fetchDocuments: async (projectId) => {
      set({ loading: true })
      try {
        const response = await documentService.getDocuments(projectId)
        // Handle the response structure
        const documents = response.data || response
        console.log('Fetched documents:', documents)
        set({ documents, loading: false })
      } catch (error) {
        set({ error: error.message, loading: false })
      }
    },

    // Test generation actions
    generateTestCases: async (documentId) => {
      set({ loading: true })
      try {
        const response = await testService.generateTestCases(documentId)
        // Handle the response structure
        console.log('Generated test cases response:', response.data)
        const testSuite = response.data || response
        set(state => ({
          testSuites: [...state.testSuites, testSuite],
          loading: false
        }))
        return testSuite
      } catch (error) {
        set({ error: error.message, loading: false })
        throw error
      }
    },

    fetchTestSuite: async (projectId) => {
      set({ loading: true })
      try {
        const response = await testService.getTestSuite(projectId)
        console.log('Fetched test suite response:', response.data)
        // Handle the response structure
        const testSuites = response.data.test_suites || response
        set({ testSuites, loading: false })
        return testSuites
      } catch (error) {
        set({ error: error.message, loading: false })
        throw error
      }
    },

    fetchTraceabilityMatrix: async (projectId) => {
      set({ loading: true })
      try {
        const response = await testService.getTraceabilityMatrix(projectId)
        // Handle the response structure
        const matrix = response.data || response
        set({ traceabilityMatrix: matrix, loading: false })
        return matrix
      } catch (error) {
        set({ error: error.message, loading: false })
        throw error
      }
    },

    // Export actions
exportTestSuite: async (testSuiteId, format, filename = null) => {
  set({ loading: true })
  try {
    const response = await testService.exportTestSuite(testSuiteId, format)
    
    // Create blob URL and trigger download
    const blob = new Blob([response.data])
    const url = window.URL.createObjectURL(blob)
    
    // Create a temporary anchor element to trigger download
    const link = document.createElement('a')
    link.href = url
    
    // Get filename from response headers or use default
    const contentDisposition = response.headers['content-disposition']
    let downloadFilename = filename
    
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="?(.+)"?/i)
      if (filenameMatch && filenameMatch[1]) {
        downloadFilename = filenameMatch[1]
      }
    }
    
    // Set default filename if not provided
    if (!downloadFilename) {
      downloadFilename = `test-suite-${testSuiteId}.${format}`
    }
    
    link.setAttribute('download', downloadFilename)
    document.body.appendChild(link)
    link.click()
    
    // Clean up
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
    
    set({ loading: false })
    return { success: true, filename: downloadFilename }
  } catch (error) {
    set({ 
      error: error.response?.data?.message || error.message || 'Export failed',
      loading: false 
    })
    throw error
  }
}
  }))
)
