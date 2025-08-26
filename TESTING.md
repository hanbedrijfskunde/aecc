# Testing Guide

## 🧪 Testing Strategy

### Test Pyramid
```
    🔺 Manual Testing (10%)
      - Exploratory testing
      - User acceptance testing
      
    🔺 E2E Tests (20%)
      - Playwright automation
      - Critical user workflows
      
    🔺 Integration Tests (30%)
      - Component interactions
      - API integrations
      
    🔺 Unit Tests (40%)
      - Function-level testing
      - Isolated components
```

### Testing Philosophy
- **Quality over quantity** - Focus on critical user paths
- **Fast feedback** - Tests run in under 2 minutes
- **Reliable tests** - No flaky tests in CI/CD
- **Maintainable** - Tests are easy to update and understand

## 🚀 Quick Start

### Setup Testing Environment
```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install

# Run all tests
npm test

# Run tests with UI
npm run test:ui
```

### Test Execution
```bash
# Full test suite
npm test

# Specific test file
npx playwright test tests/comprehensive-ux-audit.spec.js

# Tests with browser UI
npm run test:ui

# Debug mode
npm run test:debug

# Headed mode (see browser)
npx playwright test --headed

# Specific test by name
npx playwright test --grep "student portal"
```

## 📋 Test Categories

### 1. End-to-End Tests (Playwright)

**Location:** `tests/*.spec.js`

**Coverage:**
- Complete user workflows
- Cross-page navigation
- Interactive elements
- Form submissions
- Mobile responsiveness

**Example:**
```javascript
// tests/student-portal.spec.js
import { test, expect } from '@playwright/test';

test.describe('Student Portal', () => {
  test('onboarding flow works correctly', async ({ page }) => {
    await page.goto('/studenten.html');
    
    // Verify onboarding tile is visible
    await expect(page.locator('.onboarding-tile')).toBeVisible();
    
    // Test tab switching
    await page.click('button[onclick="showOnboardingTab(\'roles\')"]');
    await expect(page.locator('#roles')).toHaveClass(/active/);
    
    // Test role selector
    await page.selectOption('#role-dropdown', 'ceo');
    await expect(page.locator('#role-details')).toContainText('Balans-kunstenaar');
  });
});
```

### 2. Performance Tests

**Tools:** Lighthouse, WebPageTest  
**Metrics:** Core Web Vitals, Load times, Bundle sizes

```javascript
// Performance test example
test('performance benchmarks', async ({ page }) => {
  await page.goto('/');
  
  // Measure page load time
  const loadTime = await page.evaluate(() => {
    const perfData = performance.timing;
    return perfData.loadEventEnd - perfData.navigationStart;
  });
  
  expect(loadTime).toBeLessThan(2000); // < 2 seconds
});
```

### 3. Accessibility Tests

**Tools:** axe-playwright, ARIA validators  
**Standards:** WCAG 2.1 AA compliance

```javascript
import AxeBuilder from '@axe-core/playwright';

test('accessibility compliance', async ({ page }) => {
  await page.goto('/studenten.html');
  
  const accessibilityScanResults = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa'])
    .analyze();
  
  expect(accessibilityScanResults.violations).toEqual([]);
});
```

### 4. Cross-browser Tests

**Browsers:** Chrome, Firefox, Safari, Edge  
**Configurations:** Desktop, Mobile, Tablet

```javascript
// playwright.config.js
export default {
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'mobile-chrome', use: { ...devices['Pixel 5'] } },
    { name: 'mobile-safari', use: { ...devices['iPhone 12'] } },
  ],
};
```

### 5. Visual Regression Tests

**Tool:** Playwright screenshots  
**Coverage:** Critical UI components

```javascript
test('visual regression - student portal', async ({ page }) => {
  await page.goto('/studenten.html');
  
  // Full page screenshot
  await expect(page).toHaveScreenshot('student-portal-full.png');
  
  // Component screenshot
  await expect(page.locator('.onboarding-tile'))
    .toHaveScreenshot('onboarding-tile.png');
});
```

## 🔧 Test Configuration

### Playwright Configuration
```javascript
// playwright.config.js
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  expect: { timeout: 5000 },
  
  // Run tests in parallel
  fullyParallel: true,
  
  // Reporter configuration
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/results.xml' }]
  ],
  
  use: {
    baseURL: 'http://localhost:8000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox', 
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],
  
  // Test server
  webServer: {
    command: 'python -m http.server 8000 --directory docs',
    port: 8000,
    reuseExistingServer: !process.env.CI,
  },
});
```

### Test Environment Setup
```bash
# .env.test
PLAYWRIGHT_HEADLESS=true
PLAYWRIGHT_TIMEOUT=30000
PLAYWRIGHT_BASE_URL=http://localhost:8000
```

## 📊 Test Reporting

### Generate Reports
```bash
# Run tests and generate HTML report
npm test

# Show HTML report
npx playwright show-report

# Generate JUnit XML for CI
npx playwright test --reporter=junit

# Generate JSON results
npx playwright test --reporter=json
```

### Report Analysis
- **Test Results:** Pass/fail status for each test
- **Screenshots:** Visual evidence of failures
- **Videos:** Recordings of failed test runs
- **Traces:** Detailed execution timeline
- **Performance Metrics:** Load times and Core Web Vitals

### CI/CD Integration
```yaml
# .github/workflows/test.yml
- name: Run Playwright tests
  run: npx playwright test
  
- name: Upload test results
  uses: actions/upload-artifact@v3
  if: always()
  with:
    name: playwright-report
    path: playwright-report/
```

## 📱 Mobile Testing

### Device Testing Matrix
| Device | Resolution | Browser |
|--------|------------|---------|
| iPhone SE | 375x667 | Safari |
| iPhone 12 | 390x844 | Safari |
| Pixel 5 | 393x851 | Chrome |
| iPad | 768x1024 | Safari |
| Galaxy S21 | 360x800 | Chrome |

### Mobile Test Example
```javascript
test.describe('Mobile responsiveness', () => {
  test('navigation works on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Test mobile navigation
    await expect(page.locator('.portal-card')).toHaveCount(3);
    await page.tap('.portal-card:first-child');
    
    // Verify navigation occurred
    await expect(page).toHaveURL(/studenten\.html/);
  });
});
```

## 🛠️ Test Maintenance

### Test Organization
```
tests/
├── comprehensive-ux-audit.spec.js    # Full user journey tests
├── quick-ux-audit.spec.js            # Smoke tests  
├── ux-test-simple.spec.js            # Basic UX validations
├── test-week-modals.spec.js          # Week modal functionality
├── test-sprint2-ux.spec.js           # Sprint 2 feature tests
├── ux-testing.spec.js                # General UX test suite
└── manual/                           # Manual verification scripts
    ├── test-duplicate-weeks.js       # Week duplication checks
    ├── test-onboarding-faq.js        # FAQ functionality
    ├── test-onboarding-tile.js       # Onboarding tile tests
    ├── test-specific-elements.js     # Element-specific tests
    └── test-sprint-verification.js   # Sprint verification
```

### Best Practices

#### 1. Test Structure
```javascript
test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    // Setup code
  });
  
  test('should do something specific', async ({ page }) => {
    // Arrange
    await page.goto('/page');
    
    // Act
    await page.click('button');
    
    // Assert
    await expect(page.locator('result')).toBeVisible();
  });
});
```

#### 2. Selectors Strategy
```javascript
// Good: Use data attributes
await page.click('[data-testid="submit-button"]');

// Good: Use accessible selectors
await page.click('button[aria-label="Submit form"]');

// Avoid: Fragile CSS selectors
await page.click('.btn.btn-primary.mt-3'); // Bad
```

#### 3. Assertions
```javascript
// Good: Specific assertions
await expect(page.locator('.error-message')).toContainText('Required field');

// Good: Wait for state
await expect(page.locator('.loading')).not.toBeVisible();

// Avoid: Hard waits
await page.waitForTimeout(5000); // Bad
```

#### 4. Test Data Management
```javascript
// Good: Use test data files
const testData = require('./fixtures/student-data.json');

test('student registration', async ({ page }) => {
  await page.fill('#name', testData.validStudent.name);
  await page.fill('#email', testData.validStudent.email);
});
```

## 🐛 Debugging Tests

### Debug Commands
```bash
# Run single test in debug mode
npx playwright test --debug --grep "specific test"

# Run with browser visible
npx playwright test --headed

# Generate trace for failed tests
npx playwright test --trace on

# Show trace viewer
npx playwright show-trace trace.zip
```

### Common Issues

#### Flaky Tests
```javascript
// Add retry logic for flaky elements
await expect(async () => {
  await page.click('#dynamic-button');
  await expect(page.locator('.result')).toBeVisible();
}).toPass({ timeout: 10000 });
```

#### Timing Issues
```javascript
// Wait for network idle
await page.goto('/page', { waitUntil: 'networkidle' });

// Wait for specific element
await page.waitForSelector('.content', { state: 'visible' });

// Wait for JavaScript to complete
await page.waitForFunction(() => window.dataLoaded === true);
```

#### Element Not Found
```javascript
// Check element exists before interacting
const button = page.locator('.submit-btn');
await expect(button).toBeVisible();
await button.click();
```

## 📈 Test Metrics & KPIs

### Coverage Targets
- **E2E Test Coverage:** 80% of critical user paths
- **Performance Tests:** All pages load < 2 seconds
- **Accessibility:** Zero critical violations
- **Cross-browser:** 95% pass rate across all browsers
- **Mobile:** 100% responsive design compliance

### Quality Gates
```javascript
// Example quality gate checks
test('quality gates', async ({ page }) => {
  await page.goto('/');
  
  // Performance gate
  const loadTime = await measureLoadTime(page);
  expect(loadTime).toBeLessThan(2000);
  
  // Accessibility gate
  const a11yViolations = await runA11yAudit(page);
  expect(a11yViolations.critical).toHaveLength(0);
  
  // Functionality gate
  const functionalErrors = await getConsoleErrors(page);
  expect(functionalErrors).toHaveLength(0);
});
```

### Reporting Dashboard
- **Test Results:** Daily test execution results
- **Performance Trends:** Page load time over time
- **Error Rates:** Failure rate by test category
- **Coverage Metrics:** Test coverage percentage
- **Quality Trends:** Overall quality score

## 🚀 Continuous Testing

### CI/CD Integration
```yaml
# GitHub Actions workflow
name: Test Suite
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      
      - name: Install dependencies
        run: npm ci
      
      - name: Install Playwright
        run: npx playwright install --with-deps
      
      - name: Run tests
        run: npm test
      
      - name: Upload results
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: test-results
          path: test-results/
```

### Scheduled Testing
```yaml
# Run tests nightly
on:
  schedule:
    - cron: '0 2 * * *'  # 2 AM daily
```

---

**Last Updated:** 2024-08-26  
**Review Schedule:** Monthly  
**Recent Changes:** Reorganized test files, updated Playwright config
**Contact:** Create GitHub issue for testing questions