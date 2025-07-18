import { Users, Plus, Eye, Crown, UserPlus, UserMinus, Shield, Calendar } from "phosphor-react";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  permissions: string[];
  last_active: string;
  avatar?: string;
}

interface TeamTabProps {
  // Add props as needed
}

export default function TeamTab(_props: TeamTabProps) {
  const teamMembers: TeamMember[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@company.com',
      role: 'Location Manager',
      status: 'active',
      permissions: ['fleet_management', 'customer_support', 'analytics_view'],
      last_active: '2 hours ago'
    },
    {
      id: '2',
      name: 'Mike Chen',
      email: 'mike.chen@company.com',
      role: 'Fleet Coordinator',
      status: 'active',
      permissions: ['fleet_management', 'maintenance_scheduling'],
      last_active: '1 day ago'
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      email: 'emily.rodriguez@company.com',
      role: 'Customer Success',
      status: 'pending',
      permissions: ['customer_support', 'analytics_view'],
      last_active: 'Never'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-50';
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      case 'inactive': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Team Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Team Members</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">12</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <Users size={24} className="text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Now</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">8</p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <UserPlus size={24} className="text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Invites</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">3</p>
            </div>
            <div className="bg-yellow-50 p-3 rounded-lg">
              <Calendar size={24} className="text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Admin Users</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">2</p>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <Crown size={24} className="text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Team Management */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Team Members</h3>
            <div className="flex items-center space-x-3">
              <button className="text-sm text-gray-600 hover:text-gray-900 flex items-center space-x-2">
                <Eye size={16} />
                <span>View Roles</span>
              </button>
              <button className="bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-700 flex items-center space-x-2">
                <Plus size={16} />
                <span>Invite Member</span>
              </button>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Member</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Role</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Last Active</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Permissions</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {teamMembers.map((member) => (
                  <tr key={member.id} className="border-b border-gray-100">
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="ml-3">
                          <p className="font-medium text-gray-900">{member.name}</p>
                          <p className="text-sm text-gray-600">{member.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-medium text-gray-900">{member.role}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(member.status)}`}>
                        {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">
                      {member.last_active}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex flex-wrap gap-1">
                        {member.permissions.slice(0, 2).map((permission) => (
                          <span key={permission} className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                            {permission.replace('_', ' ')}
                          </span>
                        ))}
                        {member.permissions.length > 2 && (
                          <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                            +{member.permissions.length - 2} more
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                          Edit
                        </button>
                        <button className="text-sm text-red-600 hover:text-red-700 font-medium">
                          Remove
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

      {/* Role Management */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Roles & Permissions</h3>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">Create Role</button>
          </div>
          <div className="space-y-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">Owner</h4>
                <div className="flex items-center">
                  <Crown size={16} className="text-amber-600" />
                  <span className="text-sm text-gray-600 ml-1">1 member</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-3">Full access to all features and settings</p>
              <div className="flex flex-wrap gap-1">
                <span className="px-2 py-1 text-xs bg-amber-100 text-amber-700 rounded">All Permissions</span>
              </div>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">Location Manager</h4>
                <div className="flex items-center">
                  <Shield size={16} className="text-blue-600" />
                  <span className="text-sm text-gray-600 ml-1">4 members</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-3">Manage location operations and staff</p>
              <div className="flex flex-wrap gap-1">
                <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">Fleet Management</span>
                <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">Customer Support</span>
                <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">Analytics</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="bg-green-50 p-2 rounded-lg">
                <UserPlus size={16} className="text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Sarah Johnson joined the team</p>
                <p className="text-sm text-gray-600">Assigned as Location Manager • 2 hours ago</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="bg-blue-50 p-2 rounded-lg">
                <Shield size={16} className="text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Permissions updated</p>
                <p className="text-sm text-gray-600">Mike Chen granted maintenance access • 1 day ago</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="bg-yellow-50 p-2 rounded-lg">
                <Calendar size={16} className="text-yellow-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Invitation sent</p>
                <p className="text-sm text-gray-600">Emily Rodriguez invited as Customer Success • 2 days ago</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="bg-red-50 p-2 rounded-lg">
                <UserMinus size={16} className="text-red-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Team member removed</p>
                <p className="text-sm text-gray-600">John Smith access revoked • 3 days ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
