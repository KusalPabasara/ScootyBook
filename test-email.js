require('dotenv').config();
const emailService = require('./services/emailService');

// Test email functionality
async function testEmailService() {
  console.log('🧪 Testing Email Service...');
  
  // Test data
  const testUser = {
    name: 'John Doe',
    email: 'test@example.com' // Replace with actual email for testing
  };
  
  const testScooty = {
    brand: 'Honda',
    model: 'Activa',
    year: 2023,
    pricePerHour: 50,
    pricePerDay: 500
  };
  
  const testBooking = {
    _id: '507f1f77bcf86cd799439011',
    startDate: new Date('2024-01-15'),
    endDate: new Date('2024-01-17'),
    totalAmount: 1000,
    status: 'pending'
  };

  try {
    // Test booking confirmation email
    console.log('📧 Testing booking confirmation email...');
    const confirmationTemplate = emailService.generateBookingConfirmationEmail(testBooking, testScooty, testUser);
    
    const confirmationResult = await emailService.sendEmail(
      testUser.email,
      confirmationTemplate.subject,
      confirmationTemplate.html,
      confirmationTemplate.text
    );
    
    if (confirmationResult.success) {
      console.log('✅ Booking confirmation email test passed');
    } else {
      console.log('❌ Booking confirmation email test failed:', confirmationResult.error);
    }

    // Test status update email
    console.log('📧 Testing status update email...');
    const statusTemplate = emailService.generateBookingStatusUpdateEmail(testBooking, testScooty, testUser, 'confirmed');
    
    const statusResult = await emailService.sendEmail(
      testUser.email,
      statusTemplate.subject,
      statusTemplate.html,
      statusTemplate.text
    );
    
    if (statusResult.success) {
      console.log('✅ Status update email test passed');
    } else {
      console.log('❌ Status update email test failed:', statusResult.error);
    }

  } catch (error) {
    console.error('❌ Email service test failed:', error);
  }
}

// Run test if this file is executed directly
if (require.main === module) {
  testEmailService().then(() => {
    console.log('🏁 Email service test completed');
    process.exit(0);
  }).catch((error) => {
    console.error('💥 Email service test crashed:', error);
    process.exit(1);
  });
}

module.exports = testEmailService;
