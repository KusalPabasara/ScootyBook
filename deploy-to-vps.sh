#!/bin/bash

# ScootyBook - Complete VPS Deployment Script
# This script automates the entire deployment process
# Run this on your VPS: bash deploy-to-vps.sh

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}🚀 ScootyBook VPS Deployment${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Step 1: Create directories
echo -e "${YELLOW}[1/10] Creating application directories...${NC}"
mkdir -p /apps/scootybook/{client/build,logs,config}
echo -e "${GREEN}✓ Directories created${NC}"

# Step 2: Install PM2 if not present
echo -e "${YELLOW}[2/10] Checking PM2...${NC}"
if ! command -v pm2 &> /dev/null; then
    echo "Installing PM2..."
    npm install -g pm2
    pm2 startup
fi
echo -e "${GREEN}✓ PM2 ready${NC}"

# Step 3: Create PM2 ecosystem config
echo -e "${YELLOW}[3/10] Creating PM2 configuration...${NC}"
cat > /apps/scootybook/ecosystem.config.js << 'EOF'
module.exports = {
  apps: [
    {
      name: 'scootybook',
      script: './server.js',
      env: {
        NODE_ENV: 'production',
        PORT: 5001
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
EOF
echo -e "${GREEN}✓ PM2 config created${NC}"

# Step 4: Create systemd service
echo -e "${YELLOW}[4/10] Creating systemd service...${NC}"
cat > /etc/systemd/system/scootybook.service << 'EOF'
[Unit]
Description=ScootyBook Node.js Application
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/apps/scootybook
ExecStart=/root/.nvm/versions/node/v18.*/bin/pm2 start ecosystem.config.js --no-daemon
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable scootybook
echo -e "${GREEN}✓ Systemd service created${NC}"

# Step 5: Setup Nginx
echo -e "${YELLOW}[5/10] Setting up Nginx configuration...${NC}"
curl -o /etc/nginx/sites-available/scootybook https://raw.githubusercontent.com/KusalPabasara/ScootyBook/main/nginx.conf
ln -sf /etc/nginx/sites-available/scootybook /etc/nginx/sites-enabled/scootybook

# Test nginx config
if nginx -t 2>&1 | grep -q "successful"; then
    echo -e "${GREEN}✓ Nginx configuration valid${NC}"
else
    echo -e "${RED}✗ Nginx configuration error${NC}"
    exit 1
fi

# Step 6: Generate SSL certificate
echo -e "${YELLOW}[6/10] Generating SSL certificate...${NC}"
if [ ! -d "/etc/letsencrypt/live/scootybook.kusalpabasara.me" ]; then
    apt-get update -qq
    apt-get install -y certbot python3-certbot-nginx -qq
    certbot certonly --nginx -d scootybook.kusalpabasara.me -d www.scootybook.kusalpabasara.me --non-interactive --agree-tos --email admin@kusalpabasara.me
    echo -e "${GREEN}✓ SSL certificate generated${NC}"
else
    echo -e "${GREEN}✓ SSL certificate already exists${NC}"
fi

# Restart Nginx
systemctl restart nginx
echo -e "${GREEN}✓ Nginx restarted${NC}"

# Step 7: Clone repository
echo -e "${YELLOW}[7/10] Cloning repository...${NC}"
cd /apps/scootybook
if [ -d "temp" ]; then
    rm -rf temp
fi
git clone https://github.com/KusalPabasara/ScootyBook.git temp
cp -r temp/* .
cp -r temp/.github .
rm -rf temp
echo -e "${GREEN}✓ Repository cloned${NC}"

# Step 8: Create .env file if not exists
echo -e "${YELLOW}[8/10] Setting up environment file...${NC}"
if [ ! -f ".env" ]; then
    JWT_SECRET=$(openssl rand -base64 32)
    SESSION_SECRET=$(openssl rand -base64 32)
    
    cat > .env << EOF
NODE_ENV=production
PORT=5001
MONGODB_URI=mongodb://localhost:27017/scootybook
JWT_SECRET=$JWT_SECRET
SESSION_SECRET=$SESSION_SECRET
CLIENT_URL=https://scootybook.kusalpabasara.me
REACT_APP_API_URL=https://scootybook.kusalpabasara.me/api
REACT_APP_GOOGLE_MAPS_API_KEY=AIzaSyBcXN9OTtI5plUcbX5Y4QucMrK3-0ftaSk
EOF
    echo -e "${GREEN}✓ .env file created with auto-generated secrets${NC}"
else
    echo -e "${GREEN}✓ .env file already exists${NC}"
fi

# Step 9: Install dependencies and build
echo -e "${YELLOW}[9/10] Installing dependencies and building...${NC}"
npm install --production
cd client
npm install
REACT_APP_API_URL=https://scootybook.kusalpabasara.me/api \
REACT_APP_GOOGLE_MAPS_API_KEY=AIzaSyBcXN9OTtI5plUcbX5Y4QucMrK3-0ftaSk \
npm run build
cd ..
echo -e "${GREEN}✓ Build completed${NC}"

# Step 10: Start application
echo -e "${YELLOW}[10/10] Starting application...${NC}"
pm2 delete scootybook 2>/dev/null || true
pm2 start ecosystem.config.js
pm2 save
systemctl start scootybook
echo -e "${GREEN}✓ Application started${NC}"

echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}✅ Deployment Complete!${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo -e "Application URL: ${GREEN}https://scootybook.kusalpabasara.me${NC}"
echo ""
echo "Verification commands:"
echo "  pm2 status"
echo "  pm2 logs scootybook --lines 20"
echo "  curl http://localhost:5001/health"
echo "  curl https://scootybook.kusalpabasara.me/health"
echo ""
echo -e "${YELLOW}Note: If MongoDB is not installed, install it first:${NC}"
echo "  wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -"
echo "  echo 'deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse' | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list"
echo "  sudo apt-get update && sudo apt-get install -y mongodb-org"
echo "  sudo systemctl start mongod && sudo systemctl enable mongod"
echo ""
