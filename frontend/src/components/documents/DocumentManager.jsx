import { useState, useEffect } from 'react'
import { useProjectStore } from '../../stores/useProjectStore'
import { DocumentUpload } from './DocumentUpload'
import { DocumentList } from './DocumentList'
import { DocumentProcessingStatus } from './DocumentProcessingStatus'
import { ArrowUpTrayIcon, XMarkIcon, FolderIcon, DocumentTextIcon,
  ChartBarIcon, CogIcon, ArrowPathIcon
 } from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'
import { useParams, Link } from 'react-router-dom'

  const navigation = [
  { name: 'Overview', href: '', icon: FolderIcon },
  { name: 'Documents', href: 'documents', icon: DocumentTextIcon },
  { name: 'Test Suite', href: 'test-suite', icon: ChartBarIcon },
  { name: 'Settings', href: 'settings', icon: CogIcon },
]
export const DocumentManager = ({ }) => {
  const { documents, fetchDocuments, loading, refreshProjectData } = useProjectStore()
  const [refreshing, setRefreshing] = useState(false)
  const [showUpload, setShowUpload] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState(null)
  const { projectId } = useParams()
  const [activeTab, setActiveTab] = useState('')


  useEffect(() => {
    if (projectId) {
      fetchDocuments(projectId)
    }
  }, [projectId, fetchDocuments])

    useEffect(() => {
    const pathSegments = location.pathname.split('/')
    const currentTab = pathSegments[pathSegments.length - 1]
    setActiveTab(currentTab === projectId ? '' : currentTab)
  }, [location.pathname, projectId])

  return (
    <div className="space-y-8">
      {/* Header */}
      {/* Project Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
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
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center"
      >
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Document Intelligence
          </h2>
          <p className="text-gray-300 mt-2">
            Transform your BRDs into actionable test cases with AI-powered analysis
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowUpload(true)}
          className="inline-flex items-center px-6 py-3 text-sm font-medium rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg hover:shadow-blue-500/25 hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
        >
          <ArrowUpTrayIcon className="h-5 w-5 mr-2" />
          Upload Document
        </motion.button>
      </motion.div>

      {/* Upload Section */}
      {showUpload && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="glass rounded-2xl border border-white/10 p-6 backdrop-blur-xl"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-white">Upload New Document</h3>
            <button
              onClick={() => setShowUpload(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          <DocumentUpload projectId={projectId} />
        </motion.div>
      )}

      {/* Documents List */}
      <DocumentList projectId={projectId} />

      {/* Processing Status Modal */}
      {/* {selectedDocument && (
        <DocumentProcessingStatus
          documentId={selectedDocument.id}
          onClose={() => setSelectedDocument(null)}
        />
      )} */}
    </div>
  )
}
