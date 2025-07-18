import { CurrencyDollar, TrendUp, TrendDown, CreditCard, Receipt, Calendar, Download, Eye } from "phosphor-react";

interface FinancialData {
  period: string;
  revenue: number;
  bookings: number;
  expenses: number;
  profit: number;
  growth: number;
}

interface Transaction {
  id: string;
  date: string;
  type: 'income' | 'expense';
  category: string;
  description: string;
  amount: number;
  booking_id?: string;
  status: 'completed' | 'pending' | 'failed';
}

interface FinancialReportsTabProps {
  // Add props as needed
}

export default function FinancialReportsTab(_props: FinancialReportsTabProps) {
  const monthlyData: FinancialData[] = [
    { period: 'Dec 2023', revenue: 18500, bookings: 145, expenses: 8200, profit: 10300, growth: 12.5 },
    { period: 'Jan 2024', revenue: 15420, bookings: 156, expenses: 7800, profit: 7620, growth: -15.2 },
    { period: 'Feb 2024', revenue: 22100, bookings: 178, expenses: 9100, profit: 13000, growth: 43.4 }
  ];

  const recentTransactions: Transaction[] = [
    {
      id: '1',
      date: '2024-01-21',
      type: 'income',
      category: 'Rental Payment',
      description: 'Booking BK-2024-001 - Toyota Camry',
      amount: 450.00,
      booking_id: 'BK-2024-001',
      status: 'completed'
    },
    {
      id: '2',
      date: '2024-01-21',
      type: 'expense',
      category: 'Maintenance',
      description: 'Brake pad replacement - Honda Civic',
      amount: 350.00,
      status: 'completed'
    },
    {
      id: '3',
      date: '2024-01-20',
      type: 'income',
      category: 'Rental Payment',
      description: 'Booking BK-2024-002 - Honda Civic',
      amount: 180.00,
      booking_id: 'BK-2024-002',
      status: 'completed'
    },
    {
      id: '4',
      date: '2024-01-20',
      type: 'expense',
      category: 'Fuel',
      description: 'Fleet refueling - Gas Station A',
      amount: 240.00,
      status: 'pending'
    },
    {
      id: '5',
      date: '2024-01-19',
      type: 'expense',
      category: 'Insurance',
      description: 'Monthly vehicle insurance premium',
      amount: 1200.00,
      status: 'completed'
    }
  ];

  const getTransactionColor = (type: string) => {
    return type === 'income' ? 'text-green-600' : 'text-red-600';
  };

  const getTransactionIcon = (type: string) => {
    return type === 'income' ? 
      <TrendUp size={16} className="text-green-600" /> : 
      <TrendDown size={16} className="text-red-600" />;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50';
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      case 'failed': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const currentMonth = monthlyData[monthlyData.length - 1];

  return (
    <div className="space-y-6">
      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Monthly Revenue</p>
              <p className="text-2xl font-bold text-gray-900">${currentMonth.revenue.toLocaleString()}</p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <CurrencyDollar size={24} className="text-green-600" />
            </div>
          </div>
          <div className="flex items-center mt-2">
            {currentMonth.growth > 0 ? (
              <TrendUp size={16} className="text-green-600 mr-1" />
            ) : (
              <TrendDown size={16} className="text-red-600 mr-1" />
            )}
            <span className={`text-sm ${currentMonth.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {Math.abs(currentMonth.growth)}% vs last month
            </span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Expenses</p>
              <p className="text-2xl font-bold text-gray-900">${currentMonth.expenses.toLocaleString()}</p>
            </div>
            <div className="bg-red-50 p-3 rounded-lg">
              <Receipt size={24} className="text-red-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">This month</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Net Profit</p>
              <p className="text-2xl font-bold text-green-600">${currentMonth.profit.toLocaleString()}</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <TrendUp size={24} className="text-blue-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">Profit margin: {Math.round((currentMonth.profit / currentMonth.revenue) * 100)}%</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg. Booking Value</p>
              <p className="text-2xl font-bold text-gray-900">${Math.round(currentMonth.revenue / currentMonth.bookings)}</p>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <CreditCard size={24} className="text-purple-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">{currentMonth.bookings} bookings this month</p>
        </div>
      </div>

      {/* Revenue Trends */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Revenue Trends</h3>
            <div className="flex items-center space-x-3">
              <button className="text-sm text-gray-600 hover:text-gray-900 flex items-center space-x-2">
                <Calendar size={16} />
                <span>Change Period</span>
              </button>
              <button className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 flex items-center space-x-2">
                <Download size={16} />
                <span>Export Report</span>
              </button>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Period</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Revenue</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Bookings</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Expenses</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Net Profit</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Growth</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Margin</th>
                </tr>
              </thead>
              <tbody>
                {monthlyData.map((data, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-4 px-4">
                      <p className="font-medium text-gray-900">{data.period}</p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-medium text-gray-900">${data.revenue.toLocaleString()}</p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-gray-900">{data.bookings}</p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-red-600">${data.expenses.toLocaleString()}</p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-green-600 font-medium">${data.profit.toLocaleString()}</p>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-1">
                        {data.growth > 0 ? (
                          <TrendUp size={16} className="text-green-600" />
                        ) : (
                          <TrendDown size={16} className="text-red-600" />
                        )}
                        <span className={`text-sm font-medium ${data.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {data.growth > 0 ? '+' : ''}{data.growth}%
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-gray-900">{Math.round((data.profit / data.revenue) * 100)}%</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
            <button className="text-sm text-gray-600 hover:text-gray-900 flex items-center space-x-2">
              <Eye size={16} />
              <span>View All</span>
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-lg ${transaction.type === 'income' ? 'bg-green-50' : 'bg-red-50'}`}>
                    {getTransactionIcon(transaction.type)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{transaction.description}</p>
                    <div className="flex items-center space-x-3 mt-1">
                      <p className="text-sm text-gray-600">{transaction.category}</p>
                      <span className="text-gray-400">•</span>
                      <p className="text-sm text-gray-600">{transaction.date}</p>
                      {transaction.booking_id && (
                        <>
                          <span className="text-gray-400">•</span>
                          <p className="text-sm text-blue-600">{transaction.booking_id}</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-medium text-lg ${getTransactionColor(transaction.type)}`}>
                    {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                  </p>
                  <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(transaction.status)}`}>
                    {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Expense Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Expense Categories</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Maintenance</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div className="h-2 bg-red-500 rounded-full" style={{ width: '45%' }}></div>
                </div>
                <span className="text-sm font-medium text-gray-900">$3,510</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Fuel</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div className="h-2 bg-yellow-500 rounded-full" style={{ width: '30%' }}></div>
                </div>
                <span className="text-sm font-medium text-gray-900">$2,340</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Insurance</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div className="h-2 bg-blue-500 rounded-full" style={{ width: '15%' }}></div>
                </div>
                <span className="text-sm font-medium text-gray-900">$1,200</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Cleaning</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div className="h-2 bg-green-500 rounded-full" style={{ width: '10%' }}></div>
                </div>
                <span className="text-sm font-medium text-gray-900">$750</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Metrics</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Revenue per Vehicle</span>
              <span className="text-sm font-medium text-gray-900">$642/month</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Cost per Vehicle</span>
              <span className="text-sm font-medium text-gray-900">$325/month</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Fleet Utilization</span>
              <span className="text-sm font-medium text-green-600">72%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Average Daily Rate</span>
              <span className="text-sm font-medium text-gray-900">$89</span>
            </div>
            
            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900">ROI</span>
                <span className="text-sm font-medium text-green-600">23.4%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
