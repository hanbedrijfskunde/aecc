// UX/UI Testing Suite for AEC Boardroom Simulation
// Testing real student journeys to identify UX issues

const { test, expect } = require('@playwright/test');

// Configure test settings
test.use({
  baseURL: 'https://hanbedrijfskunde.github.io/aecc/',
  screenshot: 'only-on-failure',
  video: 'retain-on-failure',
});

test.describe('Student Journey Tests', () => {
  
  // Story 1: First Day Confusion - Emma, first-year business student
  test('Story 1: First Day Confusion - New Student Onboarding', async ({ page }) => {
    const issues = [];
    
    // Step 1: Land on homepage
    await page.goto('https://hanbedrijfskunde.github.io/aecc/');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'screenshots/story1-1-homepage.png', fullPage: true });
    
    // Check if purpose is clear
    const heroText = await page.locator('.hero-content').textContent().catch(() => null);
    if (!heroText || !heroText.includes('boardroom')) {
      issues.push({
        severity: 'high',
        description: 'Homepage does not clearly explain what boardroom simulation is',
        location: 'Homepage hero section'
      });
    }
    
    // Look for "How to start" or "Getting started" guidance
    const gettingStarted = await page.locator('text=/get started|how to start|wat is dit/i').count();
    if (gettingStarted === 0) {
      issues.push({
        severity: 'critical',
        description: 'No clear getting started guide for new students',
        location: 'Homepage'
      });
    }
    
    // Step 2: Navigate to student portal
    await page.click('text=/student/i');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'screenshots/story1-2-student-portal.png', fullPage: true });
    
    // Check for onboarding or introduction
    const onboarding = await page.locator('text=/welkom|introductie|hoe werkt/i').count();
    if (onboarding === 0) {
      issues.push({
        severity: 'high',
        description: 'Student portal lacks welcoming introduction or explanation',
        location: 'Student portal entry'
      });
    }
    
    // Step 3: Try to understand 7-week structure
    const weekOverview = await page.locator('.week-card, .week-item, [class*="week"]').count();
    if (weekOverview < 7) {
      issues.push({
        severity: 'critical',
        description: 'Seven-week structure not immediately visible',
        location: 'Student portal main view'
      });
    }
    
    // Step 4: Understanding roles
    const roleCards = await page.locator('.role-card, [class*="role"]').count();
    if (roleCards < 4) {
      issues.push({
        severity: 'high',
        description: 'Four executive roles (CEO/CFO/COO/CIO) not clearly displayed',
        location: 'Student portal roles section'
      });
    }
    
    // Step 5: Find Week 1 assignment
    const week1 = await page.locator('text=/week 1/i').first();
    if (week1) {
      await week1.click();
      await page.waitForTimeout(1000);
      await page.screenshot({ path: 'screenshots/story1-3-week1-details.png', fullPage: true });
      
      // Check for clear submission instructions
      const submitInfo = await page.locator('text=/inleveren|deadline|submit/i').count();
      if (submitInfo === 0) {
        issues.push({
          severity: 'critical',
          description: 'No clear submission instructions in week details',
          location: 'Week 1 details modal/section'
        });
      }
    }
    
    // Log all issues found
    console.log('Story 1 Issues Found:', issues.length);
    issues.forEach(issue => console.log(`- [${issue.severity.toUpperCase()}] ${issue.description}`));
    
    return issues;
  });
  
  // Story 2: Monday Morning Rush - Lars needs to submit Week 3 assignment
  test('Story 2: Monday Morning Rush - Urgent Assignment Submission', async ({ page }) => {
    const issues = [];
    const startTime = Date.now();
    
    // Direct navigation to student portal
    await page.goto('https://hanbedrijfskunde.github.io/aecc/studenten.html');
    await page.waitForLoadState('networkidle');
    
    // Find Week 3 quickly
    const week3Visible = await page.locator('text=/week 3/i').isVisible().catch(() => false);
    if (!week3Visible) {
      issues.push({
        severity: 'critical',
        description: 'Week 3 not immediately visible on page load',
        location: 'Student portal main view'
      });
    }
    
    // Click Week 3
    await page.click('text=/week 3/i').catch(() => {
      issues.push({
        severity: 'critical',
        description: 'Cannot click on Week 3 - might be missing or non-interactive',
        location: 'Week navigation'
      });
    });
    
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'screenshots/story2-1-week3-modal.png', fullPage: true });
    
    // Look for AI prompt
    const aiPromptSection = await page.locator('text=/ai prompt|ai opdracht|prompt voor ai/i').count();
    if (aiPromptSection === 0) {
      issues.push({
        severity: 'critical',
        description: 'AI prompt not clearly labeled or missing',
        location: 'Week 3 details'
      });
    }
    
    // Check for copy button
    const copyButton = await page.locator('button:has-text(/copy|kopieer/i)').count();
    if (copyButton === 0) {
      issues.push({
        severity: 'high',
        description: 'No copy button for AI prompt - students must select manually',
        location: 'AI prompt section'
      });
    }
    
    // Check for deadline visibility
    const deadline = await page.locator('text=/deadline|inleveren voor|uiterlijk/i').count();
    if (deadline === 0) {
      issues.push({
        severity: 'critical',
        description: 'Deadline not clearly visible',
        location: 'Week 3 assignment'
      });
    }
    
    // Check for submission format requirements
    const format = await page.locator('text=/formaat|format|powerpoint|pdf|presentatie/i').count();
    if (format === 0) {
      issues.push({
        severity: 'high',
        description: 'Submission format requirements not specified',
        location: 'Week 3 assignment details'
      });
    }
    
    // Look for submit button
    const submitButton = await page.locator('button:has-text(/submit|inleveren|upload/i), a:has-text(/submit|inleveren|upload/i)').count();
    if (submitButton === 0) {
      issues.push({
        severity: 'critical',
        description: 'No submit/upload button found - unclear how to submit work',
        location: 'Week 3 interface'
      });
    }
    
    const timeTaken = (Date.now() - startTime) / 1000;
    if (timeTaken > 30) {
      issues.push({
        severity: 'medium',
        description: `Task flow took ${timeTaken}s - too long for urgent submission`,
        location: 'Overall flow'
      });
    }
    
    console.log('Story 2 Issues Found:', issues.length);
    issues.forEach(issue => console.log(`- [${issue.severity.toUpperCase()}] ${issue.description}`));
    
    return issues;
  });
  
  // Story 3: Mobile Check During Commute - Sofia on iPhone
  test('Story 3: Mobile Experience - Commute Check', async ({ page }) => {
    const issues = [];
    
    // Set iPhone viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Navigate to site
    await page.goto('https://hanbedrijfskunde.github.io/aecc/');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'screenshots/story3-1-mobile-home.png', fullPage: true });
    
    // Check mobile menu
    const mobileMenu = await page.locator('[class*="mobile-menu"], [class*="burger"], [class*="hamburger"]').count();
    const desktopNav = await page.locator('nav').isVisible();
    
    if (desktopNav && mobileMenu === 0) {
      issues.push({
        severity: 'high',
        description: 'No mobile menu - desktop navigation on small screen',
        location: 'Mobile navigation'
      });
    }
    
    // Navigate to student portal
    await page.click('text=/student/i');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'screenshots/story3-2-mobile-students.png', fullPage: true });
    
    // Check triangle conflict visibility on mobile
    const triangleSection = await page.locator('.triangle-conflict, [class*="triangle"], [class*="driehoek"]').first();
    if (triangleSection) {
      const box = await triangleSection.boundingBox();
      if (box && box.width > 375) {
        issues.push({
          severity: 'high',
          description: 'Triangle conflict diagram overflows mobile viewport',
          location: 'Triangle conflict section'
        });
      }
    }
    
    // Test week modal on mobile
    await page.click('text=/week 1/i').catch(() => {
      issues.push({
        severity: 'critical',
        description: 'Cannot tap week items on mobile',
        location: 'Week cards'
      });
    });
    
    await page.waitForTimeout(1000);
    
    // Check if modal is mobile-friendly
    const modal = await page.locator('.modal, [class*="modal"], [role="dialog"]').first();
    if (modal) {
      const modalBox = await modal.boundingBox();
      if (modalBox && modalBox.width > 375) {
        issues.push({
          severity: 'high',
          description: 'Modal content overflows mobile screen',
          location: 'Week detail modal'
        });
      }
      
      // Check for close button accessibility on mobile
      const closeButton = await modal.locator('[class*="close"], button:has-text("×"), button:has-text("X")').count();
      if (closeButton === 0) {
        issues.push({
          severity: 'high',
          description: 'No accessible close button in modal on mobile',
          location: 'Modal controls'
        });
      }
    }
    
    // Test text selection for AI prompt on mobile
    const aiPromptText = await page.locator('.ai-prompt, [class*="prompt"]').first();
    if (aiPromptText) {
      const isSelectable = await aiPromptText.evaluate(el => {
        const style = window.getComputedStyle(el);
        return style.userSelect !== 'none';
      }).catch(() => true);
      
      if (!isSelectable) {
        issues.push({
          severity: 'medium',
          description: 'AI prompt text not selectable on mobile',
          location: 'AI prompt section'
        });
      }
    }
    
    // Check role cards on mobile
    const roleCards = await page.locator('.role-card, [class*="role"]').all();
    if (roleCards.length > 0) {
      const firstCard = await roleCards[0].boundingBox();
      if (firstCard && firstCard.width > 350) {
        issues.push({
          severity: 'medium',
          description: 'Role cards too wide for mobile viewport',
          location: 'Role cards section'
        });
      }
    }
    
    // Test horizontal scrolling
    const hasHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    
    if (hasHorizontalScroll) {
      issues.push({
        severity: 'high',
        description: 'Page has horizontal scroll on mobile',
        location: 'Overall layout'
      });
    }
    
    await page.screenshot({ path: 'screenshots/story3-3-mobile-issue.png', fullPage: true });
    
    console.log('Story 3 Issues Found:', issues.length);
    issues.forEach(issue => console.log(`- [${issue.severity.toUpperCase()}] ${issue.description}`));
    
    return issues;
  });
  
  // Story 4: Lost in Translation - Ahmed, international student
  test('Story 4: International Student - Language and Clarity', async ({ page }) => {
    const issues = [];
    
    await page.goto('https://hanbedrijfskunde.github.io/aecc/studenten.html');
    await page.waitForLoadState('networkidle');
    
    // Check for language toggle
    const languageToggle = await page.locator('text=/english|language|taal/i, [class*="language"], [class*="lang"]').count();
    if (languageToggle === 0) {
      issues.push({
        severity: 'medium',
        description: 'No language toggle for international students',
        location: 'Navigation/header'
      });
    }
    
    // Check if key terms are explained
    const glossary = await page.locator('text=/glossary|woordenlijst|begrippen|uitleg/i').count();
    if (glossary === 0) {
      issues.push({
        severity: 'high',
        description: 'No glossary or term explanations for complex concepts',
        location: 'Student resources'
      });
    }
    
    // Check triangle conflict explanation
    const triangleExplanation = await page.locator('text=/exploit.*explore.*buyback/i').count();
    if (triangleExplanation === 0) {
      issues.push({
        severity: 'high',
        description: 'Triangle conflict (Exploit/Explore/Buyback) not clearly explained',
        location: 'Main concept area'
      });
    }
    
    // Check for tooltips or info buttons
    const infoButtons = await page.locator('[title], [data-tooltip], .tooltip, [class*="info"]').count();
    if (infoButtons < 3) {
      issues.push({
        severity: 'medium',
        description: 'Lack of tooltips or info buttons for complex terms',
        location: 'Throughout interface'
      });
    }
    
    // Check role descriptions clarity
    const roles = ['CEO', 'CFO', 'COO', 'CIO'];
    for (const role of roles) {
      const roleElement = await page.locator(`text=/${role}/i`).first();
      if (roleElement) {
        const description = await roleElement.locator('..').textContent().catch(() => '');
        if (description.length < 50) {
          issues.push({
            severity: 'medium',
            description: `${role} role lacks detailed description`,
            location: `${role} role card`
          });
        }
      }
    }
    
    // Check for help section
    const helpSection = await page.locator('text=/help|hulp|faq|veelgestelde/i, [class*="help"], [class*="faq"]').count();
    if (helpSection === 0) {
      issues.push({
        severity: 'high',
        description: 'No help section or FAQ for confused students',
        location: 'Student portal'
      });
    }
    
    // Check if Dutch-specific terms have context
    const dutchTerms = ['Raad van Bestuur', 'RvB', 'RvT', 'Raad van Toezicht'];
    for (const term of dutchTerms) {
      const termElement = await page.locator(`text=/${term}/i`).first();
      if (termElement) {
        const hasExplanation = await termElement.locator('..').textContent()
          .then(text => text.includes('(') || text.includes('betekent'))
          .catch(() => false);
        
        if (!hasExplanation) {
          issues.push({
            severity: 'medium',
            description: `Dutch term "${term}" lacks explanation or translation`,
            location: 'Content sections'
          });
        }
      }
    }
    
    await page.screenshot({ path: 'screenshots/story4-language-issues.png', fullPage: true });
    
    console.log('Story 4 Issues Found:', issues.length);
    issues.forEach(issue => console.log(`- [${issue.severity.toUpperCase()}] ${issue.description}`));
    
    return issues;
  });
  
  // Story 5: Progress Anxiety - Mira, Week 5 student checking progress
  test('Story 5: Progress Tracking - Mid-Course Student', async ({ page }) => {
    const issues = [];
    
    await page.goto('https://hanbedrijfskunde.github.io/aecc/studenten.html');
    await page.waitForLoadState('networkidle');
    
    // Check for progress indicator
    const progressIndicator = await page.locator('[class*="progress"], [role="progressbar"], text=/voortgang|progress/i').count();
    if (progressIndicator === 0) {
      issues.push({
        severity: 'high',
        description: 'No progress indicator showing course completion',
        location: 'Student dashboard'
      });
    }
    
    // Check for Project Continuïteit section
    const projectContinuity = await page.locator('text=/project continuïteit|continuiteit|decision history|beslissingen/i').count();
    if (projectContinuity === 0) {
      issues.push({
        severity: 'critical',
        description: 'No Project Continuïteit section to review past decisions',
        location: 'Student portal'
      });
    }
    
    // Try to access previous weeks
    for (let week = 1; week <= 4; week++) {
      const weekElement = await page.locator(`text=/week ${week}/i`).first();
      if (weekElement) {
        const isCompleted = await weekElement.locator('..').then(parent => 
          parent.locator('[class*="complete"], [class*="check"], ✓, ✔').count()
        ).catch(() => 0);
        
        if (isCompleted === 0) {
          issues.push({
            severity: 'medium',
            description: `Week ${week} has no completion indicator`,
            location: `Week ${week} card`
          });
        }
      }
    }
    
    // Check for submission history
    const submissionHistory = await page.locator('text=/ingeleverd|submitted|geschiedenis|history/i').count();
    if (submissionHistory === 0) {
      issues.push({
        severity: 'high',
        description: 'No way to view submission history',
        location: 'Student dashboard'
      });
    }
    
    // Check for remaining deadlines
    const upcomingDeadlines = await page.locator('text=/deadline|nog te doen|upcoming|volgende/i').count();
    if (upcomingDeadlines === 0) {
      issues.push({
        severity: 'high',
        description: 'No clear view of remaining deadlines',
        location: 'Student dashboard'
      });
    }
    
    // Check for final presentation resources
    const finalPresentation = await page.locator('text=/eindpresentatie|final presentation|week 6|week 7/i').count();
    if (finalPresentation === 0) {
      issues.push({
        severity: 'medium',
        description: 'No resources or information about final presentation',
        location: 'Course materials'
      });
    }
    
    // Check if decisions build on each other
    const strategyPillars = await page.locator('text=/pillar|pijler|strategie|strategy/i').count();
    if (strategyPillars < 2) {
      issues.push({
        severity: 'high',
        description: 'Strategic pillars concept not visible for continuity',
        location: 'Progress tracking'
      });
    }
    
    // Check for download or export option
    const exportOption = await page.locator('text=/download|export|exporteer|bewaar/i, [class*="download"], [class*="export"]').count();
    if (exportOption === 0) {
      issues.push({
        severity: 'medium',
        description: 'No option to download/export work for final presentation',
        location: 'Student tools'
      });
    }
    
    await page.screenshot({ path: 'screenshots/story5-progress-view.png', fullPage: true });
    
    console.log('Story 5 Issues Found:', issues.length);
    issues.forEach(issue => console.log(`- [${issue.severity.toUpperCase()}] ${issue.description}`));
    
    return issues;
  });
  
  // Additional Accessibility Testing
  test('Accessibility Quick Check', async ({ page }) => {
    const issues = [];
    
    await page.goto('https://hanbedrijfskunde.github.io/aecc/studenten.html');
    await page.waitForLoadState('networkidle');
    
    // Tab navigation test
    await page.keyboard.press('Tab');
    const firstFocus = await page.evaluate(() => document.activeElement?.tagName);
    if (!firstFocus || firstFocus === 'BODY') {
      issues.push({
        severity: 'high',
        description: 'Tab navigation does not work - no focus on first element',
        location: 'Keyboard navigation'
      });
    }
    
    // Check focus indicators
    const focusStyles = await page.evaluate(() => {
      const testButton = document.querySelector('button, a');
      if (testButton) {
        testButton.focus();
        const styles = window.getComputedStyle(testButton);
        return styles.outline || styles.boxShadow || styles.border;
      }
      return null;
    });
    
    if (!focusStyles || focusStyles === 'none') {
      issues.push({
        severity: 'high',
        description: 'No visible focus indicators for keyboard navigation',
        location: 'Interactive elements'
      });
    }
    
    // Check color contrast
    const lowContrast = await page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      const issues = [];
      
      elements.forEach(el => {
        const style = window.getComputedStyle(el);
        const bg = style.backgroundColor;
        const fg = style.color;
        
        // Simple check for very light text on white
        if (fg.includes('rgb') && bg.includes('rgb')) {
          const fgMatch = fg.match(/\d+/g);
          const bgMatch = bg.match(/\d+/g);
          
          if (fgMatch && bgMatch) {
            const fgBrightness = (parseInt(fgMatch[0]) + parseInt(fgMatch[1]) + parseInt(fgMatch[2])) / 3;
            const bgBrightness = (parseInt(bgMatch[0]) + parseInt(bgMatch[1]) + parseInt(bgMatch[2])) / 3;
            const contrast = Math.abs(fgBrightness - bgBrightness);
            
            if (contrast < 50 && el.textContent?.trim()) {
              issues.push(el.textContent.substring(0, 30));
            }
          }
        }
      });
      
      return issues.slice(0, 3);
    });
    
    if (lowContrast.length > 0) {
      issues.push({
        severity: 'medium',
        description: `Low color contrast detected in: ${lowContrast.join(', ')}`,
        location: 'Text elements'
      });
    }
    
    // Check for ARIA labels
    const interactiveWithoutLabel = await page.evaluate(() => {
      const buttons = document.querySelectorAll('button, a, input');
      let count = 0;
      buttons.forEach(el => {
        if (!el.textContent?.trim() && !el.getAttribute('aria-label') && !el.getAttribute('title')) {
          count++;
        }
      });
      return count;
    });
    
    if (interactiveWithoutLabel > 0) {
      issues.push({
        severity: 'high',
        description: `${interactiveWithoutLabel} interactive elements lack accessible labels`,
        location: 'Buttons and links'
      });
    }
    
    console.log('Accessibility Issues Found:', issues.length);
    issues.forEach(issue => console.log(`- [${issue.severity.toUpperCase()}] ${issue.description}`));
    
    return issues;
  });
});

// Summary reporter
test.afterAll(async () => {
  console.log('\n=== UX TESTING COMPLETE ===');
  console.log('Screenshots saved to ./screenshots/');
  console.log('Create GitHub issues for all findings at: https://github.com/hanbedrijfskunde/aecc/issues');
});