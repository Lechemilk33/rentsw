import { Plus, ChartLineUp, Bank, ArrowRight } from "phosphor-react";

interface QuickActionsProps {
  onShowLocationWizard: () => void;
  onTabChange?: (tab: string) => void;
}

export default function QuickActions({ onShowLocationWizard, onTabChange }: QuickActionsProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
        <div className="text-sm text-gray-500">Enterprise Operations</div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={onShowLocationWizard}
          className="flex items-center justify-between p-4 border-2 border-dashed border-amber-300 rounded-lg hover:border-amber-400 hover:bg-amber-50 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Plus size={20} className="text-amber-600" />
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900">Add New Location</p>
              <p className="text-sm text-gray-600">Launch location creation wizard</p>
            </div>
          </div>
          <ArrowRight size={16} className="text-amber-600" />
        </button>

        <button
          onClick={() => onTabChange?.('analytics')}
          className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <ChartLineUp size={20} className="text-blue-600" />
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900">Corporate Analytics</p>
              <p className="text-sm text-gray-600">Cross-location insights</p>
            </div>
          </div>
          <ArrowRight size={16} className="text-blue-600" />
        </button>

        <button
          onClick={() => onTabChange?.('financial')}
          className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Bank size={20} className="text-green-600" />
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900">Financial Center</p>
              <p className="text-sm text-gray-600">Consolidated reporting</p>
            </div>
          </div>
          <ArrowRight size={16} className="text-green-600" />
        </button>
      </div>
    </div>
  );
}
