import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
      const params = {
        page: pagination.currentPage,
        limit: pagination.itemsPerPage,
        ...Object.fromEntries(
          Object.entries(filters).filter(([key, value]) => value !== '')
        )
      };
      
      const response = await api.get('/api/scooties', { params });
      
      if (response.data.scooties && Array.isArray(response.data.scooties)) {
        setScooties(response.data.scooties);
        setPagination(response.data.pagination);
      } else {
        setScooties([]);
      }
    } catch (error: any) {
      console.error('Error fetching scooties:', error);
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-sky-200 dark:border-sky-900 border-t-sky-600 rounded-full animate-spin"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading scooties...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Available Scooters</h1>
              <p className="mt-2 text-slate-600 dark:text-slate-400">Find the perfect ride for your Weligama adventure.</p>
            </div>
            <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg px-4 py-2 flex items-center text-amber-800 dark:text-amber-200 w-fit">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/>
              </svg>
              <span className="font-medium text-sm">Cash on Delivery Only</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Filters</h2>
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                </svg>
              </div>

              <div className="space-y-5">
                {/* Brand Filter */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Brand</label>
                  <input
                    type="text"
                    placeholder="e.g., Honda, Yamaha"
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none dark:text-white"
                    value={inputValues.brand}
                    onChange={(e) => handleInputChange('brand', e.target.value)}
                  />
                </div>

                {/* City Filter */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">City</label>
                  <input
                    type="text"
                    placeholder="e.g., Weligama, Colombo"
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none dark:text-white"
                    value={inputValues.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                  />
                </div>

                {/* Fuel Type Filter */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Fuel Type</label>
                  <select
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none dark:text-white"
                    value={inputValues.fuelType}
                    onChange={(e) => handleInputChange('fuelType', e.target.value)}
                  >
                    <option value="">All Types</option>
                    <option value="Petrol">Petrol</option>
                    <option value="Electric">Electric</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Price Range</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      className="w-1/2 px-3 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 outline-none dark:text-white"
                      value={inputValues.minPrice}
                      onChange={(e) => handleInputChange('minPrice', e.target.value)}
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      className="w-1/2 px-3 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 outline-none dark:text-white"
                      value={inputValues.maxPrice}
                      onChange={(e) => handleInputChange('maxPrice', e.target.value)}
                    />
                  </div>
                </div>

                {/* Sort By */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Sort By</label>
                  <select
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 outline-none dark:text-white"
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
                  </select>
                </div>

                {/* Filter Buttons */}
                <div className="space-y-2 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <button 
                    onClick={applyFilters}
                    className="w-full bg-sky-600 hover:bg-sky-700 text-white font-medium py-2.5 rounded-lg transition-colors"
                  >
                    Apply Filters
                  </button>
                  <button 
                    onClick={clearFilters}
                    className="w-full bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white font-medium py-2.5 rounded-lg transition-colors hover:bg-slate-200 dark:hover:bg-slate-600"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Results Header */}
            <div className="mb-6">
              <p className="text-slate-600 dark:text-slate-400">
                Showing <span className="font-semibold text-slate-900 dark:text-white">{scooties.length}</span> of <span className="font-semibold text-slate-900 dark:text-white">{pagination.totalItems}</span> scooters
              </p>
            </div>

            {/* Scooters Grid */}
            {scooties.length === 0 ? (
              <div className="text-center py-20">
                <svg className="w-20 h-20 mx-auto text-slate-300 dark:text-slate-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M16 7v10H8V7m8 0V5a2 2 0 00-2-2H10a2 2 0 00-2 2v2m0 0H6a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2zm-2 3a1 1 0 11-2 0 1 1 0 012 0z" />
                </svg>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">No scooters found</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6">Try adjusting your filters or check back later for new listings.</p>
                <button onClick={clearFilters} className="text-sky-600 hover:text-sky-700 font-medium">
                  Clear all filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {scooties.map((scooty) => (
                    <ScootyCard key={scooty._id} scooty={scooty} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex justify-center gap-2">
                    <button
                      disabled={pagination.currentPage === 1}
                      onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
                      className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-900 dark:text-white"
                    >
                      Previous
                    </button>
                    
                    {[...Array(Math.min(pagination.totalPages, 5))].map((_, i) => {
                      const pageNum = pagination.currentPage - 2 + i;
                      if (pageNum < 1 || pageNum > pagination.totalPages) return null;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setPagination(prev => ({ ...prev, currentPage: pageNum }))}
                          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            pagination.currentPage === pageNum
                              ? 'bg-sky-600 text-white'
                              : 'border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    
                    <button
                      disabled={pagination.currentPage === pagination.totalPages}
                      onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
                      className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-900 dark:text-white"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Scooties;
