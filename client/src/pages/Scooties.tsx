import React, { useState, useEffect } from 'react';
import api from '../services/api';
import ScootyCard from '../components/ScootyCard';

interface Scooty {
  _id: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  color: string;
  fuelType: string;
  pricePerHour: number;
  pricePerDay: number;
  images: string[];
  rating: {
    average: number;
    count: number;
  };
  location: {
    city: string;
    state: string;
  };
}

const Scooties: React.FC = () => {
  const [scooties, setScooties] = useState<Scooty[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    brand: '',
    city: '',
    minPrice: '',
    maxPrice: '',
    fuelType: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  const [inputValues, setInputValues] = useState({
    brand: '',
    city: '',
    minPrice: '',
    maxPrice: '',
    fuelType: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 12
  });

  useEffect(() => {
    fetchScooties();
  }, [filters, pagination.currentPage]);

  const fetchScooties = async () => {
    try {
      setLoading(true);
      console.log('🔍 Fetching scooties with filters:', filters);
      console.log('🔍 Pagination:', pagination);
      console.log('🔍 API base URL:', process.env.REACT_APP_API_URL || 'http://localhost:5000');
      
      const params = {
        page: pagination.currentPage,
        limit: pagination.itemsPerPage,
        ...Object.fromEntries(
          Object.entries(filters).filter(([key, value]) => value !== '')
        )
      };
      
      console.log('🔍 API params:', params);
      console.log('🔍 Making API call to:', '/api/scooties');
      
      const response = await api.get('/api/scooties', { params });
      console.log('✅ Scooties API response:', response.data);
      console.log('✅ Scooties array:', response.data.scooties);
      console.log('✅ Scooties count:', response.data.scooties?.length);
      console.log('✅ Pagination:', response.data.pagination);
      
      if (response.data.scooties && Array.isArray(response.data.scooties)) {
        setScooties(response.data.scooties);
        setPagination(response.data.pagination);
        
        console.log('✅ State updated - scooties:', response.data.scooties);
        console.log('✅ State updated - scooties length:', response.data.scooties?.length);
      } else {
        console.error('❌ Invalid response format:', response.data);
        setScooties([]);
      }
    } catch (error: any) {
      console.error('❌ Error fetching scooties:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      console.error('Error message:', error.message);
      setScooties([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (key: string, value: string) => {
    setInputValues(prev => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    setFilters(inputValues);
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const clearFilters = () => {
    const clearedValues = {
      brand: '',
      city: '',
      minPrice: '',
      maxPrice: '',
      fuelType: '',
      sortBy: 'createdAt',
      sortOrder: 'desc'
    };
    setInputValues(clearedValues);
    setFilters(clearedValues);
    setPagination(prev => ({ ...prev, currentPage: 1 }));
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

  // Debug logging
  console.log('🔍 Render - scooties state:', scooties);
  console.log('🔍 Render - scooties length:', scooties.length);
  console.log('🔍 Render - loading state:', loading);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Available Scooties</h1>
        
        {/* Filters */}
        <div className="card bg-base-100 shadow-xl p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Brand</span>
              </label>
              <input
                type="text"
                placeholder="e.g., Honda, Yamaha"
                className="input input-bordered"
                value={inputValues.brand}
                onChange={(e) => handleInputChange('brand', e.target.value)}
              />
            </div>
            
            <div className="form-control">
              <label className="label">
                <span className="label-text">City</span>
              </label>
              <input
                type="text"
                placeholder="e.g., Colombo, Kandy, Galle"
                className="input input-bordered"
                value={inputValues.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
              />
            </div>
            
            <div className="form-control">
              <label className="label">
                <span className="label-text">Fuel Type</span>
              </label>
              <select
                className="select select-bordered"
                value={inputValues.fuelType}
                onChange={(e) => handleInputChange('fuelType', e.target.value)}
              >
                <option value="">All Types</option>
                <option value="Petrol">Petrol</option>
                <option value="Electric">Electric</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>
            
            <div className="form-control">
              <label className="label">
                <span className="label-text">Sort By</span>
              </label>
              <select
                className="select select-bordered"
                value={`${inputValues.sortBy}-${inputValues.sortOrder}`}
                onChange={(e) => {
                  const [sortBy, sortOrder] = e.target.value.split('-');
                  setInputValues(prev => ({ ...prev, sortBy, sortOrder }));
                }}
              >
                <option value="createdAt-desc">Newest First</option>
                <option value="createdAt-asc">Oldest First</option>
                <option value="pricePerHour-asc">Price: Low to High</option>
                <option value="pricePerHour-desc">Price: High to Low</option>
                <option value="rating-desc">Highest Rated</option>
              </select>
            </div>
          </div>
          
          <div className="flex justify-between items-center mt-6">
            <div className="text-sm text-base-content/70">
              Showing {scooties.length} of {pagination.totalItems} scooties
            </div>
            <div className="flex gap-2">
              <button onClick={applyFilters} className="btn btn-primary">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                </svg>
                Apply Filters
              </button>
              <button onClick={clearFilters} className="btn btn-outline">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Scooties Grid */}
      {scooties.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🛵</div>
          <h3 className="text-xl font-semibold mb-2">No scooties found</h3>
          <p className="text-base-content/70">
            Try adjusting your filters or check back later for new listings.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {scooties.map((scooty) => {
              console.log('🛵 Rendering scooty:', scooty);
              return <ScootyCard key={scooty._id} scooty={scooty} />;
            })}
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

export default Scooties;
