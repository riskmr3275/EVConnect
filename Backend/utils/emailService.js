const nodemailer = require('nodemailer');

class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
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

    // Send employee credentials email
    async sendEmployeeCredentials(email, employeeDetails) {
        try {
            const mailOptions = {
                from: process.env.EMAIL_FROM,
                to: email,
                subject: 'Your EV Connect Station Master Account - Credentials',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #059669;">Welcome to EV Connect Team!</h2>
                        <p>Hello ${employeeDetails.name},</p>
                        <p>You have been added as a Station Master for <strong>${employeeDetails.stationName}</strong>.</p>
                        
                        <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #059669;">
                            <h3 style="margin-top: 0; color: #065f46;">Your Account Credentials</h3>
                            <p><strong>Employee ID:</strong> ${employeeDetails.employeeId}</p>
                            <p><strong>Email:</strong> ${email}</p>
                            <p><strong>Temporary Password:</strong> <code style="background-color: #dcfce7; padding: 4px 8px; border-radius: 4px;">${employeeDetails.password}</code></p>
                            <p><strong>Station:</strong> ${employeeDetails.stationName}</p>
                            <p><strong>Designation:</strong> ${employeeDetails.designation}</p>
                            <p><strong>Shift:</strong> ${employeeDetails.shift}</p>
                        </div>
                        
                        <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
                            <p style="margin: 0;"><strong>⚠️ Important Security Notice:</strong></p>
                            <p style="margin: 5px 0 0 0;">Please change your password immediately after your first login for security purposes.</p>
                        </div>
                        
                        <h3>Your Responsibilities:</h3>
                        <ul>
                            <li>Monitor charging station operations</li>
                            <li>Manage charging port availability</li>
                            <li>Assist customers with charging sessions</li>
                            <li>Confirm bookings via QR code scanning</li>
                            <li>Maintain station cleanliness and safety</li>
                            <li>Report technical issues promptly</li>
                        </ul>
                        
                        <div style="background-color: #eff6ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
                            <h3 style="margin-top: 0;">Getting Started:</h3>
                            <ol>
                                <li>Login to your account using the credentials above</li>
                                <li>Complete your profile setup</li>
                                <li>Familiarize yourself with the station master dashboard</li>
                                <li>Contact your supervisor for any training requirements</li>
                            </ol>
                        </div>
                        
                        <p>If you have any questions or need assistance, please contact your station owner or our support team.</p>
                        
                        <hr style="margin: 30px 0;">
                        <p style="color: #6b7280; font-size: 14px;">
                            Welcome to the team!<br>
                            EV Connect Management
                        </p>
                    </div>
                `
            };

            await this.transporter.sendMail(mailOptions);
            console.log(`Employee credentials email sent to ${email}`);
            return true;
        } catch (error) {
            console.error('Error sending employee credentials email:', error);
            throw new Error('Failed to send employee credentials email');
        }
    }

    // Send QR code booking confirmation email
    async sendQRBookingConfirmation(email, bookingDetails) {
        try {
            const mailOptions = {
                from: process.env.EMAIL_FROM,
                to: email,
                subject: 'Booking Confirmed - QR Code Attached',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #059669;">Booking Confirmed with QR Code!</h2>
                        <p>Hello ${bookingDetails.userName},</p>
                        <p>Your charging slot booking has been confirmed. Use the QR code below at the station:</p>
                        
                        <div style="text-align: center; margin: 30px 0;">
                            <img src="${bookingDetails.qrCodeUrl}" alt="Booking QR Code" style="max-width: 200px; border: 2px solid #e5e7eb; border-radius: 8px;">
                            <p style="margin-top: 10px; font-size: 14px; color: #6b7280;">Scan this QR code at the station</p>
                        </div>
                        
                        <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
                            <h3 style="margin-top: 0;">Booking Details</h3>
                            <p><strong>Booking ID:</strong> ${bookingDetails.bookingId}</p>
                            <p><strong>Station:</strong> ${bookingDetails.stationName}</p>
                            <p><strong>Address:</strong> ${bookingDetails.stationAddress}</p>
                            <p><strong>Slot:</strong> ${bookingDetails.slotNumber}</p>
                            <p><strong>Date & Time:</strong> ${new Date(bookingDetails.startTime).toLocaleString()}</p>
                            <p><strong>Duration:</strong> ${bookingDetails.duration} minutes</p>
                            <p><strong>Estimated Cost:</strong> ₹${bookingDetails.estimatedCost}</p>
                        </div>
                        
                        <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
                            <p style="margin: 0;"><strong>📱 Instructions:</strong></p>
                            <ol style="margin: 10px 0 0 0; padding-left: 20px;">
                                <li>Arrive at the station on time</li>
                                <li>Show this QR code to the station master</li>
                                <li>Wait for confirmation before starting charging</li>
                                <li>Follow all safety guidelines</li>
                            </ol>
                        </div>
                        
                        <hr style="margin: 30px 0;">
                        <p style="color: #6b7280; font-size: 14px;">
                            Safe charging!<br>
                            EV Connect Team
                        </p>
                    </div>
                `
            };

            await this.transporter.sendMail(mailOptions);
            console.log(`QR booking confirmation email sent to ${email}`);
            return true;
        } catch (error) {
            console.error('Error sending QR booking confirmation email:', error);
            throw new Error('Failed to send QR booking confirmation email');
        }
    }

    // Send station master notification for new booking
    async sendStationMasterBookingNotification(email, bookingDetails) {
        try {
            const mailOptions = {
                from: process.env.EMAIL_FROM,
                to: email,
                subject: 'New Booking Alert - Action Required',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #dc2626;">New Booking Alert!</h2>
                        <p>Hello Station Master,</p>
                        <p>A new booking has been made for your station. Please prepare the charging slot:</p>
                        
                        <div style="background-color: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
                            <h3 style="margin-top: 0;">Booking Details</h3>
                            <p><strong>Booking ID:</strong> ${bookingDetails.bookingId}</p>
                            <p><strong>Customer:</strong> ${bookingDetails.customerName}</p>
                            <p><strong>Vehicle:</strong> ${bookingDetails.vehicleDetails}</p>
                            <p><strong>Slot:</strong> ${bookingDetails.slotNumber}</p>
                            <p><strong>Scheduled Time:</strong> ${new Date(bookingDetails.startTime).toLocaleString()}</p>
                            <p><strong>Duration:</strong> ${bookingDetails.duration} minutes</p>
                            <p><strong>Port Type:</strong> ${bookingDetails.portType}</p>
                        </div>
                        
                        <div style="background-color: #eff6ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
                            <h3 style="margin-top: 0;">Action Required:</h3>
                            <ul>
                                <li>Ensure the charging slot is clean and functional</li>
                                <li>Verify the port type matches the booking</li>
                                <li>Be ready to scan the customer's QR code</li>
                                <li>Assist the customer if needed</li>
                            </ul>
                        </div>
                        
                        <p>Please login to your dashboard for more details and to manage this booking.</p>
                        
                        <hr style="margin: 30px 0;">
                        <p style="color: #6b7280; font-size: 14px;">
                            EV Connect Station Management<br>
                            This is an automated notification
                        </p>
                    </div>
                `
            };

            await this.transporter.sendMail(mailOptions);
            console.log(`Station master booking notification sent to ${email}`);
            return true;
        } catch (error) {
            console.error('Error sending station master notification:', error);
            // Don't throw error as this is a notification
            return false;
        }
    }
}

module.exports = new EmailService();