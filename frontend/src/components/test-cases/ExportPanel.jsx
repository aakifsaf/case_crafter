import { useState } from 'react'
import { useProjectStore } from '../../stores/useProjectStore'
import { XMarkIcon } from '@heroicons/react/24/outline'

export const ExportPanel = ({ testSuites, onClose }) => {
  const { exportTestSuite, loading } = useProjectStore()
  const [selectedFormat, setSelectedFormat] = useState('excel')
  const [selectedTestSuites, setSelectedTestSuites] = useState([])

  const handleExport = async () => {
    try {
      for (const suiteId of selectedTestSuites) {
        await exportTestSuite(suiteId, selectedFormat)
      }
      onClose()
    } catch (error) {
      console.error('Export failed:', error)
    }
  }

  const toggleTestSuite = (suiteId) => {
    setSelectedTestSuites(prev =>
      prev.includes(suiteId)
        ? prev.filter(id => id !== suiteId)
        : [...prev, suiteId]
    )
  }

  const selectAll = () => {
    setSelectedTestSuites(testSuites.map(suite => suite.id))
  }

  const selectNone = () => {
    setSelectedTestSuites([])
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Export Test Suite</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Format Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Export Format
            </label>
            <div className="grid grid-cols-3 gap-3">
              {['excel', 'json', 'pdf'].map((format) => (
                <button
                  key={format}
                  onClick={() => setSelectedFormat(format)}
                  className={`p-3 border rounded-md text-center ${
                    selectedFormat === format
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="text-sm font-medium capitalize">{format}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Test Suite Selection */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Select Test Suites
              </label>
              <div className="space-x-2">
                <button
                  onClick={selectAll}
                  className="text-sm text-blue-600 hover:text-blue-500"
                >
                  Select All
                </button>
                <button
                  onClick={selectNone}
                  className="text-sm text-blue-600 hover:text-blue-500"
                >
                  Select None
                </button>
              </div>
            </div>
            <div className="border border-gray-200 rounded-md max-h-60 overflow-y-auto">
              {testSuites.map((suite) => (
                <label
                  key={suite.id}
                  className="flex items-center p-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50"
                >
                  <input
                    type="checkbox"
                    checked={selectedTestSuites.includes(suite.id)}
                    onChange={() => toggleTestSuite(suite.id)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{suite.name}</p>
                    <p className="text-xs text-gray-500">
                      {suite.test_cases?.length || 0} test cases • {suite.document_name}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Export Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Export Options
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Include test steps</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Include expected results</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Include requirement mapping</span>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleExport}
              disabled={selectedTestSuites.length === 0 || loading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Exporting...' : `Export (${selectedTestSuites.length})`}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
