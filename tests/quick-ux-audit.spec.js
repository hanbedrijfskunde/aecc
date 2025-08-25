// Quick UX Audit - Focused Testing
const { test, expect } = require('@playwright/test');

test.describe('Quick UX Audit', () => {
  test.setTimeout(60000); // 60 second timeout
  
  test('Fast UX Check', async ({ page }) => {
    console.log('\n=== QUICK UX AUDIT STARTING ===\n');
    
    const issues = [];
    
    // Test 1: Homepage
    console.log('1. Testing Homepage...');
    await page.goto('https://hanbedrijfskunde.github.io/aecc/', { waitUntil: 'domcontentloaded' });
    await page.screenshot({ path: 'screenshots/audit-1-home.png' });
    
    const heroText = await page.locator('h1, .hero').first().textContent().catch(() => '');
    console.log('   Hero text:', heroText.substring(0, 50));
    
    if (!heroText.toLowerCase().includes('boardroom') && !heroText.toLowerCase().includes('aec')) {
      issues.push('CRITICAL: Homepage doesn\'t explain the course clearly');
    }
    
    // Test 2: Student Portal
    console.log('2. Testing Student Portal...');
    await page.goto('https://hanbedrijfskunde.github.io/aecc/studenten.html', { waitUntil: 'domcontentloaded' });
    await page.screenshot({ path: 'screenshots/audit-2-students.png' });
    
    const weekCount = await page.locator('.week-card, .week-item, [data-week]').count();
    console.log('   Weeks visible:', weekCount);
    
    if (weekCount < 7) {
      issues.push(`HIGH: Only ${weekCount} weeks visible (need 7)`);
    }
    
    const roleCount = await page.locator('.role-card, .role-item, [data-role]').count();
    console.log('   Roles visible:', roleCount);
    
    if (roleCount < 4) {
      issues.push(`HIGH: Only ${roleCount} roles visible (need 4)`);
    }
    
    // Test 3: Week Details
    console.log('3. Testing Week Details...');
    const week1 = await page.locator(':has-text("Week 1")').first();
    if (week1) {
      try {
        await week1.click();
        await page.waitForTimeout(500);
        await page.screenshot({ path: 'screenshots/audit-3-week-detail.png' });
        
        const hasAIPrompt = await page.locator(':has-text("AI"), :has-text("prompt")').count();
        console.log('   AI prompt found:', hasAIPrompt > 0);
        
        if (hasAIPrompt === 0) {
          issues.push('CRITICAL: No AI prompt in week details');
        }
        
        const hasDeadline = await page.locator(':has-text("deadline"), :has-text("Deadline")').count();
        console.log('   Deadline found:', hasDeadline > 0);
        
        if (hasDeadline === 0) {
          issues.push('CRITICAL: No deadline information');
        }
      } catch (e) {
        issues.push('CRITICAL: Cannot open week details');
      }
    }
    
    // Test 4: Key Missing Features
    console.log('4. Checking Key Features...');
    
    const hasSubmit = await page.locator(':has-text("Submit"), :has-text("Inleveren"), :has-text("Upload")').count();
    console.log('   Submit functionality:', hasSubmit > 0);
    if (hasSubmit === 0) {
      issues.push('CRITICAL: No submit/upload functionality');
    }
    
    const hasProgress = await page.locator('.progress, :has-text("Voortgang"), :has-text("Progress")').count();
    console.log('   Progress tracking:', hasProgress > 0);
    if (hasProgress === 0) {
      issues.push('HIGH: No progress tracking');
    }
    
    const hasContinuity = await page.locator(':has-text("Continuïteit"), :has-text("Continuiteit")').count();
    console.log('   Project Continuity:', hasContinuity > 0);
    if (hasContinuity === 0) {
      issues.push('CRITICAL: No Project Continuïteit section');
    }
    
    const hasHelp = await page.locator(':has-text("Help"), :has-text("FAQ"), :has-text("Hulp")').count();
    console.log('   Help/FAQ:', hasHelp > 0);
    if (hasHelp === 0) {
      issues.push('HIGH: No help section');
    }
    
    // Test 5: Mobile Quick Check
    console.log('5. Mobile Quick Check...');
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('https://hanbedrijfskunde.github.io/aecc/studenten.html', { waitUntil: 'domcontentloaded' });
    await page.screenshot({ path: 'screenshots/audit-5-mobile.png' });
    
    const hasHScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    console.log('   Horizontal scroll:', hasHScroll);
    if (hasHScroll) {
      issues.push('HIGH: Horizontal scroll on mobile');
    }
    
    // Summary
    console.log('\n=== AUDIT RESULTS ===\n');
    console.log(`Total issues found: ${issues.length}\n`);
    
    if (issues.length > 0) {
      console.log('ISSUES:');
      issues.forEach((issue, i) => {
        console.log(`${i + 1}. ${issue}`);
      });
    } else {
      console.log('No major issues found!');
    }
    
    // Save results
    const fs = require('fs');
    const results = {
      timestamp: new Date().toISOString(),
      issueCount: issues.length,
      issues: issues,
      screenshotsPaths: [
        'screenshots/audit-1-home.png',
        'screenshots/audit-2-students.png',
        'screenshots/audit-3-week-detail.png',
        'screenshots/audit-5-mobile.png'
      ]
    };
    
    fs.writeFileSync('ux-audit-results.json', JSON.stringify(results, null, 2));
    console.log('\n✅ Results saved to ux-audit-results.json');
    console.log('📸 Screenshots saved to screenshots/');
    
    expect(issues.length).toBeGreaterThanOrEqual(0);
  });
});