import { useEffect, useState } from 'react'
import { useDocumentProcessing } from '../../hooks/useDocumentProcessing'
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  ClockIcon 
} from '@heroicons/react/24/outline'

export const DocumentProcessingStatus = ({ documentId, onClose }) => {
  const { status, progress, error } = useDocumentProcessing(documentId)
  const [show, setShow] = useState(true)

  useEffect(() => {
    if (status === 'completed' || status === 'failed') {
      const timer = setTimeout(() => {
        setShow(false)
        onClose?.()
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [status, onClose])

  if (!show) return null

  const getStatusIcon = () => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="h-6 w-6 text-green-500" />
      case 'failed':
        return <XCircleIcon className="h-6 w-6 text-red-500" />
      case 'processing':
        return <ClockIcon className="h-6 w-6 text-blue-500 animate-pulse" />
      default:
        return <ClockIcon className="h-6 w-6 text-gray-500" />
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case 'completed':
        return 'bg-green-50 border-green-200'
      case 'failed':
        return 'bg-red-50 border-red-200'
      case 'processing':
        return 'bg-blue-50 border-blue-200'
      default:
        return 'bg-gray-50 border-gray-200'
    }
  }

  return (
    <div className={`fixed top-4 right-4 max-w-sm w-full rounded-lg border p-4 shadow-lg ${getStatusColor()}`}>
      <div className="flex items-start">
        {getStatusIcon()}
        <div className="ml-3 flex-1">
          <p className="text-sm font-medium text-gray-900">
            {status === 'processing' && 'Processing Document'}
            {status === 'completed' && 'Document Processed'}
            {status === 'failed' && 'Processing Failed'}
          </p>
          <p className="mt-1 text-sm text-gray-600">
            {status === 'processing' && `Extracting requirements... ${progress}%`}
            {status === 'completed' && 'Requirements extracted successfully'}
            {status === 'failed' && error}
          </p>
          {status === 'processing' && (
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>
        <button
          onClick={() => {
            setShow(false)
            onClose?.()
          }}
          className="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-500"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}