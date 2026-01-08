require('dotenv').config();
const mongoose = require('mongoose');
const Scooty = require('./models/Scooty');
const User = require('./models/User');

const scootiesData = [
  {
    name: 'Honda Activa 6G',
    brand: 'Honda',
    model: 'Activa 6G',
    year: 2024,
    color: 'Pearl White',
    engineCapacity: '110cc',
    fuelType: 'Petrol',
    mileage: '60 km/l',
    pricePerHour: 100,
    pricePerDay: 800,
    features: ['Electric Start', 'LED Headlamp', 'USB Charger', 'Digital Console'],
    images: ['https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800'],
    location: {
      address: '123 Galle Road',
      city: 'Colombo',
      state: 'Western Province',
      pincode: '00100'
    },
    availability: true,
    status: 'available',
    rating: {
      average: 4.5,
      count: 25
    },
    description: 'Well-maintained Honda Activa with excellent fuel efficiency. Perfect for city rides.'
  },
  {
    name: 'TVS Ntorq 125',
    brand: 'TVS',
    model: 'Ntorq 125',
    year: 2023,
    color: 'Metallic Blue',
    engineCapacity: '125cc',
    fuelType: 'Petrol',
    mileage: '55 km/l',
    pricePerHour: 120,
    pricePerDay: 950,
    features: ['Bluetooth Connectivity', 'Navigation', 'Race Mode', 'Voice Assist'],
    images: ['https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800'],
    location: {
      address: '45 Peradeniya Road',
      city: 'Kandy',
      state: 'Central Province',
      pincode: '20000'
    },
    availability: true,
    status: 'available',
    rating: {
      average: 4.7,
      count: 42
    },
    description: 'Sporty scooter with smart features. Great for enthusiasts who love technology.'
  },
  {
    name: 'Yamaha Fascino 125',
    brand: 'Yamaha',
    model: 'Fascino 125',
    year: 2024,
    color: 'Cyan Blue',
    engineCapacity: '125cc',
    fuelType: 'Petrol',
    mileage: '58 km/l',
    pricePerHour: 110,
    pricePerDay: 900,
    features: ['Side Stand Engine Cut-off', 'LED Lights', 'Front Disc Brake', 'Comfortable Seat'],
    images: ['https://images.unsplash.com/photo-1595433707802-6b2626ef1c91?w=800'],
    location: {
      address: '78 Beach Road',
      city: 'Galle',
      state: 'Southern Province',
      pincode: '80000'
    },
    availability: true,
    status: 'available',
    rating: {
      average: 4.6,
      count: 18
    },
    description: 'Stylish and reliable Yamaha scooter. Ideal for daily commuting and weekend trips.'
  },
  {
    name: 'Suzuki Burgman Street',
    brand: 'Suzuki',
    model: 'Burgman Street',
    year: 2023,
    color: 'Metallic Gray',
    engineCapacity: '125cc',
    fuelType: 'Petrol',
    mileage: '56 km/l',
    pricePerHour: 125,
    pricePerDay: 1000,
    features: ['Fully Digital Meter', 'LED DRL', 'Front Disc Brake', 'Large Storage'],
    images: ['https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=800'],
    location: {
      address: '234 Main Street',
      city: 'Colombo',
      state: 'Western Province',
      pincode: '00300'
    },
    availability: true,
    status: 'available',
    rating: {
      average: 4.4,
      count: 31
    },
    description: 'Premium maxi-scooter with ample storage space. Perfect for long rides.'
  },
  {
    name: 'Hero Pleasure Plus',
    brand: 'Hero',
    model: 'Pleasure Plus',
    year: 2024,
    color: 'Pearl Silver White',
    engineCapacity: '110cc',
    fuelType: 'Petrol',
    mileage: '63 km/l',
    pricePerHour: 90,
    pricePerDay: 750,
    features: ['Mobile Charging Port', 'LED Tail Lamp', 'Stylish Graphics', 'i3S Technology'],
    images: ['https://images.unsplash.com/photo-1558980664-1db506751c6c?w=800'],
    location: {
      address: '56 Temple Road',
      city: 'Kandy',
      state: 'Central Province',
      pincode: '20100'
    },
    availability: true,
    status: 'available',
    rating: {
      average: 4.3,
      count: 15
    },
    description: 'Economical and easy-to-ride scooter. Great fuel efficiency for budget-conscious riders.'
  },
  {
    name: 'Bajaj Chetak Electric',
    brand: 'Bajaj',
    model: 'Chetak',
    year: 2024,
    color: 'Cyber White',
    engineCapacity: 'Electric',
    fuelType: 'Electric',
    mileage: '95 km/charge',
    pricePerHour: 150,
    pricePerDay: 1200,
    features: ['Touchscreen Display', 'Reverse Mode', 'Regenerative Braking', 'App Connectivity'],
    images: ['https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800'],
    location: {
      address: '89 Independence Avenue',
      city: 'Colombo',
      state: 'Western Province',
      pincode: '00700'
    },
    availability: true,
    status: 'available',
    rating: {
      average: 4.8,
      count: 28
    },
    description: 'Eco-friendly electric scooter with modern features. Silent and smooth ride experience.'
  },
  {
    name: 'TVS Jupiter Classic',
    brand: 'TVS',
    model: 'Jupiter Classic',
    year: 2023,
    color: 'Starlight Blue',
    engineCapacity: '110cc',
    fuelType: 'Petrol',
    mileage: '62 km/l',
    pricePerHour: 95,
    pricePerDay: 800,
    features: ['External Fuel Fill', 'Mobile Charger', 'Bright Halogen Headlamp', 'Comfortable Ride'],
    images: ['https://images.unsplash.com/photo-1558980663-3685c1d673c4?w=800'],
    location: {
      address: '12 Station Road',
      city: 'Galle',
      state: 'Southern Province',
      pincode: '80100'
    },
    availability: true,
    status: 'available',
    rating: {
      average: 4.5,
      count: 22
    },
    description: 'Classic design with modern features. Reliable and fuel-efficient for daily use.'
  },
  {
    name: 'Ather 450X Electric',
    brand: 'Ather',
    model: '450X',
    year: 2024,
    color: 'True White',
    engineCapacity: 'Electric',
    fuelType: 'Electric',
    mileage: '105 km/charge',
    pricePerHour: 180,
    pricePerDay: 1500,
    features: ['7-inch Dashboard', 'OTA Updates', 'Warp Mode', 'Smart Navigation'],
    images: ['https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=800'],
    location: {
      address: '45 Tech Park Road',
      city: 'Colombo',
      state: 'Western Province',
      pincode: '00500'
    },
    availability: true,
    status: 'available',
    rating: {
      average: 4.9,
      count: 35
    },
    description: 'Premium electric scooter with cutting-edge technology. Best in class performance and features.'
  }
];

async function seedScooties() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/scooty-booking');
    console.log('Connected to MongoDB');

    // Find an admin user or create one
    let adminUser = await User.findOne({ role: 'admin' });
    
    if (!adminUser) {
      console.log('No admin user found. Please create an admin user first using create-admin.js');
      process.exit(1);
    }

    console.log(`Found admin user: ${adminUser.name}`);

    // Clear existing scooties (optional)
    const existingCount = await Scooty.countDocuments();
    if (existingCount > 0) {
      console.log(`Found ${existingCount} existing scooties. Clearing...`);
      await Scooty.deleteMany({});
      console.log('Cleared existing scooties');
    }

    // Add owner to each scooty
    const scootiesWithOwner = scootiesData.map(scooty => ({
      ...scooty,
      owner: adminUser._id
    }));

    // Insert scooties
    const insertedScooties = await Scooty.insertMany(scootiesWithOwner);
    console.log(`✅ Successfully added ${insertedScooties.length} scooties to the database!`);
    
    console.log('\nAdded scooties:');
    insertedScooties.forEach((scooty, index) => {
      console.log(`${index + 1}. ${scooty.name} - ${scooty.city} - ₹${scooty.pricePerHour}/hour`);
    });

    mongoose.connection.close();
    console.log('\n✨ Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding scooties:', error);
    process.exit(1);
  }
}

seedScooties();
