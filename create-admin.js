const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/scooty-booking');

async function createAdminUser() {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@scootybook.com' });
    if (existingAdmin) {
      console.log('Admin user already exists!');
      return;
    }

    // Create admin user
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@scootybook.com',
      password: 'admin123', // This will be hashed automatically
      phone: '9999999999',
      licenseNumber: 'ADMIN001',
      role: 'admin',
      isVerified: true
    });

    await adminUser.save();
    console.log('Admin user created successfully!');
    console.log('Email: admin@scootybook.com');
    console.log('Password: admin123');
    console.log('Role: admin');
    
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    mongoose.connection.close();
  }
}

createAdminUser();
