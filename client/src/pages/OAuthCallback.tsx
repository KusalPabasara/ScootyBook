import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const OAuthCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setToken } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [profileData, setProfileData] = useState({
    phone: '',
    licenseNumber: ''
  });

  useEffect(() => {
    const token = searchParams.get('token');
    const profileComplete = searchParams.get('profileComplete') === 'true';
    
    if (!token) {
      setError('Authentication failed. Please try again.');
      setLoading(false);
      return;
    }

    // Set token in auth context
    setToken(token);
    
    if (profileComplete) {
      // Profile is complete, redirect to dashboard
      navigate('/dashboard');
    } else {
      // Profile needs completion
      setShowProfileForm(true);
      setLoading(false);
    }
  }, [searchParams, navigate, setToken]);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await api.post('/oauth/complete-profile', profileData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.message === 'Profile completed successfully') {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to complete profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !showProfileForm) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg"></div>
          <p className="mt-4 text-lg">Completing authentication...</p>
        </div>
      </div>
    );
  }

  if (showProfileForm) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <div className="card w-full max-w-md bg-base-100 shadow-xl">
          <div className="card-body">
            <h1 className="card-title text-2xl font-bold text-center mb-6">
              Complete Your Profile
            </h1>
            
            <div className="alert alert-info mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="font-bold">Required Information</h3>
                <p className="text-sm">To book a scooty, we need your license number and phone number for verification.</p>
              </div>
            </div>
            
            {error && (
              <div className="alert alert-error mb-4">
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleProfileSubmit} className="space-y-4">
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

              <div className="form-control mt-6">
                <button
                  type="submit"
                  className={`btn btn-primary ${loading ? 'loading' : ''}`}
                  disabled={loading}
                >
                  {loading ? 'Completing...' : 'Complete Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <div className="card w-full max-w-md bg-base-100 shadow-xl">
          <div className="card-body text-center">
            <div className="alert alert-error">
              <span>{error}</span>
            </div>
            <button 
              onClick={() => navigate('/login')}
              className="btn btn-primary mt-4"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default OAuthCallback;
