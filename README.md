# 🛵 ScootyBook - Scooty Rental Booking System

A full-stack web application built with the MERN stack (MongoDB, Express.js, React, Node.js) for booking and managing scooty rentals.

## 🌟 Features

### User Features
- **User Authentication**: Registration and login with email/password
- **OAuth Integration**: Google and Facebook login (optional)
- **Profile Management**: Update phone number and license information
- **Scooty Browsing**: View available scooties with filters
- **Booking System**: Book scooties for hourly or daily rentals
- **Booking Management**: View and manage your bookings
- **Responsive Design**: Works on desktop and mobile devices

### Admin Features
- **Scooty Management**: Add, edit, and manage scooty listings
- **Booking Management**: View and manage all bookings
- **Dashboard**: Analytics and statistics
- **User Management**: Admin controls

### Additional Features
- **Email Notifications**: Booking confirmations and updates
- **SMS Integration**: Optional SMS notifications via Twilio
- **Image Upload**: Multiple image support for scooties
- **Location-based Search**: Find scooties by location
- **Rating System**: Rate scooties and service

## 🚀 Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Passport.js** - OAuth authentication
- **Multer** - File upload handling
- **Nodemailer** - Email service
- **Twilio** - SMS service

### Frontend
- **React** - Frontend framework
- **TypeScript** - Type safety
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **DaisyUI** - Component library

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- Git

### Backend Setup
```bash
# Install dependencies
npm install

# Create .env file with the following variables:
MONGODB_URI=mongodb://localhost:27017/scooty-booking
JWT_SECRET=your_jwt_secret_key
PORT=5000
CLIENT_URL=http://localhost:3000

# Optional OAuth (Google/Facebook)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret

# Optional Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Optional SMS Configuration
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number

# Start the server
npm start
```

### Frontend Setup
```bash
# Navigate to client directory
cd client

# Install dependencies
npm install

# Start the development server
npm start
```

## 🎯 Usage

1. **Start the application**:
   - Backend: `http://localhost:5000`
   - Frontend: `http://localhost:3000`

2. **Register/Login**: Create an account or login with existing credentials

3. **Browse Scooties**: View available scooties and their details

4. **Book a Scooty**: Select dates and complete your booking

5. **Manage Bookings**: View and manage your bookings from the dashboard

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile

### OAuth (Optional)
- `GET /api/oauth/google` - Google OAuth login
- `GET /api/oauth/facebook` - Facebook OAuth login
- `POST /api/oauth/complete-profile` - Complete OAuth profile

### Scooties
- `GET /api/scooties` - Get all scooties
- `GET /api/scooties/:id` - Get scooty by ID
- `POST /api/scooties` - Create scooty (Admin)
- `PUT /api/scooties/:id` - Update scooty (Admin)
- `DELETE /api/scooties/:id` - Delete scooty (Admin)

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings` - Get user bookings
- `GET /api/bookings/:id` - Get booking by ID
- `PUT /api/bookings/:id/status` - Update booking status

## 🗄️ Database Schema

### User Model
- name, email, password
- phone, licenseNumber
- role (user/admin)
- isProfileComplete
- OAuth fields (googleId, facebookId, provider, avatar)

### Scooty Model
- name, brand, model, year, color
- engineCapacity, fuelType, mileage
- pricePerHour, pricePerDay
- features, images, location
- availability, status, owner

### Booking Model
- user, scooty, bookingType
- startDate, endDate, duration
- totalAmount, status, paymentStatus
- pickupLocation, dropoffLocation
- specialRequests, rating

## 🚀 Deployment

### Environment Variables
Make sure to set all required environment variables in your production environment.

### Database
- Use MongoDB Atlas for production database
- Ensure proper security configurations

### Frontend
```bash
cd client
npm run build
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Pasidu Mihiranga**
- GitHub: [@Pasidu-Mihiranga](https://github.com/Pasidu-Mihiranga)

## 🙏 Acknowledgments

- React and Node.js communities
- MongoDB documentation
- Tailwind CSS and DaisyUI
- All open-source contributors# Deployment Test - Fri Jan 16 12:19:52 AM +0530 2026
