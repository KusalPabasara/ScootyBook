const mongoose = require('mongoose');

const scootySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  brand: {
    type: String,
    required: true,
    trim: true
  },
  model: {
    type: String,
    required: true,
    trim: true
  },
  year: {
    type: Number,
    required: true,
    min: 2010,
    max: new Date().getFullYear() + 1
  },
  color: {
    type: String,
    required: true
  },
  engineCapacity: {
    type: String,
    required: true
  },
  fuelType: {
    type: String,
    enum: ['Petrol', 'Electric', 'Hybrid'],
    required: true
  },
  mileage: {
    type: String,
    required: true
  },
  pricePerHour: {
    type: Number,
    required: true,
    min: 0
  },
  pricePerDay: {
    type: Number,
    required: true,
    min: 0
  },
  features: [{
    type: String,
    trim: true
  }],
  images: [{
    type: String
  }],
  location: {
    address: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    pincode: {
      type: String,
      required: true
    },
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  availability: {
    type: Boolean,
    default: true
  },
  status: {
    type: String,
    enum: ['available', 'booked', 'maintenance', 'out_of_service'],
    default: 'available'
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  description: {
    type: String,
    maxlength: 500
  }
}, {
  timestamps: true
});

// Index for location-based searches
scootySchema.index({ 'location.coordinates': '2dsphere' });
scootySchema.index({ brand: 1, model: 1 });
scootySchema.index({ pricePerHour: 1, pricePerDay: 1 });

module.exports = mongoose.model('Scooty', scootySchema);
