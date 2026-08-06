---
name: Visstya Evidence Protocol
colors:
  surface: '#101418'
  surface-dim: '#101418'
  surface-bright: '#363a3e'
  surface-container-lowest: '#0b0f12'
  surface-container-low: '#181c20'
  surface-container: '#1c2024'
  surface-container-high: '#262a2f'
  surface-container-highest: '#31353a'
  on-surface: '#e0e3e8'
  on-surface-variant: '#cac6bd'
  inverse-surface: '#e0e3e8'
  inverse-on-surface: '#2d3135'
  outline: '#939188'
  outline-variant: '#484740'
  surface-tint: '#cac6be'
  primary: '#ffffff'
  on-primary: '#31302b'
  primary-container: '#e6e2d9'
  on-primary-container: '#66645d'
  inverse-primary: '#605e57'
  secondary: '#c0c7d0'
  on-secondary: '#2a3138'
  secondary-container: '#434a51'
  on-secondary-container: '#b2b9c1'
  tertiary: '#ffffff'
  on-tertiary: '#00391f'
  tertiary-container: '#aff1c4'
  on-tertiary-container: '#32704c'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e6e2d9'
  primary-fixed-dim: '#cac6be'
  on-primary-fixed: '#1c1c16'
  on-primary-fixed-variant: '#484740'
  secondary-fixed: '#dce3ec'
  secondary-fixed-dim: '#c0c7d0'
  on-secondary-fixed: '#151c23'
  on-secondary-fixed-variant: '#41484f'
  tertiary-fixed: '#aff1c4'
  tertiary-fixed-dim: '#94d5aa'
  on-tertiary-fixed: '#002110'
  on-tertiary-fixed-variant: '#0d5130'
  background: '#101418'
  on-background: '#e0e3e8'
  surface-variant: '#31353a'
typography:
  display-case-no:
    fontFamily: Archivo Narrow
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 52px
    letterSpacing: -0.02em
  h1:
    fontFamily: Archivo Narrow
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: 0.01em
  h1-mobile:
    fontFamily: Archivo Narrow
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  h2:
    fontFamily: Archivo Narrow
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Fira Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Fira Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  data-mono:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
  label-caps:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.08em
spacing:
  unit: 4px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 48px
  container-max: 1440px
---

## Brand & Style

The design system is built on the narrative of a digital "Evidence Board." It prioritizes forensic clarity, legal authority, and investigative rigor. The aesthetic is disciplined and structured, moving away from "SaaS-modern" toward an "Intelligence-Report" feel. 

The style utilizes **Document Minimalism**—a blend of high-utility corporate structure and physical dossier motifs. It leverages heavy contrast between dark ink backdrops and light paper surfaces to simulate a physical workspace. Every element should feel verified, archival, and permanent. Decorative elements are restricted to functional metadata, subtle grid patterns, and technical markers that suggest a systematic audit trail.

## Colors

The palette is anchored by the tension between `--ink` (the void of investigation) and `--paper` (the surfaced truth).

- **Primary (--paper):** Used for primary surfaces, text on dark backgrounds, and high-priority action containers. It evokes the feel of physical documents.
- **Base (--ink):** The deep, near-black backdrop that represents the OSINT environment.
- **Metadata (--wire):** Used for connectors, secondary labels, and structural lines.
- **Semantic Signals:** Truth and falsehood are represented by muted, archival tones (`--trustable`, `--average`, `--false`) rather than vibrant digital colors, ensuring they remain legible within the case-file context without causing visual fatigue during long investigations.

## Typography

The typography strategy employs three distinct voices to organize information:

1.  **The Authority (Archivo Narrow):** High-impact, condensed, and powerful. Reserved for Case IDs, Headings, and Scoring indicators. Its verticality suggests the rigor of a classified file.
2.  **The Narrative (Fira Sans):** A clean, humanist sans-serif that ensures long-form investigative reports and descriptions are highly readable and objective.
3.  **The Forensic (JetBrains Mono):** Used for all technical data, EXIF metadata, timestamps, and coordinates. This distinguishes "raw data" from "analytical interpretation."

## Layout & Spacing

This design system uses a **Strict Document Grid**. 

- **Grid Model:** 12-column grid for desktop with 24px gutters. Elements should align strictly to the grid to maintain a sense of order.
- **Spacing Logic:** Based on a 4px baseline. Use larger increments (32px, 48px) to separate logical "sections" of a case file, and tighter increments (8px, 12px) for related evidence metadata.
- **The Sidebar:** A persistent "Evidence Index" (320px) on the left for navigation between nodes. 
- **The Stage:** A central workspace where cards can be tiled or stacked, simulating a desk surface.

## Elevation & Depth

Depth in this system is conveyed through **Tonal Stacking** rather than traditional shadows.

- **Level 0 (--ink):** The floor. Represents the application background or "the dark."
- **Level 1 (Surface):** Darker gray containers slightly lighter than --ink for grouping secondary tools.
- **Level 2 (--paper):** Primary evidence cards. These are high-contrast sheets "placed" on the dark background.
- **Physical Connectors:** Use 1px --wire borders to connect related cards, mimicking the "red string" of an evidence board.
- **Shadows:** If used, they must be "Hard Shadows" (low blur, 2-4px offset, 40% opacity) to suggest paper sitting on a flat surface, not floating in 3D space.

## Shapes

The shape language is **Sharp and Geometric**. 

- **Corners:** 0px radius is the default for all cards, buttons, and input fields. This reinforces the "cut paper" and industrial feel.
- **Stamps:** Status indicators (e.g., "VERIFIED", "FALSE") should use a heavy 2px border and may be rotated 2-3 degrees to simulate a physical rubber stamp.
- **Dividers:** Use dashed or dotted lines for "cut here" or "tear away" sections in long reports.

## Components

- **Evidence Cards:** High-contrast containers using `--paper` background and `--ink` text. Header of the card should always include a JetBrains Mono timestamp or Serial Number.
- **Buttons:** Primary buttons are `--ink` on `--paper` (Inverted). Secondary buttons are outlined with 1px `--wire`. No rounded corners. Use uppercase Archivo Narrow for labels.
- **Status Badges:** Styled as "Stamps." Thick borders, high-contrast text, placed in the top-right corner of evidence.
- **Input Fields:** Underlined style (bottom-border only) to mimic a physical form. Use JetBrains Mono for user input.
- **Data Tables:** No vertical lines. Only horizontal 1px `--wire` dividers. Rows should highlight with a subtle `--paper` tint (5% opacity) on hover.
- **The "Wire":** A 1px solid line component used to draw paths between evidence nodes. Terminate lines with a 4px square "pin" rather than an arrow.