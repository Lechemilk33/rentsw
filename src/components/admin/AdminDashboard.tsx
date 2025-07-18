import { ChartBar, Users, Car, CalendarCheck, TrendUp, Activity } from "phosphor-react";

interface LocationMetrics {
  total_vehicles: number;
  active_bookings: number;
  team_members: number;
  monthly_revenue: number;
  utilization_rate: number;
  maintenance_tasks: number;
}

interface AdminDashboardProps {
  metrics?: LocationMetrics | null;
}

export default function AdminDashboard({ metrics }: AdminDashboardProps) {
  // Default metrics if none provided
  const defaultMetrics: LocationMetrics = {
    total_vehicles: 24,
    active_bookings: 8,
    team_members: 12,
    monthly_revenue: 15420,
    utilization_rate: 72,
    maintenance_tasks: 3
  };

  const currentMetrics = metrics || defaultMetrics;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Fleet Size</p>
            <p className="text-3xl font-bold text-gray-900">{currentMetrics.total_vehicles}</p>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg">
            <Car size={24} className="text-blue-600" />
          </div>
        </div>
        <div className="mt-4 flex items-center text-sm">
          <Activity size={16} className="text-blue-500 mr-1" />
          <span className="text-blue-600 font-medium">{currentMetrics.utilization_rate}% utilized</span>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Active Bookings</p>
            <p className="text-3xl font-bold text-gray-900">{currentMetrics.active_bookings}</p>
          </div>
          <div className="p-3 bg-green-50 rounded-lg">
            <CalendarCheck size={24} className="text-green-600" />
          </div>
        </div>
        <div className="mt-4 flex items-center text-sm">
          <TrendUp size={16} className="text-green-500 mr-1" />
          <span className="text-green-600 font-medium">+12% this week</span>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Team Members</p>
            <p className="text-3xl font-bold text-gray-900">{currentMetrics.team_members}</p>
          </div>
          <div className="p-3 bg-purple-50 rounded-lg">
            <Users size={24} className="text-purple-600" />
          </div>
        </div>
        <div className="mt-4 flex items-center text-sm">
          <span className="text-purple-600 font-medium">5 online now</span>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
            <p className="text-3xl font-bold text-gray-900">${(currentMetrics.monthly_revenue / 1000).toFixed(0)}k</p>
          </div>
          <div className="p-3 bg-amber-50 rounded-lg">
            <ChartBar size={24} className="text-amber-600" />
          </div>
        </div>
        <div className="mt-4 flex items-center text-sm">
          <TrendUp size={16} className="text-green-500 mr-1" />
          <span className="text-green-600 font-medium">+8.2% vs last month</span>
        </div>
      </div>
    </div>
  );
}
