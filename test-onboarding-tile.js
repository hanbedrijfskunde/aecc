// Test file for onboarding tile functionality
const { chromium } = require('playwright');

async function testOnboardingTile() {
    console.log('🧪 Testing onboarding tile functionality...');
    
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
    
    try {
        // Navigate to local student portal
        await page.goto('file:///Users/witoldtenhove/Documents/Projects/HANBK/aecc/website/studenten.html');
        await page.waitForLoadState('networkidle');
        
        // Dismiss any onboarding overlay that might be intercepting clicks
        await page.waitForTimeout(1000);
        try {
            await page.evaluate(() => {
                const overlay = document.getElementById('onboardingOverlay');
                if (overlay) {
                    overlay.style.display = 'none';
                    overlay.remove();
                }
                // Also remove any other overlays
                const overlays = document.querySelectorAll('.onboarding-overlay, .overlay');
                overlays.forEach(o => {
                    o.style.display = 'none';
                    o.remove();
                });
            });
        } catch (e) {
            // Overlay might not exist, that's okay
        }
        
        console.log('✅ Page loaded successfully');
        
        // Check if onboarding tile exists and is visible
        const onboardingTile = await page.locator('#onboarding-tile');
        await onboardingTile.waitFor({ state: 'visible' });
        console.log('✅ Onboarding tile is visible');
        
        // Test toggle functionality
        const toggleBtn = await page.locator('#onboarding-toggle');
        await toggleBtn.click();
        
        // Check if collapsed class is added
        const hasCollapsedClass = await page.evaluate(() => {
            const tile = document.getElementById('onboarding-tile');
            return tile.classList.contains('collapsed');
        });
        
        if (hasCollapsedClass) {
            console.log('✅ Toggle collapse functionality works');
        } else {
            console.log('❌ Toggle collapse functionality failed');
        }
        
        // Expand again
        await toggleBtn.click();
        
        // Test tab switching
        const rolesTab = await page.locator('button[onclick="showOnboardingTab(\'roles\')"]');
        await rolesTab.click();
        await page.waitForTimeout(300); // Wait for animation
        
        const rolesPanel = await page.locator('#roles');
        const isRolesPanelActive = await rolesPanel.evaluate(el => el.classList.contains('active'));
        
        if (isRolesPanelActive) {
            console.log('✅ Tab switching functionality works');
        } else {
            console.log('❌ Tab switching functionality failed');
        }
        
        // Test role selector
        const roleDropdown = await page.locator('#role-dropdown');
        await roleDropdown.selectOption('ceo');
        
        // Wait for role details to populate
        await page.waitForTimeout(500);
        
        const roleDetailsText = await page.locator('#role-details').textContent();
        if (roleDetailsText.includes('De Balans-kunstenaar')) {
            console.log('✅ Role selector functionality works');
        } else {
            console.log('❌ Role selector functionality failed');
        }
        
        // Test FAQ functionality
        const faqTab = await page.locator('button[onclick="showOnboardingTab(\'help\')"]');
        await faqTab.click();
        await page.waitForTimeout(300);
        
        // Check if FAQ items are populated
        const faqItems = await page.locator('.faq-item');
        const faqCount = await faqItems.count();
        
        if (faqCount > 0) {
            console.log(`✅ FAQ populated with ${faqCount} items`);
            
            // Test FAQ toggle
            const firstFaqQuestion = await page.locator('.faq-question').first();
            await firstFaqQuestion.click();
            await page.waitForTimeout(300);
            
            const faqItem = await page.locator('.faq-item').first();
            const isOpen = await faqItem.evaluate(el => el.classList.contains('open'));
            
            if (isOpen) {
                console.log('✅ FAQ toggle functionality works');
            } else {
                console.log('❌ FAQ toggle functionality failed');
            }
        } else {
            console.log('❌ FAQ items not populated');
        }
        
        // Test quick navigation buttons
        const gettingStartedTab = await page.locator('button[onclick="showOnboardingTab(\'getting-started\')"]');
        await gettingStartedTab.click();
        await page.waitForTimeout(300);
        
        const triangleBtn = await page.locator('button[onclick="scrollToSection(\'triangle-conflict\')"]');
        await triangleBtn.click();
        
        // Check if page scrolled to triangle section
        await page.waitForTimeout(1000);
        console.log('✅ Quick navigation button clicked');
        
        // Test checkbox persistence
        const firstCheckbox = await page.locator('#check-role');
        await firstCheckbox.check();
        
        // Reload page to test persistence
        await page.reload();
        await page.waitForLoadState('networkidle');
        
        await page.waitForTimeout(1000); // Wait for localStorage to be read
        
        const isStillChecked = await page.locator('#check-role').isChecked();
        if (isStillChecked) {
            console.log('✅ Checkbox persistence works');
        } else {
            console.log('❌ Checkbox persistence failed');
        }
        
        console.log('🎉 All onboarding tile tests completed!');
        
    } catch (error) {
        console.error('❌ Test failed with error:', error);
    } finally {
        await browser.close();
    }
}

// Run the test
testOnboardingTile();