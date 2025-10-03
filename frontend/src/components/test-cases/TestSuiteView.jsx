import { useState, useEffect } from 'react'
import { useProjectStore } from '../../stores/useProjectStore'
import { TestCaseVisualization } from './TestCaseVisualization'
import { TestCaseList } from './TestCaseList'
import { ExportPanel } from './ExportPanel'
import { 
  ChartBarIcon, 
  DocumentArrowDownIcon,
  EyeIcon,
  EyeSlashIcon,
  FolderIcon,
  DocumentTextIcon,
  CogIcon
} from '@heroicons/react/24/outline'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
  const navigation = [
  { name: 'Overview', href: '', icon: FolderIcon },
  { name: 'Documents', href: 'documents', icon: DocumentTextIcon },
  { name: 'Test Suite', href: 'test-suite', icon: ChartBarIcon },
  { name: 'Settings', href: 'settings', icon: CogIcon },
]
export const TestSuiteView = ({ }) => {
  const { testSuites, fetchTraceabilityMatrix, generateTestCases, loading, fetchTestSuite } = useProjectStore()
  const [selectedTestSuite, setSelectedTestSuite] = useState(null)
  const [showExportPanel, setShowExportPanel] = useState(false)
  const [viewMode, setViewMode] = useState('visualization')
  const [isHovered, setIsHovered] = useState({})
  const { projectId } = useParams()
  const [activeTab, setActiveTab] = useState('')


useEffect(() => {
  const fetchProjectData = async () => {
    if (projectId) {
      console.log('🔄 Fetching project data for:', projectId)
      try {
        await Promise.all([
          fetchTraceabilityMatrix(projectId),
          fetchTestSuite(projectId)
        ])
        console.log('✅ All project data fetched successfully')
      } catch (error) {
        console.error('❌ Error fetching project data:', error)
      }
    }
  }

  fetchProjectData()
}, [projectId, fetchTraceabilityMatrix, fetchTestSuite])

  useEffect(() => {
    const pathSegments = location.pathname.split('/')
    const currentTab = pathSegments[pathSegments.length - 1]
    setActiveTab(currentTab === projectId ? '' : currentTab)
  }, [location.pathname, projectId])

  const handleGenerateAllTests = async () => {
    const { documents } = useProjectStore.getState()
    const processedDocuments = documents.filter(doc => doc.status === 'processed')
    
    for (const doc of processedDocuments) {
      try {
        await generateTestCases(doc.id)
        await fetchTestSuite(projectId)
      } catch (error) {
        console.error(`Failed to generate tests for document ${doc.id}:`, error)
      }
    }
  }

  const currentTestSuite = selectedTestSuite || testSuites[0]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      {/* Header */}
      {/* Project Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12"
      >
        
        {/* Navigation Tabs */}
        <div className=" border-b border-gray-700/50">
          <nav className="-mb-px flex space-x-8">
            {navigation.map((item) => {
              const isActive = activeTab === item.href
              const href = item.href ? `/projects/${projectId}/${item.href}` : `/projects/${projectId}`
              
              return (
                <Link
                  key={item.name}
                  to={href}
                  className={`group relative inline-flex items-center py-4 px-1 font-medium text-sm transition-all duration-300 ${
                    isActive
                      ? 'text-cyan-400'
                      : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-b-2 border-cyan-400"
                      transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                    />
                  )}
                  <div className="relative z-10 flex items-center">
                    <item.icon
                      className={`mr-3 h-5 w-5 transition-all duration-300 ${
                        isActive 
                          ? 'text-cyan-400' 
                          : 'text-gray-500 group-hover:text-gray-300'
                      }`}
                    />
                    {item.name}
                  </div>
                </Link>
              )
            })}
          </nav>
        </div>
      </motion.div>
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
        <div className="mb-6 lg:mb-0">
          <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 mb-2">
            Test Suite
          </h2>
          <p className="text-gray-300 text-lg">
            Immersive test case management with AI-powered insights
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          {/* View Toggle */}
          <div className="flex rounded-xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 p-1">
            <button
              onClick={() => setViewMode('visualization')}
              onMouseEnter={() => setIsHovered(prev => ({...prev, viz: true}))}
              onMouseLeave={() => setIsHovered(prev => ({...prev, viz: false}))}
              className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-xl transition-all duration-300 ${
                viewMode === 'visualization'
                  ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-white shadow-lg shadow-cyan-500/25'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              <ChartBarIcon className="h-5 w-5 mr-2" />
              Visualization
            </button>
            <button
              onClick={() => setViewMode('list')}
              onMouseEnter={() => setIsHovered(prev => ({...prev, list: true}))}
              onMouseLeave={() => setIsHovered(prev => ({...prev, list: false}))}
              className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-xl transition-all duration-300 ${
                viewMode === 'list'
                  ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-white shadow-lg shadow-cyan-500/25'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              <EyeIcon className="h-5 w-5 mr-2" />
              List View
            </button>
          </div>

          {/* Action Buttons */}
          <button
            onClick={() => setShowExportPanel(true)}
            onMouseEnter={() => setIsHovered(prev => ({...prev, export: true}))}
            onMouseLeave={() => setIsHovered(prev => ({...prev, export: false}))}
            className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 text-gray-300 hover:text-white hover:bg-gray-700/50 hover:border-cyan-500/30 transition-all duration-300 group"
          >
            <DocumentArrowDownIcon className="h-5 w-5 mr-2 group-hover:text-cyan-400 transition-colors duration-300" />
            Export
          </button>

          <button
            onClick={handleGenerateAllTests}
            disabled={loading}
            onMouseEnter={() => setIsHovered(prev => ({...prev, generate: true}))}
            onMouseLeave={() => setIsHovered(prev => ({...prev, generate: false}))}
            className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100"
          >
            {loading ? (
              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            ) : null}
            Generate All Tests
          </button>
        </div>
      </div>

      {/* Test Suite Selector */}
      {testSuites.length > 1 && (
        <div className="bg-gray-800/30 backdrop-blur-md rounded-2xl border border-gray-700/50 p-6 mb-8 transform transition-all duration-500 hover:border-cyan-500/30">
          <label className="block text-sm font-medium text-cyan-400 mb-3">
            Select Test Suite
          </label>
          <select
            value={selectedTestSuite?.id || ''}
            onChange={(e) => {
              const suite = testSuites.find(s => s.id === parseInt(e.target.value))
              setSelectedTestSuite(suite)
            }}
            className="block w-full bg-gray-900/50 border border-gray-700/50 text-white rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/30 transition-all duration-300"
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
      <div className="transform transition-all duration-700">
        {viewMode === 'visualization' ? (
          <TestCaseVisualization projectId={projectId} />
        ) : (
          <TestCaseList 
            testSuites={ testSuites}
            projectId={projectId}
          />
        )}
      </div>

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