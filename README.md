# Employee Wave Portal (v1.0.011)

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

## GitHub Sync Setup
1. Create .env file in project root
2. Add these variables:
     VITE_GITHUB_TOKEN=your_fine_grained_token
     VITE_GITHUB_REPO=owner/repo-name
     VITE_GITHUB_FILE_PATH=public/employees.json
     VITE_GITHUB_BRANCH=main
3. Make sure .env is in .gitignore
4. Token needs Contents: Read & Write permission

## Version History
v1.0.017 - New Seating Map page
           Wave-based map auto-loaded from login ID
           Kingdoms grouped with Teams inside
           Employee name highlighted in their table
           "Your Table" gold border + badge
           Click own table → see full team popup
           Facilitator: wave selector + all tables clickable
           Member count badge on each table
           Team emoji mapping
           Empty/loading states handled

v1.0.016 - Fixed edit duplication bug (.map replace)
           Edit existing member form
           Delete member with confirmation modal
           GitHub API sync for employees.json
           Dynamic dropdowns from live data
           "Other" option for manual entry
           Toast notifications (success/error/loading)
           Edit + Delete buttons on member cards
           Auto navigate back if list becomes empty
           githubSync.ts utility updated
           Reverted Light Mode colors from black to white to fix unreadable cards

v1.0.013 - Refactored CSS Colors
           Fixed Light Mode colors to map #ffffff to #000000
           Excluded prefixed dark mode colors from being affected

v1.0.012 - Add New Member form (facilitator only)
           Edit existing member form
           GitHub API sync for employees.json
           Dynamic dropdowns from live data
           "Other" option for manual entry
           Toast notifications (success/error)
           Edit button on member cards
           githubSync.ts utility created
           Fine-grained token support

v1.0.011 - Light mode text colors fixed,
           Details/labels use black in light mode,
           Name stays gold in both modes,
           Drill-down all text readable in light mode,
           Member cards text fixed in light mode,
           Swipe back direction fixed (right to left),
           Vertical scroll no longer conflicts with swipe,
           "Can't find ID" link black in light mode

v1.0.009 - Login screen: "Can't find your ID?"
           WhatsApp link added below login button,
           Pre-filled message includes EVA SIM context,
           Links to +201069996672

v1.0.008 - Division added to employee profile card,
           Division added to drill-down member cards,
           Logout button made smaller and subtle,
           Mobile info cards changed to single column,
           No 2x2 grid on mobile anymore

### v1.0.010
- **Fixed Footer Syntax**: Resolved JSX errors caused by unclosed `<br>` tags.
- **Organization Branding**: Updated footer credit to "Under Supervision of Training Department".
- **Superuser ID Update**: Manually updated Superuser list (4639).

### v1.0.007
- Profile card split into 2 rows (identity row + info cards row)
- Name no longer collapses on desktop
- Info cards in 2x2 grid on mobile
- Logout moved into fixed footer bar
- Footer: developer credit + version + logout
- Swipe right to go back in drill-down
- Swipe hint shown on touch devices
- Mobile header always shows EVA SIM

### v1.0.009
- **Profile card fully redesigned**: New horizontal layout with 5 distinct sections and unified accent styling.
- **Wave Data Modularized**: Wave assignments split into separate WAVE DATE and WAVE TIME cards for clarity (split by helper logic).
- **Role-Based DOM Enforcement**: Strict access matrix (Employee/Facilitator/Superuser) with complete removal of restricted sections from the DOM for employees.
- **Navigation Enhancements**: Logout moved to a fixed, bottom-right floating pill button for universal access.
- **Mobile Optimization**: Fixed sticky header to always ensure the "EVA SIM" title is persistent and visible.
- **Font & Display Consistency**: Unified font-family (Outfit/Monospace) and sizes (10px labels, 22px values) across all tactics cards.

### v1.0.008
- **Superuser role added**: Dedicated access level for administrative oversight using specific Employee IDs.
- **Role-Based Visibility Matrix**: Dashboard now dynamically adjusts based on 'employee', 'facilitator', or 'superuser' roles.
- **Enhanced Profile Card**: Added Employee ID field at the top, styled with a professional monospace chip.
- **Branding Update**: Implemented unique welcome messages and badges (⭐) for superuser status.
- **Navigation Polish**: Corrected facilitator login bypass for administrative accounts.

### Previous v1.0.007
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
