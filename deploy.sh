#!/bin/bash

# ScootyBook Deployment Script
# This script deploys the application to the VPS

set -e

# Configuration
DOMAIN="scootybook.kusalpabasara.me"
VPS_IP="152.42.185.253"
APP_NAME="scootybook"
APP_DIR="/apps/scootybook"
PORT=5001
NODE_ENV="production"

echo "========================================="
echo "🚀 ScootyBook Deployment Setup"
echo "========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print status
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# Step 1: Create app directory structure on VPS
print_warning "Step 1: Creating app directory structure..."
ssh root@$VPS_IP "mkdir -p $APP_DIR/config $APP_DIR/logs $APP_DIR/certs" || print_error "Failed to create directories"
print_status "Directory structure created"

# Step 2: Copy files to VPS
print_warning "Step 2: Uploading files to VPS..."
scp -r server.js package.json root@$VPS_IP:$APP_DIR/ || print_error "Failed to upload root files"
scp -r middleware root@$VPS_IP:$APP_DIR/ || print_error "Failed to upload middleware"
scp -r models root@$VPS_IP:$APP_DIR/ || print_error "Failed to upload models"
scp -r routes root@$VPS_IP:$APP_DIR/ || print_error "Failed to upload routes"
scp -r services root@$VPS_IP:$APP_DIR/ || print_error "Failed to upload services"
scp -r client/build root@$VPS_IP:$APP_DIR/client/ || print_error "Failed to upload client build"
print_status "Files uploaded to VPS"

# Step 3: Install dependencies on VPS
print_warning "Step 3: Installing dependencies on VPS..."
ssh root@$VPS_IP "cd $APP_DIR && npm install --production" || print_error "Failed to install dependencies"
print_status "Dependencies installed"

# Step 4: Create environment file
print_warning "Step 4: Setting up environment variables..."
ssh root@$VPS_IP "cat > $APP_DIR/.env << 'EOF'
NODE_ENV=production
PORT=$PORT
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
SMTP_HOST=your_smtp_host
SMTP_PORT=your_smtp_port
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_pass
GOOGLE_MAPS_API_KEY=your_google_maps_key
GOOGLE_OAUTH_CLIENT_ID=your_google_client_id
GOOGLE_OAUTH_CLIENT_SECRET=your_google_client_secret
REACT_APP_API_URL=https://$DOMAIN/api
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_key
EOF"
print_status "Environment file created - UPDATE WITH ACTUAL VALUES"
print_warning "⚠ Remember to edit .env file with actual credentials on VPS"

# Step 5: Create PM2 ecosystem file
print_warning "Step 5: Creating PM2 configuration..."
ssh root@$VPS_IP "cat > $APP_DIR/ecosystem.config.js << 'EOF'
module.exports = {
  apps: [
    {
      name: '$APP_NAME',
      script: './server.js',
      env: {
        NODE_ENV: 'production',
        PORT: $PORT
      },
      instances: 'max',
      exec_mode: 'cluster',
      error_file: './logs/error.log',
      out_file: './logs/out.log',
      merge_logs: true,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G'
    }
  ]
};
EOF"
print_status "PM2 ecosystem file created"

# Step 6: Setup systemd service for PM2
print_warning "Step 6: Setting up systemd service..."
ssh root@$VPS_IP "cat > /etc/systemd/system/scootybook.service << 'EOF'
[Unit]
Description=ScootyBook Application
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=$APP_DIR
Environment=\"PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/local/nvm/versions/node/v18.0.0/bin\"
ExecStart=/usr/local/bin/pm2 start ecosystem.config.js --no-daemon
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF"

ssh root@$VPS_IP "systemctl daemon-reload && systemctl enable scootybook" || print_error "Failed to setup systemd"
print_status "Systemd service created"

echo ""
echo "========================================="
echo "📋 Next Steps:"
echo "========================================="
echo "1. SSH into VPS: ssh root@$VPS_IP"
echo "2. Edit environment file: nano $APP_DIR/.env"
echo "3. Start the app: systemctl start scootybook"
echo "4. Check status: systemctl status scootybook"
echo "5. View logs: pm2 logs scootybook"
echo ""
echo "========================================="
echo "🌐 Nginx Configuration:"
echo "========================================="
echo "An Nginx config template will be provided separately"
echo ""
echo "========================================="
