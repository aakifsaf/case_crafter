import { useState, useEffect } from 'react'
import { useProjectStore } from '../../stores/useProjectStore'
import { DocumentUpload } from './DocumentUpload'
import { DocumentList } from './DocumentList'
import { DocumentProcessingStatus } from './DocumentProcessingStatus'
import { ArrowUpTrayIcon, DocumentTextIcon, XMarkIcon } from '@heroicons/react/24/outline'


export const DocumentManager = ({ projectId }) => {
  const { documents, fetchDocuments, loading } = useProjectStore()
  const [showUpload, setShowUpload] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState(null)

  useEffect(() => {
    if (projectId) {
      fetchDocuments(projectId)
    }
  }, [projectId, fetchDocuments])

  const handleGenerateTests = async (documentId) => {
    try {
      const { generateTestCases } = useProjectStore.getState()
      await generateTestCases(documentId)
      // Show success message or redirect to test suite
    } catch (error) {
      console.error('Failed to generate tests:', error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Document Management</h2>
          <p className="text-gray-600 mt-2">
            Upload and manage your Business Requirements Documents (BRDs)
          </p>
        </div>
        <button
          onClick={() => setShowUpload(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
        >
          <ArrowUpTrayIcon className="h-4 w-4 mr-2" />
          Upload Document
        </button>
      </div>

      {/* Upload Section */}
      {showUpload && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Upload New Document</h3>
            <button
              onClick={() => setShowUpload(false)}
              className="text-gray-400 hover:text-gray-500"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
          <DocumentUpload projectId={projectId} />
        </div>
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