const nodemailer = require('nodemailer');

class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransporter({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
    }

    // Send OTP email
    async sendOTPEmail(email, otp, name) {
        try {
            const mailOptions = {
                from: process.env.EMAIL_FROM,
                to: email,
                subject: 'Password Reset OTP - EV Connect',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #2563eb;">Password Reset Request</h2>
                        <p>Hello ${name},</p>
                        <p>You have requested to reset your password. Please use the following OTP to reset your password:</p>
                        <div style="background-color: #f3f4f6; padding: 20px; text-align: center; margin: 20px 0;">
                            <h1 style="color: #1f2937; font-size: 32px; margin: 0;">${otp}</h1>
                        </div>
                        <p>This OTP will expire in 15 minutes.</p>
                        <p>If you didn't request this password reset, please ignore this email.</p>
                        <hr style="margin: 30px 0;">
                        <p style="color: #6b7280; font-size: 14px;">
                            Best regards,<br>
                            EV Connect Team
                        </p>
                    </div>
                `
            };

            await this.transporter.sendMail(mailOptions);
            console.log(`OTP email sent to ${email}`);
            return true;
        } catch (error) {
            console.error('Error sending OTP email:', error);
            throw new Error('Failed to send OTP email');
        }
    }

    // Send booking confirmation email
    async sendBookingConfirmation(email, bookingDetails) {
        try {
            const mailOptions = {
                from: process.env.EMAIL_FROM,
                to: email,
                subject: 'Booking Confirmation - EV Connect',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #059669;">Booking Confirmed!</h2>
                        <p>Hello ${bookingDetails.userName},</p>
                        <p>Your charging slot booking has been confirmed. Here are the details:</p>
                        
                        <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
                            <h3 style="margin-top: 0;">Booking Details</h3>
                            <p><strong>Station:</strong> ${bookingDetails.stationName}</p>
                            <p><strong>Address:</strong> ${bookingDetails.stationAddress}</p>
                            <p><strong>Date & Time:</strong> ${new Date(bookingDetails.startTime).toLocaleString()}</p>
                            <p><strong>Duration:</strong> ${bookingDetails.duration} hours</p>
                            <p><strong>EV:</strong> ${bookingDetails.evBrand} ${bookingDetails.evModel}</p>
                            <p><strong>Slot Type:</strong> ${bookingDetails.slotType}</p>
                            <p><strong>Amount Paid:</strong> ₹${bookingDetails.amount}</p>
                        </div>
                        
                        <p>Please arrive on time and have your booking confirmation ready.</p>
                        <p>For any queries, contact the station directly or reach out to our support team.</p>
                        
                        <hr style="margin: 30px 0;">
                        <p style="color: #6b7280; font-size: 14px;">
                            Thank you for choosing EV Connect!<br>
                            EV Connect Team
                        </p>
                    </div>
                `
            };

            await this.transporter.sendMail(mailOptions);
            console.log(`Booking confirmation email sent to ${email}`);
            return true;
        } catch (error) {
            console.error('Error sending booking confirmation email:', error);
            throw new Error('Failed to send booking confirmation email');
        }
    }

    // Send payment receipt email
    async sendPaymentReceipt(email, paymentDetails) {
        try {
            const mailOptions = {
                from: process.env.EMAIL_FROM,
                to: email,
                subject: 'Payment Receipt - EV Connect',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #2563eb;">Payment Receipt</h2>
                        <p>Hello ${paymentDetails.userName},</p>
                        <p>Thank you for your payment. Here's your receipt:</p>
                        
                        <div style="background-color: #eff6ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
                            <h3 style="margin-top: 0;">Payment Details</h3>
                            <p><strong>Transaction ID:</strong> ${paymentDetails.transactionId}</p>
                            <p><strong>Amount:</strong> ₹${paymentDetails.amount}</p>
                            <p><strong>Payment Method:</strong> ${paymentDetails.paymentMethod}</p>
                            <p><strong>Date:</strong> ${new Date(paymentDetails.date).toLocaleString()}</p>
                            <p><strong>Status:</strong> ${paymentDetails.status}</p>
                        </div>
                        
                        <p>This receipt serves as proof of payment for your EV charging session.</p>
                        
                        <hr style="margin: 30px 0;">
                        <p style="color: #6b7280; font-size: 14px;">
                            Thank you for using EV Connect!<br>
                            EV Connect Team
                        </p>
                    </div>
                `
            };

            await this.transporter.sendMail(mailOptions);
            console.log(`Payment receipt email sent to ${email}`);
            return true;
        } catch (error) {
            console.error('Error sending payment receipt email:', error);
            throw new Error('Failed to send payment receipt email');
        }
    }

    // Send welcome email
    async sendWelcomeEmail(email, name, accountType) {
        try {
            const mailOptions = {
                from: process.env.EMAIL_FROM,
                to: email,
                subject: 'Welcome to EV Connect!',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #2563eb;">Welcome to EV Connect!</h2>
                        <p>Hello ${name},</p>
                        <p>Welcome to EV Connect - your one-stop solution for EV charging station management!</p>
                        
                        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                            <h3 style="margin-top: 0;">Your Account Details</h3>
                            <p><strong>Name:</strong> ${name}</p>
                            <p><strong>Email:</strong> ${email}</p>
                            <p><strong>Account Type:</strong> ${accountType}</p>
                        </div>
                        
                        <p>You can now:</p>
                        <ul>
                            <li>Find and book charging stations near you</li>
                            <li>Manage your EV profiles</li>
                            <li>Track your charging history</li>
                            <li>Make secure payments</li>
                            <li>Rate and review charging stations</li>
                        </ul>
                        
                        <p>Get started by logging into your account and exploring the features!</p>
                        
                        <hr style="margin: 30px 0;">
                        <p style="color: #6b7280; font-size: 14px;">
                            Happy charging!<br>
                            EV Connect Team
                        </p>
                    </div>
                `
            };

            await this.transporter.sendMail(mailOptions);
            console.log(`Welcome email sent to ${email}`);
            return true;
        } catch (error) {
            console.error('Error sending welcome email:', error);
            // Don't throw error for welcome email as it's not critical
            return false;
        }
    }
}

module.exports = new EmailService();