const express = require('express');
const { body, validationResult, query } = require('express-validator');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Scooty = require('../models/Scooty');
const auth = require('../middleware/auth');

const router = express.Router();

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/scooties';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Get all scooties with filtering and pagination
router.get('/', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 }),
  query('brand').optional().trim(),
  query('city').optional().trim(),
  query('minPrice').optional().isFloat({ min: 0 }),
  query('maxPrice').optional().isFloat({ min: 0 }),
  query('fuelType').optional().isIn(['Petrol', 'Electric', 'Hybrid']),
  query('sortBy').optional().isIn(['pricePerHour', 'pricePerDay', 'rating', 'createdAt']),
  query('sortOrder').optional().isIn(['asc', 'desc'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      page = 1,
      limit = 10,
      brand,
      city,
      minPrice,
      maxPrice,
      fuelType,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = { availability: true, status: 'available' };
    
    if (brand) filter.brand = new RegExp(brand, 'i');
    if (city) filter['location.city'] = new RegExp(city, 'i');
    if (fuelType) filter.fuelType = fuelType;
    
    if (minPrice || maxPrice) {
      filter.$or = [];
      if (minPrice) filter.$or.push({ pricePerHour: { $gte: parseFloat(minPrice) } });
      if (maxPrice) filter.$or.push({ pricePerDay: { $lte: parseFloat(maxPrice) } });
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const scooties = await Scooty.find(filter)
      .populate('owner', 'name email phone')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Scooty.countDocuments(filter);

    res.json({
      scooties,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get scooties error:', error);
    res.status(500).json({ message: 'Server error while fetching scooties' });
  }
});

// Get single scooty by ID
router.get('/:id', async (req, res) => {
  try {
    const scooty = await Scooty.findById(req.params.id)
      .populate('owner', 'name email phone');

    if (!scooty) {
      return res.status(404).json({ message: 'Scooty not found' });
    }

    res.json(scooty);
  } catch (error) {
    console.error('Get scooty error:', error);
    res.status(500).json({ message: 'Server error while fetching scooty' });
  }
});

// Create new scooty (Admin only)
router.post('/', auth, upload.array('images', 10), [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('brand').trim().isLength({ min: 2 }).withMessage('Brand must be at least 2 characters'),
  body('model').trim().isLength({ min: 2 }).withMessage('Model must be at least 2 characters'),
  body('year').isInt({ min: 2010, max: new Date().getFullYear() + 1 }),
  body('color').trim().isLength({ min: 2 }),
  body('engineCapacity').trim().isLength({ min: 1 }),
  body('fuelType').isIn(['Petrol', 'Electric', 'Hybrid']),
  body('mileage').trim().isLength({ min: 1 }),
  body('pricePerHour').isFloat({ min: 0 }),
  body('pricePerDay').isFloat({ min: 0 }),
  body('location.address').trim().isLength({ min: 5 }),
  body('location.city').trim().isLength({ min: 2 }),
  body('location.state').trim().isLength({ min: 2 }),
  body('location.pincode').trim().isLength({ min: 5, max: 5 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can add scooties' });
    }

    // Process uploaded images
    const imageUrls = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        // Create URL for the uploaded image
        const imageUrl = `/uploads/scooties/${file.filename}`;
        imageUrls.push(imageUrl);
      });
    }

    // Parse JSON fields
    const features = req.body.features ? JSON.parse(req.body.features) : [];
    
    // Handle location fields (now sent individually)
    const location = {
      address: req.body['location.address'] || '',
      city: req.body['location.city'] || '',
      state: req.body['location.state'] || '',
      pincode: req.body['location.pincode'] || ''
    };

    const scootyData = {
      name: req.body.name,
      brand: req.body.brand,
      model: req.body.model,
      year: parseInt(req.body.year),
      color: req.body.color,
      engineCapacity: req.body.engineCapacity,
      fuelType: req.body.fuelType,
      mileage: req.body.mileage,
      pricePerHour: parseFloat(req.body.pricePerHour),
      pricePerDay: parseFloat(req.body.pricePerDay),
      features: features,
      description: req.body.description || '',
      images: imageUrls,
      location: location,
      owner: req.userId
    };

    const scooty = new Scooty(scootyData);
    await scooty.save();

    res.status(201).json({
      message: 'Scooty added successfully',
      scooty
    });
  } catch (error) {
    console.error('Create scooty error:', error);
    res.status(500).json({ message: 'Server error while creating scooty' });
  }
});

// Update scooty (Admin only)
router.put('/:id', auth, upload.array('images', 10), async (req, res) => {
  try {
    const scooty = await Scooty.findById(req.params.id);

    if (!scooty) {
      return res.status(404).json({ message: 'Scooty not found' });
    }

    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can update scooties' });
    }

    // Process uploaded images
    const newImageUrls = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        const imageUrl = `/uploads/scooties/${file.filename}`;
        newImageUrls.push(imageUrl);
      });
    }

    // Handle existing images
    const existingImages = req.body.existingImages ? 
      (Array.isArray(req.body.existingImages) ? req.body.existingImages : [req.body.existingImages]) : 
      [];

    // Combine existing and new images
    const allImages = [...existingImages, ...newImageUrls];

    // Parse JSON fields
    const features = req.body.features ? JSON.parse(req.body.features) : [];
    
    // Handle location fields (sent individually)
    const location = {
      address: req.body['location.address'] || '',
      city: req.body['location.city'] || '',
      state: req.body['location.state'] || '',
      pincode: req.body['location.pincode'] || ''
    };

    const updateData = {
      name: req.body.name,
      brand: req.body.brand,
      model: req.body.model,
      year: parseInt(req.body.year),
      color: req.body.color,
      engineCapacity: req.body.engineCapacity,
      fuelType: req.body.fuelType,
      mileage: req.body.mileage,
      pricePerHour: parseFloat(req.body.pricePerHour),
      pricePerDay: parseFloat(req.body.pricePerDay),
      features: features,
      description: req.body.description || '',
      images: allImages,
      location: location
    };

    const updatedScooty = await Scooty.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('owner', 'name email phone');

    res.json({
      message: 'Scooty updated successfully',
      scooty: updatedScooty
    });
  } catch (error) {
    console.error('Update scooty error:', error);
    res.status(500).json({ message: 'Server error while updating scooty' });
  }
});

// Delete scooty (Admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const scooty = await Scooty.findById(req.params.id);

    if (!scooty) {
      return res.status(404).json({ message: 'Scooty not found' });
    }

    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can delete scooties' });
    }

    await Scooty.findByIdAndDelete(req.params.id);

    res.json({ message: 'Scooty deleted successfully' });
  } catch (error) {
    console.error('Delete scooty error:', error);
    res.status(500).json({ message: 'Server error while deleting scooty' });
  }
});

// Search scooties by location
router.get('/search/location', [
  query('latitude').isFloat(),
  query('longitude').isFloat(),
  query('radius').optional().isFloat({ min: 0.1, max: 50 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { latitude, longitude, radius = 10 } = req.query;

    const scooties = await Scooty.find({
      availability: true,
      status: 'available',
      'location.coordinates': {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: parseFloat(radius) * 1000 // Convert km to meters
        }
      }
    }).populate('owner', 'name email phone');

    res.json(scooties);
  } catch (error) {
    console.error('Location search error:', error);
    res.status(500).json({ message: 'Server error while searching scooties' });
  }
});

module.exports = router;
