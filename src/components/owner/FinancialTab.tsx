import { 
  CreditCard, 
  TrendUp, 
  TrendDown, 
  Download, 
  Eye, 
  Calendar,
  ChartLine,
  Wallet,
  Receipt,
  Bank
} from "phosphor-react";

interface FinancialTabProps {
  // Add props as needed
}

export default function FinancialTab(_props: FinancialTabProps) {
  return (
    <div className="space-y-6">
      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">$127,500</p>
              <div className="flex items-center mt-2">
                <TrendUp size={16} className="text-green-600" />
                <span className="text-sm text-green-600 ml-1">+12.5%</span>
              </div>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <ChartLine size={24} className="text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Operating Expenses</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">$72,300</p>
              <div className="flex items-center mt-2">
                <TrendDown size={16} className="text-green-600" />
                <span className="text-sm text-green-600 ml-1">-3.2%</span>
              </div>
            </div>
            <div className="bg-red-50 p-3 rounded-lg">
              <Receipt size={24} className="text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Net Profit</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">$55,200</p>
              <div className="flex items-center mt-2">
                <TrendUp size={16} className="text-green-600" />
                <span className="text-sm text-green-600 ml-1">+18.7%</span>
              </div>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <Wallet size={24} className="text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Payment Methods & Accounts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Payment Methods</h3>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">Add Method</button>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center">
                <div className="bg-blue-50 p-2 rounded-lg">
                  <CreditCard size={20} className="text-blue-600" />
                </div>
                <div className="ml-3">
                  <p className="font-medium text-gray-900">Visa •••• 4532</p>
                  <p className="text-sm text-gray-600">Primary Payment Method</p>
                </div>
              </div>
              <span className="text-sm text-green-600 font-medium">Active</span>
            </div>
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center">
                <div className="bg-purple-50 p-2 rounded-lg">
                  <Bank size={20} className="text-purple-600" />
                </div>
                <div className="ml-3">
                  <p className="font-medium text-gray-900">Bank Account •••• 7890</p>
                  <p className="text-sm text-gray-600">Wells Fargo Business</p>
                </div>
              </div>
              <span className="text-sm text-green-600 font-medium">Connected</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Monthly Breakdown</h3>
            <div className="flex items-center space-x-2">
              <Calendar size={16} className="text-gray-500" />
              <span className="text-sm text-gray-600">January 2024</span>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Rental Revenue</span>
              <span className="font-medium">$98,500</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Late Fees</span>
              <span className="font-medium">$3,200</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Insurance Claims</span>
              <span className="font-medium">$1,800</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Service Fees</span>
              <span className="font-medium">$24,000</span>
            </div>
            <div className="border-t border-gray-200 pt-3 flex justify-between">
              <span className="text-sm font-medium text-gray-900">Total Revenue</span>
              <span className="font-bold text-green-600">$127,500</span>
            </div>
          </div>
        </div>
      </div>

      {/* Transactions & Reports */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
            <div className="flex items-center space-x-3">
              <button className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900">
                <Download size={16} />
                <span>Export</span>
              </button>
              <button className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-700 font-medium">
                <Eye size={16} />
                <span>View All</span>
              </button>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Transaction</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Location</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Amount</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 text-sm">Jan 15, 2024</td>
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium">Vehicle Rental Payment</p>
                      <p className="text-sm text-gray-600">Customer ID: #C2847</p>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm">Downtown Hub</td>
                  <td className="py-3 px-4 font-medium text-green-600">+$450.00</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                      Completed
                    </span>
                  </td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 text-sm">Jan 14, 2024</td>
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium">Insurance Claim</p>
                      <p className="text-sm text-gray-600">Claim ID: #INS4532</p>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm">Airport Express</td>
                  <td className="py-3 px-4 font-medium text-green-600">+$1,200.00</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                      Completed
                    </span>
                  </td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 text-sm">Jan 13, 2024</td>
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium">Maintenance Service</p>
                      <p className="text-sm text-gray-600">Vehicle: 2023 Toyota Camry</p>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm">University District</td>
                  <td className="py-3 px-4 font-medium text-red-600">-$280.00</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                      Processing
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
