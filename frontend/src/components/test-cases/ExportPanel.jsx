import { useState, useEffect } from 'react'
import { useProjectStore } from '../../stores/useProjectStore'
import { XMarkIcon } from '@heroicons/react/24/outline'
import AOS from 'aos'
import 'aos/dist/aos.css'

export const ExportPanel = ({ testSuites, onClose }) => {
  const { exportTestSuite, loading } = useProjectStore()
  const [selectedFormat, setSelectedFormat] = useState('excel')
  const [selectedTestSuites, setSelectedTestSuites] = useState([])
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-out-quad',
      once: true
    })
    setIsVisible(true)
    return () => setIsVisible(false)
  }, [])

  const handleExport = async () => {
    try {
      for (const suiteId of selectedTestSuites) {
        await exportTestSuite(suiteId, selectedFormat)
      }
      onClose()
    } catch (error) {
      console.error('Export failed:', error)
    }
  }

  const toggleTestSuite = (suiteId) => {
    setSelectedTestSuites(prev =>
      prev.includes(suiteId)
        ? prev.filter(id => id !== suiteId)
        : [...prev, suiteId]
    )
  }

  const selectAll = () => {
    setSelectedTestSuites(testSuites.map(suite => suite.id))
  }

  const selectNone = () => {
    setSelectedTestSuites([])
  }

  return (
    <div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center p-4">
      {/* Backdrop with glass effect */}
      <div 
        className="fixed inset-0 bg-gradient-to-br from-gray-900/80 via-blue-900/40 to-purple-900/60 backdrop-blur-md"
        onClick={onClose}
      />
      
      {/* Main modal */}
      <div 
        className="relative w-full max-w-2xl bg-gradient-to-b from-gray-900/70 to-gray-800/50 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden"
        data-aos="zoom-in"
        style={{
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)'
        }}
      >
        {/* Glowing border effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 pointer-events-none" />
        
        <div className="relative p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Export Test Suite
            </h3>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white transition-all duration-300 hover:bg-white/10 rounded-lg backdrop-blur-sm"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="space-y-8">
            {/* Format Selection */}
            <div data-aos="fade-up" data-aos-delay="100">
              <label className="block text-sm font-medium text-gray-300 mb-4 uppercase tracking-wider">
                Export Format
              </label>
              <div className="grid grid-cols-3 gap-4">
                {['excel', 'json', 'pdf'].map((format) => (
                  <button
                    key={format}
                    onClick={() => setSelectedFormat(format)}
                    className={`p-4 rounded-xl border transition-all duration-300 transform hover:scale-105 ${
                      selectedFormat === format
                        ? 'border-blue-400/50 bg-blue-500/20 shadow-lg shadow-blue-500/30'
                        : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="text-sm font-medium capitalize text-white">
                      {format}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Test Suite Selection */}
            <div data-aos="fade-up" data-aos-delay="200">
              <div className="flex justify-between items-center mb-4">
                <label className="block text-sm font-medium text-gray-300 uppercase tracking-wider">
                  Select Test Suites
                </label>
                <div className="space-x-3">
                  <button
                    onClick={selectAll}
                    className="text-sm text-blue-400 hover:text-blue-300 transition-colors duration-300"
                  >
                    Select All
                  </button>
                  <button
                    onClick={selectNone}
                    className="text-sm text-purple-400 hover:text-purple-300 transition-colors duration-300"
                  >
                    Select None
                  </button>
                </div>
              </div>
              <div className="border border-white/10 rounded-xl bg-black/20 backdrop-blur-sm max-h-60 overflow-y-auto">
                {testSuites.map((suite) => (
                  <label
                    key={suite.id}
                    className="flex items-center p-4 border-b border-white/5 last:border-b-0 hover:bg-white/5 transition-all duration-300 group"
                  >
                    <input
                      type="checkbox"
                      checked={selectedTestSuites.includes(suite.id)}
                      onChange={() => toggleTestSuite(suite.id)}
                      className="rounded border-white/30 bg-white/5 text-blue-400 focus:ring-blue-400 focus:ring-offset-gray-900"
                    />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-white group-hover:text-blue-300 transition-colors duration-300">
                        {suite.name}
                      </p>
                      <p className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                        {suite.test_cases?.length || 0} test cases • {suite.document_name}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Export Options */}
            <div data-aos="fade-up" data-aos-delay="300">
              <label className="block text-sm font-medium text-gray-300 mb-4 uppercase tracking-wider">
                Export Options
              </label>
              <div className="space-y-3">
                {[
                  'Include test steps',
                  'Include expected results',
                  'Include requirement mapping'
                ].map((option, index) => (
                  <label key={option} className="flex items-center group">
                    <input
                      type="checkbox"
                      defaultChecked={index < 2}
                      className="rounded border-white/30 bg-white/5 text-blue-400 focus:ring-blue-400 focus:ring-offset-gray-900 transition-all duration-300"
                    />
                    <span className="ml-3 text-sm text-gray-300 group-hover:text-white transition-colors duration-300">
                      {option}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-4 pt-6">
              <button
                onClick={onClose}
                className="px-6 py-3 text-sm font-medium text-gray-300 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:text-white transition-all duration-300 transform hover:scale-105"
              >
                Cancel
              </button>
              <button
                onClick={handleExport}
                disabled={selectedTestSuites.length === 0 || loading}
                className="px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50"
              >
                {loading ? (
                  <span className="flex items-center">
                    <span className="animate-pulse">Exporting...</span>
                  </span>
                ) : (
                  `Export ${selectedTestSuites.length} Suite${selectedTestSuites.length !== 1 ? 's' : ''}`
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
