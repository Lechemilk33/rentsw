import { Crown, ArrowRight } from "phosphor-react";

interface OwnerHeaderProps {
  user: {
    id: string;
    email: string;
    user_metadata: { full_name: string };
    app_metadata: { role: string };
  };
  onBackToOperations: () => void;
  onSignOut: () => void;
}

export default function OwnerHeader({ user, onBackToOperations, onSignOut }: OwnerHeaderProps) {
  return (
    <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-amber-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg">
                <Crown size={24} weight="fill" className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Owner Portal</h1>
                <p className="text-sm text-gray-600">Enterprise Fleet Management</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={onBackToOperations}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              <ArrowRight size={16} className="rotate-180" />
              <span>Back to Operations</span>
            </button>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{user?.user_metadata?.full_name || 'Owner'}</p>
              <p className="text-xs text-amber-600 font-medium flex items-center">
                <Crown size={12} weight="fill" className="mr-1" />
                Organization Owner
              </p>
            </div>
            <button
              onClick={onSignOut}
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
