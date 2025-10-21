import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

interface Booking {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
    phone: string;
  };
  scooty: {
    _id: string;
    name: string;
    brand: string;
    model: string;
    color: string;
    images: string[];
  };
  bookingType: 'hourly' | 'daily';
  startDate: string;
  endDate: string;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled';
  specialRequests?: string;
  paymentMethod?: string;
  paymentStatus?: string;
  createdAt: string;
}

const AdminBookings: React.FC = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  });

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchBookings();
    }
  }, [statusFilter, pagination.currentPage, user]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.currentPage,
        limit: pagination.itemsPerPage,
        ...(statusFilter && { status: statusFilter })
      };

      const response = await api.get('/api/bookings/admin/all', { params });
      setBookings(response.data.bookings);
      setPagination(response.data.pagination);
    } catch (err: any) {
      console.error('Error fetching bookings:', err);
      setError(err.response?.data?.message || 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    try {
      await api.put(`/api/bookings/${bookingId}/status`, { status: newStatus });
      setBookings(prev => 
        prev.map(booking => 
          booking._id === bookingId 
            ? { ...booking, status: newStatus as any }
            : booking
        )
      );
    } catch (err: any) {
      console.error('Error updating booking status:', err);
      setError(err.response?.data?.message || 'Failed to update booking status');
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'pending':
        return 'badge-warning';
      case 'confirmed':
        return 'badge-success';
      case 'active':
        return 'badge-info';
      case 'completed':
        return 'badge-primary';
      case 'cancelled':
        return 'badge-error';
      default:
        return 'badge-neutral';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (user?.role !== 'admin') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="alert alert-error">
            <span>Access denied. Only admins can access this page.</span>
          </div>
        </div>
      </div>
    );
  }

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
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Admin - Booking Management</h1>
        
        {/* Status Filter */}
        <div className="card bg-base-100 shadow-xl p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Filter Bookings</h2>
          <div className="flex gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Status</span>
              </label>
              <select
                className="select select-bordered"
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPagination(prev => ({ ...prev, currentPage: 1 }));
                }}
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="alert alert-error mb-4">
          <span>{error}</span>
        </div>
      )}

      {/* Bookings List */}
      {bookings.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-xl font-semibold mb-2">No bookings found</h3>
          <p className="text-base-content/70">
            {statusFilter ? `No bookings with status "${statusFilter}"` : 'No bookings available'}
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-6 mb-8">
            {bookings.map((booking) => (
              <div key={booking._id} className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="card-title">
                        {booking.scooty.brand} {booking.scooty.model}
                        <div className={`badge ${getStatusBadgeClass(booking.status)}`}>
                          {booking.status.toUpperCase()}
                        </div>
                      </h2>
                      <p className="text-sm text-base-content/70">
                        Booking ID: {booking._id.slice(-8)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">LKR {booking.totalAmount}</p>
                      <p className="text-sm text-base-content/70">
                        {booking.bookingType === 'hourly' ? 'Hourly' : 'Daily'} Booking
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h3 className="font-semibold mb-2">Customer Details</h3>
                      <p><strong>Name:</strong> {booking.user.name}</p>
                      <p><strong>Email:</strong> {booking.user.email}</p>
                      <p><strong>Phone:</strong> {booking.user.phone}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Booking Details</h3>
                      <p><strong>Start:</strong> {formatDate(booking.startDate)}</p>
                      <p><strong>End:</strong> {formatDate(booking.endDate)}</p>
                      <p><strong>Collection:</strong> Store Pickup Required</p>
                      <p><strong>Payment Method:</strong> {booking.paymentMethod?.replace('_', ' ') || 'Cash on Pickup'}</p>
                      <p><strong>Payment Status:</strong> 
                        <span className={`badge badge-sm ml-2 ${
                          booking.paymentStatus === 'paid' ? 'badge-success' : 
                          booking.paymentStatus === 'pending' ? 'badge-warning' : 
                          'badge-error'
                        }`}>
                          {booking.paymentStatus || 'Pending'}
                        </span>
                      </p>
                    </div>
                  </div>

                  {booking.specialRequests && (
                    <div className="mb-4">
                      <h3 className="font-semibold mb-2">Special Requests</h3>
                      <p className="text-sm bg-base-200 p-3 rounded">{booking.specialRequests}</p>
                    </div>
                  )}

                  {/* Admin Actions */}
                  <div className="card-actions justify-end">
                    {booking.status === 'pending' && (
                      <>
                        <button
                          className="btn btn-success"
                          onClick={() => updateBookingStatus(booking._id, 'confirmed')}
                        >
                          Accept Booking
                        </button>
                        <button
                          className="btn btn-error"
                          onClick={() => updateBookingStatus(booking._id, 'cancelled')}
                        >
                          Reject Booking
                        </button>
                      </>
                    )}
                    {booking.status === 'confirmed' && (
                      <button
                        className="btn btn-info"
                        onClick={() => updateBookingStatus(booking._id, 'active')}
                      >
                        Mark as Active
                      </button>
                    )}
                    {booking.status === 'active' && (
                      <button
                        className="btn btn-primary"
                        onClick={() => updateBookingStatus(booking._id, 'completed')}
                      >
                        Mark as Completed
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center">
              <div className="btn-group">
                <button
                  className="btn"
                  disabled={pagination.currentPage === 1}
                  onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
                >
                  Previous
                </button>
                
                {[...Array(pagination.totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    className={`btn ${pagination.currentPage === i + 1 ? 'btn-active' : ''}`}
                    onClick={() => setPagination(prev => ({ ...prev, currentPage: i + 1 }))}
                  >
                    {i + 1}
                  </button>
                ))}
                
                <button
                  className="btn"
                  disabled={pagination.currentPage === pagination.totalPages}
                  onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminBookings;
