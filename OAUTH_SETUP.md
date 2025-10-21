# OAuth Setup Guide

This guide will help you set up Google and Facebook OAuth authentication for your ScootyBook application.

## Prerequisites

- Node.js and npm installed
- MongoDB running
- Google Cloud Console account
- Facebook Developer account

## 1. Google OAuth Setup

### Step 1: Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API

### Step 2: Create OAuth 2.0 Credentials
1. Go to "Credentials" in the Google Cloud Console
2. Click "Create Credentials" → "OAuth 2.0 Client IDs"
3. Choose "Web application"
4. Add authorized redirect URIs:
   - `http://localhost:5000/api/oauth/google/callback` (for development)
   - `https://yourdomain.com/api/oauth/google/callback` (for production)
5. Copy the Client ID and Client Secret

### Step 3: Update Environment Variables
Add to your `.env` file:
```env
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
```

## 2. Facebook OAuth Setup

### Step 1: Create Facebook App
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Click "Create App"
3. Choose "Consumer" app type
4. Fill in app details

### Step 2: Configure Facebook Login
1. In your app dashboard, go to "Facebook Login" → "Settings"
2. Add Valid OAuth Redirect URIs:
   - `http://localhost:5000/api/oauth/facebook/callback` (for development)
   - `https://yourdomain.com/api/oauth/facebook/callback` (for production)
3. Go to "Settings" → "Basic" and copy App ID and App Secret

### Step 3: Update Environment Variables
Add to your `.env` file:
```env
FACEBOOK_APP_ID=your_facebook_app_id_here
FACEBOOK_APP_SECRET=your_facebook_app_secret_here
```

## 3. Session Configuration

### Step 1: Generate Session Secret
Generate a secure session secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 2: Update Environment Variables
Add to your `.env` file:
```env
SESSION_SECRET=your_generated_session_secret_here
CLIENT_URL=http://localhost:3000
```

## 4. Complete .env File

Your `.env` file should include:
```env
# Database
MONGODB_URI=mongodb://localhost:27017/scooty-booking

# JWT
JWT_SECRET=your_jwt_secret_here

# OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
FACEBOOK_APP_ID=your_facebook_app_id_here
FACEBOOK_APP_SECRET=your_facebook_app_secret_here

# Session Configuration
SESSION_SECRET=your_session_secret_here
CLIENT_URL=http://localhost:3000

# Email Configuration
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=ScootyBook <your_email@gmail.com>

# SMS Configuration (Optional)
TWILIO_ACCOUNT_SID=your_twilio_account_sid_here
TWILIO_AUTH_TOKEN=your_twilio_auth_token_here
TWILIO_PHONE_NUMBER=your_twilio_phone_number_here
SMS_ENABLED=true
SMS_SEND_CONFIRMATION=true
SMS_SEND_STATUS_UPDATES=true
SMS_SEND_REMINDERS=true
```

## 5. Testing OAuth

### Step 1: Start the Application
```bash
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend
cd client
npm start
```

### Step 2: Test OAuth Login
1. Go to `http://localhost:3000/login`
2. Click "Continue with Google" or "Continue with Facebook"
3. Complete the OAuth flow
4. If it's your first time, you'll be prompted to complete your profile
5. Enter your phone number and license number
6. You should be redirected to the dashboard

## 6. Features

### OAuth Login Flow
- **Google Login**: Users can sign in with their Google account
- **Facebook Login**: Users can sign in with their Facebook account
- **Profile Completion**: OAuth users must provide phone and license number
- **Account Linking**: Existing users can link OAuth accounts

### Profile Requirements
- **Phone Number**: Required for booking verification
- **License Number**: Required for legal compliance
- **Profile Status**: Tracked via `isProfileComplete` field

### Booking Validation
- Users cannot book scooties without completing their profile
- Clear error messages guide users to complete their profile
- OAuth users are automatically redirected to profile completion

## 7. Troubleshooting

### Common Issues

**"OAuth callback failed"**
- Check redirect URIs in Google/Facebook console
- Ensure environment variables are set correctly
- Verify session secret is configured

**"Profile completion required"**
- This is expected behavior for OAuth users
- Users must provide phone and license number
- Check if user has `isProfileComplete: true`

**"Invalid OAuth credentials"**
- Verify Client ID/Secret are correct
- Check if OAuth apps are in development mode
- Ensure redirect URIs match exactly

### Debug Steps
1. Check server logs for OAuth errors
2. Verify environment variables are loaded
3. Test OAuth URLs manually
4. Check browser network tab for failed requests

## 8. Production Deployment

### Environment Variables
Update production environment variables:
```env
CLIENT_URL=https://yourdomain.com
SESSION_SECRET=your_production_session_secret
GOOGLE_CLIENT_ID=your_production_google_client_id
GOOGLE_CLIENT_SECRET=your_production_google_client_secret
FACEBOOK_APP_ID=your_production_facebook_app_id
FACEBOOK_APP_SECRET=your_production_facebook_app_secret
```

### OAuth App Settings
1. Update redirect URIs in Google/Facebook consoles
2. Add production domain to authorized domains
3. Review OAuth app permissions
4. Test OAuth flow in production environment

## 9. Security Considerations

- Use HTTPS in production
- Keep OAuth secrets secure
- Regularly rotate session secrets
- Monitor OAuth usage and errors
- Implement rate limiting for OAuth endpoints

## 10. Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review server logs for detailed error messages
3. Verify all environment variables are set correctly
4. Test OAuth configuration in Google/Facebook developer consoles
