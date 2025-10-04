// stores/useTemplateStore.js
import { create } from 'zustand'
import { templateService } from '../services/apiService'

export const useTemplateStore = create((set, get) => ({
  templates: [],
  selectedTemplate: null,
  loading: false,
  error: null,
  
  // Fetch all templates
  fetchTemplates: async () => {
    set({ loading: true, error: null })
    try {
      const response = await templateService.getTemplates()
      set({ templates: response.data, loading: false })
    } catch (error) {
      set({ 
        error: error.response?.data?.detail || error.message || 'Failed to fetch templates',
        loading: false 
      })
    }
  },

  // Create new template
  createTemplate: async (templateData) => {
    set({ loading: true, error: null })
    try {
      const response = await templateService.createTemplate(templateData)
      const newTemplate = response.data
      
      set(state => ({
        templates: [...state.templates, newTemplate],
        loading: false
      }))
      
      return newTemplate
    } catch (error) {
      set({ 
        error: error.response?.data?.detail || error.message || 'Failed to create template',
        loading: false 
      })
      throw error
    }
  },

  // Get template by ID
  fetchTemplate: async (templateId) => {
    set({ loading: true, error: null })
    try {
      const response = await templateService.getTemplate(templateId)
      set({ selectedTemplate: response.data, loading: false })
      return response.data
    } catch (error) {
      set({ 
        error: error.response?.data?.detail || error.message || 'Failed to fetch template',
        loading: false 
      })
      throw error
    }
  },

  // Update template
  updateTemplate: async (templateId, templateData) => {
    set({ loading: true, error: null })
    try {
      const response = await templateService.updateTemplate(templateId, templateData)
      const updatedTemplate = response.data
      
      set(state => ({
        templates: state.templates.map(template => 
          template.id === templateId ? updatedTemplate : template
        ),
        selectedTemplate: state.selectedTemplate?.id === templateId ? updatedTemplate : state.selectedTemplate,
        loading: false
      }))
      
      return updatedTemplate
    } catch (error) {
      set({ 
        error: error.response?.data?.detail || error.message || 'Failed to update template',
        loading: false 
      })
      throw error
    }
  },

  // Delete template
  deleteTemplate: async (templateId) => {
    set({ loading: true, error: null })
    try {
      await templateService.deleteTemplate(templateId)
      
      set(state => ({
        templates: state.templates.filter(template => template.id !== templateId),
        selectedTemplate: state.selectedTemplate?.id === templateId ? null : state.selectedTemplate,
        loading: false
      }))
      
      return true
    } catch (error) {
      set({ 
        error: error.response?.data?.detail || error.message || 'Failed to delete template',
        loading: false 
      })
      throw error
    }
  },

  // Apply template to project
  applyTemplate: async (templateId, projectId) => {
    set({ loading: true, error: null })
    try {
      const response = await templateService.applyTemplate(templateId, projectId)
      
      // Update usage count for the applied template
      set(state => ({
        templates: state.templates.map(template => 
          template.id === templateId 
            ? { ...template, usage_count: template.usage_count + 1 }
            : template
        ),
        loading: false
      }))
      
      return response.data
    } catch (error) {
      set({ 
        error: error.response?.data?.detail || error.message || 'Failed to apply template',
        loading: false 
      })
      throw error
    }
  },

  // Search templates
  searchTemplates: async (query, category = null) => {
    set({ loading: true, error: null })
    try {
      const response = await templateService.searchTemplates(query, category)
      set({ templates: response.data, loading: false })
      return response.data
    } catch (error) {
      set({ 
        error: error.response?.data?.detail || error.message || 'Search failed',
        loading: false 
      })
      throw error
    }
  },

  // Clear selected template
  clearSelectedTemplate: () => {
    set({ selectedTemplate: null })
  },

  // Clear error
  clearError: () => {
    set({ error: null })
  },

  // Get templates by category
  getTemplatesByCategory: (category) => {
    const { templates } = get()
    return templates.filter(template => template.category === category)
  },

  // Get popular templates (most used)
  getPopularTemplates: (limit = 5) => {
    const { templates } = get()
    return [...templates]
      .sort((a, b) => b.usage_count - a.usage_count)
      .slice(0, limit)
  }
}))
