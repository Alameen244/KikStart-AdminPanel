# 🛡️ KikStart — Enterprise Admin & RBAC Control Center

[![React](https://img.shields.io/badge/React-19.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.0.1-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Material UI](https://img.shields.io/badge/Material_UI-v7.3.8-007FFF?style=for-the-badge&logo=mui&logoColor=white)](https://mui.com/)
[![MUI X-Data-Grid](https://img.shields.io/badge/MUI_X--Data--Grid-v8.27-0059B2?style=for-the-badge&logo=mui&logoColor=white)](https://mui.com/x/react-data-grid/)
[![TanStack Query](https://img.shields.io/badge/TanStack_Query-v5.90-FF4154?style=for-the-badge&logo=reactquery&logoColor=white)](https://tanstack.com/query)
[![ApexCharts](https://img.shields.io/badge/ApexCharts-v2.1-00E396?style=for-the-badge&logo=apexcharts&logoColor=white)](https://apexcharts.com/)
[![CKEditor 5](https://img.shields.io/badge/CKEditor-5_WYSIWYG-0288D1?style=for-the-badge&logo=ckeditor&logoColor=white)](https://ckeditor.com/)
[![jsPDF](https://img.shields.io/badge/jsPDF-Reporting_Engine-E02424?style=for-the-badge&logo=adobeacrobatreader&logoColor=white)](https://github.com/parallax/jsPDF)

---

## 📌 Application Overview

The **KikStart Admin Panel** is an enterprise-grade administration and operations control center built with **React 19**, **MUI v7**, and **Vite 8**. Engineered specifically for platform super-administrators, finance managers, and operational staff, it features **granular Role-Based Access Control (RBAC)** across 15 distinct functional modules, real-time revenue analytics via interactive charts, virtualized user directories with PDF/CSV reporting, complete coach lifecycle & program assignment operations, and a dynamic Content Management System (CMS).

---

## 📊 Key Engineering Metrics & Highlights

| Metric | Measurement / Impact | Operational & Technical Benefit |
| :--- | :--- | :--- |
| **Admin Features** | **25+ Operational Modules** | Full operational coverage across CRM, Finance, Staffing, CMS, & Security |
| **Granular RBAC** | **15 System Modules (4-Action Matrix)** | Precise per-action control (`create`, `read`, `update`, `delete`) per sub-admin role |
| **Large-Data Virtualization** | **MUI X-Data-Grid v8** | Instant rendering of thousands of records with zero UI lag or dropped frames |
| **Revenue Visualizations** | **ApexCharts Financial Suite** | Interactive MRR trajectory, subscription distribution, and cohort breakdowns |
| **Document Exporting** | **Client-Side PDF & CSV Engine** | Professional branded tabular PDF reports with `jspdf-autotable` and `papaparse` |
| **Dynamic CMS Tools** | **CKEditor 5 & Color Pickers** | In-browser WYSIWYG rich text authoring and dynamic brand palette controls |
| **React Optimization** | **React Compiler (Babel)** | Automatic memoization of component trees for reduced re-render overhead |

---

## 🏗️ Admin Architecture & Security Gateway

```
                               ┌────────────────────────────────┐
                               │           index.html           │
                               └───────────────┬────────────────┘
                                               │
                                               ▼
                               ┌────────────────────────────────┐
                               │            main.jsx            │
                               │  • QueryClientProvider         │
                               │  • ThemeProvider (MUI v7)      │
                               │  • AuthProvider (Admin State)  │
                               └───────────────┬────────────────┘
                                               │
                                               ▼
                               ┌────────────────────────────────┐
                               │         Router (App.jsx)       │
                               └───────┬──────────────┬─────────┘
                                       │              │
                   ┌───────────────────┴───┐      ┌───┴──────────────────┐
                   ▼                       ▼      ▼                      ▼
        ┌─────────────────────┐ ┌──────────────────────────────────────────────┐
        │     Auth Routes     │ │         ProtectedRoute Shell                 │
        │  • AdminLogin       │ │  • JWT Session Validation                    │
        │  • AdminOTP (6-dig) │ │  • Role Identity Hydration                   │
        │  • Forgot / Reset   │ └──────────────────────┬───────────────────────┘
        └─────────────────────┘                        │
                                                       ▼
                                ┌──────────────────────────────────────────────┐
                                │        PermissionGuard Enforcement Gate      │
                                │  • Evaluates user permissionRole array       │
                                │  • Module Matching: "User Management", etc.  │
                                │  • Action Verification: read/create/edit/del │
                                │  • adminOnly SuperAdmin Route Interceptor    │
                                └──────────────────────┬───────────────────────┘
                                                       │
                   ┌───────────────────┬───────────────┴────┬──────────────────┐
                   ▼                   ▼                    ▼                  ▼
        ┌────────────────────┐ ┌───────────────┐ ┌────────────────────┐ ┌───────────────┐
        │ Dashboard & KPIs   │ │ CRM & Staff   │ │ Finance & Billing  │ │ Dynamic CMS   │
        │ • Stat Overview    │ │ • User Table  │ │ • MRR Trend Charts │ │ • Banners     │
        │ • Realtime Metrics │ │ • Coach Roster│ │ • Plan Breakdown   │ │ • Programs    │
        │ • Growth Indicator │ │ • Sub-Admins  │ │ • PDF Export       │ │ • FAQs / Why  │
        └────────────────────┘ └───────────────┘ └────────────────────┘ └───────────────┘
```

---

## 🛠️ Technology Stack & Dependencies

- **Core Library**: React `v19.2.0` (with React Compiler optimization)
- **Build Engine**: Vite `v8.0.1` (Next-gen bundling with Rollup & Babel)
- **UI Framework & Data Grid**: Material UI `v7.3.8`, `@mui/x-data-grid` `v8.27.5`
- **Charts & Data Visualization**: `react-apexcharts` `v2.1.0`, `apexcharts`
- **WYSIWYG Rich Text Editing**: `@ckeditor/ckeditor5-react` `v11.0.1`, `ckeditor5`, `react-quill-new`
- **Color Selection**: `react-color` `v2.19.3`
- **Export & Reporting Engine**: `jspdf` `v4.2.1`, `jspdf-autotable` `v5.0.8`, `papaparse` `v5.5.3`
- **Remote State & Cache**: `@tanstack/react-query` `v5.90.12`
- **HTTP Client**: Axios `v1.13.2` with request/response interceptors
- **Notifications**: `react-toastify` `v11.0.5`

---

## 🌟 Comprehensive Feature Catalog

### 1. Executive Dashboard & Financial Analytics
- **Live KPI Overview**:
  - Total registered platform users
  - Published content modules & active sessions
  - Monthly growth trajectory indicators
- **Revenue Analytics Engine (`RevenueAnalyticsPage.jsx`)**:
  - Interactive **MRR Area/Line Chart** showing revenue growth trends over time.
  - **Plan Distribution Donut Chart** displaying the real-time split between Basic, Professional, and Advanced subscribers.
  - Detailed financial overview cards: Gross Revenue, MRR, Active Subscriptions, Churn Rate.
- **Itemized Revenue Breakdown (`RevenueBreakdown.jsx`)**:
  - Granular table of all customer transactions.
  - Dynamic date-range and tier filters for accounting and audit compliance.

### 2. User & Customer Relationship Management (CRM)
- **High-Performance User Directory (`UserManagement.jsx`)**:
  - Multi-column search across Name, Email, Phone, and Subscription Plan.
  - User detail modal displaying registered children, contact info, and role status.
  - Soft-delete confirmation dialogs to prevent accidental data loss.
- **Executive Export Suite**:
  - **One-Click PDF Export (`Exportuserspdf.jsx`)**: Automatically generates formatted, branded PDF reports containing selected user records with custom table headers.
  - **CSV Export**: Raw data export for spreadsheet analysis.

### 3. Coach Operations & Program Roster Management
- **Coach Directory (`CoachManagement.jsx`)**:
  - Profile tracking: experience, bio, contact credentials, and current active status.
  - Student capacity monitoring (`maxStudents` threshold indicators).
- **Program Assignment Flow (`AssignProgramsDialog.jsx`)**:
  - Interactive modal enabling administrators to assign or unassign athletic programs to specific coaches.
  - Instant database synchronization ensuring coaches see their active programs immediately.
- **Coach Onboarding**:
  - Admin-triggered coach creation with automated welcome email and initial login credentials dispatched via Nodemailer.

### 4. Enterprise RBAC & Permission Matrix
- **15 Module Permission Matrix (`PermissionMatrixTable.jsx`)**:
  - Comprehensive checklist interface to configure granular permissions:
    - **Modules**: Dashboard, User Management, CMS Management, Subscriptions, Home Content, About Us, Programs, Why Us, Contact Us, Interested Schools, Become a Coach, Coach's Login, FAQs, Permission Management, Role Management.
    - **Actions**: `create`, `read`, `update`, `delete`.
- **Sub-Admin Provisioning (`RoleManagement.jsx`)**:
  - Create sub-administrators, attach customized permission roles, and revoke administrative privileges.
- **Runtime Permission Guarding (`PermissionGuard.jsx`)**:
  - Automatically restricts unauthorized routes and hides prohibited action buttons (e.g. hiding the Delete button if the user lacks the `delete` permission for that module).

### 5. Content Management System (CMS)
- **Hero Banner Management**: Configure slides, headings, background images, and call-to-action redirects.
- **Programs Section Manager**: Manage title, description, badge colors, thumbnail cards, and active toggle states.
- **Gym Cards & Why Us**: Interactive feature card management with custom icons and copy.
- **FAQ Central**: Categorized question & answer management with real-time preview.
- **Rich Media & Theme Control**:
  - Direct integration with Cloudinary media storage.
  - Embedded **CKEditor 5** editor for rich HTML formatting.
  - **React Color** picker for real-time section background styling.

---

## 📁 Repository Directory Structure

```text
admin/
├── src/
│   ├── main.jsx                     # Application bootstrap & provider wrapping
│   ├── App.jsx                      # Protected route definitions & layout gates
│   ├── theme.js                     # Material UI enterprise theme configuration
│   ├── Apis/                        # Typed HTTP API service modules
│   │   ├── AuthApis/authApis.js     # Admin login, OTP, and password reset
│   │   ├── coatchApis/coatchApi.js  # Coach CRUD & program assignment
│   │   ├── FAQs/faqApi.js           # FAQ CRUD operations
│   │   ├── HomeApis/                # Banner, Testimonial, and Who-We-Are APIs
│   │   ├── Programs/programApi.js   # Program content management
│   │   ├── RolePermissionApis/      # Roles, permission matrices & sub-admins
│   │   ├── subsciptionApis/         # Admin financial summaries and analytics
│   │   └── EndPoints/               # Centralized endpoint definitions
│   ├── Components/                  # Reusable UI component modules
│   │   ├── AdminAuth/               # AdminLogin, ProtectedRoute, PermissionGuard
│   │   ├── CoatchManagementComponents/ # Coach tables, view/create/assign dialogs
│   │   ├── Dashboard/               # Admin Header, Sidebar, Footer navigation
│   │   ├── FAQs/                    # FAQ tables, settings, and modal forms
│   │   ├── FormComponents/          # ColorPicker, RichText (CKEditor), ImageUpload
│   │   ├── Home/                    # Banner, Testimonial, and Section modals
│   │   ├── Permissions/             # PermissionMatrixTable with interactive toggles
│   │   ├── Programs/                # Program sections, settings, and tables
│   │   ├── ReveneuAnalyticsComponents/ # Revenue charts & plan distribution
│   │   ├── RevenueBreakdown/        # Detailed revenue tables & filters
│   │   ├── RoleManagementPageComponents/ # SubAdmin table & role assign dialogs
│   │   ├── SubscriptionComponentFolder/  # Subscription filters & transaction logs
│   │   ├── TableComponents/         # SectionDataGrid, ActionCell, StatusChips
│   │   └── UserManagement/          # UserTable, ExportPDF, UserViewDialog
│   ├── Pages/                       # Main admin views
│   │   ├── Dashboard.jsx            # High-level overview & KPI metrics
│   │   ├── CoachManagement.jsx      # Coach roster & program assignment
│   │   ├── UserManagement.jsx       # User CRM & PDF export
│   │   ├── Subscription.jsx         # Subscription summary & transactions
│   │   ├── RevenueAnalyticsPage.jsx # In-depth financial analytics & charts
│   │   ├── RevenueBreakdown.jsx     # Detailed transaction records
│   │   ├── RoleManagement.jsx       # Sub-admin role administration
│   │   ├── PermissionPage.jsx       # Granular RBAC matrix configuration
│   │   └── ContentManagement/       # CMS editors (Home, Programs, FAQs, WhyUs)
│   ├── data/
│   │   └── permissionRoles.js       # Base module definitions & helper utilities
│   └── utils/
│       ├── permissionUtils.js       # Runtime action verification helpers
│       └── roleStorage.js           # Role caching utilities
├── package.json
├── vite.config.js
└── .env
```

---

## ⚙️ Environment Configuration

Create a `.env` file in the root of the `admin/` directory:

```env
# Backend API Base URL
VITE_API_URL=http://localhost:3000/api/v1
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js `v20.x` or higher
- Running instance of the KikStart Backend API

### Installation & Execution

```bash
# 1. Navigate to the admin directory
cd admin

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env  # Or create .env directly

# 4. Start the Vite development server
npm run dev
```

The Admin Panel will be available at:
```
http://localhost:5174
```

### Production Build
```bash
# Build the optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 🛡️ Enterprise Security Best Practices
- **Strict Permission Guarding**: Every administrative route and sensitive operation is validated against the active user's permissions.
- **Ephemeral Session Handling**: JWT tokens stored securely and validated on every API transaction.
- **Fail-Safe UI Gates**: Delete and edit buttons are conditionally rendered based on verified administrative privileges.
