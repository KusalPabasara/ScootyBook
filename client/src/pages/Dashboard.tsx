import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

interface DashboardData {
  bookingsStats: Record<string, number>;
  recentBookings: any[];
  totalSpent: number;
  favoriteBrand: string | null;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [profileData, setProfileData] = useState({
    phone: user?.phone || '',
    licenseNumber: user?.licenseNumber || ''
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      console.log('🔍 Fetching dashboard data for user:', user);
      const response = await api.get('/api/users/dashboard');
      console.log('✅ Dashboard data received:', response.data);
      setDashboardData(response.data);
    } catch (error: any) {
      console.error('❌ Error fetching dashboard data:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileError('');
    setProfileSuccess('');

    try {
      const response = await api.put('/api/auth/profile', profileData);
      setProfileSuccess('Profile updated successfully!');
      setShowProfileForm(false);
      // Update the user context with new data
      if (response.data.user) {
        // You might want to update the auth context here
        window.location.reload(); // Simple refresh to get updated data
      }
    } catch (err: any) {
      setProfileError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setProfileLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">
        {user?.role === 'admin' ? 'Admin Dashboard' : `Welcome back, ${user?.name}!`}
      </h1>
      
      {dashboardData ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {user?.role === 'admin' ? (
            // Admin stats
            <>
              <div className="stat bg-base-100 shadow rounded-lg">
                <div className="stat-title">Total Scooties</div>
                <div className="stat-value text-primary">
                  {dashboardData.bookingsStats.total || 0}
                </div>
                <div className="stat-desc">Available scooties</div>
              </div>
              
              <div className="stat bg-base-100 shadow rounded-lg">
                <div className="stat-title">Total Bookings</div>
                <div className="stat-value text-secondary">
                  {dashboardData.bookingsStats.confirmed || 0}
                </div>
                <div className="stat-desc">All time bookings</div>
              </div>
              
              <div className="stat bg-base-100 shadow rounded-lg">
                <div className="stat-title">Active Bookings</div>
                <div className="stat-value text-accent">
                  {dashboardData.bookingsStats.pending || 0}
                </div>
                <div className="stat-desc">Currently active</div>
              </div>
              
              <div className="stat bg-base-100 shadow rounded-lg">
                <div className="stat-title">Revenue</div>
                <div className="stat-value text-success">
                  LKR {dashboardData.totalSpent || 0}
                </div>
                <div className="stat-desc">Total revenue</div>
              </div>
            </>
          ) : (
            // Client stats
            <>
              <div className="stat bg-base-100 shadow rounded-lg">
                <div className="stat-title">Total Bookings</div>
                <div className="stat-value text-primary">
                  {Object.values(dashboardData.bookingsStats).reduce((a, b) => a + b, 0)}
                </div>
                <div className="stat-desc">All time bookings</div>
              </div>
              
              <div className="stat bg-base-100 shadow rounded-lg">
                <div className="stat-title">Active Bookings</div>
                <div className="stat-value text-secondary">
                  {dashboardData.bookingsStats.active || 0}
                </div>
                <div className="stat-desc">Currently active</div>
              </div>
              
              <div className="stat bg-base-100 shadow rounded-lg">
                <div className="stat-title">Completed</div>
                <div className="stat-value text-success">
                  {dashboardData.bookingsStats.completed || 0}
                </div>
                <div className="stat-desc">Completed bookings</div>
              </div>
              
              <div className="stat bg-base-100 shadow rounded-lg">
                <div className="stat-title">Total Spent</div>
                <div className="stat-value text-accent">
                  LKR {dashboardData.totalSpent}
                </div>
                <div className="stat-desc">Total amount spent</div>
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="alert alert-warning mb-8">
          <span>Unable to load dashboard data. Please try refreshing the page.</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Bookings */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title mb-4">
              {user?.role === 'admin' ? 'Recent Activity' : 'Recent Bookings'}
            </h2>
            {dashboardData?.recentBookings && dashboardData.recentBookings.length > 0 ? (
              <div className="space-y-4">
                {dashboardData.recentBookings.map((booking) => (
                  <div key={booking._id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{booking.scooty.name}</h3>
                        <p className="text-sm text-base-content/70">
                          {new Date(booking.startDate).toLocaleDateString()} - 
                          {new Date(booking.endDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="badge badge-outline">{booking.status}</div>
                    </div>
                    <div className="mt-2">
                      <span className="font-semibold">LKR {booking.totalAmount}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">🛵</div>
                <p className="text-base-content/70">
                  {user?.role === 'admin' ? 'No recent activity' : 'No bookings yet'}
                </p>
                {user?.role !== 'admin' && (
                  <a href="/scooties" className="btn btn-primary btn-sm mt-2">
                    Browse Scooties
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title mb-4">Quick Actions</h2>
            <div className="space-y-4">
              {user?.role === 'admin' ? (
                // Admin actions
                <>
                  <a href="/add-scooty" className="btn btn-primary w-full">
                    Add New Scooty
                  </a>
                  <a href="/scooties" className="btn btn-secondary w-full">
                    Manage Scooties
                  </a>
                </>
              ) : (
                // Client actions
                <>
                  <a href="/scooties" className="btn btn-primary w-full">
                    Browse Available Scooties
                  </a>
                  <a href="/my-bookings" className="btn btn-outline w-full">
                    View All Bookings
                  </a>
                </>
              )}
            </div>
            
            {user?.role !== 'admin' && dashboardData?.favoriteBrand && (
              <div className="mt-6 p-4 bg-base-200 rounded-lg">
                <h3 className="font-semibold mb-2">Your Favorite Brand</h3>
                <p className="text-base-content/70">
                  You've booked {dashboardData.favoriteBrand} scooties the most!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Profile Update Section - Only for non-admin users */}
        {user?.role !== 'admin' && (
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title mb-4">Profile Information</h2>
              
              {!showProfileForm ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Phone Number:</span>
                      <span className="text-base-content/70">
                        {user?.phone || 'Not provided'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">License Number:</span>
                      <span className="text-base-content/70">
                        {user?.licenseNumber || 'Not provided'}
                      </span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setShowProfileForm(true)}
                    className="btn btn-outline w-full"
                  >
                    Update Profile
                  </button>
                </div>
              ) : (
                <form onSubmit={handleProfileSubmit} className="space-y-4">
                  {profileSuccess && (
                    <div className="alert alert-success">
                      <span>{profileSuccess}</span>
                    </div>
                  )}
                  
                  {profileError && (
                    <div className="alert alert-error">
                      <span>{profileError}</span>
                    </div>
                  )}

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Phone Number</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Enter your phone number"
                      className="input input-bordered"
                      value={profileData.phone}
                      onChange={handleProfileChange}
                      required
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">License Number</span>
                    </label>
                    <input
                      type="text"
                      name="licenseNumber"
                      placeholder="Enter your driving license number"
                      className="input input-bordered"
                      value={profileData.licenseNumber}
                      onChange={handleProfileChange}
                      required
                    />
                  </div>

                  <div className="flex space-x-2">
                    <button
                      type="submit"
                      className={`btn btn-primary flex-1 ${profileLoading ? 'loading' : ''}`}
                      disabled={profileLoading}
                    >
                      {profileLoading ? 'Updating...' : 'Update Profile'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowProfileForm(false);
                        setProfileError('');
                        setProfileSuccess('');
                      }}
                      className="btn btn-outline"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
