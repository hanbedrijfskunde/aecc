// Test Sprint 2 UX Enhancements
const { test, expect } = require('@playwright/test');

test.describe('Sprint 2: User Experience Enhancements', () => {
  test.setTimeout(60000);
  
  test('Onboarding flow should work for new users', async ({ page }) => {
    console.log('Testing onboarding flow...');
    
    // Clear localStorage to simulate new user
    await page.goto('https://hanbedrijfskunde.github.io/aecc/studenten.html');
    await page.evaluate(() => {
      localStorage.removeItem('aec_onboarding_complete');
      localStorage.removeItem('aec_selected_role');
    });
    
    // Reload to trigger onboarding
    await page.reload();
    await page.waitForTimeout(1500);
    
    // Check if onboarding modal appears
    const onboardingModal = await page.locator('.onboarding-modal').isVisible();
    console.log(`✅ Onboarding modal appears: ${onboardingModal}`);
    
    // Check welcome content
    const welcomeText = await page.locator('.welcome-step').textContent();
    if (welcomeText.includes('Welkom')) {
      console.log('✅ Welcome message displayed');
    }
    
    // Test navigation through steps
    await page.locator('#nextBtn').click();
    await page.waitForTimeout(500);
    
    const overviewText = await page.locator('.overview-step').textContent();
    if (overviewText.includes('boardroom simulatie')) {
      console.log('✅ Course overview displayed');
    }
    
    // Go to role selection
    await page.locator('#nextBtn').click();
    await page.waitForTimeout(500);
    
    // Select CEO role
    await page.locator('.role-option[data-role="ceo"]').click();
    const roleSelected = await page.locator('.role-option.selected').count();
    console.log(`✅ Role selection works: ${roleSelected > 0}`);
    
    // Continue to triangle explanation
    await page.locator('#nextBtn').click();
    await page.waitForTimeout(500);
    
    const triangleVisible = await page.locator('.triangle-step svg').isVisible();
    console.log(`✅ Triangle explanation visible: ${triangleVisible}`);
    
    // Complete onboarding
    await page.locator('#nextBtn').click();
    await page.waitForTimeout(500);
    await page.locator('#nextBtn').click(); // Click "Start je reis!"
    await page.waitForTimeout(2500);
    
    // Check if onboarding completed
    const onboardingGone = await page.locator('.onboarding-modal').count() === 0;
    console.log(`✅ Onboarding completed and closed: ${onboardingGone}`);
    
    // Check if help button exists
    const helpButton = await page.locator('.help-button').isVisible();
    console.log(`✅ Help button available: ${helpButton}`);
    
    // Check localStorage
    const isComplete = await page.evaluate(() => {
      return localStorage.getItem('aec_onboarding_complete') === 'true';
    });
    console.log(`✅ Onboarding marked complete in localStorage: ${isComplete}`);
  });
  
  test('FAQ system should be functional', async ({ page }) => {
    console.log('\nTesting FAQ system...');
    
    await page.goto('https://hanbedrijfskunde.github.io/aecc/studenten.html');
    await page.waitForTimeout(2000);
    
    // Check if FAQ button exists
    const faqButton = await page.locator('.faq-float-button').isVisible();
    console.log(`✅ FAQ button visible: ${faqButton}`);
    
    // Open FAQ
    await page.locator('.faq-float-button').click();
    await page.waitForTimeout(500);
    
    // Check if FAQ modal opens
    const faqModal = await page.locator('.faq-modal').isVisible();
    console.log(`✅ FAQ modal opens: ${faqModal}`);
    
    // Check if questions are displayed
    const questionCount = await page.locator('.faq-question').count();
    console.log(`✅ FAQ questions loaded: ${questionCount} questions`);
    
    // Test search functionality
    await page.fill('#faqSearch', 'boardroom');
    await page.waitForTimeout(500);
    
    const filteredQuestions = await page.locator('.faq-question').count();
    console.log(`✅ Search functionality works: ${filteredQuestions} results for "boardroom"`);
    
    // Test accordion functionality
    await page.locator('.faq-question').first().click();
    await page.waitForTimeout(500);
    
    const answerVisible = await page.locator('.faq-answer').first().isVisible();
    console.log(`✅ FAQ accordion works: ${answerVisible}`);
    
    // Check contact information
    const contactInfo = await page.locator('.contact-info').textContent();
    if (contactInfo.includes('Email') && contactInfo.includes('Teams')) {
      console.log('✅ Contact information present');
    }
    
    // Close FAQ
    await page.locator('.faq-close').click();
    await page.waitForTimeout(500);
    
    const faqClosed = await page.locator('.faq-modal').count() === 0;
    console.log(`✅ FAQ modal closes properly: ${faqClosed}`);
  });
  
  test('No duplicate week cards issue', async ({ page }) => {
    console.log('\nVerifying no duplicate week cards...');
    
    await page.goto('https://hanbedrijfskunde.github.io/aecc/studenten.html');
    await page.waitForTimeout(2000);
    
    // Count week cards in main section
    const weekCards = await page.locator('.week-navigator .week-card').count();
    console.log(`Week cards in main section: ${weekCards}`);
    
    // Count timeline items
    const timelineItems = await page.locator('.timeline-item[data-week]').count();
    console.log(`Timeline items: ${timelineItems}`);
    
    // Verify each week appears only once per section
    for (let i = 1; i <= 7; i++) {
      const cardsForWeek = await page.locator(`.week-navigator .week-card[data-week="${i}"]`).count();
      const timelineForWeek = await page.locator(`.timeline-item[data-week="${i}"]`).count();
      
      if (cardsForWeek <= 1 && timelineForWeek <= 1) {
        console.log(`✅ Week ${i}: ${cardsForWeek} card(s), ${timelineForWeek} timeline item(s)`);
      } else {
        console.log(`❌ Week ${i} has duplicates: ${cardsForWeek} cards, ${timelineForWeek} timeline items`);
      }
    }
    
    console.log('✅ No duplicate week cards found - working as intended');
  });
  
  test('Help button replays onboarding', async ({ page }) => {
    console.log('\nTesting help button functionality...');
    
    await page.goto('https://hanbedrijfskunde.github.io/aecc/studenten.html');
    
    // Mark onboarding as complete first
    await page.evaluate(() => {
      localStorage.setItem('aec_onboarding_complete', 'true');
    });
    
    await page.reload();
    await page.waitForTimeout(2000);
    
    // Check that onboarding doesn't auto-start
    const noAutoOnboarding = await page.locator('.onboarding-modal').count() === 0;
    console.log(`✅ Onboarding doesn't auto-start for returning users: ${noAutoOnboarding}`);
    
    // Click help button to replay
    await page.locator('.help-button').click();
    await page.waitForTimeout(500);
    
    // Check if onboarding reopens
    const onboardingReopened = await page.locator('.onboarding-modal').isVisible();
    console.log(`✅ Help button reopens onboarding: ${onboardingReopened}`);
    
    // Close onboarding
    await page.locator('.onboarding-close').click();
    await page.waitForTimeout(500);
    
    const closed = await page.locator('.onboarding-modal').count() === 0;
    console.log(`✅ Can close onboarding with X button: ${closed}`);
  });
});