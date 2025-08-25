# Deployment Guide

## 🚀 Production Deployment

### Live Environment
- **URL:** https://hanbedrijfskunde.github.io/aecc/
- **Platform:** GitHub Pages
- **Source:** `/docs` folder in main branch
- **SSL:** Automatic HTTPS
- **CDN:** GitHub's global CDN

### Deployment Pipeline
```
Code Change → Git Push → GitHub Actions → Tests → Deploy → Live
    ↓            ↓            ↓           ↓       ↓      ↓
  Developer → Repository → CI Pipeline → QA → Pages → Users
```

## 🔄 Automatic Deployment

### Trigger Conditions
- **Push to main branch** - Automatic deployment
- **Pull request merge** - Automatic deployment after merge
- **Manual trigger** - Via GitHub Actions interface

### Process Flow
1. **Code pushed** to main branch
2. **GitHub Actions** triggered automatically
3. **Tests executed** (Playwright suite)
4. **HTML validation** performed
5. **Performance audit** with Lighthouse
6. **Deploy to GitHub Pages** if all checks pass
7. **Site live** within 5 minutes

### Deployment Commands
```bash
# Standard deployment workflow
git add .
git commit -m "feat: description of changes"
git push origin main

# Quick deployment with validation
npm run deploy
```

## 📋 Pre-deployment Checklist

### Code Quality
- [ ] All tests passing (`npm test`)
- [ ] HTML validated (`npm run validate`)
- [ ] CSS linted (`npm run lint:css`)
- [ ] JavaScript linted (`npm run lint:js`)
- [ ] Code formatted (`npm run format`)
- [ ] No console errors in browser

### Functionality
- [ ] All pages load correctly
- [ ] Navigation works between pages
- [ ] Interactive elements responsive
- [ ] Mobile layout correct
- [ ] Content loads from JSON
- [ ] Forms and modals functional

### Performance
- [ ] Page load time < 2 seconds
- [ ] Lighthouse score > 90
- [ ] Images optimized
- [ ] No render-blocking resources
- [ ] Minimal HTTP requests

### Security
- [ ] No inline scripts or styles
- [ ] No sensitive data in client code
- [ ] HTTPS enforced
- [ ] No XSS vulnerabilities
- [ ] Content Security Policy compatible

## 🔧 Manual Deployment

### Emergency Deployment
```bash
# Skip CI/CD for urgent fixes
git add .
git commit -m "hotfix: critical issue description"
git push origin main

# Monitor deployment
watch -n 30 "curl -sI https://hanbedrijfskunde.github.io/aecc/ | head -1"
```

### Deployment Verification
```bash
# Check deployment status
curl -I https://hanbedrijfskunde.github.io/aecc/

# Expected response
HTTP/2 200
content-type: text/html; charset=utf-8
```

### Manual Steps (if automation fails)
1. Go to repository Settings → Pages
2. Verify source is set to "Deploy from branch"
3. Branch: main, Folder: /docs
4. Click "Save" to redeploy
5. Wait 5-10 minutes for deployment

## 🔙 Rollback Procedures

### Quick Rollback
```bash
# Find previous working commit
git log --oneline -10

# Revert to previous version
git revert <commit-hash>
git push origin main

# Alternative: Force reset (destructive)
git reset --hard <previous-commit>
git push --force-with-lease origin main
```

### Rollback Verification
```bash
# Verify rollback successful
curl -sL https://hanbedrijfskunde.github.io/aecc/ | grep -o "<title>[^<]*"

# Check specific functionality
npm test -- --grep "critical functionality"
```

### Communication Template
```
🚨 ROLLBACK NOTICE
Site rolled back to previous version due to: [REASON]
- Timeline: [START TIME] - [END TIME]
- Impact: [DESCRIPTION]
- Action: Investigating issue, fix ETA: [TIME]
- Contact: [PERSON] for questions
```

## 🌍 Environment Configuration

### GitHub Pages Settings
```yaml
# _config.yml
title: "AEC - Algemene Economie C-cluster"
description: "Boardroom Simulatie voor AI-proof HBO-onderwijs"
url: "https://hanbedrijfskunde.github.io"
baseurl: "/aecc"

# Build settings
markdown: kramdown
highlighter: rouge
plugins:
  - jekyll-feed
  - jekyll-sitemap

# Exclude from processing
exclude:
  - node_modules/
  - tests/
  - scripts/
  - "*.md"
```

### Environment Variables
```bash
# No environment variables needed for static site
# All configuration in _config.yml and package.json
```

### Domain Configuration
```
# Custom domain (if needed in future)
# Create CNAME file in docs/ with domain name
echo "aecc.hanbk.nl" > docs/CNAME
```

## 📊 Deployment Monitoring

### Health Checks
```bash
# Automated health check
curl -f https://hanbedrijfskunde.github.io/aecc/ || echo "Site down"

# Comprehensive check
npm run lighthouse
```

### Monitoring Commands
```bash
# Check deployment status
gh api repos/hanbedrijfskunde/aecc/pages

# View deployment history
gh api repos/hanbedrijfskunde/aecc/deployments

# Monitor GitHub Actions
gh run list --limit 10
```

### Key Metrics
- **Deployment frequency:** Daily during development
- **Lead time:** < 10 minutes from commit to live
- **Change failure rate:** < 5%
- **Mean time to recovery:** < 30 minutes
- **Uptime:** 99.9% (GitHub Pages SLA)

## 🔐 Security Considerations

### HTTPS Configuration
- **Force HTTPS:** Enabled via GitHub Pages
- **HSTS:** Automatic via GitHub Pages
- **Mixed content:** No HTTP resources loaded

### Content Security Policy
```html
<!-- Recommended CSP header (if needed) -->
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline'; 
               style-src 'self' 'unsafe-inline';
               img-src 'self' data:;">
```

### Access Control
- **Repository:** Private/public as needed
- **GitHub Pages:** Public (required for free tier)
- **Admin access:** Limited to project maintainers
- **Deploy keys:** Not required for public repos

## 🧪 Testing in Production

### Smoke Tests
```bash
# Run critical path tests against production
PLAYWRIGHT_URL=https://hanbedrijfskunde.github.io/aecc npm test

# Quick functionality check
curl -s https://hanbedrijfskunde.github.io/aecc/studenten.html | grep -q "Onboarding"
```

### Performance Monitoring
```bash
# Lighthouse CI for production
npm run lighthouse -- --url=https://hanbedrijfskunde.github.io/aecc/

# Monitor Core Web Vitals
# Use Google PageSpeed Insights API
```

### User Acceptance Testing
- Test all user workflows in production
- Verify mobile responsiveness
- Check cross-browser compatibility
- Validate accessibility features

## 🚨 Incident Response

### Deployment Failures

**Symptoms:**
- Site returns 404 errors
- CSS/JS not loading
- Functionality broken

**Immediate Actions:**
1. Check GitHub Actions status
2. Review recent commits
3. Rollback if necessary
4. Investigate root cause

**Common Fixes:**
```bash
# Fix GitHub Pages source
git push origin main

# Clear GitHub cache (wait 24 hours or contact support)

# Verify _config.yml syntax
yamllint _config.yml
```

### Performance Issues

**Symptoms:**
- Slow page load times
- Poor Lighthouse scores
- User complaints

**Investigation:**
```bash
# Performance audit
npm run lighthouse

# Network analysis
curl -w "@curl-format.txt" -s -o /dev/null https://hanbedrijfskunde.github.io/aecc/

# Check resource sizes
ls -lah docs/
```

### Communication Channels
- **Internal:** GitHub Issues
- **External:** Email to stakeholders
- **Emergency:** Direct contact with maintainers

## 📝 Deployment Logs

### Log Locations
- **GitHub Actions:** Repository → Actions tab
- **GitHub Pages:** Repository → Settings → Pages
- **Browser:** Developer Tools → Console/Network

### Log Analysis
```bash
# Download action logs
gh run download <run-id>

# Parse logs for errors
grep -i "error\|fail\|exception" action-logs.txt
```

### Troubleshooting Guide
| Issue | Symptoms | Solution |
|-------|----------|----------|
| 404 on site | Site not found | Check Pages settings |
| CSS not loading | Unstyled page | Verify file paths |
| JS errors | Broken functionality | Check browser console |
| Slow loading | Poor performance | Run Lighthouse audit |
| Build failing | Red status badge | Check Actions logs |

---

**Last Updated:** 2024-08-25  
**Review Schedule:** After each deployment  
**Contact:** Create GitHub issue for deployment problems