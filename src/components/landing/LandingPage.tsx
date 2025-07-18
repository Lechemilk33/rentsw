/**
 * Landing Page Component  
 * Professional landing page for RENTAGAIN with hero section and features
 */

import React from 'react'
import { 
  Car, 
  Shield, 
  Clock, 
  ChartBar, 
  Users, 
  Wrench,
  CheckCircle,
  ArrowRight
} from 'phosphor-react'

interface LandingPageProps {
  onSignIn: () => void
  onSignUp: () => void
}

export function LandingPage({ onSignIn, onSignUp }: LandingPageProps) {
  const features = [
    {
      icon: Car,
      title: "Fleet Management",
      description: "Comprehensive vehicle tracking, maintenance scheduling, and real-time status updates for your entire fleet."
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-level security with role-based access control, audit logs, and compliance-ready data protection."
    },
    {
      icon: Clock,
      title: "Real-Time Operations",
      description: "Live updates, instant notifications, and seamless booking management to keep your business running smoothly."
    },
    {
      icon: ChartBar,
      title: "Advanced Analytics",
      description: "Detailed reporting, performance metrics, and business intelligence to optimize your rental operations."
    },
    {
      icon: Users,
      title: "Multi-Location Support",
      description: "Manage multiple locations, teams, and hierarchies with centralized oversight and local autonomy."
    },
    {
      icon: Wrench,
      title: "Maintenance Tracking",
      description: "Automated maintenance scheduling, cost tracking, and service provider management for optimal fleet health."
    }
  ]

  const benefits = [
    "Reduce operational costs by up to 30%",
    "Increase fleet utilization rates",
    "Streamline maintenance workflows",
    "Enhance customer satisfaction",
    "Scale across multiple locations",
    "Comprehensive audit trails"
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Car size={20} className="text-white" weight="duotone" />
              </div>
              <span className="text-xl font-bold text-gray-900">RENTAGAIN</span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={onSignIn}
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={onSignUp}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-indigo-50 pt-16 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Professional{' '}
                <span className="text-blue-600 block">Fleet Management</span>{' '}
                Made Simple
              </h1>
              <p className="text-xl text-gray-600 mt-6 leading-relaxed">
                Streamline your rental operations with enterprise-grade fleet management. 
                Track vehicles, manage maintenance, handle bookings, and grow your business 
                with confidence.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <button
                  onClick={onSignUp}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                >
                  <span>Start Free Trial</span>
                  <ArrowRight size={20} weight="bold" />
                </button>
                <button
                  onClick={onSignIn}
                  className="border-2 border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200"
                >
                  View Demo
                </button>
              </div>
            </div>
            <div className="lg:pl-8">
              <div className="bg-white rounded-2xl shadow-2xl p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Fleet Overview</h3>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Active Vehicles</span>
                    <span className="font-semibold text-green-600">24/25</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Today's Bookings</span>
                    <span className="font-semibold text-blue-600">18</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Maintenance Due</span>
                    <span className="font-semibold text-amber-600">3</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Manage Your Fleet
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From vehicle tracking to maintenance scheduling, our comprehensive platform 
              handles every aspect of your rental business.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div key={feature.title} className="bg-white p-6 rounded-xl border border-gray-100 hover:shadow-lg transition-all duration-200">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon size={24} className="text-blue-600" weight="duotone" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Proven Results for Growing Businesses
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Join hundreds of rental companies who have transformed their operations 
                with RENTAGAIN's powerful fleet management platform.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit) => (
                  <div key={benefit} className="flex items-center space-x-3">
                    <CheckCircle size={20} className="text-green-500" weight="fill" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:pl-8">
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">30%</div>
                  <div className="text-gray-600 mb-6">Average Cost Reduction</div>
                  <div className="text-4xl font-bold text-green-600 mb-2">95%</div>
                  <div className="text-gray-600 mb-6">Customer Satisfaction</div>
                  <div className="text-4xl font-bold text-purple-600 mb-2">24/7</div>
                  <div className="text-gray-600">System Uptime</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Fleet Management?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of businesses already using RENTAGAIN to streamline their operations 
            and increase profitability.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onSignUp}
              className="bg-white hover:bg-gray-50 text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Start Your Free Trial
            </button>
            <button
              onClick={onSignIn}
              className="border-2 border-blue-400 hover:border-blue-300 text-white hover:bg-blue-500 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200"
            >
              Sign In to Account
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Car size={20} className="text-white" weight="duotone" />
              </div>
              <span className="text-xl font-bold text-white">RENTAGAIN</span>
            </div>
            <p className="text-gray-400">© 2025 RENTAGAIN. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
