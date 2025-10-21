const twilio = require('twilio');

class SMSService {
  constructor() {
    this.client = null;
    this.isConfigured = false;
    
    // Initialize Twilio client if credentials are available and valid
    if (process.env.TWILIO_ACCOUNT_SID && 
        process.env.TWILIO_AUTH_TOKEN && 
        process.env.TWILIO_PHONE_NUMBER &&
        process.env.TWILIO_ACCOUNT_SID.startsWith('AC') &&
        process.env.TWILIO_ACCOUNT_SID !== 'your_twilio_account_sid_here') {
      try {
        this.client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
        this.isConfigured = true;
      } catch (error) {
        console.log('⚠️ SMS service initialization failed:', error.message);
        this.isConfigured = false;
      }
    }
  }

  /**
   * Send SMS message
   * @param {string} to - Recipient phone number (with country code)
   * @param {string} message - SMS message content
   * @returns {Promise<Object>} - Twilio message object
   */
  async sendSMS(to, message) {
    if (!this.isConfigured) {
      throw new Error('SMS service not configured. Please check TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER environment variables.');
    }

    try {
      // Format phone number (ensure it starts with +)
      const formattedTo = to.startsWith('+') ? to : `+${to}`;
      
      const result = await this.client.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: formattedTo
      });

      console.log(`✅ SMS sent successfully to ${formattedTo}: ${result.sid}`);
      return result;
    } catch (error) {
      console.error('❌ Error sending SMS:', error);
      throw error;
    }
  }

  /**
   * Generate booking confirmation SMS
   * @param {Object} booking - Booking object
   * @param {Object} scooty - Scooty object
   * @param {Object} user - User object
   * @returns {string} - Formatted SMS message
   */
  generateBookingConfirmationSMS(booking, scooty, user) {
    const startDate = new Date(booking.startDate).toLocaleDateString();
    const endDate = new Date(booking.endDate).toLocaleDateString();
    const totalAmount = Math.round(booking.totalAmount);
    
    return `ScootyBook Booking Confirmation

Booking ID: ${booking._id}
Scooty: ${scooty.brand} ${scooty.model}
Collection: ${startDate}
Return: ${endDate}
Amount: LKR ${totalAmount}
Payment: ${booking.paymentMethod?.replace('_', ' ') || 'Cash on Pickup'}

Status: Pending Confirmation

Store Location:
123 Main Street, Colombo 03, Sri Lanka
Phone: +94 11 234 5678
Hours: Mon-Sun: 8:00 AM - 8:00 PM

You'll receive confirmation email shortly.
Thank you for choosing ScootyBook!`;
  }

  /**
   * Generate booking status update SMS
   * @param {Object} booking - Booking object
   * @param {Object} scooty - Scooty object
   * @param {Object} user - User object
   * @param {string} status - New booking status
   * @returns {string} - Formatted SMS message
   */
  generateBookingStatusUpdateSMS(booking, scooty, user, status) {
    const startDate = new Date(booking.startDate).toLocaleDateString();
    const endDate = new Date(booking.endDate).toLocaleDateString();
    const totalAmount = Math.round(booking.totalAmount);
    
    let statusMessage = '';
    let nextSteps = '';

    switch (status) {
      case 'confirmed':
        statusMessage = 'Your booking has been confirmed!';
        nextSteps = 'Please arrive at our store on time with a valid driving license.';
        break;
      case 'active':
        statusMessage = 'Your booking is now active! Payment collected.';
        nextSteps = 'Drive safely and return the scooty on time.';
        break;
      case 'completed':
        statusMessage = 'Your booking has been completed!';
        nextSteps = 'Thank you for using ScootyBook!';
        break;
      case 'cancelled':
        statusMessage = 'Your booking has been cancelled.';
        nextSteps = booking.refundAmount > 0 ? `Refund: LKR ${Math.round(booking.refundAmount)}` : 'No refund applicable.';
        break;
      default:
        statusMessage = `Your booking status has been updated to: ${status}`;
        nextSteps = 'Please check your email for more details.';
    }

    return `ScootyBook Status Update

${statusMessage}

Booking ID: ${booking._id}
Scooty: ${scooty.brand} ${scooty.model}
Collection: ${startDate}
Return: ${endDate}
Amount: LKR ${totalAmount}

${nextSteps}

Store: 123 Main Street, Colombo 03, Sri Lanka
Phone: +94 11 234 5678

ScootyBook Team`;
  }

  /**
   * Generate booking reminder SMS
   * @param {Object} booking - Booking object
   * @param {Object} scooty - Scooty object
   * @param {Object} user - User object
   * @param {string} reminderType - Type of reminder (pickup, return)
   * @returns {string} - Formatted SMS message
   */
  generateBookingReminderSMS(booking, scooty, user, reminderType) {
    const startDate = new Date(booking.startDate).toLocaleDateString();
    const endDate = new Date(booking.endDate).toLocaleDateString();
    
    if (reminderType === 'pickup') {
      return `ScootyBook Reminder

Your scooty pickup is scheduled for:
${startDate}

Scooty: ${scooty.brand} ${scooty.model}
Booking ID: ${booking._id}

Please bring:
- Valid driving license
- ID document
- Payment (if not paid)

Store Location:
123 Main Street, Colombo 03, Sri Lanka
Phone: +94 11 234 5678

ScootyBook Team`;
    } else if (reminderType === 'return') {
      return `ScootyBook Reminder

Your scooty return is due:
${endDate}

Scooty: ${scooty.brand} ${scooty.model}
Booking ID: ${booking._id}

Please return the scooty to our store on time.
Late returns may incur additional charges.

Store Location:
123 Main Street, Colombo 03, Sri Lanka
Phone: +94 11 234 5678

ScootyBook Team`;
    }
  }

  /**
   * Check if SMS service is configured
   * @returns {boolean} - True if configured
   */
  isServiceConfigured() {
    return this.isConfigured;
  }

  /**
   * Get service status
   * @returns {Object} - Service status information
   */
  getServiceStatus() {
    return {
      configured: this.isConfigured,
      provider: 'Twilio',
      phoneNumber: process.env.TWILIO_PHONE_NUMBER || 'Not configured',
      accountSid: process.env.TWILIO_ACCOUNT_SID ? 'Configured' : 'Not configured',
      authToken: process.env.TWILIO_AUTH_TOKEN ? 'Configured' : 'Not configured'
    };
  }
}

module.exports = new SMSService();
