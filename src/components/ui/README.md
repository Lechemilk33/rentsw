# Enterprise Design System Documentation

## Overview
A modular, billion-dollar enterprise design system following Apple/Microsoft UI standards. Built for accessibility, performance, and enterprise scalability.

## Installation & Usage

### Tree-Shakeable Imports (Recommended)
```typescript
// Import only what you need
import { Button, Card, Badge } from '@/components/ui'
import { colors, typography } from '@/components/ui/tokens'

// Or import individual components
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
```

### Legacy Import (Backward Compatibility)
```typescript
// Import everything (larger bundle)
import { EnterpriseUI, designTokens } from '@/components/ui'

const { Button, Card, Badge } = EnterpriseUI
```

## Components

### Button
Enterprise-grade interactive element with physics-based micro-interactions.

```tsx
<Button variant="primary" size="md" loading={false}>
  Click Me
</Button>

<Button variant="outline" icon={PlusIcon} iconPosition="left">
  Add Item
</Button>
```

**Props:**
- `variant`: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'ghost' | 'outline'
- `size`: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
- `loading`: boolean
- `icon`: LucideIcon
- `iconPosition`: 'left' | 'right'

### Card
Sophisticated container with elevation system and hover effects.

```tsx
<Card variant="elevated" padding="lg" hover>
  <h3>Card Title</h3>
  <p>Card content with professional styling.</p>
</Card>
```

**Props:**
- `variant`: 'default' | 'elevated' | 'interactive' | 'outlined'
- `padding`: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'
- `elevation`: 'none' | 'sm' | 'md' | 'lg' | 'xl'
- `hover`: boolean
- `gradient`: boolean

### Badge
Status indicators with semantic meaning and enterprise styling.

```tsx
<Badge variant="success" size="md">
  Active
</Badge>

<Badge variant="warning" icon={AlertIcon} removable onRemove={() => {}}>
  Warning
</Badge>
```

**Props:**
- `variant`: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'
- `size`: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
- `icon`: LucideIcon
- `pulse`: boolean
- `removable`: boolean

### Input
Professional form controls with floating labels and sophisticated interactions.

```tsx
<Input
  label="Email Address"
  type="email"
  placeholder="Enter your email"
  error={errors.email}
  helpText="We'll never share your email"
  icon={MailIcon}
  fullWidth
/>
```

**Props:**
- `label`: string
- `error`: string
- `helpText`: string
- `icon`: LucideIcon
- `iconPosition`: 'left' | 'right'
- `variant`: 'default' | 'filled' | 'outlined'
- `size`: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
- `loading`: boolean

### Loading
Sophisticated loading states with skeleton screens and spinners.

```tsx
<Loading variant="spinner" size="lg" text="Loading data..." />

<Loading variant="skeleton" overlay />
```

**Props:**
- `variant`: 'spinner' | 'skeleton'
- `size`: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
- `text`: string
- `overlay`: boolean
- `fullScreen`: boolean

## Design Tokens

### Colors
```typescript
import { colors } from '@/components/ui/tokens'

// Primary brand colors
colors.primary[500] // #3b82f6
colors.primary[600] // #2563eb

// Semantic colors
colors.semantic.success.light // #10b981
colors.semantic.danger.bg     // #fef2f2

// Neutral system
colors.neutral[50]  // #fafafa
colors.neutral[900] // #171717
```

### Typography
```typescript
import { typography } from '@/components/ui/tokens'

// Font families
typography.fontFamily.sans // ['-apple-system', 'BlinkMacSystemFont', ...]
typography.fontFamily.mono // ['SF Mono', 'Monaco', ...]

// Font sizes with line heights
typography.fontSize.xs   // ['0.75rem', { lineHeight: '1rem' }]
typography.fontSize.lg   // ['1.125rem', { lineHeight: '1.75rem' }]

// Font weights
typography.fontWeight.medium    // '500'
typography.fontWeight.semibold  // '600'
```

### Spacing & Shadows
```typescript
import { spacing, shadows } from '@/components/ui/tokens'

// 8pt grid system
spacing[2]  // '8px'  (base unit)
spacing[4]  // '16px'
spacing[8]  // '32px'

// Elevation shadows
shadows.sm  // '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
shadows.lg  // '0 10px 15px -3px rgba(0, 0, 0, 0.1), ...'
```

## File Structure

```
src/components/ui/
├── tokens/
│   ├── colors.ts      # Color system & semantic meanings
│   ├── typography.ts  # Font families, sizes, weights
│   ├── spacing.ts     # 8pt grid & border radius
│   ├── shadows.ts     # Elevation & animation curves
│   └── index.ts       # Consolidated token exports
├── Button.tsx         # Enterprise button component
├── Card.tsx          # Sophisticated container
├── Badge.tsx         # Status indicators
├── Input.tsx         # Professional form controls
├── Loading.tsx       # Loading states & skeletons
├── types.ts          # Shared TypeScript interfaces
└── index.ts          # Main component exports
```

## Benefits

### Performance
- **Tree-shakeable**: Import only components you use
- **Small bundles**: Each component ~100-150 lines
- **Optimized animations**: 60fps spring physics

### Developer Experience
- **Bot-friendly**: Small files for better AI assistance
- **TypeScript**: Comprehensive type definitions
- **Consistent API**: Shared interfaces across components

### Enterprise Features
- **WCAG AAA compliant**: Full accessibility support
- **Design tokens**: Systematic consistency
- **Professional polish**: Apple/Microsoft level quality
- **Scalable architecture**: Multi-tenant SaaS ready

## Migration from Monolithic File

### Before (1,383 lines)
```typescript
import { Button, Card, Badge } from './professionalComponents'
```

### After (Modular)
```typescript
import { Button, Card, Badge } from '@/components/ui'
// or
import { Button } from '@/components/ui/Button'
```

All functionality is preserved while improving maintainability, performance, and AI development assistance.
