import { useEffect } from 'react'
import { useProjectStore } from '../../stores/useProjectStore'
import { DocumentProcessingStatus } from './DocumentProcessingStatus'

export const DocumentList = ({ projectId }) => {
  const { documents, fetchDocuments, loading } = useProjectStore()

  useEffect(() => {
    if (projectId) {
      fetchDocuments(projectId)
    }
  }, [projectId, fetchDocuments])

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Documents</h3>
      
      {documents.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No documents uploaded yet</p>
      ) : (
        <div className="space-y-4">
          {documents.map((document) => (
            <div
              key={document.id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <DocumentTextIcon className="h-8 w-8 text-gray-400" />
                <div>
                  <h4 className="text-sm font-medium text-gray-900">
                    {document.filename}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {new Date(document.uploaded_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <DocumentProcessingStatus documentId={document.id} />
                <button
                  onClick={() => {/* Generate tests */}}
                  className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Generate Tests
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}