require('dotenv').config();
const axios = require('axios');

// Test script to debug cancel booking functionality
async function testCancelBooking() {
  console.log('🧪 Testing Cancel Booking Functionality...');
  
  const API_BASE_URL = 'http://localhost:5000';
  
  try {
    // First, let's test if the server is running
    console.log('🔍 Testing server connection...');
    const healthCheck = await axios.get(`${API_BASE_URL}/api/bookings/my-bookings`);
    console.log('✅ Server is running');
  } catch (error) {
    if (error.response?.status === 401) {
      console.log('✅ Server is running (authentication required)');
    } else {
      console.error('❌ Server connection failed:', error.message);
      return;
    }
  }

  // Test the cancel booking endpoint structure
  console.log('🔍 Testing cancel booking endpoint...');
  
  const testBookingId = '507f1f77bcf86cd799439011'; // Sample booking ID
  
  try {
    const response = await axios.put(`${API_BASE_URL}/api/bookings/${testBookingId}/cancel`, {
      cancellationReason: 'Test cancellation reason'
    }, {
      headers: {
        'Authorization': 'Bearer test-token',
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Cancel booking endpoint is accessible');
    console.log('Response:', response.data);
  } catch (error) {
    console.log('📋 Cancel booking endpoint test results:');
    console.log('Status:', error.response?.status);
    console.log('Message:', error.response?.data?.message);
    console.log('Errors:', error.response?.data?.errors);
    
    if (error.response?.status === 401) {
      console.log('✅ Endpoint exists (authentication required)');
    } else if (error.response?.status === 404) {
      console.log('✅ Endpoint exists (booking not found - expected)');
    } else if (error.response?.status === 400) {
      console.log('✅ Endpoint exists (validation error - expected)');
    } else {
      console.log('❌ Unexpected error:', error.message);
    }
  }

  console.log('🏁 Cancel booking test completed');
}

// Run test if this file is executed directly
if (require.main === module) {
  testCancelBooking().then(() => {
    console.log('✅ Test completed successfully');
    process.exit(0);
  }).catch((error) => {
    console.error('💥 Test failed:', error);
    process.exit(1);
  });
}

module.exports = testCancelBooking;
