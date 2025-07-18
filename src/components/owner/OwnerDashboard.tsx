import { Buildings, Target, CurrencyDollar, Activity, TrendUp } from "phosphor-react";

interface AnalyticsData {
  total_locations: number;
  total_fleet: number;
  monthly_revenue: number;
  avg_utilization: number;
  top_performing_location: string;
  growth_rate: number;
  pending_issues: number;
}

interface OwnerDashboardProps {
  analytics: AnalyticsData | null;
}

export default function OwnerDashboard({ analytics }: OwnerDashboardProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Locations</p>
            <p className="text-3xl font-bold text-gray-900">{analytics?.total_locations || 0}</p>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg">
            <Buildings size={24} className="text-blue-600" />
          </div>
        </div>
        <div className="mt-4 flex items-center text-sm">
          <TrendUp size={16} className="text-green-500 mr-1" />
          <span className="text-green-600 font-medium">+2 this month</span>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Fleet</p>
            <p className="text-3xl font-bold text-gray-900">{analytics?.total_fleet || 0}</p>
          </div>
          <div className="p-3 bg-green-50 rounded-lg">
            <Target size={24} className="text-green-600" />
          </div>
        </div>
        <div className="mt-4 flex items-center text-sm">
          <TrendUp size={16} className="text-green-500 mr-1" />
          <span className="text-green-600 font-medium">+12% growth</span>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
            <p className="text-3xl font-bold text-gray-900">
              ${(analytics?.monthly_revenue || 0).toLocaleString()}
            </p>
          </div>
          <div className="p-3 bg-amber-50 rounded-lg">
            <CurrencyDollar size={24} className="text-amber-600" />
          </div>
        </div>
        <div className="mt-4 flex items-center text-sm">
          <TrendUp size={16} className="text-green-500 mr-1" />
          <span className="text-green-600 font-medium">+{analytics?.growth_rate || 0}% vs last month</span>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Avg Utilization</p>
            <p className="text-3xl font-bold text-gray-900">{analytics?.avg_utilization || 0}%</p>
          </div>
          <div className="p-3 bg-purple-50 rounded-lg">
            <Activity size={24} className="text-purple-600" />
          </div>
        </div>
        <div className="mt-4 flex items-center text-sm">
          <span className="text-gray-600">Enterprise target: 75%</span>
        </div>
      </div>
    </div>
  );
}
