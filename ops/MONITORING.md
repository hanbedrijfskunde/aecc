# Monitoring & Metrics

## 📊 Key Performance Indicators

### Availability Metrics
- **Uptime Target**: 99.9% (< 8.76 hours downtime per year)
- **Response Time**: < 2 seconds average
- **Error Rate**: < 0.1% of requests

### Performance Metrics
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s  
- **Cumulative Layout Shift**: < 0.1
- **Time to Interactive**: < 3.8s
- **Lighthouse Score**: > 90/100

### Quality Metrics
- **Test Pass Rate**: 100%
- **Code Coverage**: > 80%
- **Accessibility Score**: 100% WCAG 2.1 AA compliance
- **Security Vulnerabilities**: 0 critical, 0 high

## 🔍 Monitoring Tools

### Automated Monitoring
```bash
# Daily health check (add to cron)
0 9 * * * cd /path/to/aecc && npm run health

# Weekly performance audit
0 9 * * 1 cd /path/to/aecc && npm run lighthouse

# Monthly dependency check
0 9 1 * * cd /path/to/aecc && npm run deps:check
```

### Manual Monitoring
```bash
# Check site status
npm run status

# Performance audit
npm run lighthouse

# Health check
npm run health

# Security audit
npm run security:audit
```

## 📈 Performance Monitoring

### Core Web Vitals
```javascript
// Add to docs/script.js for real user metrics
if ('performance' in window) {
  window.addEventListener('load', function() {
    const perfData = performance.timing;
    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
    
    // Log to console (in production, send to analytics)
    console.log('Page Load Time:', pageLoadTime + 'ms');
  });
}
```

### Lighthouse CI Integration
```yaml
# .github/workflows/performance.yml
name: Performance Audit
on:
  schedule:
    - cron: '0 9 * * 1'  # Weekly on Monday

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: treosh/lighthouse-ci-action@v9
        with:
          urls: |
            https://hanbedrijfskunde.github.io/aecc/
            https://hanbedrijfskunde.github.io/aecc/studenten.html
            https://hanbedrijfskunde.github.io/aecc/docenten.html
            https://hanbedrijfskunde.github.io/aecc/commissie.html
          uploadArtifacts: true
```

### Performance Budget
```json
{
  "budget": {
    "timings": [
      {
        "metric": "first-contentful-paint",
        "budget": 1500
      },
      {
        "metric": "largest-contentful-paint", 
        "budget": 2500
      },
      {
        "metric": "speed-index",
        "budget": 3400
      },
      {
        "metric": "interactive",
        "budget": 3800
      }
    ],
    "resourceSizes": [
      {
        "resourceType": "document",
        "budget": 50
      },
      {
        "resourceType": "stylesheet",
        "budget": 100
      },
      {
        "resourceType": "script",
        "budget": 150
      },
      {
        "resourceType": "image",
        "budget": 200
      }
    ]
  }
}
```

## 🚨 Alerting

### Alert Thresholds
- **Site Down**: HTTP status ≠ 200
- **Performance Degradation**: LCP > 4s or FCP > 3s  
- **High Error Rate**: > 5% of requests failing
- **Security Alert**: New vulnerabilities detected

### Alert Channels
- **GitHub Issues**: Automated issue creation for alerts
- **Email**: Critical alerts to maintainer team
- **Slack/Teams**: Real-time notifications (if configured)

### Sample Alert Script
```bash
#!/bin/bash
# alerts/check-site.sh

SITE_URL="https://hanbedrijfskunde.github.io/aecc/"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$SITE_URL")

if [ "$HTTP_CODE" != "200" ]; then
  # Create GitHub issue
  gh issue create \
    --title "🚨 Site Down - HTTP $HTTP_CODE" \
    --body "Site is returning HTTP $HTTP_CODE. Investigation needed." \
    --label "incident,P1"
fi
```

## 📊 Dashboard

### Key Metrics Dashboard
```markdown
## AEC Site Status Dashboard

### ✅ Current Status: HEALTHY

**Uptime**: 99.95% (last 30 days)
**Response Time**: 1.2s average  
**Lighthouse Score**: 94/100
**Last Deploy**: 2024-08-25 14:30 CET
**Test Status**: ✅ All tests passing

### Recent Metrics
- **Page Views**: 1,250 (last 7 days)
- **Unique Visitors**: 450 (last 7 days)  
- **Error Rate**: 0.02%
- **Avg Session Duration**: 4m 32s

### System Health
- **GitHub Pages**: ✅ Operational
- **DNS**: ✅ Resolving correctly
- **SSL Certificate**: ✅ Valid until 2024-12-31
- **Dependencies**: ✅ 0 vulnerabilities
```

### Monitoring Checklist
- [ ] Site responds with HTTP 200
- [ ] All critical pages load correctly
- [ ] No JavaScript console errors
- [ ] CSS/JS assets loading properly
- [ ] SSL certificate valid
- [ ] Performance within thresholds
- [ ] No security vulnerabilities

## 📈 Trend Analysis

### Weekly Performance Report
```bash
#!/bin/bash
# scripts/weekly-report.sh

echo "# Weekly Performance Report - $(date)"
echo "=================================="

# Performance metrics
npm run lighthouse > lighthouse-report.txt
SCORE=$(grep -o "Performance: [0-9]*" lighthouse-report.txt | cut -d' ' -f2)
echo "Lighthouse Score: $SCORE/100"

# Test results
npm test > test-results.txt 2>&1
TESTS_PASSED=$(grep -c "✓" test-results.txt)
echo "Tests Passed: $TESTS_PASSED"

# Response time
RESPONSE_TIME=$(curl -s -o /dev/null -w "%{time_total}" https://hanbedrijfskunde.github.io/aecc/)
echo "Response Time: ${RESPONSE_TIME}s"

# Error check
ERRORS=$(curl -s https://hanbedrijfskunde.github.io/aecc/ | grep -i "error" | wc -l)
echo "Page Errors: $ERRORS"
```

### Historical Tracking
```bash
# Store metrics in simple log format
echo "$(date),$(LIGHTHOUSE_SCORE),$(RESPONSE_TIME),$(TEST_RESULTS)" >> metrics.log

# Generate monthly trend report
awk -F, '{
  month=substr($1,1,7)
  score[month]+=$2; time[month]+=$3; count[month]++
}
END {
  for(m in score) 
    printf "%s: Avg Score=%.1f, Avg Time=%.2fs\n", m, score[m]/count[m], time[m]/count[m]
}' metrics.log
```

## 🔧 Monitoring Tools Setup

### Browser-based Monitoring
- **Chrome DevTools**: Performance tab for real-time analysis
- **Lighthouse**: Built-in performance auditing  
- **WebPageTest**: Third-party performance testing
- **GTmetrix**: Performance and optimization insights

### Command-line Monitoring
```bash
# Site health check
curl -f https://hanbedrijfskunde.github.io/aecc/ > /dev/null

# Performance measurement
curl -w "@curl-format.txt" -s -o /dev/null https://hanbedrijfskunde.github.io/aecc/

# SSL certificate check
openssl s_client -connect hanbedrijfskunde.github.io:443 -servername hanbedrijfskunde.github.io < /dev/null 2>/dev/null | openssl x509 -noout -dates
```

### GitHub Actions Monitoring
```yaml
name: Site Monitor
on:
  schedule:
    - cron: '*/30 * * * *'  # Every 30 minutes

jobs:
  monitor:
    runs-on: ubuntu-latest
    steps:
      - name: Check site health
        run: |
          HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" https://hanbedrijfskunde.github.io/aecc/)
          if [ "$HTTP_CODE" != "200" ]; then
            echo "Site down - HTTP $HTTP_CODE"
            exit 1
          fi
```

## 📱 Real User Monitoring (RUM)

### Web Vitals Tracking
```javascript
// Add to docs/script.js
import {getCLS, getFID, getFCP, getLCP, getTTFB} from 'web-vitals';

function sendToAnalytics(metric) {
  // In production, send to your analytics service
  console.log('Web Vital:', metric.name, metric.value);
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

### Error Tracking
```javascript
// Global error handler
window.addEventListener('error', function(e) {
  const errorInfo = {
    message: e.message,
    filename: e.filename,
    line: e.lineno,
    column: e.colno,
    timestamp: new Date().toISOString()
  };
  
  // Log errors (in production, send to error tracking service)
  console.error('JavaScript Error:', errorInfo);
});

// Promise rejection handler
window.addEventListener('unhandledrejection', function(e) {
  console.error('Unhandled Promise Rejection:', e.reason);
});
```

---

**Last Updated**: 2024-08-25  
**Review Schedule**: Monthly  
**Owner**: Operations Team