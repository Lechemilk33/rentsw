# Settings Page Documentation

## Overview
Enterprise-grade settings page for the fleet management SaaS application, designed with billion-dollar company standards in mind.

## Features

### 🧑‍💼 Profile Settings
- **Personal Information**: Full name, email, phone, and role management
- **Profile Photo**: Avatar upload with file type and size validation
- **Preferences**: Language and timezone selection
- **Role Management**: Badge display with admin-only role changes

### 🔔 Notification Settings  
- **Fleet Notifications**: Maintenance alerts, booking notifications, low fuel alerts
- **System Notifications**: Payment reminders, system updates, marketing emails
- **Toggle Controls**: Visual on/off switches with immediate feedback

### 🏢 Location Settings
- **Company Information**: Company name, address, phone, and email
- **Business Hours**: Day-by-day hour configuration with closed day toggle
- **Timezone & Currency**: Regional settings management

### 🔒 Security Settings
- **Password Management**: Current/new password change with visibility toggle
- **Two-Factor Authentication**: 2FA setup and management
- **Active Sessions**: Session monitoring and management
- **Security Badges**: Visual security status indicators

### 💳 Billing & Account (Placeholder)
- Ready for subscription management integration
- Billing history and payment methods
- Account upgrade/downgrade functionality

## Technical Implementation

### Architecture
- **Component**: `app/routes/operations.settings.tsx`
- **Navigation**: Tab-based interface with enterprise sidebar
- **State Management**: React hooks with proper type safety
- **Form Handling**: Controlled inputs with validation ready

### Design System Integration
- **UI Components**: Uses modular design system from `src/components/ui/`
- **Icons**: Phosphor icons with proper weight system
- **Typography**: Design tokens for consistent styling
- **Spacing**: Systematic spacing using design tokens

### Accessibility Features
- **Form Labels**: Proper `htmlFor` and `id` associations
- **ARIA Support**: Screen reader friendly navigation
- **Keyboard Navigation**: Full tab-order support
- **Visual Feedback**: Clear state indicators and loading states

### Security Considerations
- **Password Visibility**: Toggle for secure password input
- **Session Management**: Active session monitoring
- **Role-Based Access**: Proper permission checking
- **Data Validation**: Input validation and sanitization

## Integration Points

### Supabase Integration
- **User Profile**: `auth.users` table integration
- **Location Settings**: Multi-tenant location configuration
- **Notification Preferences**: User-specific settings storage
- **Security Settings**: Authentication and session management

### Route Integration
- **Parent Route**: Integrated into `operations.tsx` tab system
- **Navigation**: Accessible via Operations sidebar
- **URL Structure**: `/operations?tab=settings`
- **State Persistence**: Tab state maintained across navigation

## Enterprise Standards

### Visual Design
- **Apple/Microsoft Inspired**: Clean, professional interface
- **Visual Hierarchy**: Clear information architecture
- **Consistent Spacing**: Systematic grid and spacing
- **Premium Aesthetics**: High-end visual design

### User Experience
- **Intuitive Navigation**: Logical tab organization
- **Quick Access**: Most-used settings prominently displayed
- **Bulk Operations**: Efficient batch updates where applicable
- **Immediate Feedback**: Real-time validation and updates

### Performance
- **Lazy Loading**: Efficient data loading strategies
- **Optimistic Updates**: Immediate UI feedback
- **Error Handling**: Graceful failure states
- **Loading States**: Professional loading indicators

## Usage

### Accessing Settings
1. Navigate to Operations dashboard
2. Click "Settings" in the sidebar
3. Use tab navigation to access different setting categories

### Updating Profile
1. Go to Profile tab
2. Edit personal information fields
3. Click "Save Changes" to persist updates

### Managing Notifications
1. Navigate to Notifications tab
2. Toggle individual notification types
3. Changes save automatically

### Configuring Business Hours
1. Access Location tab
2. Set hours for each day of the week
3. Use "Closed" toggle for non-operating days

## Future Enhancements

### Planned Features
- **Advanced Security**: MFA options, security keys
- **Team Management**: User role and permission management
- **API Keys**: Service integration management
- **Audit Logs**: Settings change history
- **Backup/Restore**: Configuration backup options

### Integration Opportunities
- **Single Sign-On**: Enterprise SSO integration
- **Third-party APIs**: Fleet management service connections
- **Mobile Apps**: Settings sync across platforms
- **Webhook Management**: Event notification setup

## Development Notes

### Component Structure
```
operations.settings.tsx
├── Settings Navigation (6 tabs)
├── Profile Settings
│   ├── Personal Information
│   ├── Avatar Management
│   └── Preferences
├── Notification Settings
├── Location Settings
│   ├── Company Info
│   └── Business Hours
├── Security Settings
│   ├── Password Management
│   ├── 2FA Setup
│   └── Session Management
└── Save Actions
```

### State Management
- Local state for form inputs
- Supabase integration for persistence
- Error handling with user feedback
- Loading states for all async operations

Built with React Router v7, Supabase, and enterprise-grade design principles for a premium fleet management experience.
