# SMS Service Setup Guide

## Overview
The ScootyBook application now includes SMS functionality alongside email notifications. SMS messages are sent for booking confirmations, status updates, and reminders.

## SMS Provider: Twilio
We use Twilio as the SMS provider, which offers reliable SMS delivery to Sri Lanka and worldwide.

## Setup Instructions

### 1. Create Twilio Account
1. Go to [Twilio Console](https://console.twilio.com/)
2. Sign up for a free account
3. Verify your phone number
4. Get your Account SID and Auth Token from the dashboard

### 2. Get Twilio Phone Number
1. In Twilio Console, go to "Phone Numbers" → "Manage" → "Buy a number"
2. Choose a phone number (preferably with SMS capability)
3. Note down the phone number (format: +1234567890)

### 3. Configure Environment Variables
Update your `.env` file with the following:

```env
# SMS Configuration (Twilio)
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890

# SMS Settings
SMS_ENABLED=true
SMS_SEND_CONFIRMATION=true
SMS_SEND_STATUS_UPDATES=true
SMS_SEND_REMINDERS=true
```

### 4. Install Dependencies
The Twilio package is already installed. If you need to reinstall:
```bash
npm install twilio
```

## SMS Features

### 1. Booking Confirmation SMS
- Sent when a new booking is created
- Includes booking details, store location, and next steps
- Controlled by `SMS_SEND_CONFIRMATION` setting

### 2. Status Update SMS
- Sent when booking status changes (confirmed, active, completed, cancelled)
- Includes updated status and relevant information
- Controlled by `SMS_SEND_STATUS_UPDATES` setting

### 3. Booking Reminder SMS
- Can be sent for pickup and return reminders
- Includes booking details and store information
- Controlled by `SMS_SEND_REMINDERS` setting

## SMS Message Examples

### Booking Confirmation
```
ScootyBook Booking Confirmation

Booking ID: 68efd6bb026701025f6fc693
Scooty: Honda Activa
Collection: 10/29/2025
Return: 11/1/2025
Amount: LKR 7200
Payment: Cash on Pickup

Status: Pending Confirmation

Store Location:
123 Main Street, Colombo 03, Sri Lanka
Phone: +94 11 234 5678
Hours: Mon-Sun: 8:00 AM - 8:00 PM

You'll receive confirmation email shortly.
Thank you for choosing ScootyBook!
```

### Status Update (Active)
```
ScootyBook Status Update

Your booking is now active! Payment collected.

Booking ID: 68efd6bb026701025f6fc693
Scooty: Honda Activa
Collection: 10/29/2025
Return: 11/1/2025
Amount: LKR 7200

Drive safely and return the scooty on time.

Store: 123 Main Street, Colombo 03, Sri Lanka
Phone: +94 11 234 5678

ScootyBook Team
```

## Configuration Options

### Environment Variables
- `SMS_ENABLED`: Enable/disable SMS service (true/false)
- `SMS_SEND_CONFIRMATION`: Send confirmation SMS (true/false)
- `SMS_SEND_STATUS_UPDATES`: Send status update SMS (true/false)
- `SMS_SEND_REMINDERS`: Send reminder SMS (true/false)

### Phone Number Format
- Use international format: +94771234567
- Include country code (Sri Lanka: +94)
- No spaces or special characters

## Testing

### 1. Test SMS Service
Create a test file to verify SMS functionality:

```javascript
const smsService = require('./services/smsService');

// Check service status
console.log('SMS Service Status:', smsService.getServiceStatus());

// Test message generation
const mockBooking = { /* booking data */ };
const mockScooty = { /* scooty data */ };
const mockUser = { /* user data */ };

const smsMessage = smsService.generateBookingConfirmationSMS(mockBooking, mockScooty, mockUser);
console.log('Generated SMS:', smsMessage);
```

### 2. Test Actual SMS Sending
```javascript
// Replace with your test phone number
const testPhone = '+94771234567';
const testMessage = 'Test SMS from ScootyBook!';

try {
  const result = await smsService.sendSMS(testPhone, testMessage);
  console.log('SMS sent successfully:', result.sid);
} catch (error) {
  console.error('SMS sending failed:', error.message);
}
```

## Troubleshooting

### Common Issues

1. **"SMS service not configured"**
   - Check if TWILIO_ACCOUNT_SID starts with "AC"
   - Verify all environment variables are set correctly
   - Ensure credentials are not placeholder values

2. **"Invalid phone number"**
   - Use international format (+94771234567)
   - Include country code
   - Remove spaces and special characters

3. **"SMS sending failed"**
   - Check Twilio account balance
   - Verify phone number is SMS-enabled
   - Check Twilio logs for detailed error messages

### Logs
SMS service logs are available in the server console:
- ✅ Successful SMS: "SMS sent successfully to +94771234567: SM1234567890"
- ❌ Failed SMS: "Error sending SMS: [error details]"
- ⚠️ Not configured: "SMS service not configured or user phone not available"

## Pricing
- Twilio offers free trial credits
- SMS pricing varies by country
- Sri Lanka: ~$0.05-0.10 per SMS
- Check [Twilio Pricing](https://www.twilio.com/pricing) for current rates

## Security Notes
- Keep Twilio credentials secure
- Don't commit credentials to version control
- Use environment variables for all sensitive data
- Monitor SMS usage to prevent abuse

## Support
- [Twilio Documentation](https://www.twilio.com/docs)
- [Twilio Support](https://support.twilio.com/)
- [SMS Best Practices](https://www.twilio.com/docs/sms/best-practices)
