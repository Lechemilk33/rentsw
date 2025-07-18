import { Wrench, Calendar, Clock, CheckCircle, Warning, XCircle, CurrencyDollar, Plus, Eye } from "phosphor-react";

interface MaintenanceRecord {
  id: string;
  vehicle: string;
  license_plate: string;
  service_type: string;
  scheduled_date: string;
  completed_date?: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'overdue';
  cost: number;
  technician: string;
  notes: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  next_service_due?: string;
}

interface MaintenanceManagementTabProps {
  // Add props as needed
}

export default function MaintenanceManagementTab(_props: MaintenanceManagementTabProps) {
  const maintenanceRecords: MaintenanceRecord[] = [
    {
      id: '1',
      vehicle: '2023 Toyota Camry',
      license_plate: 'ABC-123',
      service_type: 'Oil Change & Inspection',
      scheduled_date: '2024-01-22',
      status: 'scheduled',
      cost: 120.00,
      technician: 'Mike Rodriguez',
      notes: 'Regular maintenance - 15k miles',
      priority: 'medium',
      next_service_due: '2024-04-22'
    },
    {
      id: '2',
      vehicle: '2022 Honda Civic',
      license_plate: 'DEF-456',
      service_type: 'Brake Pad Replacement',
      scheduled_date: '2024-01-20',
      completed_date: '2024-01-20',
      status: 'completed',
      cost: 350.00,
      technician: 'Sarah Johnson',
      notes: 'Front brake pads replaced, rotors resurfaced',
      priority: 'high',
      next_service_due: '2024-07-20'
    },
    {
      id: '3',
      vehicle: '2023 Nissan Altima',
      license_plate: 'GHI-789',
      service_type: 'Tire Rotation',
      scheduled_date: '2024-01-19',
      status: 'overdue',
      cost: 75.00,
      technician: 'Tom Wilson',
      notes: 'Regular tire maintenance',
      priority: 'low'
    },
    {
      id: '4',
      vehicle: '2021 Ford Escape',
      license_plate: 'JKL-012',
      service_type: 'Engine Diagnostics',
      scheduled_date: '2024-01-21',
      status: 'in_progress',
      cost: 180.00,
      technician: 'Mike Rodriguez',
      notes: 'Check engine light - customer reported',
      priority: 'critical'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'text-blue-600 bg-blue-50';
      case 'in_progress': return 'text-yellow-600 bg-yellow-50';
      case 'completed': return 'text-green-600 bg-green-50';
      case 'overdue': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled': return <Clock size={16} className="text-blue-600" />;
      case 'in_progress': return <Wrench size={16} className="text-yellow-600" />;
      case 'completed': return <CheckCircle size={16} className="text-green-600" />;
      case 'overdue': return <XCircle size={16} className="text-red-600" />;
      default: return <Clock size={16} />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'text-gray-600 bg-gray-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'high': return 'text-orange-600 bg-orange-50';
      case 'critical': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Maintenance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Scheduled Services</p>
              <p className="text-2xl font-bold text-blue-600">8</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <Calendar size={24} className="text-blue-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">Next 7 days</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-yellow-600">3</p>
            </div>
            <div className="bg-yellow-50 p-3 rounded-lg">
              <Wrench size={24} className="text-yellow-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">Currently servicing</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Overdue</p>
              <p className="text-2xl font-bold text-red-600">2</p>
            </div>
            <div className="bg-red-50 p-3 rounded-lg">
              <Warning size={24} className="text-red-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">Requires attention</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Monthly Cost</p>
              <p className="text-2xl font-bold text-gray-900">$3,420</p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <CurrencyDollar size={24} className="text-green-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">This month</p>
        </div>
      </div>

      {/* Maintenance Schedule */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Maintenance Schedule</h3>
            <div className="flex items-center space-x-3">
              <button className="text-sm text-gray-600 hover:text-gray-900 flex items-center space-x-2">
                <Calendar size={16} />
                <span>Calendar View</span>
              </button>
              <button className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 flex items-center space-x-2">
                <Plus size={16} />
                <span>Schedule Service</span>
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
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Service Type</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Scheduled</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Priority</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Technician</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Cost</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {maintenanceRecords.map((record) => (
                  <tr key={record.id} className="border-b border-gray-100">
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium text-gray-900">{record.vehicle}</p>
                        <p className="text-sm text-gray-600">{record.license_plate}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-sm text-gray-900">{record.service_type}</p>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="text-sm text-gray-900">{record.scheduled_date}</p>
                        {record.completed_date && (
                          <p className="text-xs text-gray-600">Completed: {record.completed_date}</p>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(record.status)}
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(record.status)}`}>
                          {record.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(record.priority)}`}>
                        {record.priority.charAt(0).toUpperCase() + record.priority.slice(1)}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-sm text-gray-900">{record.technician}</p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-sm font-medium text-gray-900">${record.cost.toFixed(2)}</p>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-1">
                          <Eye size={14} />
                          <span>View</span>
                        </button>
                        <button className="text-sm text-green-600 hover:text-green-700 font-medium">
                          Update
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

      {/* Maintenance Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Services</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Warning size={16} className="text-yellow-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">ABC-123 Oil Change</p>
                  <p className="text-xs text-gray-600">Due Tomorrow</p>
                </div>
              </div>
              <span className="text-sm text-gray-600">$120</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Clock size={16} className="text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">DEF-456 Inspection</p>
                  <p className="text-xs text-gray-600">Due in 3 days</p>
                </div>
              </div>
              <span className="text-sm text-gray-600">$85</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <XCircle size={16} className="text-red-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">GHI-789 Tire Rotation</p>
                  <p className="text-xs text-gray-600">Overdue by 2 days</p>
                </div>
              </div>
              <span className="text-sm text-gray-600">$75</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Maintenance Summary</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Services This Month</span>
              <span className="text-sm font-medium text-gray-900">24</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Average Cost per Service</span>
              <span className="text-sm font-medium text-gray-900">$142</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">On-Time Completion</span>
              <span className="text-sm font-medium text-green-600">87%</span>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Service Categories</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Oil Changes</span>
                  <span className="text-sm text-gray-900">8</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Tire Services</span>
                  <span className="text-sm text-gray-900">6</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Brake Services</span>
                  <span className="text-sm text-gray-900">4</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Inspections</span>
                  <span className="text-sm text-gray-900">6</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
