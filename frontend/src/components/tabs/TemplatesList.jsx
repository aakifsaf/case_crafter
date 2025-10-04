import { useState, useEffect } from 'react'
import { useTemplateStore } from '../../stores/useTemplateStore'
import { 
  DocumentDuplicateIcon, 
  PlusIcon, 
  MagnifyingGlassIcon,
  XMarkIcon 
} from '@heroicons/react/24/outline'

export const TemplatesList = () => {
  const { templates, loading, fetchTemplates, createTemplate } = useTemplateStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'functional',
    content: {
      test_cases: []
    },
    is_public: false
  })
  const [newTestCase, setNewTestCase] = useState({
    name: '',
    description: '',
    test_type: 'positive',
    priority: 'medium',
    test_steps: [''],
    expected_results: ''
  })

  const categories = ['all', 'functional', 'performance', 'security', 'integration', 'ui']
  const testTypes = ['positive', 'negative', 'edge', 'security']
  const priorities = ['low', 'medium', 'high']

  useEffect(() => {
    fetchTemplates()
  }, [fetchTemplates])

  const filteredTemplates = templates.filter(template => 
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedCategory === 'all' || template.category === selectedCategory)
  )

  const handleCreateTemplate = async (e) => {
    e.preventDefault()
    try {
      await createTemplate(formData)
      setShowCreateModal(false)
      setFormData({
        name: '',
        description: '',
        category: 'functional',
        content: { test_cases: [] },
        is_public: false
      })
    } catch (error) {
      // Error is handled in the store
    }
  }

  const addTestCase = () => {
    if (newTestCase.name.trim()) {
      setFormData(prev => ({
        ...prev,
        content: {
          ...prev.content,
          test_cases: [...prev.content.test_cases, { ...newTestCase }]
        }
      }))
      setNewTestCase({
        name: '',
        description: '',
        test_type: 'positive',
        priority: 'medium',
        test_steps: [''],
        expected_results: ''
      })
    }
  }

  const removeTestCase = (index) => {
    setFormData(prev => ({
      ...prev,
      content: {
        ...prev.content,
        test_cases: prev.content.test_cases.filter((_, i) => i !== index)
      }
    }))
  }

  const addTestStep = () => {
    setNewTestCase(prev => ({
      ...prev,
      test_steps: [...prev.test_steps, '']
    }))
  }

  const updateTestStep = (index, value) => {
    setNewTestCase(prev => ({
      ...prev,
      test_steps: prev.test_steps.map((step, i) => i === index ? value : step)
    }))
  }

  const removeTestStep = (index) => {
    setNewTestCase(prev => ({
      ...prev,
      test_steps: prev.test_steps.filter((_, i) => i !== index)
    }))
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Test Templates</h1>
          <p className="text-gray-400 mt-2">Reusable test case templates for your projects</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white font-medium transition-colors"
        >
          <PlusIcon className="h-5 w-5" />
          New Template
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {categories.map(category => (
            <option key={category} value={category}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Templates Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-800 rounded-xl p-6 h-48"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map(template => (
            <div key={template.id} className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-blue-500 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <DocumentDuplicateIcon className="h-8 w-8 text-blue-400" />
                <span className={`px-2 py-1 text-xs rounded-full ${
                  template.category === 'functional' ? 'bg-green-500/20 text-green-300' :
                  template.category === 'performance' ? 'bg-yellow-500/20 text-yellow-300' :
                  template.category === 'security' ? 'bg-red-500/20 text-red-300' :
                  'bg-blue-500/20 text-blue-300'
                }`}>
                  {template.category}
                </span>
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">{template.name}</h3>
              <p className="text-gray-400 text-sm mb-4">{template.description}</p>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>{template.test_cases_count} test cases</span>
                <span>Used {template.usage_count} times</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Template Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-700">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Create New Template</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
            </div>

            <form onSubmit={handleCreateTemplate} className="p-6 space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Template Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter template name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {categories.filter(cat => cat !== 'all').map(category => (
                      <option key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe what this template is for..."
                />
              </div>

              {/* Test Cases Section */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-white">Test Cases</h3>
                  <span className="text-sm text-gray-400">
                    {formData.content.test_cases.length} test cases added
                  </span>
                </div>

                {/* Add New Test Case */}
                <div className="bg-gray-700 rounded-lg p-4 mb-6">
                  <h4 className="text-white font-medium mb-4">Add New Test Case</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Name *</label>
                      <input
                        type="text"
                        value={newTestCase.name}
                        onChange={(e) => setNewTestCase({...newTestCase, name: e.target.value})}
                        className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white text-sm"
                        placeholder="Test case name"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">Type</label>
                        <select
                          value={newTestCase.test_type}
                          onChange={(e) => setNewTestCase({...newTestCase, test_type: e.target.value})}
                          className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white text-sm"
                        >
                          {testTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">Priority</label>
                        <select
                          value={newTestCase.priority}
                          onChange={(e) => setNewTestCase({...newTestCase, priority: e.target.value})}
                          className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white text-sm"
                        >
                          {priorities.map(priority => (
                            <option key={priority} value={priority}>{priority}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm text-gray-400 mb-1">Description</label>
                    <textarea
                      value={newTestCase.description}
                      onChange={(e) => setNewTestCase({...newTestCase, description: e.target.value})}
                      rows={2}
                      className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white text-sm"
                      placeholder="Test case description"
                    />
                  </div>

                  {/* Test Steps */}
                  <div className="mb-4">
                    <label className="block text-sm text-gray-400 mb-2">Test Steps</label>
                    {newTestCase.test_steps.map((step, index) => (
                      <div key={index} className="flex gap-2 mb-2">
                        <span className="text-gray-400 text-sm pt-2">{index + 1}.</span>
                        <input
                          type="text"
                          value={step}
                          onChange={(e) => updateTestStep(index, e.target.value)}
                          className="flex-1 px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white text-sm"
                          placeholder={`Step ${index + 1}`}
                        />
                        {newTestCase.test_steps.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeTestStep(index)}
                            className="px-2 text-red-400 hover:text-red-300"
                          >
                            <XMarkIcon className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addTestStep}
                      className="text-sm text-blue-400 hover:text-blue-300"
                    >
                      + Add Step
                    </button>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm text-gray-400 mb-1">Expected Results</label>
                    <input
                      type="text"
                      value={newTestCase.expected_results}
                      onChange={(e) => setNewTestCase({...newTestCase, expected_results: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white text-sm"
                      placeholder="What should happen when this test passes?"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={addTestCase}
                    disabled={!newTestCase.name.trim()}
                    className="w-full py-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed rounded text-white text-sm font-medium"
                  >
                    Add Test Case
                  </button>
                </div>

                {/* Added Test Cases List */}
                {formData.content.test_cases.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-white font-medium">Added Test Cases</h4>
                    {formData.content.test_cases.map((testCase, index) => (
                      <div key={index} className="bg-gray-700 rounded p-3 flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-white font-medium">{testCase.name}</span>
                            <span className={`text-xs px-2 py-1 rounded ${
                              testCase.test_type === 'positive' ? 'bg-green-500/20 text-green-300' :
                              testCase.test_type === 'negative' ? 'bg-yellow-500/20 text-yellow-300' :
                              testCase.test_type === 'security' ? 'bg-red-500/20 text-red-300' :
                              'bg-blue-500/20 text-blue-300'
                            }`}>
                              {testCase.test_type}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded ${
                              testCase.priority === 'high' ? 'bg-red-500/20 text-red-300' :
                              testCase.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                              'bg-green-500/20 text-green-300'
                            }`}>
                              {testCase.priority}
                            </span>
                          </div>
                          {testCase.description && (
                            <p className="text-gray-400 text-sm">{testCase.description}</p>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => removeTestCase(index)}
                          className="text-red-400 hover:text-red-300 ml-2"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Visibility Setting */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="is_public"
                  checked={formData.is_public}
                  onChange={(e) => setFormData({...formData, is_public: e.target.checked})}
                  className="w-4 h-4 text-blue-500 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="is_public" className="text-sm text-gray-400">
                  Make this template public (other users can see and use it)
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-6 border-t border-gray-700">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-600 text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !formData.name.trim() || formData.content.test_cases.length === 0}
                  className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                >
                  {loading ? 'Creating...' : 'Create Template'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}