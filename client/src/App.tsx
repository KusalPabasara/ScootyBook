import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Scooties from './pages/Scooties';
import Booking from './pages/Booking';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import ScootyDetails from './pages/ScootyDetails';
import MyBookings from './pages/MyBookings';
import AddScooty from './pages/AddScooty';
import AdminBookings from './pages/AdminBookings';
import EditScooty from './pages/EditScooty';
import OAuthCallback from './pages/OAuthCallback';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-base-200">
            <Navbar />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/scooties" element={<Scooties />} />
                <Route path="/scooties/:id" element={<ScootyDetails />} />
                <Route path="/booking/:scootyId" element={<Booking />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/my-bookings" element={<MyBookings />} />
                  <Route path="/add-scooty" element={<AddScooty />} />
                  <Route path="/edit-scooty/:scootyId" element={<EditScooty />} />
                  <Route path="/admin-bookings" element={<AdminBookings />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/auth/callback" element={<OAuthCallback />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
