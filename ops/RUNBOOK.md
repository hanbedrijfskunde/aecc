# Operations Runbook

## 📋 Daily Operations

### Morning Health Check
```bash
# Check site health
npm run health

# Check recent deployments  
npm run logs

# Check site status
npm run status
```

### Deployment Operations
```bash
# Standard deployment
npm run deploy

# Emergency deployment (skip some checks)
git add . && git commit -m "hotfix: description" && git push

# Rollback to previous version
git log --oneline -5
git revert <commit-hash>
git push
```

## 🔧 Common Operations

### Site Issues

**Site Down (HTTP 5xx/4xx)**
1. Check GitHub Pages status: https://www.githubstatus.com/
2. Verify repository settings → Pages configuration
3. Check recent commits for breaking changes
4. Rollback if necessary

**Performance Issues** 
```bash
# Run performance audit
npm run lighthouse

# Check resource sizes
ls -lah docs/

# Analyze load times
curl -w "@curl-format.txt" -s -o /dev/null https://hanbedrijfskunde.github.io/aecc/
```

**Content Not Loading**
1. Check console errors in browser DevTools
2. Verify JSON syntax: `jq . docs/content.json`
3. Check CORS issues (should not exist on same domain)
4. Clear browser cache and test

### Development Support

**Local Development Issues**
```bash
# Kill existing servers
pkill -f "python.*http.server" || pkill -f "serve"

# Start fresh development server
npm run dev

# Alternative server
npm run serve
```

**Test Failures**
```bash
# Debug specific test
npm run test:debug -- --grep "test name"

# Run tests with browser UI
npm run test:ui

# Check test report
npm run test:report
```

## 📊 Monitoring

### Key Metrics to Monitor
- **Uptime**: Site availability (target: 99.9%)
- **Performance**: Page load time (target: < 2s)
- **Quality**: Lighthouse score (target: > 90)
- **Errors**: Console errors (target: 0)
- **Tests**: Pass rate (target: 100%)

### Weekly Tasks
- [ ] Run full test suite: `npm test`
- [ ] Performance audit: `npm run lighthouse`  
- [ ] Security audit: `npm run security:audit`
- [ ] Dependency updates: `npm run deps:check`
- [ ] Backup creation: `npm run backup`

### Monthly Tasks
- [ ] Review and update documentation
- [ ] Analyze performance trends
- [ ] Review and archive old screenshots
- [ ] Update browser support matrix
- [ ] Review operational procedures

## 🚨 Incident Response

### Severity Levels

**P1 - Critical (Site Down)**
- Response time: 15 minutes
- Site completely inaccessible
- All users affected

**P2 - High (Major Functionality Broken)**
- Response time: 1 hour  
- Key features not working
- Most users affected

**P3 - Medium (Minor Issues)**
- Response time: 4 hours
- Non-critical features affected
- Some users affected

**P4 - Low (Cosmetic Issues)**
- Response time: 24 hours
- Visual/UX issues
- Limited user impact

### Response Procedures

**Immediate Response (All P1/P2)**
1. Acknowledge incident in GitHub Issues
2. Assess impact and severity
3. Begin investigation and document findings
4. Implement temporary workaround if possible
5. Communicate status to stakeholders

**Investigation Steps**
1. Check recent changes: `git log --oneline -10`
2. Review GitHub Actions: `npm run logs`
3. Check browser console for errors
4. Run health check: `npm run health`
5. Verify external services (GitHub Pages status)

**Resolution Steps**
1. Identify root cause
2. Implement fix
3. Test fix in staging/local environment
4. Deploy fix: `npm run deploy`
5. Verify resolution
6. Document incident and lessons learned

## 👥 Contact Information

### On-call Rotation
- **Primary**: Repository maintainer
- **Secondary**: Development team lead
- **Escalation**: Technical director

### Communication Channels
- **Incidents**: GitHub Issues with "incident" label
- **Updates**: Commit messages and PR descriptions
- **Emergency**: Direct contact with maintainers

## 📈 Performance Baselines

### Target Metrics
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **Time to Interactive**: < 3.8s
- **Speed Index**: < 3.4s

### Monitoring Commands
```bash
# Performance snapshot
npm run lighthouse

# Monitor over time (weekly)
for i in {1..7}; do
  npm run lighthouse >> performance-log.txt
  sleep 86400  # 24 hours
done
```

## 🔐 Security Operations

### Security Checklist
- [ ] No secrets in code repository
- [ ] HTTPS enforced (automatic via GitHub Pages)
- [ ] Dependencies regularly updated
- [ ] No XSS vulnerabilities
- [ ] Input validation on all forms

### Security Monitoring
```bash
# Check for vulnerabilities
npm audit

# Update dependencies
npm update

# Check for outdated packages
npm outdated
```

## 🔄 Change Management

### Release Process
1. **Development**: Feature branches → main
2. **Testing**: Automated tests on each PR
3. **Staging**: Not applicable (direct to production)
4. **Production**: Automatic deployment from main
5. **Monitoring**: Post-deployment health check

### Maintenance Windows
- **Preferred**: Tuesday-Thursday, 10:00-16:00 CET
- **Avoid**: Friday afternoons, weekends, holidays
- **Duration**: Most changes < 5 minutes downtime

### Change Categories
- **Standard**: Regular feature updates, bug fixes
- **Emergency**: Critical security fixes, site down
- **High-risk**: Major refactoring, infrastructure changes

## 📚 Knowledge Base

### Common Issues and Solutions

**"Site shows old content"**
- Browser cache issue
- Solution: Hard refresh (Ctrl+Shift+R)
- Prevention: Add cache-busting parameters

**"Modal not opening"**
- JavaScript error or missing content
- Check browser console
- Verify content.json structure

**"Responsive layout broken"**
- CSS media queries not working
- Test on actual devices
- Use browser DevTools device emulation

**"Performance degraded"**
- Large images or too many HTTP requests
- Optimize images and minimize requests
- Check Lighthouse recommendations

### Useful Commands
```bash
# Quick status check
curl -sI https://hanbedrijfskunde.github.io/aecc/ | head -1

# Check if all pages load
for page in "" "studenten.html" "docenten.html" "commissie.html"; do
  echo "Checking $page..."
  curl -sf "https://hanbedrijfskunde.github.io/aecc/$page" > /dev/null && echo "✅ OK" || echo "❌ FAIL"
done

# Find large files
find docs/ -size +100k -exec ls -lah {} \;

# Check recent activity
git log --oneline --since="1 week ago"
```

---

**Last Updated**: 2024-08-25  
**Review Schedule**: Weekly  
**Owner**: DevOps Team