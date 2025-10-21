import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

interface Scooty {
  _id: string;
  name: string;
  brand: string;
  model: string;
  pricePerHour: number;
  pricePerDay: number;
}

interface BookedDate {
  startDate: string;
  endDate: string;
  status: string;
}

const Booking: React.FC = () => {
  const { scootyId } = useParams<{ scootyId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [scooty, setScooty] = useState<Scooty | null>(null);
  const [bookedDates, setBookedDates] = useState<BookedDate[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    bookingType: 'hourly',
    startDate: '',
    endDate: '',
    specialRequests: '',
    paymentMethod: 'cash_on_pickup'
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (scootyId) {
      fetchScootyDetails();
    }
  }, [scootyId, user, navigate]);

  const fetchScootyDetails = async () => {
    try {
      setLoading(true);
      const [scootyResponse, bookedDatesResponse] = await Promise.all([
        api.get(`/api/scooties/${scootyId}`),
        api.get(`/api/bookings/scooty/${scootyId}/booked-dates`)
      ]);
      
      setScooty(scootyResponse.data);
      setBookedDates(bookedDatesResponse.data.bookedDates);
    } catch (error) {
      console.error('Error fetching scooty details:', error);
      setError('Failed to load scooty details');
    } finally {
      setLoading(false);
    }
  };

  const isDateBooked = (date: string) => {
    const checkDate = new Date(date);
    return bookedDates.some(booking => {
      const startDate = new Date(booking.startDate);
      const endDate = new Date(booking.endDate);
      return checkDate >= startDate && checkDate <= endDate;
    });
  };

  const isDateRangeBooked = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    return bookedDates.some(booking => {
      const bookingStart = new Date(booking.startDate);
      const bookingEnd = new Date(booking.endDate);
      
      // Check if the requested range overlaps with any booked range
      return (start <= bookingEnd && end >= bookingStart);
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateTotal = () => {
    if (!scooty || !formData.startDate || !formData.endDate) return 0;
    
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const diffMs = end.getTime() - start.getTime();
    
    if (formData.bookingType === 'hourly') {
      const hours = Math.ceil(diffMs / (1000 * 60 * 60));
      return scooty.pricePerHour * hours;
    } else {
      const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
      return scooty.pricePerDay * days;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    // Validate that the selected dates are not booked
    if (isDateRangeBooked(formData.startDate, formData.endDate)) {
      setError('The selected dates are already booked. Please choose different dates.');
      setSubmitting(false);
      return;
    }

    try {
      const bookingData = {
        scooty: scootyId,
        ...formData,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString()
      };

      await api.post('/api/bookings', bookingData);
      navigate('/my-bookings');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to create booking';
      const requiresProfileCompletion = err.response?.data?.requiresProfileCompletion;
      
      if (requiresProfileCompletion) {
        setError('Please complete your profile with license number and phone number before booking. You can do this in your dashboard.');
      } else {
        setError(errorMessage);
      }
    } finally {
      setSubmitting(false);
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

  if (!scooty) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Scooty not found</h2>
          <button onClick={() => navigate('/scooties')} className="btn btn-primary">
            Browse Scooties
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Book {scooty.brand} {scooty.model}</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Booking Form */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title mb-6">Booking Details</h2>
              
              {error && (
                <div className="alert alert-error mb-4">
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Booking Type</span>
                  </label>
                  <select
                    name="bookingType"
                    className="select select-bordered"
                    value={formData.bookingType}
                    onChange={handleChange}
                    required
                  >
                    <option value="hourly">Hourly Rental</option>
                    <option value="daily">Daily Rental</option>
                  </select>
                </div>

                {/* Booked Dates Display */}
                {bookedDates.length > 0 && (
                  <div className="alert alert-info">
                    <div className="flex items-center">
                      <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <h3 className="font-bold text-info-content">Unavailable Dates</h3>
                        <div className="text-sm mt-1 text-info-content">
                          This scooty is already booked for the following periods:
                        </div>
                        <div className="mt-2 space-y-1">
                          {bookedDates.map((booking, index) => (
                            <div key={index} className="text-sm bg-info-content/10 text-info-content p-2 rounded border border-info-content/20">
                              <span className="font-medium">
                                {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                              </span>
                              <span className={`badge badge-sm ml-2 ${
                                booking.status === 'confirmed' ? 'badge-success' : 
                                booking.status === 'active' ? 'badge-primary' : 'badge-info'
                              }`}>
                                {booking.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Start Date & Time</span>
                      {formData.startDate && isDateBooked(formData.startDate) && (
                        <span className="label-text-alt text-error">⚠️ This date is already booked</span>
                      )}
                    </label>
                    <input
                      type="datetime-local"
                      name="startDate"
                      className={`input input-bordered ${
                        formData.startDate && isDateBooked(formData.startDate) ? 'input-error' : ''
                      }`}
                      value={formData.startDate}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">End Date & Time</span>
                      {formData.endDate && isDateBooked(formData.endDate) && (
                        <span className="label-text-alt text-error">⚠️ This date is already booked</span>
                      )}
                    </label>
                    <input
                      type="datetime-local"
                      name="endDate"
                      className={`input input-bordered ${
                        formData.endDate && isDateBooked(formData.endDate) ? 'input-error' : ''
                      }`}
                      value={formData.endDate}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* Store Pickup Information */}
                <div className="alert alert-info">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <h3 className="font-bold">Store Pickup Required</h3>
                    <p className="text-sm mt-1">
                      You have to come and pick up your bike from our store. 
                      Complete store details and Google Maps location will be sent to your email after booking confirmation.
                    </p>
                  </div>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Payment Method</span>
                  </label>
                  <select
                    name="paymentMethod"
                    className="select select-bordered"
                    value={formData.paymentMethod}
                    onChange={handleChange}
                    required
                  >
                    <option value="cash_on_pickup">Cash on Pickup</option>
                    <option value="bank_transfer">Bank Transfer</option>
                  </select>
                  <div className="label">
                    <span className="label-text-alt text-info">
                      💡 Payment will be collected physically, not online
                    </span>
                  </div>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Special Requests</span>
                  </label>
                  <textarea
                    name="specialRequests"
                    placeholder="Any special requirements or requests..."
                    className="textarea textarea-bordered"
                    rows={3}
                    value={formData.specialRequests}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-control mt-6">
                  <button
                    type="submit"
                    className={`btn btn-primary btn-lg ${submitting ? 'loading' : ''}`}
                    disabled={submitting}
                  >
                    {submitting ? 'Creating Booking...' : 'Confirm Booking'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Booking Summary */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title mb-6">Booking Summary</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-base-content/70">Scooty</span>
                  <span className="font-semibold">{scooty.brand} {scooty.model}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-base-content/70">Booking Type</span>
                  <span className="font-semibold capitalize">{formData.bookingType}</span>
                </div>
                
                {formData.startDate && (
                  <div className="flex justify-between">
                    <span className="text-base-content/70">Start</span>
                    <span className="font-semibold">
                      {new Date(formData.startDate).toLocaleString()}
                    </span>
                  </div>
                )}
                
                {formData.endDate && (
                  <div className="flex justify-between">
                    <span className="text-base-content/70">End</span>
                    <span className="font-semibold">
                      {new Date(formData.endDate).toLocaleString()}
                    </span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-base-content/70">Payment Method</span>
                  <span className="font-semibold capitalize">
                    {formData.paymentMethod.replace('_', ' ')}
                  </span>
                </div>
                
                <div className="divider"></div>
                
                <div className="flex justify-between text-lg font-bold">
                  <span>Total Amount</span>
                  <span className="text-primary">LKR {calculateTotal()}</span>
                </div>
                
                <div className="alert alert-info">
                  <div className="flex items-center">
                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <h3 className="font-bold">Payment Information</h3>
                      <div className="text-sm mt-1">
                        Payment will be collected physically when you {formData.paymentMethod === 'cash_on_pickup' ? 'pick up' : 'receive'} the scooty.
                        No online payment is required.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
