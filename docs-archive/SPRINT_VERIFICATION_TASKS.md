# Sprint Verification Tasks

## Current Status
Sprint 1 and Sprint 2 have been implemented but are not fully visible on the live site. This task list covers verification and troubleshooting needed.

## Sprint 1: Critical Content Fixes
### ✅ Completed Tasks (Verified Working)
- [x] 1.1 Fix week detail modals to show actual JSON content
  - Modal shows real content from content.json
  - WAAROM/HOE/WAT tabs work correctly
  - Week numbers properly parsed with parseInt()
- [x] 1.2 Fix copy-to-clipboard functionality for AI prompts
  - Copy button exists and functions
  - Shows feedback "Gekopieerd!" on click
  - Uses Clipboard API with fallback

### ❌ Not Visible on Live Site
- [ ] 1.3 Enhance triangle conflict visualization
  - Should show animated SVG with gradients
  - Should have pulsing animation on circles
  - Should display enhanced colors and effects
  - **Issue**: Basic version shows, enhanced version missing

## Sprint 2: User Experience Enhancements
### ❌ Not Visible on Live Site
- [ ] 2.1 Onboarding flow system
  - Should show 5-step welcome tour on first visit
  - Should allow role selection
  - Should persist completion in localStorage
  - **Issue**: onboarding.js not loading/executing
  
- [ ] 2.2 FAQ system
  - Should show FAQ button in bottom right
  - Should open modal with 18 questions in 6 categories
  - Should have search functionality
  - **Issue**: faq.js not loading/executing
  
- [ ] 2.3 Help button
  - Should appear in navigation or interface
  - Should provide contextual help
  - **Issue**: Not visible anywhere

## Verification Tasks

### 🔍 Immediate Checks Needed
- [ ] Check if onboarding.js is deployed to /docs folder
- [ ] Check if faq.js is deployed to /docs folder
- [ ] Verify script tags are present in deployed HTML
- [ ] Check browser console for JavaScript errors
- [ ] Verify enhanced triangle SVG is in deployed HTML
- [ ] Check if CSS enhancements are in deployed styles
- [ ] Test localStorage for onboarding persistence
- [ ] Clear browser cache and hard refresh

### 🛠️ Potential Fixes Required
- [ ] Ensure /website changes are mirrored to /docs
- [ ] Verify GitHub Pages deployment is up-to-date
- [ ] Check if script loading order is correct
- [ ] Verify no CORS or security issues blocking scripts
- [ ] Ensure all new files are committed and pushed
- [ ] Check if GitHub Actions deployment succeeded

### 📸 Documentation Needed
- [ ] Screenshot current live site showing missing features
- [ ] Screenshot local version showing working features
- [ ] Document console errors if any
- [ ] Compare deployed files with local files
- [ ] Create before/after comparison images

## File Checklist

### Files That Should Exist in /docs
- [ ] `/docs/onboarding.js` - Onboarding flow system
- [ ] `/docs/faq.js` - FAQ system implementation
- [ ] `/docs/studenten.html` - Should include script tags for onboarding.js and faq.js
- [ ] `/docs/studenten-script.js` - Should have updated showWeekDetails with parseInt
- [ ] `/docs/studenten-styles.css` - Should have enhanced triangle styles
- [ ] `/docs/content.json` - Should have complete course content

### Script Tags to Verify in studenten.html
```html
<!-- Should be present near bottom of body -->
<script src="onboarding.js"></script>
<script src="faq.js"></script>
```

### Enhanced Triangle SVG to Verify
```html
<!-- Should replace basic triangle in studenten.html -->
<svg viewBox="0 0 400 350" with animated gradients and filters>
```

## Testing Protocol

### Manual Testing Steps
1. [ ] Open https://hanbedrijfskunde.github.io/aecc/studenten.html
2. [ ] Open browser developer console
3. [ ] Check for any red error messages
4. [ ] Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
5. [ ] Check if onboarding appears (first visit simulation)
6. [ ] Look for FAQ button (bottom right corner)
7. [ ] Click on week cards to test modal content
8. [ ] Test copy button in modal
9. [ ] Inspect triangle conflict visualization
10. [ ] Clear localStorage and refresh to test onboarding

### Automated Testing with Playwright
1. [ ] Navigate to live site
2. [ ] Take screenshot of initial load
3. [ ] Check for presence of FAQ button
4. [ ] Check for onboarding elements
5. [ ] Click week card and verify content
6. [ ] Test copy functionality
7. [ ] Capture triangle conflict appearance
8. [ ] Check console for errors
9. [ ] Compare with expected behavior

## Root Cause Analysis

### Possible Issues
1. **Deployment not updated**: GitHub Pages using old version
2. **File not copied**: /website files not mirrored to /docs
3. **Script loading failure**: JavaScript files not loading
4. **Cache issues**: Browser using cached old version
5. **Path issues**: Scripts referenced with wrong paths
6. **Execution order**: Scripts running before DOM ready
7. **Syntax errors**: JavaScript errors preventing execution

## Next Steps Priority

### High Priority (Do First)
1. Verify files exist in /docs folder
2. Check GitHub Pages deployment status
3. Test on incognito/private browser window
4. Check browser console for errors

### Medium Priority
5. Compare local vs deployed file contents
6. Test script loading with network tab
7. Verify all git commits were pushed

### Low Priority
8. Create detailed bug report
9. Document workarounds
10. Plan Sprint 3 based on findings

## Success Criteria

Sprint 1 & 2 are considered successfully deployed when:
- [ ] Onboarding flow appears for new users
- [ ] FAQ button is visible and functional
- [ ] Week modals show actual JSON content
- [ ] Copy buttons work with feedback
- [ ] Triangle conflict shows enhanced visualization
- [ ] No JavaScript errors in console
- [ ] All features work on Chrome, Firefox, Safari
- [ ] Features persist after page refresh

## Time Estimate
- Verification: 1-2 hours
- Debugging: 2-4 hours
- Fixes: 1-2 hours
- Testing: 1 hour
- **Total**: 5-9 hours

## Report Format

When complete, create sprint-verification-report.md with:
1. Features working as expected
2. Features not working with root cause
3. Screenshots of issues
4. Console error logs
5. Recommended fixes
6. Deployment checklist for future sprints