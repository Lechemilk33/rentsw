import { Shield, ArrowRight } from "phosphor-react";

interface AdminHeaderProps {
  readonly onBack?: () => void;
  readonly user?: {
    readonly id: string;
    readonly email: string;
    readonly user_metadata: { readonly full_name: string };
    readonly app_metadata: { readonly role: string };
  };
  readonly locationName?: string;
  readonly onBackToOperations?: () => void;
  readonly onSignOut?: () => void;
}

export default function AdminHeader({ 
  user = {
    id: 'mock-admin',
    email: 'admin@rentagain.com',
    user_metadata: { full_name: 'Admin User' },
    app_metadata: { role: 'LOCATION_ADMIN' }
  }, 
  locationName = 'Downtown Location', 
  onBack,
  onBackToOperations, 
  onSignOut 
}: AdminHeaderProps) {
  return (
    <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-red-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-red-400 to-rose-500 rounded-lg">
                <Shield size={24} weight="fill" className="text-white" />
              </div>
              <div>
                <button
                  onClick={onBack || onBackToOperations}
                  className="text-left hover:opacity-75 transition-opacity"
                >
                  <h1 className="text-xl font-bold text-gray-900">Location Admin</h1>
                  <p className="text-sm text-gray-600 flex items-center space-x-1">
                    <span>{locationName || 'Location Management'}</span>
                    <ArrowRight size={12} className="rotate-180 opacity-60" />
                  </p>
                </button>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack || onBackToOperations}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              <ArrowRight size={16} className="rotate-180" />
              <span>Back to Operations</span>
            </button>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{user?.user_metadata?.full_name || 'Admin'}</p>
              <p className="text-xs text-red-600 font-medium flex items-center">
                <Shield size={12} weight="fill" className="mr-1" />
                Location Administrator
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
