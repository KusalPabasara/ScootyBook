# 🚀 ScootyBook Deployment Checklist

## Pre-Deployment Verification

- [ ] DNS record configured (scootybook.kusalpabasara.me → 152.42.185.253)
- [ ] GitHub repository accessible
- [ ] GitHub Secrets configured (VPS_SSH_KEY, GOOGLE_MAPS_API_KEY)
- [ ] VPS accessible via SSH: `ssh root@152.42.185.253`
- [ ] MongoDB installed and running on VPS

---

## Phase 1: VPS Initial Setup (15 minutes)

### Step 1: Connect to VPS
```bash
ssh root@152.42.185.253
```

### Step 2: Run Quick Setup Script
```bash
curl -o /tmp/quick-setup.sh https://raw.githubusercontent.com/KusalPabasara/ScootyBook/main/quick-setup.sh
chmod +x /tmp/quick-setup.sh
bash /tmp/quick-setup.sh
```

**Expected Output**: ✓ Setup Complete! with 8 successful steps

**Checklist**:
- [ ] Directories created at /apps/scootybook
- [ ] .env file created
- [ ] PM2 ecosystem config created
- [ ] Systemd service created
- [ ] Node.js detected
- [ ] PM2 installed

---

## Phase 2: Environment Configuration (10 minutes)

### Step 1: Generate Security Secrets
```bash
# Generate JWT_SECRET
JWT_SECRET=$(openssl rand -base64 32)
echo "JWT_SECRET=$JWT_SECRET"

# Generate SESSION_SECRET
SESSION_SECRET=$(openssl rand -base64 32)
echo "SESSION_SECRET=$SESSION_SECRET"

# Save these values - you'll need them in the next step
```

### Step 2: Edit Environment File
```bash
nano /apps/scootybook/.env
```

**Update these values**:
- `MONGODB_URI` → Your MongoDB connection string (e.g., `mongodb://localhost:27017/scootybook`)
- `JWT_SECRET` → Paste the generated JWT_SECRET from above
- `SESSION_SECRET` → Paste the generated SESSION_SECRET from above

**Keep these as-is**:
- `NODE_ENV=production`
- `PORT=5001`
- `CLIENT_URL=https://scootybook.kusalpabasara.me`
- `REACT_APP_API_URL=https://scootybook.kusalpabasara.me/api`
- `REACT_APP_GOOGLE_MAPS_API_KEY=AIzaSyBcXN9OTtI5plUcbX5Y4QucMrK3-0ftaSk`

**Comment out or remove** (not needed for initial deployment):
- All EMAIL_* variables
- All TWILIO_* and SMS_* variables
- All GOOGLE_CLIENT_* and FACEBOOK_* OAuth variables

Save and exit (Ctrl+X, Y, Enter)

**Checklist**:
- [ ] JWT_SECRET updated with strong random value
- [ ] SESSION_SECRET updated with strong random value
- [ ] MONGODB_URI configured correctly
- [ ] Optional services commented out

---

## Phase 3: Nginx & SSL Setup (15 minutes)

### Step 1: Copy Nginx Configuration
```bash
curl -o /etc/nginx/sites-available/scootybook https://raw.githubusercontent.com/KusalPabasara/ScootyBook/main/nginx.conf
ln -s /etc/nginx/sites-available/scootybook /etc/nginx/sites-enabled/scootybook
```

### Step 2: Test Nginx Configuration
```bash
nginx -t
```

**Expected Output**: 
```
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
```

**Checklist**:
- [ ] Nginx config test passed

### Step 3: Install Certbot (if not already installed)
```bash
apt-get update
apt-get install -y certbot python3-certbot-nginx
```

### Step 4: Generate SSL Certificate
```bash
certbot certonly --nginx -d scootybook.kusalpabasara.me -d www.scootybook.kusalpabasara.me
```

**Follow the prompts**:
- Enter email address for urgent renewal notices
- Agree to Terms of Service
- Choose whether to share email with EFF

**Expected Output**: `Successfully received certificate`

**Checklist**:
- [ ] SSL certificate generated successfully
- [ ] Certificate files created at `/etc/letsencrypt/live/scootybook.kusalpabasara.me/`

### Step 5: Restart Nginx
```bash
systemctl restart nginx
systemctl status nginx
```

**Expected Output**: `active (running)` in green

**Checklist**:
- [ ] Nginx restarted successfully
- [ ] Nginx status shows "active (running)"

---

## Phase 4: Application Deployment (20 minutes)

### Step 1: Clone Repository
```bash
cd /apps/scootybook
git clone https://github.com/KusalPabasara/ScootyBook.git temp
cp -r temp/* .
cp -r temp/.github .
rm -rf temp
```

**Checklist**:
- [ ] Repository cloned successfully
- [ ] Files copied to /apps/scootybook

### Step 2: Install Backend Dependencies
```bash
npm install --production
```

**Expected Output**: No errors, dependencies installed

**Checklist**:
- [ ] Backend dependencies installed
- [ ] No error messages

### Step 3: Build Frontend
```bash
cd client
npm install
REACT_APP_API_URL=https://scootybook.kusalpabasara.me/api \
REACT_APP_GOOGLE_MAPS_API_KEY=AIzaSyBcXN9OTtI5plUcbX5Y4QucMrK3-0ftaSk \
npm run build
cd ..
```

**Expected Output**: `The build folder is ready to be deployed`

**Checklist**:
- [ ] Frontend dependencies installed
- [ ] Build completed successfully
- [ ] Build folder created at `client/build/`

### Step 4: Start Application
```bash
pm2 start ecosystem.config.js
pm2 save
systemctl start scootybook
```

**Checklist**:
- [ ] PM2 started successfully
- [ ] PM2 configuration saved
- [ ] Systemd service started

---

## Phase 5: Verification (10 minutes)

### Step 1: Check PM2 Status
```bash
pm2 status
```

**Expected Output**: scootybook showing status "online" in green

**Checklist**:
- [ ] Application status is "online"
- [ ] No restart count or errors

### Step 2: Check Application Logs
```bash
pm2 logs scootybook --lines 20
```

**Expected Output**: 
- "MongoDB connected successfully"
- "Server running on port 5001"
- No error messages

**Checklist**:
- [ ] MongoDB connection successful
- [ ] Server started on port 5001
- [ ] No errors in logs

### Step 3: Test Local Health Endpoint
```bash
curl http://localhost:5001/health
```

**Expected Output**: 
```json
{"status":"ok","timestamp":"...","uptime":...,"mongodb":"connected","environment":"production"}
```

**Checklist**:
- [ ] Health endpoint returns 200 OK
- [ ] MongoDB status is "connected"

### Step 4: Test Public HTTPS Endpoint
```bash
curl https://scootybook.kusalpabasara.me/health
```

**Expected Output**: Same JSON as above

**Checklist**:
- [ ] HTTPS health endpoint accessible
- [ ] No SSL errors

### Step 5: Test API Endpoint
```bash
curl https://scootybook.kusalpabasara.me/api/scooties
```

**Expected Output**: JSON array (may be empty: `[]`)

**Checklist**:
- [ ] API endpoint accessible
- [ ] Returns valid JSON

---

## Phase 6: Browser Testing (10 minutes)

### Step 1: Access Homepage
1. Open browser
2. Navigate to: `https://scootybook.kusalpabasara.me`

**Expected**:
- Homepage loads without SSL warnings
- Modern ocean blue theme visible
- Navigation menu present

**Checklist**:
- [ ] Homepage loads successfully
- [ ] No SSL certificate warnings
- [ ] UI displays correctly

### Step 2: Test User Registration
1. Click "Sign Up" or "Register"
2. Fill in form:
   - Name: Test User
   - Email: test@example.com
   - Password: Test123!
   - Phone: +94771234567
   - License: ABC123456
3. Submit

**Expected**: Registration successful, redirected to login or dashboard

**Checklist**:
- [ ] Registration form works
- [ ] User created successfully
- [ ] No errors displayed

### Step 3: Test User Login
1. Use registered credentials
2. Login

**Expected**: Successful login, redirected to dashboard

**Checklist**:
- [ ] Login successful
- [ ] JWT token received
- [ ] Dashboard accessible

### Step 4: Test Scooter Browsing
1. Navigate to "Available Scooters" or "Scooties"

**Expected**: Scooter listing page loads (may be empty)

**Checklist**:
- [ ] Scooter listing page loads
- [ ] No JavaScript errors in console

---

## Phase 7: CI/CD Testing (5 minutes)

### Step 1: Test Automated Deployment
On your local machine:

```bash
cd /home/kusal/scootybook/ScootyBook
echo "# Deployment test" >> README.md
git add README.md
git commit -m "Test: CI/CD automated deployment"
git push origin main
```

### Step 2: Monitor GitHub Actions
1. Go to: https://github.com/KusalPabasara/ScootyBook/actions
2. Watch the workflow run

**Expected**:
- Build job completes successfully
- Deploy job completes successfully
- Health check passes

**Checklist**:
- [ ] GitHub Actions workflow triggered
- [ ] Build job successful
- [ ] Deploy job successful
- [ ] Health check passed
- [ ] Changes deployed to VPS

---

## Final Verification Checklist

### System Status
- [ ] PM2 status shows "online"
- [ ] Nginx status shows "active (running)"
- [ ] MongoDB status shows "connected"
- [ ] No errors in PM2 logs
- [ ] No errors in Nginx error logs

### Application Access
- [ ] https://scootybook.kusalpabasara.me loads
- [ ] SSL certificate valid (no warnings)
- [ ] Homepage displays correctly
- [ ] User registration works
- [ ] User login works
- [ ] Scooter listing page loads
- [ ] API endpoints accessible

### CI/CD Pipeline
- [ ] GitHub Actions workflow configured
- [ ] Automated deployment works
- [ ] Health checks pass

---

## Post-Deployment Tasks

### Optional: Seed Sample Scooters
```bash
cd /apps/scootybook
node seed-scooties.js
```

### Optional: Create Admin User
```bash
cd /apps/scootybook
node create-admin.js
```

### Monitor Application
```bash
# Real-time logs
pm2 logs scootybook --follow

# Real-time monitoring
pm2 monit

# Nginx access logs
tail -f /var/log/nginx/scootybook_access.log

# Nginx error logs
tail -f /var/log/nginx/scootybook_error.log
```

---

## Troubleshooting

### Issue: MongoDB Connection Failed
```bash
# Check if MongoDB is running
systemctl status mongod

# Start MongoDB if not running
systemctl start mongod

# Check MongoDB logs
tail -f /var/log/mongodb/mongod.log
```

### Issue: PM2 Application Not Starting
```bash
# Check detailed logs
pm2 logs scootybook --lines 100

# Restart application
pm2 restart scootybook

# Delete and restart
pm2 delete scootybook
pm2 start ecosystem.config.js
```

### Issue: Nginx 502 Bad Gateway
```bash
# Check if backend is running
ss -tlnp | grep 5001

# Restart backend
pm2 restart scootybook

# Restart nginx
systemctl restart nginx
```

### Issue: SSL Certificate Error
```bash
# Check certificate status
certbot certificates

# Renew certificate
certbot renew --force-renewal

# Restart nginx
systemctl restart nginx
```

---

## Success! 🎉

Your ScootyBook application is now live at:
**https://scootybook.kusalpabasara.me**

Future updates will deploy automatically when you push to GitHub!
