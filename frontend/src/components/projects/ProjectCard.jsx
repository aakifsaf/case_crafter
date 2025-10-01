import { Link } from 'react-router-dom'
import { DocumentTextIcon, ChartBarIcon } from '@heroicons/react/24/outline'

export const ProjectCard = ({ project }) => {
  return (
    <Link
      to={`/projects/${project.id}`}
      className="block bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow p-6"
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {project.name}
      </h3>
      <p className="text-gray-600 text-sm mb-4">
        {project.description || 'No description'}
      </p>
      
      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center space-x-4">
          <span className="flex items-center">
            <DocumentTextIcon className="h-4 w-4 mr-1" />
            {project.document_count || 0} documents
          </span>
          <span className="flex items-center">
            <ChartBarIcon className="h-4 w-4 mr-1" />
            {project.test_suite_count || 0} test suites
          </span>
        </div>
        <span>
          {new Date(project.created_at).toLocaleDateString()}
        </span>
      </div>
    </Link>
  )
}