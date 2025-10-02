import { useState, useEffect } from 'react'
import { useProjectStore } from '../../stores/useProjectStore'
import { DocumentUpload } from './DocumentUpload'
import { DocumentList } from './DocumentList'
import { DocumentProcessingStatus } from './DocumentProcessingStatus'
import { ArrowUpTrayIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'

export const DocumentManager = ({ projectId }) => {
  const { documents, fetchDocuments, loading } = useProjectStore()
  const [showUpload, setShowUpload] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState(null)

  useEffect(() => {
    if (projectId) {
      fetchDocuments(projectId)
    }
  }, [projectId, fetchDocuments])

  return (
    <div className="space-y-8">
      {/* Header */}
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
      {selectedDocument && (
        <DocumentProcessingStatus
          documentId={selectedDocument.id}
          onClose={() => setSelectedDocument(null)}
        />
      )}
    </div>
  )
}
