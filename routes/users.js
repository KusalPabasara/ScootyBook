const express = require('express');
const User = require('../models/User');
const Booking = require('../models/Booking');
const Scooty = require('../models/Scooty');
const auth = require('../middleware/auth');

const router = express.Router();

// Get user dashboard data
router.get('/dashboard', auth, async (req, res) => {
  try {
    const userId = req.userId;
    const userRole = req.user.role;

    if (userRole === 'admin') {
      // Admin dashboard data
      const totalScooties = await Scooty.countDocuments();
      const totalBookings = await Booking.countDocuments();
      const activeBookings = await Booking.countDocuments({ status: { $in: ['pending', 'confirmed'] } });
      
      // Get total revenue from all bookings
      const revenueData = await Booking.aggregate([
        { $match: { status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]);

      // Get recent bookings (all bookings for admin)
      const recentBookings = await Booking.find()
        .populate('user', 'name email')
        .populate('scooty', 'name brand model color')
        .sort({ createdAt: -1 })
        .limit(5);

      res.json({
        bookingsStats: {
          total: totalScooties,
          confirmed: totalBookings,
          pending: activeBookings
        },
        recentBookings,
        totalSpent: revenueData[0]?.total || 0,
        favoriteBrand: null // Not applicable for admin
      });
    } else {
      // Regular user dashboard data
      // Get user's bookings count by status
      const bookingsStats = await Booking.aggregate([
        { $match: { user: userId } },
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]);

      // Get recent bookings
      const recentBookings = await Booking.find({ user: userId })
        .populate('scooty', 'name brand model color images')
        .sort({ createdAt: -1 })
        .limit(5);

      // Get total spent
      const totalSpent = await Booking.aggregate([
        { $match: { user: userId, status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]);

      // Get favorite scooty brand
      const favoriteBrand = await Booking.aggregate([
        { $match: { user: userId } },
        { $lookup: { from: 'scooties', localField: 'scooty', foreignField: '_id', as: 'scootyData' } },
        { $unwind: '$scootyData' },
        { $group: { _id: '$scootyData.brand', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 1 }
      ]);

      res.json({
        bookingsStats: bookingsStats.reduce((acc, stat) => {
          acc[stat._id] = stat.count;
          return acc;
        }, {}),
        recentBookings,
        totalSpent: totalSpent[0]?.total || 0,
        favoriteBrand: favoriteBrand[0]?._id || null
      });
    }
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ message: 'Server error while fetching dashboard data' });
  }
});

// Get user's scooties (for owners)
router.get('/my-scooties', auth, async (req, res) => {
  try {
    const scooties = await Scooty.find({ owner: req.userId })
      .sort({ createdAt: -1 });

    res.json(scooties);
  } catch (error) {
    console.error('Get user scooties error:', error);
    res.status(500).json({ message: 'Server error while fetching scooties' });
  }
});

// Get bookings for user's scooties (for owners)
router.get('/my-scooties/bookings', auth, async (req, res) => {
  try {
    // Get user's scooties
    const userScooties = await Scooty.find({ owner: req.userId }).select('_id');
    const scootyIds = userScooties.map(scooty => scooty._id);

    // Get bookings for these scooties
    const bookings = await Booking.find({ scooty: { $in: scootyIds } })
      .populate('user', 'name email phone')
      .populate('scooty', 'name brand model color')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    console.error('Get scooty bookings error:', error);
    res.status(500).json({ message: 'Server error while fetching bookings' });
  }
});

module.exports = router;
