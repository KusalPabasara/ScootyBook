# 🚀 Quick Reference - ScootyBook Deployment

## 📋 Phase 1: Deploy Application (30 mins)

```bash
# Connect to VPS
ssh root@152.42.185.253

# Run quick setup
cd /apps/scootybook
bash quick-setup.sh

# Edit environment variables
nano .env
# Update: MONGODB_URI, JWT_SECRET, SMTP_, GOOGLE_*

# Copy your backend files
# (Get from your developer)
# Should be in: /apps/scootybook/

# Install dependencies
npm install --production

# Start application
pm2 start ecosystem.config.js
pm2 save
```

---

## 🌐 Phase 2: Setup Nginx (15 mins)

```bash
# Copy Nginx config
cp nginx.conf /etc/nginx/sites-available/scootybook
ln -s /etc/nginx/sites-available/scootybook /etc/nginx/sites-enabled/scootybook

# Test config
nginx -t

# Restart Nginx
systemctl restart nginx
systemctl status nginx
```

---

## 🔒 Phase 3: SSL Certificate (10 mins)

```bash
# Generate certificate
certbot certonly --nginx \
  -d scootybook.kusalpabasara.me \
  -d www.scootybook.kusalpabasara.me

# Setup auto-renewal
certbot renew --dry-run
```

---

## 🌐 Phase 4: Add DNS Record

**In your registrar (Namecheap, GoDaddy, etc.):**

```
Type:     A Record
Name:     scootybook
Value:    152.42.185.253
TTL:      3600
```

⏱️ Wait 5-30 minutes for propagation

---

## ✅ Phase 5: Verification

```bash
# Check DNS
nslookup scootybook.kusalpabasara.me

# Test locally (before DNS is live)
curl http://localhost:5001/health

# After DNS propagates
curl https://scootybook.kusalpabasara.me
curl https://scootybook.kusalpabasara.me/health

# Visit in browser
https://scootybook.kusalpabasara.me
```

---

## ⚙️ GitHub Actions Setup

1. Go to GitHub: **Repository → Settings → Secrets → New secret**

2. Add secrets:
   - **Name:** `VPS_SSH_KEY`
     - **Value:** Your SSH private key (full content with BEGIN/END)
   
   - **Name:** `GOOGLE_MAPS_API_KEY`
     - **Value:** Your Google Maps API key

3. Test deployment:
   ```bash
   git push origin main
   # Go to GitHub → Actions to watch deployment
   ```

---

## 📊 Monitoring Commands

```bash
# SSH into VPS
ssh root@152.42.185.253

# Application status
pm2 status
pm2 logs scootybook          # View logs
pm2 logs scootybook --err    # Error logs only
pm2 monit                     # Real-time monitoring

# Nginx status
systemctl status nginx
tail -f /var/log/nginx/scootybook_access.log
tail -f /var/log/nginx/scootybook_error.log

# Check what's running on port 5001
ss -tlnp | grep 5001

# Restart if needed
systemctl restart scootybook
systemctl restart nginx
```

---

## 🔧 Common Tasks

### Restart Application
```bash
pm2 restart scootybook
```

### View Environment Variables
```bash
cat /apps/scootybook/.env
```

### Update Application (Manual)
```bash
cd /apps/scootybook
git pull origin main
npm install --production
pm2 restart scootybook
```

### Update Application (Auto - via GitHub)
```bash
# Just push to GitHub - everything is automatic!
git push origin main
# GitHub Actions handles the rest
```

### Check SSL Certificate Status
```bash
certbot certificates
echo | openssl s_client -servername scootybook.kusalpabasara.me -connect scootybook.kusalpabasara.me:443
```

### View Application Logs
```bash
# Last 50 lines
pm2 logs scootybook --lines 50

# Real-time
pm2 logs scootybook --follow

# Errors only
pm2 logs scootybook --err

# Last 24 hours
pm2 logs scootybook --lines 500
```

---

## 🚨 Troubleshooting

### App Not Running
```bash
pm2 status
pm2 logs scootybook --lines 20
# Check .env file has correct values
```

### Nginx Error
```bash
systemctl status nginx
nginx -t  # Check config
tail -f /var/log/nginx/scootybook_error.log
```

### DNS Not Working
```bash
# Wait 15-30 minutes, then test
nslookup scootybook.kusalpabasara.me
dig scootybook.kusalpabasara.me @8.8.8.8
```

### SSL Certificate Issues
```bash
certbot certificates
# Check if certificate is valid
# Path should match in nginx.conf
```

### CI/CD Deployment Fails
```bash
# Check GitHub Actions logs
# Verify SSH key is set correctly
# Check if all secrets are added
# View VPS logs: pm2 logs scootybook
```

---

## 📱 Testing Endpoints

```bash
# Health check
curl https://scootybook.kusalpabasara.me/health

# Get all scooters
curl https://scootybook.kusalpabasara.me/api/scooties

# Get single scooter
curl https://scootybook.kusalpabasara.me/api/scooties/{id}

# Login endpoint
curl -X POST https://scootybook.kusalpabasara.me/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}'
```

---

## 📈 File Locations on VPS

```
/apps/scootybook/
├─ server.js                      # Main backend file
├─ package.json                   # Dependencies
├─ .env                           # Environment variables
├─ ecosystem.config.js            # PM2 config
├─ logs/
│  ├─ error.log                  # PM2 errors
│  └─ out.log                    # PM2 output
├─ client/
│  └─ build/                     # React production build
├─ models/                        # Database models
├─ routes/                        # API routes
├─ services/                      # Business logic
└─ middleware/                    # Express middleware

/etc/nginx/
├─ sites-available/scootybook     # Nginx config (source)
├─ sites-enabled/scootybook       # Nginx config (symlink)
└─ conf.d/                        # Global configs

/etc/letsencrypt/
└─ live/scootybook.kusalpabasara.me/
   ├─ fullchain.pem              # SSL certificate
   └─ privkey.pem                # SSL private key

/etc/systemd/system/
└─ scootybook.service            # Systemd service
```

---

## 📋 Pre-Deployment Checklist

- [ ] Backend files ready
- [ ] .env file with real credentials
- [ ] Database (MongoDB) accessible
- [ ] Node.js 18+ installed on VPS
- [ ] PM2 installed globally
- [ ] Nginx installed and working
- [ ] Port 5001 available
- [ ] SSH key added to GitHub Secrets
- [ ] Google Maps API key ready
- [ ] DNS registrar access ready
- [ ] SSL certificate path correct in nginx.conf

---

## ⏱️ Estimated Timeline

```
Hour 1:
├─ VPS Setup: 20 mins
├─ Deploy Backend: 15 mins
└─ Nginx Setup: 10 mins

Hour 2:
├─ SSL Certificate: 10 mins
├─ DNS Setup: Immediate
├─ Wait for DNS: 15-20 mins
└─ Verification: 10-15 mins

Hour 3:
├─ GitHub Actions: 5 mins
└─ Final Testing: 55 mins

Total: ~2 hours to full deployment
```

---

## 🎯 Success Indicators

✅ `pm2 status` shows app running  
✅ `systemctl status nginx` shows active  
✅ `curl http://localhost:5001/health` returns 200  
✅ `nslookup scootybook.kusalpabasara.me` resolves to 152.42.185.253  
✅ Browser: `https://scootybook.kusalpabasara.me` loads without warnings  
✅ API: `https://scootybook.kusalpabasara.me/api/scooties` returns data  
✅ Logs: No errors in `pm2 logs scootybook`  
✅ SSL: Certificate shows valid (not expired)  

---

## 📚 Full Documentation

- **DEPLOYMENT_GUIDE.md** - Complete step-by-step guide
- **DNS_AND_TESTING_GUIDE.md** - DNS setup and testing
- **IMPLEMENTATION_SUMMARY.md** - What's included
- **nginx.conf** - Nginx configuration
- **ecosystem.config.js** - PM2 configuration

---

## 🆘 Emergency Commands

```bash
# Stop application
pm2 stop scootybook

# Restart application
pm2 restart scootybook

# Full stop and start
pm2 delete scootybook
pm2 start ecosystem.config.js

# Reload Nginx (no downtime)
systemctl reload nginx

# Restart Nginx (brief downtime)
systemctl restart nginx

# View real-time CPU/Memory
pm2 monit

# Kill everything and start fresh
pm2 kill
systemctl start scootybook
```

---

## ✨ That's it!

Your ScootyBook application is now:
- ✅ Live at `https://scootybook.kusalpabasara.me`
- ✅ Auto-deployed via GitHub Actions
- ✅ Running on production VPS
- ✅ Secured with SSL
- ✅ Behind Nginx reverse proxy
- ✅ Managed with PM2

**Happy deploying! 🎉**

