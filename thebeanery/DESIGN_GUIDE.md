# 🎨 The Beanery - Design Guide

## Color Palette

### Primary Colors (Soft Blue Tones)
- **Primary Blue**: `#5e8db8` - Main brand color
- **Secondary Blue**: `#7a9aa8` - Accent color
- **Light Blue**: `#e3edf7` - Background highlights
- **Pale Blue**: `#a8c5e0` - Borders and accents
- **Deep Blue**: `#3d6a94` - Hover states
- **Sky Blue**: `#4a7ba0` - Active states

### Secondary Colors (Beige & Neutral Tones)
- **Soft Beige**: `#d4ddd4` - Secondary backgrounds
- **Light Cream**: `#f8fbff` - Card backgrounds
- **Warm Gray**: `#4a5568` - Body text
- **Cool Gray**: `#718096` - Secondary text
- **Dark Gray**: `#2d3748` - Headings
- **Pale Gray**: `#f5f7fa` - Page background
- **Off White**: `#ffffff` - Pure white elements

## Design Principles

### 1. **Soft & Professional**
- Gradient backgrounds for depth
- Smooth transitions and animations
- Rounded corners (12px - 24px)
- Subtle shadows for elevation

### 2. **Light on Eyes**
- Pastel color scheme
- High contrast for readability
- No harsh colors
- Gentle gradients

### 3. **Modern & Clean**
- Ample white space
- Clear typography hierarchy
- Consistent spacing (1rem, 1.5rem, 2rem)
- Minimalist approach

## Typography

### Font Families
- **Display Font**: 'Pacifico' (cursive) - For headings and branding
- **Body Font**: 'Helvetica Neue', Helvetica, Arial, sans-serif

### Font Sizes
- **Hero Title**: 4rem (Mobile: 2rem)
- **Page Title**: 2.8rem (Mobile: 1.8rem)
- **Section Title**: 2.4rem (Mobile: 2rem)
- **Heading**: 1.6rem - 2rem
- **Body**: 1.05rem - 1.2rem
- **Small**: 0.95rem

### Font Weights
- **Regular**: 400
- **Medium**: 500
- **Semibold**: 600
- **Bold**: 700

## Components

### Headers
- Gradient background: `#e3edf7 → #d4ddd4`
- Sticky positioning
- Soft shadow: `0 4px 12px rgba(100, 149, 237, 0.08)`
- Backdrop blur for modern effect

### Cards (Menu Items, Best Sellers)
- White to pale blue gradient background
- Border radius: 16px
- Shadow: `0 8px 24px rgba(94, 141, 184, 0.12)`
- Hover: Lift effect with enhanced shadow
- Border: `1px solid rgba(168, 197, 224, 0.2)`

### Buttons
- Primary: Blue gradient `#5e8db8 → #7a9aa8`
- Hover: Darker gradient + lift effect
- Border radius: 12px
- Shadow: `0 4px 12px rgba(94, 141, 184, 0.2)`
- Font weight: 600

### Form Elements
- Border: `2px solid #a8c5e0`
- Border radius: 12px
- Focus: Blue border with soft glow
- Placeholder: Light gray `#a0aec0`

### Modal
- Backdrop: Blurred blue overlay
- Content: White gradient background
- Shadow: `0 12px 40px rgba(94, 141, 184, 0.2)`
- Animation: Fade in + slide up

## Effects & Animations

### Transitions
- Standard: `all 0.3s ease`
- Complex: `all 0.4s cubic-bezier(0.4, 0, 0.2, 1)`

### Hover Effects
- Cards: `translateY(-8px)` + enhanced shadow
- Buttons: `translateY(-2px)` + enhanced shadow
- Links: Color change + underline animation

### Animations
- **fadeIn**: Opacity 0 → 1
- **fadeInDown**: Slide down + fade
- **fadeInUp**: Slide up + fade
- **slideUp**: Modal entrance

## Spacing System

- **xs**: 0.5rem (8px)
- **sm**: 1rem (16px)
- **md**: 1.5rem (24px)
- **lg**: 2rem (32px)
- **xl**: 2.5rem (40px)
- **2xl**: 3rem (48px)
- **3xl**: 4rem (64px)
- **4xl**: 5rem (80px)

## Shadows

### Elevation Levels
- **Level 1**: `0 2px 8px rgba(94, 141, 184, 0.1)` - Subtle
- **Level 2**: `0 4px 12px rgba(94, 141, 184, 0.12)` - Card default
- **Level 3**: `0 8px 24px rgba(94, 141, 184, 0.15)` - Elevated cards
- **Level 4**: `0 12px 40px rgba(94, 141, 184, 0.2)` - Modals

## Responsive Breakpoints

- **Desktop**: > 992px
- **Tablet**: 768px - 992px
- **Mobile Large**: 480px - 768px
- **Mobile Small**: < 480px

## Accessibility

- Color contrast ratio: ≥ 4.5:1 for text
- Focus indicators: Blue glow
- Keyboard navigation: Full support
- Readable font sizes: Minimum 1rem

## Special Features

### Gradient Text
Main headings use gradient text effect:
```css
background: linear-gradient(135deg, #5e8db8 0%, #7a9aa8 100%);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
```

### Custom Scrollbar
Themed scrollbar matching the color scheme with blue gradient thumb.

### Backdrop Filter
Header uses blur effect for modern glass-morphism look.

---

**Design Philosophy**: Professional, calming, and easy on the eyes while maintaining visual interest through subtle gradients and smooth animations.

