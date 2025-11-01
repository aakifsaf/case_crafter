// stores/useProjectStore.js
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

    // Cache state
    cache: {
      projects: null,
      documents: {},
      testSuites: {},
      traceabilityMatrix: {},
      lastFetched: {}
    },
    cacheTimeout: 5 * 60 * 1000, // 5 minutes

    // Actions
    setLoading: (loading) => set({ loading, error: loading ? null : get().error }),
    setError: (error) => set({ error }),
    clearError: () => set({ error: null }),

    // Cache management
    getCacheKey: (type, id) => `${type}-${id}`,
    
    isCacheValid: (cacheKey) => {
      const state = get()
      const cachedData = state.cache[cacheKey.type]?.[cacheKey.key]
      const lastFetched = state.cache.lastFetched[cacheKey.key]
      const now = Date.now()
      
      return cachedData && lastFetched && (now - lastFetched < state.cacheTimeout)
    },

    setCache: (type, key, data) => {
      set(state => ({
        cache: {
          ...state.cache,
          [type]: {
            ...state.cache[type],
            [key]: data
          },
          lastFetched: {
            ...state.cache.lastFetched,
            [key]: Date.now()
          }
        }
      }))
    },

    clearCache: (type = null, key = null) => {
      set(state => {
        if (type && key) {
          // Clear specific cache entry
          const newCache = { ...state.cache }
          if (newCache[type]) {
            delete newCache[type][key]
          }
          delete newCache.lastFetched[key]
          return { cache: newCache }
        } else if (type) {
          // Clear all cache of specific type
          const newCache = { ...state.cache }
          newCache[type] = {}
          // Clear related lastFetched entries
          Object.keys(newCache.lastFetched).forEach(cacheKey => {
            if (cacheKey.startsWith(`${type}-`)) {
              delete newCache.lastFetched[cacheKey]
            }
          })
          return { cache: newCache }
        } else {
          // Clear all cache
          return { 
            cache: {
              projects: null,
              documents: {},
              testSuites: {},
              traceabilityMatrix: {},
              lastFetched: {}
            }
          }
        }
      })
    },

    // Refresh functionality
    refreshProjectData: async (projectId) => {
      if (!projectId) return
      
      const state = get()
      state.setLoading(true)
      
      try {
        // Clear cache for this project
        state.clearCache('documents', state.getCacheKey('documents', projectId))
        state.clearCache('testSuites', state.getCacheKey('testSuites', projectId))
        state.clearCache('traceabilityMatrix', state.getCacheKey('traceabilityMatrix', projectId))

        // Fetch fresh data
        await Promise.all([
          state.fetchDocuments(projectId, true),
          state.fetchTestSuite(projectId, true),
          state.fetchTraceabilityMatrix(projectId, true)
        ])
        
        state.setLoading(false)
        return true
      } catch (error) {
        state.setError(error.message)
        state.setLoading(false)
        throw error
      }
    },

    // Project actions with caching
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
      const state = get()
      state.setLoading(true)
      
      try {
        const newProject = await projectService.createProject(projectData)
        
        // Clear projects cache since we added a new project
        state.clearCache('projects')
        
        set(state => ({
          projects: [...state.projects, newProject],
          currentProject: newProject,
          loading: false
        }))
        
        return newProject
      } catch (error) {
        state.setError(error.message)
        state.setLoading(false)
        throw error
      }
    },

    // Document actions with caching
    uploadDocument: async (file, projectId) => {
      const state = get()
      state.setLoading(true)
      
      try {
        const document = await documentService.uploadDocument(file, projectId)
        
        // Clear documents cache for this project since we added a new document
        state.clearCache('documents', state.getCacheKey('documents', projectId))
        
        set(state => ({
          documents: [...state.documents, document],
          loading: false
        }))
        
        return document
      } catch (error) {
        state.setError(error.message)
        state.setLoading(false)
        throw error
      }
    },

    fetchDocuments: async (projectId, forceRefresh = false) => {
      const state = get()
      const cacheKey = state.getCacheKey('documents', projectId)
      
      // Return cached data if valid and not forcing refresh
      if (!forceRefresh && state.isCacheValid({ type: 'documents', key: cacheKey })) {
        set({ documents: state.cache.documents[cacheKey] })
        return state.cache.documents[cacheKey]
      }
      
      state.setLoading(true)
      try {
        const response = await documentService.getDocuments(projectId)
        const documents = response.data || response
        
        // Update cache and state
        state.setCache('documents', cacheKey, documents)
        set({ documents, loading: false })
        
        return documents
      } catch (error) {
        state.setError(error.message)
        state.setLoading(false)
        throw error
      }
    },

    // Test generation actions with caching
    generateTestCases: async (documentId) => {
      const state = get()
      state.setLoading(true)
      
      try {
        const response = await testService.generateTestCases(documentId)
        const testSuite = response.data || response
        
        // Find the document to get project ID
        const document = state.documents.find(doc => doc.id === documentId)
        if (document) {
          state.clearCache('testSuites', state.getCacheKey('testSuites', document.project_id))
          state.clearCache('traceabilityMatrix', state.getCacheKey('traceabilityMatrix', document.project_id))
        }
        
        set(state => ({
          testSuites: [...state.testSuites, testSuite],
          loading: false
        }))
        
        return testSuite
      } catch (error) {
        state.setError(error.message)
        state.setLoading(false)
        throw error
      }
    },

    fetchTestSuite: async (projectId, forceRefresh = false) => {
      const state = get()
      const cacheKey = state.getCacheKey('testSuites', projectId)
      
      // Return cached data if valid and not forcing refresh
      if (!forceRefresh && state.isCacheValid({ type: 'testSuites', key: cacheKey })) {
        set({ testSuites: state.cache.testSuites[cacheKey] })
        return state.cache.testSuites[cacheKey]
      }
      
      state.setLoading(true)
      try {
        const response = await testService.getTestSuite(projectId)
        const testSuites = response.data?.test_suites || response.data || response
        
        // Update cache and state
        state.setCache('testSuites', cacheKey, testSuites)
        set({ testSuites, loading: false })
        
        return testSuites
      } catch (error) {
        state.setError(error.message)
        state.setLoading(false)
        throw error
      }
    },

    fetchTraceabilityMatrix: async (projectId, forceRefresh = false) => {
      const state = get()
      const cacheKey = state.getCacheKey('traceabilityMatrix', projectId)
      
      // Return cached data if valid and not forcing refresh
      if (!forceRefresh && state.isCacheValid({ type: 'traceabilityMatrix', key: cacheKey })) {
        set({ traceabilityMatrix: state.cache.traceabilityMatrix[cacheKey] })
        return state.cache.traceabilityMatrix[cacheKey]
      }
      
      state.setLoading(true)
      try {
        const response = await testService.getTraceabilityMatrix(projectId)
        const matrix = response.data || response
        
        // Update cache and state
        state.setCache('traceabilityMatrix', cacheKey, matrix)
        set({ traceabilityMatrix: matrix, loading: false })
        
        return matrix
      } catch (error) {
        state.setError(error.message)
        state.setLoading(false)
        throw error
      }
    },

    // Export actions
    exportTestSuite: async (testSuiteId, format, filename = null) => {
      const state = get()
      state.setLoading(true)
      
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
          const extension = format === "excel" ? "xlsx" : format;
          downloadFilename = `test-suite-${testSuiteId}.${extension}`;
        }
        
        link.setAttribute('download', downloadFilename)
        document.body.appendChild(link)
        link.click()
        
        // Clean up
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
        
        state.setLoading(false)
        return { success: true, filename: downloadFilename }
      } catch (error) {
        state.setError(error.response?.data?.message || error.message || 'Export failed')
        state.setLoading(false)
        throw error
      }
    },

    // Utility function to get cache status
    getCacheStatus: (projectId) => {
      const state = get()
      const now = Date.now()
      
      const documentsCacheKey = state.getCacheKey('documents', projectId)
      const testSuitesCacheKey = state.getCacheKey('testSuites', projectId)
      const traceabilityCacheKey = state.getCacheKey('traceabilityMatrix', projectId)
      
      return {
        documents: {
          cached: !!state.cache.documents[documentsCacheKey],
          age: state.cache.lastFetched[documentsCacheKey] 
            ? now - state.cache.lastFetched[documentsCacheKey] 
            : null
        },
        testSuites: {
          cached: !!state.cache.testSuites[testSuitesCacheKey],
          age: state.cache.lastFetched[testSuitesCacheKey] 
            ? now - state.cache.lastFetched[testSuitesCacheKey] 
            : null
        },
        traceabilityMatrix: {
          cached: !!state.cache.traceabilityMatrix[traceabilityCacheKey],
          age: state.cache.lastFetched[traceabilityCacheKey] 
            ? now - state.cache.lastFetched[traceabilityCacheKey] 
            : null
        }
      }
    }
  }))
)