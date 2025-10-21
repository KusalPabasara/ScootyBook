import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

interface Scooty {
  _id: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  color: string;
  fuelType: string;
  engineCapacity: string;
  mileage: string;
  pricePerHour: number;
  pricePerDay: number;
  features: string[];
  images: string[];
  rating: {
    average: number;
    count: number;
  };
  location: {
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  description: string;
  owner: {
    name: string;
    email: string;
    phone: string;
  };
}

const ScootyDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [scooty, setScooty] = useState<Scooty | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (id) {
      fetchScootyDetails();
    }
  }, [id]);

  // Keyboard navigation for image slider
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!scooty?.images || scooty.images.length <= 1) return;
      
      if (e.key === 'ArrowLeft') {
        setSelectedImageIndex(prev => prev === 0 ? scooty.images.length - 1 : prev - 1);
      } else if (e.key === 'ArrowRight') {
        setSelectedImageIndex(prev => prev === scooty.images.length - 1 ? 0 : prev + 1);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [scooty?.images]);

  const fetchScootyDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/scooties/${id}`);
      setScooty(response.data);
    } catch (error) {
      console.error('Error fetching scooty details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate(`/booking/${id}`);
  };

  const handleEditScooty = () => {
    navigate(`/edit-scooty/${id}`);
  };

  const handleDeleteScooty = async () => {
    try {
      setDeleting(true);
      await api.delete(`/api/scooties/${id}`);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error deleting scooty:', error);
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
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
          <p className="text-base-content/70 mb-4">
            The scooty you're looking for doesn't exist or has been removed.
          </p>
          <button onClick={() => navigate('/scooties')} className="btn btn-primary">
            Browse Scooties
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Images */}
        <div className="space-y-4">
          {/* Main Image Display */}
          <div className="image-slider-container">
            <div className="aspect-video bg-base-200 rounded-lg overflow-hidden shadow-lg image-slider-main">
              {scooty.images && scooty.images.length > 0 ? (
                <img
                  src={scooty.images[selectedImageIndex]}
                  alt={scooty.name}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-8xl">🛵</span>
                </div>
              )}
            </div>
            
            {/* Navigation Arrows */}
            {scooty.images && scooty.images.length > 1 && (
              <>
                <button
                  onClick={() => setSelectedImageIndex(selectedImageIndex === 0 ? scooty.images.length - 1 : selectedImageIndex - 1)}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 btn btn-circle btn-primary btn-sm image-slider-nav-btn"
                  title="Previous image (←)"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={() => setSelectedImageIndex(selectedImageIndex === scooty.images.length - 1 ? 0 : selectedImageIndex + 1)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 btn btn-circle btn-primary btn-sm image-slider-nav-btn"
                  title="Next image (→)"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}
            
            {/* Image Counter */}
            {scooty.images && scooty.images.length > 1 && (
              <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm image-slider-counter">
                {selectedImageIndex + 1} / {scooty.images.length}
              </div>
            )}
          </div>
          
          {/* Thumbnail Navigation */}
          {scooty.images && scooty.images.length > 1 && (
            <div className="image-slider-thumbnails">
              <div className="flex gap-2 overflow-x-auto pb-2">
                {scooty.images.map((image, index) => (
                  <button
                    key={index}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden image-slider-thumbnail ${
                      selectedImageIndex === index 
                        ? 'active ring-2 ring-primary' 
                        : 'hover:opacity-100 opacity-70'
                    }`}
                    onClick={() => setSelectedImageIndex(index)}
                    title={`View image ${index + 1}`}
                  >
                    <img
                      src={image}
                      alt={`${scooty.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Keyboard Navigation Hint */}
          {scooty.images && scooty.images.length > 1 && (
            <div className="text-center text-sm text-base-content/60 flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Use ← → arrow keys to navigate images
            </div>
          )}
        </div>

        {/* Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {scooty.brand} {scooty.model}
            </h1>
            <div className="flex items-center gap-4 mb-4">
              <div className="badge badge-secondary">{scooty.year}</div>
              <div className="badge badge-outline">{scooty.color}</div>
              <div className="badge badge-outline">{scooty.fuelType}</div>
            </div>
            
            <div className="flex items-center gap-2 mb-4">
              <div className="rating rating-sm">
                {[...Array(5)].map((_, i) => (
                  <input
                    key={i}
                    type="radio"
                    name={`rating-${scooty._id}`}
                    className="mask mask-star-2 bg-orange-400"
                    checked={i < Math.floor(scooty.rating.average)}
                    readOnly
                  />
                ))}
              </div>
              <span className="text-sm text-base-content/70">
                {scooty.rating.average.toFixed(1)} ({scooty.rating.count} reviews)
              </span>
            </div>
          </div>

          {/* Pricing */}
          <div className="card bg-base-100 shadow-xl p-6">
            <h2 className="text-xl font-semibold mb-4">Pricing</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">LKR {scooty.pricePerHour}</div>
                <div className="text-sm text-base-content/70">per hour</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">LKR {scooty.pricePerDay}</div>
                <div className="text-sm text-base-content/70">per day</div>
              </div>
            </div>
            <button
              onClick={handleBookNow}
              className="btn btn-primary btn-lg w-full mt-4"
            >
              Book Now
            </button>
            
            {/* Admin Actions */}
            {user && user.role === 'admin' && (
              <div className="flex gap-2 mt-4">
                <button
                  onClick={handleEditScooty}
                  className="btn btn-secondary flex-1"
                >
                  Edit Scooty
                </button>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="btn btn-error flex-1"
                >
                  Delete Scooty
                </button>
              </div>
            )}
          </div>

          {/* Specifications */}
          <div className="card bg-base-100 shadow-xl p-6">
            <h2 className="text-xl font-semibold mb-4">Specifications</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-base-content/70">Engine Capacity</div>
                <div className="font-semibold">{scooty.engineCapacity}</div>
              </div>
              <div>
                <div className="text-sm text-base-content/70">Mileage</div>
                <div className="font-semibold">{scooty.mileage}</div>
              </div>
              <div>
                <div className="text-sm text-base-content/70">Fuel Type</div>
                <div className="font-semibold">{scooty.fuelType}</div>
              </div>
              <div>
                <div className="text-sm text-base-content/70">Year</div>
                <div className="font-semibold">{scooty.year}</div>
              </div>
            </div>
          </div>

          {/* Features */}
          {scooty.features && scooty.features.length > 0 && (
            <div className="card bg-base-100 shadow-xl p-6">
              <h2 className="text-xl font-semibold mb-4">Features</h2>
              <div className="grid grid-cols-2 gap-2">
                {scooty.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="text-success">✓</span>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Location */}
          <div className="card bg-base-100 shadow-xl p-6">
            <h2 className="text-xl font-semibold mb-4">Location</h2>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-base-content/70">📍</span>
                <span>{scooty.location.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-base-content/70">🏙️</span>
                <span>{scooty.location.city}, {scooty.location.state} - {scooty.location.pincode}</span>
              </div>
            </div>
          </div>

          {/* Owner Info */}
          <div className="card bg-base-100 shadow-xl p-6">
            <h2 className="text-xl font-semibold mb-4">Owner</h2>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-base-content/70">👤</span>
                <span>{scooty.owner.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-base-content/70">📧</span>
                <span>{scooty.owner.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-base-content/70">📞</span>
                <span>{scooty.owner.phone}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          {scooty.description && (
            <div className="card bg-base-100 shadow-xl p-6">
              <h2 className="text-xl font-semibold mb-4">Description</h2>
              <p className="text-base-content/80">{scooty.description}</p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Delete Scooty</h3>
            <p className="py-4">
              Are you sure you want to delete "{scooty?.name}"? This action cannot be undone.
            </p>
            <div className="modal-action">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="btn btn-ghost"
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteScooty}
                className={`btn btn-error ${deleting ? 'loading' : ''}`}
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScootyDetails;
