import { Plus, Car, Wrench } from "phosphor-react";

interface AdminQuickActionsProps {
  onTabChange?: (tab: string) => void;
}

export default function AdminQuickActions({ onTabChange }: AdminQuickActionsProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <button
          onClick={() => onTabChange?.('bookings')}
          className="flex items-center space-x-3 p-4 bg-red-50 hover:bg-red-100 rounded-lg border border-red-200 transition-colors"
        >
          <div className="p-2 bg-red-500 rounded-lg">
            <Plus size={20} className="text-white" />
          </div>
          <div className="text-left">
            <p className="font-medium text-gray-900">New Booking</p>
            <p className="text-sm text-gray-600">Create reservation</p>
          </div>
        </button>

        <button
          onClick={() => onTabChange?.('fleet')}
          className="flex items-center space-x-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors"
        >
          <div className="p-2 bg-blue-500 rounded-lg">
            <Car size={20} className="text-white" />
          </div>
          <div className="text-left">
            <p className="font-medium text-gray-900">Fleet Status</p>
            <p className="text-sm text-gray-600">View vehicles</p>
          </div>
        </button>

        <button
          onClick={() => onTabChange?.('maintenance')}
          className="flex items-center space-x-3 p-4 bg-orange-50 hover:bg-orange-100 rounded-lg border border-orange-200 transition-colors"
        >
          <div className="p-2 bg-orange-500 rounded-lg">
            <Wrench size={20} className="text-white" />
          </div>
          <div className="text-left">
            <p className="font-medium text-gray-900">Maintenance</p>
            <p className="text-sm text-gray-600">Schedule service</p>
          </div>
        </button>
      </div>
    </div>
  );
}
