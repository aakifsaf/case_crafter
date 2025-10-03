import { apiClient } from '../lib/api'

export const authService = {
  login: (email, password) => 
    apiClient.post('/auth/login', { email, password }),

  register: (userData) => 
    apiClient.post('/auth/register', userData)
}

export const projectService = {
  getProjects: () => apiClient.get('/projects'),
  createProject: (data) => apiClient.post('/projects', data),
  getProject: (id) => apiClient.get(`/projects/${id}`),
  updateProject: (id, data) => apiClient.put(`/projects/${id}`, data),
  deleteProject: (id) => apiClient.delete(`/projects/${id}`),
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
  exportTestSuite: (testSuiteId, format) => 
    apiClient.get(`/test-suites/${testSuiteId}/export`, {
      params: { format },
      responseType: 'blob'
    }),
  updateTestCase: (testCaseId, data) => 
    apiClient.put(`/test-cases/${testCaseId}`, data),
}