/*
 * Enterprise Design System Showcase
 * Demonstration of billion-dollar UI components following Apple/Microsoft standards
 */

import React, { useState } from 'react'
import { 
  Button, 
  Card, 
  Badge, 
  Input, 
  Select, 
  Loading, 
  EmptyState, 
  Modal, 
  Toast, 
  Tooltip,
  designTokens 
} from './professionalComponents'
import { 
  Settings, 
  User, 
  Star, 
  Download,
  Upload,
  Trash2,
  Edit,
  Plus,
  BarChart3,
  Users,
  Mail,
  Globe,
  Lock,
  AlertCircle,
  CheckCircle,
  XCircle,
  Info,
  Zap,
  Rocket,
  Crown,
  Shield,
  Diamond,
  Bell
} from 'lucide-react'

export const DesignSystemShowcase: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false)
  const [toasts, setToasts] = useState<Array<{ id: string; title?: string; message: string; variant: 'success' | 'warning' | 'danger' | 'info' }>>([])
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    password: '',
    confirmPassword: ''
  })

  const addToast = (toast: Omit<typeof toasts[0], 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts(prev => [...prev, { ...toast, id }])
  }

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    addToast({
      title: 'Success!',
      message: 'Your enterprise account has been created successfully.',
      variant: 'success'
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center space-x-3">
              <Crown className="w-12 h-12 text-yellow-300" />
              <h1 className="text-5xl font-bold">Enterprise Design System</h1>
              <Crown className="w-12 h-12 text-yellow-300" />
            </div>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Billion-dollar UI components following Apple/Microsoft standards. Built with accessibility, 
              performance, and enterprise scalability in mind.
            </p>
            <div className="flex items-center justify-center space-x-4">
              <Badge variant="primary" size="lg" icon={Shield}>
                WCAG AAA Compliant
              </Badge>
              <Badge variant="success" size="lg" icon={Zap}>
                60fps Guaranteed
              </Badge>
              <Badge variant="info" size="lg" icon={Diamond}>
                Enterprise Grade
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16 space-y-20">
        {/* Design Tokens Section */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
            <Settings className="w-8 h-8 mr-3 text-blue-600" />
            Design Token System
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Color System */}
            <Card variant="elevated" padding="lg">
              <h3 className="text-xl font-semibold mb-4">Color Psychology</h3>
              <div className="space-y-4">
                {/* Primary Colors */}
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Primary Scale</p>
                  <div className="flex space-x-1">
                    {Object.entries(designTokens.colors.primary).map(([key, value]) => (
                      <div
                        key={key}
                        className="w-8 h-8 rounded"
                        style={{ backgroundColor: value }}
                        title={`${key}: ${value}`}
                      />
                    ))}
                  </div>
                </div>
                
                {/* Semantic Colors */}
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Semantic Colors</p>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(designTokens.colors.semantic).map(([name, colors]) => (
                      <div key={name} className="flex items-center space-x-2">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: colors.light }}
                        />
                        <span className="text-sm capitalize">{name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* Typography */}
            <Card variant="elevated" padding="lg">
              <h3 className="text-xl font-semibold mb-4">Typography Hierarchy</h3>
              <div className="space-y-3">
                <div className="text-4xl font-bold text-gray-900">Heading XL</div>
                <div className="text-2xl font-semibold text-gray-800">Heading Large</div>
                <div className="text-xl font-medium text-gray-700">Heading Medium</div>
                <div className="text-lg text-gray-600">Body Large</div>
                <div className="text-base text-gray-600">Body Regular</div>
                <div className="text-sm text-gray-500">Body Small</div>
                <div className="text-xs text-gray-400">Caption</div>
              </div>
            </Card>

            {/* Spacing & Shadows */}
            <Card variant="elevated" padding="lg">
              <h3 className="text-xl font-semibold mb-4">Spatial System</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">8pt Grid System</p>
                  <div className="flex items-end space-x-1">
                    {[4, 8, 16, 24, 32, 48].map(size => (
                      <div
                        key={size}
                        className="bg-blue-500"
                        style={{ width: '8px', height: `${size}px` }}
                        title={`${size}px`}
                      />
                    ))}
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Elevation Levels</p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { name: 'SM', class: 'shadow-sm' },
                      { name: 'MD', class: 'shadow-md' },
                      { name: 'LG', class: 'shadow-lg' },
                      { name: 'XL', class: 'shadow-xl' }
                    ].map(shadow => (
                      <div key={shadow.name} className={`p-3 bg-white rounded-lg ${shadow.class}`}>
                        <span className="text-xs font-medium">{shadow.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Button Components */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
            <Rocket className="w-8 h-8 mr-3 text-blue-600" />
            Interactive Components
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Button Variants */}
            <Card variant="elevated" padding="lg">
              <h3 className="text-xl font-semibold mb-6">Button Variations</h3>
              <div className="space-y-6">
                {/* Primary Buttons */}
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-3">Primary Actions</p>
                  <div className="flex flex-wrap gap-3">
                    <Button variant="primary" size="xs" icon={Plus}>Add Item</Button>
                    <Button variant="primary" size="sm" icon={Download}>Download</Button>
                    <Button variant="primary" size="md" icon={Upload}>Upload Files</Button>
                    <Button variant="primary" size="lg" icon={Rocket}>Launch</Button>
                  </div>
                </div>

                {/* Semantic Buttons */}
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-3">Semantic Actions</p>
                  <div className="flex flex-wrap gap-3">
                    <Button variant="success" icon={CheckCircle}>Approve</Button>
                    <Button variant="warning" icon={AlertCircle}>Review</Button>
                    <Button variant="danger" icon={Trash2}>Delete</Button>
                    <Button variant="outline" icon={Edit}>Edit</Button>
                  </div>
                </div>

                {/* Loading States */}
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-3">Loading States</p>
                  <div className="flex flex-wrap gap-3">
                    <Button variant="primary" loading>Processing...</Button>
                    <Button variant="secondary" loading>Saving</Button>
                    <Button variant="success" loading size="lg">Uploading</Button>
                  </div>
                </div>
              </div>
            </Card>

            {/* Interactive Elements */}
            <Card variant="elevated" padding="lg">
              <h3 className="text-xl font-semibold mb-6">Advanced Interactions</h3>
              <div className="space-y-6">
                {/* Tooltips */}
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-3">Contextual Information</p>
                  <div className="flex flex-wrap gap-3">
                    <Tooltip content="This action cannot be undone" position="top">
                      <Button variant="danger" icon={Trash2}>Delete</Button>
                    </Tooltip>
                    <Tooltip content="Save your progress before continuing" position="bottom">
                      <Button variant="primary" icon={Plus}>Create New</Button>
                    </Tooltip>
                    <Tooltip content="Advanced settings and configuration" position="right">
                      <Button variant="ghost" icon={Settings}>Settings</Button>
                    </Tooltip>
                  </div>
                </div>

                {/* Badges with Actions */}
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-3">Status Indicators</p>
                  <div className="flex flex-wrap gap-3">
                    <Badge variant="success" icon={CheckCircle} pulse>Active</Badge>
                    <Badge variant="warning" icon={AlertCircle}>Pending</Badge>
                    <Badge variant="danger" icon={XCircle}>Failed</Badge>
                    <Badge variant="info" icon={Info}>Information</Badge>
                    <Badge variant="primary" icon={Star} removable onRemove={() => {}}>Premium</Badge>
                  </div>
                </div>

                {/* Modal Trigger */}
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-3">Modal Interactions</p>
                  <Button 
                    variant="outline" 
                    icon={Settings}
                    onClick={() => setModalOpen(true)}
                  >
                    Open Enterprise Modal
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Form Components */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
            <Edit className="w-8 h-8 mr-3 text-blue-600" />
            Professional Forms
          </h2>
          
          <Card variant="elevated" padding="xl">
            <div className="max-w-2xl mx-auto">
              <h3 className="text-2xl font-semibold text-center mb-8">Enterprise Account Setup</h3>
              
              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Full Name"
                    placeholder="Enter your full name"
                    icon={User}
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    fullWidth
                  />
                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="Enter your email"
                    icon={Mail}
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    fullWidth
                  />
                </div>

                <Select
                  label="Role"
                  placeholder="Select your role"
                  options={[
                    { value: 'admin', label: 'System Administrator' },
                    { value: 'manager', label: 'Fleet Manager' },
                    { value: 'operator', label: 'Operations Specialist' },
                    { value: 'analyst', label: 'Data Analyst' }
                  ]}
                  value={formData.role}
                  onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                  fullWidth
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Password"
                    type="password"
                    placeholder="Create a secure password"
                    icon={Lock}
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    helpText="Must be at least 8 characters with numbers and symbols"
                    fullWidth
                  />
                  <Input
                    label="Confirm Password"
                    type="password"
                    placeholder="Confirm your password"
                    icon={Lock}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    error={formData.confirmPassword && formData.password !== formData.confirmPassword ? "Passwords don't match" : undefined}
                    fullWidth
                  />
                </div>

                <div className="pt-6">
                  <Button 
                    type="submit" 
                    variant="primary" 
                    size="lg" 
                    icon={Rocket}
                    fullWidth
                  >
                    Create Enterprise Account
                  </Button>
                </div>
              </form>
            </div>
          </Card>
        </section>

        {/* Data Display */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
            <BarChart3 className="w-8 h-8 mr-3 text-blue-600" />
            Data Visualization
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Metric Cards */}
            {[
              { title: 'Total Revenue', value: '$2.4M', change: '+12.5%', icon: BarChart3, variant: 'success' as const },
              { title: 'Active Users', value: '24,586', change: '+8.2%', icon: Users, variant: 'primary' as const },
              { title: 'Fleet Utilization', value: '87.3%', change: '-2.1%', icon: Globe, variant: 'warning' as const }
            ].map((metric) => (
              <Card key={metric.title} variant="interactive" padding="lg" hover>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{metric.value}</p>
                    <Badge variant={metric.variant} size="sm" className="mt-3">
                      {metric.change}
                    </Badge>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <metric.icon className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Loading States */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-4 gap-6">
            <Card padding="lg">
              <Loading variant="spinner" size="md" text="Loading data..." />
            </Card>
            <Card padding="lg">
              <Loading variant="dots" size="lg" text="Processing..." />
            </Card>
            <Card padding="lg">
              <Loading variant="skeleton" />
            </Card>
            <Card padding="lg">
              <Loading variant="shimmer" />
            </Card>
          </div>

          {/* Empty State */}
          <div className="mt-8">
            <Card variant="outlined" padding="xl">
              <EmptyState
                icon={BarChart3}
                title="No Analytics Data"
                description="Start collecting data to see powerful insights and analytics for your fleet operations."
                size="lg"
                action={
                  <Button variant="primary" icon={Plus}>
                    Start Data Collection
                  </Button>
                }
              />
            </Card>
          </div>
        </section>

        {/* Toast Notifications */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
            <Bell className="w-8 h-8 mr-3 text-blue-600" />
            Notification System
          </h2>
          
          <Card variant="elevated" padding="lg">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button 
                variant="success" 
                icon={CheckCircle}
                onClick={() => addToast({
                  title: 'Success!',
                  message: 'Your action was completed successfully.',
                  variant: 'success'
                })}
                fullWidth
              >
                Success Toast
              </Button>
              <Button 
                variant="warning" 
                icon={AlertCircle}
                onClick={() => addToast({
                  title: 'Warning',
                  message: 'Please review this action before proceeding.',
                  variant: 'warning'
                })}
                fullWidth
              >
                Warning Toast
              </Button>
              <Button 
                variant="danger" 
                icon={XCircle}
                onClick={() => addToast({
                  title: 'Error',
                  message: 'Something went wrong. Please try again.',
                  variant: 'danger'
                })}
                fullWidth
              >
                Error Toast
              </Button>
              <Button 
                variant="outline" 
                icon={Info}
                onClick={() => addToast({
                  title: 'Information',
                  message: 'Here is some helpful information for you.',
                  variant: 'info'
                })}
                fullWidth
              >
                Info Toast
              </Button>
            </div>
          </Card>
        </section>
      </div>

      {/* Enterprise Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Enterprise Configuration"
        size="lg"
        footer={
          <div className="flex justify-end space-x-3">
            <Button variant="ghost" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" icon={CheckCircle}>
              Save Configuration
            </Button>
          </div>
        }
      >
        <div className="space-y-6">
          <p className="text-gray-600 leading-relaxed">
            Configure your enterprise settings with precision and control. This modal demonstrates
            our sophisticated overlay system with blur effects, focus management, and accessibility features.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="API Endpoint" placeholder="https://api.example.com" fullWidth />
            <Input label="Timeout (ms)" placeholder="5000" type="number" fullWidth />
          </div>
          
          <Select
            label="Environment"
            placeholder="Select environment"
            options={[
              { value: 'production', label: 'Production' },
              { value: 'staging', label: 'Staging' },
              { value: 'development', label: 'Development' }
            ]}
            fullWidth
          />
        </div>
      </Modal>

      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 space-y-3">
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            id={toast.id}
            title={toast.title}
            message={toast.message}
            variant={toast.variant}
            onDismiss={removeToast}
          />
        ))}
      </div>
    </div>
  )
}

export default DesignSystemShowcase
