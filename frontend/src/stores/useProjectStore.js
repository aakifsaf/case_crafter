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
        const projects_data = await projectService.getProjects()
        const projects = projects_data.data
        set({ projects, loading: false })
      } catch (error) {
        set({ error: error.message, loading: false })
      }
    },

    setCurrentProject: (project) => {
      set({ currentProject: project, loading})
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
        const documents_data = await documentService.getDocuments(projectId)
        const documents = documents_data.data
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
        const testSuite = await testService.generateTestCases(documentId)
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

    fetchTraceabilityMatrix: async (projectId) => {
      set({ loading: true })
      try {
        const matrix_data = await testService.getTraceabilityMatrix(projectId)
        const matrix = matrix_data.data
        set({ traceabilityMatrix: matrix, loading: false })
        return matrix
      } catch (error) {
        set({ error: error.message, loading: false })
        throw error
      }
    },

    // Export actions
    exportTestSuite: async (testSuiteId, format) => {
      set({ loading: true })
      try {
        const result = await testService.exportTestSuite(testSuiteId, format)
        set({ loading: false })
        return result
      } catch (error) {
        set({ error: error.message, loading: false })
        throw error
      }
    }
  }))
)