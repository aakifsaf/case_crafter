import { Link } from 'react-router-dom'
import { DocumentTextIcon, ChartBarIcon } from '@heroicons/react/24/outline'

export const ProjectCard = ({ project }) => {
  return (
    <Link
      to={`/projects/${project.id}`}
      className="group block relative overflow-hidden rounded-2xl bg-gradient-to-b from-gray-900 to-gray-800 border border-gray-700/50 hover:border-blue-500/30 transition-all duration-500 p-6 transform hover:-translate-y-2 hover:shadow-2xl"
      style={{
        backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)'
      }}
    >
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
      
      <div className="relative z-10">
        {/* Project Name - Increased contrast */}
        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-300 transition-colors duration-300">
          {project.name}
        </h3>
        
        {/* Description - Lighter text for better visibility */}
        <p className="text-gray-300 text-sm mb-6 line-clamp-2 group-hover:text-gray-200 transition-colors duration-300">
          {project.description || 'No description provided'}
        </p>
        
        {/* Stats - Improved contrast */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-6">
            <span className="flex items-center text-gray-200 group-hover:text-blue-300 transition-colors duration-300">
              <DocumentTextIcon className="h-4 w-4 mr-2 text-blue-400" />
              {project.document_count || 0}
            </span>
            <span className="flex items-center text-gray-200 group-hover:text-purple-300 transition-colors duration-300">
              <ChartBarIcon className="h-4 w-4 mr-2 text-purple-400" />
              {project.test_suite_count || 0}
            </span>
          </div>
          {/* Date - Better visibility */}
          <span className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
            {new Date(project.created_at).toLocaleDateString()}
          </span>
        </div>
      </div>
      
      {/* Hover effect border */}
      <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-blue-500/20 transition-all duration-500"></div>
    </Link>
  )
}