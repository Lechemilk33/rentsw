import { useNavigate, useSearchParams } from "react-router";
import { useEffect, useState } from "react";
import { supabase } from "../../src/lib/supabase";

// Import new components
import OwnerHeader from "../../src/components/owner/OwnerHeader";
import OwnerNavigation from "../../src/components/owner/OwnerNavigation";
import OwnerDashboard from "../../src/components/owner/OwnerDashboard";
import QuickActions from "../../src/components/owner/QuickActions";
import LocationPortfolio from "../../src/components/owner/LocationPortfolio";
import AnalyticsTab from "../../src/components/owner/AnalyticsTab";
import FinancialTab from "../../src/components/owner/FinancialTab";
import SecurityTab from "../../src/components/owner/SecurityTab";
import TeamTab from "../../src/components/owner/TeamTab";
import GrowthTab from "../../src/components/owner/GrowthTab";
import LocationCreationWizard from "../../src/components/owner/LocationCreationWizard";

interface Location {
  id: string;
  name: string;
  address: string;
  status: 'active' | 'inactive' | 'setup' | 'suspended';
  fleet_count: number;
  monthly_revenue: number;
  utilization_rate: number;
  admin_name: string;
  created_at: string;
  phone: string;
  email: string;
}

interface AnalyticsData {
  total_locations: number;
  total_fleet: number;
  monthly_revenue: number;
  avg_utilization: number;
  top_performing_location: string;
  growth_rate: number;
  pending_issues: number;
}

export default function OwnerPanel() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Mock user - remove custom auth complexity
  const user = {
    id: 'mock-owner',
    email: 'owner@rentagain.com',
    user_metadata: { full_name: 'Business Owner' },
    app_metadata: { role: 'OWNER' }
  };
  
  const [locations, setLocations] = useState<Location[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "overview");
  const [showLocationWizard, setShowLocationWizard] = useState(false);

  useEffect(() => {
    loadOwnerData();
  }, []);

  const loadOwnerData = async () => {
    try {
      setLoading(true);
      
      // Load mock locations data for now
      const mockLocations: Location[] = [
        {
          id: '1',
          name: 'Downtown Phoenix',
          address: '123 Main St, Phoenix, AZ 85001',
          status: 'active',
          fleet_count: 45,
          monthly_revenue: 125000,
          utilization_rate: 87,
          admin_name: 'Sarah Johnson',
          created_at: '2024-01-15',
          phone: '(602) 555-0123',
          email: 'sarah.johnson@rentagain.com'
        },
        {
          id: '2',
          name: 'Airport Express',
          address: '4567 Sky Harbor Blvd, Phoenix, AZ 85034',
          status: 'active',
          fleet_count: 32,
          monthly_revenue: 98000,
          utilization_rate: 92,
          admin_name: 'Mike Chen',
          created_at: '2024-02-01',
          phone: '(602) 555-0124',
          email: 'mike.chen@rentagain.com'
        },
        {
          id: '3',
          name: 'University District',
          address: '789 University Ave, Tempe, AZ 85281',
          status: 'setup',
          fleet_count: 28,
          monthly_revenue: 76000,
          utilization_rate: 78,
          admin_name: 'Emily Rodriguez',
          created_at: '2024-02-15',
          phone: '(480) 555-0125',
          email: 'emily.rodriguez@rentagain.com'
        }
      ];

      setLocations(mockLocations);

      // Calculate analytics from mock data
      const analyticsData: AnalyticsData = {
        total_locations: mockLocations.length,
        total_fleet: mockLocations.reduce((sum, loc) => sum + loc.fleet_count, 0),
        monthly_revenue: mockLocations.reduce((sum, loc) => sum + loc.monthly_revenue, 0),
        avg_utilization: Math.round(mockLocations.reduce((sum, loc) => sum + loc.utilization_rate, 0) / mockLocations.length),
        top_performing_location: [...mockLocations].sort((a, b) => b.monthly_revenue - a.monthly_revenue)[0]?.name || 'N/A',
        growth_rate: 12.5,
        pending_issues: Math.floor(Math.random() * 5)
      };

      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Error loading owner data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  const handleBackToOperations = () => {
    navigate('/operations');
  };

  const handleSignOut = () => {
    supabase.auth.signOut();
  };

  const handleShowLocationWizard = () => {
    setShowLocationWizard(true);
  };

  const handleCloseLocationWizard = () => {
    setShowLocationWizard(false);
  };

  const handleLocationSubmit = (locationData: any) => {
    console.log('New location data:', locationData);
    // Here you would typically save to database
    // For now, just add to local state
    const newLocation: Location = {
      id: Date.now().toString(),
      name: locationData.name,
      address: `${locationData.address}, ${locationData.city}, ${locationData.state} ${locationData.zipCode}`,
      status: 'setup',
      fleet_count: locationData.initialFleetSize || 5,
      monthly_revenue: 0,
      utilization_rate: 0,
      admin_name: locationData.adminName,
      created_at: new Date().toISOString().split('T')[0],
      phone: locationData.adminPhone,
      email: locationData.adminEmail
    };
    
    setLocations(prev => [...prev, newLocation]);
    setShowLocationWizard(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <div className="text-amber-800 font-medium">Loading Owner Panel...</div>
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-8">
            <OwnerDashboard analytics={analytics} />
            <QuickActions 
              onShowLocationWizard={handleShowLocationWizard}
              onTabChange={handleTabChange}
            />
            <LocationPortfolio locations={locations} onShowLocationWizard={handleShowLocationWizard} />
          </div>
        );
      case 'analytics':
        return <AnalyticsTab />;
      case 'financial':
        return <FinancialTab />;
      case 'security':
        return <SecurityTab />;
      case 'administration':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Platform Administration</h2>
              <p className="text-gray-600 mb-6">Manage global platform settings, integrations, and system configurations.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">System Settings</h3>
                  <p className="text-sm text-gray-600 mb-4">Configure global platform preferences and defaults.</p>
                  <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">Configure</button>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">API Management</h3>
                  <p className="text-sm text-gray-600 mb-4">Manage API keys, webhooks, and integrations.</p>
                  <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">Manage</button>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">Audit Logs</h3>
                  <p className="text-sm text-gray-600 mb-4">View system activity and access logs.</p>
                  <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View Logs</button>
                </div>
              </div>
            </div>
          </div>
        );
      case 'team':
        return <TeamTab />;
      case 'growth':
        return <GrowthTab />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100">
      <OwnerHeader 
        user={user}
        onBackToOperations={handleBackToOperations}
        onSignOut={handleSignOut}
      />
      
      <OwnerNavigation 
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderTabContent()}
      </main>

      <LocationCreationWizard
        isOpen={showLocationWizard}
        onClose={handleCloseLocationWizard}
        onSubmit={handleLocationSubmit}
      />
    </div>
  );
}
