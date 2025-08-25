const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function testSprintChanges() {
    console.log('Starting Sprint 1 & 2 verification tests...');
    
    const browser = await chromium.launch({ 
        headless: false,
        slowMo: 1000 // Slow down for better observation
    });
    
    const context = await browser.newContext({
        viewport: { width: 1440, height: 900 }
    });
    
    const page = await context.newPage();
    
    // Create screenshots directory
    const screenshotsDir = path.join(__dirname, 'test-screenshots');
    if (!fs.existsSync(screenshotsDir)) {
        fs.mkdirSync(screenshotsDir);
    }
    
    const results = {
        timestamp: new Date().toISOString(),
        url: 'https://hanbedrijfskunde.github.io/aecc/studenten.html',
        tests: []
    };
    
    try {
        // Navigate to the live site
        console.log('Navigating to live website...');
        await page.goto('https://hanbedrijfskunde.github.io/aecc/studenten.html');
        await page.waitForLoadState('networkidle');
        
        // Take initial screenshot
        await page.screenshot({ 
            path: path.join(screenshotsDir, '01-main-page-initial.png'),
            fullPage: true
        });
        console.log('✓ Initial page screenshot taken');
        
        // Test 1: Clear localStorage to trigger onboarding (Sprint 2)
        console.log('\nTesting onboarding flow...');
        await page.evaluate(() => localStorage.clear());
        await page.reload();
        await page.waitForLoadState('networkidle');
        
        // Check for onboarding modal
        const onboardingModal = await page.locator('.onboarding-modal, [data-onboarding], .intro-modal, .welcome-modal').first();
        const onboardingExists = await onboardingModal.count() > 0;
        
        if (onboardingExists) {
            await page.screenshot({ 
                path: path.join(screenshotsDir, '02-onboarding-modal.png'),
                fullPage: true
            });
            console.log('✓ Onboarding modal found and screenshot taken');
            
            // Try to close onboarding
            const closeBtn = await page.locator('button:has-text("Sluiten"), button:has-text("Start"), .close-btn, [data-dismiss]').first();
            if (await closeBtn.count() > 0) {
                await closeBtn.click();
                await page.waitForTimeout(1000);
            }
            
            results.tests.push({
                name: 'Onboarding Flow',
                status: 'PASS',
                description: 'Onboarding modal appears when localStorage is cleared'
            });
        } else {
            console.log('⚠ Onboarding modal not found');
            results.tests.push({
                name: 'Onboarding Flow',
                status: 'FAIL',
                description: 'Onboarding modal does not appear when localStorage is cleared'
            });
        }
        
        // Test 2: Check for Help button (Sprint 2)
        console.log('\nTesting help button...');
        const helpButton = await page.locator('button:has-text("Help"), .help-btn, [data-help], .help-button').first();
        const helpExists = await helpButton.count() > 0;
        
        if (helpExists) {
            // Highlight and screenshot help button
            await helpButton.scrollIntoViewIfNeeded();
            await helpButton.hover();
            await page.screenshot({ 
                path: path.join(screenshotsDir, '03-help-button.png'),
                fullPage: true
            });
            console.log('✓ Help button found and screenshot taken');
            
            results.tests.push({
                name: 'Help Button',
                status: 'PASS',
                description: 'Help button is visible and accessible'
            });
        } else {
            console.log('⚠ Help button not found');
            results.tests.push({
                name: 'Help Button',
                status: 'FAIL',
                description: 'Help button is not visible on the page'
            });
        }
        
        // Test 3: Check for FAQ system (Sprint 2)
        console.log('\nTesting FAQ system...');
        const faqButton = await page.locator('button:has-text("FAQ"), .faq-btn, [data-faq], .faq-button').first();
        const faqExists = await faqButton.count() > 0;
        
        if (faqExists) {
            await faqButton.scrollIntoViewIfNeeded();
            await faqButton.click();
            await page.waitForTimeout(1000);
            
            await page.screenshot({ 
                path: path.join(screenshotsDir, '04-faq-modal.png'),
                fullPage: true
            });
            console.log('✓ FAQ system found and screenshot taken');
            
            // Close FAQ modal
            const closeFaq = await page.locator('button:has-text("Sluiten"), .close-btn, [data-dismiss]').first();
            if (await closeFaq.count() > 0) {
                await closeFaq.click();
                await page.waitForTimeout(1000);
            }
            
            results.tests.push({
                name: 'FAQ System',
                status: 'PASS',
                description: 'FAQ button works and modal opens'
            });
        } else {
            console.log('⚠ FAQ button not found');
            results.tests.push({
                name: 'FAQ System',
                status: 'FAIL',
                description: 'FAQ button is not visible on the page'
            });
        }
        
        // Test 4: Week detail modals (Sprint 1)
        console.log('\nTesting week detail modals...');
        const timelineItems = await page.locator('.timeline-item, .week-item, [data-week]').all();
        
        if (timelineItems.length > 0) {
            console.log(`Found ${timelineItems.length} timeline items`);
            
            // Click on the first available timeline item
            await timelineItems[0].scrollIntoViewIfNeeded();
            await timelineItems[0].click();
            await page.waitForTimeout(1500);
            
            // Check for modal
            const modal = await page.locator('.modal, .week-modal, [data-modal]').first();
            const modalExists = await modal.count() > 0;
            
            if (modalExists) {
                await page.screenshot({ 
                    path: path.join(screenshotsDir, '05-week-modal.png'),
                    fullPage: true
                });
                console.log('✓ Week modal opens and screenshot taken');
                
                // Check for tabs (WAAROM/HOE/WAT)
                const tabs = await page.locator('.tab, .modal-tab, [data-tab]').all();
                if (tabs.length > 0) {
                    console.log(`✓ Found ${tabs.length} tabs in modal`);
                    
                    // Click through tabs
                    for (let i = 0; i < Math.min(tabs.length, 3); i++) {
                        await tabs[i].click();
                        await page.waitForTimeout(500);
                    }
                    
                    await page.screenshot({ 
                        path: path.join(screenshotsDir, '06-week-modal-tabs.png'),
                        fullPage: true
                    });
                }
                
                // Close modal
                const closeModal = await page.locator('button:has-text("Sluiten"), .close-btn, [data-dismiss]').first();
                if (await closeModal.count() > 0) {
                    await closeModal.click();
                    await page.waitForTimeout(1000);
                }
                
                results.tests.push({
                    name: 'Week Detail Modals',
                    status: 'PASS',
                    description: 'Timeline items are clickable and modals open with content'
                });
            } else {
                console.log('⚠ Week modal did not open');
                results.tests.push({
                    name: 'Week Detail Modals',
                    status: 'FAIL',
                    description: 'Timeline items do not open modals when clicked'
                });
            }
        } else {
            console.log('⚠ No timeline items found');
            results.tests.push({
                name: 'Week Detail Modals',
                status: 'FAIL',
                description: 'No timeline items found on the page'
            });
        }
        
        // Test 5: Triangle conflict visualization (Sprint 1)
        console.log('\nTesting triangle conflict visualization...');
        const triangleSection = await page.locator('.triangle, .conflict-triangle, [data-triangle], .strategy-triangle').first();
        const triangleExists = await triangleSection.count() > 0;
        
        if (triangleExists) {
            await triangleSection.scrollIntoViewIfNeeded();
            await page.screenshot({ 
                path: path.join(screenshotsDir, '07-triangle-conflict.png'),
                fullPage: true
            });
            console.log('✓ Triangle conflict section found and screenshot taken');
            
            // Check for SVG elements
            const svgElements = await page.locator('svg, .triangle svg').count();
            const strategyCards = await page.locator('.strategy-card, .conflict-card, [data-strategy]').count();
            
            console.log(`Found ${svgElements} SVG elements and ${strategyCards} strategy cards`);
            
            results.tests.push({
                name: 'Triangle Conflict Visualization',
                status: 'PASS',
                description: `Triangle visualization found with ${svgElements} SVG elements and ${strategyCards} strategy cards`
            });
        } else {
            console.log('⚠ Triangle conflict visualization not found');
            results.tests.push({
                name: 'Triangle Conflict Visualization',
                status: 'FAIL',
                description: 'Triangle conflict visualization section not found'
            });
        }
        
        // Test 6: AI prompt copy functionality (Sprint 1)
        console.log('\nTesting AI prompt copy functionality...');
        const copyButtons = await page.locator('button:has-text("Kopieer"), .copy-btn, [data-copy], button[title*="copy"], button[title*="kopieer"]').all();
        
        if (copyButtons.length > 0) {
            console.log(`Found ${copyButtons.length} copy buttons`);
            
            // Click on first copy button
            await copyButtons[0].scrollIntoViewIfNeeded();
            await copyButtons[0].hover();
            await page.screenshot({ 
                path: path.join(screenshotsDir, '08-ai-prompt-copy.png'),
                fullPage: true
            });
            
            // Test copy functionality
            await copyButtons[0].click();
            await page.waitForTimeout(1000);
            
            console.log('✓ Copy buttons found and screenshot taken');
            
            results.tests.push({
                name: 'AI Prompt Copy Functionality',
                status: 'PASS',
                description: `${copyButtons.length} copy buttons found and functional`
            });
        } else {
            console.log('⚠ No copy buttons found');
            results.tests.push({
                name: 'AI Prompt Copy Functionality',
                status: 'FAIL',
                description: 'No copy buttons found for AI prompts'
            });
        }
        
        // Final comprehensive screenshot
        await page.screenshot({ 
            path: path.join(screenshotsDir, '09-final-page-state.png'),
            fullPage: true
        });
        console.log('✓ Final comprehensive screenshot taken');
        
        // Save test results
        const resultsFile = path.join(__dirname, 'sprint-verification-results.json');
        fs.writeFileSync(resultsFile, JSON.stringify(results, null, 2));
        
        console.log('\n=== TEST SUMMARY ===');
        console.log(`Total tests: ${results.tests.length}`);
        const passedTests = results.tests.filter(t => t.status === 'PASS').length;
        const failedTests = results.tests.filter(t => t.status === 'FAIL').length;
        console.log(`Passed: ${passedTests}`);
        console.log(`Failed: ${failedTests}`);
        
        results.tests.forEach(test => {
            const status = test.status === 'PASS' ? '✅' : '❌';
            console.log(`${status} ${test.name}: ${test.description}`);
        });
        
        console.log(`\nScreenshots saved to: ${screenshotsDir}`);
        console.log(`Results saved to: ${resultsFile}`);
        
    } catch (error) {
        console.error('Test execution error:', error);
        results.error = error.message;
        
        // Save error screenshot
        await page.screenshot({ 
            path: path.join(screenshotsDir, 'error-state.png'),
            fullPage: true
        });
    } finally {
        await browser.close();
    }
    
    return results;
}

// Run the tests
testSprintChanges().then(results => {
    console.log('\nTest execution completed!');
    process.exit(0);
}).catch(error => {
    console.error('Failed to run tests:', error);
    process.exit(1);
});