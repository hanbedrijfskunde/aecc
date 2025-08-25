// Comprehensive UX Audit based on Visual Inspection
const { test, expect } = require('@playwright/test');

test.describe('Comprehensive UX Audit', () => {
  test.setTimeout(90000);
  
  test('Full Platform UX Analysis', async ({ page, browser }) => {
    console.log('\n========== COMPREHENSIVE UX AUDIT ==========\n');
    
    const issues = [];
    
    // ===== HOMEPAGE ANALYSIS =====
    console.log('ANALYZING HOMEPAGE...');
    await page.goto('https://hanbedrijfskunde.github.io/aecc/', { waitUntil: 'networkidle' });
    await page.screenshot({ path: 'screenshots/full-audit-home.png', fullPage: true });
    
    // Issue: No clear explanation of "boardroom simulation"
    const pageContent = await page.content();
    if (!pageContent.includes('boardroom') && !pageContent.includes('Boardroom')) {
      issues.push({
        severity: 'CRITICAL',
        story: 'Emma (First Day)',
        issue: 'The term "boardroom simulation" is not explained on homepage',
        description: 'New students have no idea what this course format means',
        location: 'Homepage'
      });
    }
    
    // Issue: No onboarding flow
    const hasOnboarding = await page.locator('text=/getting started|hoe begin|eerste stappen/i').count();
    if (hasOnboarding === 0) {
      issues.push({
        severity: 'HIGH',
        story: 'Emma (First Day)',
        issue: 'No "Getting Started" or onboarding section',
        description: 'New students don\'t know where to begin',
        location: 'Homepage'
      });
    }
    
    // ===== STUDENT PORTAL ANALYSIS =====
    console.log('ANALYZING STUDENT PORTAL...');
    await page.goto('https://hanbedrijfskunde.github.io/aecc/studenten.html', { waitUntil: 'networkidle' });
    await page.screenshot({ path: 'screenshots/full-audit-students.png', fullPage: true });
    
    // Issue: Progress bar shows "7 van 7 weken voltooid" incorrectly
    const progressText = await page.locator('text=/van 7 weken voltooid/').textContent().catch(() => '');
    if (progressText.includes('7 van 7')) {
      issues.push({
        severity: 'HIGH',
        story: 'Mira (Progress)',
        issue: 'Progress shows "7 van 7 weken voltooid" for all students',
        description: 'Misleading progress indicator - shows course as complete when it\'s not',
        location: 'Progress bar'
      });
    }
    
    // Issue: Week cards are displayed but unclear structure
    const weekCards = await page.locator('.week-card').count();
    if (weekCards > 7) {
      issues.push({
        severity: 'MEDIUM',
        story: 'Emma (First Day)',
        issue: `${weekCards} week cards shown instead of 7`,
        description: 'Confusing duplication of week cards',
        location: 'Week overview'
      });
    }
    
    // Issue: No visual distinction for completed vs upcoming weeks
    const completedIndicators = await page.locator('.completed, .done, .finished').count();
    if (completedIndicators === 0) {
      issues.push({
        severity: 'HIGH',
        story: 'Mira (Progress)',
        issue: 'No visual distinction between completed and upcoming weeks',
        description: 'Students can\'t see what they\'ve done vs what\'s coming',
        location: 'Week cards'
      });
    }
    
    // Issue: Triangle conflict section appears empty
    const triangleContent = await page.locator('#triangle-conflict').textContent().catch(() => '');
    if (triangleContent.trim() === '' || triangleContent === 'Het Driehoeksconflict') {
      issues.push({
        severity: 'CRITICAL',
        story: 'Ahmed (International)',
        issue: 'Triangle conflict section is empty or just has title',
        description: 'Core concept of the course is not explained',
        location: 'Triangle conflict section'
      });
    }
    
    // Issue: No submission functionality visible
    const submitButtons = await page.locator('button:has-text("Submit"), button:has-text("Inleveren")').count();
    if (submitButtons === 0) {
      issues.push({
        severity: 'CRITICAL',
        story: 'Lars (Rush)',
        issue: 'No submit/upload buttons anywhere on the page',
        description: 'Students cannot submit their work',
        location: 'Throughout student portal'
      });
    }
    
    // Issue: Project Continuiteit section missing or empty
    const continuitySection = await page.locator('#project-continuiteit').count();
    if (continuitySection === 0) {
      issues.push({
        severity: 'CRITICAL',
        story: 'Mira (Progress)',
        issue: 'Project Continuiteit section missing',
        description: 'Students can\'t track their strategic decisions over time',
        location: 'Student portal'
      });
    }
    
    // ===== WEEK DETAIL MODAL TESTING =====
    console.log('TESTING WEEK DETAILS...');
    
    // Click on Week 3 to test Lars's scenario
    const week3Button = await page.locator('button:has-text("Week 3")').first();
    if (week3Button) {
      await week3Button.click();
      await page.waitForTimeout(1000);
      
      // Check if modal actually opens with content
      const modalVisible = await page.locator('.modal, [role="dialog"]').isVisible().catch(() => false);
      if (!modalVisible) {
        issues.push({
          severity: 'CRITICAL',
          story: 'Lars (Rush)',
          issue: 'Week detail modals don\'t open or are invisible',
          description: 'Cannot access week assignments',
          location: 'Week detail modals'
        });
      } else {
        // Check modal content
        const modalContent = await page.locator('.modal-content, .modal-body').textContent().catch(() => '');
        if (modalContent.length < 100) {
          issues.push({
            severity: 'CRITICAL',
            story: 'Lars (Rush)',
            issue: 'Week detail modal has no or minimal content',
            description: 'Assignment details are missing',
            location: 'Week 3 modal'
          });
        }
        
        // Check for copy button
        const copyButton = await page.locator('button:has-text("Copy"), button:has-text("Kopieer")').count();
        if (copyButton === 0) {
          issues.push({
            severity: 'HIGH',
            story: 'Lars (Rush)',
            issue: 'No copy button for AI prompts',
            description: 'Students must manually select and copy text',
            location: 'AI prompt section'
          });
        }
        
        // Close modal
        await page.keyboard.press('Escape');
      }
    }
    
    // ===== MOBILE TESTING =====
    console.log('TESTING MOBILE EXPERIENCE...');
    
    const mobileContext = await browser.newContext({
      viewport: { width: 375, height: 667 },
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)'
    });
    const mobilePage = await mobileContext.newPage();
    
    await mobilePage.goto('https://hanbedrijfskunde.github.io/aecc/studenten.html', { waitUntil: 'networkidle' });
    await mobilePage.screenshot({ path: 'screenshots/full-audit-mobile.png', fullPage: true });
    
    // Check horizontal scroll
    const hasHorizontalScroll = await mobilePage.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    
    if (hasHorizontalScroll) {
      issues.push({
        severity: 'HIGH',
        story: 'Sofia (Mobile)',
        issue: 'Horizontal scroll present on mobile',
        description: 'Poor mobile experience with unwanted horizontal scrolling',
        location: 'Mobile layout'
      });
    }
    
    // Check text readability
    const fontSize = await mobilePage.evaluate(() => {
      const p = document.querySelector('p');
      return p ? parseInt(window.getComputedStyle(p).fontSize) : 0;
    });
    
    if (fontSize < 14) {
      issues.push({
        severity: 'MEDIUM',
        story: 'Sofia (Mobile)',
        issue: 'Text too small on mobile',
        description: `Font size is ${fontSize}px, should be at least 14px`,
        location: 'Mobile typography'
      });
    }
    
    await mobileContext.close();
    
    // ===== ACCESSIBILITY TESTING =====
    console.log('TESTING ACCESSIBILITY...');
    
    // Keyboard navigation
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    const focusedElement = await page.evaluate(() => {
      return document.activeElement ? document.activeElement.tagName : null;
    });
    
    if (!focusedElement || focusedElement === 'BODY') {
      issues.push({
        severity: 'HIGH',
        story: 'Accessibility',
        issue: 'Tab navigation not working properly',
        description: 'Keyboard users cannot navigate the site',
        location: 'Global'
      });
    }
    
    // Check focus indicators
    const focusVisible = await page.evaluate(() => {
      const link = document.querySelector('a, button');
      if (link) {
        link.focus();
        const styles = window.getComputedStyle(link);
        return styles.outline !== 'none' || styles.boxShadow !== 'none';
      }
      return false;
    });
    
    if (!focusVisible) {
      issues.push({
        severity: 'HIGH',
        story: 'Accessibility',
        issue: 'No visible focus indicators',
        description: 'Keyboard users can\'t see what element is focused',
        location: 'Interactive elements'
      });
    }
    
    // ===== MISSING FEATURES =====
    console.log('CHECKING FOR MISSING FEATURES...');
    
    // Help/FAQ
    const hasHelp = await page.locator('text=/help|faq|hulp|veelgestelde/i').count();
    if (hasHelp === 0) {
      issues.push({
        severity: 'HIGH',
        story: 'Ahmed (International)',
        issue: 'No help section or FAQ',
        description: 'Students have no place to find answers to common questions',
        location: 'Student portal'
      });
    }
    
    // Glossary
    const hasGlossary = await page.locator('text=/glossary|begrippen|woordenlijst/i').count();
    if (hasGlossary === 0) {
      issues.push({
        severity: 'MEDIUM',
        story: 'Ahmed (International)',
        issue: 'No glossary for business terms',
        description: 'International students struggle with Dutch business terminology',
        location: 'Student resources'
      });
    }
    
    // Download/Export
    const hasExport = await page.locator('text=/download|export|exporteer/i').count();
    if (hasExport === 0) {
      issues.push({
        severity: 'MEDIUM',
        story: 'Mira (Progress)',
        issue: 'No way to export/download work',
        description: 'Students can\'t save their progress for final presentation',
        location: 'Student tools'
      });
    }
    
    // ===== GENERATE REPORT =====
    console.log('\n========== AUDIT COMPLETE ==========\n');
    
    const critical = issues.filter(i => i.severity === 'CRITICAL');
    const high = issues.filter(i => i.severity === 'HIGH');
    const medium = issues.filter(i => i.severity === 'MEDIUM');
    
    console.log(`TOTAL ISSUES: ${issues.length}`);
    console.log(`- CRITICAL: ${critical.length}`);
    console.log(`- HIGH: ${high.length}`);
    console.log(`- MEDIUM: ${medium.length}\n`);
    
    // Save detailed report
    const fs = require('fs');
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        total: issues.length,
        critical: critical.length,
        high: high.length,
        medium: medium.length
      },
      issues: issues,
      screenshots: [
        'screenshots/full-audit-home.png',
        'screenshots/full-audit-students.png',
        'screenshots/full-audit-mobile.png'
      ]
    };
    
    fs.writeFileSync('ux-audit-comprehensive.json', JSON.stringify(report, null, 2));
    
    // Print issues by story
    console.log('ISSUES BY USER STORY:\n');
    
    const stories = ['Emma (First Day)', 'Lars (Rush)', 'Sofia (Mobile)', 'Ahmed (International)', 'Mira (Progress)', 'Accessibility'];
    
    stories.forEach(story => {
      const storyIssues = issues.filter(i => i.story === story);
      if (storyIssues.length > 0) {
        console.log(`${story}:`);
        storyIssues.forEach(issue => {
          console.log(`  [${issue.severity}] ${issue.issue}`);
          console.log(`    ${issue.description}`);
        });
        console.log('');
      }
    });
    
    console.log('✅ Full report saved to ux-audit-comprehensive.json');
    console.log('📸 Screenshots saved to screenshots/');
    console.log('\nNext: Create GitHub issues for each finding');
    
    expect(issues.length).toBeGreaterThan(0);
  });
});