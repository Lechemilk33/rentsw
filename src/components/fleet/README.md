# Fleet Components

Modular fleet management components following enterprise software architecture patterns.

## Structure

```
src/components/fleet/
├── index.ts                    # Centralized exports
├── VehicleImage.tsx           # Vehicle photo display with lazy loading
├── StatusDropdown.tsx         # Vehicle status badges
├── WashStatusToggle.tsx       # Interactive wash status button
├── VehicleTable.tsx           # Main data table component
├── FleetFilters.tsx           # Search and filter controls
├── FleetPagination.tsx        # Pagination controls
├── FleetEmptyState.tsx        # Empty state display
└── README.md                  # This file
```

## Component Overview

### VehicleImage.tsx
- **Purpose**: Display vehicle photos with lazy loading and fallback placeholders
- **Features**: Multiple sizes (sm/md/lg), error handling, loading states
- **Dependencies**: Phosphor React icons

### StatusDropdown.tsx
- **Purpose**: Vehicle status badge display with consistent styling
- **Features**: Color-coded badges, icon integration, accessibility
- **Dependencies**: UI Badge component, Phosphor React icons

### WashStatusToggle.tsx
- **Purpose**: Interactive wash status toggle with optimistic updates
- **Features**: Loading states, visual feedback, accessibility
- **Dependencies**: Phosphor React icons

### VehicleTable.tsx
- **Purpose**: Main data table with responsive design and no horizontal scroll
- **Features**: Sorting, row actions, optimized column widths (30%/15%/12%/18%/25%)
- **Dependencies**: All other fleet components

### FleetFilters.tsx
- **Purpose**: Search and filter controls with debounced input
- **Features**: Status filtering, live vehicle counts, responsive layout
- **Dependencies**: UI Input and Button components

### FleetPagination.tsx
- **Purpose**: Pagination controls with page info
- **Features**: Previous/next navigation, page numbers, item counts
- **Dependencies**: UI Button component

### FleetEmptyState.tsx
- **Purpose**: Contextual empty state with appropriate actions
- **Features**: Different states for filters vs no data, clear action buttons
- **Dependencies**: UI Button component, Phosphor React icons

## Usage

```tsx
import { 
  VehicleTable, 
  FleetFilters, 
  FleetPagination, 
  FleetEmptyState,
  type Vehicle,
  type SortConfig,
  type FleetStatus
} from '../../src/components/fleet'
```

## Design Patterns

1. **Single Responsibility**: Each component has one clear purpose
2. **Composability**: Components work together but remain independent
3. **Type Safety**: Full TypeScript support with exported types
4. **Performance**: Memoization, lazy loading, optimistic updates
5. **Accessibility**: ARIA labels, keyboard navigation, semantic HTML

## File Structure Benefits

- **Clean Routing**: Only actual pages in `/routes/`, components in `/src/components/`
- **Maintainability**: Easy to find, edit, and test individual components
- **Reusability**: Components can be imported anywhere in the application
- **Code Organization**: Logical grouping by feature domain
- **Team Collaboration**: Clear boundaries for different developers

## Future Enhancements

- [ ] VehicleModal.tsx - Vehicle details modal
- [ ] CalculatorModal.tsx - Gas calculator modal  
- [ ] PhotoTooltip.tsx - Photo preview tooltip
- [ ] BulkActions.tsx - Bulk operation controls
- [ ] VehicleForm.tsx - Add/edit vehicle form
