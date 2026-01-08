import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { GoogleMap, LoadScript, Marker, DirectionsRenderer } from '@react-google-maps/api';
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

interface LatLng {
  lat: number;
  lng: number;
}

// Agency location - Weligama Bus Stand
const AGENCY_LOCATION: LatLng = {
  lat: 5.9731,
  lng: 80.4297
};

// Weligama area boundaries (approximate)
const WELIGAMA_BOUNDS = {
  north: 6.0000,
  south: 5.9500,
  east: 80.4600,
  west: 80.4000
};

const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY_HERE';

const Booking: React.FC = () => {
  const { scootyId } = useParams<{ scootyId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [scooty, setScooty] = useState<Scooty | null>(null);
  const [bookedDates, setBookedDates] = useState<BookedDate[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [deliveryError, setDeliveryError] = useState('');
  
  const [deliveryMode, setDeliveryMode] = useState<'pickup' | 'delivery'>('pickup');
  const [userLocation, setUserLocation] = useState<LatLng | null>(null);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [isLocationValid, setIsLocationValid] = useState(true);
  
  const [formData, setFormData] = useState({
    bookingType: 'hourly',
    startDate: '',
    endDate: '',
    specialRequests: '',
    paymentMethod: 'cash_on_pickup',
    deliveryMode: 'pickup',
    deliveryAddress: '',
    deliveryLocation: { lat: 0, lng: 0 }
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (scootyId) {
      fetchScootyDetails();
    }
    
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          // Fallback to demo location in Weligama for testing on devices without GPS
          setUserLocation({
            lat: 5.9750, // Demo location in Weligama
            lng: 80.4300
          });
          console.log('Using demo location for testing (Weligama area)');
        }
      );
    } else {
      // Browser doesn't support geolocation - use demo location
      setUserLocation({
        lat: 5.9750,
        lng: 80.4300
      });
      console.log('Geolocation not supported. Using demo location.');
    }
  }, [scootyId, user, navigate]);
  
  // Check if location is within Weligama bounds
  const isWithinWeligama = useCallback((location: LatLng): boolean => {
    return (
      location.lat >= WELIGAMA_BOUNDS.south &&
      location.lat <= WELIGAMA_BOUNDS.north &&
      location.lng >= WELIGAMA_BOUNDS.west &&
      location.lng <= WELIGAMA_BOUNDS.east
    );
  }, []);
  
  // Calculate and display directions
  const calculateRoute = useCallback(async () => {
    if (!window.google || !window.google.maps) return;
    
    const directionsService = new google.maps.DirectionsService();
    
    let origin: LatLng;
    let destination: LatLng;
    
    if (deliveryMode === 'pickup') {
      // User to Agency
      origin = userLocation || AGENCY_LOCATION;
      destination = AGENCY_LOCATION;
    } else {
      // Agency to User
      origin = AGENCY_LOCATION;
      destination = userLocation || AGENCY_LOCATION;
    }
    
    try {
      const results = await directionsService.route({
        origin: origin,
        destination: destination,
        travelMode: google.maps.TravelMode.DRIVING,
      });
      
      setDirections(results);
    } catch (error) {
      console.error('Error calculating route:', error);
    }
  }, [deliveryMode, userLocation]);
  
  useEffect(() => {
    if (deliveryMode && userLocation) {
      calculateRoute();
    }
  }, [deliveryMode, userLocation, calculateRoute]);
  
  // Handle delivery mode change
  const handleDeliveryModeChange = (mode: 'pickup' | 'delivery') => {
    setDeliveryMode(mode);
    setDeliveryError('');
    
    if (mode === 'delivery') {
      // Check if current location is within Weligama
      if (userLocation && !isWithinWeligama(userLocation)) {
        setDeliveryError('Delivery is only available within Weligama. Please choose Pickup.');
        setIsLocationValid(false);
        return;
      }
      setIsLocationValid(true);
    }
    
    setFormData(prev => ({
      ...prev,
      deliveryMode: mode,
      paymentMethod: mode === 'pickup' ? 'cash_on_pickup' : 'cash_on_delivery'
    }));
  };
  
  // Handle map click for delivery location
  const handleMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (deliveryMode !== 'delivery' || !e.latLng) return;
    
    const clickedLocation = {
      lat: e.latLng.lat(),
      lng: e.latLng.lng()
    };
    
    // Check if clicked location is within Weligama
    if (!isWithinWeligama(clickedLocation)) {
      setDeliveryError('Delivery is only available within Weligama. Please select a location within the highlighted area.');
      setIsLocationValid(false);
      return;
    }
    
    setUserLocation(clickedLocation);
    setIsLocationValid(true);
    setDeliveryError('');
    
    setFormData(prev => ({
      ...prev,
      deliveryLocation: clickedLocation
    }));
    
    // Reverse geocode to get address
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: clickedLocation }, (results, status) => {
      if (status === 'OK' && results && results[0]) {
        setDeliveryAddress(results[0].formatted_address);
        setFormData(prev => ({
          ...prev,
          deliveryAddress: results[0].formatted_address
        }));
      }
    });
  }, [deliveryMode, isWithinWeligama]);

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
  
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const address = e.target.value;
    setDeliveryAddress(address);
    
    // Geocode the address
    if (address.length > 5 && window.google) {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address: address + ', Weligama, Sri Lanka' }, (results, status) => {
        if (status === 'OK' && results && results[0]) {
          const location = {
            lat: results[0].geometry.location.lat(),
            lng: results[0].geometry.location.lng()
          };
          
          if (isWithinWeligama(location)) {
            setUserLocation(location);
            setIsLocationValid(true);
            setDeliveryError('');
            setFormData(prev => ({
              ...prev,
              deliveryAddress: address,
              deliveryLocation: location
            }));
          } else {
            setDeliveryError('This address is outside Weligama. Delivery is only available within Weligama.');
            setIsLocationValid(false);
          }
        }
      });
    }
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
    
    // Validate delivery mode
    if (deliveryMode === 'delivery') {
      if (!isLocationValid) {
        setError('Please select a valid delivery location within Weligama.');
        setSubmitting(false);
        return;
      }
      
      if (!formData.deliveryAddress || !formData.deliveryLocation.lat) {
        setError('Please select or enter a delivery address.');
        setSubmitting(false);
        return;
      }
      
      // For delivery mode, capture current live location
      if (navigator.geolocation) {
        try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              enableHighAccuracy: true,
              timeout: 10000
            });
          });
          
          formData.deliveryLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
        } catch (geoError) {
          console.error('Error getting current location:', geoError);
        }
      }
    }

    try {
      const bookingData = {
        scooty: scootyId,
        ...formData,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString()
      };

      await api.post('/api/bookings', bookingData);
      
      // Redirect based on delivery mode
      if (deliveryMode === 'pickup') {
        // Create Google Maps navigation URL
        const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${AGENCY_LOCATION.lat},${AGENCY_LOCATION.lng}&travelmode=driving`;
        
        // Show success message
        alert('Booking successful! Opening Google Maps for navigation to pickup location...');
        
        // Open Google Maps in new window
        const mapWindow = window.open(mapsUrl, '_blank');
        
        // Check if popup was blocked
        if (!mapWindow || mapWindow.closed || typeof mapWindow.closed === 'undefined') {
          alert('Popup blocked! Please allow popups to open Google Maps automatically.\n\nYou can also use the "Get Directions" button in My Bookings.');
        }
        
        // Redirect to my bookings after a delay
        setTimeout(() => {
          navigate('/my-bookings');
        }, 2000);
      } else {
        // For delivery mode, just go to my bookings
        alert('Booking successful! We will deliver to your location.');
        navigate('/my-bookings');
      }
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
                {/* Delivery Mode Selection */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">How would you like to get the scooty?</span>
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      className={`btn ${deliveryMode === 'pickup' ? 'btn-primary' : 'btn-outline'}`}
                      onClick={() => handleDeliveryModeChange('pickup')}
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      I'll Pick It Up
                    </button>
                    <button
                      type="button"
                      className={`btn ${deliveryMode === 'delivery' ? 'btn-primary' : 'btn-outline'}`}
                      onClick={() => handleDeliveryModeChange('delivery')}
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      Bring It To Me
                    </button>
                  </div>
                </div>

                {/* Delivery Error Alert */}
                {deliveryError && (
                  <div className="alert alert-error">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{deliveryError}</span>
                  </div>
                )}

                {/* Delivery Address Input */}
                {deliveryMode === 'delivery' && (
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Delivery Address (Weligama only)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your address in Weligama or pin location on map"
                      className={`input input-bordered ${!isLocationValid ? 'input-error' : ''}`}
                      value={deliveryAddress}
                      onChange={handleAddressChange}
                    />
                    <label className="label">
                      <span className="label-text-alt text-info">
                        💡 Click on the map below to pin your exact location
                      </span>
                    </label>
                  </div>
                )}

                {/* Map Component */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">
                      {deliveryMode === 'pickup' ? 'Route to Agency' : 'Delivery Route'}
                    </span>
                  </label>
                  <div className="h-80 w-full rounded-lg overflow-hidden border-2 border-base-300">
                    <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
                      <GoogleMap
                        mapContainerStyle={{ width: '100%', height: '100%' }}
                        center={deliveryMode === 'pickup' ? AGENCY_LOCATION : (userLocation || AGENCY_LOCATION)}
                        zoom={14}
                        onLoad={(map) => setMap(map)}
                        onClick={handleMapClick}
                        options={{
                          zoomControl: true,
                          streetViewControl: false,
                          mapTypeControl: false,
                          fullscreenControl: true,
                        }}
                      >
                        {/* Agency Marker */}
                        <Marker
                          position={AGENCY_LOCATION}
                          title="Weligama Bus Stand - Pickup Location"
                          icon={{
                            url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
                          }}
                        />
                        
                        {/* User Location Marker for Delivery */}
                        {deliveryMode === 'delivery' && userLocation && (
                          <Marker
                            position={userLocation}
                            title="Your Delivery Location"
                            icon={{
                              url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
                            }}
                          />
                        )}
                        
                        {/* Directions */}
                        {directions && (
                          <DirectionsRenderer
                            directions={directions}
                            options={{
                              polylineOptions: {
                                strokeColor: deliveryMode === 'pickup' ? '#2563eb' : '#10b981',
                                strokeWeight: 5
                              }
                            }}
                          />
                        )}
                        
                        {/* Weligama Boundary Visualization */}
                        {deliveryMode === 'delivery' && (
                          <>
                            {/* This is a visual representation */}
                          </>
                        )}
                      </GoogleMap>
                    </LoadScript>
                  </div>
                  <label className="label">
                    <span className="label-text-alt">
                      {deliveryMode === 'pickup' 
                        ? '🗺️ Blue marker shows Weligama Bus Stand (pickup location). Route will be shown from your current location.'
                        : '🗺️ Red marker shows your delivery location. Blue marker is Weligama Bus Stand.'
                      }
                    </span>
                  </label>
                </div>
                
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

                {/* Mode Information */}
                <div className={`alert ${deliveryMode === 'pickup' ? 'alert-info' : 'alert-success'}`}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {deliveryMode === 'pickup' ? (
                      <>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </>
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                    )}
                  </svg>
                  <div>
                    <h3 className="font-bold">
                      {deliveryMode === 'pickup' ? 'Agency Pickup' : 'Home Delivery'}
                    </h3>
                    <p className="text-sm mt-1">
                      {deliveryMode === 'pickup' 
                        ? 'You will pick up your scooty from Weligama Bus Stand. The map shows the route from your location to the bus stand. Exact meeting point details will be sent to your email.'
                        : 'We will deliver the scooty to your location in Weligama. Our delivery person will contact you 30 minutes before arrival.'
                      }
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
                    <option value={deliveryMode === 'pickup' ? 'cash_on_pickup' : 'cash_on_delivery'}>
                      Cash on {deliveryMode === 'pickup' ? 'Pickup' : 'Delivery'}
                    </option>
                    <option value="bank_transfer">Bank Transfer (Advance Payment)</option>
                  </select>
                  <div className="label">
                    <span className="label-text-alt text-info">
                      💡 Payment will be collected {deliveryMode === 'pickup' ? 'when you pick up the scooty' : 'at the time of delivery'}
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
                  <span className="text-base-content/70">Delivery Mode</span>
                  <span className="font-semibold capitalize">
                    {deliveryMode === 'pickup' ? 'Agency Pickup' : 'Home Delivery'}
                  </span>
                </div>
                
                {deliveryMode === 'delivery' && deliveryAddress && (
                  <div className="flex justify-between">
                    <span className="text-base-content/70">Delivery Address</span>
                    <span className="font-semibold text-sm text-right">{deliveryAddress}</span>
                  </div>
                )}
                
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
                        Payment will be collected {deliveryMode === 'pickup' ? 'when you pick up' : 'when we deliver'} the scooty.
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
