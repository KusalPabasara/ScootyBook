#!/bin/bash

# ScootyBook - Quick VPS Setup Script
# Run this script on your VPS to quickly set everything up

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${YELLOW}========================================${NC}"
echo -e "${YELLOW}🚀 ScootyBook Quick Setup${NC}"
echo -e "${YELLOW}========================================${NC}"

# Step 1: Create directories
echo -e "${YELLOW}[1/8] Creating directories...${NC}"
mkdir -p /apps/scootybook/{client/build,logs,config}
echo -e "${GREEN}✓ Directories created${NC}"

# Step 2: Create .env file
echo -e "${YELLOW}[2/8] Creating .env file...${NC}"
if [ ! -f /apps/scootybook/.env ]; then
    cat > /apps/scootybook/.env << 'EOF'
NODE_ENV=production
PORT=5001
MONGODB_URI=mongodb://localhost:27017/scootybook
JWT_SECRET=your_strong_secret_key_here_min_32_chars
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
GOOGLE_MAPS_API_KEY=your_google_maps_key
GOOGLE_OAUTH_CLIENT_ID=your_google_client_id
GOOGLE_OAUTH_CLIENT_SECRET=your_google_client_secret
REACT_APP_API_URL=https://scootybook.kusalpabasara.me/api
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_key
EOF
    echo -e "${GREEN}✓ .env file created${NC}"
    echo -e "${RED}⚠ UPDATE .env with real credentials!${NC}"
else
    echo -e "${YELLOW}⚠ .env already exists, skipping${NC}"
fi

# Step 3: Create PM2 ecosystem config
echo -e "${YELLOW}[3/8] Creating PM2 ecosystem config...${NC}"
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
echo -e "${YELLOW}[4/8] Creating systemd service...${NC}"
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
echo -e "${YELLOW}[5/8] Setting up Nginx...${NC}"
if [ -f /etc/nginx/sites-available/scootybook ]; then
    echo -e "${GREEN}✓ Nginx config already exists${NC}"
else
    echo -e "${YELLOW}⚠ Copy nginx.conf to /etc/nginx/sites-available/scootybook manually${NC}"
fi

# Step 6: Check Node.js
echo -e "${YELLOW}[6/8] Checking Node.js...${NC}"
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo -e "${GREEN}✓ Node.js $NODE_VERSION installed${NC}"
else
    echo -e "${RED}✗ Node.js not found. Please install Node.js 18+${NC}"
    exit 1
fi

# Step 7: Check PM2
echo -e "${YELLOW}[7/8] Checking PM2...${NC}"
if command -v pm2 &> /dev/null; then
    echo -e "${GREEN}✓ PM2 installed${NC}"
else
    echo -e "${YELLOW}Installing PM2...${NC}"
    npm install -g pm2
    pm2 startup
    echo -e "${GREEN}✓ PM2 installed and configured${NC}"
fi

# Step 8: Summary
echo -e "${YELLOW}[8/8] Setup complete!${NC}"

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}✓ Setup Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "Next steps:"
echo "1. Edit .env file with real credentials:"
echo "   nano /apps/scootybook/.env"
echo ""
echo "2. Copy nginx config:"
echo "   cp nginx.conf /etc/nginx/sites-available/scootybook"
echo "   ln -s /etc/nginx/sites-available/scootybook /etc/nginx/sites-enabled/scootybook"
echo ""
echo "3. Setup SSL certificate:"
echo "   certbot certonly --nginx -d scootybook.kusalpabasara.me"
echo ""
echo "4. Start the app:"
echo "   systemctl start scootybook"
echo ""
echo "5. Restart Nginx:"
echo "   systemctl restart nginx"
echo ""
echo "6. Check status:"
echo "   systemctl status scootybook"
echo "   pm2 logs scootybook"
echo ""
echo "For detailed instructions, see DEPLOYMENT_GUIDE.md"
