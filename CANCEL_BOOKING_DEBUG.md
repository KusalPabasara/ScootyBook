# 🛵 Cancel Booking Debug Guide

## Problem Analysis
The cancel booking button appears but doesn't work. After testing the backend API, I found that:

✅ **Backend API is working correctly**
- Cancel endpoint exists: `PUT /api/bookings/:id/cancel`
- Proper authentication required
- Validation working (cancellation reason length)
- CORS configured correctly

❌ **Issue is likely on the client side**

## Debugging Steps

### 1. Check Browser Developer Tools

**Open Developer Tools (F12) and check:**

#### Application Tab > Local Storage
- Look for `token` key
- Verify it exists and has a valid JWT token
- If missing or invalid, user needs to log in again

#### Network Tab
1. Try to cancel a booking
2. Look for the PUT request to `/api/bookings/[booking-id]/cancel`
3. Check if the request is being made
4. Check the request headers (should include `Authorization: Bearer [token]`)
5. Check the response status and error message

#### Console Tab
- Look for JavaScript errors
- Check for the debug logs from the cancel function:
  - `🔄 Attempting to cancel booking: [id]`
  - `🔄 Cancellation reason: [reason]`
  - `✅ Booking cancelled successfully:` or `❌ Error cancelling booking:`

### 2. Common Issues and Solutions

#### Issue 1: No Authentication Token
**Symptoms:** 401 Unauthorized errors
**Solution:** User needs to log in again

#### Issue 2: Invalid/Expired Token
**Symptoms:** 401 Token is not valid
**Solution:** Clear localStorage and log in again

#### Issue 3: Booking Not Found
**Symptoms:** 404 Booking not found
**Solution:** Check if the booking ID is correct

#### Issue 4: Booking Cannot Be Cancelled
**Symptoms:** 400 Booking cannot be cancelled
**Possible reasons:**
- Booking is already completed or cancelled
- Less than 2 hours before start time
- Booking status is not 'pending' or 'confirmed'

#### Issue 5: Validation Error
**Symptoms:** 400 Cancellation reason must be at least 5 characters
**Solution:** Provide a longer cancellation reason

### 3. Test the Complete Flow

1. **Login to the application**
2. **Create a test booking** (if you don't have one)
3. **Go to My Bookings page**
4. **Try to cancel a booking**
5. **Check the browser console and network tab**

### 4. Manual Testing Commands

If you want to test the API directly:

```bash
# Test with a real booking ID and token
curl -X PUT http://localhost:5000/api/bookings/[BOOKING_ID]/cancel \
  -H "Authorization: Bearer [YOUR_TOKEN]" \
  -H "Content-Type: application/json" \
  -d '{"cancellationReason": "Test cancellation reason"}'
```

## Expected Behavior

When working correctly:
1. User clicks "Cancel Booking" button
2. Prompt appears asking for cancellation reason
3. User enters reason (minimum 5 characters)
4. Confirmation dialog appears
5. User confirms cancellation
6. Loading spinner shows on button
7. API request is made with proper authentication
8. Success message shows with refund information
9. Booking list refreshes
10. Booking status changes to "cancelled"

## Next Steps

1. **Check browser developer tools** as described above
2. **Verify authentication** - make sure user is logged in
3. **Test with a real booking** - create a test booking if needed
4. **Check console logs** for specific error messages
5. **Report specific error messages** if the issue persists
