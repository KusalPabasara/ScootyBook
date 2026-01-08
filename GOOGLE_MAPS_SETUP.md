# Google Maps API Setup for ScootyBook

## Important Notice
The client ID you provided (`887494476110-9b8c9qa49r516b2kgosgqgh0mfo6tmlp.apps.googleusercontent.com`) is a **Google OAuth Client ID**, not a Google Maps API key.

## How to Get the Correct Google Maps API Key

### Step 1: Go to Google Cloud Console
1. Visit: https://console.cloud.google.com/
2. Sign in with your Google account

### Step 2: Create or Select a Project
1. Click the project dropdown at the top
2. Click "NEW PROJECT" or select your existing project
3. Name it something like "ScootyBook Maps"

### Step 3: Enable Required APIs
1. Go to "APIs & Services" > "Library"
2. Search and enable these APIs:
   - **Maps JavaScript API**
   - **Geocoding API**
   - **Directions API**
   - **Geolocation API**

### Step 4: Create API Credentials
1. Go to "APIs & Services" > "Credentials"
2. Click "CREATE CREDENTIALS" > "API key"
3. Copy the generated API key
4. Click "Restrict Key" to secure it:
   - Under "Application restrictions", select "HTTP referrers"
   - Add your domains:
     - `http://localhost:3000/*` (for development)
     - `https://yourdomain.com/*` (for production)
   - Under "API restrictions", select "Restrict key"
   - Select the APIs you enabled above

### Step 5: Update Your Application
1. Open `/client/.env` file
2. Replace the placeholder with your actual API key:
   ```
   REACT_APP_GOOGLE_MAPS_API_KEY=YOUR_ACTUAL_API_KEY_HERE
   ```
3. Restart your React development server

### Step 6: Enable Billing (Required)
- Google Maps API requires a billing account to be enabled
- You get $200 free credits per month
- Go to "Billing" in Google Cloud Console and add a payment method

## Current Implementation Features

✅ **Mode A: "I'll Pick It Up" (Agency Pickup)**
- Shows agency location in Weligama on map
- Displays route from user's current location to agency
- Blue marker indicates agency location

✅ **Mode B: "Bring It To Me" (Delivery Service)**
- User can click on map to pin delivery location
- Or type address to find location
- **Geofencing**: Only allows locations within Weligama boundaries
- Shows error if location is outside Weligama
- Red marker shows delivery location
- Displays route from agency to customer location

## Weligama Boundaries
Current boundaries set in the code:
- **North**: 6.0000°
- **South**: 5.9500°
- **East**: 80.4600°
- **West**: 80.4000°

You can adjust these in `client/src/pages/Booking.tsx` if needed.

## Agency Location
Fixed location in Weligama:
- **Latitude**: 5.9741
- **Longitude**: 80.4297

Update this in `client/src/pages/Booking.tsx` if your agency is in a different location.

## Troubleshooting

### Map Not Loading
- Check if API key is correct in `.env` file
- Verify billing is enabled in Google Cloud Console
- Check browser console for specific error messages

### "This page can't load Google Maps correctly"
- This means API key is invalid or billing is not enabled
- Check API restrictions in Google Cloud Console

### Geofencing Not Working
- The coordinates are based on latitude/longitude boundaries
- You may need to adjust `WELIGAMA_BOUNDS` values
- Use Google Maps to get precise boundary coordinates

## Cost Estimates
With $200/month free credit:
- Map loads: ~$7 per 1,000 loads (covered by free tier for ~28,000 loads)
- Geocoding: ~$5 per 1,000 requests
- Directions: ~$5 per 1,000 requests

## Next Steps
1. Get proper Google Maps API key
2. Update `.env` file with the key
3. Restart the React app: `npm start`
4. Test both pickup and delivery modes
5. Verify geofencing works correctly

## Support
If you need help setting this up, visit:
- Google Maps Platform Documentation: https://developers.google.com/maps/documentation
- Pricing: https://cloud.google.com/maps-platform/pricing
