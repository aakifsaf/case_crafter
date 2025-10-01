import { useState, useEffect } from 'react'
import { useParams, Link, Routes, Route, useLocation } from 'react-router-dom'
import { useProjectStore } from '../../stores/useProjectStore'
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
  const [activeTab, setActiveTab] = useState('')

  useEffect(() => {
    const loadProject = async () => {
      await fetchProjects()
      // Find and set current project
      const project = useProjectStore.getState().projects.find(p => p.id === parseInt(projectId))
      if (project) {
        setCurrentProject(project)
      }
    }
    loadProject()
  }, [projectId, fetchProjects, setCurrentProject])

  // Determine active tab from URL
  useEffect(() => {
    const pathSegments = location.pathname.split('/')
    const currentTab = pathSegments[pathSegments.length - 1]
    setActiveTab(currentTab === projectId ? '' : currentTab)
  }, [location.pathname, projectId])

  if (loading || !currentProject) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="grid grid-cols-4 gap-4 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Project Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">{currentProject.name}</h1>
        <p className="text-gray-600 mt-2">{currentProject.description}</p>
        
        {/* Navigation Tabs */}
        <div className="mt-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {navigation.map((item) => {
              const isActive = activeTab === item.href
              const href = item.href ? `/projects/${projectId}/${item.href}` : `/projects/${projectId}`
              
              return (
                <Link
                  key={item.name}
                  to={href}
                  className={`group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                    isActive
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <item.icon
                    className={`-ml-0.5 mr-2 h-5 w-5 ${
                      isActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                    }`}
                  />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <Routes>
        <Route path="/" element={<ProjectOverview projectId={projectId} />} />
        <Route path="/documents" element={<DocumentManager projectId={projectId} />} />
        <Route path="/test-suite" element={<TestSuiteView projectId={projectId} />} />
        <Route path="/settings" element={<ProjectSettings projectId={projectId} />} />
      </Routes>
    </div>
  )
}