import { useEffect } from 'react'
import { useProjectStore } from '../../stores/useProjectStore'
import { TraceabilityGraph } from './TraceabilityGraph'
import { TestCaseList } from './TestCaseList'

export const TestCaseVisualization = ({ projectId }) => {
  const { 
    traceabilityMatrix, 
    testSuites, 
    fetchTraceabilityMatrix, 
    loading 
  } = useProjectStore()

  useEffect(() => {
    if (projectId) {
      fetchTraceabilityMatrix(projectId)
    }
  }, [projectId, fetchTraceabilityMatrix])

  const calculateCoverage = () => {
    if (!traceabilityMatrix) return 0
    const totalRequirements = traceabilityMatrix.requirements.length
    const coveredRequirements = traceabilityMatrix.requirements.filter(
      req => req.test_cases && req.test_cases.length > 0
    ).length
    return Math.round((coveredRequirements / totalRequirements) * 100)
  }

  const countEdgeCases = () => {
    return testSuites.reduce((count, suite) => {
      return count + (suite.test_cases?.filter(tc => tc.test_type === 'edge').length || 0)
    }, 0)
  }

  if (loading) {
    return <div className="animate-pulse bg-white rounded-lg p-6 h-64"></div>
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Requirements"
          value={traceabilityMatrix?.requirements.length || 0}
          icon="📄"
        />
        <StatCard
          title="Test Cases"
          value={traceabilityMatrix?.test_cases.length || 0}
          icon="✅"
        />
        <StatCard
          title="Coverage"
          value={`${calculateCoverage()}%`}
          icon="📊"
        />
        <StatCard
          title="Edge Cases"
          value={countEdgeCases()}
          icon="⚠️"
        />
      </div>

      {/* Traceability Graph */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Requirement-Test Traceability
        </h3>
        <TraceabilityGraph matrix={traceabilityMatrix} />
      </div>

      {/* Test Case List */}
      <TestCaseList testSuites={testSuites} />
    </div>
  )
}