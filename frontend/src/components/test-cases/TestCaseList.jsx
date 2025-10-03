import { useState, useEffect } from 'react'
import { 
  ChevronDownIcon, 
  ChevronRightIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline'
import { ShieldCheckIcon } from '../ui/icons'
import { motion, AnimatePresence } from 'framer-motion'

export const TestCaseList = ({ testSuites, projectId }) => {
  const [expandedSuites, setExpandedSuites] = useState({})
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    return () => setIsMounted(false)
  }, [])

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

    if (filter !== 'all') {
      allTestCases = allTestCases.filter(tc => tc.test_type === filter)
    }

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
    const icons = {
      positive: <CheckCircleIcon className="h-5 w-5 text-emerald-400" />,
      negative: <XCircleIcon className="h-5 w-5 text-rose-400" />,
      edge: <ExclamationTriangleIcon className="h-5 w-5 text-amber-400" />,
      security: <ShieldCheckIcon className="h-5 w-5 text-cyan-400" />
    }
    return icons[testType] || <DocumentTextIcon className="h-5 w-5 text-indigo-400" />
  }

  const getTestTypeBadge = (testType) => {
    const styles = {
      positive: 'bg-emerald-400/10 text-emerald-400 ring-emerald-400/20',
      negative: 'bg-rose-400/10 text-rose-400 ring-rose-400/20',
      edge: 'bg-amber-400/10 text-amber-400 ring-amber-400/20',
      security: 'bg-cyan-400/10 text-cyan-400 ring-cyan-400/20'
    }
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ring-1 ring-inset ${styles[testType] || 'bg-indigo-400/10 text-indigo-400 ring-indigo-400/20'}`}>
        {testType}
      </span>
    )
  }

  const testCases = getTestCases()

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header Section */}
      <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 backdrop-blur-md rounded-2xl border border-white/10 p-6 shadow-2xl">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2">
          Test Cases
        </h2>
        <p className="text-gray-400">Explore and manage your AI-generated test cases</p>
      </div>

      {/* Filters and Search */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-gray-900/50 backdrop-blur-md rounded-2xl border border-white/10 p-6 shadow-xl"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-300">Filter:</label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-gray-800/50 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all duration-200"
            >
              <option value="all" className="bg-gray-900">All Test Types</option>
              <option value="positive" className="bg-gray-900">Positive Tests</option>
              <option value="negative" className="bg-gray-900">Negative Tests</option>
              <option value="edge" className="bg-gray-900">Edge Cases</option>
              <option value="security" className="bg-gray-900">Security Tests</option>
            </select>
          </div>
          
          <div className="flex-1 max-w-md relative">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search test cases..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-800/50 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all duration-200"
            />
          </div>

          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="text-sm bg-cyan-500/10 text-cyan-400 px-4 py-2 rounded-xl border border-cyan-400/20"
          >
            {testCases.length} test cases found
          </motion.div>
        </div>
      </motion.div>

      {/* Test Cases List */}
      <div className="space-y-4">
        <AnimatePresence>
          {testSuites.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-gray-900/50 backdrop-blur-md rounded-2xl border border-white/10 p-12 text-center shadow-xl"
            >
              <DocumentTextIcon className="mx-auto h-16 w-16 text-gray-400/50 mb-4" />
              <h3 className="text-lg font-medium text-gray-200 mb-2">No test suites</h3>
              <p className="text-gray-400">
                Generate test cases from your documents to get started.
              </p>
            </motion.div>
          ) : testCases.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-gray-900/50 backdrop-blur-md rounded-2xl border border-white/10 p-12 text-center shadow-xl"
            >
              <p className="text-gray-400">No test cases match your filters.</p>
            </motion.div>
          ) : (
            testSuites.map((suite, index) => {
              const suiteTestCases = testCases.filter(tc => tc.suite_id === suite.id)
              if (suiteTestCases.length === 0) return null
              
              const isExpanded = expandedSuites[suite.id]

              return (
                <motion.div 
                  key={suite.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-md rounded-2xl border border-white/10 shadow-xl overflow-hidden"
                >
                  {/* Suite Header */}
                  <motion.button
                    whileHover={{ background: 'rgba(255, 255, 255, 0.05)' }}
                    onClick={() => toggleSuite(suite.id)}
                    className="w-full flex items-center justify-between p-6 text-left"
                  >
                    <div className="flex items-center space-x-4">
                      <motion.div animate={{ rotate: isExpanded ? 180 : 0 }}>
                        {isExpanded ? (
                          <ChevronDownIcon className="h-6 w-6 text-cyan-400" />
                        ) : (
                          <ChevronRightIcon className="h-6 w-6 text-cyan-400" />
                        )}
                      </motion.div>
                      <div>
                        <h3 className="text-xl font-semibold text-white">{suite.name}</h3>
                        <p className="text-sm text-gray-400">
                          {suite.test_cases?.length || 0} test cases • {suite.document_name}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {['positive', 'negative', 'edge'].map(type => {
                        const count = suite.test_cases?.filter(tc => tc.test_type === type).length || 0
                        if (count === 0) return null
                        const colors = {
                          positive: 'emerald',
                          negative: 'rose',
                          edge: 'amber'
                        }
                        return (
                          <span key={type} className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-${colors[type]}-400/10 text-${colors[type]}-400 ring-1 ring-${colors[type]}-400/20`}>
                            {count} {type}
                          </span>
                        )
                      })}
                    </div>
                  </motion.button>

                  {/* Suite Content */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-t border-white/10"
                      >
                        {suiteTestCases.map((testCase, index) => (
                          <motion.div
                            key={testCase.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: index * 0.05 }}
                            className={`p-6 ${index !== suiteTestCases.length - 1 ? 'border-b border-white/5' : ''}`}
                          >
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center space-x-3">
                                {getTestTypeIcon(testCase.test_type)}
                                <h4 className="text-lg font-medium text-white">{testCase.name}</h4>
                                {getTestTypeBadge(testCase.test_type)}
                              </div>
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                testCase.priority === 'high' 
                                  ? 'bg-rose-400/10 text-rose-400 ring-1 ring-rose-400/20'
                                  : testCase.priority === 'medium'
                                  ? 'bg-amber-400/10 text-amber-400 ring-1 ring-amber-400/20'
                                  : 'bg-emerald-400/10 text-emerald-400 ring-1 ring-emerald-400/20'
                              }`}>
                                {testCase.priority} priority
                              </span>
                            </div>

                            {testCase.description && (
                              <p className="text-gray-300 mb-4 leading-relaxed">{testCase.description}</p>
                            )}

                            {/* Test Steps */}
                            {testCase.test_steps && testCase.test_steps.length > 0 && (
                              <div className="mb-4">
                                <h5 className="text-sm font-medium text-gray-300 mb-3">Test Steps:</h5>
                                <ol className="list-decimal list-inside space-y-2 text-gray-400">
                                  {testCase.test_steps.map((step, stepIndex) => (
                                    <li key={stepIndex} className="leading-relaxed">{step}</li>
                                  ))}
                                </ol>
                              </div>
                            )}

                            {/* Expected Results */}
                            {testCase.expected_results && (
                              <div className="mb-4">
                                <h5 className="text-sm font-medium text-gray-300 mb-2">Expected Results:</h5>
                                <p className="text-gray-400 bg-white/5 p-4 rounded-xl border border-white/5">{testCase.expected_results}</p>
                              </div>
                            )}

                            {/* Test Data */}
                            {testCase.test_data && Object.keys(testCase.test_data).length > 0 && (
                              <div>
                                <h5 className="text-sm font-medium text-gray-300 mb-2">Test Data:</h5>
                                <pre className="text-sm text-gray-400 bg-white/5 p-4 rounded-xl border border-white/5 overflow-x-auto">
                                  {JSON.stringify(testCase.test_data, null, 2)}
                                </pre>
                              </div>
                            )}
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}