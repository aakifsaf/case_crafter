import { useState } from 'react'
import { 
  ChevronDownIcon, 
  ChevronRightIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import { ShieldCheckIcon } from '../ui/icons'

export const TestCaseList = ({ testSuites, projectId }) => {
  const [expandedSuites, setExpandedSuites] = useState({})
  const [filter, setFilter] = useState('all') // all, positive, negative, edge, security
  const [searchTerm, setSearchTerm] = useState('')

  const toggleSuite = (suiteId) => {
    setExpandedSuites(prev => ({
      ...prev,
      [suiteId]: !prev[suiteId]
    }))
  }

  const getTestCases = () => {
    let allTestCases = []
    testSuites.forEach(suite => {
      if (suite.test_cases) {
        suite.test_cases.forEach(tc => {
          allTestCases.push({
            ...tc,
            suite_name: suite.name,
            suite_id: suite.id
          })
        })
      }
    })

    // Apply filters
    if (filter !== 'all') {
      allTestCases = allTestCases.filter(tc => tc.test_type === filter)
    }

    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      allTestCases = allTestCases.filter(tc =>
        tc.name.toLowerCase().includes(term) ||
        tc.description.toLowerCase().includes(term) ||
        tc.expected_results.toLowerCase().includes(term)
      )
    }

    return allTestCases
  }

  const getTestTypeIcon = (testType) => {
    switch (testType) {
      case 'positive':
        return <CheckCircleIcon className="h-4 w-4 text-green-500" />
      case 'negative':
        return <XCircleIcon className="h-4 w-4 text-red-500" />
      case 'edge':
        return <ExclamationTriangleIcon className="h-4 w-4 text-orange-500" />
      case 'security':
        return <ShieldCheckIcon className="h-4 w-4 text-blue-500" />
      default:
        return <DocumentTextIcon className="h-4 w-4 text-gray-500" />
    }
  }

  const getTestTypeBadge = (testType) => {
    const styles = {
      positive: 'bg-green-100 text-green-800',
      negative: 'bg-red-100 text-red-800',
      edge: 'bg-orange-100 text-orange-800',
      security: 'bg-blue-100 text-blue-800'
    }

    return (
      <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${styles[testType] || 'bg-gray-100 text-gray-800'}`}>
        {testType}
      </span>
    )
  }

  const testCases = getTestCases()

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">Filter:</label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">All Test Types</option>
              <option value="positive">Positive Tests</option>
              <option value="negative">Negative Tests</option>
              <option value="edge">Edge Cases</option>
              <option value="security">Security Tests</option>
            </select>
          </div>
          
          <div className="flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search test cases..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="text-sm text-gray-500">
            {testCases.length} test cases found
          </div>
        </div>
      </div>

      {/* Test Cases List */}
      <div className="space-y-4">
        {testSuites.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No test suites</h3>
            <p className="mt-1 text-sm text-gray-500">
              Generate test cases from your documents to get started.
            </p>
          </div>
        ) : testCases.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <p className="text-gray-500">No test cases match your filters.</p>
          </div>
        ) : (
          testSuites.map(suite => {
            const suiteTestCases = testCases.filter(tc => tc.suite_id === suite.id)
            if (suiteTestCases.length === 0) return null
            
            const isExpanded = expandedSuites[suite.id]

            return (
              <div key={suite.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
                {/* Suite Header */}
                <button
                  onClick={() => toggleSuite(suite.id)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    {isExpanded ? (
                      <ChevronDownIcon className="h-5 w-5 text-gray-400" />
                    ) : (
                      <ChevronRightIcon className="h-5 w-5 text-gray-400" />
                    )}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{suite.name}</h3>
                      <p className="text-sm text-gray-500">
                        {suite.test_cases?.length || 0} test cases • {suite.document_name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {suite.test_cases?.filter(tc => tc.test_type === 'positive').length || 0} Positive
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      {suite.test_cases?.filter(tc => tc.test_type === 'negative').length || 0} Negative
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                      {suite.test_cases?.filter(tc => tc.test_type === 'edge').length || 0} Edge
                    </span>
                  </div>
                </button>

                {/* Suite Content */}
                {isExpanded && (
                  <div className="border-t border-gray-200">
                    {suiteTestCases.map((testCase, index) => (
                      <div
                        key={testCase.id}
                        className={`p-4 ${index !== suiteTestCases.length - 1 ? 'border-b border-gray-100' : ''}`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            {getTestTypeIcon(testCase.test_type)}
                            <h4 className="text-md font-medium text-gray-900">{testCase.name}</h4>
                            {getTestTypeBadge(testCase.test_type)}
                          </div>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            testCase.priority === 'high' 
                              ? 'bg-red-100 text-red-800'
                              : testCase.priority === 'medium'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {testCase.priority} priority
                          </span>
                        </div>

                        {testCase.description && (
                          <p className="text-sm text-gray-600 mb-3">{testCase.description}</p>
                        )}

                        {/* Test Steps */}
                        {testCase.test_steps && testCase.test_steps.length > 0 && (
                          <div className="mb-3">
                            <h5 className="text-sm font-medium text-gray-700 mb-2">Test Steps:</h5>
                            <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
                              {testCase.test_steps.map((step, stepIndex) => (
                                <li key={stepIndex}>{step}</li>
                              ))}
                            </ol>
                          </div>
                        )}

                        {/* Expected Results */}
                        {testCase.expected_results && (
                          <div className="mb-3">
                            <h5 className="text-sm font-medium text-gray-700 mb-1">Expected Results:</h5>
                            <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">{testCase.expected_results}</p>
                          </div>
                        )}

                        {/* Test Data */}
                        {testCase.test_data && Object.keys(testCase.test_data).length > 0 && (
                          <div>
                            <h5 className="text-sm font-medium text-gray-700 mb-1">Test Data:</h5>
                            <pre className="text-sm text-gray-600 bg-gray-50 p-2 rounded overflow-x-auto">
                              {JSON.stringify(testCase.test_data, null, 2)}
                            </pre>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
