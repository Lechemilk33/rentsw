import { TrendUp, TrendDown, Activity, ChartBar, Users, Star } from "phosphor-react";

interface AnalyticsTabProps {
  // Add props as needed
}

export default function AnalyticsTab(_props: AnalyticsTabProps) {
  return (
    <div className="space-y-6">
      {/* KPI Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">$127,500</p>
              <div className="flex items-center mt-2">
                <TrendUp size={16} className="text-green-600" />
                <span className="text-sm text-green-600 ml-1">+12.5%</span>
                <span className="text-sm text-gray-500 ml-2">vs last month</span>
              </div>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <ChartBar size={24} className="text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Fleet Utilization</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">87.3%</p>
              <div className="flex items-center mt-2">
                <TrendUp size={16} className="text-green-600" />
                <span className="text-sm text-green-600 ml-1">+5.2%</span>
                <span className="text-sm text-gray-500 ml-2">vs last month</span>
              </div>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <Activity size={24} className="text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Customer Satisfaction</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">4.8</p>
              <div className="flex items-center mt-2">
                <TrendUp size={16} className="text-green-600" />
                <span className="text-sm text-green-600 ml-1">+0.3</span>
                <span className="text-sm text-gray-500 ml-2">vs last month</span>
              </div>
            </div>
            <div className="bg-yellow-50 p-3 rounded-lg">
              <Star size={24} className="text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Customers</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">2,847</p>
              <div className="flex items-center mt-2">
                <TrendDown size={16} className="text-red-600" />
                <span className="text-sm text-red-600 ml-1">-2.1%</span>
                <span className="text-sm text-gray-500 ml-2">vs last month</span>
              </div>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <Users size={24} className="text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Revenue Trend</h3>
            <div className="flex items-center space-x-2">
              <button className="text-sm text-gray-600 hover:text-gray-900">7D</button>
              <button className="text-sm bg-amber-100 text-amber-700 px-3 py-1 rounded">30D</button>
              <button className="text-sm text-gray-600 hover:text-gray-900">90D</button>
            </div>
          </div>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Revenue chart placeholder</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Fleet Performance</h3>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View Details</button>
          </div>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Fleet performance chart placeholder</p>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Location Performance</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-600">Location</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Revenue</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Utilization</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Satisfaction</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Growth</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="py-3 px-4">Downtown Hub</td>
                <td className="py-3 px-4 text-green-600 font-medium">$45,200</td>
                <td className="py-3 px-4">92%</td>
                <td className="py-3 px-4">4.9</td>
                <td className="py-3 px-4">
                  <div className="flex items-center">
                    <TrendUp size={16} className="text-green-600" />
                    <span className="text-sm text-green-600 ml-1">+15%</span>
                  </div>
                </td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3 px-4">Airport Express</td>
                <td className="py-3 px-4 text-green-600 font-medium">$38,750</td>
                <td className="py-3 px-4">89%</td>
                <td className="py-3 px-4">4.7</td>
                <td className="py-3 px-4">
                  <div className="flex items-center">
                    <TrendUp size={16} className="text-green-600" />
                    <span className="text-sm text-green-600 ml-1">+8%</span>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4">University District</td>
                <td className="py-3 px-4 text-green-600 font-medium">$43,550</td>
                <td className="py-3 px-4">85%</td>
                <td className="py-3 px-4">4.8</td>
                <td className="py-3 px-4">
                  <div className="flex items-center">
                    <TrendDown size={16} className="text-red-600" />
                    <span className="text-sm text-red-600 ml-1">-3%</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
