import { useDropzone } from 'react-dropzone'
import { useProjectStore } from '../../stores/useProjectStore'
import { DocumentArrowUpIcon } from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'

export const DocumentUpload = ({ projectId }) => {
  const { uploadDocument, loading } = useProjectStore()

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt']
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length > 0 && projectId) {
        try {
          await uploadDocument(acceptedFiles[0], projectId)
        } catch (error) {
          console.error('Upload failed:', error)
        }
      }
    }
  })

  return (
    <div className="p-6">
      <h3 className="text-lg font-medium text-white mb-6">Upload BRD Document</h3>
      
      <motion.div
        {...getRootProps()}
        whileHover={{ scale: 1.01 }}
        className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 ${
          isDragActive 
            ? 'border-blue-400 bg-blue-500/10 shadow-lg shadow-blue-500/25' 
            : 'border-white/20 hover:border-blue-400/50 hover:bg-white/5'
        } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input {...getInputProps()} disabled={loading} />
        <motion.div
          animate={isDragActive ? { y: -5 } : { y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <DocumentArrowUpIcon className="mx-auto h-16 w-16 text-blue-400 mb-4" />
        </motion.div>
        <p className="mt-2 text-lg font-medium text-white">
          {isDragActive
            ? 'Drop to analyze your document'
            : 'Drag & drop your BRD file'}
        </p>
        <p className="text-sm text-gray-300 mt-2">
          AI-powered analysis for PDF, DOCX, TXT files
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Max file size: 10MB
        </p>
        {loading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6"
          >
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto"></div>
            <p className="text-sm text-blue-300 mt-3">Processing with AI...</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
