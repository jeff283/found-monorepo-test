# BusinessSetupLayout Usage Examples

## Updated BusinessSetupLayout Component

The BusinessSetupLayout component has been updated with a clean, Notion-like design that includes step names and maintains brand consistency.

## Key Features

- ✅ **Step names displayed** alongside step numbers
- ✅ **Clean, modern design** inspired by Notion's UI
- ✅ **Brand colors** (`#00B5C3`) maintained throughout
- ✅ **Smooth animations** and transitions
- ✅ **Responsive design** with proper spacing
- ✅ **Accessibility improvements** with better contrast

## Usage Examples

### Basic Usage (Default Step Names)
```tsx
<BusinessSetupLayout currentStep={2} totalSteps={3}>
  {/* Your page content */}
</BusinessSetupLayout>
```

Default step names: `["Personal Account", "Organization", "Verification"]`

### Custom Step Names
```tsx
<BusinessSetupLayout 
  currentStep={2} 
  totalSteps={4}
  stepNames={["Account Setup", "Company Details", "Verification", "Review"]}
>
  {/* Your page content */}
</BusinessSetupLayout>
```

### With Custom Back Handler
```tsx
<BusinessSetupLayout 
  currentStep={1} 
  totalSteps={3}
  stepNames={["Profile", "Organization", "Complete"]}
  onBack={() => router.push('/custom-back-route')}
>
  {/* Your page content */}
</BusinessSetupLayout>
```

### Without Back Button
```tsx
<BusinessSetupLayout 
  currentStep={3} 
  totalSteps={3}
  showBackButton={false}
>
  {/* Your page content */}
</BusinessSetupLayout>
```

## Design Improvements

### Before
- Bootstrap-like appearance
- Basic step indicators
- No step names
- Heavy shadows and borders

### After
- **Clean, Notion-inspired design**
- **Step names with current step indicator**
- **Subtle shadows and modern borders**
- **Brand color integration** (`#00B5C3`)
- **Smooth hover effects and transitions**
- **Better typography and spacing**

## Step Indicator Features

1. **Visual States:**
   - ✅ Completed steps: Brand color background with checkmark
   - 🔵 Current step: Brand color with ring effect + "Current step" label
   - ⚪ Future steps: Gray background with step number

2. **Step Names:**
   - Displayed next to each step indicator
   - Color-coded based on step state
   - "Current step" subtitle for active step

3. **Connection Lines:**
   - Subtle lines connecting steps
   - Brand color for completed connections
   - Gray for incomplete connections

## Props Interface

```typescript
interface BusinessSetupLayoutProps {
  children: React.ReactNode;
  currentStep: number;
  totalSteps: number;
  stepNames?: string[];           // New: Custom step names
  onBack?: () => void;
  showBackButton?: boolean;
}
```

## Recommended Step Names by Flow

### Institution Registration Flow
```typescript
stepNames={["Personal Account", "Organization", "Verification"]}
```

### Organization Setup Flow
```typescript
stepNames={["Basic Info", "Verification", "Review"]}
```

### Profile Setup Flow
```typescript
stepNames={["Account", "Profile", "Preferences", "Complete"]}
```

The updated design provides a much cleaner, more professional appearance while maintaining your brand identity and improving the user experience with clear step progression.
