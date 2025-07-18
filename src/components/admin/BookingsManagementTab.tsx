import { Calendar, Clock, User, CurrencyDollar, CheckCircle, XCircle, Warning, Plus, Eye } from "phosphor-react";

interface Booking {
  id: string;
  booking_number: string;
  customer_name: string;
  customer_email: string;
  vehicle: string;
  start_date: string;
  end_date: string;
  status: 'confirmed' | 'active' | 'completed' | 'cancelled';
  total_amount: number;
  payment_status: 'paid' | 'pending' | 'partial';
  pickup_location: string;
  dropoff_location: string;
  created_at: string;
}

interface BookingsManagementTabProps {
  // Add props as needed
}

export default function BookingsManagementTab(_props: BookingsManagementTabProps) {
  const bookings: Booking[] = [
    {
      id: '1',
      booking_number: 'BK-2024-001',
      customer_name: 'John Smith',
      customer_email: 'john.smith@email.com',
      vehicle: '2023 Toyota Camry (ABC-123)',
      start_date: '2024-01-20',
      end_date: '2024-01-25',
      status: 'active',
      total_amount: 450.00,
      payment_status: 'paid',
      pickup_location: 'Main Office',
      dropoff_location: 'Main Office',
      created_at: '2024-01-18'
    },
    {
      id: '2',
      booking_number: 'BK-2024-002',
      customer_name: 'Sarah Johnson',
      customer_email: 'sarah.j@email.com',
      vehicle: '2022 Honda Civic (DEF-456)',
      start_date: '2024-01-22',
      end_date: '2024-01-24',
      status: 'confirmed',
      total_amount: 180.00,
      payment_status: 'paid',
      pickup_location: 'Airport',
      dropoff_location: 'Airport',
      created_at: '2024-01-19'
    },
    {
      id: '3',
      booking_number: 'BK-2024-003',
      customer_name: 'Mike Wilson',
      customer_email: 'mike.w@email.com',
      vehicle: '2023 Nissan Altima (GHI-789)',
      start_date: '2024-01-25',
      end_date: '2024-01-30',
      status: 'confirmed',
      total_amount: 625.00,
      payment_status: 'pending',
      pickup_location: 'Main Office',
      dropoff_location: 'Downtown',
      created_at: '2024-01-20'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'text-blue-600 bg-blue-50';
      case 'active': return 'text-green-600 bg-green-50';
      case 'completed': return 'text-gray-600 bg-gray-50';
      case 'cancelled': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <Clock size={16} className="text-blue-600" />;
      case 'active': return <CheckCircle size={16} className="text-green-600" />;
      case 'completed': return <CheckCircle size={16} className="text-gray-600" />;
      case 'cancelled': return <XCircle size={16} className="text-red-600" />;
      default: return <Clock size={16} />;
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'text-green-600 bg-green-50';
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      case 'partial': return 'text-orange-600 bg-orange-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Bookings Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Bookings</p>
              <p className="text-2xl font-bold text-gray-900">156</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <Calendar size={24} className="text-blue-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">This month</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Rentals</p>
              <p className="text-2xl font-bold text-green-600">4</p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <CheckCircle size={24} className="text-green-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">Currently ongoing</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Pickup</p>
              <p className="text-2xl font-bold text-yellow-600">8</p>
            </div>
            <div className="bg-yellow-50 p-3 rounded-lg">
              <Warning size={24} className="text-yellow-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">Ready for pickup</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Revenue</p>
              <p className="text-2xl font-bold text-gray-900">$15,420</p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <CurrencyDollar size={24} className="text-green-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">This month</p>
        </div>
      </div>

      {/* Bookings Management */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Recent Bookings</h3>
            <div className="flex items-center space-x-3">
              <button className="text-sm text-gray-600 hover:text-gray-900 flex items-center space-x-2">
                <Calendar size={16} />
                <span>Calendar View</span>
              </button>
              <button className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 flex items-center space-x-2">
                <Plus size={16} />
                <span>New Booking</span>
              </button>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Booking</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Customer</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Vehicle</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Dates</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Payment</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Total</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.id} className="border-b border-gray-100">
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium text-gray-900">{booking.booking_number}</p>
                        <p className="text-sm text-gray-600">Created {booking.created_at}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="bg-gray-100 p-2 rounded-full">
                          <User size={16} className="text-gray-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{booking.customer_name}</p>
                          <p className="text-sm text-gray-600">{booking.customer_email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-sm text-gray-900">{booking.vehicle}</p>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="text-sm text-gray-900">{booking.start_date} to {booking.end_date}</p>
                        <p className="text-xs text-gray-600">
                          {booking.pickup_location} → {booking.dropoff_location}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(booking.status)}
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(booking.status)}`}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPaymentStatusColor(booking.payment_status)}`}>
                        {booking.payment_status.charAt(0).toUpperCase() + booking.payment_status.slice(1)}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-medium text-gray-900">${booking.total_amount.toFixed(2)}</p>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-1">
                          <Eye size={14} />
                          <span>View</span>
                        </button>
                        <button className="text-sm text-green-600 hover:text-green-700 font-medium">
                          Modify
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

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Schedule</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <CheckCircle size={16} className="text-green-600" />
                <span className="text-sm font-medium text-gray-900">2 Pickups</span>
              </div>
              <span className="text-sm text-gray-600">10:00 AM, 2:00 PM</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Clock size={16} className="text-blue-600" />
                <span className="text-sm font-medium text-gray-900">1 Return</span>
              </div>
              <span className="text-sm text-gray-600">4:30 PM</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Warning size={16} className="text-yellow-600" />
                <span className="text-sm font-medium text-gray-900">3 Pending Confirmations</span>
              </div>
              <span className="text-sm text-gray-600">Awaiting payment</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Trends</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">This Week</span>
              <span className="text-sm font-medium text-gray-900">32 bookings</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Last Week</span>
              <span className="text-sm font-medium text-gray-900">28 bookings</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Growth</span>
              <span className="text-sm font-medium text-green-600">+14.3%</span>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Average Booking Value</span>
                <span className="text-sm font-medium text-gray-900">$320</span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm text-gray-600">Customer Satisfaction</span>
                <span className="text-sm font-medium text-green-600">4.8/5</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
