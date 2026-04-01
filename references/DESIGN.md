# Design System Document: J&T Express Magelang

## 1. Overview & Creative North Star: "The Kinetic Authority"
This design system moves beyond the utility of standard logistics to create an experience of **Kinetic Authority**. Logistics is about precision, movement, and trust. Our North Star focuses on a "High-End Editorial" aesthetic—utilizing bold, tech-forward typography and sophisticated layering to suggest a premium service that is both reliable and cutting-edge.

We reject the "boxed" look of traditional web templates. Instead, we embrace **intentional asymmetry** and **tonal depth**. The layout should feel like a well-composed technical journal: expansive white space, overlapping elements that imply motion, and a rigorous adherence to a vertical rhythm that guides the user through the logistics journey.

---

## 2. Colors
Our palette is anchored by the aggressive energy of J&T Red, balanced by a sophisticated hierarchy of neutral surfaces to provide a "tech-luxe" feel.

### The Palette
*   **Primary:** `primary` (#bb0013) – Used for high-impact brand moments and critical actions.
*   **Primary Container:** `primary_container` (#e71520) – A vibrant variant for hero sections and large-scale branding.
*   **Background:** `background` (#f8f9fa) – Our foundational canvas.
*   **Surface Tiers:** From `surface_container_lowest` (#ffffff) to `surface_container_highest` (#e1e3e4).

### Key Rules
*   **The "No-Line" Rule:** 1px solid borders are strictly prohibited for sectioning. We define boundaries through background shifts. For example, a `surface_container_low` section should sit directly against a `background` section to create a clean, modern break.
*   **Surface Hierarchy & Nesting:** Treat the UI as a series of physical layers. A card (`surface_container_lowest`) should sit on a section background (`surface_container_low`) to create a natural, "paper-on-desk" lift.
*   **The "Glass & Gradient" Rule:** For floating navigation or modal overlays, use **Glassmorphism**. Apply a semi-transparent `surface` color with a `backdrop-blur` (e.g., 20px) to ensure the interface feels integrated and high-end.
*   **Signature Textures:** Use subtle linear gradients transitioning from `primary` to `primary_container` (top-down or 45-degree) on main CTAs to add a "liquid" sheen that flat hex codes cannot replicate.

---

## 3. Typography
We utilize a pairing of **Manrope** for high-impact display and **Inter** for functional clarity. This creates a "tech-focused" editorial look.

*   **Display (Manrope):** High-contrast, large-scale (3.5rem - 2.25rem). Use `display-lg` for hero headlines to establish authority immediately.
*   **Headline (Manrope):** Used for section starts (2rem - 1.5rem). These should be bold and confident.
*   **Title (Inter):** For card headers and navigational elements. Inter's tall x-height ensures readability even at smaller sizes.
*   **Body (Inter):** The workhorse for logistics details. Use `body-md` (0.875rem) as the standard for multi-line text to maintain a clean, airy feel.
*   **Label (Inter):** For micro-copy and data points (0.75rem).

---

## 4. Elevation & Depth
Depth is a functional tool used to guide the eye toward the most important shipment data or calls to action.

*   **Tonal Layering:** Avoid shadows for static elements. Instead, use the `surface_container` tokens. An "inner" container should always be one tier higher or lower than its parent.
*   **Ambient Shadows:** For floating elements (like a "Track Package" modal), use an ultra-diffused shadow: `box-shadow: 0 20px 40px rgba(25, 28, 29, 0.05)`. The shadow must be low-opacity and tinted by the `on_surface` color for a natural look.
*   **The "Ghost Border" Fallback:** If a container requires a boundary (e.g., in high-density data tables), use `outline_variant` at **15% opacity**. Never use a 100% opaque border.
*   **Asymmetric Overlaps:** To break the grid, allow images or red brand "flashes" to overlap two surface tiers (e.g., a photo of a courier overlapping a gray section into a white section).

---

## 5. Components

### Buttons
*   **Primary:** Solid `primary` background, `on_primary` text. Corners: `rounded-md` (0.375rem). Apply the signature gradient for depth.
*   **Secondary:** `surface_container_high` background with `on_surface` text. No border.
*   **Tertiary:** Transparent background, `primary` text. Used for "Learn More" links.

### Input Fields (The Tracking Component)
*   **Resting State:** `surface_container_lowest` background with a "Ghost Border."
*   **Focused State:** 2px solid `primary`. 
*   **Helper Text:** Use `label-md` in `on_surface_variant` for instructions like "Enter 12-digit Waybill."

### Cards (The Shipment/Service Card)
*   Forbid the use of divider lines. Separate the header from the body using a `12` (3rem) vertical spacing unit or by placing the header on a `surface_container_highest` strip.
*   Iconography within cards must be minimalist, utilizing the `primary` color only.

### Tracking Stepper (Additional Component)
*   A custom vertical or horizontal line using `primary` for completed steps and `outline_variant` for pending steps. Use `surface_container_highest` circles to house minimalist red icons.

---

## 6. Do's and Don'ts

### Do
*   **Do** use the Spacing Scale religiously. Consistent gaps of `8` (2rem) and `16` (4rem) create the professional "breathing room" seen in high-end layouts.
*   **Do** lean into typography-heavy layouts. Let the size of the Manrope headers do the heavy lifting for hierarchy.
*   **Do** use `primary_container` for full-width "interstitial" sections to break up long scrolls.

### Don't
*   **Don't** use black (#000000). Always use `on_surface` (#191c1d) for text to maintain a sophisticated, softer contrast.
*   **Don't** use standard 4px "card shadows." It makes the site look like a 2015-era template. Stick to Tonal Layering.
*   **Don't** clutter the screen with icons. Only use iconography when it serves as a functional anchor for a section (e.g., "Check Receipt" or "Our Services").