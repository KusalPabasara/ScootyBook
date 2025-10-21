import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const AddScooty: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
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
    location: {
      address: '',
      city: '',
      state: '',
      pincode: ''
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (name.includes('location.')) {
      const field = name.split('.')[1];
      let processedValue = value;
      
      // Special handling for pincode - only allow numbers
      if (field === 'pincode') {
        processedValue = value.replace(/\D/g, ''); // Remove non-digits
      }
      
      setFormData(prev => ({
        ...prev,
        location: {
          ...prev.location,
          [field]: processedValue
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'number' ? parseFloat(value) || 0 : value
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Enhanced debugging
    console.log('=== ADD SCOOTY DEBUG ===');
    console.log('User object:', user);
    console.log('User role:', user?.role);
    console.log('User ID:', user?.id);
    console.log('Token in localStorage:', localStorage.getItem('token'));
    console.log('Form data:', formData);

    try {
      // Validate and prepare data according to backend requirements
      const scootyData = {
        name: formData.name.trim(),
        brand: formData.brand.trim(),
        model: formData.model.trim(),
        year: parseInt(formData.year.toString()), // Ensure integer
        color: formData.color.trim(),
        engineCapacity: formData.engineCapacity.trim(),
        fuelType: formData.fuelType,
        mileage: formData.mileage.trim(),
        pricePerHour: parseFloat(formData.pricePerHour.toString()), // Ensure float
        pricePerDay: parseFloat(formData.pricePerDay.toString()), // Ensure float
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

      console.log('Submitting scooty data:', scootyData);
      
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
      
      // Add image files
      formData.images.forEach((file, index) => {
        formDataToSend.append('images', file);
      });

      // Test API call with detailed logging
      console.log('Making API call to:', '/api/scooties');
      console.log('API base URL:', process.env.REACT_APP_API_URL || 'http://localhost:5000');
      console.log('FormData entries:', Array.from(formDataToSend.entries()));
      console.log('ScootyData object:', scootyData);
      
      const response = await api.post('/api/scooties', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('✅ Success response:', response.data);
      navigate('/dashboard');
    } catch (err: any) {
      console.error('❌ Error adding scooty:');
      console.error('Error object:', err);
      console.error('Error response:', err.response);
      console.error('Error data:', err.response?.data);
      console.error('Error status:', err.response?.status);
      console.error('Error message:', err.message);
      console.error('Error stack:', err.stack);
      
      // Handle validation errors from backend
      if (err.response?.status === 400 && err.response?.data?.errors) {
        const validationErrors = err.response.data.errors.map((error: any) => error.msg).join(', ');
        setError(`Validation Error: ${validationErrors}`);
      } else {
        const errorMessage = err.response?.data?.message || err.message || 'Failed to add scooty';
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  if (user.role !== 'admin') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="alert alert-error">
            <span>Access denied. Only admins can add scooties.</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">List Your Scooty</h1>
        
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            {error && (
              <div className="alert alert-error mb-4">
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Basic Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Brand</span>
                    </label>
                    <input
                      type="text"
                      name="brand"
                      placeholder="e.g., Honda, Yamaha"
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
                      placeholder="e.g., Activa, Dio"
                      className="input input-bordered"
                      value={formData.model}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Display Name</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="e.g., My Honda Activa"
                    className="input input-bordered"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
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
                      placeholder="e.g., Red, Blue"
                      className="input input-bordered"
                      value={formData.color}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
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
                </div>
              </div>

              {/* Technical Specifications */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Technical Specifications</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Engine Capacity</span>
                    </label>
                    <input
                      type="text"
                      name="engineCapacity"
                      placeholder="e.g., 110cc, 125cc"
                      className="input input-bordered"
                      value={formData.engineCapacity}
                      onChange={handleChange}
                      required
                    />
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

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Features (comma separated)</span>
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
                      placeholder="e.g., 50"
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
                      placeholder="e.g., 500"
                      className="input input-bordered"
                      value={formData.pricePerDay}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
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
                    placeholder="Enter complete address"
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

              {/* Description */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Description</span>
                </label>
                <textarea
                  name="description"
                  placeholder="Describe your scooty, its condition, and any special notes..."
                  className="textarea textarea-bordered"
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>

              {/* Image Upload Section */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Scooty Photos</span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="file-input file-input-bordered w-full"
                />
                <div className="label">
                  <span className="label-text-alt">Upload multiple photos of your scooty (JPG, PNG, WebP)</span>
                </div>
                
                {/* Image Preview */}
                {formData.images.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-sm font-semibold mb-2">Selected Images:</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {formData.images.map((file, index) => (
                        <div key={index} className="relative">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Preview ${index + 1}`}
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

              <div className="form-control mt-6">
                <button
                  type="submit"
                  className={`btn btn-primary btn-lg ${loading ? 'loading' : ''}`}
                  disabled={loading}
                >
                  {loading ? 'Adding Scooty...' : 'List My Scooty'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddScooty;
