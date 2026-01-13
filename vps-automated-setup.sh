#!/bin/bash

# ═══════════════════════════════════════════════════════════════════════════
# ScootyBook VPS - Complete Automated Setup Script
# Run this script on your VPS after SSHing in
# ═══════════════════════════════════════════════════════════════════════════

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}════════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}   ScootyBook - Automated VPS Deployment${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════════${NC}"
echo ""

# Step 1: Create directories
echo -e "${YELLOW}[1/9] Creating directories...${NC}"
mkdir -p /apps/scootybook/{client/build,logs,config}
echo -e "${GREEN}✓ Directories created${NC}"
echo ""

# Step 2: Create .env file
echo -e "${YELLOW}[2/9] Creating environment file...${NC}"
cat > /apps/scootybook/.env << 'ENVEOF'
NODE_ENV=production
PORT=5001
MONGODB_URI=mongodb://localhost:27017/scootybook
JWT_SECRET=scootybook_super_secret_key_change_this_in_production_min_32_characters
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
GOOGLE_MAPS_API_KEY=AIzaSyBcXN9OTtI5plUcbX5Y4QucMrK3-0ftaSk
GOOGLE_OAUTH_CLIENT_ID=your_google_client_id
GOOGLE_OAUTH_CLIENT_SECRET=your_google_client_secret
REACT_APP_API_URL=https://scootybook.kusalpabasara.me/api
REACT_APP_GOOGLE_MAPS_API_KEY=AIzaSyBcXN9OTtI5plUcbX5Y4QucMrK3-0ftaSk
ENVEOF
echo -e "${GREEN}✓ Environment file created${NC}"
echo -e "${RED}⚠ IMPORTANT: Edit /apps/scootybook/.env with real credentials after this script!${NC}"
echo ""

# Step 3: Create PM2 ecosystem config
echo -e "${YELLOW}[3/9] Creating PM2 configuration...${NC}"
cat > /apps/scootybook/ecosystem.config.js << 'ECOEOF'
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
ECOEOF
echo -e "${GREEN}✓ PM2 configuration created${NC}"
echo ""

# Step 4: Install PM2 globally if not present
echo -e "${YELLOW}[4/9] Checking PM2...${NC}"
if ! command -v pm2 &> /dev/null; then
    echo "Installing PM2..."
    npm install -g pm2
    pm2 startup
    echo -e "${GREEN}✓ PM2 installed${NC}"
else
    echo -e "${GREEN}✓ PM2 already installed${NC}"
fi
echo ""

# Step 5: Setup Nginx
echo -e "${YELLOW}[5/9] Setting up Nginx configuration...${NC}"
curl -o /etc/nginx/sites-available/scootybook https://raw.githubusercontent.com/KusalPabasara/ScootyBook/main/nginx.conf
ln -sf /etc/nginx/sites-available/scootybook /etc/nginx/sites-enabled/scootybook
echo -e "${GREEN}✓ Nginx configuration installed${NC}"
echo ""

# Step 6: Test Nginx
echo -e "${YELLOW}[6/9] Testing Nginx configuration...${NC}"
if nginx -t; then
    systemctl restart nginx
    echo -e "${GREEN}✓ Nginx restarted successfully${NC}"
else
    echo -e "${RED}✗ Nginx configuration test failed${NC}"
    exit 1
fi
echo ""

# Step 7: SSL Certificate
echo -e "${YELLOW}[7/9] Setting up SSL certificate...${NC}"
if [ ! -d "/etc/letsencrypt/live/scootybook.kusalpabasara.me" ]; then
    echo "Installing certbot..."
    apt-get update -qq
    apt-get install -y certbot python3-certbot-nginx
    echo ""
    echo "Generating SSL certificate..."
    certbot certonly --nginx -d scootybook.kusalpabasara.me -d www.scootybook.kusalpabasara.me --non-interactive --agree-tos --email admin@kusalpabasara.me || {
        echo -e "${YELLOW}⚠ SSL generation failed. You may need to run it manually after DNS propagates${NC}"
        echo "Run: certbot certonly --nginx -d scootybook.kusalpabasara.me"
    }
    systemctl restart nginx
    echo -e "${GREEN}✓ SSL setup attempted${NC}"
else
    echo -e "${GREEN}✓ SSL certificate already exists${NC}"
fi
echo ""

# Step 8: Deploy application
echo -e "${YELLOW}[8/9] Deploying application...${NC}"
cd /apps/scootybook

if [ -d "temp" ]; then
    rm -rf temp
fi

echo "Cloning repository..."
git clone https://github.com/KusalPabasara/ScootyBook.git temp

echo "Copying files..."
cp -r temp/* .
cp -r temp/.github . 2>/dev/null || true
rm -rf temp

echo "Installing backend dependencies..."
npm install --production

echo "Installing frontend dependencies..."
cd client
npm install

echo "Building frontend..."
REACT_APP_API_URL=https://scootybook.kusalpabasara.me/api REACT_APP_GOOGLE_MAPS_API_KEY=AIzaSyBcXN9OTtI5plUcbX5Y4QucMrK3-0ftaSk npm run build

cd ..
echo -e "${GREEN}✓ Application deployed${NC}"
echo ""

# Step 9: Start application
echo -e "${YELLOW}[9/9] Starting application...${NC}"
pm2 delete scootybook 2>/dev/null || true
pm2 start ecosystem.config.js
pm2 save

# Create systemd service
cat > /etc/systemd/system/scootybook.service << 'SYSEOF'
[Unit]
Description=ScootyBook Node.js Application
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/apps/scootybook
ExecStart=/usr/bin/pm2 start ecosystem.config.js --no-daemon
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
SYSEOF

systemctl daemon-reload
systemctl enable scootybook
systemctl start scootybook

echo -e "${GREEN}✓ Application started${NC}"
echo ""

# Final status
echo -e "${BLUE}════════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✓ DEPLOYMENT COMPLETE!${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════════${NC}"
echo ""

echo -e "${YELLOW}Application Status:${NC}"
pm2 status

echo ""
echo -e "${YELLOW}Testing local connection:${NC}"
sleep 3
curl -s http://localhost:5001/health && echo -e "${GREEN}✓ Local health check passed${NC}" || echo -e "${RED}✗ Local health check failed${NC}"

echo ""
echo -e "${BLUE}════════════════════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}IMPORTANT NEXT STEPS:${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════════${NC}"
echo ""
echo "1. Edit environment file with real credentials:"
echo "   ${GREEN}nano /apps/scootybook/.env${NC}"
echo ""
echo "2. After editing .env, restart the application:"
echo "   ${GREEN}pm2 restart scootybook${NC}"
echo ""
echo "3. Wait 5-10 minutes for DNS propagation, then test:"
echo "   ${GREEN}curl https://scootybook.kusalpabasara.me/health${NC}"
echo ""
echo "4. Visit in browser:"
echo "   ${GREEN}https://scootybook.kusalpabasara.me${NC}"
echo ""
echo -e "${BLUE}════════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}Logs:${NC}"
echo "   View logs: ${YELLOW}pm2 logs scootybook${NC}"
echo "   Nginx logs: ${YELLOW}tail -f /var/log/nginx/scootybook_error.log${NC}"
echo ""
echo -e "${BLUE}════════════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${GREEN}🎉 Your site will be live at: https://scootybook.kusalpabasara.me${NC}"
echo ""
