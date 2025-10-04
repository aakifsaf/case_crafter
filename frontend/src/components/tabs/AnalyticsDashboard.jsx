import { useState, useEffect } from 'react'
import { useAnalyticsStore } from '../../stores/useAnalyticsStore'
import { 
  ChartBarIcon, 
  DocumentTextIcon, 
  CheckCircleIcon,
  ClockIcon 
} from '@heroicons/react/24/outline'

export const AnalyticsDashboard = () => {
  const { analytics, loading, fetchAnalytics } = useAnalyticsStore()
  const [timeRange, setTimeRange] = useState('30d') // 7d, 30d, 90d, 1y

  useEffect(() => {
    fetchAnalytics(timeRange)
  }, [fetchAnalytics, timeRange])

  const stats = [
    {
      name: 'Total Projects',
      value: analytics?.total_projects || 0,
      icon: ChartBarIcon,
      color: 'blue'
    },
    {
      name: 'Documents Analyzed',
      value: analytics?.documents_analyzed || 0,
      icon: DocumentTextIcon,
      color: 'green'
    },
    {
      name: 'Test Cases Generated',
      value: analytics?.test_cases_generated || 0,
      icon: CheckCircleIcon,
      color: 'purple'
    },
    {
      name: 'Avg Processing Time',
      value: analytics?.avg_processing_time ? `${analytics.avg_processing_time}s` : '0s',
      icon: ClockIcon,
      color: 'yellow'
    }
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Analytics</h1>
          <p className="text-gray-400 mt-2">Insights and metrics across all your projects</p>
        </div>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
          <option value="1y">Last year</option>
        </select>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">{stat.name}</p>
                <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg bg-${stat.color}-500/10`}>
                <stat.icon className={`h-6 w-6 text-${stat.color}-400`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Projects Chart */}
        <div className="bg-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Projects Overview</h3>
          <div className="h-64 bg-gray-700 rounded-lg flex items-center justify-center">
            <p className="text-gray-400">Projects chart will be displayed here</p>
          </div>
        </div>

        {/* Test Cases Chart */}
        <div className="bg-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Test Cases by Type</h3>
          <div className="h-64 bg-gray-700 rounded-lg flex items-center justify-center">
            <p className="text-gray-400">Test cases chart will be displayed here</p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-gray-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {analytics?.recent_activity?.map((activity, index) => (
            <div key={index} className="flex items-center gap-4 py-3 border-b border-gray-700 last:border-0">
              <div className={`p-2 rounded-lg ${
                activity.type === 'upload' ? 'bg-blue-500/10' :
                activity.type === 'generate' ? 'bg-green-500/10' :
                'bg-purple-500/10'
              }`}>
                {activity.type === 'upload' && <DocumentTextIcon className="h-5 w-5 text-blue-400" />}
                {activity.type === 'generate' && <CheckCircleIcon className="h-5 w-5 text-green-400" />}
              </div>
              <div className="flex-1">
                <p className="text-white text-sm">{activity.description}</p>
                <p className="text-gray-400 text-xs">{activity.timestamp}</p>
              </div>
              <span className="text-gray-400 text-sm">{activity.project_name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}