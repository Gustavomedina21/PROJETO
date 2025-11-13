# Design Guidelines: Catálogo de Livros e Filmes

## Design Approach
**System-Based Approach** using Material Design principles adapted for catalog management, with visual enhancements for media content presentation. This combines the structural clarity needed for data management with the visual appeal appropriate for books and films.

## Core Layout Strategy

### Application Structure
- **Top Navigation Bar**: Fixed header (h-16) with logo, search bar, and "Adicionar Item" button
- **Main Content Area**: max-w-7xl centered container with responsive padding (px-4 md:px-8)
- **Two Primary Views**:
  - **Grid View** (default): Card-based grid layout for browsing
  - **List View** (toggle option): Compact table layout for data management

### Spacing System
Use Tailwind spacing units: **4, 6, 8, 12, 16** as primary scale
- Component padding: p-6
- Section spacing: my-12
- Card gaps: gap-6
- Form field spacing: space-y-4

## Typography Hierarchy

### Font Stack
- **Primary**: Inter (Google Fonts) - body text and UI
- **Display**: Poppins (Google Fonts) - headings and titles

### Type Scale
- Page Title: text-3xl font-bold (Poppins)
- Item Title: text-xl font-semibold (Poppins)
- Section Headers: text-lg font-medium (Inter)
- Body Text: text-base (Inter)
- Metadata: text-sm text-gray-600
- Helper Text: text-xs text-gray-500

## Component Library

### 1. Navigation Bar
- Height: h-16, fixed top with shadow
- Contains: Logo (left), centered search bar (max-w-2xl), "Novo Item" button (right)
- Search input: rounded-full with icon, focus ring effect

### 2. Item Cards (Grid View)
**Structure**:
- Aspect ratio container for cover image placeholder (3:4 ratio)
- Title and author below image
- Star rating component (5 stars, filled/outlined)
- Year and genre as small metadata tags
- Hover effect: subtle lift (transform) and shadow increase

**Dimensions**: Each card in responsive grid:
- Mobile: 1 column
- Tablet: 2 columns (md:grid-cols-2)
- Desktop: 3-4 columns (lg:grid-cols-3 xl:grid-cols-4)

### 3. Star Rating System
**Display Mode** (read-only):
- 5 stars horizontally aligned
- Filled stars in primary color, empty stars in gray-300
- Show average rating number beside stars (e.g., "4.2")
- Display vote count in smaller text "(23 avaliações)"

**Interactive Mode** (for rating):
- Hoverable stars with fill preview
- Click to submit rating (1-5)
- Visual feedback on selection
- Larger touch targets for mobile (min 44px)

### 4. Detail View Modal/Page
**Layout**: Two-column layout on desktop, stacked on mobile
- Left column: Cover image (larger), star rating, action buttons
- Right column: Full details (título, autor, ano, gênero, detalhes expandido)
- Action buttons: Editar (primary), Excluir (danger outline)

### 5. Forms (Add/Edit Item)
**Structure**:
- Modal overlay or dedicated page
- Single column form layout, max-w-2xl
- Input fields: rounded-lg borders, focus:ring effect
- Field grouping:
  - Título (text input, required)
  - Autor/Diretor (text input, required)
  - Ano (number input, 4 digits)
  - Gênero (dropdown or text input)
  - Detalhes (textarea, rows-4)
- Submit button: full width on mobile, auto on desktop
- Cancel button: secondary style

### 6. Search Results
- Dropdown below search bar with matched items
- Each result shows: cover thumbnail, title, author, rating
- Click to navigate to detail view
- "Ver todos resultados" link at bottom if >5 results

### 7. Empty States
- When no items: centered illustration placeholder, "Adicione seu primeiro item" CTA
- When search returns nothing: "Nenhum resultado encontrado" with suggestion to adjust search

### 8. Action Buttons
**Primary Button**: Rounded corners (rounded-lg), medium padding (px-6 py-3)
**Secondary Button**: Outlined style with border
**Danger Button**: For delete actions, red accent
**Icon Buttons**: Circular or square minimal style for edit/delete in lists

## Images

### Cover Placeholders
For items without cover images, use:
- Gradient backgrounds with centered book/film icon
- Different gradient colors based on genre category
- Icon size: 48px or 64px depending on card size

### Optional Actual Covers
If implementing real cover images:
- Allow URL input in form
- Use object-fit: cover for consistent aspect ratios
- Lazy loading for performance
- Fallback to placeholder on error

## Interaction Patterns

### Grid/List Toggle
- Toggle button in top-right near search
- Icon-based switch (grid icon / list icon)
- Smooth transition between views

### Inline Editing
- List view: hover row shows edit/delete icons on right
- Quick edit: click to edit inline without modal

### Delete Confirmation
- Modal overlay with item title
- "Tem certeza?" message
- Two buttons: "Cancelar" and "Sim, excluir" (danger)

### Loading States
- Skeleton screens for initial load
- Spinner overlay for actions (save, delete)
- Shimmer effect on skeleton cards

## Responsive Behavior

**Mobile (< 768px)**:
- Single column grid
- Full-width search bar
- Hamburger menu if needed
- Bottom sheet for filters/actions

**Tablet (768px - 1024px)**:
- 2 column grid
- Side drawer for filters

**Desktop (> 1024px)**:
- 3-4 column grid
- All controls visible
- Sidebar filters (optional)

## Accessibility

- All interactive elements: min-height 44px for touch targets
- Focus indicators on all focusable elements
- Aria labels for icon buttons
- Keyboard navigation support (Tab, Enter, Escape)
- Screen reader announcements for dynamic content changes