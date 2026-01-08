# Navigation Features Documentation

## Overview
The booking system now includes integrated Google Maps navigation features for both pickup and delivery modes, enhancing the user experience and enabling real-time location tracking.

## Features Implemented

### 1. Pickup Mode Navigation (Customer → Agency)

**How it works:**
- When a customer selects "I'll Pick It Up" and confirms their booking
- After successful booking confirmation, they are automatically redirected to Google Maps
- The navigation opens in a new tab with directions from their current location to Weligama Bus Stand
- The customer is then redirected to "My Bookings" page after 2 seconds

**User Flow:**
1. Customer selects "I'll Pick It Up" on booking page
2. Fills in booking details (dates, payment method, etc.)
3. Clicks "Confirm Booking"
4. ✅ Booking confirmed with "pending" status
5. 🗺️ Google Maps opens automatically with navigation to agency
6. Customer follows directions to Weligama Bus Stand
7. My Bookings page shows "Get Directions" button for confirmed pickups

**Technical Details:**
- Maps URL format: `https://www.google.com/maps/dir/?api=1&destination=5.9731,80.4297&travelmode=driving`
- Agency location: Weligama Bus Stand (5.9731°N, 80.4297°E)
- Opens in new tab/window: `window.open(mapsUrl, '_blank')`
- Auto-redirect after 2 seconds

**File Modified:** `/client/src/pages/Booking.tsx`
```typescript
if (deliveryMode === 'pickup') {
  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${AGENCY_LOCATION.lat},${AGENCY_LOCATION.lng}&travelmode=driving`;
  window.open(mapsUrl, '_blank');
  setTimeout(() => navigate('/my-bookings'), 2000);
}
```

---

### 2. Delivery Mode Location Sharing (Customer Location → Admin)

**How it works:**
- When customer selects "Bring It To Me" and confirms booking
- Customer's live GPS location is captured at booking time
- Location is saved with booking record in database
- Admin can view customer's location and navigate to it via Google Maps

**User Flow:**
1. Customer selects "Bring It To Me"
2. Enters/pins delivery address on map (must be within Weligama bounds)
3. Browser requests location permission (for accurate GPS coordinates)
4. Customer confirms booking
5. ✅ Booking saved with customer's live location
6. Admin views booking in Admin Bookings page
7. Admin sees delivery address and "Navigate to Customer" button
8. Clicking button opens Google Maps with directions to customer

**Technical Details:**
- Location capture using Geolocation API: `navigator.geolocation.getCurrentPosition()`
- High accuracy mode enabled: `enableHighAccuracy: true`
- Timeout: 10 seconds
- Saved to database: `deliveryLocation: { lat, lng }`
- Maps URL: `https://www.google.com/maps/dir/?api=1&destination={lat},{lng}&travelmode=driving`

**Files Modified:**
- `/client/src/pages/Booking.tsx` - Captures live location on delivery booking
- `/client/src/pages/AdminBookings.tsx` - Displays location and navigation button
- `/models/Booking.js` - Stores deliveryMode, deliveryAddress, deliveryLocation

**Code Snippet (Location Capture):**
```typescript
if (deliveryMode === 'delivery') {
  const position = await new Promise<GeolocationPosition>((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 10000
    });
  });
  
  formData.deliveryLocation = {
    lat: position.coords.latitude,
    lng: position.coords.longitude
  };
}
```

---

### 3. My Bookings Page Enhancements

**Customer View:**
- **Pickup bookings:** Shows "Get Directions" button when status is "confirmed"
  - Button text: "Get Directions"
  - Opens Google Maps navigation to Weligama Bus Stand
  - Green success alert with instructions

- **Delivery bookings:** Shows delivery address and status
  - Blue info alert with address
  - Indicates "We'll deliver to your location!" when confirmed

**Visual Indicators:**
- 🎯 Pickup: Green badge + directions button
- 🏠 Delivery: Blue badge + address display
- Map pin icons for visual clarity

**File Modified:** `/client/src/pages/AdminBookings.tsx`

---

### 4. Admin Bookings Page Enhancements

**Admin View:**
- Delivery mode badge displayed for each booking
  - "Pickup" (green badge) or "Delivery" (blue badge)
- For delivery bookings:
  - Shows customer's delivery address
  - Displays GPS coordinates (internal)
  - "Navigate to Customer" button opens Google Maps
  - Blue info alert box with navigation button

**Navigation Button:**
- Icon: Map/Route icon
- Text: "Navigate to Customer"
- Color: Primary button (blue)
- Action: Opens Google Maps in new tab with route to customer location

**Code Snippet (Admin Navigation):**
```tsx
<a
  href={`https://www.google.com/maps/dir/?api=1&destination=${booking.deliveryLocation.lat},${booking.deliveryLocation.lng}&travelmode=driving`}
  target="_blank"
  rel="noopener noreferrer"
  className="btn btn-sm btn-primary"
>
  Navigate to Customer
</a>
```

---

## Database Schema Updates

**Booking Model (`/models/Booking.js`):**
```javascript
{
  deliveryMode: {
    type: String,
    enum: ['pickup', 'delivery'],
    default: 'pickup'
  },
  deliveryAddress: {
    type: String
  },
  deliveryLocation: {
    lat: Number,
    lng: Number
  }
}
```

---

## Security & Privacy Considerations

1. **Location Permissions:**
   - Browser requests user permission before accessing GPS
   - Location only captured when user confirms booking
   - Users can deny location permission (manual pin on map still works)

2. **Data Storage:**
   - GPS coordinates stored securely in MongoDB
   - Only admin and booking owner can view location data
   - Location shared only with admin for delivery purposes

3. **Geofencing:**
   - Delivery restricted to Weligama area (bounds validation)
   - Prevents out-of-service-area bookings

---

## Testing Guide

### Test Pickup Navigation:
1. Go to http://localhost:3000/scooties
2. Click "Book Now" on any scooty
3. Select "I'll Pick It Up"
4. Fill booking details and click "Confirm Booking"
5. ✅ Google Maps should open with route to Weligama Bus Stand
6. Check My Bookings page for "Get Directions" button

### Test Delivery Navigation:
1. Go to http://localhost:3000/scooties
2. Click "Book Now" on any scooty
3. Select "Bring It To Me"
4. Allow location permission when prompted
5. Pin location on map or enter address (within Weligama)
6. Click "Confirm Booking"
7. Login as admin (admin@scootybook.com)
8. Go to Admin Bookings
9. Find the delivery booking
10. ✅ Should see "Navigate to Customer" button
11. Click button - Google Maps should open with route to customer

---

## Known Issues & Limitations

1. **Location Accuracy:**
   - Depends on device GPS quality
   - Indoor locations may be less accurate
   - Mobile devices generally more accurate than laptops

2. **Browser Compatibility:**
   - Geolocation API supported in all modern browsers
   - Must use HTTPS or localhost for location access
   - Some browsers may block popups - users need to allow

3. **Network Connectivity:**
   - Requires internet for Google Maps
   - Location capture may timeout in poor connectivity

---

## Future Enhancements

1. **Real-time Tracking:**
   - Live delivery driver location sharing
   - ETA calculations
   - Push notifications when driver is nearby

2. **Route Optimization:**
   - Multiple delivery route planning for admin
   - Traffic-aware routing
   - Alternative route suggestions

3. **Location History:**
   - Track delivery driver path
   - Proof of delivery with GPS coordinates
   - Service area heatmap analytics

---

## Configuration

**Environment Variables:**
```bash
# Already configured in /client/.env
REACT_APP_GOOGLE_MAPS_API_KEY=AIzaSyBcXN9OTtI5plUcbX5Y4QucMrK3-0ftaSk
```

**Agency Location:**
```typescript
const AGENCY_LOCATION = {
  lat: 5.9731,
  lng: 80.4297
}; // Weligama Bus Stand
```

**Geofence Boundaries:**
```typescript
const WELIGAMA_BOUNDS = {
  north: 6.0000,
  south: 5.9500,
  east: 80.4600,
  west: 80.4000
};
```

---

## Support

For issues or questions:
1. Check browser console for errors
2. Verify location permissions are granted
3. Ensure Google Maps API key is valid
4. Test on mobile device for best GPS accuracy

---

**Last Updated:** January 8, 2026
**Status:** ✅ Fully Implemented and Tested
