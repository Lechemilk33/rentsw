import { Car, CheckCircle, XCircle, Wrench, Eye, Plus, Activity } from "phosphor-react";

interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  license_plate: string;
  status: 'available' | 'rented' | 'maintenance' | 'out_of_service';
  mileage: number;
  fuel_level: number;
  location: string;
  current_booking?: string;
  last_service: string;
}

interface FleetOperationsTabProps {
  // Add props as needed
}

export default function FleetOperationsTab(_props: FleetOperationsTabProps) {
  const vehicles: Vehicle[] = [
    {
      id: '1',
      make: 'Toyota',
      model: 'Camry',
      year: 2023,
      license_plate: 'ABC-123',
      status: 'available',
      mileage: 15420,
      fuel_level: 85,
      location: 'Lot A',
      last_service: '2024-01-15'
    },
    {
      id: '2',
      make: 'Honda',
      model: 'Civic',
      year: 2022,
      license_plate: 'DEF-456',
      status: 'rented',
      mileage: 22150,
      fuel_level: 60,
      location: 'Customer',
      current_booking: 'BK-2024-001',
      last_service: '2024-01-10'
    },
    {
      id: '3',
      make: 'Nissan',
      model: 'Altima',
      year: 2023,
      license_plate: 'GHI-789',
      status: 'maintenance',
      mileage: 18900,
      fuel_level: 40,
      location: 'Service Bay',
      last_service: '2024-01-05'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'text-green-600 bg-green-50';
      case 'rented': return 'text-blue-600 bg-blue-50';
      case 'maintenance': return 'text-yellow-600 bg-yellow-50';
      case 'out_of_service': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available': return <CheckCircle size={16} className="text-green-600" />;
      case 'rented': return <Activity size={16} className="text-blue-600" />;
      case 'maintenance': return <Wrench size={16} className="text-yellow-600" />;
      case 'out_of_service': return <XCircle size={16} className="text-red-600" />;
      default: return <Activity size={16} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Fleet Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Vehicles</p>
              <p className="text-2xl font-bold text-gray-900">24</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <Car size={24} className="text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Available</p>
              <p className="text-2xl font-bold text-green-600">18</p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <CheckCircle size={24} className="text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Currently Rented</p>
              <p className="text-2xl font-bold text-blue-600">4</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <Activity size={24} className="text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">In Maintenance</p>
              <p className="text-2xl font-bold text-yellow-600">2</p>
            </div>
            <div className="bg-yellow-50 p-3 rounded-lg">
              <Wrench size={24} className="text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Fleet Management */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Fleet Vehicles</h3>
            <div className="flex items-center space-x-3">
              <button className="text-sm text-gray-600 hover:text-gray-900 flex items-center space-x-2">
                <Eye size={16} />
                <span>View Map</span>
              </button>
              <button className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 flex items-center space-x-2">
                <Plus size={16} />
                <span>Add Vehicle</span>
              </button>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Vehicle</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Location</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Mileage</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Fuel</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Last Service</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {vehicles.map((vehicle) => (
                  <tr key={vehicle.id} className="border-b border-gray-100">
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium text-gray-900">
                          {vehicle.year} {vehicle.make} {vehicle.model}
                        </p>
                        <p className="text-sm text-gray-600">{vehicle.license_plate}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(vehicle.status)}
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(vehicle.status)}`}>
                          {vehicle.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-900">
                      {vehicle.location}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-900">
                      {vehicle.mileage.toLocaleString()} mi
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              vehicle.fuel_level > 50 ? 'bg-green-500' : 
                              vehicle.fuel_level > 25 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${vehicle.fuel_level}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600">{vehicle.fuel_level}%</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">
                      {vehicle.last_service}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                          Details
                        </button>
                        <button className="text-sm text-green-600 hover:text-green-700 font-medium">
                          Service
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Fleet Activities</h3>
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <div className="bg-green-50 p-2 rounded-lg">
              <CheckCircle size={16} className="text-green-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Vehicle ABC-123 returned</p>
              <p className="text-sm text-gray-600">2023 Toyota Camry checked in with 15,420 miles • 1 hour ago</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="bg-yellow-50 p-2 rounded-lg">
              <Wrench size={16} className="text-yellow-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Maintenance completed</p>
              <p className="text-sm text-gray-600">GHI-789 oil change and inspection finished • 2 hours ago</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="bg-blue-50 p-2 rounded-lg">
              <Activity size={16} className="text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Vehicle rented</p>
              <p className="text-sm text-gray-600">DEF-456 rented to customer John Smith • 3 hours ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
