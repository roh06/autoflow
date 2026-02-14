# Autoflow - Garage Management System

This guide will help you run and test the Garage Management System.

## Prerequisites
- Node.js installed (v18+ recommended)
- MongoDB installed and running locally on default port (27017)

## 1. Starting the Application

You need to run both the backend server and the frontend client. Open two terminal tabs.

### Backend (Terminal 1)
```bash
cd garage-jira/server
npm install
# Seed the database (Run once)
node seed.js
# Start the server
npm run dev
```
Server runs on `http://localhost:5001`.

### Frontend (Terminal 2)
```bash
cd garage-jira/client
npm install
npm run dev
```
Frontend runs on `http://localhost:5173`.

## 2. Using the Owner Dashboard

1. Open `http://localhost:5173/login`.
2. Login with Admin credentials:
   - **Username**: `admin`
   - **Password**: `admin123`
3. You will see the Dashboard with a Kanban board.
4. Click **New Job** button.
5. Follow the wizard:
   - **Customer**: Enter name and phone. If new, it will be created.
   - **Vehicle**: Enter vehicle details.
   - **Job**: Enter service type and cost.
6. The new job card will appear in the **Pending** column.
7. Click **Move to [Next Status]** on the card to progress the workflow.

## 3. Using the Customer Portal

1. Note the phone number used in the job creation (default seed customer is `9876543210`).
2. Open `http://localhost:5173/track-login` (or logout from admin).
3. Login with Customer credentials:
   - **Phone**: `9876543210` (or the one you used)
   - **OTP**: `1234` (Mock OTP)
4. You will see the **My Garage** portal.
5. View the current status and timeline of updates for your vehicle.

## Project Structure
- `server/`: Express API with MongoDB models.
- `client/`: React Web App with TailwindCSS.
- `server/models`: `User`, `Customer`, `Vehicle`, `Job`.
- `client/src/pages`: `Dashboard`, `Login`, `CustomerPortal`.
