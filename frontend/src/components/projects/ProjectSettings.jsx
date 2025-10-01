export const ProjectSettings = ({ projectId }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Project Settings</h2>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Project Information</h3>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Project Name</label>
              <input
                type="text"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                defaultValue="My Project"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                rows={3}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                defaultValue="Project description"
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Export Settings</h3>
          <div className="space-y-2">
            <label className="flex items-center">
              <input type="checkbox" className="rounded border-gray-300 text-blue-600" defaultChecked />
              <span className="ml-2 text-sm text-gray-700">Include test steps in export</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="rounded border-gray-300 text-blue-600" defaultChecked />
              <span className="ml-2 text-sm text-gray-700">Include expected results</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="rounded border-gray-300 text-blue-600" />
              <span className="ml-2 text-sm text-gray-700">Include test data</span>
            </label>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
            Cancel
          </button>
          <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}