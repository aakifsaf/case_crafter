import { useState, useEffect } from 'react'
import { documentService } from '../services/apiService'

export const useDocumentProcessing = (documentId) => {
  const [status, setStatus] = useState('idle')
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!documentId) return

    let intervalId

    const checkStatus = async () => {
      try {
        const response = await documentService.getDocumentStatus(documentId)
        const { status, progress } = response.data
        
        setStatus(status)
        setProgress(progress || 0)

        if (status === 'processing') {
          // Continue polling every 2 seconds
          intervalId = setTimeout(checkStatus, 2000)
        } else if (status === 'failed') {
          setError('Document processing failed')
        }
      } catch (err) {
        setError('Failed to check document status')
        console.error('Status check error:', err)
      }
    }

    checkStatus()

    return () => {
      if (intervalId) {
        clearTimeout(intervalId)
      }
    }
  }, [documentId])

  return { status, progress, error }
}