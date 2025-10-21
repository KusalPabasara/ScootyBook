const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  scooty: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Scooty',
    required: true
  },
  bookingType: {
    type: String,
    enum: ['hourly', 'daily'],
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  pickupLocation: {
    address: String,
    city: String,
    state: String,
    pincode: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  dropoffLocation: {
    address: String,
    city: String,
    state: String,
    pincode: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  duration: {
    hours: Number,
    days: Number
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'active', 'completed', 'cancelled'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded', 'failed'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['cash_on_pickup', 'bank_transfer'],
    default: 'cash_on_pickup'
  },
  specialRequests: {
    type: String,
    maxlength: 500
  },
  cancellationReason: {
    type: String,
    maxlength: 200
  },
  cancellationDate: {
    type: Date
  },
  refundAmount: {
    type: Number,
    default: 0
  },
  rating: {
    scooty: {
      type: Number,
      min: 1,
      max: 5
    },
    service: {
      type: Number,
      min: 1,
      max: 5
    },
    review: {
      type: String,
      maxlength: 500
    }
  },
  documents: {
    license: String,
    idProof: String
  }
}, {
  timestamps: true
});

// Index for efficient queries
bookingSchema.index({ user: 1, createdAt: -1 });
bookingSchema.index({ scooty: 1, startDate: 1, endDate: 1 });
bookingSchema.index({ status: 1 });

// Virtual for calculating duration
bookingSchema.virtual('calculatedDuration').get(function() {
  const diffTime = Math.abs(this.endDate - this.startDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
  
  if (this.bookingType === 'daily') {
    return { days: diffDays, hours: 0 };
  } else {
    return { days: 0, hours: diffHours };
  }
});

module.exports = mongoose.model('Booking', bookingSchema);
