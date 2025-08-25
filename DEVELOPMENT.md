# Development Guide

## 🛠️ Developer Setup

### Prerequisites
- **Node.js 18+** - For tooling and testing
- **Git** - Version control
- **Modern Browser** - Chrome, Firefox, Safari, or Edge
- **VS Code** (recommended) - With extensions:
  - HTML CSS Support
  - JavaScript (ES6) code snippets
  - Playwright Test for VS Code

### Initial Setup
```bash
# Clone repository
git clone https://github.com/hanbedrijfskunde/aecc.git
cd aecc

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install

# Start development server
npm run dev
```

### Development Environment
```bash
# Development server (port 8000)
npm run dev

# Alternative servers
npx serve docs          # Using serve package
python -m http.server 8000 --directory docs  # Python server
```

## 🏗️ Architecture & Code Standards

### File Organization
```
docs/                   # Production website
├── index.html         # Landing page with navigation
├── studenten.html     # Student portal with onboarding
├── docenten.html      # Teacher dashboard with timing tools
├── commissie.html     # Committee portal with risk matrix
├── content.json       # Course content database
├── styles.css         # Shared global styles
├── script.js          # Shared JavaScript utilities
├── studenten-*.css    # Portal-specific styles
├── studenten-*.js     # Portal-specific JavaScript
└── tests/            # Test HTML pages
```

### HTML Standards
- **Semantic markup** - Use proper HTML5 elements
- **Accessibility** - ARIA labels, alt text, proper headings
- **Mobile-first** - Responsive design from smallest screen up
- **No inline styles** - All styling in CSS files
- **Valid HTML5** - Validate with npm run validate

```html
<!-- Good: Semantic and accessible -->
<section class="week-navigator" aria-labelledby="weeks-heading">
  <h2 id="weeks-heading" class="section-title">7 Weken Programma</h2>
  <article class="week-card" data-week="1">
    <button class="week-btn" onclick="showWeekDetails(1)">Open Week →</button>
  </article>
</section>
```

### CSS Standards
- **CSS Custom Properties** - Use CSS variables for theming
- **BEM Methodology** - Block__Element--Modifier naming
- **Mobile-first** - min-width media queries
- **No vendor prefixes** - Use autoprefixer if needed
- **Performance optimized** - No expensive animations

```css
/* CSS Custom Properties */
:root {
  --primary-green: #8FD14F;
  --accent-red: #E63946;
  --space-md: 1rem;
  --border-radius: 8px;
  --transition-base: 0.3s ease;
}

/* BEM Methodology */
.week-card {
  /* Block styles */
}

.week-card__header {
  /* Element styles */
}

.week-card--active {
  /* Modifier styles */
}
```

### JavaScript Standards
- **ES6+ features** - Modern JavaScript syntax
- **No frameworks** - Pure vanilla JavaScript
- **Modular code** - Small, focused functions
- **Error handling** - Try-catch blocks for async operations
- **Performance** - Debounced events, efficient DOM queries

```javascript
// Good: Modern, modular, error-handled
async function loadContent() {
  try {
    const response = await fetch('content.json');
    if (!response.ok) throw new Error('Content load failed');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Content loading error:', error);
    return { weeks: [], roles: {} }; // Fallback
  }
}

// Debounced search
const searchHandler = debounce((query) => {
  filterContent(query);
}, 300);
```

## 🧪 Testing Strategy

### Test Types
1. **Manual Tests** - Quick validation during development
2. **Playwright E2E** - Full user workflow testing
3. **Performance** - Lighthouse audits
4. **Accessibility** - WCAG 2.1 AA compliance
5. **Cross-browser** - Chrome, Firefox, Safari, Edge

### Running Tests
```bash
# Run all tests
npm test

# Run tests with UI
npm run test:ui

# Debug failing tests
npm run test:debug

# Run specific test file
npx playwright test tests/comprehensive-ux-audit.spec.js

# Generate test report
npx playwright show-report
```

### Writing Tests
```javascript
// Example Playwright test
import { test, expect } from '@playwright/test';

test('student portal loads correctly', async ({ page }) => {
  await page.goto('/studenten.html');
  
  // Check critical elements
  await expect(page.locator('.onboarding-tile')).toBeVisible();
  await expect(page.locator('.week-navigator')).toBeVisible();
  
  // Test functionality
  await page.click('.onboarding-toggle');
  await expect(page.locator('.onboarding-tile')).toHaveClass(/collapsed/);
});
```

### Test Coverage Targets
- **Functionality:** 80%+ of user workflows tested
- **Performance:** All pages load < 2 seconds
- **Accessibility:** Zero critical violations
- **Browser Support:** Last 2 versions of major browsers

## 🔄 Git Workflow

### Branch Strategy
- **main** - Production-ready code
- **feature/xyz** - New features
- **fix/xyz** - Bug fixes
- **docs/xyz** - Documentation updates

### Commit Messages
Use [Conventional Commits](https://www.conventionalcommits.org/):
```bash
feat: add onboarding tile with role selector
fix: resolve modal scrolling issue on mobile
docs: update deployment procedures
test: add accessibility test coverage
```

### Pull Request Process
```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "feat: implement new feature"

# Run pre-commit checks
npm run precommit

# Push and create PR
git push origin feature/new-feature
```

### Pre-commit Checklist
- [ ] Code formatted with Prettier
- [ ] All tests passing
- [ ] HTML validated
- [ ] No console errors
- [ ] Accessibility verified
- [ ] Mobile responsive

## 🚀 Development Workflow

### Daily Development
1. **Start development server:** `npm run dev`
2. **Make changes** to files in `docs/` folder
3. **Test changes** locally in browser
4. **Run tests** with `npm test`
5. **Format code** with `npm run format`
6. **Commit changes** with descriptive message

### Adding New Features
1. **Plan the feature** - Document requirements
2. **Create branch** - `git checkout -b feature/name`
3. **Write tests first** - Test-driven development
4. **Implement feature** - Keep changes small and focused
5. **Test thoroughly** - Manual and automated testing
6. **Create PR** - With clear description
7. **Get review** - Address feedback
8. **Merge** - After all checks pass

### Debugging Techniques

#### Browser DevTools
- **Console tab** - Check for JavaScript errors
- **Network tab** - Monitor resource loading
- **Elements tab** - Inspect HTML/CSS
- **Lighthouse tab** - Performance audits
- **Accessibility tab** - WCAG compliance

#### Common Debug Commands
```bash
# Check HTML validity
npm run validate

# Performance audit
npm run lighthouse

# CSS linting
npm run lint:css

# JavaScript linting  
npm run lint:js

# Clean up test artifacts
npm run clean
```

#### VS Code Debugging
```json
// .vscode/launch.json
{
  "configurations": [
    {
      "name": "Launch Chrome",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:8000",
      "webRoot": "${workspaceFolder}/docs"
    }
  ]
}
```

## 📱 Mobile Development

### Testing Strategy
- **Chrome DevTools** - Mobile device emulation
- **Real devices** - Test on actual phones/tablets
- **Responsive breakpoints** - 320px, 768px, 1024px, 1200px

### Mobile-first CSS
```css
/* Mobile first - base styles */
.week-card {
  flex-direction: column;
  padding: 1rem;
}

/* Tablet and up */
@media (min-width: 768px) {
  .week-card {
    flex-direction: row;
    padding: 1.5rem;
  }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .week-card {
    padding: 2rem;
  }
}
```

### Touch-friendly Design
- **Minimum touch targets:** 44x44px
- **Generous spacing** - Easy finger navigation
- **Avoid hover effects** - Use focus states instead
- **Optimize tap delays** - Remove 300ms tap delay

## 🔧 Tools & Utilities

### NPM Scripts Reference
```bash
npm run dev          # Start development server
npm test             # Run Playwright tests
npm run test:ui      # Run tests with browser UI
npm run test:debug   # Debug failing tests
npm run deploy       # Deploy to GitHub Pages
npm run validate     # Validate HTML syntax
npm run lighthouse   # Performance audit
npm run format       # Format with Prettier
npm run lint:css     # Lint CSS files
npm run lint:js      # Lint JavaScript files
npm run precommit    # Pre-commit validation
npm run clean        # Clean test artifacts
npm run backup       # Create backup
npm run serve        # Alternative development server
npm run watch        # Watch files and run tests
```

### VS Code Extensions
- **HTML CSS Support** - Intellisense for HTML/CSS
- **JavaScript (ES6) code snippets** - JS snippets
- **Playwright Test for VS Code** - Test runner integration
- **Prettier** - Code formatting
- **GitLens** - Git blame and history
- **Live Server** - Alternative development server

### Browser Extensions
- **Lighthouse** - Performance and accessibility audits
- **axe DevTools** - Accessibility testing
- **WAVE** - Web accessibility evaluation

## 🐛 Troubleshooting

### Common Issues

**Development server won't start?**
```bash
# Kill existing processes
pkill -f "python.*http.server"
pkill -f "serve"

# Check port availability
lsof -i :8000

# Start server
npm run dev
```

**Tests failing unexpectedly?**
```bash
# Clear Playwright cache
npx playwright install --force

# Run with debug
npm run test:debug

# Check browser console in test
npx playwright test --debug
```

**CSS not loading?**
- Check file paths (relative vs absolute)
- Verify server is serving CSS files
- Clear browser cache (Cmd+Shift+R)
- Check console for 404 errors

**JavaScript errors?**
- Check browser console
- Verify all scripts loaded
- Check for typos in function names
- Validate JSON syntax

### Performance Issues
- **Large images** - Optimize and compress
- **Too many requests** - Minimize HTTP requests
- **Render blocking** - Avoid large CSS files
- **JavaScript errors** - Fix console errors first

### Getting Help
1. **Check documentation** - This guide and others
2. **Search issues** - GitHub repository issues
3. **Browser DevTools** - Debug locally first
4. **Create issue** - With reproduction steps
5. **Contact team** - For complex problems

---

**Last Updated:** 2024-08-25  
**Next Review:** Weekly during development