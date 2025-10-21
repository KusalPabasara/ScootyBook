import React, { useState } from 'react';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const DebugCancelBooking: React.FC = () => {
  const { user, token } = useAuth();
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [testBookingId, setTestBookingId] = useState('');

  const runDebugTest = async () => {
    const info: any = {
      timestamp: new Date().toISOString(),
      user: user ? { id: user.id, email: user.email, role: user.role } : null,
      token: token ? `${token.substring(0, 20)}...` : null,
      localStorageToken: localStorage.getItem('token') ? `${localStorage.getItem('token')?.substring(0, 20)}...` : null,
    };

    try {
      // Test 1: Check if we can fetch bookings
      console.log('🧪 Testing fetch bookings...');
      const bookingsResponse = await api.get('/api/bookings/my-bookings');
      info.fetchBookings = {
        success: true,
        status: bookingsResponse.status,
        bookingsCount: bookingsResponse.data.bookings?.length || 0
      };
      console.log('✅ Fetch bookings successful');
    } catch (error: any) {
      info.fetchBookings = {
        success: false,
        status: error.response?.status,
        message: error.response?.data?.message || error.message
      };
      console.error('❌ Fetch bookings failed:', error.response?.data);
    }

    // Test 2: Test cancel endpoint with test booking ID
    if (testBookingId) {
      try {
        console.log('🧪 Testing cancel booking...');
        const cancelResponse = await api.put(`/api/bookings/${testBookingId}/cancel`, {
          cancellationReason: 'Debug test cancellation reason'
        });
        info.cancelBooking = {
          success: true,
          status: cancelResponse.status,
          data: cancelResponse.data
        };
        console.log('✅ Cancel booking successful');
      } catch (error: any) {
        info.cancelBooking = {
          success: false,
          status: error.response?.status,
          message: error.response?.data?.message || error.message
        };
        console.error('❌ Cancel booking failed:', error.response?.data);
      }
    }

    setDebugInfo(info);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">🛠️ Cancel Booking Debug Tool</h2>
          
          <div className="form-control">
            <label className="label">
              <span className="label-text">Test Booking ID (optional)</span>
            </label>
            <input
              type="text"
              placeholder="Enter a booking ID to test cancel functionality"
              className="input input-bordered"
              value={testBookingId}
              onChange={(e) => setTestBookingId(e.target.value)}
            />
          </div>

          <button
            className="btn btn-primary"
            onClick={runDebugTest}
          >
            Run Debug Test
          </button>

          {debugInfo && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Debug Results:</h3>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
            </div>
          )}

          <div className="mt-4 text-sm text-gray-600">
            <h4 className="font-semibold">Instructions:</h4>
            <ol className="list-decimal list-inside space-y-1">
              <li>Make sure you're logged in</li>
              <li>Click "Run Debug Test" to check API connectivity</li>
              <li>If you have a booking ID, enter it to test the cancel endpoint</li>
              <li>Check the browser console for detailed logs</li>
              <li>Check the Network tab in developer tools</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DebugCancelBooking;
