# 🌐 DNS & Testing Guide - ScootyBook

## Timeline for DNS Setup

### ⏰ **Timeline of Actions:**

```
Day 1 (Today):
├─ [✓] UI Upgraded
├─ [✓] Deployment scripts created
├─ [→] Deploy backend and Nginx config
└─ [→] Get SSL certificate (using certbot --nginx)

Day 2-3 (After Nginx is ready):
├─ [→] Add DNS record (wait for propagation 5-30 mins)
├─ [→] SSL certificate ready
└─ [→] Application goes live

Day 4+:
└─ [→] Full testing and monitoring
```

---

## Step 1: Deploy Backend and Nginx FIRST ✅

Before adding DNS record, you must:

1. **Deploy the application backend** to `/apps/scootybook`
2. **Copy nginx.conf** to `/etc/nginx/sites-available/scootybook`
3. **Enable and test Nginx** (without DNS)
4. **Get SSL certificate** via certbot

```bash
# SSH into VPS
ssh root@152.42.185.253

# Run quick setup
bash /path/to/quick-setup.sh

# Edit .env with real values
nano /apps/scootybook/.env

# Copy files
cp /path/to/nginx.conf /etc/nginx/sites-available/scootybook
ln -s /etc/nginx/sites-available/scootybook /etc/nginx/sites-enabled/scootybook

# Test Nginx
nginx -t
systemctl restart nginx

# Test local (should see your site via IP)
curl http://localhost
```

---

## Step 2: Get SSL Certificate (Before DNS) ✅

You can get SSL certificate using IP or temporary domain:

```bash
# Option A: Using IP (requires temporary DNS or hosts file entry)
# Edit your local /etc/hosts:
# 152.42.185.253 scootybook.kusalpabasara.me

# Then run certbot
certbot certonly --nginx -d scootybook.kusalpabasara.me -d www.scootybook.kusalpabasara.me

# Option B: Standalone mode (if nginx port 80 is free on other IPs)
certbot certonly --standalone -d scootybook.kusalpabasara.me
```

---

## Step 3: Add DNS Record - WHEN TO DO THIS 🔴

### **CRITICAL TIMING:**

Add the DNS record **AFTER**:
- ✅ Backend application is deployed to `/apps/scootybook`
- ✅ Nginx config is in place and tested
- ✅ SSL certificate is generated
- ✅ Application is running (PM2 started)
- ✅ Nginx is serving traffic successfully

### DNS Record Details:

**In your domain registrar (Namecheap, GoDaddy, etc.):**

#### Option 1: A Record (Direct IP mapping)
```
Type:    A Record
Name:    scootybook
Value:   152.42.185.253
TTL:     3600 (or default)
```

#### Option 2: CNAME Record (if you have a base domain)
```
Type:    CNAME Record
Name:    scootybook
Value:   kusalpabasara.me
TTL:     3600
```

---

## Step 4: Verify DNS Propagation 🔍

After adding DNS record, wait 5-30 minutes, then test:

```bash
# Quick check
nslookup scootybook.kusalpabasara.me

# Detailed check
dig scootybook.kusalpabasara.me

# Global DNS check (use Google DNS)
nslookup scootybook.kusalpabasara.me 8.8.8.8

# Check if resolves to correct IP
ping scootybook.kusalpabasara.me
```

Expected output:
```
scootybook.kusalpabasara.me has address 152.42.185.253
```

---

## Step 5: Testing After DNS is Live ✅

### Local Testing (Before DNS):
```bash
# Test with IP and Host header
curl -H "Host: scootybook.kusalpabasara.me" http://152.42.185.253

# Test local backend
curl http://localhost:5001/health
```

### Browser Testing (After DNS):
```
1. Wait 5-15 minutes after DNS setup
2. Visit: https://scootybook.kusalpabasara.me
3. Check browser console for errors
4. Test API calls in Network tab
5. Test booking flow
```

### API Testing:
```bash
# After DNS is live and SSL is working
curl -k https://scootybook.kusalpabasara.me/api/scooties
curl -k https://scootybook.kusalpabasara.me/health

# Remove -k once DNS is confirmed
curl https://scootybook.kusalpabasara.me/api/scooties
```

### Full Health Check:
```bash
#!/bin/bash
echo "🔍 Health Check - ScootyBook"
echo "============================"

# DNS resolution
echo "[1] DNS Resolution:"
dig +short scootybook.kusalpabasara.me

# SSL Certificate
echo -e "\n[2] SSL Certificate:"
echo | openssl s_client -servername scootybook.kusalpabasara.me -connect scootybook.kusalpabasara.me:443 2>/dev/null | openssl x509 -noout -dates

# Homepage
echo -e "\n[3] Homepage Status:"
curl -s -o /dev/null -w "HTTP Status: %{http_code}\n" https://scootybook.kusalpabasara.me

# API Health
echo -e "[4] API Health:"
curl -s https://scootybook.kusalpabasara.me/health

# Response Time
echo -e "\n[5] Response Time:"
curl -s -o /dev/null -w "Total time: %{time_total}s\n" https://scootybook.kusalpabasara.me

echo -e "\n============================"
echo "✅ Health check complete"
```

---

## Common DNS Issues & Fixes

### Issue: "nslookup: can't resolve 'scootybook.kusalpabasara.me'"

**Causes:**
- DNS record not added yet
- DNS record not saved
- TTL still propagating (wait 5-30 minutes)

**Fix:**
```bash
# Verify record is in DNS
dig scootybook.kusalpabasara.me @8.8.8.8

# Force update DNS cache (Linux)
systemctl restart systemd-resolved

# Flush DNS (Mac)
sudo dscacheutil -flushcache
sudo killall -HUP mDNSResponder

# Flush DNS (Windows)
ipconfig /flushdns
```

### Issue: "Connection refused" or "Connection timeout"

**Causes:**
- Application not running on VPS
- Nginx not running
- Port 5001 blocked by firewall
- DNS resolved but app not listening

**Fix:**
```bash
# SSH into VPS
ssh root@152.42.185.253

# Check app status
pm2 status
pm2 logs scootybook --lines 20

# Check if port 5001 is listening
ss -tlnp | grep 5001

# Start app if not running
pm2 start ecosystem.config.js

# Check Nginx
systemctl status nginx
tail -f /var/log/nginx/scootybook_error.log
```

### Issue: "SSL certificate problem" or "PKIX path error"

**Causes:**
- SSL certificate not generated yet
- Nginx config pointing to wrong cert path
- Certificate expired

**Fix:**
```bash
# Check certificate status
certbot certificates

# Check cert path in nginx config
grep ssl_certificate /etc/nginx/sites-available/scootybook

# Renew certificate
certbot renew --force-renewal

# Restart Nginx
systemctl restart nginx
```

---

## Performance Testing

### Page Load Test:
```bash
# Using curl
time curl https://scootybook.kusalpabasara.me

# Using Apache Bench (ab)
ab -n 100 -c 10 https://scootybook.kusalpabasara.me/

# Using wrk (if installed)
wrk -t4 -c100 -d30s https://scootybook.kusalpabasara.me/
```

### Monitor Real-time Requests:
```bash
# SSH into VPS
ssh root@152.42.185.253

# Watch Nginx logs
tail -f /var/log/nginx/scootybook_access.log

# Watch PM2 logs
pm2 logs scootybook --lines 50 --follow

# Monitor system resources
top
```

---

## Post-Deployment Checklist

- [ ] Application deployed to `/apps/scootybook`
- [ ] Backend files copied (server.js, models, routes, etc.)
- [ ] Frontend built to `client/build/`
- [ ] `.env` file created with real credentials
- [ ] PM2 configured and app running
- [ ] Nginx config installed and tested
- [ ] SSL certificate generated
- [ ] Nginx restarted successfully
- [ ] Local curl test works: `curl http://localhost`
- [ ] DNS record added to registrar
- [ ] DNS resolved to correct IP: `nslookup scootybook.kusalpabasara.me`
- [ ] HTTPS accessible: `https://scootybook.kusalpabasara.me`
- [ ] API working: `/api/scooties`
- [ ] Health check passing: `/health`
- [ ] No errors in PM2 logs
- [ ] No errors in Nginx logs
- [ ] CI/CD workflow configured
- [ ] GitHub Secrets set (VPS_SSH_KEY, etc.)

---

## Timeline Summary

```
Monday:
└─ Setup VPS directories
└─ Deploy backend files
└─ Configure Nginx and PM2
└─ Generate SSL certificate

Tuesday (Next Day):
└─ Add DNS record (A Record: scootybook → 152.42.185.253)
└─ Wait 5-30 minutes for propagation
└─ Verify DNS resolves

Tuesday Afternoon:
└─ Test HTTPS access
└─ Run full health checks
└─ Verify all features work

Wednesday+:
└─ Monitor logs
└─ Set up CI/CD auto-deployment
└─ Configure monitoring/alerts
```

---

## Quick Commands

```bash
# Check everything
ssh root@152.42.185.253
pm2 status
systemctl status nginx
curl http://localhost:5001/health

# After DNS is live
curl https://scootybook.kusalpabasara.me
curl https://scootybook.kusalpabasara.me/health

# Monitor
pm2 logs scootybook
tail -f /var/log/nginx/scootybook_error.log

# Restart all
systemctl restart scootybook
systemctl restart nginx
```

