import { apiClient } from '../lib/api'

export const authService = {
  login: (email, password) => 
    apiClient.post('/auth/login', { email, password }),

  register: (userData) => 
    apiClient.post('/auth/register', userData),

  getCurrentUser: () => 
    apiClient.get('/auth/me'),
}

export const projectService = {
  // Existing methods...
  getProjects: () => apiClient.get('/projects'),
  createProject: (data) => apiClient.post('/projects', data),
  getProject: (id) => apiClient.get(`/projects/${id}`),
  updateProject: (id, data) => apiClient.put(`/projects/${id}`, data),
  deleteProject: (id) => apiClient.delete(`/projects/${id}`),

  // New methods for enhanced functionality
  getProjectStats: (id) => 
    apiClient.get(`/projects/${id}/stats`),

  // Quick project creation with document
  createProjectWithDocument: (projectData, file) => {
    const formData = new FormData()
    formData.append('project_data', JSON.stringify(projectData))
    formData.append('file', file)

    return apiClient.post('/projects/quick-create', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },

  // Get project templates
  getProjectTemplates: () => 
    apiClient.get('/projects/templates'),

  // Create project from template
  createFromTemplate: (templateId, projectData) => 
    apiClient.post(`/projects/templates/${templateId}`, projectData),

  // Archive project
  archiveProject: (id) => 
    apiClient.post(`/projects/${id}/archive`),

  // Restore project
  restoreProject: (id) => 
    apiClient.post(`/projects/${id}/restore`),

  // Get archived projects
  getArchivedProjects: () => 
    apiClient.get('/projects/archived'),

  // Project sharing
  shareProject: (id, shareData) => 
    apiClient.post(`/projects/${id}/share`, shareData),

  // Get project collaborators
  getCollaborators: (id) => 
    apiClient.get(`/projects/${id}/collaborators`),

  // Remove collaborator
  removeCollaborator: (projectId, userId) => 
    apiClient.delete(`/projects/${projectId}/collaborators/${userId}`)
}

export const documentService = {
  uploadDocument: (file, projectId) => {
    const formData = new FormData()
    formData.append('file', file)
    return apiClient.post(`/projects/${projectId}/documents`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  getDocuments: (projectId) => apiClient.get(`/projects/${projectId}/documents`),
  getDocument: (id) => apiClient.get(`/documents/${id}`),
  getDocumentStatus: (id) => apiClient.get(`/documents/${id}/status`),
  getRequirements: (documentId) => apiClient.get(`/documents/${documentId}/requirements`),
  deleteDocument: (id) => apiClient.delete(`/documents/${id}`),
}

export const testService = {
  generateTestCases: (documentId) => 
    apiClient.post(`/documents/${documentId}/generate-tests`),
  getTestSuite: (projectId) => 
    apiClient.get(`/projects/${projectId}/test-suite`),
  getTraceabilityMatrix: (projectId) => 
    apiClient.get(`/projects/${projectId}/traceability-matrix`),
  semanticSearch: async (projectId, query) => 
    apiClient.get(`/projects/${projectId}/semantic-search`, { params: { q: query } }),
  getImpactAnalysis: async (projectId, requirementId) => 
    apiClient.get(`/projects/${projectId}/impact-analysis/${requirementId}`),
  exportTestSuite: (testSuiteId, format) => 
    apiClient.get(`/test-suites/${testSuiteId}/export`, {
      params: { format },
      responseType: 'blob'
    }),
  // Note: The backend doesn't seem to have a test case update endpoint
  // updateTestCase: (testCaseId, data) => 
  //   apiClient.put(`/test-cases/${testCaseId}`, data),
}

export const templateService = {
  // Get all templates
  getTemplates: () => apiClient.get('/templates'),

  // Get template by ID
  getTemplate: (id) => apiClient.get(`/templates/${id}`),

  // Create new template
  createTemplate: (templateData) => 
    apiClient.post('/templates', templateData),

  // Update template
  updateTemplate: (id, templateData) => 
    apiClient.put(`/templates/${id}`, templateData),

  // Delete template
  deleteTemplate: (id) => 
    apiClient.delete(`/templates/${id}`),

  // Apply template to project
  applyTemplate: (templateId, projectId) => 
    apiClient.post(`/templates/${templateId}/apply`, { project_id: projectId }),

  // Get template categories
  getCategories: () => 
    apiClient.get('/templates/categories'),

  // Duplicate template
  duplicateTemplate: (id) => 
    apiClient.post(`/templates/${id}/duplicate`),

  // Search templates
  searchTemplates: (query, category = null) => {
    const params = { q: query }
    if (category) params.category = category
    return apiClient.get('/templates/search', { params })
  }
}

export const analyticsService = {
  // Get overall analytics
  getAnalytics: (timeRange = '30d') => 
    apiClient.get('/analytics', { params: { period: timeRange } }),

  // Get project-specific analytics
  getProjectAnalytics: (projectId, timeRange = '30d') => 
    apiClient.get(`/analytics/projects/${projectId}`, { 
      params: { period: timeRange } 
    }),

  // Get document analytics
  getDocumentAnalytics: (timeRange = '30d') => 
    apiClient.get('/analytics/documents', { 
      params: { period: timeRange } 
    }),

  // Get test suite analytics
  getTestSuiteAnalytics: (timeRange = '30d') => 
    apiClient.get('/analytics/test-suites', { 
      params: { period: timeRange } 
    }),

  // Get user activity
  getUserActivity: (timeRange = '30d') => 
    apiClient.get('/analytics/activity', { 
      params: { period: timeRange } 
    }),

  // Get export statistics
  getExportStats: (timeRange = '30d') => 
    apiClient.get('/analytics/exports', { 
      params: { period: timeRange } 
    }),

  // Get performance metrics
  getPerformanceMetrics: () => 
    apiClient.get('/analytics/performance'),

  // Get trending data
  getTrendingData: (metric, timeRange = '30d') => 
    apiClient.get(`/analytics/trending/${metric}`, { 
      params: { period: timeRange } 
    })
}

export const uploadService = {
  // Quick upload to new project
  quickUpload: (file, projectName, description = null) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('project_name', projectName)
    if (description) formData.append('description', description)

    return apiClient.post('/upload/quick', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 120000, // 2 minutes for large files
      onUploadProgress: (progressEvent) => {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        console.log(`Upload progress: ${progress}%`)
      }
    })
  },

  // Bulk upload multiple files
  bulkUpload: (files, projectId) => {
    const formData = new FormData()
    files.forEach(file => {
      formData.append('files', file)
    })
    formData.append('project_id', projectId)

    return apiClient.post('/upload/bulk', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 300000, // 5 minutes for bulk upload
    })
  },

  // Get upload status
  getUploadStatus: (uploadId) => 
    apiClient.get(`/upload/status/${uploadId}`),

  // Cancel upload
  cancelUpload: (uploadId) => 
    apiClient.delete(`/upload/${uploadId}`),

  // Get recent uploads
  getRecentUploads: (limit = 10) => 
    apiClient.get('/upload/recent', { params: { limit } }),

  // Validate file before upload
  validateFile: (file) => {
    const formData = new FormData()
    formData.append('file', file)

    return apiClient.post('/upload/validate', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  }
}

export const settingsService = {
  // Update user profile
  updateProfile: (profileData) => 
    apiClient.put('/settings/profile', profileData),

  // Change password
  changePassword: (passwordData) => 
    apiClient.put('/settings/password', passwordData),

  // Update notification preferences
  updateNotifications: (notificationSettings) => 
    apiClient.put('/settings/notifications', notificationSettings),

  // Get user preferences
  getPreferences: () => 
    apiClient.get('/settings/preferences'),

  // Update user preferences
  updatePreferences: (preferences) => 
    apiClient.put('/settings/preferences', preferences),

  // Get account usage
  getUsage: () => 
    apiClient.get('/settings/usage'),

  // Export user data
  exportData: () => 
    apiClient.get('/settings/export-data', { responseType: 'blob' }),

  // Delete account
  deleteAccount: (confirmation) => 
    apiClient.delete('/settings/account', { data: { confirmation } }),

  // Get API keys
  getApiKeys: () => 
    apiClient.get('/settings/api-keys'),

  // Generate new API key
  generateApiKey: (name) => 
    apiClient.post('/settings/api-keys', { name }),

  // Revoke API key
  revokeApiKey: (keyId) => 
    apiClient.delete(`/settings/api-keys/${keyId}`)
}