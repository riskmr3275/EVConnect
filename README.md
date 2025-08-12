# ⚡ EV Charging Station Management System v2.0

A complete **EV Charging Station Management System** that enables users to book charging slots, manage EVs, handle payments, and track charging history. Built with modern technologies and enhanced with real-time features, payment gateway integration, and comprehensive analytics.

---

🌐 **Live Demo:** https://evconnect-frontend.onrender.com/

---

## 🚀 What's New in v2.0

### 💳 Payment Gateway Integration
- **Stripe Integration** for secure payments
- Real-time payment processing
- Automatic refund handling
- Payment history and receipts

### � Real-timke Notifications
- Socket.io powered real-time updates
- Email notifications for important events
- In-app notification center
- Push notification support

### ⭐ Reviews & Ratings System
- Station rating and review system
- User feedback management
- Top-rated stations discovery
- Review analytics for owners

### 📊 Enhanced Analytics
- Comprehensive charging history
- Energy consumption tracking
- Revenue analytics for station owners
- Booking pattern analysis

### 🔧 Improved Architecture
- Modular service-based backend
- Enhanced error handling
- File upload capabilities
- Caching and performance optimizations

---

## 📌 Complete Feature Set

### 👤 User Management
- ✅ **Multi-role Authentication** (User, Owner, Admin, Station Master)
- ✅ **Profile Management** with image uploads
- ✅ **OTP-based Password Reset**
- ✅ **Email Verification System**

### 🚗 EV Management
- ✅ **EV Registration & Profiles**
- ✅ **Multiple EV Support per User**
- ✅ **Charging Port Preferences**
- ✅ **EV Image Management**

### 🏢 Station Management
- ✅ **Station Registration & Management**
- ✅ **Geo-location Based Search**
- ✅ **Multiple Charging Slot Types**
- ✅ **Real-time Availability Tracking**
- ✅ **Station Image Gallery**

### 📅 Advanced Booking System
- ✅ **Time-slot Based Reservations**
- ✅ **Booking Modifications & Cancellations**
- ✅ **Conflict Detection & Prevention**
- ✅ **Automated Slot Management**

### 💰 Payment & Transactions
- ✅ **Stripe Payment Gateway**
- ✅ **Secure Card Processing**
- ✅ **Automatic Refund System**
- ✅ **Penalty Management**
- ✅ **Transaction History**
- ✅ **Revenue Analytics**

### ⚡ Charging Management
- ✅ **Real-time Charging Sessions**
- ✅ **Energy Consumption Tracking**
- ✅ **Cost Calculation**
- ✅ **Session History**
- ✅ **Charging Analytics**

### ⭐ Reviews & Ratings
- ✅ **Station Rating System**
- ✅ **User Reviews & Comments**
- ✅ **Review Management**
- ✅ **Top-rated Stations**
- ✅ **Review Analytics**

### 🔔 Notification System
- ✅ **Real-time Notifications**
- ✅ **Email Notifications**
- ✅ **Notification Center**
- ✅ **Push Notifications**
- ✅ **Notification Preferences**

### 📊 Analytics & Reporting
- ✅ **User Dashboard Analytics**
- ✅ **Station Owner Analytics**
- ✅ **Revenue Tracking**
- ✅ **Energy Consumption Reports**
- ✅ **Booking Pattern Analysis**

---

## 🛠 Tech Stack

### Backend
| Component | Technology |
|-----------|------------|
| **Runtime** | Node.js 18+ |
| **Framework** | Express.js |
| **Database** | PostgreSQL |
| **ORM** | Prisma |
| **Authentication** | JWT |
| **Payment** | Stripe |
| **Real-time** | Socket.io |
| **File Upload** | Multer + Cloudinary |
| **Email** | Nodemailer |
| **Validation** | Joi |

### Frontend
| Component | Technology |
|-----------|------------|
| **Framework** | React 19 |
| **Build Tool** | Vite |
| **Styling** | Tailwind CSS v4 |
| **State Management** | Redux Toolkit |
| **Routing** | React Router v7 |
| **UI Components** | Radix UI |
| **Icons** | Lucide React |
| **Charts** | Recharts |
| **Animations** | Framer Motion |
| **Payments** | Stripe React |
| **Real-time** | Socket.io Client |

### DevOps & Deployment
| Component | Technology |
|-----------|------------|
| **Containerization** | Docker |
| **Cloud Platform** | AWS / Render |
| **Database Hosting** | PostgreSQL Cloud |
| **File Storage** | Cloudinary / AWS S3 |
| **Process Management** | PM2 |
| **Reverse Proxy** | Nginx |
| **SSL** | Let's Encrypt |

---

## 📂 Project Structure

```
EV-Charging-Station/
├── Backend/
│   ├── controllers/          # Request handlers
│   ├── services/            # Business logic
│   ├── routes/              # API routes
│   ├── middlewares/         # Custom middleware
│   ├── utils/               # Utility functions
│   ├── config/              # Configuration files
│   ├── prisma/              # Database schema & migrations
│   └── index.js             # Server entry point
├── Frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── services/        # API services
│   │   ├── slices/          # Redux slices
│   │   ├── lib/             # Utility libraries
│   │   └── assets/          # Static assets
│   ├── public/              # Public assets
│   └── index.html           # HTML template
├── README.md
├── SETUP.md
└── .gitignore
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm or yarn
- Stripe account (for payments)
- Cloudinary account (for images)

### 1. Clone Repository
```bash
git clone https://github.com/your-username/ev-charging-station.git
cd ev-charging-station
```

### 2. Backend Setup
```bash
cd Backend
npm install
cp .env.example .env
# Configure your environment variables
npx prisma migrate dev
npx prisma generate
npm run dev
```

### 3. Frontend Setup
```bash
cd Frontend
npm install
cp .env.example .env
# Configure your environment variables
npm run dev
```

### 4. Environment Configuration

#### Backend (.env)
```env
DATABASE_URL="postgresql://username:password@localhost:5432/evstation_db"
JWT_SECRET="your-super-secret-jwt-key"
STRIPE_SECRET_KEY="sk_test_your_stripe_secret_key"
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"
```

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:4000/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
VITE_SOCKET_URL=http://localhost:4000
```

---

## 📱 API Documentation

### Authentication Endpoints
```
POST /api/auth/register     # User registration
POST /api/auth/login        # User login
POST /api/auth/forgot-password  # Password reset
POST /api/auth/reset-password   # Reset with OTP
```

### Booking Endpoints
```
POST /api/bookings/create           # Create booking
GET  /api/bookings/user-bookings    # Get user bookings
PUT  /api/bookings/:id              # Update booking
DELETE /api/bookings/:id            # Cancel booking
GET  /api/bookings/availability/check  # Check availability
```

### Payment Endpoints
```
POST /api/transactions/create-payment-intent  # Create payment
POST /api/transactions/confirm-payment        # Confirm payment
GET  /api/transactions/user-transactions      # Get transactions
POST /api/transactions/refund                 # Process refund
```

### Station Endpoints
```
GET  /api/stations              # Get all stations
POST /api/stations/create       # Create station
GET  /api/stations/nearby       # Get nearby stations
GET  /api/stations/search       # Search stations
```

---

## 🔧 Development Commands

### Backend
```bash
npm run dev          # Start development server
npm run start        # Start production server
npm run migrate      # Run database migrations
npm run generate     # Generate Prisma client
npm run studio       # Open Prisma Studio
```

### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

---

## 🚀 Deployment

### Using Docker
```bash
# Build and run with Docker Compose
docker-compose up --build

# Or build individual containers
docker build -t ev-backend ./Backend
docker build -t ev-frontend ./Frontend
```

### Manual Deployment
See [SETUP.md](SETUP.md) for detailed deployment instructions.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Team

- **Risu Gupta** - Lead Developer
- **Contributors** - Open for contributions!

---

## 📞 Support

For support and queries:
- 📧 Email: support@evconnect.com
- 🐛 Issues: [GitHub Issues](https://github.com/your-username/ev-charging-station/issues)
- 📖 Documentation: [Wiki](https://github.com/your-username/ev-charging-station/wiki)

---

## 🙏 Acknowledgments

- Stripe for payment processing
- Cloudinary for image management
- Prisma for database management
- React community for amazing tools
- All contributors and testers

---

**⚡ Power up the future of electric mobility! ⚡**