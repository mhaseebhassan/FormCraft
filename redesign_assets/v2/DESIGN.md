---
name: Obsidian Flux
colors:
  surface: '#0F1420'
  surface-dim: '#10131a'
  surface-bright: '#363940'
  surface-container-lowest: '#0b0e14'
  surface-container-low: '#191c22'
  surface-container: '#1d2026'
  surface-container-high: '#272a31'
  surface-container-highest: '#32353c'
  on-surface: '#e0e2eb'
  on-surface-variant: '#ccc3d8'
  inverse-surface: '#e0e2eb'
  inverse-on-surface: '#2d3037'
  outline: '#958da1'
  outline-variant: '#4a4455'
  surface-tint: '#d2bbff'
  primary: '#d2bbff'
  on-primary: '#3f008e'
  primary-container: '#7c3aed'
  on-primary-container: '#ede0ff'
  inverse-primary: '#732ee4'
  secondary: '#4cd7f6'
  on-secondary: '#003640'
  secondary-container: '#03b5d3'
  on-secondary-container: '#00424e'
  tertiary: '#ffb784'
  on-tertiary: '#4f2500'
  tertiary-container: '#a15100'
  on-tertiary-container: '#ffe0cd'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#eaddff'
  primary-fixed-dim: '#d2bbff'
  on-primary-fixed: '#25005a'
  on-primary-fixed-variant: '#5a00c6'
  secondary-fixed: '#acedff'
  secondary-fixed-dim: '#4cd7f6'
  on-secondary-fixed: '#001f26'
  on-secondary-fixed-variant: '#004e5c'
  tertiary-fixed: '#ffdcc6'
  tertiary-fixed-dim: '#ffb784'
  on-tertiary-fixed: '#301400'
  on-tertiary-fixed-variant: '#713700'
  background: '#10131a'
  on-background: '#e0e2eb'
  surface-variant: '#32353c'
  border-glass: rgba(255, 255, 255, 0.06)
  text-primary: '#F1F5F9'
  text-muted: '#94A3B8'
  glow-violet: rgba(124, 58, 237, 0.35)
  accent-lime: '#E4F222'
typography:
  display-lg:
    fontFamily: Geist
    fontSize: 48px
    fontWeight: '800'
    lineHeight: '1.1'
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.03em
  headline-lg-mobile:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: 0em
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
    letterSpacing: 0em
  label-mono:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.0'
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 48px
  max-width: 1440px
---

## Brand & Style

The design system is engineered for a premium, high-performance no-code environment. It targets a developer-adjacent audience that values precision, speed, and technical sophistication. The brand personality is "Technical Elegance"—fusing the utilitarian clarity of a code editor with the refined polish of a luxury digital product.

The visual style is a synthesis of **Minimalism** and **Glassmorphism**, heavily influenced by the "Linear/Vercel" aesthetic. It utilizes deep, atmospheric backgrounds, subtle translucency, and razor-sharp borders to create a sense of infinite depth and structural integrity. Motion is not decorative; it is functional, providing immediate tactile feedback to user interactions.

## Colors

This design system is strictly **dark-mode only**. The palette is built on a "Near-Black Blue" foundation to provide more depth than pure black. 

- **Primary:** Electric Violet is used for high-intent actions and active states. It should be accompanied by a soft outer glow (8-12px blur) to simulate self-illumination.
- **Secondary/Accent:** Cyan-Electric is used for secondary call-to-actions, success indicators, or to highlight specific nodes in the form-building flow.
- **Surface Strategy:** Surfaces use a slightly lighter navy-grey with a backdrop-blur (minimum 12px) and a thin, 1px semi-transparent white border to create the "Glassmorphism" effect.
- **Typography:** Contrast is maintained through color-weighting rather than pure black/white. Primary text is off-white to reduce eye strain, while muted text uses a desaturated slate.

## Typography

Typography is used to reinforce the technical nature of the product. 

- **Headings:** Use **Geist** with tight tracking (-0.03em to -0.04em) and heavy weights. This creates a dense, "compressed" feel typical of modern engineering tools.
- **Body:** **Inter** is utilized for maximum legibility. A relaxed line-height (1.6) is crucial to offset the dark background and prevent text from feeling cramped.
- **Accents/Meta:** **JetBrains Mono** is used for small labels, status badges, and code snippets. It provides a distinct visual break from the sans-serif system and signals "technical data."

## Layout & Spacing

The layout follows a **Fixed Grid** philosophy for the main canvas, while sidebar panels and inspector docks use fluid behaviors. 

- **Grid:** A 12-column grid is used for the dashboard, with a 24px gutter.
- **Negative Space:** High "Confidence Negative Space" is a requirement. Elements should have generous padding to prevent the UI from feeling cluttered, even with complex data.
- **Responsive:** On mobile, the sidebars collapse into a bottom-sheet or full-screen overlay. The 48px desktop margin scales down to 16px.
- **Rhythm:** All spacing must be multiples of 4px.

## Elevation & Depth

This design system avoids heavy drop shadows in favor of **Tonal Layers** and **Glassmorphism**.

1. **Base Layer:** The darkest layer (#080B11), used for the application background.
2. **Surface Layer:** Surfaces (#0F1420) sit "above" the base. They use a 1px `border-glass` to define their edges.
3. **Glass Effect:** When surfaces overlap, apply a `backdrop-blur: 16px`.
4. **Interaction Depth:** Instead of shadows, use subtle inner-glows or border-color shifts (e.g., changing the border from `rgba(255,255,255,0.06)` to `rgba(255,255,255,0.15)`) to indicate focus or elevation.
5. **Primary Glows:** Reserved only for the Primary Violet color to create a "Neon" focal point.

## Shapes

The shape language is "Geometric-Soft." 

- **Standard Elements:** Buttons, cards, and input fields use a consistent 8px (`0.5rem`) radius.
- **Large Containers:** Can scale up to 16px maximum corner radius.
- **Pills:** Status badges and specific toggle buttons should use a full-pill radius to distinguish them from structural components.
- **Interactive States:** On hover, do not change radius; instead, use color and border transitions.

## Components

- **Buttons:** 
    - **Primary:** Violet background, white text, 8px radius, subtle violet glow on hover.
    - **Secondary:** Transparent background, 1px `border-glass`, white text.
- **Inputs:** Darker than the surface layer, 1px border. On focus, the border changes to Primary Violet with a 2px outer glow.
- **Chips/Badges:** Use JetBrains Mono for the text. Use a low-opacity version of the accent color for the background (e.g., Cyan at 10% opacity).
- **Cards:** No shadows. Use the `surface` color with the standard 1px `border-glass`. On hover, the border opacity increases.
- **Lists:** Rows are separated by thin horizontal rules (`border-glass`). Hover states should use a subtle highlight of `rgba(255,255,255,0.03)`.
- **Form Canvas:** The main building area should have a subtle dot-grid background (color: `#1A1F2E`) to emphasize the "No-code Builder" environment.