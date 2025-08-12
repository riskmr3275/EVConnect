#!/bin/bash

# EV Charging Station Management System - Setup Script
# This script automates the setup process for the entire application

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check Node.js version
check_node_version() {
    if command_exists node; then
        NODE_VERSION=$(node -v | cut -d'v' -f2)
        MAJOR_VERSION=$(echo $NODE_VERSION | cut -d'.' -f1)
        if [ "$MAJOR_VERSION" -ge 18 ]; then
            print_success "Node.js version $NODE_VERSION is compatible"
            return 0
        else
            print_error "Node.js version $NODE_VERSION is not compatible. Please install Node.js 18 or higher"
            return 1
        fi
    else
        print_error "Node.js is not installed. Please install Node.js 18 or higher"
        return 1
    fi
}

# Function to check PostgreSQL
check_postgresql() {
    if command_exists psql; then
        print_success "PostgreSQL is installed"
        return 0
    else
        print_warning "PostgreSQL is not installed. Please install PostgreSQL 14 or higher"
        return 1
    fi
}

# Function to install dependencies
install_dependencies() {
    print_status "Installing backend dependencies..."
    cd Backend
    npm install
    cd ..

    print_status "Installing frontend dependencies..."
    cd Frontend
    npm install
    cd ..
    
    print_success "All dependencies installed successfully"
}

# Function to setup environment files
setup_environment() {
    print_status "Setting up environment files..."
    
    # Backend environment
    if [ ! -f "Backend/.env" ]; then
        cp Backend/.env.example Backend/.env
        print_warning "Backend .env file created from template. Please configure your environment variables."
    else
        print_status "Backend .env file already exists"
    fi
    
    # Frontend environment
    if [ ! -f "Frontend/.env" ]; then
        cp Frontend/.env.example Frontend/.env
        print_warning "Frontend .env file created from template. Please configure your environment variables."
    else
        print_status "Frontend .env file already exists"
    fi
}

# Function to setup database
setup_database() {
    print_status "Setting up database..."
    
    cd Backend
    
    # Check if DATABASE_URL is configured
    if grep -q "postgresql://username:password@localhost:5432/evstation_db" .env; then
        print_warning "Please configure your DATABASE_URL in Backend/.env before running database setup"
        print_status "Skipping database setup for now"
        cd ..
        return 0
    fi
    
    # Generate Prisma client
    print_status "Generating Prisma client..."
    npx prisma generate
    
    # Run migrations
    print_status "Running database migrations..."
    npx prisma migrate dev --name initial_setup
    
    cd ..
    print_success "Database setup completed"
}

# Function to create startup scripts
create_startup_scripts() {
    print_status "Creating startup scripts..."
    
    # Create start-backend.sh
    cat > start-backend.sh << 'EOF'
#!/bin/bash
echo "Starting EV Connect Backend..."
cd Backend
npm run dev
EOF
    chmod +x start-backend.sh
    
    # Create start-frontend.sh
    cat > start-frontend.sh << 'EOF'
#!/bin/bash
echo "Starting EV Connect Frontend..."
cd Frontend
npm run dev
EOF
    chmod +x start-frontend.sh
    
    # Create start-all.sh
    cat > start-all.sh << 'EOF'
#!/bin/bash
echo "Starting EV Connect - Full Stack Application..."

# Function to cleanup on exit
cleanup() {
    echo "Shutting down services..."
    kill $(jobs -p) 2>/dev/null
    exit
}

trap cleanup SIGINT SIGTERM

# Start backend in background
echo "Starting backend server..."
cd Backend && npm run dev &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Start frontend in background
echo "Starting frontend server..."
cd ../Frontend && npm run dev &
FRONTEND_PID=$!

echo "✅ EV Connect is running!"
echo "🔧 Backend: http://localhost:4000"
echo "🌐 Frontend: http://localhost:5173"
echo "📊 Database Studio: Run 'npm run studio' in Backend folder"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for background processes
wait
EOF
    chmod +x start-all.sh
    
    print_success "Startup scripts created successfully"
}

# Function to display final instructions
display_instructions() {
    echo ""
    echo "🎉 EV Charging Station Management System Setup Complete!"
    echo ""
    echo "📋 Next Steps:"
    echo "1. Configure your environment variables:"
    echo "   - Backend/.env (Database, Stripe, Cloudinary, Email)"
    echo "   - Frontend/.env (API URL, Stripe Public Key)"
    echo ""
    echo "2. Setup your database:"
    echo "   cd Backend && npm run migrate"
    echo ""
    echo "3. Start the application:"
    echo "   ./start-all.sh    # Start both backend and frontend"
    echo "   ./start-backend.sh # Start only backend"
    echo "   ./start-frontend.sh # Start only frontend"
    echo ""
    echo "🔗 Important URLs:"
    echo "   Backend API: http://localhost:4000"
    echo "   Frontend App: http://localhost:5173"
    echo "   Database Studio: http://localhost:5555 (run 'npm run studio' in Backend)"
    echo ""
    echo "📚 Documentation:"
    echo "   - README.md for detailed information"
    echo "   - SETUP.md for deployment instructions"
    echo "   - Backend/prisma/schema.prisma for database schema"
    echo ""
    echo "🆘 Need Help?"
    echo "   - Check the logs for any errors"
    echo "   - Ensure all environment variables are configured"
    echo "   - Make sure PostgreSQL is running"
    echo "   - Verify Node.js version is 18 or higher"
    echo ""
}

# Main setup function
main() {
    echo "🚀 EV Charging Station Management System - Setup Script"
    echo "======================================================"
    echo ""
    
    # Check prerequisites
    print_status "Checking prerequisites..."
    
    if ! check_node_version; then
        exit 1
    fi
    
    check_postgresql
    
    # Install dependencies
    install_dependencies
    
    # Setup environment files
    setup_environment
    
    # Create startup scripts
    create_startup_scripts
    
    # Setup database (optional, depends on configuration)
    setup_database
    
    # Display final instructions
    display_instructions
}

# Run main function
main "$@"