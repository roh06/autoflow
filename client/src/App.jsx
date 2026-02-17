import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import JobDetail from './pages/JobDetail';
import CustomerLogin from './pages/CustomerLogin';
import CustomerPortal from './pages/CustomerPortal';
import LandingPage from './pages/LandingPage';
import ProtectedRoute from './components/ProtectedRoute';

import Register from './pages/Register';
import TechnicianDashboard from './pages/TechnicianDashboard';

import TrackOrder from './pages/TrackOrder';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/customer-login" element={<CustomerLogin />} />

          {/* Tracking Flow */}
          <Route path="/track-login" element={<TrackOrder />} />
          <Route path="/track/:id" element={<CustomerPortal />} />

          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/jobs/:id" element={
            <ProtectedRoute>
              <JobDetail />
            </ProtectedRoute>
          } />

          <Route path="/mobile/dashboard" element={
            <ProtectedRoute>
              <TechnicianDashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
