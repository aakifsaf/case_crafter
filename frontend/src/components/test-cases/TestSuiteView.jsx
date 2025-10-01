import { useState, useEffect } from 'react'
import { useProjectStore } from '../../stores/useProjectStore'
import { TestCaseVisualization } from './TestCaseVisualization'
import { TestCaseList } from './TestCaseList'
import { ExportPanel } from './ExportPanel'
import { 
  ChartBarIcon, 
  DocumentArrowDownIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline'

export const TestSuiteView = ({ projectId }) => {
  const { testSuites, fetchTraceabilityMatrix, generateTestCases, loading } = useProjectStore()
  const [selectedTestSuite, setSelectedTestSuite] = useState(null)
  const [showExportPanel, setShowExportPanel] = useState(false)
  const [viewMode, setViewMode] = useState('visualization') // 'visualization' or 'list'

  useEffect(() => {
    if (projectId) {
      fetchTraceabilityMatrix(projectId)
    }
  }, [projectId, fetchTraceabilityMatrix])

  const handleGenerateAllTests = async () => {
    // Generate tests for all processed documents
    const { documents } = useProjectStore.getState()
    const processedDocuments = documents.filter(doc => doc.status === 'processed')
    
    for (const doc of processedDocuments) {
      try {
        await generateTestCases(doc.id)
      } catch (error) {
        console.error(`Failed to generate tests for document ${doc.id}:`, error)
      }
    }
  }

  const currentTestSuite = selectedTestSuite || testSuites[0]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Test Suite</h2>
          <p className="text-gray-600 mt-2">
            View and manage generated test cases
          </p>
        </div>
        <div className="flex space-x-3">
          {/* View Toggle */}
          <div className="flex rounded-md shadow-sm">
            <button
              onClick={() => setViewMode('visualization')}
              className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-l-md ${
                viewMode === 'visualization'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300'
              }`}
            >
              <ChartBarIcon className="h-4 w-4 mr-2" />
              Visualization
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-r-md ${
                viewMode === 'list'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300'
              }`}
            >
              <EyeIcon className="h-4 w-4 mr-2" />
              List View
            </button>
          </div>

          {/* Export Button */}
          <button
            onClick={() => setShowExportPanel(true)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
            Export
          </button>

          {/* Generate Tests Button */}
          <button
            onClick={handleGenerateAllTests}
            disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            Generate All Tests
          </button>
        </div>
      </div>

      {/* Test Suite Selector */}
      {testSuites.length > 1 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Test Suite
          </label>
          <select
            value={selectedTestSuite?.id || ''}
            onChange={(e) => {
              const suite = testSuites.find(s => s.id === parseInt(e.target.value))
              setSelectedTestSuite(suite)
            }}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            {testSuites.map((suite) => (
              <option key={suite.id} value={suite.id}>
                {suite.name} - {suite.document_name} ({suite.test_cases?.length || 0} test cases)
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Content */}
      {viewMode === 'visualization' ? (
        <TestCaseVisualization projectId={projectId} />
      ) : (
        <TestCaseList 
          testSuites={currentTestSuite ? [currentTestSuite] : testSuites}
          projectId={projectId}
        />
      )}

      {/* Export Panel */}
      {showExportPanel && (
        <ExportPanel
          testSuites={testSuites}
          onClose={() => setShowExportPanel(false)}
        />
      )}
    </div>
  )
}