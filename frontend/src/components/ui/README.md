# Reusable UI Components

This directory contains reusable UI components that follow the design system and reduce code duplication across the project.

## Components Overview

### 1. CustomInput
A flexible input component with multiple variants and features.

**Props:**
- `variant`: 'default' | 'search' | 'password' | 'edit-large' | 'edit-small'
- `showPasswordToggle`: boolean (for password inputs)
- `showClearButton`: boolean (for search inputs)
- `onClear`: () => void (clear button callback)
- `searchIcon`: boolean (show search icon)
- `label`: string (optional label)
- `error`: string (error message)
- `containerClassName`: string (container styling)

**Usage Examples:**
```tsx
// Basic input
<CustomInput placeholder="Email" />

// Password input with toggle
<CustomInput 
  variant="password" 
  showPasswordToggle={true} 
  placeholder="Password" 
/>

// Search input with clear button
<CustomInput 
  variant="search" 
  searchIcon={true}
  showClearButton={true}
  onClear={handleClear}
  placeholder="Search movies..." 
/>

// Edit form inputs
<CustomInput 
  variant="edit-large" 
  placeholder="Title" 
  error={errors.title?.message} 
/>
```

### 2. PrimaryButton
A comprehensive button component with multiple variants, sizes, and states.

**Props:**
- `variant`: 'primary' | 'secondary' | 'danger' | 'cancel' | 'update' | 'delete' | 'login' | 'logout'
- `size`: 'sm' | 'md' | 'lg' | 'login' | 'edit' | 'pagination'
- `isLoading`: boolean
- `loadingText`: string
- `icon`: ReactNode
- `iconPosition`: 'left' | 'right'
- `fullWidth`: boolean

**Usage Examples:**
```tsx
// Login button
<PrimaryButton 
  variant="login" 
  size="login" 
  isLoading={isLoading}
  loadingText="Signing in..."
>
  Login
</PrimaryButton>

// Edit form buttons
<PrimaryButton 
  variant="cancel" 
  size="edit"
  onClick={handleCancel}
>
  Cancel
</PrimaryButton>

<PrimaryButton 
  variant="update" 
  size="edit"
  isLoading={isUpdating}
  loadingText="Updating..."
>
  Update
</PrimaryButton>

// Button with icon
<PrimaryButton 
  variant="logout"
  icon={<LogOut className="w-4 h-4" />}
  iconPosition="right"
>
  Logout
</PrimaryButton>
```

### 3. CustomCard
A flexible card component for different use cases.

**Props:**
- `variant`: 'movie' | 'modal' | 'form' | 'default'
- `hover`: boolean (hover effects)
- `clickable`: boolean (click interactions)
- `onClick`: () => void
- `className`: string

**Usage Examples:**
```tsx
// Basic card
<CustomCard>
  <h3>Card Title</h3>
  <p>Card content</p>
</CustomCard>

// Movie card
<CustomCard variant="movie" hover={true}>
  <img src="poster.jpg" alt="Movie" />
  <h3>Movie Title</h3>
  <p>2023</p>
</CustomCard>

// Modal card
<CustomCard variant="modal">
  <h2>Modal Title</h2>
  <p>Modal content</p>
</CustomCard>
```

### 4. CustomModal
A flexible modal component with different sizes and variants.

**Props:**
- `isOpen`: boolean
- `onClose`: () => void
- `title`: string
- `size`: 'sm' | 'md' | 'lg' | 'xl'
- `variant`: 'default' | 'confirmation' | 'form'
- `showCloseButton`: boolean
- `closeOnBackdrop`: boolean
- `closeOnEscape`: boolean

**Usage Examples:**
```tsx
// Basic modal
<CustomModal 
  isOpen={isOpen}
  onClose={handleClose}
  title="Modal Title"
  size="md"
>
  <p>Modal content</p>
</CustomModal>

// Confirmation modal
<ConfirmationModal
  isOpen={showDelete}
  onClose={() => setShowDelete(false)}
  onConfirm={handleDelete}
  title="Delete Movie"
  message="Are you sure?"
  variant="danger"
  isLoading={isDeleting}
/>
```

## Design System Integration

All components follow the established design system:

### Typography
- **Headings**: Montserrat font with specific weights and sizes
- **Body Text**: Consistent line heights and letter spacing
- **Button Text**: Proper font weights and sizes

### Colors
- **Primary**: #2BD17E (green)
- **Error**: #EB5757 (red)
- **Background**: #093545 (dark blue)
- **Input**: #224957 (medium blue)
- **Card**: #092C39 (darker blue)

### Spacing
- **8px base unit**: All spacing follows 8px multiples
- **Consistent padding**: Standardized padding across components
- **Responsive margins**: Proper spacing for different screen sizes

### Sizing
- **Button sizes**: sm (36px), md (48px), lg (56px), login (54px), edit (44px)
- **Input heights**: Standardized input field heights
- **Card dimensions**: Consistent card sizing

## Benefits

1. **Consistency**: All components follow the same design patterns
2. **Maintainability**: Changes to design system automatically apply to all components
3. **Reusability**: Components can be used across different pages and contexts
4. **Flexibility**: Extensive prop configuration allows for various use cases
5. **Type Safety**: Full TypeScript support with proper prop types
6. **Accessibility**: Built-in accessibility features and keyboard navigation

