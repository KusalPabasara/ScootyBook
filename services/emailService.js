const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: process.env.EMAIL_PORT || 587,
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }

  async sendEmail(to, subject, html, text = '') {
    try {
      const mailOptions = {
        from: process.env.EMAIL_FROM || 'ScootyBook <noreply@scootybook.com>',
        to: to,
        subject: subject,
        html: html,
        text: text
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('✅ Email sent successfully:', result.messageId);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('❌ Error sending email:', error);
      return { success: false, error: error.message };
    }
  }

  // Email template for booking confirmation
  generateBookingConfirmationEmail(booking, scooty, user) {
    const startDate = new Date(booking.startDate).toLocaleDateString();
    const endDate = new Date(booking.endDate).toLocaleDateString();
    
    // Calculate duration based on booking type
    const durationMs = new Date(booking.endDate) - new Date(booking.startDate);
    const totalHours = Math.ceil(durationMs / (1000 * 60 * 60));
    const totalDays = Math.ceil(durationMs / (1000 * 60 * 60 * 24));
    
    const durationText = booking.bookingType === 'hourly' 
      ? `${totalHours} hour${totalHours > 1 ? 's' : ''}`
      : `${totalDays} day${totalDays > 1 ? 's' : ''}`;
    
    const totalAmount = booking.totalAmount; // Use the actual calculated amount from booking

    return {
      subject: `Booking Received - ${scooty.brand} ${scooty.model} (Pending Confirmation)`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Booking Confirmation</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #3b82f6; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; }
            .booking-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .detail-row { display: flex; justify-content: space-between; margin: 10px 0; padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
            .detail-label { font-weight: bold; color: #374151; }
            .detail-value { color: #6b7280; }
            .status-badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; }
            .status-pending { background: #fef3c7; color: #92400e; }
            .status-confirmed { background: #d1fae5; color: #065f46; }
            .status-active { background: #dbeafe; color: #1e40af; }
            .status-completed { background: #e5e7eb; color: #374151; }
            .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🛵 ScootyBook</h1>
              <h2>Booking Received - Pending Confirmation</h2>
            </div>
            <div class="content">
              <p>Dear ${user.name},</p>
              <p>Thank you for booking with ScootyBook! Your booking has been received and is currently under review.</p>
              
              <div class="booking-details">
                <h3>Booking Details</h3>
                <div class="detail-row">
                  <span class="detail-label">Booking ID:</span>
                  <span class="detail-value">${booking._id}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Scooty:</span>
                  <span class="detail-value">${scooty.brand} ${scooty.model}${scooty.year ? ` (${scooty.year})` : ''}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Collection Date:</span>
                  <span class="detail-value">${startDate}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Return Date:</span>
                  <span class="detail-value">${endDate}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Duration:</span>
                  <span class="detail-value">${durationText}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Total Amount:</span>
                  <span class="detail-value">LKR ${Math.round(totalAmount)}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Payment Method:</span>
                  <span class="detail-value">${booking.paymentMethod?.replace('_', ' ').toUpperCase() || 'Cash on Pickup'}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Payment Status:</span>
                  <span class="detail-value">
                    <span class="status-badge ${booking.paymentStatus === 'paid' ? 'status-confirmed' : 'status-pending'}">
                      ${booking.paymentStatus === 'paid' ? 'Paid' : 'Pending Payment'}
                    </span>
                  </span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Status:</span>
                  <span class="detail-value">
                    <span class="status-badge status-pending">Pending Confirmation</span>
                  </span>
                </div>
              </div>

              <p><strong>What's Next?</strong></p>
              <ul>
                <li>Our team will review your booking within 24 hours</li>
                <li>You'll receive a confirmation email once approved</li>
                <li>Please come to our store to collect your scooty</li>
                <li>Payment will be collected when you collect the scooty</li>
                <li>Please ensure you have a valid driving license</li>
              </ul>

              <div class="booking-details">
                <h3>Store Location</h3>
                <div class="detail-row">
                  <span class="detail-label">Address:</span>
                  <span class="detail-value">123 Main Street, Colombo 03, Sri Lanka</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Phone:</span>
                  <span class="detail-value">+94 11 234 5678</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Hours:</span>
                  <span class="detail-value">Mon-Sun: 8:00 AM - 8:00 PM</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Google Maps:</span>
                  <span class="detail-value">
                    <a href="https://maps.google.com/?q=123+Main+Street+Colombo+03+Sri+Lanka" 
                       style="color: #3b82f6; text-decoration: none; font-weight: bold;">
                      Open in Google Maps
                    </a>
                  </span>
                </div>
              </div>

              <div style="margin: 20px 0; text-align: center;">
                <a href="https://maps.google.com/?q=123+Main+Street+Colombo+03+Sri+Lanka" 
                   style="display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">
                  View Store Location on Google Maps
                </a>
              </div>

              <p>If you have any questions, please contact our support team.</p>
              
              <div class="footer">
                <p>Best regards,<br>The ScootyBook Team</p>
                <p>Visit us at: <a href="${process.env.APP_URL}">${process.env.APP_URL}</a></p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        ScootyBook - Booking Received (Pending Confirmation)
        
        Dear ${user.name},
        
        Thank you for booking with ScootyBook! Your booking has been received and is currently under review.
        
        Booking Details:
        - Booking ID: ${booking._id}
        - Scooty: ${scooty.brand} ${scooty.model}${scooty.year ? ` (${scooty.year})` : ''}
        - Collection Date: ${startDate}
        - Return Date: ${endDate}
        - Duration: ${durationText}
        - Total Amount: LKR ${Math.round(totalAmount)}
        - Payment Method: ${booking.paymentMethod?.replace('_', ' ').toUpperCase() || 'Cash on Pickup'}
        - Payment Status: ${booking.paymentStatus === 'paid' ? 'Paid' : 'Pending Payment'}
        - Status: Pending Confirmation
        
        What's Next?
        - Our team will review your booking within 24 hours
        - You'll receive a confirmation email once approved
        - Please come to our store to collect your scooty
        - Payment will be collected when you collect the scooty
        - Please ensure you have a valid driving license
        
        Store Location:
        - Address: 123 Main Street, Colombo 03, Sri Lanka
        - Phone: +94 11 234 5678
        - Hours: Mon-Sun: 8:00 AM - 8:00 PM
        - Google Maps: https://maps.google.com/?q=123+Main+Street+Colombo+03+Sri+Lanka
        
        Quick Navigation:
        Click the Google Maps link above to get directions to our store!
        
        If you have any questions, please contact our support team.
        
        Best regards,
        The ScootyBook Team
      `
    };
  }

  // Email template for booking status updates
  generateBookingStatusUpdateEmail(booking, scooty, user, status) {
    const startDate = new Date(booking.startDate).toLocaleDateString();
    const endDate = new Date(booking.endDate).toLocaleDateString();
    
    // Calculate duration based on booking type
    const durationMs = new Date(booking.endDate) - new Date(booking.startDate);
    const totalHours = Math.ceil(durationMs / (1000 * 60 * 60));
    const totalDays = Math.ceil(durationMs / (1000 * 60 * 60 * 24));
    
    const durationText = booking.bookingType === 'hourly' 
      ? `${totalHours} hour${totalHours > 1 ? 's' : ''}`
      : `${totalDays} day${totalDays > 1 ? 's' : ''}`;
    
    const totalAmount = booking.totalAmount; // Use the actual calculated amount from booking

    let statusMessage = '';
    let statusClass = '';
    let nextSteps = '';

    switch (status) {
      case 'confirmed':
        statusMessage = 'Your booking has been confirmed!';
        statusClass = 'status-confirmed';
        nextSteps = `
          <p><strong>Next Steps:</strong></p>
          <ul>
            <li>Please arrive at the pickup location on time</li>
            <li>Bring a valid driving license and ID</li>
            <li>Inspect the scooty before taking it</li>
            <li>Contact us if you have any issues</li>
          </ul>
        `;
        break;
      case 'active':
        statusMessage = 'Your booking is now active! Payment has been collected.';
        statusClass = 'status-active';
        nextSteps = `
          <p><strong>Important Reminders:</strong></p>
          <ul>
            <li>Payment has been successfully collected</li>
            <li>Drive safely and follow traffic rules</li>
            <li>Return the scooty on time</li>
            <li>Report any issues immediately</li>
            <li>Keep the scooty in good condition</li>
          </ul>
        `;
        break;
      case 'completed':
        statusMessage = 'Your booking has been completed!';
        statusClass = 'status-completed';
        nextSteps = `
          <p><strong>Thank you for using ScootyBook!</strong></p>
          <ul>
            <li>We hope you had a great experience</li>
            <li>Please rate your experience</li>
            <li>Book with us again for your next adventure</li>
          </ul>
        `;
        break;
      case 'cancelled':
        statusMessage = 'Your booking has been cancelled';
        statusClass = 'status-cancelled';
        nextSteps = `
          <p><strong>Booking Cancelled</strong></p>
          <ul>
            <li>Your booking has been cancelled</li>
            <li>Any payments will be refunded within 3-5 business days</li>
            <li>Contact us if you have any questions</li>
          </ul>
        `;
        break;
    }

    return {
      subject: `Booking Update - ${scooty.brand} ${scooty.model} (${status.charAt(0).toUpperCase() + status.slice(1)})`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Booking Status Update</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #3b82f6; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; }
            .booking-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .detail-row { display: flex; justify-content: space-between; margin: 10px 0; padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
            .detail-label { font-weight: bold; color: #374151; }
            .detail-value { color: #6b7280; }
            .status-badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; }
            .status-pending { background: #fef3c7; color: #92400e; }
            .status-confirmed { background: #d1fae5; color: #065f46; }
            .status-active { background: #dbeafe; color: #1e40af; }
            .status-completed { background: #e5e7eb; color: #374151; }
            .status-cancelled { background: #fee2e2; color: #991b1b; }
            .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🛵 ScootyBook</h1>
              <h2>Booking Status Update</h2>
            </div>
            <div class="content">
              <p>Dear ${user.name},</p>
              <p><strong>${statusMessage}</strong></p>
              
              <div class="booking-details">
                <h3>Booking Details</h3>
                <div class="detail-row">
                  <span class="detail-label">Booking ID:</span>
                  <span class="detail-value">${booking._id}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Scooty:</span>
                  <span class="detail-value">${scooty.brand} ${scooty.model}${scooty.year ? ` (${scooty.year})` : ''}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Collection Date:</span>
                  <span class="detail-value">${startDate}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Return Date:</span>
                  <span class="detail-value">${endDate}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Duration:</span>
                  <span class="detail-value">${durationText}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Total Amount:</span>
                  <span class="detail-value">LKR ${Math.round(totalAmount)}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Status:</span>
                  <span class="detail-value">
                    <span class="status-badge ${statusClass}">${status.charAt(0).toUpperCase() + status.slice(1)}</span>
                  </span>
                </div>
              </div>

              ${nextSteps}

              <p>If you have any questions, please contact our support team.</p>
              
              <div class="footer">
                <p>Best regards,<br>The ScootyBook Team</p>
                <p>Visit us at: <a href="${process.env.APP_URL}">${process.env.APP_URL}</a></p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        ScootyBook - Booking Status Update
        
        Dear ${user.name},
        
        ${statusMessage}
        
        Booking Details:
        - Booking ID: ${booking._id}
        - Scooty: ${scooty.brand} ${scooty.model}${scooty.year ? ` (${scooty.year})` : ''}
        - Collection Date: ${startDate}
        - Return Date: ${endDate}
        - Duration: ${durationText}
        - Total Amount: LKR ${Math.round(totalAmount)}
        - Status: ${status.charAt(0).toUpperCase() + status.slice(1)}
        
        ${nextSteps.replace(/<[^>]*>/g, '')}
        
        If you have any questions, please contact our support team.
        
        Best regards,
        The ScootyBook Team
      `
    };
  }
}

module.exports = new EmailService();
