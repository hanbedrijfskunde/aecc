# GitHub Issues to Create for AEC Platform

Copy and paste these issues into GitHub: https://github.com/hanbedrijfskunde/aecc/issues/new

---

## Issue 1: 🔴 CRITICAL: Progress indicator shows all weeks as completed

### Description
The progress indicator always shows "7 van 7 weken voltooid" regardless of actual student progress.

### User Story
As Emma (new student), I was trying to understand my progress in the course but the indicator shows all weeks as completed even though I just started.

### Steps to Reproduce
1. Go to https://hanbedrijfskunde.github.io/aecc/studenten.html
2. Look at the progress indicator at the top
3. Observe it shows 7/7 weeks completed

### Expected Behavior
Progress should show actual completed weeks (e.g., "0 van 7 weken voltooid" for new students)

### Actual Behavior
Always shows "7 van 7 weken voltooid" for all students

### Severity
🔴 **CRITICAL** - Misleads students about course progress

### Suggested Fix
Implement dynamic progress tracking based on actual week completion status

---

## Issue 2: 🔴 CRITICAL: No submission functionality exists

### Description
There are no visible submit or upload buttons anywhere in the student portal. Students cannot submit their assignments.

### User Story
As Lars, I need to submit my Week 3 assignment but I cannot find any way to upload or submit my work.

### Steps to Reproduce
1. Go to https://hanbedrijfskunde.github.io/aecc/studenten.html
2. Click on any week's "Bekijk Resultaten" button
3. Look for submit/upload functionality
4. Check entire page for submission options

### Expected Behavior
Clear submission interface with upload capability for each week's assignment

### Actual Behavior
No submission functionality exists anywhere

### Severity
🔴 **CRITICAL** - Blocks core functionality; students cannot complete assignments

### Suggested Fix
Add submission interface with:
- Upload button for documents
- Form for text submissions
- Confirmation of successful submission
- View submitted work functionality

---

## Issue 3: 🔴 CRITICAL: Week detail modals show fallback content

### Description
When clicking on week cards in "Project Continuïteit" section, the modal opens but displays placeholder text instead of actual week content.

### User Story
As a student trying to review Week 1 details, the modal shows "Gedetailleerde informatie over week 1 komt hier..." instead of actual content.

### Steps to Reproduce
1. Go to https://hanbedrijfskunde.github.io/aecc/studenten.html
2. Scroll to "Project Continuïteit" section
3. Click on "Week 1: Fundament" card
4. Observe modal content

### Expected Behavior
Modal should display actual week details including assignments, AI prompts, and deliverables

### Actual Behavior
Modal shows generic fallback text

### Severity
🔴 **CRITICAL** - Students cannot access assignment details

### Suggested Fix
- Fix data binding between content.json and modal templates
- Ensure parseInt() is used for week numbers
- Add error handling for missing content

---

## Issue 4: 🟠 HIGH: Missing onboarding flow for new students

### Description
New students land on the platform with no guidance on how to start or what to do first.

### User Story
As Emma (first-time user), I'm confused about where to start and what this course is about.

### Steps to Reproduce
1. Visit https://hanbedrijfskunde.github.io/aecc/ as a new user
2. Navigate to student portal
3. Look for "Getting Started" or "How to use" information

### Expected Behavior
Clear onboarding with:
- Welcome message
- Course overview
- Step-by-step first assignment guide
- Role selection/assignment process

### Actual Behavior
No onboarding exists; students must figure everything out themselves

### Severity
🟠 **HIGH** - Causes confusion and potential dropouts in first week

### Suggested Fix
Implement welcome wizard or guided tour for first-time users

---

## Issue 5: 🟠 HIGH: Triangle Conflict section is empty

### Description
The "Het Driehoeksconflict" section, which is core to the pedagogical concept, shows only a title with no content or visualization.

### User Story
As a student, I need to understand the strategic tensions between Exploit, Explore, and Buyback, but the section is empty.

### Steps to Reproduce
1. Go to https://hanbedrijfskunde.github.io/aecc/studenten.html
2. Look at "Het Driehoeksconflict" section
3. Observe it only shows the title

### Expected Behavior
Interactive triangle visualization showing:
- Three strategic directions
- Role relationships (CEO, CFO, COO, CIO)
- Explanations of each strategy

### Actual Behavior
Empty section with only title

### Severity
🟠 **HIGH** - Core pedagogical concept not explained

### Suggested Fix
Add interactive triangle visualization with detailed explanations

---

## Issue 6: 🟠 HIGH: No copy functionality for AI prompts

### Description
Students must manually select and copy complex AI prompts, which is error-prone and frustrating.

### User Story
As a student needing to copy the Week 1 AI prompt, I have to manually select the entire text which often misses parts.

### Steps to Reproduce
1. Go to https://hanbedrijfskunde.github.io/aecc/studenten.html
2. Find AI Briefing Templates section
3. Try to copy the prompt text
4. Notice no copy button exists

### Expected Behavior
One-click copy button next to each AI prompt

### Actual Behavior
Manual selection required

### Severity
🟠 **HIGH** - Significant friction in core workflow

### Suggested Fix
Add "📋 Kopieer Prompt" button with clipboard API integration

---

## Issue 7: 🟡 MEDIUM: Mobile navigation issues

### Description
On mobile devices, the triangle conflict and role cards don't adapt well, making them difficult to read and interact with.

### User Story
As Sofia checking on my phone, I can't properly see the role descriptions or understand the triangle conflict.

### Steps to Reproduce
1. Open https://hanbedrijfskunde.github.io/aecc/studenten.html on mobile (375x667)
2. Try to read role cards
3. Try to understand triangle conflict
4. Navigate between sections

### Expected Behavior
- Role cards stack vertically on mobile
- Triangle conflict has mobile-friendly visualization
- All text remains readable

### Actual Behavior
- Content gets cramped
- Some elements overlap
- Text becomes too small

### Severity
🟡 **MEDIUM** - Affects mobile users but site is still usable

### Suggested Fix
- Create mobile-specific layouts
- Stack elements vertically on small screens
- Increase touch target sizes

---

## Issue 8: 🟡 MEDIUM: No keyboard navigation support

### Description
Users cannot navigate the interface using keyboard only, failing accessibility requirements.

### User Story
As a user relying on keyboard navigation, I cannot tab through interactive elements properly.

### Steps to Reproduce
1. Go to https://hanbedrijfskunde.github.io/aecc/studenten.html
2. Press Tab to navigate
3. Try to open modals with Enter key
4. Notice focus indicators are missing

### Expected Behavior
- All interactive elements reachable via Tab
- Clear focus indicators
- Enter/Space activate buttons
- Escape closes modals

### Actual Behavior
- Some elements not reachable
- No visible focus indicators
- Keyboard shortcuts don't work

### Severity
🟡 **MEDIUM** - Accessibility requirement failure

### Suggested Fix
- Add tabindex where needed
- Implement focus styles
- Add keyboard event handlers
- Trap focus in modals

---

## Issue 9: 🟢 LOW: Duplicate week cards displayed

### Description
The 7-week program shows 14 week cards (duplicates of all 7 weeks).

### User Story
As a student, I see each week listed twice which is confusing.

### Steps to Reproduce
1. Go to https://hanbedrijfskunde.github.io/aecc/studenten.html
2. Count the week cards in "7 Weken Programma" section
3. Observe 14 cards instead of 7

### Expected Behavior
7 unique week cards

### Actual Behavior
14 cards (each week appears twice)

### Severity
🟢 **LOW** - Visual confusion but functionality works

### Suggested Fix
Fix the rendering logic to prevent duplication

---

## Issue 10: 🟢 LOW: No help or FAQ section

### Description
Students have nowhere to find answers to common questions.

### User Story
As Ahmed with questions about the course, I can't find a help section or FAQ.

### Steps to Reproduce
1. Go to https://hanbedrijfskunde.github.io/aecc/studenten.html
2. Look for Help, FAQ, or Support links
3. Search for documentation

### Expected Behavior
Comprehensive help section with:
- FAQ
- Contact information
- Troubleshooting guide
- Video tutorials

### Actual Behavior
No help resources available

### Severity
🟢 **LOW** - Increases support burden but not blocking

### Suggested Fix
Add comprehensive help documentation and FAQ section

---

## Summary

- **Critical Issues**: 3 (must fix immediately)
- **High Priority**: 3 (fix within 1 week)
- **Medium Priority**: 2 (fix within 2-3 weeks)
- **Low Priority**: 2 (fix when possible)

The platform needs immediate attention to core functionality (submission system, progress tracking, content loading) before it can be used by students.