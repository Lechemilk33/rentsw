import { 
  Shield, 
  Lock, 
  Key, 
  Eye, 
  Warning,
  CheckCircle,
  Clock,
  Monitor,
  User,
  WifiHigh,
  Bell
} from "phosphor-react";

interface SecurityTabProps {
  // Add props as needed
}

export default function SecurityTab(_props: SecurityTabProps) {
  return (
    <div className="space-y-6">
      {/* Security Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Security Score</p>
              <p className="text-2xl font-bold text-green-600 mt-1">95/100</p>
              <p className="text-sm text-gray-500 mt-1">Excellent</p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <Shield size={24} className="text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Sessions</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">3</p>
              <p className="text-sm text-gray-500 mt-1">Across 2 devices</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <Monitor size={24} className="text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Last Login</p>
              <p className="text-lg font-bold text-gray-900 mt-1">2 hours ago</p>
              <p className="text-sm text-gray-500 mt-1">Seattle, WA</p>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <Clock size={24} className="text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Authentication & Access</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center">
                <div className="bg-green-50 p-2 rounded-lg">
                  <Lock size={20} className="text-green-600" />
                </div>
                <div className="ml-3">
                  <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                  <p className="text-sm text-gray-600">SMS and authenticator app</p>
                </div>
              </div>
              <div className="flex items-center">
                <CheckCircle size={20} className="text-green-600" />
                <span className="text-sm text-green-600 ml-1">Enabled</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center">
                <div className="bg-blue-50 p-2 rounded-lg">
                  <Key size={20} className="text-blue-600" />
                </div>
                <div className="ml-3">
                  <p className="font-medium text-gray-900">API Access Keys</p>
                  <p className="text-sm text-gray-600">3 active keys</p>
                </div>
              </div>
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">Manage</button>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center">
                <div className="bg-purple-50 p-2 rounded-lg">
                  <User size={20} className="text-purple-600" />
                </div>
                <div className="ml-3">
                  <p className="font-medium text-gray-900">Single Sign-On (SSO)</p>
                  <p className="text-sm text-gray-600">Enterprise authentication</p>
                </div>
              </div>
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">Configure</button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Security Monitoring</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center">
                <div className="bg-green-50 p-2 rounded-lg">
                  <Bell size={20} className="text-green-600" />
                </div>
                <div className="ml-3">
                  <p className="font-medium text-gray-900">Login Alerts</p>
                  <p className="text-sm text-gray-600">Email notifications for new logins</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer" aria-label="Toggle login alerts">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center">
                <div className="bg-yellow-50 p-2 rounded-lg">
                  <Warning size={20} className="text-yellow-600" />
                </div>
                <div className="ml-3">
                  <p className="font-medium text-gray-900">Suspicious Activity</p>
                  <p className="text-sm text-gray-600">Automated threat detection</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer" aria-label="Toggle suspicious activity monitoring">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center">
                <div className="bg-purple-50 p-2 rounded-lg">
                  <WifiHigh size={20} className="text-purple-600" />
                </div>
                <div className="ml-3">
                  <p className="font-medium text-gray-900">IP Whitelist</p>
                  <p className="text-sm text-gray-600">Restrict access by location</p>
                </div>
              </div>
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">Configure</button>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Security Activity */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Recent Security Activity</h3>
            <button className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-700 font-medium">
              <Eye size={16} />
              <span>View All Logs</span>
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="bg-green-50 p-2 rounded-lg">
                <CheckCircle size={16} className="text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Successful login from new device</p>
                <p className="text-sm text-gray-600">iPhone 14 Pro • Seattle, WA • 2 hours ago</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="bg-blue-50 p-2 rounded-lg">
                <Key size={16} className="text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">API key regenerated</p>
                <p className="text-sm text-gray-600">Production API key updated • 1 day ago</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="bg-yellow-50 p-2 rounded-lg">
                <Warning size={16} className="text-yellow-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Failed login attempt</p>
                <p className="text-sm text-gray-600">Multiple failed attempts from Unknown location • 2 days ago</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="bg-green-50 p-2 rounded-lg">
                <Shield size={16} className="text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Security scan completed</p>
                <p className="text-sm text-gray-600">All systems secure • 3 days ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
