import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useProjectStore } from '../../stores/useProjectStore'
import { StatCard } from '../ui/StatCard'

export const ProjectOverview = ({ projectId }) => {
  const { documents, testSuites, fetchDocuments, fetchTraceabilityMatrix, traceabilityMatrix } = useProjectStore()

  useEffect(() => {
    if (projectId) {
      fetchDocuments(projectId)
      fetchTraceabilityMatrix(projectId)
    }
  }, [projectId, fetchDocuments, fetchTraceabilityMatrix])

  const calculateCoverage = () => {
    if (!traceabilityMatrix) return 0
    const totalRequirements = traceabilityMatrix.requirements.length
    const coveredRequirements = traceabilityMatrix.requirements.filter(
      req => req.test_cases && req.test_cases.length > 0
    ).length
    return Math.round((coveredRequirements / totalRequirements) * 100)
  }

  const recentDocuments = documents.slice(0, 3)
  const recentTestSuites = testSuites.slice(0, 3)

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Documents"
          value={documents.length}
          icon="📄"
          description="BRD documents uploaded"
        />
        <StatCard
          title="Test Suites"
          value={testSuites.length}
          icon="✅"
          description="Generated test suites"
        />
        <StatCard
          title="Requirements"
          value={traceabilityMatrix?.requirements.length || 0}
          icon="🎯"
          description="Extracted requirements"
        />
        <StatCard
          title="Coverage"
          value={`${calculateCoverage()}%`}
          icon="📊"
          description="Requirements covered by tests"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Documents */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Recent Documents</h3>
            <Link
              to={`/projects/${projectId}/documents`}
              className="text-sm text-blue-600 hover:text-blue-500"
            >
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {recentDocuments.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No documents yet</p>
            ) : (
              recentDocuments.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <DocumentTextIcon className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{doc.filename}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(doc.uploaded_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    doc.status === 'processed' 
                      ? 'bg-green-100 text-green-800'
                      : doc.status === 'processing'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {doc.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Test Suites */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Recent Test Suites</h3>
            <Link
              to={`/projects/${projectId}/test-suite`}
              className="text-sm text-blue-600 hover:text-blue-500"
            >
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {recentTestSuites.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No test suites generated</p>
            ) : (
              recentTestSuites.map((suite) => (
                <div key={suite.id} className="p-3 border border-gray-100 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-sm font-medium text-gray-900">{suite.name}</p>
                    <span className="text-xs text-gray-500">
                      {suite.test_cases?.length || 0} test cases
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 line-clamp-2">
                    Generated from {suite.document_name}
                  </p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-gray-500">
                      {new Date(suite.created_at).toLocaleDateString()}
                    </span>
                    <div className="flex space-x-2">
                      <span className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                        Positive: {suite.test_cases?.filter(tc => tc.test_type === 'positive').length || 0}
                      </span>
                      <span className="inline-flex items-center px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded-full">
                        Edge: {suite.test_cases?.filter(tc => tc.test_type === 'edge').length || 0}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
        <div className="flex space-x-4">
          <Link
            to={`/projects/${projectId}/documents`}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            <DocumentTextIcon className="h-4 w-4 mr-2" />
            Upload Document
          </Link>
          <Link
            to={`/projects/${projectId}/test-suite`}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <ChartBarIcon className="h-4 w-4 mr-2" />
            View Test Suite
          </Link>
        </div>
      </div>
    </div>
  )
}