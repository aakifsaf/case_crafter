import { useEffect } from 'react'
import { useProjectStore } from '../../stores/useProjectStore'
import { DocumentProcessingStatus } from './DocumentProcessingStatus'
import { DocumentTextIcon } from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'

export const DocumentList = ({ projectId }) => {
  const { documents, fetchDocuments, loading, generateTestCases } = useProjectStore()

  useEffect(() => {
    if (projectId) {
      fetchDocuments(projectId)
    }
  }, [projectId, fetchDocuments])

  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass rounded-2xl border border-white/10 p-6 backdrop-blur-xl"
      >
        <div className="animate-pulse">
          <div className="h-6 bg-white/20 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-white/10 rounded-xl"></div>
            ))}
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="glass rounded-2xl border border-white/10 p-6 backdrop-blur-xl"
    >
      <h3 className="text-xl font-semibold text-white mb-6">Analyzed Documents</h3>
      
      {documents.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-blue-400 text-6xl mb-4">📄</div>
          <p className="text-gray-300">No documents analyzed yet</p>
          <p className="text-gray-400 text-sm mt-2">Upload your first BRD to get started</p>
        </div>
      ) : (
        <div className="space-y-4">
          {documents.map((document, index) => (
            <motion.div
              key={document.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-5 glass border border-white/5 rounded-xl hover:border-blue-400/30 transition-all duration-300 group"
            >
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-lg bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors">
                  <DocumentTextIcon className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-white group-hover:text-blue-300 transition-colors">
                    {document.filename}
                  </h4>
                  <p className="text-xs text-gray-400">
                    Analyzed {new Date(document.uploaded_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                {/* <DocumentProcessingStatus documentId={document.id} /> */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => generateTestCases(document.id)}
                  className="px-4 py-2 text-sm font-medium rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
                >
                  Generate Tests
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  )
}
