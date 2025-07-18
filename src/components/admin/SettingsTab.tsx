import { MapPin } from "phosphor-react";

interface SettingsTabProps {
  // Add props as needed
}

export default function SettingsTab(_props: SettingsTabProps) {
  return (
    <div className="space-y-6">
      {/* Location Information */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-red-50 p-2 rounded-lg">
            <MapPin size={20} className="text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Location Information</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Location Name</label>
            <input
              type="text"
              defaultValue="Downtown Location"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Location Code</label>
            <input
              type="text"
              defaultValue="DT001"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
            <textarea
              rows={3}
              defaultValue="123 Main Street, Downtown District, City, State 12345"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
            <input
              type="tel"
              defaultValue="(555) 123-4567"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              defaultValue="downtown@rentagain.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>
        </div>
        
        <div className="flex justify-end mt-6">
          <button className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
