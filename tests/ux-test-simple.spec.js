// Simplified UX Testing for AEC Boardroom Simulation
const { test, expect } = require('@playwright/test');

test.describe('AEC Platform UX Testing', () => {
  
  test('Complete UX Audit', async ({ page, browser }) => {
    console.log('\n========== STARTING UX AUDIT ==========\n');
    
    const allIssues = [];
    
    // ===== STORY 1: FIRST DAY CONFUSION =====
    console.log('Testing Story 1: First Day Confusion (Emma)...');
    
    await page.goto('https://hanbedrijfskunde.github.io/aecc/');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'screenshots/story1-homepage.png', fullPage: true });
    
    // Check homepage clarity
    const heroContent = await page.locator('.hero-content, .hero, h1').first().textContent().catch(() => '');
    if (!heroContent.toLowerCase().includes('boardroom') && !heroContent.toLowerCase().includes('simulatie')) {
      allIssues.push({
        story: 'Emma (First Day)',
        severity: 'CRITICAL',
        issue: 'Homepage does not explain boardroom simulation concept',
        location: 'Homepage'
      });
    }
    
    // Navigate to student portal
    const studentLink = await page.locator('a:has-text("Student"), a:has-text("Studenten")').first();
    if (studentLink) {
      await studentLink.click();
      await page.waitForLoadState('networkidle');
      await page.screenshot({ path: 'screenshots/story1-student-portal.png', fullPage: true });
    } else {
      allIssues.push({
        story: 'Emma (First Day)',
        severity: 'CRITICAL', 
        issue: 'No clear link to student portal from homepage',
        location: 'Homepage navigation'
      });
    }
    
    // Check for week structure visibility
    const weekCards = await page.locator('.week-card, .week-item, [data-week]').count();
    if (weekCards < 7) {
      allIssues.push({
        story: 'Emma (First Day)',
        severity: 'HIGH',
        issue: `Only ${weekCards} week cards visible (expected 7)`,
        location: 'Student portal'
      });
    }
    
    // Check for role explanations
    const roles = await page.locator('.role-card, .role-item, [data-role]').count();
    if (roles < 4) {
      allIssues.push({
        story: 'Emma (First Day)',
        severity: 'HIGH',
        issue: `Only ${roles} role cards visible (expected 4: CEO, CFO, COO, CIO)`,
        location: 'Student portal'
      });
    }
    
    // ===== STORY 2: MONDAY MORNING RUSH =====
    console.log('Testing Story 2: Monday Morning Rush (Lars)...');
    
    // Try to access Week 3
    const week3 = await page.locator(':has-text("Week 3")').first();
    if (week3) {
      await week3.click().catch(() => {
        allIssues.push({
          story: 'Lars (Rush)',
          severity: 'CRITICAL',
          issue: 'Week 3 not clickable',
          location: 'Week navigation'
        });
      });
      
      await page.waitForTimeout(1000);
      await page.screenshot({ path: 'screenshots/story2-week3.png' });
      
      // Check for AI prompt
      const aiPrompt = await page.locator('.ai-prompt, .prompt, :has-text("AI")').count();
      if (aiPrompt === 0) {
        allIssues.push({
          story: 'Lars (Rush)',
          severity: 'CRITICAL',
          issue: 'No AI prompt found in week details',
          location: 'Week 3 modal'
        });
      }
      
      // Check for copy functionality
      const copyBtn = await page.locator('button:has-text("Copy"), button:has-text("Kopieer")').count();
      if (copyBtn === 0) {
        allIssues.push({
          story: 'Lars (Rush)',
          severity: 'HIGH',
          issue: 'No copy button for AI prompt',
          location: 'Week 3 modal'
        });
      }
      
      // Check for deadline
      const deadline = await page.locator(':has-text("deadline"), :has-text("Deadline")').count();
      if (deadline === 0) {
        allIssues.push({
          story: 'Lars (Rush)',
          severity: 'CRITICAL',
          issue: 'No deadline information visible',
          location: 'Week 3 details'
        });
      }
      
      // Close modal if open
      const closeBtn = await page.locator('.close, button:has-text("×"), button:has-text("X")').first();
      if (closeBtn) await closeBtn.click().catch(() => {});
    }
    
    // ===== STORY 3: MOBILE EXPERIENCE =====
    console.log('Testing Story 3: Mobile Experience (Sofia)...');
    
    // Create new mobile context
    const mobileContext = await browser.newContext({
      viewport: { width: 375, height: 667 },
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15'
    });
    const mobilePage = await mobileContext.newPage();
    
    await mobilePage.goto('https://hanbedrijfskunde.github.io/aecc/studenten.html');
    await mobilePage.waitForLoadState('networkidle');
    await mobilePage.screenshot({ path: 'screenshots/story3-mobile.png', fullPage: true });
    
    // Check for horizontal scroll
    const hasHScroll = await mobilePage.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    
    if (hasHScroll) {
      allIssues.push({
        story: 'Sofia (Mobile)',
        severity: 'HIGH',
        issue: 'Horizontal scroll on mobile',
        location: 'Mobile layout'
      });
    }
    
    // Check mobile menu
    const hasMobileMenu = await mobilePage.locator('.mobile-menu, .hamburger, .burger').count();
    const desktopNavVisible = await mobilePage.locator('nav').isVisible().catch(() => false);
    
    if (desktopNavVisible && hasMobileMenu === 0) {
      allIssues.push({
        story: 'Sofia (Mobile)',
        severity: 'HIGH',
        issue: 'Desktop navigation showing on mobile (no mobile menu)',
        location: 'Mobile navigation'
      });
    }
    
    // Check triangle conflict on mobile
    const triangleWidth = await mobilePage.locator('.triangle-conflict, .triangle').first().evaluate(el => {
      return el ? el.getBoundingClientRect().width : 0;
    }).catch(() => 0);
    
    if (triangleWidth > 375) {
      allIssues.push({
        story: 'Sofia (Mobile)',
        severity: 'MEDIUM',
        issue: 'Triangle conflict diagram too wide for mobile',
        location: 'Triangle section'
      });
    }
    
    await mobileContext.close();
    
    // ===== STORY 4: INTERNATIONAL STUDENT =====
    console.log('Testing Story 4: International Student (Ahmed)...');
    
    // Check for language options
    const langToggle = await page.locator(':has-text("English"), :has-text("Language")').count();
    if (langToggle === 0) {
      allIssues.push({
        story: 'Ahmed (International)',
        severity: 'MEDIUM',
        issue: 'No language toggle for international students',
        location: 'Navigation'
      });
    }
    
    // Check for explanations of key concepts
    const hasGlossary = await page.locator(':has-text("Glossary"), :has-text("Begrippen"), :has-text("Uitleg")').count();
    if (hasGlossary === 0) {
      allIssues.push({
        story: 'Ahmed (International)',
        severity: 'HIGH',
        issue: 'No glossary or term explanations',
        location: 'Student resources'
      });
    }
    
    // Check for help section
    const hasHelp = await page.locator(':has-text("Help"), :has-text("FAQ"), :has-text("Hulp")').count();
    if (hasHelp === 0) {
      allIssues.push({
        story: 'Ahmed (International)',
        severity: 'HIGH',
        issue: 'No help section or FAQ',
        location: 'Student portal'
      });
    }
    
    // ===== STORY 5: PROGRESS TRACKING =====
    console.log('Testing Story 5: Progress Tracking (Mira)...');
    
    // Check for progress indicators
    const hasProgress = await page.locator('.progress, [role="progressbar"], :has-text("Voortgang")').count();
    if (hasProgress === 0) {
      allIssues.push({
        story: 'Mira (Progress)',
        severity: 'HIGH',
        issue: 'No progress indicator visible',
        location: 'Student dashboard'
      });
    }
    
    // Check for Project Continuiteit
    const hasContinuity = await page.locator(':has-text("Continuïteit"), :has-text("Continuiteit")').count();
    if (hasContinuity === 0) {
      allIssues.push({
        story: 'Mira (Progress)',
        severity: 'CRITICAL',
        issue: 'No Project Continuïteit section',
        location: 'Student portal'
      });
    }
    
    // Check for submission history
    const hasHistory = await page.locator(':has-text("Geschiedenis"), :has-text("History"), :has-text("Ingeleverd")').count();
    if (hasHistory === 0) {
      allIssues.push({
        story: 'Mira (Progress)',
        severity: 'HIGH',
        issue: 'No submission history visible',
        location: 'Student portal'
      });
    }
    
    // ===== ACCESSIBILITY CHECK =====
    console.log('Testing Accessibility...');
    
    // Tab navigation
    await page.keyboard.press('Tab');
    const firstFocus = await page.evaluate(() => document.activeElement?.tagName);
    if (!firstFocus || firstFocus === 'BODY') {
      allIssues.push({
        story: 'Accessibility',
        severity: 'HIGH',
        issue: 'Tab navigation not working',
        location: 'Keyboard navigation'
      });
    }
    
    // Check for focus indicators
    const hasFocusStyles = await page.evaluate(() => {
      const link = document.querySelector('a, button');
      if (link) {
        link.focus();
        const styles = window.getComputedStyle(link);
        return styles.outline !== 'none' || styles.boxShadow !== 'none';
      }
      return false;
    });
    
    if (!hasFocusStyles) {
      allIssues.push({
        story: 'Accessibility',
        severity: 'HIGH',
        issue: 'No visible focus indicators',
        location: 'Interactive elements'
      });
    }
    
    // Check for missing alt text
    const imagesWithoutAlt = await page.evaluate(() => {
      const images = document.querySelectorAll('img');
      let count = 0;
      images.forEach(img => {
        if (!img.alt && !img.getAttribute('aria-label')) count++;
      });
      return count;
    });
    
    if (imagesWithoutAlt > 0) {
      allIssues.push({
        story: 'Accessibility',
        severity: 'MEDIUM',
        issue: `${imagesWithoutAlt} images without alt text`,
        location: 'Images'
      });
    }
    
    // ===== ADDITIONAL CHECKS =====
    console.log('Additional UX checks...');
    
    // Check for submit/upload functionality
    const hasSubmit = await page.locator('button:has-text("Submit"), button:has-text("Inleveren"), :has-text("Upload")').count();
    if (hasSubmit === 0) {
      allIssues.push({
        story: 'General',
        severity: 'CRITICAL',
        issue: 'No submit/upload functionality found',
        location: 'Student portal'
      });
    }
    
    // Check loading states
    const hasLoadingStates = await page.locator('.loading, .spinner, [class*="load"]').count();
    if (hasLoadingStates === 0) {
      allIssues.push({
        story: 'General',
        severity: 'MEDIUM',
        issue: 'No loading indicators found',
        location: 'Throughout site'
      });
    }
    
    // ===== PRINT SUMMARY =====
    console.log('\n========== UX AUDIT COMPLETE ==========\n');
    console.log(`Total issues found: ${allIssues.length}\n`);
    
    // Group by severity
    const critical = allIssues.filter(i => i.severity === 'CRITICAL');
    const high = allIssues.filter(i => i.severity === 'HIGH');
    const medium = allIssues.filter(i => i.severity === 'MEDIUM');
    
    console.log('BY SEVERITY:');
    console.log(`- CRITICAL: ${critical.length} issues`);
    console.log(`- HIGH: ${high.length} issues`);
    console.log(`- MEDIUM: ${medium.length} issues`);
    
    console.log('\nCRITICAL ISSUES:');
    critical.forEach(issue => {
      console.log(`  [${issue.story}] ${issue.issue}`);
      console.log(`    Location: ${issue.location}`);
    });
    
    console.log('\nHIGH PRIORITY ISSUES:');
    high.forEach(issue => {
      console.log(`  [${issue.story}] ${issue.issue}`);
      console.log(`    Location: ${issue.location}`);
    });
    
    console.log('\nMEDIUM PRIORITY ISSUES:');
    medium.forEach(issue => {
      console.log(`  [${issue.story}] ${issue.issue}`);
      console.log(`    Location: ${issue.location}`);
    });
    
    // Save issues to file for GitHub issue creation
    const fs = require('fs');
    fs.writeFileSync('ux-issues.json', JSON.stringify(allIssues, null, 2));
    
    console.log('\n✅ Issues saved to ux-issues.json');
    console.log('📸 Screenshots saved to screenshots/');
    console.log('\nNext step: Create GitHub issues at https://github.com/hanbedrijfskunde/aecc/issues');
    
    // Expect at least some checks to have run
    expect(allIssues).toBeDefined();
  });
});