import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useProjectStore } from '../../stores/useProjectStore'
import { StatCard } from '../ui/StatCard'
import { DocumentTextIcon, ChartBarIcon } from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  }

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Statistics */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Documents"
          value={documents.length}
          icon="📄"
          description="BRD documents uploaded"
          gradient="from-purple-500/20 to-blue-500/20"
        />
        <StatCard
          title="Test Suites"
          value={testSuites.length}
          icon="✅"
          description="Generated test suites"
          gradient="from-green-500/20 to-cyan-500/20"
        />
        <StatCard
          title="Requirements"
          value={traceabilityMatrix?.requirements.length || 0}
          icon="🎯"
          description="Extracted requirements"
          gradient="from-orange-500/20 to-red-500/20"
        />
        <StatCard
          title="Coverage"
          value={`${calculateCoverage()}%`}
          icon="📊"
          description="Requirements covered by tests"
          gradient="from-cyan-500/20 to-blue-500/20"
        />
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Documents */}
        <div className="bg-gradient-to-br from-gray-900/70 to-gray-800/50 backdrop-blur-md rounded-2xl border border-gray-700/30 p-6 shadow-2xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-100">Recent Documents</h3>
            <Link
              to={`/projects/${projectId}/documents`}
              className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors duration-300"
            >
              View all
            </Link>
          </div>
          <div className="space-y-4">
            {recentDocuments.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No documents yet</p>
            ) : (
              recentDocuments.map((doc) => (
                <motion.div 
                  key={doc.id} 
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center justify-between p-4 bg-gray-800/40 rounded-xl border border-gray-700/50 backdrop-blur-sm transition-all duration-300 hover:border-cyan-500/30"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-gray-700/50 rounded-lg">
                      <DocumentTextIcon className="h-5 w-5 text-cyan-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-100">{doc.filename}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(doc.uploaded_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full backdrop-blur-sm ${
                    doc.status === 'processed' 
                      ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                      : doc.status === 'processing'
                      ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                      : 'bg-red-500/20 text-red-300 border border-red-500/30'
                  }`}>
                    {doc.status}
                  </span>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Recent Test Suites */}
        <div className="bg-gradient-to-br from-gray-900/70 to-gray-800/50 backdrop-blur-md rounded-2xl border border-gray-700/30 p-6 shadow-2xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-100">Recent Test Suites</h3>
            <Link
              to={`/projects/${projectId}/test-suite`}
              className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors duration-300"
            >
              View all
            </Link>
          </div>
          <div className="space-y-4">
            {recentTestSuites.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No test suites generated</p>
            ) : (
              recentTestSuites.map((suite) => (
                <motion.div 
                  key={suite.id} 
                  whileHover={{ scale: 1.02 }}
                  className="p-4 bg-gray-800/40 rounded-xl border border-gray-700/50 backdrop-blur-sm transition-all duration-300 hover:border-cyan-500/30"
                >
                  <div className="flex justify-between items-start mb-3">
                    <p className="text-sm font-medium text-gray-100">{suite.name}</p>
                    <span className="text-xs text-cyan-400 bg-cyan-500/10 px-2 py-1 rounded-full">
                      {suite.test_cases?.length || 0} tests
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 line-clamp-2 mb-3">
                    Generated from {suite.document_name}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">
                      {new Date(suite.created_at).toLocaleDateString()}
                    </span>
                    <div className="flex space-x-2">
                      <span className="inline-flex items-center px-2 py-1 text-xs bg-blue-500/20 text-blue-300 rounded-full border border-blue-500/30">
                        Positive: {suite.test_cases?.filter(tc => tc.test_type === 'positive').length || 0}
                      </span>
                      <span className="inline-flex items-center px-2 py-1 text-xs bg-orange-500/20 text-orange-300 rounded-full border border-orange-500/30">
                        Edge: {suite.test_cases?.filter(tc => tc.test_type === 'edge').length || 0}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants} className="bg-gradient-to-br from-gray-900/70 to-gray-800/50 backdrop-blur-md rounded-2xl border border-gray-700/30 p-8 shadow-2xl">
        <h3 className="text-xl font-semibold text-gray-100 mb-6">Quick Actions</h3>
        <div className="flex space-x-6">
          <Link
            to={`/projects/${projectId}/documents`}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium rounded-xl shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 hover:scale-105"
          >
            <DocumentTextIcon className="h-5 w-5 mr-3" />
            Upload Document
          </Link>
          <Link
            to={`/projects/${projectId}/test-suite`}
            className="inline-flex items-center px-6 py-3 border border-gray-600 text-gray-100 font-medium rounded-xl backdrop-blur-sm bg-gray-800/40 hover:bg-gray-700/60 transition-all duration-300 hover:scale-105"
          >
            <ChartBarIcon className="h-5 w-5 mr-3" />
            View Test Suite
          </Link>
        </div>
      </motion.div>
    </motion.div>
  )
}
