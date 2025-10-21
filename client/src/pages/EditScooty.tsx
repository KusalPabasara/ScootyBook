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
  engineCapacity: string;
  fuelType: string;
  mileage: string;
  pricePerHour: number;
  pricePerDay: number;
  features: string[];
  description: string;
  images: string[];
  location: {
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
}

const EditScooty: React.FC = () => {
  const { scootyId } = useParams<{ scootyId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    color: '',
    engineCapacity: '',
    fuelType: 'Petrol',
    mileage: '',
    pricePerHour: 0,
    pricePerDay: 0,
    features: '',
    description: '',
    images: [] as File[],
    existingImages: [] as string[],
    location: {
      address: '',
      city: '',
      state: '',
      pincode: ''
    }
  });

  useEffect(() => {
    if (!user || user.role !== 'admin') {
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
      const response = await api.get(`/api/scooties/${scootyId}`);
      const scooty = response.data;
      
      setFormData({
        name: scooty.name || '',
        brand: scooty.brand || '',
        model: scooty.model || '',
        year: scooty.year || new Date().getFullYear(),
        color: scooty.color || '',
        engineCapacity: scooty.engineCapacity || '',
        fuelType: scooty.fuelType || 'Petrol',
        mileage: scooty.mileage || '',
        pricePerHour: scooty.pricePerHour || 0,
        pricePerDay: scooty.pricePerDay || 0,
        features: Array.isArray(scooty.features) ? scooty.features.join(', ') : '',
        description: scooty.description || '',
        images: [],
        existingImages: scooty.images || [],
        location: {
          address: scooty.location?.address || '',
          city: scooty.location?.city || '',
          state: scooty.location?.state || '',
          pincode: scooty.location?.pincode || ''
        }
      });
    } catch (error) {
      console.error('Error fetching scooty details:', error);
      setError('Failed to load scooty details');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('location.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        location: {
          ...prev.location,
          [field]: value
        }
      }));
    } else if (name === 'pricePerHour' || name === 'pricePerDay' || name === 'year') {
      setFormData(prev => ({
        ...prev,
        [name]: parseFloat(value) || 0
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...fileArray]
      }));
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const removeExistingImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      existingImages: prev.existingImages.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const scootyData = {
        name: formData.name.trim(),
        brand: formData.brand.trim(),
        model: formData.model.trim(),
        year: formData.year,
        color: formData.color.trim(),
        engineCapacity: formData.engineCapacity.trim(),
        fuelType: formData.fuelType,
        mileage: formData.mileage.trim(),
        pricePerHour: formData.pricePerHour,
        pricePerDay: formData.pricePerDay,
        features: formData.features.split(',').map(f => f.trim()).filter(f => f),
        description: formData.description.trim(),
        location: {
          address: formData.location.address.trim(),
          city: formData.location.city.trim(),
          state: formData.location.state.trim(),
          pincode: formData.location.pincode.trim()
        }
      };

      // Additional validation
      if (scootyData.location.pincode.length !== 5) {
        throw new Error('Pincode must be exactly 5 digits');
      }
      
      if (scootyData.year < 2010 || scootyData.year > new Date().getFullYear() + 1) {
        throw new Error(`Year must be between 2010 and ${new Date().getFullYear() + 1}`);
      }

      // Create FormData for file upload
      const formDataToSend = new FormData();
      
      // Add all text fields
      Object.keys(scootyData).forEach(key => {
        const typedKey = key as keyof typeof scootyData;
        if (typedKey === 'features') {
          formDataToSend.append(typedKey, JSON.stringify(scootyData[typedKey]));
        } else if (typedKey === 'location') {
          // Send location fields individually for backend validation
          const location = scootyData[typedKey] as { address: string; city: string; state: string; pincode: string };
          formDataToSend.append('location.address', location.address);
          formDataToSend.append('location.city', location.city);
          formDataToSend.append('location.state', location.state);
          formDataToSend.append('location.pincode', location.pincode);
        } else {
          formDataToSend.append(typedKey, String(scootyData[typedKey]));
        }
      });
      
      // Add existing images that weren't removed
      formData.existingImages.forEach(imageUrl => {
        formDataToSend.append('existingImages', imageUrl);
      });
      
      // Add new image files
      formData.images.forEach((file, index) => {
        formDataToSend.append('images', file);
      });

      console.log('Updating scooty with FormData:', Array.from(formDataToSend.entries()));

      await api.put(`/api/scooties/${scootyId}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to update scooty');
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

  if (!user || user.role !== 'admin') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="alert alert-error">
            <span>Access denied. Only admins can edit scooties.</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h1 className="text-3xl font-bold mb-6">Edit Scooty</h1>
            
            {error && (
              <div className="alert alert-error mb-4">
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Basic Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Scooty Name</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      placeholder="e.g., Honda Activa"
                      className="input input-bordered"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Brand</span>
                    </label>
                    <input
                      type="text"
                      name="brand"
                      placeholder="e.g., Honda"
                      className="input input-bordered"
                      value={formData.brand}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Model</span>
                    </label>
                    <input
                      type="text"
                      name="model"
                      placeholder="e.g., Activa 6G"
                      className="input input-bordered"
                      value={formData.model}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Year</span>
                    </label>
                    <input
                      type="number"
                      name="year"
                      min="2010"
                      max={new Date().getFullYear() + 1}
                      className="input input-bordered"
                      value={formData.year}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Color</span>
                    </label>
                    <input
                      type="text"
                      name="color"
                      placeholder="e.g., Red"
                      className="input input-bordered"
                      value={formData.color}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Engine Capacity</span>
                    </label>
                    <input
                      type="text"
                      name="engineCapacity"
                      placeholder="e.g., 110cc"
                      className="input input-bordered"
                      value={formData.engineCapacity}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Fuel Type</span>
                    </label>
                    <select
                      name="fuelType"
                      className="select select-bordered"
                      value={formData.fuelType}
                      onChange={handleChange}
                      required
                    >
                      <option value="Petrol">Petrol</option>
                      <option value="Electric">Electric</option>
                      <option value="Hybrid">Hybrid</option>
                    </select>
                  </div>
                  
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Mileage</span>
                    </label>
                    <input
                      type="text"
                      name="mileage"
                      placeholder="e.g., 45 kmpl"
                      className="input input-bordered"
                      value={formData.mileage}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Pricing</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Price per Hour (LKR)</span>
                    </label>
                    <input
                      type="number"
                      name="pricePerHour"
                      min="0"
                      step="0.01"
                      className="input input-bordered"
                      value={formData.pricePerHour}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Price per Day (LKR)</span>
                    </label>
                    <input
                      type="number"
                      name="pricePerDay"
                      min="0"
                      step="0.01"
                      className="input input-bordered"
                      value={formData.pricePerDay}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Features (comma-separated)</span>
                </label>
                <input
                  type="text"
                  name="features"
                  placeholder="e.g., Digital Speedometer, LED Headlight, Mobile Charging"
                  className="input input-bordered"
                  value={formData.features}
                  onChange={handleChange}
                />
              </div>

              {/* Description */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Description</span>
                </label>
                <textarea
                  name="description"
                  placeholder="Describe the scooty..."
                  className="textarea textarea-bordered"
                  rows={3}
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>

              {/* Image Upload Section */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Scooty Photos</span>
                </label>
                
                {/* Existing Images */}
                {formData.existingImages.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-sm font-semibold mb-2">Current Images:</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {formData.existingImages.map((imageUrl, index) => (
                        <div key={index} className="relative">
                          <img
                            src={`http://localhost:5000${imageUrl}`}
                            alt={`Current ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border"
                          />
                          <button
                            type="button"
                            onClick={() => removeExistingImage(index)}
                            className="absolute -top-2 -right-2 btn btn-sm btn-circle btn-error"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Add New Images */}
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="file-input file-input-bordered w-full"
                />
                <div className="label">
                  <span className="label-text-alt">Upload additional photos (JPG, PNG, WebP)</span>
                </div>
                
                {/* New Image Preview */}
                {formData.images.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-sm font-semibold mb-2">New Images:</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {formData.images.map((file, index) => (
                        <div key={index} className="relative">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`New ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 btn btn-sm btn-circle btn-error"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Location */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Location</h2>
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Address</span>
                  </label>
                  <input
                    type="text"
                    name="location.address"
                    placeholder="Enter full address"
                    className="input input-bordered"
                    value={formData.location.address}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">City</span>
                    </label>
                    <input
                      type="text"
                      name="location.city"
                      placeholder="e.g., Colombo"
                      className="input input-bordered"
                      value={formData.location.city}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">State</span>
                    </label>
                    <input
                      type="text"
                      name="location.state"
                      placeholder="e.g., Western Province"
                      className="input input-bordered"
                      value={formData.location.state}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Pincode</span>
                    </label>
                      <input
                        type="text"
                        name="location.pincode"
                        placeholder="e.g., 10000"
                        className="input input-bordered"
                        value={formData.location.pincode}
                        onChange={handleChange}
                        maxLength={5}
                        pattern="[0-9]{5}"
                        title="Pincode must be exactly 5 digits"
                        required
                      />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex gap-4">
                <button
                  type="submit"
                  className={`btn btn-primary flex-1 ${submitting ? 'loading' : ''}`}
                  disabled={submitting}
                >
                  {submitting ? 'Updating...' : 'Update Scooty'}
                </button>
                
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => navigate('/dashboard')}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditScooty;

