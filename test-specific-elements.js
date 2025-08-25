const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function testSpecificElements() {
    console.log('Testing specific Sprint elements...');
    
    const browser = await chromium.launch({ 
        headless: false,
        slowMo: 1000
    });
    
    const context = await browser.newContext({
        viewport: { width: 1440, height: 900 }
    });
    
    const page = await context.newPage();
    
    const screenshotsDir = path.join(__dirname, 'test-screenshots-specific');
    if (!fs.existsSync(screenshotsDir)) {
        fs.mkdirSync(screenshotsDir);
    }
    
    try {
        await page.goto('https://hanbedrijfskunde.github.io/aecc/studenten.html');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(2000); // Wait for any scripts to load
        
        console.log('\n=== DETAILED ELEMENT ANALYSIS ===');
        
        // 1. Triangle Conflict Section
        console.log('\n1. Triangle Conflict Analysis:');
        const triangleSection = await page.locator('.triangle-conflict').count();
        console.log(`   Triangle conflict section: ${triangleSection > 0 ? 'FOUND' : 'NOT FOUND'}`);
        
        if (triangleSection > 0) {
            await page.locator('.triangle-conflict').scrollIntoViewIfNeeded();
            await page.screenshot({ 
                path: path.join(screenshotsDir, 'triangle-section.png'),
                clip: { x: 0, y: 0, width: 1440, height: 600 }
            });
            
            const svgElements = await page.locator('.triangle-conflict svg').count();
            const strategyCards = await page.locator('.strategy-card').count();
            const nodes = await page.locator('.strategy-node').count();
            
            console.log(`   SVG elements: ${svgElements}`);
            console.log(`   Strategy cards: ${strategyCards}`);
            console.log(`   Strategy nodes: ${nodes}`);
            
            // Try clicking on strategy nodes
            const exploitNode = await page.locator('.exploit-node').count();
            if (exploitNode > 0) {
                await page.locator('.exploit-node').click();
                await page.waitForTimeout(1000);
                console.log('   ✓ Clicked exploit node');
            }
        }
        
        // 2. Week Modal Analysis
        console.log('\n2. Week Modal Analysis:');
        const weekCards = await page.locator('.week-card').count();
        console.log(`   Week cards found: ${weekCards}`);
        
        if (weekCards > 0) {
            // Try clicking the first week card button
            const firstWeekBtn = await page.locator('.week-card .week-btn').first();
            const btnExists = await firstWeekBtn.count() > 0;
            console.log(`   First week button exists: ${btnExists}`);
            
            if (btnExists) {
                await firstWeekBtn.scrollIntoViewIfNeeded();
                await firstWeekBtn.click();
                await page.waitForTimeout(2000);
                
                // Look for any modal
                const modals = await page.locator('.modal, [role="dialog"], .popup, .overlay').count();
                console.log(`   Modals after click: ${modals}`);
                
                await page.screenshot({ 
                    path: path.join(screenshotsDir, 'after-week-click.png'),
                    fullPage: true
                });
            }
        }
        
        // 3. Timeline Items Analysis
        console.log('\n3. Timeline Items Analysis:');
        const timelineItems = await page.locator('.timeline-item').count();
        console.log(`   Timeline items found: ${timelineItems}`);
        
        if (timelineItems > 0) {
            const firstTimelineItem = await page.locator('.timeline-item').first();
            await firstTimelineItem.scrollIntoViewIfNeeded();
            await firstTimelineItem.click();
            await page.waitForTimeout(2000);
            
            // Check for modal after timeline click
            const modalAfterTimeline = await page.locator('.modal, [role="dialog"], .week-modal, .detail-modal').count();
            console.log(`   Modals after timeline click: ${modalAfterTimeline}`);
            
            await page.screenshot({ 
                path: path.join(screenshotsDir, 'after-timeline-click.png'),
                fullPage: true
            });
        }
        
        // 4. Check for JavaScript errors
        console.log('\n4. JavaScript Console Analysis:');
        const logs = [];
        page.on('console', msg => logs.push(msg.text()));
        page.on('pageerror', error => logs.push(`ERROR: ${error.message}`));
        
        await page.reload();
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(3000);
        
        console.log('   Console logs:');
        logs.forEach(log => console.log(`     ${log}`));
        
        // 5. Check what scripts are loaded
        console.log('\n5. Script Loading Analysis:');
        const scripts = await page.evaluate(() => {
            const scriptTags = Array.from(document.querySelectorAll('script[src]'));
            return scriptTags.map(script => script.src);
        });
        
        console.log('   Loaded scripts:');
        scripts.forEach(script => {
            const filename = script.split('/').pop();
            console.log(`     ${filename}`);
        });
        
        // 6. Check if functions exist
        console.log('\n6. Function Availability:');
        const functionsExist = await page.evaluate(() => {
            return {
                showWeekDetails: typeof window.showWeekDetails !== 'undefined',
                copyPrompt: typeof window.copyPrompt !== 'undefined',
                showOnboarding: typeof window.showOnboarding !== 'undefined',
                showFAQ: typeof window.showFAQ !== 'undefined'
            };
        });
        
        console.log(`   showWeekDetails: ${functionsExist.showWeekDetails ? 'EXISTS' : 'MISSING'}`);
        console.log(`   copyPrompt: ${functionsExist.copyPrompt ? 'EXISTS' : 'MISSING'}`);
        console.log(`   showOnboarding: ${functionsExist.showOnboarding ? 'EXISTS' : 'MISSING'}`);
        console.log(`   showFAQ: ${functionsExist.showFAQ ? 'EXISTS' : 'MISSING'}`);
        
        // 7. Final comprehensive screenshot
        await page.screenshot({ 
            path: path.join(screenshotsDir, 'final-comprehensive.png'),
            fullPage: true
        });
        
        console.log(`\nScreenshots saved to: ${screenshotsDir}`);
        
    } catch (error) {
        console.error('Test execution error:', error);
    } finally {
        await browser.close();
    }
}

testSpecificElements().then(() => {
    console.log('\nDetailed analysis completed!');
    process.exit(0);
}).catch(error => {
    console.error('Failed to run analysis:', error);
    process.exit(1);
});