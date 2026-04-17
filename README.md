# Employee Wave Portal

A professional, secure employee dashboard built with React, Tailwind CSS, and Framer Motion. This application allows employees to sign in using their email and employee number to view their current wave assignment and team details.

## Features
- **Secure Login**: Authentication against a centralized employee data array.
- **Session Persistence**: Automatic login using `localStorage`.
- **Professional Dashboard**: Clean, modern UI showing employee profile and assignments.
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop.
- **Smooth Animations**: Interactive transitions using Framer Motion.
- **Lucide Icons**: High-quality vector icons for a professional look.

## Data Structure
The application uses an external JSON file located at `src/data/employees.json`. Each employee object contains:
- Employee Number
- Employee Name
- Email Address
- Division
- Unit
- Job
- Title
- Wave
- Team

## Tech Stack
- **Framework**: React 18+
- **Build Tool**: Vite
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion (motion/react)
- **Icons**: Lucide React

## Version History
### v1.0.008 (Current)
- **Superuser role added**: Dedicated access level for administrative oversight using specific Employee IDs.
- **Role-Based Visibility Matrix**: Dashboard now dynamically adjusts based on 'employee', 'facilitator', or 'superuser' roles.
- **Enhanced Profile Card**: Added Employee ID field at the top, styled with a professional monospace chip.
- **Branding Update**: Implemented unique welcome messages and badges (⭐) for superuser status.
- **Navigation Polish**: Corrected facilitator login bypass for administrative accounts.

### v1.0.007
- **Black + Gold (#ffc000) theme applied**: Complete visual overhaul for institution branding.
- **Enhanced Member Cards**: Added Unit, Title, and ID fields with professional labeling.
- **Back Navigation Buttons**: Replaced text links with pill-shaped styled buttons at all drill-down levels.
- **Search Optimization**: Kingdom and ID search now triggers at 1 character for rapid access.
- **Team Intelligence**: Added team-specific icons for the five core divisions (Electricians, Engineering, Gold, Mushroom, Plumber).
- **SEO & Social**: Integrated full meta tags and custom OG social thumbnail for EVA Annual 2026.
- **Framer Motion Animations**: Implemented staggered entrances, fade-ups, and interactive feedback throughout the portal.

### v1.0.005
- **Stability & Performance**: Fixed ESM compatibility issues in build configuration.
- **Search Engine**: Added professional search bar with field-specific filtering (Employee Number, Name, Title, etc.).
- **Theme Engine**: Integrated Light/Dark mode with persistence in `localStorage`.
- **UI Transformation**: Replaced underscores in Wave names with clock emoji (⏰).
- **Architecture**: Refactored into a modular multi-file structure for production readiness.
- **Auth Flow**: Polished 2-step login with identity confirmation screen.

### v1.0.003
- Updated login flow: Now uses Employee ID only with a 2nd confirmation step (showing Name and Unit).
- Updated employee data with new records and fields (Kingdom, Level).
- Optimized dashboard display for new data structure.

### v1.0.002
- Separated employee data into an external JSON file (`src/data/employees.json`) for easier management.
- Updated version numbering across the application.

### v1.0.001
- Initial release with core login and dashboard functionality.
- Implemented session persistence.
- Added professional blue/white theme.
- Integrated Google Fonts (Inter & Outfit).
