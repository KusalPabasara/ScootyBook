# 🚀 ScootyBook Deployment Guide

## Overview
This guide walks you through deploying the ScootyBook application to your VPS (152.42.185.253) with automatic CI/CD using GitHub Actions.

---

## Prerequisites

✅ **VPS Access:**
- IP: `152.42.185.253`
- SSH key for root access
- Existing Nginx installation (for other projects)
- Node.js 18+ installed
- MongoDB configured

✅ **Domain:**
- Domain: `scootybook.kusalpabasara.me`
- DNS control to add subdomain records

✅ **GitHub:**
- Repository with GitHub Actions enabled
- Secrets configured (see below)

---

## Part 1: VPS Preparation (One-time Setup)

### 1.1 Connect to VPS
```bash
ssh root@152.42.185.253
```

### 1.2 Create Application Directory
```bash
mkdir -p /apps/scootybook/{client,logs,config}
mkdir -p /apps/scootybook/client/build
cd /apps/scootybook
```

### 1.3 Install Node.js (if not already installed)
```bash
# Install NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc

# Install Node.js 18
nvm install 18
nvm use 18
nvm alias default 18
```

### 1.4 Install PM2 (Process Manager)
```bash
npm install -g pm2
pm2 startup
pm2 save
```

### 1.5 Check Existing Nginx Projects
```bash
ls -la /etc/nginx/sites-enabled/
```
Should show your existing projects (kusalpabasara.me, lupido.kusalpabasara.me, etc.)

### 1.6 Create Environment File
```bash
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
```

**⚠️ Important:** Replace all `your_*` values with actual credentials.

### 1.7 Create PM2 Ecosystem File
```bash
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
      max_memory_restart: '1G',
      env_production: {
        NODE_ENV: 'production'
      }
    }
  ]
};
EOF
```

### 1.8 Create Systemd Service
```bash
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

# Enable and start the service
systemctl daemon-reload
systemctl enable scootybook
systemctl start scootybook

# Check status
systemctl status scootybook
```

---

## Part 2: Nginx Configuration

### 2.1 Copy Nginx Configuration
```bash
cp nginx.conf /etc/nginx/sites-available/scootybook
ln -s /etc/nginx/sites-available/scootybook /etc/nginx/sites-enabled/scootybook
```

### 2.2 Test Nginx Configuration
```bash
nginx -t
```

### 2.3 Restart Nginx
```bash
systemctl restart nginx
```

### 2.4 Verify Nginx is Running
```bash
systemctl status nginx
curl http://localhost
```

---

## Part 3: SSL Certificate (Let's Encrypt)

### 3.1 Install Certbot
```bash
apt-get update
apt-get install -y certbot python3-certbot-nginx
```

### 3.2 Generate SSL Certificate
```bash
certbot certonly --nginx -d scootybook.kusalpabasara.me -d www.scootybook.kusalpabasara.me
```

### 3.3 Auto-renewal Setup
```bash
# Test renewal
certbot renew --dry-run

# Add to crontab (runs daily)
(crontab -l 2>/dev/null; echo "0 3 * * * certbot renew --quiet && systemctl reload nginx") | crontab -
```

---

## Part 4: DNS Configuration

### ⏰ **DO THIS AFTER NGINX IS CONFIGURED**

#### Add DNS Record for scootybook.kusalpabasara.me

Go to your domain registrar (Namecheap, GoDaddy, etc.) and add:

**Type:** A Record  
**Name:** scootybook  
**Value:** 152.42.185.253  
**TTL:** 3600 (or default)

**OR if using subdomain:**

**Type:** CNAME Record  
**Name:** scootybook  
**Value:** kusalpabasara.me  
**TTL:** 3600

### Verify DNS Propagation
```bash
# Wait 5-10 minutes, then test
nslookup scootybook.kusalpabasara.me
dig scootybook.kusalpabasara.me

# Should resolve to 152.42.185.253
```

---

## Part 5: GitHub Actions Setup

### 5.1 Add GitHub Secrets

Go to GitHub Repository → Settings → Secrets and variables → Actions

Add these secrets:

| Secret Name | Value |
|---|---|
| `VPS_SSH_KEY` | Your SSH private key (without passphrase) |
| `GOOGLE_MAPS_API_KEY` | Your Google Maps API key |

**How to get SSH key:**
```bash
# On your local machine
cat ~/.ssh/id_rsa
# Copy the entire output (including BEGIN/END lines)
```

### 5.2 Create SSH Key on VPS (if needed)
```bash
ssh-keygen -t rsa -b 4096 -f /root/.ssh/id_rsa -N ""
cat /root/.ssh/id_rsa.pub >> /root/.ssh/authorized_keys
chmod 600 /root/.ssh/id_rsa
```

---

## Part 6: First Deployment

### 6.1 Manual First Deploy
```bash
# Clone repository on VPS
cd /tmp
git clone https://github.com/your-username/scootybook.git
cd scootybook

# Build client
cd client
npm install
npm run build

# Go back to root
cd ..

# Copy files
cp server.js package.json /apps/scootybook/
cp -r middleware models routes services /apps/scootybook/
cp -r client/build /apps/scootybook/client/

# Install backend dependencies
cd /apps/scootybook
npm install --production

# Start the app
pm2 start ecosystem.config.js
pm2 save
```

### 6.2 Verify Application is Running
```bash
# Check PM2 status
pm2 status
pm2 logs scootybook

# Check port 5001
ss -tlnp | grep 5001

# Health check
curl http://localhost:5001/health
```

---

## Part 7: Testing

### 7.1 HTTP Test (before DNS)
```bash
# Test with IP directly
curl http://152.42.185.253 -H "Host: scootybook.kusalpabasara.me"
```

### 7.2 HTTPS Test (after SSL setup)
```bash
# After DNS is configured and SSL is ready
curl https://scootybook.kusalpabasara.me
```

### 7.3 API Test
```bash
# Test backend API
curl https://scootybook.kusalpabasara.me/api/scooties

# Test health endpoint
curl https://scootybook.kusalpabasara.me/health
```

### 7.4 Full Browser Test
1. Wait 5-10 minutes after DNS setup
2. Visit `https://scootybook.kusalpabasara.me` in browser
3. Check Console for any errors
4. Test booking functionality

---

## Part 8: Automated CI/CD Deployment

### 8.1 Push to GitHub
```bash
git add .
git commit -m "Deploy: Set up CI/CD workflow"
git push origin main
```

### 8.2 GitHub Actions Workflow
- Workflow triggers automatically on push to `main` branch
- Builds Node.js backend
- Builds React frontend
- Deploys to VPS via SSH
- Restarts PM2 and Nginx
- Runs health check

**View workflow:**
- GitHub Repository → Actions tab
- Check build status and deployment logs

---

## Part 9: Monitoring & Maintenance

### 9.1 Check Application Status
```bash
# SSH into VPS
ssh root@152.42.185.253

# Check PM2 status
pm2 status
pm2 monit  # Real-time monitoring

# View logs
pm2 logs scootybook
pm2 logs scootybook --lines 50
pm2 logs scootybook --err  # Error logs only
```

### 9.2 Check Nginx Status
```bash
systemctl status nginx
tail -f /var/log/nginx/scootybook_access.log
tail -f /var/log/nginx/scootybook_error.log
```

### 9.3 Monitor Port Conflicts
```bash
# Check what's using port 5001
ss -tlnp | grep 5001

# Check if 3000+ ports are available
netstat -tulpn | grep LISTEN
```

### 9.4 Restart Application
```bash
# Restart PM2 app
pm2 restart scootybook

# Reload Nginx (without dropping connections)
systemctl reload nginx

# Full restart
systemctl restart scootybook
```

---

## Part 10: Troubleshooting

### Issue: Application not accessible
```bash
# Check if app is running
pm2 status

# Check if Nginx is running
systemctl status nginx

# Check logs
pm2 logs scootybook --lines 100
tail -f /var/log/nginx/scootybook_error.log

# Test local connection
curl http://localhost:5001/health
```

### Issue: DNS not resolving
```bash
# Clear DNS cache
systemctl restart systemd-resolved

# Test DNS
nslookup scootybook.kusalpabasara.me
dig scootybook.kusalpabasara.me @8.8.8.8

# Wait 15-30 minutes for full propagation
```

### Issue: SSL Certificate errors
```bash
# Check certificate status
certbot certificates

# Renew certificate manually
certbot renew --force-renewal

# Restart Nginx
systemctl restart nginx
```

### Issue: Build fails in CI/CD
```bash
# Check GitHub Actions logs
# GitHub Repository → Actions → Latest workflow run

# Check if secrets are set
# GitHub Repository → Settings → Secrets

# Re-run workflow
# GitHub Actions → Select workflow → Re-run jobs
```

---

## Part 11: Update Process

### After Making Code Changes:

```bash
# 1. Commit and push to GitHub
git add .
git commit -m "Update: Your changes"
git push origin main

# 2. GitHub Actions automatically:
#    - Builds the application
#    - Deploys to VPS
#    - Restarts the app
#    - Runs health check

# 3. Monitor the deployment
# Visit GitHub Actions to see real-time progress

# 4. Verify on live site
# Visit https://scootybook.kusalpabasara.me
```

### Manual Update (if needed):
```bash
ssh root@152.42.185.253

cd /apps/scootybook
git pull origin main
npm install
npm run build --prefix client
pm2 restart scootybook
```

---

## Quick Reference Commands

```bash
# Connect to VPS
ssh root@152.42.185.253

# Navigate to app
cd /apps/scootybook

# View app logs
pm2 logs scootybook

# Restart app
pm2 restart scootybook

# Check Nginx
systemctl status nginx

# Check certificate
certbot certificates

# View environment
cat .env

# Check disk usage
du -sh /apps/scootybook

# Check running ports
ss -tlnp

# Full system restart
systemctl restart scootybook
systemctl restart nginx
```

---

## Summary Checklist

- [ ] VPS directories created
- [ ] Node.js 18+ installed
- [ ] PM2 installed and configured
- [ ] Environment file (.env) created with real credentials
- [ ] Systemd service created and started
- [ ] Nginx configuration installed
- [ ] SSL certificate generated
- [ ] DNS record added (scootybook.kusalpabasara.me)
- [ ] GitHub Secrets configured
- [ ] First manual deployment completed
- [ ] Application accessible at https://scootybook.kusalpabasara.me
- [ ] CI/CD workflow tested with git push
- [ ] Monitoring and logs verified

---

## Support

For issues or questions:
1. Check PM2 and Nginx logs
2. Verify DNS with `nslookup` or `dig`
3. Test API with `curl`
4. Check GitHub Actions for build errors
5. Review VPS system resources

