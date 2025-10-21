# Email Notification System Setup

## Overview
The ScootyBook application now includes an email notification system that sends automated emails to clients at different stages of their booking process.

## Email Notifications Sent

### 1. Booking Confirmation Email
- **When**: Immediately after a client creates a booking
- **Content**: Booking details, scooty information, pickup/return dates, total amount, and next steps
- **Status**: Pending Confirmation

### 2. Booking Status Update Emails
- **When**: Admin updates booking status (confirmed, active, completed, cancelled)
- **Content**: Updated booking details with new status and relevant next steps
- **Statuses**: Confirmed, Active, Completed, Cancelled

## Setup Instructions

### 1. Email Service Configuration

Update your `.env` file with your email service credentials:

```env
# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=ScootyBook <your-email@gmail.com>

# Application Configuration
APP_NAME=ScootyBook
APP_URL=http://localhost:3000
```

### 2. Gmail Setup (Recommended)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
   - Use this password in `EMAIL_PASS`

### 3. Alternative Email Services

You can use other email services by updating the configuration:

#### Outlook/Hotmail
```env
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_SECURE=false
```

#### Yahoo Mail
```env
EMAIL_HOST=smtp.mail.yahoo.com
EMAIL_PORT=587
EMAIL_SECURE=false
```

#### Custom SMTP Server
```env
EMAIL_HOST=your-smtp-server.com
EMAIL_PORT=587
EMAIL_SECURE=false
```

## Testing the Email System

### 1. Test Email Service
Run the test script to verify email functionality:

```bash
node test-email.js
```

**Note**: Update the test email address in `test-email.js` before running.

### 2. Test with Real Booking
1. Create a test user account
2. Make a booking through the application
3. Check the user's email for confirmation
4. Update booking status as admin
5. Check for status update emails

## Email Templates

### Booking Confirmation Template
- Professional HTML design with ScootyBook branding
- Complete booking details
- Status badge showing "Pending Confirmation"
- Next steps for the user
- Contact information

### Status Update Templates
- Dynamic content based on status
- Color-coded status badges
- Relevant next steps for each status
- Professional styling consistent with confirmation email

## Features

### ✅ Implemented Features
- **Automated Email Sending**: Emails sent automatically on booking events
- **Professional Templates**: HTML emails with responsive design
- **Error Handling**: Email failures don't break booking functionality
- **Multiple Status Updates**: Different emails for confirmed, active, completed, cancelled
- **Rich Content**: Detailed booking information in each email

### 🔧 Technical Features
- **Nodemailer Integration**: Robust email sending library
- **Template System**: Reusable email templates
- **Environment Configuration**: Easy setup via environment variables
- **Error Logging**: Comprehensive error logging for debugging
- **Non-blocking**: Email sending doesn't block API responses

## Troubleshooting

### Common Issues

1. **Authentication Failed**
   - Verify email credentials in `.env`
   - Check if 2FA is enabled and app password is correct
   - Ensure "Less secure app access" is disabled (use app passwords instead)

2. **Connection Timeout**
   - Check firewall settings
   - Verify SMTP server and port
   - Try different email service

3. **Emails Not Received**
   - Check spam/junk folder
   - Verify email address is correct
   - Check email service logs

### Debug Mode
Enable debug logging by setting:
```env
NODE_ENV=development
```

This will show detailed email sending logs in the console.

## Security Considerations

1. **Environment Variables**: Never commit email credentials to version control
2. **App Passwords**: Use app-specific passwords instead of main account passwords
3. **Rate Limiting**: Consider implementing rate limiting for email sending
4. **Email Validation**: Validate email addresses before sending

## Future Enhancements

- **Email Preferences**: Allow users to opt-out of certain email types
- **SMS Notifications**: Add SMS notifications as alternative
- **Email Scheduling**: Schedule emails for specific times
- **Template Customization**: Allow admin to customize email templates
- **Email Analytics**: Track email open rates and engagement
