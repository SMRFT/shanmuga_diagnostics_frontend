# Shanmuga Diagnostics LIS Frontend

This project is the React frontend for the Laboratory Information System (LIS) developed for Shanmuga Diagnostics.

## Project Overview

The Shanmuga Diagnostics LIS frontend handles patient management, barcode generation, lab testing, finance, billing, and invoicing operations. It is designed to provide staff with a fast, modern, and reliable interface to handle daily operations efficiently.

## Core Features
*   **Patient Registration & Overview:** Interface for registering new patients, viewing current statuses, and managing appointments.
*   **Finances & Invoicing (B2B/B2C):** Tools for managing billing and tracking invoice payments including proportional credit tracking and history tracking.
*   **Barcode Printing:** Print and manage barcodes directly from the browser for patient test samples.
*   **Reports & Results:** Generate, edit, and print test result reports in PDF format.
*   **Real-time status updates:** Real-time visibility into test statuses across the lab.

## Technical Stack
*   **Framework:** React hooks & functional components
*   **Styling:** Styled Components with modern Glassmorphism UI capabilities
*   **State Management:** React Context / Local hooks
*   **Network:** Axios for REST API interaction
*   **PDF Generation:** jsPDF and jspdf-autotable
*   **UI Elements:** Lucide React icons, SweetAlert2 for notifications, and React-Toastify

## Scripts

### `npm start`
Runs the app in development mode on `http://localhost:3000`.

### `npm run build`
Builds the app for production to the `build` folder. It minifies React and optimizes performance.

### Configuration
Requires `.env` file to configure the backend API endpoint (`REACT_APP_BACKEND_LAB_BASE_URL`).

## Recent Updates
*   **Invoice Proportion Allocation:** Updated proportional patient credit calculation to exactly distribute pending payments properly across patients.
*   **Glassmorphism UI Upgrade:** Modernized screens including login, registration, and patient forms with a unified visual language.
*   **Pharmacy Billing:** Implemented pharmacy inventory search and integrated medical bills on patient invoice reports.
