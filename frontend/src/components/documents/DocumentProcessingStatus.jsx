import { useEffect, useState } from 'react'
import { useDocumentProcessing } from '../../hooks/useDocumentProcessing'
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  ClockIcon 
} from '@heroicons/react/24/outline'
import { motion, AnimatePresence } from 'framer-motion'

export const DocumentProcessingStatus = ({ documentId, onClose }) => {
  const { status, progress, error } = useDocumentProcessing(documentId)
  const [show, setShow] = useState(true)

  useEffect(() => {
    if (status === 'completed' || status === 'failed') {
      const timer = setTimeout(() => {
        setShow(false)
        onClose?.()
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [status, onClose])

  const getStatusIcon = () => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="h-6 w-6 text-green-400" />
      case 'failed':
        return <XCircleIcon className="h-6 w-6 text-red-400" />
      case 'processing':
        return <ClockIcon className="h-6 w-6 text-blue-400 animate-pulse" />
      default:
        return <ClockIcon className="h-6 w-6 text-gray-400" />
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case 'completed':
        return 'bg-green-900/20 border-green-500/30'
      case 'failed':
        return 'bg-red-900/20 border-red-500/30'
      case 'processing':
        return 'bg-blue-900/20 border-blue-500/30'
      default:
        return 'bg-gray-900/20 border-gray-500/30'
    }
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          transition={{ duration: 0.3 }}
          className={`fixed top-6 right-6 max-w-sm w-full rounded-xl border p-4 shadow-2xl backdrop-blur-xl ${getStatusColor()}`}
        >
          <div className="flex items-start">
            <div className="p-2 rounded-full bg-white/5">
              {getStatusIcon()}
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-white">
                {status === 'processing' && 'AI Analysis in Progress'}
                {status === 'completed' && 'Analysis Complete'}
                {status === 'failed' && 'Processing Error'}
              </p>
              <p className="mt-1 text-sm text-gray-200">
                {status === 'processing' && `Extracting requirements... ${progress}%`}
                {status === 'completed' && 'Document successfully processed by AI'}
                {status === 'failed' && error}
              </p>
              {status === 'processing' && (
                <div className="mt-3 w-full bg-white/10 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                    className="bg-gradient-to-r from-blue-400 to-purple-500 h-2 rounded-full transition-all duration-300"
                  />
                </div>
              )}
            </div>
            <button
              onClick={() => {
                setShow(false)
                onClose?.()
              }}
              className="ml-4 flex-shrink-0 text-gray-400 hover:text-white transition-colors"
            >
              <XCircleIcon className="h-5 w-5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
