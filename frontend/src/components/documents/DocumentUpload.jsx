import { useDropzone } from 'react-dropzone'
import { useProjectStore } from '../../stores/useProjectStore'
import { DocumentArrowUpIcon } from '@heroicons/react/24/outline'

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
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Upload BRD Document</h3>
      
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive 
            ? 'border-blue-400 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input {...getInputProps()} disabled={loading} />
        <DocumentArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">
          {isDragActive
            ? 'Drop the BRD file here...'
            : 'Drag & drop a BRD file, or click to select'}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          PDF, DOCX, TXT up to 10MB
        </p>
        {loading && (
          <div className="mt-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-sm text-gray-500 mt-2">Uploading...</p>
          </div>
        )}
      </div>
    </div>
  )
}