import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import AdminHeader from '../../src/components/admin/AdminHeader'
import AdminNavigation from '../../src/components/admin/AdminNavigation'
import AdminDashboard from '../../src/components/admin/AdminDashboard'
import TeamManagementTab from '../../src/components/admin/TeamManagementTab'
import FinancialReportsTab from '../../src/components/admin/FinancialReportsTab'
import SettingsTab from '../../src/components/admin/SettingsTab'

export default function AdminPanel() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'overview' | 'team' | 'financial' | 'settings'>('overview')

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <AdminDashboard />
      case 'team':
        return <TeamManagementTab />
      case 'financial':
        return <FinancialReportsTab />
      case 'settings':
        return <SettingsTab />
      default:
        // Default to overview if unknown tab
        return <AdminDashboard />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-rose-100">
      <AdminHeader onBack={() => navigate('/operations')} />
      
      <AdminNavigation 
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab as any)}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderTabContent()}
      </main>
    </div>
  )
}
