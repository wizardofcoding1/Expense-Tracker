# FinTrack Frontend Client

FinTrack Frontend is a premium, single-page client web application built with **React 19**, **Vite**, and **Tailwind CSS v4**. It features high-aesthetic light glassmorphism panel styles, smooth micro-animations, customizable dark elements, dynamic Recharts visuals, and timezone-safe input controls for tracking financial operations.

---

## Tech Stack & Highlights

- **Client Environment:** React 19 (Functional components, React Hooks, and custom select hooks)
- **Build Tool:** Vite (Ultra-fast Hot Module Replacement)
- **Routing:** React Router DOM (v7)
- **Styling Design:** Tailwind CSS v4 featuring custom CSS variables configured in `index.css` for a curated slate-harmonious light palette
- **Data Visualizations:** Recharts (Interactive Pie and Bar charts for spending distribution and historical trends)
- **HTTP Client:** Axios (Configured client wrapper with automatic authorization interceptors)
- **Icons:** Lucide React
- **PWA & Service Worker Caching:** Powered by `vite-plugin-pwa` for offline boot loading, automatic background updates, and standalone home screen installation.

---

## Key Features & UI Modules

1. **Dashboard Overview (`/`)**
   - High-level metrics displays (Net Savings, Monthly Income, Total Expense, Remaining Category Budgets).
   - Interactive expense breakdown charts (Pie/Donut charts via Recharts).
   - Quick Add Modal (powered by React Portals) to log single income/expenses on the fly.
   - Reporting period dropdown selector for switching months/years.

2. **Ledger Sheet (`/transactions`)**
   - Comprehensive ledger data table mapping date, description, category, and type.
   - Comprehensive advanced filters:
     - Free-text description searching.
     - Type category dropdown filtering.
     - Custom category filter listing.
     - Timezone-safe start and end date boundaries.
     - Minimum and maximum amount filtering.
     - Description/category hashtag indexing.
     - Sort orders (Newest/Oldest dates, Highest/Lowest amounts, alphabetical A-Z/Z-A descriptions).
   - "Other" Category Selector: Selecting "Other" dynamically renders an animated custom category input box where users type custom categories.
   - Add/Edit modals mounted to `document.body` via React Portals.

3. **Category Limits & Budgets (`/budgets`)**
   - Monthly category limit allocations with responsive visual progress bars.
   - Automatic warnings showing budget violations (spent exceeds allocated limit).
   - Limit Setup card allowing setting limits for predefined or custom categories.
   - Historical budget comparison tables.

4. **Savings Targets (`/savings`)**
   - Configure savings goals with progress tracking bars.
   - Add/record savings deposits/contributions towards individual goals.

5. **Group Expenses (`/groups`)**
   - Bill splitting module for shared group expense logging with custom payer dropdown (supporting virtual members) and date selector.
   - Real-time balances worksheet (calculating who owes whom how much).
   - Settle dues card to log payments between group members.
   - Manage group members by adding registered users or virtual/guest members by name.
   - Delete shared expense groups with cascading data cleanup and custom confirmation dialogs.

6. **Financial Analytics (`/analytics`)**
   - Deep-dive charts detailing category trends, monthly trend comparisons, and savings rates.

7. **Profile Settings (`/profile`)**
   - Modular subcomponents located in `src/components/profile/`:
     - `ProfileCard.jsx`: Displays user initial avatar, full name, and email details.
     - `PersonalInfoForm.jsx`: Manages viewing/editing user personal profile data (First Name, Last Name, Gender select, and validated Date of Birth).
     - `SecurityOverview.jsx`: Renders current security status and tips for the user.
     - `PasswordForm.jsx`: Interactive password changer form with input visibility toggling.
     - `ActiveSessionsList.jsx`: Displays active logged-in device sessions (IP addresses, OS, browsers, active state duration) and allows revoking access.

---

## Custom Premium UI Elements

- **`CustomSelect` Dropdown (`src/components/CustomSelect.jsx`):**
  A customized dropdown component replacing standard native HTML `<select>` elements. It features custom chevrons, smooth dropdown height animations, hover transition effects, and click-outside capture logic. It applies a dynamic `z-30` wrapper z-index overlay while open to guarantee it floats above sibling page components.
- **Portals Wrapper:**
  All modal forms (Quick Add, Add/Edit Transaction) use `createPortal` to break out of CSS containing blocks (like page entry container transforms), ensuring perfect centered layout alignment.
- **Future Date Constraints:**
  Date fields in transaction inputs are restricted using `max` attributes dynamically set to today's local date, disabling selection of tomorrow's date or any future dates.

---

## Local Setup & Installation

### Prerequisite
Make sure you have [Node.js](https://nodejs.org) installed. The backend server must be running at `http://localhost:4000`.

### 1. Install Dependencies
Navigate to the `frontend` folder and install the packages:
```bash
cd frontend
npm install
```

### 2. Configure Environment Variables
Verify your API endpoint settings. The axios wrapper in `src/api/client.js` is preconfigured to link to `http://localhost:4000/api`. If you deploy the backend on a different port or server, edit the backend base URL settings.

### 3. Run Frontend Development Server
Launch the Vite client dev server:
```bash
npm run dev
```
By default, the application will launch at `http://localhost:5173`. Open this URL in your web browser.

### 4. Build Production Bundle & Test PWA Caching
To compile the production build and test the offline PWA capabilities:
1. Build the project:
   ```bash
   npm run build
   ```
2. Start the local preview server:
   ```bash
   npm run preview
   ```
3. Open `http://localhost:4173` online once to let the browser register the Service Worker.
4. Stop the terminal process, turn off your internet connection, and visit `http://localhost:4173` to verify offline boot capabilities.
