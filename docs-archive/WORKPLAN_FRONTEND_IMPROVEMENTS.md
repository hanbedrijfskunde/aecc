# Frontend Improvement Workplan - AEC Platform

## Overview
This workplan addresses the UX/UI issues that can be fixed without backend implementation. Issues #1 (progress tracking) and #2 (submission system) are deferred until backend development.

---

## Sprint 1: Critical Content Fixes (Week 1)
**Goal**: Fix broken content loading and core pedagogical elements

### 🔴 Issue #3: Week detail modals show fallback content
**Priority**: CRITICAL  
**Estimated Time**: 4 hours  
**Tasks**:
- [ ] Debug `showWeekDetails()` function in `studenten-script.js`
- [ ] Ensure proper parseInt() for week numbers from timeline cards
- [ ] Fix data binding between `content.json` and modal templates
- [ ] Add error handling for missing week data
- [ ] Test all 7 week modals load correctly
- [ ] Verify both "Bekijk Resultaten" and "Project Continuïteit" cards work

### 🟠 Issue #5: Triangle Conflict section is empty
**Priority**: HIGH  
**Estimated Time**: 6 hours  
**Tasks**:
- [ ] Create SVG visualization for triangle conflict
- [ ] Add interactive hover states for each vertex (Exploit/Explore/Buyback)
- [ ] Implement role positioning (CEO center, CFO/COO/CIO at vertices)
- [ ] Add explanatory text for each strategy
- [ ] Create animations for strategy selection
- [ ] Make responsive for mobile devices

### 🟠 Issue #6: Add copy functionality for AI prompts
**Priority**: HIGH  
**Estimated Time**: 2 hours  
**Tasks**:
- [ ] Add copy button component with clipboard icon
- [ ] Implement clipboard API functionality
- [ ] Add success feedback (checkmark animation)
- [ ] Add fallback for older browsers
- [ ] Apply to all AI prompt sections
- [ ] Test on mobile devices

---

## Sprint 2: User Experience Enhancements (Week 2)
**Goal**: Improve navigation and provide guidance for new users

### 🟠 Issue #4: Create persistent onboarding tile for students
**Priority**: HIGH  
**Estimated Time**: 8 hours  
**Tasks**:
- [ ] Design persistent "Onboarding & Help" tile on student dashboard
- [ ] Create expandable reference card with course overview
- [ ] Add role explanations in accessible format
- [ ] Implement "Getting Started" checklist that stays visible
- [ ] Add quick reference guides for each week
- [ ] Make tile collapsible but always accessible
- [ ] Include tooltips and contextual help throughout interface
- [ ] Style as prominent dashboard widget students can always consult

### 🟢 Issue #10: Add help/FAQ section
**Priority**: LOW  
**Estimated Time**: 4 hours  
**Tasks**:
- [ ] Create FAQ accordion component
- [ ] Write FAQ content (10-15 common questions)
- [ ] Add search functionality for FAQ
- [ ] Create help modal accessible from all pages
- [ ] Add contact information section
- [ ] Include links to resources

### 🟢 Issue #9: Fix duplicate week cards
**Priority**: LOW  
**Estimated Time**: 1 hour  
**Tasks**:
- [ ] Debug week card rendering logic
- [ ] Remove duplication in loop/array
- [ ] Verify only 7 cards display
- [ ] Test week navigation still works

---

## Sprint 3: Mobile & Accessibility (Week 3)
**Goal**: Ensure platform works well on all devices and for all users

### 🟡 Issue #7: Improve mobile responsiveness
**Priority**: MEDIUM  
**Estimated Time**: 6 hours  
**Tasks**:
- [ ] Create mobile-specific CSS breakpoints
- [ ] Stack role cards vertically on small screens
- [ ] Redesign triangle conflict for mobile (simplified version)
- [ ] Increase touch target sizes to 44x44px minimum
- [ ] Fix modal scrolling on mobile
- [ ] Test on various device sizes (iPhone SE to iPad)
- [ ] Add hamburger menu for mobile navigation

### 🟡 Issue #8: Implement keyboard navigation
**Priority**: MEDIUM  
**Estimated Time**: 5 hours  
**Tasks**:
- [ ] Add tabindex to all interactive elements
- [ ] Implement visible focus indicators (outline styles)
- [ ] Add keyboard event handlers (Enter, Space, Escape)
- [ ] Implement focus trapping in modals
- [ ] Add skip navigation link
- [ ] Test with keyboard-only navigation
- [ ] Add ARIA labels and roles

---

## Implementation Schedule

### Week 1 (24 hours)
**Sprint 1: Critical Content Fixes**
- Monday-Tuesday: Fix week detail modals (Issue #3)
- Wednesday-Thursday: Implement triangle conflict visualization (Issue #5)
- Friday: Add copy buttons for AI prompts (Issue #6)

### Week 2 (13 hours)
**Sprint 2: User Experience**
- Monday-Tuesday: Create persistent onboarding tile (Issue #4)
- Wednesday: Add FAQ section (Issue #10)
- Thursday: Fix duplicate week cards (Issue #9)
- Friday: Testing and bug fixes

### Week 3 (11 hours)
**Sprint 3: Mobile & Accessibility**
- Monday-Tuesday: Mobile responsiveness (Issue #7)
- Wednesday-Thursday: Keyboard navigation (Issue #8)
- Friday: Final testing and deployment

---

## Success Metrics

### Immediate Improvements
- ✅ All week modals load content correctly
- ✅ Triangle conflict is visible and interactive
- ✅ AI prompts can be copied with one click
- ✅ No duplicate week cards

### User Experience Improvements
- ✅ Students have persistent access to onboarding information
- ✅ Help tile always visible on dashboard
- ✅ Reference materials easily accessible
- ✅ Mobile users can navigate effectively
- ✅ Keyboard users can access all features

### Technical Improvements
- ✅ No console errors
- ✅ All content loads from JSON correctly
- ✅ LocalStorage used for user preferences
- ✅ WCAG 2.1 AA compliance for accessibility

---

## Development Guidelines

### Code Quality
- Use consistent naming conventions
- Add comments for complex logic
- Keep functions small and focused
- Use modern ES6+ JavaScript features
- Maintain existing code style

### Testing Protocol
1. Test each fix in isolation
2. Verify no regressions in other features
3. Test on multiple browsers (Chrome, Firefox, Safari)
4. Test on mobile devices
5. Validate accessibility with screen reader

### Git Workflow
```bash
# Create feature branch for each issue
git checkout -b fix/issue-3-modal-content

# Commit with clear messages
git commit -m "fix: populate week detail modals with JSON content"

# Push and create PR
git push origin fix/issue-3-modal-content
```

---

## Risk Mitigation

### Potential Blockers
1. **Content structure changes**: Coordinate with content team before modifying JSON
2. **Browser compatibility**: Test clipboard API fallbacks
3. **Performance**: Monitor for lag with animations/visualizations
4. **Accessibility conflicts**: Ensure visual enhancements don't break screen readers

### Fallback Plans
- If triangle visualization is too complex: Start with static image
- If onboarding tile is too complex: Create simple help card first
- If mobile fixes break desktop: Use progressive enhancement approach

---

## Future Considerations (Post-Backend)

Once backend is implemented, revisit:
- Issue #1: Dynamic progress tracking
- Issue #2: Assignment submission system
- User authentication and personalization
- Data persistence across sessions
- Real-time collaboration features

---

## Total Estimated Time: 48 hours

### Resource Requirements
- 1 Frontend Developer (full-time for 3 weeks)
- UI/UX Designer consultation (4 hours for onboarding flow)
- Content review from teaching team (2 hours)
- Testing support (4 hours total)

---

## Next Steps
1. Review and approve workplan
2. Set up development environment
3. Create feature branches
4. Begin with Sprint 1 critical fixes
5. Deploy fixes incrementally for immediate impact