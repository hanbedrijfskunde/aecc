// Test file to check for duplicate week cards
const { chromium } = require('playwright');

async function testDuplicateWeeks() {
    console.log('🧪 Testing for duplicate week cards...');
    
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
    
    try {
        // Navigate to local student portal
        await page.goto('file:///Users/witoldtenhove/Documents/Projects/HANBK/aecc/website/studenten.html');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(2000); // Wait for any dynamic content to load
        
        console.log('✅ Page loaded successfully');
        
        // Count all week cards
        const weekCards = await page.locator('.week-card');
        const totalCards = await weekCards.count();
        
        console.log(`📊 Total week cards found: ${totalCards}`);
        
        // Count unique week cards by data-week attribute
        const weekNumbers = await weekCards.evaluateAll(cards => {
            return cards.map(card => card.getAttribute('data-week'));
        });
        
        console.log(`📋 Week numbers found: [${weekNumbers.join(', ')}]`);
        
        // Check for duplicates
        const uniqueWeeks = [...new Set(weekNumbers)];
        const hasDuplicates = uniqueWeeks.length !== weekNumbers.length;
        
        if (hasDuplicates) {
            console.log('❌ DUPLICATE WEEK CARDS DETECTED!');
            
            // Find which weeks are duplicated
            const duplicates = weekNumbers.filter((week, index) => 
                weekNumbers.indexOf(week) !== index
            );
            console.log(`🔍 Duplicated weeks: [${[...new Set(duplicates)].join(', ')}]`);
            
            return false;
        } else {
            console.log('✅ No duplicate week cards found');
        }
        
        // Verify we have exactly 7 unique week cards (1-7)
        const expectedWeeks = ['1', '2', '3', '4', '5', '6', '7'];
        const missingWeeks = expectedWeeks.filter(week => !uniqueWeeks.includes(week));
        const extraWeeks = uniqueWeeks.filter(week => !expectedWeeks.includes(week));
        
        if (missingWeeks.length > 0) {
            console.log(`❌ Missing weeks: [${missingWeeks.join(', ')}]`);
        }
        
        if (extraWeeks.length > 0) {
            console.log(`❌ Extra weeks: [${extraWeeks.join(', ')}]`);
        }
        
        if (uniqueWeeks.length === 7 && missingWeeks.length === 0 && extraWeeks.length === 0) {
            console.log('✅ Exactly 7 week cards (1-7) found as expected');
            return true;
        } else {
            console.log(`❌ Expected 7 weeks (1-7), but found ${uniqueWeeks.length} unique weeks`);
            return false;
        }
        
    } catch (error) {
        console.error('❌ Test failed with error:', error);
        return false;
    } finally {
        await browser.close();
    }
}

// Run the test
testDuplicateWeeks().then(success => {
    if (success) {
        console.log('🎉 Week cards test PASSED!');
    } else {
        console.log('💥 Week cards test FAILED!');
    }
});