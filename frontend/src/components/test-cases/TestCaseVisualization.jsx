import { useEffect } from 'react'
import { useProjectStore } from '../../stores/useProjectStore'
import { TraceabilityGraph } from './TraceabilityGraph'
import { TestCaseList } from './TestCaseList'
import { StatCard } from '../ui/StatCard'

export const TestCaseVisualization = ({ projectId }) => {
  const { 
    traceabilityMatrix, 
    testSuites, 
    fetchTraceabilityMatrix, 
    fetchTestSuite,
    loading 
  } = useProjectStore()

  useEffect(() => {
    if (projectId) {
      fetchTraceabilityMatrix(projectId)
      fetchTestSuite(projectId)
    }
  }, [projectId, fetchTraceabilityMatrix, fetchTestSuite])

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

      if ( loading) {
    return (
      <div className="max-w-7xl mx-auto px-4">
        <div className="animate-pulse">
          <div className="h-12 bg-gradient-to-r from-gray-800 to-gray-700 rounded-xl w-1/3 mb-6"></div>
          <div className="h-6 bg-gradient-to-r from-gray-800 to-gray-700 rounded-xl w-1/2 mb-12"></div>
          <div className="grid grid-cols-4 gap-6 mb-12">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 bg-gradient-to-r from-gray-800 to-gray-700 rounded-2xl"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

return (
    <div className="space-y-8">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Requirements"
          value={traceabilityMatrix?.requirements.length || 0}
          icon="📄"
          className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-md border border-gray-700/50 hover:border-cyan-500/30 transition-all duration-500"
        />
        <StatCard
          title="Test Cases"
          value={traceabilityMatrix?.test_cases.length || 0}
          icon="✅"
          className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-md border border-gray-700/50 hover:border-cyan-500/30 transition-all duration-500"
        />
        <StatCard
          title="Coverage"
          value={`${calculateCoverage()}%`}
          icon="📊"
          className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-md border border-gray-700/50 hover:border-cyan-500/30 transition-all duration-500"
        />
        <StatCard
          title="Edge Cases"
          value={countEdgeCases()}
          icon="⚠️"
          className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-md border border-gray-700/50 hover:border-cyan-500/30 transition-all duration-500"
        />
      </div>

      {/* Traceability Graph */}
      <div className="bg-gray-800/30 backdrop-blur-md rounded-2xl border border-gray-700/50 p-8 transform transition-all duration-500 hover:border-cyan-500/30">
        <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 mb-6">
          Requirement-Test Traceability
        </h3>
        <div className="rounded-xl overflow-hidden">
          <TraceabilityGraph matrix={traceabilityMatrix} />
        </div>
      </div>

      {/* Test Case List */}
      <div className="bg-gray-800/30 backdrop-blur-md rounded-2xl border border-gray-700/50 p-8 transform transition-all duration-500 hover:border-cyan-500/30">
        <TestCaseList testSuites={testSuites} />
      </div>
    </div>
  )
}