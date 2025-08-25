const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function testOnboardingAndFAQ() {
    console.log('Testing onboarding and FAQ features...');
    
    const browser = await chromium.launch({ 
        headless: false,
        slowMo: 1000
    });
    
    const context = await browser.newContext({
        viewport: { width: 1440, height: 900 }
    });
    
    const page = await context.newPage();
    
    const screenshotsDir = path.join(__dirname, 'test-screenshots-features');
    if (!fs.existsSync(screenshotsDir)) {
        fs.mkdirSync(screenshotsDir);
    }
    
    try {
        await page.goto('https://hanbedrijfskunde.github.io/aecc/studenten.html');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(3000);
        
        // Check localStorage before clearing
        const existingStorage = await page.evaluate(() => Object.keys(localStorage));
        console.log('Existing localStorage keys:', existingStorage);
        
        // Clear localStorage and reload
        await page.evaluate(() => {
            localStorage.clear();
            sessionStorage.clear();
        });
        
        await page.reload();
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(5000); // Give more time for onboarding to trigger
        
        // Take screenshot of initial state after reload
        await page.screenshot({ 
            path: path.join(screenshotsDir, '01-after-storage-clear.png'),
            fullPage: true
        });
        
        // Check for any modals or overlays
        const allModals = await page.locator('.modal, [role="dialog"], .overlay, .popup, [id*="modal"], [class*="modal"]').all();
        console.log(`Found ${allModals.length} potential modal elements`);
        
        for (let i = 0; i < allModals.length; i++) {
            const modal = allModals[i];
            const isVisible = await modal.isVisible();
            const innerHTML = await modal.innerHTML().catch(() => 'Could not get innerHTML');
            console.log(`Modal ${i + 1}: visible=${isVisible}, content preview: ${innerHTML.substring(0, 100)}...`);
        }
        
        // Look for help buttons anywhere on the page
        const helpElements = await page.locator(':text("help"), :text("Help"), :text("HELP"), [title*="help"], [aria-label*="help"], .help').all();
        console.log(`Found ${helpElements.length} help-related elements`);
        
        for (let i = 0; i < helpElements.length; i++) {
            const element = helpElements[i];
            const isVisible = await element.isVisible();
            const tagName = await element.evaluate(el => el.tagName);
            const text = await element.textContent();
            console.log(`Help element ${i + 1}: ${tagName}, visible=${isVisible}, text="${text}"`);
        }
        
        // Look for FAQ elements
        const faqElements = await page.locator(':text("faq"), :text("FAQ"), :text("Faq"), [title*="faq"], [aria-label*="faq"], .faq').all();
        console.log(`Found ${faqElements.length} FAQ-related elements`);
        
        for (let i = 0; i < faqElements.length; i++) {
            const element = faqElements[i];
            const isVisible = await element.isVisible();
            const tagName = await element.evaluate(el => el.tagName);
            const text = await element.textContent();
            console.log(`FAQ element ${i + 1}: ${tagName}, visible=${isVisible}, text="${text}"`);
        }
        
        // Try to manually trigger onboarding if the function exists
        const triggerResult = await page.evaluate(() => {
            if (typeof window.showOnboarding === 'function') {
                window.showOnboarding();
                return 'showOnboarding() called';
            } else {
                return 'showOnboarding() function not found';
            }
        });
        console.log('Manual onboarding trigger result:', triggerResult);
        
        await page.waitForTimeout(2000);
        await page.screenshot({ 
            path: path.join(screenshotsDir, '02-after-onboarding-trigger.png'),
            fullPage: true
        });
        
        // Try to manually trigger FAQ if the function exists
        const faqResult = await page.evaluate(() => {
            if (typeof window.showFAQ === 'function') {
                window.showFAQ();
                return 'showFAQ() called';
            } else {
                return 'showFAQ() function not found';
            }
        });
        console.log('Manual FAQ trigger result:', faqResult);
        
        await page.waitForTimeout(2000);
        await page.screenshot({ 
            path: path.join(screenshotsDir, '03-after-faq-trigger.png'),
            fullPage: true
        });
        
        // Check what's in the page source for onboarding/faq related content
        const pageContent = await page.content();
        const hasOnboardingScript = pageContent.includes('onboarding.js');
        const hasFAQScript = pageContent.includes('faq.js');
        const hasOnboardingHTML = pageContent.includes('onboarding') || pageContent.includes('welkom') || pageContent.includes('intro');
        const hasFAQHTML = pageContent.includes('faq') || pageContent.includes('FAQ');
        
        console.log('Page content analysis:');
        console.log(`  onboarding.js script included: ${hasOnboardingScript}`);
        console.log(`  faq.js script included: ${hasFAQScript}`);
        console.log(`  onboarding-related HTML: ${hasOnboardingHTML}`);
        console.log(`  FAQ-related HTML: ${hasFAQHTML}`);
        
        console.log('\nScreenshots saved to:', screenshotsDir);
        
    } catch (error) {
        console.error('Test execution error:', error);
    } finally {
        await browser.close();
    }
}

testOnboardingAndFAQ().then(() => {
    console.log('\nOnboarding and FAQ analysis completed!');
    process.exit(0);
}).catch(error => {
    console.error('Failed to run analysis:', error);
    process.exit(1);
});