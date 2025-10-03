import { useState, useEffect } from 'react'
import { useParams, Link, Routes, Route, useLocation } from 'react-router-dom'
import { useProjectStore } from '../../stores/useProjectStore'
import { useAuthStore } from '../../stores/useAuthStore'
import { DocumentManager } from '../documents/DocumentManager'
import { TestSuiteView } from '../test-cases/TestSuiteView'
import { ProjectOverview } from './ProjectOverview'
import { ProjectSettings } from './ProjectSettings'
import {
  DocumentTextIcon,
  ChartBarIcon,
  FolderIcon,
  CogIcon
} from '@heroicons/react/24/outline'
import { motion, AnimatePresence } from 'framer-motion'

const navigation = [
  { name: 'Overview', href: '', icon: FolderIcon },
  { name: 'Documents', href: 'documents', icon: DocumentTextIcon },
  { name: 'Test Suite', href: 'test-suite', icon: ChartBarIcon },
  { name: 'Settings', href: 'settings', icon: CogIcon },
]

export const ProjectDetail = () => {
  const { projectId } = useParams()
  const location = useLocation()
  const { currentProject, fetchProjects, setCurrentProject, loading } = useProjectStore()
  const { user } = useAuthStore()
  const [activeTab, setActiveTab] = useState('')

  useEffect(() => {
    const loadProject = async (user_id) => {
      await fetchProjects(user_id)
      const project = useProjectStore.getState().projects.find(p => p.id === parseInt(projectId))
      console.log('Loaded project:', project)
      if (project) {
        setCurrentProject(project)
        console.log('Current project set to:', currentProject)
      }
    }
    loadProject(user.id)
  }, [projectId, fetchProjects, setCurrentProject])

  useEffect(() => {
    const pathSegments = location.pathname.split('/')
    const currentTab = pathSegments[pathSegments.length - 1]
    setActiveTab(currentTab === projectId ? '' : currentTab)
  }, [location.pathname, projectId])

  if ( !currentProject) {
    return (
      <div className="max-w-7xl mx-auto px-4">
        <div className="animate-pulse">
          <div className="h-12 bg-gradient-to-r from-gray-800 to-gray-700 rounded-xl w-1/3 mb-6"></div>
          <div className="h-6 bg-gradient-to-r from-gray-800 to-gray-700 rounded-xl w-1/2 mb-12"></div>
          <div className="grid grid-cols-4 gap-6 mb-12">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 bg-gradient-to-r from-gray-800 to-gray-700 rounded-2xl"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4">
      {/* Project Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          {currentProject.name}
        </h1>
        <p className="text-gray-300 mt-4 text-lg max-w-2xl">{currentProject.description}</p>
        
        {/* Navigation Tabs */}
        <div className="mt-10 border-b border-gray-700/50">
          <nav className="-mb-px flex space-x-8">
            {navigation.map((item) => {
              const isActive = activeTab === item.href
              const href = item.href ? `/projects/${projectId}/${item.href}` : `/projects/${projectId}`
              
              return (
                <Link
                  key={item.name}
                  to={href}
                  className={`group relative inline-flex items-center py-4 px-1 font-medium text-sm transition-all duration-300 ${
                    isActive
                      ? 'text-cyan-400'
                      : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-b-2 border-cyan-400"
                      transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                    />
                  )}
                  <div className="relative z-10 flex items-center">
                    <item.icon
                      className={`mr-3 h-5 w-5 transition-all duration-300 ${
                        isActive 
                          ? 'text-cyan-400' 
                          : 'text-gray-500 group-hover:text-gray-300'
                      }`}
                    />
                    {item.name}
                  </div>
                </Link>
              )
            })}
          </nav>
        </div>
      </motion.div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Routes>
            <Route path="/" element={<ProjectOverview projectId={projectId} />} />
            <Route path="/documents" element={<DocumentManager projectId={projectId} />} />
            <Route path="/test-suite" element={<TestSuiteView projectId={projectId} />} />
            <Route path="/settings" element={<ProjectSettings projectId={projectId} />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
