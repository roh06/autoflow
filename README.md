# Autoflow (Garage Management System)

**Autoflow** is a comprehensive SaaS solution designed for automobile workshops and detailing studios. It streamlines operations by connecting Garage Owners, Technicians, and Customers in a single unified platform.

## 🚀 Technology Stack
This project is built using the **MERN Stack** within a monorepo structure:

- **Frontend**: React (Vite), TailwindCSS v4, Lucide Icons.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (Atlas).
- **Authentication**: JWT (JSON Web Tokens).
- **Hosting/Dev**: Concurrently for running both servers.

## 📂 Project Structure

The repository is organized into two main directories:

- **`client/`**: The React frontend application.
    - `src/pages`: Main views (Dashboard, Login, Customer Portal).
    - `src/components`: Reusable UI components.
    - `src/context`: State management (Auth).
- **`server/`**: The Node.js backend API.
    - `models/`: Mongoose schemas (User, Job, Vehicle, Inventory).
    - `routes/` & `controllers/`: API logic and endpoints.
    - `middleware/`: Auth and role verification.

## ✨ Key Features

### 🛠 For Garage Owners
- **Kanban Dashboard**: Track vehicles through stages (Pending -> In Progress -> Ready).
- **Job Management**: Create job cards, estimate costs, and assign workflows.
- **Inventory**: Track parts and stock levels.
- **Billing**: Generate and print GST-compliant invoices.
- **Staff Management**: Create accounts for technicians.

### 📱 For Technicians
- **Mobile Dashboard**: Dedicated mobile-web view for staff.
- **QR Scanning**: Scan job cards to instantly open vehicle details.
- **Updates**: Provide real-time status updates from the shop floor.

### 🚗 For Customers
- **Public Tracking**: Track vehicle status via a unique link (no login required).
- **Super App Access**: Login with phone number to view service history across all Autoflow-enabled garages.

## 🏁 Getting Started

1.  **Clone the repository**
2.  **Install Dependencies**:
    ```bash
    cd server && npm install
    cd ../client && npm install
    ```
3.  **Environment Setup**:
    - Create `.env` in `server/` with `MONGODB_URI` and `JWT_SECRET`.
4.  **Run Application**:
    - Open two terminals:
    - Terminal 1: `cd server && npm run dev`
    - Terminal 2: `cd client && npm run dev`

## 📜 Development History
For a detailed phase-by-phase breakdown of features implemented, please refer to [PHASE_SUMMARY.md](./PHASE_SUMMARY.md).
