# Incident Response Procedures

## 📋 Incident Classification

### Severity Levels

**P1 - Critical**
- **Response Time**: 15 minutes
- **Resolution Time**: 2 hours
- **Examples**: Site completely down, security breach, data loss
- **Escalation**: Immediate notification to all stakeholders

**P2 - High**  
- **Response Time**: 1 hour
- **Resolution Time**: 8 hours
- **Examples**: Major functionality broken, performance severely degraded
- **Escalation**: Notify team lead and stakeholders

**P3 - Medium**
- **Response Time**: 4 hours
- **Resolution Time**: 24 hours  
- **Examples**: Minor functionality issues, cosmetic bugs
- **Escalation**: Standard team notification

**P4 - Low**
- **Response Time**: 24 hours
- **Resolution Time**: 1 week
- **Examples**: Enhancement requests, documentation updates
- **Escalation**: Regular team workflow

## 🚨 Response Procedures

### Initial Response (All Incidents)

1. **Acknowledge** incident within response time SLA
2. **Assess** severity and impact
3. **Create** GitHub issue with incident template
4. **Notify** appropriate stakeholders
5. **Begin** investigation and logging

### P1/P2 Incident Response

**Immediate Actions (0-15 minutes)**
```bash
# Check site status
curl -I https://hanbedrijfskunde.github.io/aecc/

# Run health check
npm run health

# Check recent changes
git log --oneline -10

# Check GitHub Actions status
gh run list --limit 5
```

**Investigation Phase (15-60 minutes)**
1. Gather incident details and timeline
2. Identify root cause hypothesis
3. Implement immediate workaround if possible
4. Document all findings and actions

**Resolution Phase**
1. Develop and test fix
2. Deploy fix using standard procedures
3. Verify resolution
4. Monitor for stability
5. Update stakeholders

## 📝 Incident Templates

### GitHub Issue Template
```markdown
## 🚨 Incident Report

**Severity**: P1 | P2 | P3 | P4
**Status**: Investigating | In Progress | Resolved | Closed
**Start Time**: YYYY-MM-DD HH:MM UTC
**Detection Method**: Monitoring | User Report | Internal Discovery

### Impact
- **Affected Users**: All | Some | None
- **Affected Services**: List services
- **Business Impact**: High | Medium | Low

### Timeline
- **HH:MM** - Incident detected
- **HH:MM** - Investigation started  
- **HH:MM** - Root cause identified
- **HH:MM** - Fix implemented
- **HH:MM** - Resolution verified

### Root Cause
Brief description of what caused the incident.

### Resolution
Description of actions taken to resolve the incident.

### Follow-up Actions
- [ ] Action item 1
- [ ] Action item 2
- [ ] Schedule post-mortem review
```

### Communication Template
```markdown
## Incident Update

**Subject**: [P1/P2] AEC Site Issue - [Brief Description]

**Current Status**: [Investigating/Resolving/Resolved]
**Impact**: [Description of user impact]
**ETA**: [Estimated time to resolution]

**What happened**: [Brief explanation]
**What we're doing**: [Current actions]
**Next update**: [When next update will be sent]

Contact: [Name] for questions
```

## 🔍 Investigation Procedures

### Data Collection
```bash
# Site health check
npm run health > incident-health.log

# Recent deployment history
git log --oneline --since="24 hours ago" > incident-commits.log

# GitHub Actions logs
gh run list --limit 10 > incident-actions.log

# Performance metrics
npm run lighthouse > incident-performance.log

# Browser console errors (manual check)
# Network tab analysis (manual check)
```

### Log Analysis
```bash
# Search for error patterns
grep -i "error\|fail\|exception" *.log

# Check timing correlation
grep "$(date +%Y-%m-%d)" *.log

# Look for anomalies
awk '{print $1}' access.log | sort | uniq -c | sort -nr
```

### Root Cause Analysis (5 Whys)
1. **What happened?** - Describe the incident
2. **Why did it happen?** - First level cause
3. **Why did that happen?** - Second level cause  
4. **Why did that happen?** - Third level cause
5. **Why did that happen?** - Root cause identified

## 📊 Incident Metrics

### Key Metrics to Track
- **MTTR** (Mean Time To Resolution)
- **MTTD** (Mean Time To Detection)  
- **MTBF** (Mean Time Between Failures)
- **Incident Volume** (by severity and type)
- **Customer Impact** (users affected, duration)

### Monthly Incident Report
```markdown
# Incident Report - [Month Year]

## Summary
- **Total Incidents**: X
- **P1 Critical**: X (MTTR: Xh Xm)
- **P2 High**: X (MTTR: Xh Xm)
- **P3 Medium**: X (MTTR: Xh Xm)
- **P4 Low**: X (MTTR: Xh Xm)

## Trends
- Incident volume compared to last month
- Most common incident types
- Performance against SLAs

## Top Issues
1. Issue type - X incidents
2. Issue type - X incidents  
3. Issue type - X incidents

## Lessons Learned
- Key improvements implemented
- Process changes made
- Prevention measures added
```

## 🛠️ Common Incident Types

### Site Unavailable (P1)

**Symptoms**
- HTTP 404/500 errors
- DNS resolution failures
- Timeout errors

**Investigation Steps**
```bash
# Check DNS resolution
nslookup hanbedrijfskunde.github.io

# Check GitHub Pages status
curl -I https://pages.github.com

# Verify repository settings
gh repo view hanbedrijfskunde/aecc --json defaultBranchRef,hasPages

# Check recent commits for breaking changes
git log --oneline --since="24 hours ago"
```

**Common Fixes**
- Revert breaking commit
- Fix GitHub Pages configuration
- Wait for GitHub Pages deployment
- Check _config.yml syntax

### Performance Degradation (P2)

**Symptoms**
- Page load times > 5 seconds
- Lighthouse scores < 50
- User complaints about slowness

**Investigation Steps**
```bash
# Performance audit
npm run lighthouse

# Check resource sizes
ls -lah docs/

# Network analysis
curl -w "@curl-format.txt" -s -o /dev/null https://hanbedrijfskunde.github.io/aecc/
```

**Common Fixes**
- Optimize large images
- Minify CSS/JavaScript
- Enable compression
- Review recent changes

### Functionality Broken (P2/P3)

**Symptoms**
- JavaScript errors in console
- Forms not submitting
- Navigation not working

**Investigation Steps**
```bash
# Check browser console (manual)
# Verify JavaScript files loading
curl -f https://hanbedrijfskunde.github.io/aecc/script.js

# Run automated tests
npm test

# Check content.json syntax
jq . docs/content.json
```

**Common Fixes**
- Fix JavaScript syntax errors
- Correct JSON syntax
- Update broken links
- Fix CSS selector issues

## 📚 Post-Incident Review

### Post-Mortem Template
```markdown
# Post-Mortem: [Incident Title]

**Date**: YYYY-MM-DD
**Duration**: Xh Xm  
**Severity**: P1/P2/P3/P4
**Impact**: [Description of impact]

## Timeline
- **HH:MM** - Incident began
- **HH:MM** - Detected by [method]
- **HH:MM** - Investigation started
- **HH:MM** - Root cause identified  
- **HH:MM** - Fix deployed
- **HH:MM** - Resolution confirmed

## Root Cause
[Detailed explanation of what caused the incident]

## Contributing Factors
- Factor 1
- Factor 2
- Factor 3

## What Went Well
- Quick detection
- Effective communication
- Fast resolution

## What Could Be Improved
- Earlier detection
- Better tooling
- Improved procedures

## Action Items
- [ ] **Person**: Implement monitoring for X (Due: Date)
- [ ] **Person**: Update documentation (Due: Date)  
- [ ] **Person**: Add automated test for Y (Due: Date)

## Lessons Learned
Key takeaways and how to prevent similar incidents.
```

### Review Process
1. **Schedule** post-mortem within 48 hours of P1/P2 incidents
2. **Invite** all stakeholders involved in response
3. **Focus** on process improvement, not blame
4. **Document** lessons learned and action items
5. **Track** action item completion
6. **Share** learnings with broader team

## 🔄 Prevention Measures

### Proactive Monitoring
- Automated health checks every 30 minutes
- Performance monitoring with alerts
- Dependency vulnerability scanning
- Regular security audits

### Improved Tooling
- Better alerting and notification systems
- Enhanced monitoring dashboards  
- Automated rollback procedures
- Improved testing coverage

### Process Improvements
- Regular disaster recovery drills
- Updated runbooks and procedures
- Team training and knowledge sharing
- Continuous improvement feedback loops

---

**Last Updated**: 2024-08-25  
**Review Schedule**: After each P1/P2 incident  
**Owner**: Incident Response Team