# Plan - Creative Polish & Expert Consultation

Improve the visual creativity, polish the UI, upgrade service card icons to use the realistic receiver, and add an expert consultation booking feature.

## User Review Required

> [!IMPORTANT]
> I will be using a simulated calendar for the "Consult an Expert" feature since a real calendar integration (like Google/Outlook) requires API credentials. The booking will be stored in local storage alongside leads.

- **Booking Flow**: Should the expert consultation be a separate page or a section on the home page? (Default: Section on home page + dedicated route).
- **Admin Panel**: Do you want the bookings to appear in the same pipeline as leads or a separate list? (Default: Separate list in admin).

## Proposed Changes

### Visual Polish & Creativity
- **Service Cards**: Replace the current SVG "DeviceArt" with the realistic receiver image (same as hero but smaller/restyled) for a cohesive look.
- **Micro-interactions**: Add hover effects to cards that reveal deeper details or "blueprint" grid animations.
- **Creative Sections**: Add parallax elements, floating decorative shapes (spheres/rings in navy/ivory), and glassmorphism cards.
- **Admin Panel**: Color-code lead labels based on stage (e.g., Won = Green, Lost = Red, Qualification = Blue).

### Service Page Improvements
- **Layout**: Enhance the alternating sections with more whitespace, larger typography, and interactive "feature pods".
- **Visuals**: Add "desk" shadows and depth to the service device panels.

### Expert Consultation
- **Calendar Component**: Create a custom, premium-looking calendar UI (`src/components/booking/ExpertCalendar.tsx`).
- **Time Slots**: Implement a logic for available slots (simulated).
- **Storage**: Update `src/lib/local-leads.ts` to handle `bookings` in localStorage.

## Technical Details

### Backend (Local)
- Update `local-leads.ts` to include `Booking` interface and helper functions:
  ```typescript
  export interface Booking {
    id: string;
    name: string;
    email: string;
    date: string; // ISO
    timeSlot: string;
    created_at: string;
  }
  ```

### Components
- `src/components/ServiceCard.tsx`: Refactor to use the realistic receiver image.
- `src/components/booking/BookingSection.tsx`: The main UI for selecting date/time.

### Styles
- Update `src/styles.css` with stage-specific colors for the admin panel.
- Add "glass-card" and "floating-animation" utilities.
