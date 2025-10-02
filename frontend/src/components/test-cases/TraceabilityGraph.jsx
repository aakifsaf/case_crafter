import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  CheckBadgeIcon, 
  XCircleIcon, 
  DocumentTextIcon,
  ArrowPathIcon 
} from '@heroicons/react/24/outline'

export const TraceabilityGraph = ({ matrix }) => {
  const [isVisible, setIsVisible] = useState(false)
  const [hoveredCard, setHoveredCard] = useState(null)

  useEffect(() => {
    setIsVisible(true)
    return () => setIsVisible(false)
  }, [])

  if (!matrix) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl mb-4">
            <DocumentTextIcon className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-300 mb-2">No data available</h3>
          <p className="text-gray-400">Upload requirements to generate traceability matrix</p>
        </div>
      </div>
    )
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-6"
    >
      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        <AnimatePresence>
          {matrix.requirements.map((requirement, index) => (
            <motion.div
              key={requirement.id}
              variants={itemVariants}
              whileHover={{ 
                y: -4,
                transition: { duration: 0.2 }
              }}
              onHoverStart={() => setHoveredCard(requirement.id)}
              onHoverEnd={() => setHoveredCard(null)}
              className="relative group"
            >
              <div className={`
                relative overflow-hidden rounded-2xl p-6 backdrop-blur-xl
                bg-gradient-to-br from-gray-800/70 to-gray-900/70
                border border-gray-700/50 shadow-2xl
                transition-all duration-300
                ${hoveredCard === requirement.id 
                  ? 'border-cyan-400/30 shadow-cyan-400/10' 
                  : 'hover:border-cyan-400/20'
                }
              `}>
                {/* Glow effect */}
                <div className={`
                  absolute inset-0 bg-gradient-to-br from-cyan-400/5 to-purple-600/5
                  transition-opacity duration-300
                  ${hoveredCard === requirement.id ? 'opacity-100' : 'opacity-0'}
                `} />
                
                {/* Content */}
                <div className="relative z-10">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
                        {requirement.original_text.substring(0, 80)}
                        {requirement.original_text.length > 80 ? '...' : ''}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <div className={`
                          inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                          transition-all duration-200
                          ${requirement.test_cases?.length > 0
                            ? 'bg-emerald-400/10 text-emerald-400 ring-1 ring-emerald-400/20'
                            : 'bg-rose-400/10 text-rose-400 ring-1 ring-rose-400/20'
                          }
                        `}>
                          {requirement.test_cases?.length > 0 ? (
                            <>
                              <CheckBadgeIcon className="w-4 h-4 mr-1" />
                              Covered
                            </>
                          ) : (
                            <>
                              <XCircleIcon className="w-4 h-4 mr-1" />
                              Not Covered
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className={`
                      flex items-center justify-center w-12 h-12 rounded-xl
                      transition-all duration-300
                      ${requirement.test_cases?.length > 0
                        ? 'bg-emerald-400/10 text-emerald-400'
                        : 'bg-rose-400/10 text-rose-400'
                      }
                      ${hoveredCard === requirement.id 
                        ? 'scale-110' 
                        : 'scale-100'
                      }
                    `}>
                      {requirement.test_cases?.length > 0 ? (
                        <CheckBadgeIcon className="w-6 h-6" />
                      ) : (
                        <XCircleIcon className="w-6 h-6" />
                      )}
                    </div>
                  </div>

                  {/* Test cases count */}
                  <div className="flex items-center justify-between mt-6">
                    <div className="flex items-center space-x-2 text-gray-400">
                      <DocumentTextIcon className="w-4 h-4" />
                      <span className="text-sm">
                        {requirement.test_cases?.length || 0} test cases
                      </span>
                    </div>
                    {requirement.test_cases?.length > 0 && (
                      <motion.div
                        whileHover={{ rotate: 180 }}
                        transition={{ duration: 0.3 }}
                        className="p-2 text-cyan-400/60 hover:text-cyan-400 transition-colors"
                      >
                        <ArrowPathIcon className="w-4 h-4" />
                      </motion.div>
                    )}
                  </div>

                  {/* Progress bar */}
                  {requirement.test_cases?.length > 0 && (
                    <div className="mt-4">
                      <div className="w-full bg-gray-700/50 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-cyan-400 to-purple-500 h-2 rounded-full transition-all duration-1000"
                          style={{ 
                            width: `${Math.min((requirement.test_cases.length / 10) * 100, 100)}%` 
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Summary card */}
      <motion.div
        variants={itemVariants}
        className="rounded-2xl p-6 backdrop-blur-xl
                 bg-gradient-to-br from-gray-800/70 to-gray-900/70
                 border border-gray-700/50 shadow-2xl"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">
              {matrix.requirements.length}
            </div>
            <div className="text-sm text-gray-400">Total Requirements</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-emerald-400 mb-2">
              {matrix.requirements.filter(r => r.test_cases?.length > 0).length}
            </div>
            <div className="text-sm text-gray-400">Covered</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-rose-400 mb-2">
              {matrix.requirements.filter(r => !r.test_cases?.length).length}
            </div>
            <div className="text-sm text-gray-400">Not Covered</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-cyan-400 mb-2">
              {Math.round((matrix.requirements.filter(r => r.test_cases?.length > 0).length / matrix.requirements.length) * 100)}%
            </div>
            <div className="text-sm text-gray-400">Coverage Rate</div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
