// Test Week Modal Functionality
const { test, expect } = require('@playwright/test');

test.describe('Week Modal Tests', () => {
  test.setTimeout(60000);
  
  test('All 7 week modals should display correct content', async ({ page }) => {
    console.log('Testing week modal functionality...');
    
    // Navigate to the student portal
    await page.goto('https://hanbedrijfskunde.github.io/aecc/studenten.html', { 
      waitUntil: 'networkidle' 
    });
    
    // Wait for content to load
    await page.waitForTimeout(2000);
    
    // Test data for each week
    const weekTests = [
      { number: 1, title: 'De Aftrap', theme: 'Kapitaalallocatie' },
      { number: 2, title: 'De Productiviteitsuitdaging', theme: "Europa's Achterstand" },
      { number: 3, title: 'De Duurzaamheidsparadox', theme: 'Profit vs Planet' },
      { number: 4, title: 'De Menselijke Factor', theme: 'War for Talent' },
      { number: 5, title: 'De Geopolitieke Storm', theme: 'Navigeren door chaos' },
      { number: 6, title: 'De Grote Integratie', theme: 'Samenhangend verhaal' },
      { number: 7, title: 'De Kritische Bevraging', theme: 'Van RvB naar RvT' }
    ];
    
    console.log('\n=== Testing Timeline Clicks ===');
    
    for (const week of weekTests) {
      console.log(`\nTesting Week ${week.number}: ${week.title}`);
      
      // Click on timeline item
      const timelineItem = await page.locator(`.timeline-item[data-week="${week.number}"]`).first();
      if (await timelineItem.count() > 0) {
        await timelineItem.click();
        
        // Wait for modal to appear
        await page.waitForSelector('.modal-overlay', { timeout: 5000 });
        
        // Check modal content
        const modalContent = await page.locator('.modal-content').textContent();
        
        // Verify week title appears
        if (modalContent.includes(week.title)) {
          console.log(`✅ Week ${week.number} title found: "${week.title}"`);
        } else {
          console.log(`❌ Week ${week.number} title NOT found`);
          console.log(`   Expected: "${week.title}"`);
          console.log(`   Modal content preview: ${modalContent.substring(0, 200)}...`);
        }
        
        // Verify theme appears
        if (modalContent.includes(week.theme)) {
          console.log(`✅ Week ${week.number} theme found: "${week.theme}"`);
        } else {
          console.log(`❌ Week ${week.number} theme NOT found`);
        }
        
        // Check for WAAROM/HOE/WAT tabs
        const waaromTab = await page.locator('.tab-btn:has-text("WAAROM")').count();
        const hoeTab = await page.locator('.tab-btn:has-text("HOE")').count();
        const watTab = await page.locator('.tab-btn:has-text("WAT")').count();
        
        if (waaromTab > 0 && hoeTab > 0 && watTab > 0) {
          console.log(`✅ All tabs present (WAAROM/HOE/WAT)`);
        } else {
          console.log(`❌ Missing tabs - WAAROM: ${waaromTab}, HOE: ${hoeTab}, WAT: ${watTab}`);
        }
        
        // Check for AI prompt
        const aiPrompt = await page.locator('.ai-prompt-section').count();
        if (aiPrompt > 0) {
          console.log(`✅ AI prompt section present`);
        } else {
          console.log(`❌ AI prompt section missing`);
        }
        
        // Close modal
        await page.locator('.modal-close').click();
        await page.waitForTimeout(500);
      } else {
        console.log(`❌ Timeline item for week ${week.number} not found`);
      }
    }
    
    console.log('\n=== Testing Week Cards (if present) ===');
    
    // Test week cards in "7 Weken Programma" section
    const weekCard = await page.locator('.week-card[data-week="1"]').first();
    if (await weekCard.count() > 0) {
      const weekButton = await weekCard.locator('.week-btn').first();
      if (await weekButton.count() > 0) {
        console.log('\nTesting Week 1 card button...');
        await weekButton.click();
        
        // Wait for modal
        await page.waitForSelector('.modal-overlay', { timeout: 5000 });
        
        // Check content
        const modalContent = await page.locator('.modal-content').textContent();
        if (modalContent.includes('De Aftrap')) {
          console.log('✅ Week 1 card opens correct modal');
        } else {
          console.log('❌ Week 1 card modal has incorrect content');
        }
        
        // Close modal
        await page.locator('.modal-close').click();
      }
    }
    
    console.log('\n=== Summary ===');
    console.log('Week modal testing complete.');
    console.log('Check the output above for any ❌ marks indicating issues.');
    
    // Take screenshot of final state
    await page.screenshot({ 
      path: 'screenshots/test-week-modals-final.png',
      fullPage: true 
    });
  });
  
  test('Tab switching in modal should work', async ({ page }) => {
    console.log('\nTesting tab switching in modal...');
    
    await page.goto('https://hanbedrijfskunde.github.io/aecc/studenten.html', { 
      waitUntil: 'networkidle' 
    });
    
    // Wait for content
    await page.waitForTimeout(2000);
    
    // Open week 1 modal
    await page.locator('.timeline-item[data-week="1"]').first().click();
    await page.waitForSelector('.modal-overlay', { timeout: 5000 });
    
    // Test HOE tab
    await page.locator('.tab-btn:has-text("HOE")').click();
    await page.waitForTimeout(500);
    
    const hoeContent = await page.locator('#hoe').isVisible();
    if (hoeContent) {
      console.log('✅ HOE tab content is visible');
    } else {
      console.log('❌ HOE tab content not visible');
    }
    
    // Test WAT tab
    await page.locator('.tab-btn:has-text("WAT")').click();
    await page.waitForTimeout(500);
    
    const watContent = await page.locator('#wat').isVisible();
    if (watContent) {
      console.log('✅ WAT tab content is visible');
    } else {
      console.log('❌ WAT tab content not visible');
    }
    
    // Go back to WAAROM
    await page.locator('.tab-btn:has-text("WAAROM")').click();
    await page.waitForTimeout(500);
    
    const waaromContent = await page.locator('#waarom').isVisible();
    if (waaromContent) {
      console.log('✅ WAAROM tab content is visible');
    } else {
      console.log('❌ WAAROM tab content not visible');
    }
    
    console.log('Tab switching test complete.');
  });
});