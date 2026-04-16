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
The application uses a centralized `employeeData` array in `src/App.tsx`. Each employee object contains:
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
### v1.0.001
- Initial release with core login and dashboard functionality.
- Implemented session persistence.
- Added professional blue/white theme.
- Integrated Google Fonts (Inter & Outfit).
