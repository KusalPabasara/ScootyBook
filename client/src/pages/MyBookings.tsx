import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

interface Booking {
  _id: string;
  scooty: {
    _id: string;
    name: string;
    brand: string;
    model: string;
    images: string[];
  };
  bookingType: string;
  startDate: string;
  endDate: string;
  totalAmount: number;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  createdAt: string;
}

const MyBookings: React.FC = () => {
  const { user, logout } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [cancellingBooking, setCancellingBooking] = useState<string | null>(null);

  useEffect(() => {
    fetchBookings();
  }, [statusFilter]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const params = statusFilter ? { status: statusFilter } : {};
      const response = await api.get('/api/bookings/my-bookings', { params });
      setBookings(response.data.bookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    // Get cancellation reason from user
    const cancellationReason = prompt('Please provide a reason for cancelling this booking (minimum 5 characters):');
    
    if (!cancellationReason) {
      return; // User cancelled
    }
    
    if (cancellationReason.length < 5) {
      alert('Cancellation reason must be at least 5 characters long.');
      return;
    }

    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    setCancellingBooking(bookingId);

    try {
      console.log('🔄 Attempting to cancel booking:', bookingId);
      console.log('🔄 Cancellation reason:', cancellationReason);
      
      const response = await api.put(`/api/bookings/${bookingId}/cancel`, {
        cancellationReason: cancellationReason
      });
      
      console.log('✅ Booking cancelled successfully:', response.data);
      
      // Show success message with refund info if available
      const refundInfo = response.data.booking?.refundAmount 
        ? ` Refund amount: LKR ${response.data.booking.refundAmount}`
        : '';
      alert(`Booking cancelled successfully!${refundInfo}`);
      
      // Refresh the list
      fetchBookings();
    } catch (error: any) {
      console.error('❌ Error cancelling booking:', error);
      console.error('❌ Error response:', error.response?.data);
      console.error('❌ Error status:', error.response?.status);
      
      // Handle authorization errors specifically
      if (error.response?.status === 401) {
        alert('Your session has expired. Please log in again.');
        logout();
        return;
      }
      
      // Show user-friendly error message
      const errorMessage = error.response?.data?.message || 'Failed to cancel booking. Please try again.';
      alert(`Error: ${errorMessage}`);
    } finally {
      setCancellingBooking(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'badge-success';
      case 'active':
        return 'badge-primary';
      case 'completed':
        return 'badge-secondary';
      case 'cancelled':
        return 'badge-error';
      case 'pending':
        return 'badge-warning';
      default:
        return 'badge-outline';
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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Bookings</h1>
        
        <div className="form-control">
          <select
            className="select select-bordered"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {bookings.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-xl font-semibold mb-2">No bookings found</h3>
          <p className="text-base-content/70 mb-4">
            {statusFilter ? 'No bookings match your filter criteria.' : 'You haven\'t made any bookings yet.'}
          </p>
          <a href="/scooties" className="btn btn-primary">
            Browse Scooties
          </a>
        </div>
      ) : (
        <div className="space-y-6">
          {bookings.map((booking) => (
            <div key={booking._id} className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Scooty Image */}
                  <div className="flex-shrink-0">
                    {booking.scooty.images && booking.scooty.images.length > 0 ? (
                      <img
                        src={booking.scooty.images[0]}
                        alt={booking.scooty.name}
                        className="w-32 h-32 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-32 h-32 bg-base-200 rounded-lg flex items-center justify-center">
                        <span className="text-4xl">🛵</span>
                      </div>
                    )}
                  </div>

                  {/* Booking Details */}
                  <div className="flex-grow">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h2 className="text-xl font-bold">
                          {booking.scooty.brand} {booking.scooty.model}
                        </h2>
                        <p className="text-base-content/70">
                          Booking ID: {booking._id}
                        </p>
                      </div>
                      <div className={`badge ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <div className="text-sm text-base-content/70">Booking Type</div>
                        <div className="font-semibold capitalize">{booking.bookingType}</div>
                      </div>
                      <div>
                        <div className="text-sm text-base-content/70">Total Amount</div>
                        <div className="font-semibold text-primary">LKR {booking.totalAmount}</div>
                      </div>
                      <div>
                        <div className="text-sm text-base-content/70">Payment Method</div>
                        <div className="font-semibold capitalize">
                          {booking.paymentMethod?.replace('_', ' ') || 'Cash on Pickup'}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-base-content/70">Payment Status</div>
                        <div className={`font-semibold ${
                          booking.paymentStatus === 'paid' ? 'text-success' : 
                          booking.paymentStatus === 'pending' ? 'text-warning' : 
                          'text-error'
                        }`}>
                          {booking.paymentStatus || 'Pending'}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-base-content/70">Start Date</div>
                        <div className="font-semibold">
                          {new Date(booking.startDate).toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-base-content/70">End Date</div>
                        <div className="font-semibold">
                          {new Date(booking.endDate).toLocaleString()}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <a
                        href={`/scooties/${booking.scooty._id}`}
                        className="btn btn-outline btn-sm"
                      >
                        View Scooty
                      </a>
                      
                      {['pending', 'confirmed'].includes(booking.status) && (
                        <button
                          onClick={() => handleCancelBooking(booking._id)}
                          className="btn btn-error btn-sm"
                          disabled={cancellingBooking === booking._id}
                        >
                          {cancellingBooking === booking._id ? (
                            <>
                              <span className="loading loading-spinner loading-xs"></span>
                              Cancelling...
                            </>
                          ) : (
                            'Cancel Booking'
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
