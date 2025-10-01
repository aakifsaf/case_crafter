export const TraceabilityGraph = ({ matrix }) => {
  if (!matrix) {
    return <div className="text-gray-500 text-center py-8">No data available</div>
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Requirement
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Linked Test Cases
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {matrix.requirements.map((requirement) => (
            <tr key={requirement.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {requirement.original_text.substring(0, 100)}...
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {requirement.test_cases?.length || 0} test cases
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  requirement.test_cases?.length > 0
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {requirement.test_cases?.length > 0 ? 'Covered' : 'Not Covered'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}