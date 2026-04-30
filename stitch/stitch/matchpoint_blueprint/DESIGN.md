# Design System Strategy: The Precision Curator

## 1. Overview & Creative North Star
This design system moves beyond the "standard SaaS" aesthetic to establish a **Creative North Star: The Precision Curator.** In the high-stakes world of executive recruiting, information density must not lead to visual clutter. We treat data like a curated editorial gallery—authoritative, spacious, and meticulously layered. 

Instead of a rigid, boxed-in grid, we utilize **Intentional Asymmetry** and **Tonal Depth**. By breaking the "template" look with overlapping elements and dramatic typographic scale shifts, we signal to the recruiter that this tool is as sophisticated as their own intuition. We prioritize "breathing room" to reduce cognitive load, ensuring that "MatchPoint" feels less like a database and more like a high-end consultancy.

---

## 2. Colors & Surface Philosophy
The palette is rooted in "Trustworthy Blues" and "Professional Grays," but its execution is what creates the premium feel.

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders to section off the UI. Boundaries must be defined through background color shifts or subtle tonal transitions.
*   *Implementation:* Use `surface-container-low` for a sidebar sitting on a `surface` background. The change in hex value is the boundary.

### Surface Hierarchy & Nesting
Treat the UI as physical layers of "Fine Paper." We use the surface-container tiers to create depth:
*   **Base:** `surface` (#f7f9fb)
*   **Secondary Sections:** `surface-container-low` (#f2f4f6)
*   **Active Cards/Workspaces:** `surface-container-lowest` (#ffffff)
*   **Elevated Modals:** `surface-bright` (#f7f9fb)

### The "Glass & Gradient" Rule
To move beyond a flat "out-of-the-box" feel, use **Glassmorphism** for floating elements (e.g., candidate quick-views). Use semi-transparent `surface` colors with a `20px` backdrop-blur. 
*   **Signature Textures:** For main CTAs and High-Score Match indicators, use a subtle linear gradient transitioning from `primary` (#0040a1) to `primary-container` (#0056d2) at a 135-degree angle. This adds a "lithographic" soul to the digital surface.

---

## 3. Typography: Editorial Authority
We pair two distinct typefaces to balance data-driven precision with high-end editorial flair.

*   **Display & Headlines (Manrope):** Chosen for its geometric modernism. Large-scale headlines (e.g., `display-lg` at 3.5rem) should be used sparingly to anchor pages, creating a "magazine" feel.
*   **Body & Labels (Inter):** The workhorse for readability. Inter’s tall x-height ensures that complex candidate data remains legible even at `body-sm`.

**Hierarchy Tip:** Use `headline-sm` in `primary` color for section headers to create a clear "anchor" for the eye, then drop immediately to `body-md` in `on-surface-variant` for metadata. This high-contrast scale prevents the "everything is important" syndrome.

---

## 4. Elevation & Depth: Tonal Layering
We reject traditional drop shadows in favor of **Tonal Layering**.

*   **The Layering Principle:** Depth is achieved by "stacking." Place a `surface-container-lowest` card on a `surface-container-low` background. This creates a soft, natural lift that feels architectural rather than digital.
*   **Ambient Shadows:** When a floating effect is required (e.g., a dropdown menu), use an extra-diffused shadow: `box-shadow: 0 12px 40px rgba(25, 28, 30, 0.06);`. The shadow is a tinted version of `on-surface`, mimicking natural light.
*   **The "Ghost Border" Fallback:** If a border is required for accessibility, use `outline-variant` at 15% opacity. Never use 100% opaque borders.
*   **Glassmorphism Depth:** For "MatchPoint" scorecards, use a semi-transparent `tertiary_container` with a blur to allow the candidate's profile image to subtly bleed through the score indicator.

---

## 5. Components

### Polished Cards & Lists
*   **Rule:** Forbid divider lines. 
*   **Execution:** Separate candidate entries using 16px of vertical white space and a subtle hover state change to `surface-container-high`.
*   **Cards:** Use `lg` (0.5rem) roundedness. Cards should never have a border; use the `surface-container-lowest` on `surface-container-low` logic.

### Match Score Indicators (Progress)
*   **Visual:** Use a "thick-to-thin" stroke ratio. The progress track uses `tertiary_fixed_dim` while the active progress uses a gradient of `tertiary` to `tertiary_container`. 
*   **Context:** For scores above 90%, add a subtle "glow" using a blurred `tertiary` shadow.

### Buttons
*   **Primary:** Gradient of `primary` to `primary_container`. Text is `on_primary`. Roundedness: `md`.
*   **Secondary:** Ghost style. No background, no border. Use `primary` text. On hover, fill with `primary_fixed` at 30% opacity.

### Input Fields
*   **Style:** Minimalist. No bottom line, no full box. Use a subtle `surface-container-highest` background with `sm` rounding. Label sits 8px above the input in `label-md` uppercase.

### Specialized Component: The "Match-Logic" Chip
*   **Context:** Used to show *why* a candidate matched (e.g., "SQL Expert").
*   **Style:** Semi-transparent `secondary_container` with `on_secondary_container` text. Use `full` (pill) rounding.

---

## 6. Do's and Don'ts

### Do
*   **Do** use extreme white space. If you think there's enough room, add 8px more.
*   **Do** use `tertiary` (Success Green) only for high-match scores and final "Hired" states.
*   **Do** align data points to a strict baseline grid to maintain the "Data-Driven" promise.
*   **Do** use `inverse_surface` for dark-mode-esque "Hero" callouts to break the monotony of the white/light-blue layout.

### Don't
*   **Don't** use 1px solid lines to separate content.
*   **Don't** use standard "web-safe" blue. Stick strictly to the defined `primary` (#0040a1) which has a more professional, deep-sea tone.
*   **Don't** use "pure black" (#000000) for text. Use `on_surface` (#191c1e) to keep the aesthetic high-end and soft on the eyes.
*   **Don't** use aggressive animations. Transitions should be `200ms ease-out`—smooth and intentional.