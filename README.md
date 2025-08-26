# AEC - Algemene Economie C-cluster

## 🚀 Boardroom Simulatie voor AI-proof HBO-onderwijs

Een innovatief onderwijsconcept waarbij studenten als Raad van Bestuur strategische beslissingen nemen op basis van AI-gegenereerde intelligence briefings.

### 🌐 Live Website

**Production:** [https://hanbedrijfskunde.github.io/aecc/](https://hanbedrijfskunde.github.io/aecc/)

### 📋 Quick Start

```bash
# Clone repository
git clone https://github.com/hanbedrijfskunde/aecc.git
cd aecc

# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Deploy to production
npm run deploy
```

## 🏗️ Architecture

### Tech Stack
- **Frontend:** Pure HTML5, CSS3, JavaScript (ES6+)
- **Styling:** Custom CSS with CSS variables, Flexbox/Grid
- **Build:** No build process - direct deployment
- **Hosting:** GitHub Pages with automatic deployment
- **Testing:** Playwright for end-to-end testing
- **CI/CD:** GitHub Actions

### Repository Structure
```
aecc/
├── README.md              # This file - main documentation
├── DEVELOPMENT.md         # Developer setup and workflow
├── DEPLOYMENT.md          # Production deployment guide  
├── TESTING.md            # Testing strategy and procedures
├── CLAUDE.md             # AI assistant development guide
├── package.json          # NPM scripts and dependencies
├── .github/              # GitHub Actions and templates
│   ├── workflows/        # CI/CD pipelines
│   └── ISSUE_TEMPLATE/   # Issue reporting templates
├── ops/                  # Operational documentation
│   ├── RUNBOOK.md       # Day-to-day operations
│   ├── MONITORING.md    # Metrics and alerting
│   ├── SECURITY.md      # Security procedures
│   └── INCIDENTS.md     # Post-mortem templates
├── docs/                 # Production website (GitHub Pages)
│   ├── index.html       # Landing page
│   ├── studenten.html   # Student portal
│   ├── docenten.html    # Teacher dashboard
│   ├── commissie.html   # Committee portal
│   ├── content.json     # Course content database
│   └── *.css, *.js      # Assets and scripts
├── tests/                # Test suites
│   ├── *.spec.js        # Playwright E2E tests
│   └── manual/          # Manual verification scripts
├── scripts/             # Automation scripts
├── course-docs/         # Educational content
└── screenshots/         # Documentation images
```

## 🎯 Educational Innovation

### Core Philosophy
- **Problem:** Traditional education becomes obsolete when students use AI to complete assignments
- **Solution:** Accept AI output as given, focus on uniquely human skills - strategic decision-making under uncertainty
- **Method:** Boardroom simulation with conflicting interests, building coherent strategy over time

### Course Structure
**7-week boardroom simulation** where student teams become Boards of Directors:

- **CEO** (De Balans-kunstenaar) - Leads decisions, maintains vision and balance
- **CFO** (De Kapitaal-Allocateur) - Focuses on risk, returns, shareholder value
- **COO** (De Optimalisator) - Focuses on operational efficiency  
- **CIO** (De Pionier) - Focuses on innovation and disruption

### The Triangle Conflict
Strategic tension between three approaches:
- **Exploit** (COO): Optimize current business, efficiency, short-term gains
- **Explore** (CIO): Discover new business, innovation, long-term growth  
- **Buyback** (CFO): Return capital to shareholders, financial discipline

## 🛠️ Development

### Prerequisites
- Node.js 18+ (for tooling and testing)
- Git
- Modern browser (Chrome, Firefox, Safari, Edge)

### NPM Scripts
```bash
npm run dev          # Start development server
npm test             # Run all tests
npm run test:ui      # Run tests with UI
npm run test:debug   # Debug failing tests
npm run deploy       # Deploy to GitHub Pages
npm run validate     # Validate HTML
npm run lighthouse   # Performance audit
npm run format       # Format code
npm run lint:css     # Lint CSS
npm run lint:js      # Lint JavaScript
npm run clean        # Clean test artifacts
npm run backup       # Create backup
```

### Development Workflow
1. **Feature Development:** Work in feature branches
2. **Testing:** All PRs require passing tests
3. **Code Quality:** Automatic formatting and linting
4. **Deployment:** Automatic on merge to main
5. **Monitoring:** Performance and error tracking

## 🚀 Deployment

### Automatic Deployment
- **Trigger:** Push to `main` branch
- **Process:** GitHub Actions → Tests → Deploy to GitHub Pages
- **URL:** https://hanbedrijfskunde.github.io/aecc/
- **Time:** ~5 minutes

### Manual Deployment
```bash
# Validate changes
npm test
npm run validate

# Deploy
git add .
git commit -m "feat: description"
git push origin main
```

### Rollback Procedure
```bash
# Find previous commit
git log --oneline

# Revert to previous version
git revert <commit-hash>
git push origin main
```

## 🧪 Testing

### Test Strategy
- **Unit Tests:** JavaScript functions and modules
- **Integration Tests:** Component interactions
- **E2E Tests:** Full user workflows with Playwright
- **Performance Tests:** Lighthouse audits
- **Accessibility Tests:** WCAG 2.1 AA compliance

### Test Coverage Targets
- **Functionality:** 80%+ test coverage
- **Performance:** < 2s page load time
- **Accessibility:** WCAG 2.1 AA compliance
- **Browser Support:** Chrome, Firefox, Safari, Edge (last 2 versions)

## 📊 Monitoring & Metrics

### Key Performance Indicators
- **Performance:** Page load time < 2 seconds
- **Quality:** Lighthouse score > 90
- **Reliability:** 99.9% uptime via GitHub Pages
- **User Experience:** Interactive elements respond < 100ms
- **Accessibility:** Zero critical accessibility issues

### Monitoring Stack
- **Performance:** Google Lighthouse CI
- **Errors:** Browser console monitoring
- **Analytics:** Built-in GitHub Pages analytics
- **Uptime:** GitHub status monitoring

## 🔒 Security

### Security Measures
- **HTTPS:** Enforced via GitHub Pages
- **Content Security:** No inline scripts or styles
- **Dependencies:** Regular security audits via npm audit
- **Data Protection:** No sensitive data stored client-side
- **Access Control:** GitHub repository permissions

## 👥 Contributing

### Code Standards
- **HTML:** Semantic, accessible markup
- **CSS:** BEM methodology, mobile-first design
- **JavaScript:** ES6+, no frameworks, vanilla JS
- **Git:** Conventional commits, descriptive messages
- **Documentation:** Update docs with code changes

### Pull Request Process
1. Create feature branch from `main`
2. Make changes with tests
3. Run `npm run precommit`
4. Create PR with description
5. Wait for automated checks
6. Request review if needed
7. Merge after approval

## 🆘 Troubleshooting

### Common Issues

**Website not loading?**
```bash
# Check GitHub Pages status
curl -I https://hanbedrijfskunde.github.io/aecc/

# Verify deployment
git log --oneline -5
```

**Tests failing?**
```bash
# Debug specific test
npm run test:debug -- --grep "test name"

# Check browser console
npm run test:ui
```

**Development server issues?**
```bash
# Kill existing servers
pkill -f "python.*http.server"

# Restart
npm run dev
```

### Performance Issues
- Check Lighthouse report: `npm run lighthouse`
- Validate HTML: `npm run validate`
- Check browser console for errors
- Monitor network tab for slow requests

## 📞 Support

### Contact Information
- **Technical Issues:** Create issue in GitHub repository
- **Educational Content:** aec@hanbk.nl
- **Emergency:** Check ops/INCIDENTS.md

### Resources
- **Developer Guide:** [DEVELOPMENT.md](DEVELOPMENT.md)
- **Deployment Guide:** [DEPLOYMENT.md](DEPLOYMENT.md)
- **Testing Guide:** [TESTING.md](TESTING.md)
- **Operations Manual:** [ops/RUNBOOK.md](ops/RUNBOOK.md)

---

**Last Updated:** 2024-08-26  
**Version:** 2.0.1  
**Recent Fixes:** Quick Access buttons, Dutch language corrections
© 2024 HANBK - Hogeschool Arnhem en Nijmegen Business School