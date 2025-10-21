const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Booking = require('../models/Booking');
const Scooty = require('../models/Scooty');
const User = require('../models/User');
const auth = require('../middleware/auth');
const emailService = require('../services/emailService');
const smsService = require('../services/smsService');

const router = express.Router();

// Create new booking
router.post('/', auth, [
  body('scooty').isMongoId().withMessage('Valid scooty ID is required'),
  body('bookingType').isIn(['hourly', 'daily']).withMessage('Booking type must be hourly or daily'),
  body('startDate').isISO8601().withMessage('Valid start date is required'),
  body('endDate').isISO8601().withMessage('Valid end date is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      scooty: scootyId,
      bookingType,
      startDate,
      endDate,
      specialRequests,
      paymentMethod = 'cash_on_pickup'
    } = req.body;

    // Check if user profile is complete (has license and phone)
    const user = await User.findById(req.userId);
    if (!user.isProfileComplete || !user.licenseNumber || !user.phone) {
      return res.status(400).json({ 
        message: 'Please complete your profile with license number and phone number before booking',
        requiresProfileCompletion: true
      });
    }

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    const now = new Date();

    if (start < now) {
      return res.status(400).json({ message: 'Start date cannot be in the past' });
    }

    if (end <= start) {
      return res.status(400).json({ message: 'End date must be after start date' });
    }

    // Check if scooty exists and is available
    const scooty = await Scooty.findById(scootyId);
    if (!scooty) {
      return res.status(404).json({ message: 'Scooty not found' });
    }

    if (!scooty.availability || scooty.status !== 'available') {
      return res.status(400).json({ message: 'Scooty is not available for booking' });
    }

    // Check for conflicting bookings
    const conflictingBooking = await Booking.findOne({
      scooty: scootyId,
      status: { $in: ['confirmed', 'active'] },
      $or: [
        {
          startDate: { $lte: start },
          endDate: { $gt: start }
        },
        {
          startDate: { $lt: end },
          endDate: { $gte: end }
        },
        {
          startDate: { $gte: start },
          endDate: { $lte: end }
        }
      ]
    });

    if (conflictingBooking) {
      return res.status(400).json({ message: 'Scooty is already booked for this time period' });
    }

    // Calculate duration and total amount
    const durationMs = end - start;
    const hours = Math.ceil(durationMs / (1000 * 60 * 60));
    const days = Math.ceil(durationMs / (1000 * 60 * 60 * 24));

    let totalAmount = 0;
    if (bookingType === 'hourly') {
      totalAmount = scooty.pricePerHour * hours;
    } else {
      totalAmount = scooty.pricePerDay * days;
    }

    // Create booking
    const booking = new Booking({
      user: req.userId,
      scooty: scootyId,
      bookingType,
      startDate: start,
      endDate: end,
      duration: bookingType === 'hourly' ? { hours, days: 0 } : { hours: 0, days },
      totalAmount,
      specialRequests,
      paymentMethod
    });

    await booking.save();

    // Populate the booking with scooty and user details
    await booking.populate([
      { path: 'scooty', select: 'name brand model color year pricePerHour pricePerDay' },
      { path: 'user', select: 'name email phone' }
    ]);

    // Send booking confirmation email
    try {
      const emailTemplate = emailService.generateBookingConfirmationEmail(booking, booking.scooty, booking.user);
      await emailService.sendEmail(booking.user.email, emailTemplate.subject, emailTemplate.html, emailTemplate.text);
      console.log('✅ Booking confirmation email sent to:', booking.user.email);
    } catch (emailError) {
      console.error('❌ Error sending booking confirmation email:', emailError);
      // Don't fail the booking creation if email fails
    }

    // Send booking confirmation SMS
    if (process.env.SMS_ENABLED === 'true' && process.env.SMS_SEND_CONFIRMATION === 'true') {
      try {
        if (smsService.isServiceConfigured() && booking.user.phone) {
          const smsMessage = smsService.generateBookingConfirmationSMS(booking, booking.scooty, booking.user);
          await smsService.sendSMS(booking.user.phone, smsMessage);
          console.log('✅ Booking confirmation SMS sent to:', booking.user.phone);
        } else {
          console.log('⚠️ SMS service not configured or user phone not available');
        }
      } catch (smsError) {
        console.error('❌ Error sending booking confirmation SMS:', smsError);
        // Don't fail the booking creation if SMS fails
      }
    }

    res.status(201).json({
      message: 'Booking created successfully',
      booking
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ message: 'Server error while creating booking' });
  }
});

// Get booked dates for a specific scooty
router.get('/scooty/:scootyId/booked-dates', async (req, res) => {
  try {
    const { scootyId } = req.params;
    
    // Get all confirmed and active bookings for this scooty
    const bookings = await Booking.find({
      scooty: scootyId,
      status: { $in: ['confirmed', 'active'] }
    }).select('startDate endDate status');

    // Convert bookings to date ranges
    const bookedDates = bookings.map(booking => ({
      startDate: booking.startDate,
      endDate: booking.endDate,
      status: booking.status
    }));

    res.json({
      bookedDates,
      message: 'Booked dates retrieved successfully'
    });
  } catch (error) {
    console.error('Get booked dates error:', error);
    res.status(500).json({ message: 'Server error while fetching booked dates' });
  }
});

// Get all bookings (Admin only)
router.get('/admin/all', auth, [
  query('status').optional().isIn(['pending', 'confirmed', 'active', 'completed', 'cancelled']),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 })
], async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can access all bookings' });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { status, page = 1, limit = 10 } = req.query;
    const filter = {};
    
    if (status) filter.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const bookings = await Booking.find(filter)
      .populate('scooty', 'name brand model color year images owner')
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Booking.countDocuments(filter);

    res.json({
      bookings,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get all bookings error:', error);
    res.status(500).json({ message: 'Server error while fetching bookings' });
  }
});

// Get user's bookings
router.get('/my-bookings', auth, [
  query('status').optional().isIn(['pending', 'confirmed', 'active', 'completed', 'cancelled']),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { status, page = 1, limit = 10 } = req.query;
    const filter = { user: req.userId };
    
    if (status) filter.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const bookings = await Booking.find(filter)
      .populate('scooty', 'name brand model color year images')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Booking.countDocuments(filter);

    res.json({
      bookings,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get user bookings error:', error);
    res.status(500).json({ message: 'Server error while fetching bookings' });
  }
});

// Get single booking
router.get('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('scooty')
      .populate('user', 'name email phone');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user is authorized to view this booking
    if (booking.user._id.toString() !== req.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this booking' });
    }

    res.json(booking);
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({ message: 'Server error while fetching booking' });
  }
});

// Update booking status (Admin/Owner only)
router.put('/:id/status', auth, [
  body('status').isIn(['pending', 'confirmed', 'active', 'completed', 'cancelled']),
  body('cancellationReason').optional().trim().isLength({ min: 5 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { status, cancellationReason } = req.body;
    const booking = await Booking.findById(req.params.id)
      .populate('scooty')
      .populate('user');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check authorization
    const isOwner = booking.scooty.owner.toString() === req.userId;
    const isUser = booking.user._id.toString() === req.userId;
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isUser && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized to update this booking' });
    }

    // Update booking
    const updateData = { status };
    
    // Update payment status based on booking status
    if (status === 'active') {
      updateData.paymentStatus = 'paid'; // Payment collected when booking becomes active
    } else if (status === 'completed') {
      updateData.paymentStatus = 'paid'; // Ensure payment remains paid when completed
    } else if (status === 'cancelled') {
      // Payment status will be handled in the cancellation logic below
    } else if (status === 'confirmed') {
      updateData.paymentStatus = 'pending'; // Payment still pending when confirmed
    }
    
    if (status === 'cancelled' && cancellationReason) {
      updateData.cancellationReason = cancellationReason;
      updateData.cancellationDate = new Date();
      
      // Calculate refund based on cancellation policy
      const now = new Date();
      const hoursUntilStart = (booking.startDate - now) / (1000 * 60 * 60);
      
      if (hoursUntilStart > 24) {
        updateData.refundAmount = booking.totalAmount; // Full refund
        updateData.paymentStatus = 'refunded'; // Full refund
      } else if (hoursUntilStart > 2) {
        updateData.refundAmount = booking.totalAmount * 0.5; // 50% refund
        updateData.paymentStatus = 'refunded'; // Partial refund
      } else {
        updateData.refundAmount = 0; // No refund
        updateData.paymentStatus = 'paid'; // No refund, payment kept
      }
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate([
      { path: 'scooty', select: 'name brand model color year' },
      { path: 'user', select: 'name email phone' }
    ]);

    // Send status update email
    try {
      const emailTemplate = emailService.generateBookingStatusUpdateEmail(updatedBooking, updatedBooking.scooty, updatedBooking.user, status);
      await emailService.sendEmail(updatedBooking.user.email, emailTemplate.subject, emailTemplate.html, emailTemplate.text);
      console.log('✅ Booking status update email sent to:', updatedBooking.user.email);
    } catch (emailError) {
      console.error('❌ Error sending booking status update email:', emailError);
      // Don't fail the status update if email fails
    }

    // Send status update SMS
    if (process.env.SMS_ENABLED === 'true' && process.env.SMS_SEND_STATUS_UPDATES === 'true') {
      try {
        if (smsService.isServiceConfigured() && updatedBooking.user.phone) {
          const smsMessage = smsService.generateBookingStatusUpdateSMS(updatedBooking, updatedBooking.scooty, updatedBooking.user, status);
          await smsService.sendSMS(updatedBooking.user.phone, smsMessage);
          console.log('✅ Booking status update SMS sent to:', updatedBooking.user.phone);
        } else {
          console.log('⚠️ SMS service not configured or user phone not available');
        }
      } catch (smsError) {
        console.error('❌ Error sending booking status update SMS:', smsError);
        // Don't fail the status update if SMS fails
      }
    }

    res.json({
      message: 'Booking status updated successfully',
      booking: updatedBooking
    });
  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({ message: 'Server error while updating booking status' });
  }
});

// Cancel booking
router.put('/:id/cancel', auth, [
  body('cancellationReason').trim().isLength({ min: 5 }).withMessage('Cancellation reason must be at least 5 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { cancellationReason } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user can cancel this booking
    if (booking.user.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: 'Not authorized to cancel this booking' });
    }

    // Check if booking can be cancelled
    if (['completed', 'cancelled'].includes(booking.status)) {
      return res.status(400).json({ message: 'Booking cannot be cancelled' });
    }

    const now = new Date();
    const hoursUntilStart = (booking.startDate - now) / (1000 * 60 * 60);

    if (hoursUntilStart < 2) {
      return res.status(400).json({ message: 'Booking cannot be cancelled less than 2 hours before start time' });
    }

    // Calculate refund
    let refundAmount = 0;
    if (hoursUntilStart > 24) {
      refundAmount = booking.totalAmount; // Full refund
    } else if (hoursUntilStart > 2) {
      refundAmount = booking.totalAmount * 0.5; // 50% refund
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      {
        status: 'cancelled',
        cancellationReason,
        cancellationDate: now,
        refundAmount
      },
      { new: true, runValidators: true }
    ).populate([
      { path: 'scooty', select: 'name brand model color year' },
      { path: 'user', select: 'name email phone' }
    ]);

    // Send cancellation email
    try {
      const emailTemplate = emailService.generateBookingStatusUpdateEmail(updatedBooking, updatedBooking.scooty, updatedBooking.user, 'cancelled');
      await emailService.sendEmail(updatedBooking.user.email, emailTemplate.subject, emailTemplate.html, emailTemplate.text);
      console.log('✅ Booking cancellation email sent to:', updatedBooking.user.email);
    } catch (emailError) {
      console.error('❌ Error sending booking cancellation email:', emailError);
      // Don't fail the cancellation if email fails
    }

    // Send cancellation SMS
    if (process.env.SMS_ENABLED === 'true' && process.env.SMS_SEND_STATUS_UPDATES === 'true') {
      try {
        if (smsService.isServiceConfigured() && updatedBooking.user.phone) {
          const smsMessage = smsService.generateBookingStatusUpdateSMS(updatedBooking, updatedBooking.scooty, updatedBooking.user, 'cancelled');
          await smsService.sendSMS(updatedBooking.user.phone, smsMessage);
          console.log('✅ Booking cancellation SMS sent to:', updatedBooking.user.phone);
        } else {
          console.log('⚠️ SMS service not configured or user phone not available');
        }
      } catch (smsError) {
        console.error('❌ Error sending booking cancellation SMS:', smsError);
        // Don't fail the cancellation if SMS fails
      }
    }

    res.json({
      message: 'Booking cancelled successfully',
      booking: updatedBooking
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({ message: 'Server error while cancelling booking' });
  }
});

// Add rating and review
router.post('/:id/rating', auth, [
  body('scootyRating').isInt({ min: 1, max: 5 }),
  body('serviceRating').isInt({ min: 1, max: 5 }),
  body('review').optional().trim().isLength({ max: 500 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { scootyRating, serviceRating, review } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user can rate this booking
    if (booking.user.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to rate this booking' });
    }

    // Check if booking is completed
    if (booking.status !== 'completed') {
      return res.status(400).json({ message: 'Can only rate completed bookings' });
    }

    // Update booking with rating
    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      {
        rating: {
          scooty: scootyRating,
          service: serviceRating,
          review
        }
      },
      { new: true, runValidators: true }
    );

    // Update scooty's average rating
    const scooty = await Scooty.findById(booking.scooty);
    const allRatings = await Booking.find({
      scooty: booking.scooty,
      'rating.scooty': { $exists: true }
    });

    const averageRating = allRatings.reduce((sum, b) => sum + b.rating.scooty, 0) / allRatings.length;

    await Scooty.findByIdAndUpdate(booking.scooty, {
      'rating.average': averageRating,
      'rating.count': allRatings.length
    });

    res.json({
      message: 'Rating submitted successfully',
      booking: updatedBooking
    });
  } catch (error) {
    console.error('Add rating error:', error);
    res.status(500).json({ message: 'Server error while adding rating' });
  }
});

module.exports = router;
