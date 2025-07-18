import { Plus, MapPin, Eye, CheckCircle, Activity, XCircle } from "phosphor-react";

interface Location {
  id: string;
  name: string;
  address: string;
  status: 'active' | 'inactive' | 'setup' | 'suspended';
  fleet_count: number;
  monthly_revenue: number;
  utilization_rate: number;
  admin_name: string;
  created_at: string;
  phone: string;
  email: string;
}

interface LocationPortfolioProps {
  locations: Location[];
  onShowLocationWizard: () => void;
}

export default function LocationPortfolio({ locations, onShowLocationWizard }: LocationPortfolioProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-50';
      case 'setup': return 'text-blue-600 bg-blue-50';
      case 'suspended': return 'text-red-600 bg-red-50';
      case 'inactive': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle size={16} weight="fill" className="text-green-600" />;
      case 'setup': return <Activity size={16} weight="fill" className="text-blue-600" />;
      case 'suspended': return <XCircle size={16} weight="fill" className="text-red-600" />;
      case 'inactive': return <XCircle size={16} weight="fill" className="text-gray-600" />;
      default: return <Activity size={16} />;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Location Portfolio</h2>
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-500">{locations.length} locations</span>
            <button
              onClick={onShowLocationWizard}
              className="bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-700 flex items-center space-x-2"
            >
              <Plus size={16} />
              <span>Add Location</span>
            </button>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {locations.map((location) => (
            <div key={location.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900">{location.name}</h3>
                  <p className="text-sm text-gray-600 flex items-center mt-1">
                    <MapPin size={14} className="mr-1" />
                    {location.address}
                  </p>
                </div>
                <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(location.status)}`}>
                  {getStatusIcon(location.status)}
                  <span className="capitalize">{location.status}</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Fleet Size</span>
                  <span className="font-medium">{location.fleet_count} vehicles</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Monthly Revenue</span>
                  <span className="font-medium text-green-600">${location.monthly_revenue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Utilization</span>
                  <span className="font-medium">{location.utilization_rate}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Location Admin</span>
                  <span className="font-medium">{location.admin_name}</span>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between">
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center">
                  <Eye size={14} className="mr-1" />
                  View Details
                </button>
                <button className="text-sm text-gray-600 hover:text-gray-700 font-medium">
                  Configure
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
