# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the **AEC (Algemene Economie C-cluster)** repository containing educational materials for a Dutch-language business economics course. The project centers around a business simulation where students take on executive roles (Board of Directors/Raad van Bestuur) and make strategic decisions based on AI-generated intelligence briefings.

## Educational Innovation Context

**This is not a traditional course but a pedagogical innovation designed to make HBO education "AI-proof".**

### Core Philosophy
- **Problem**: Traditional education becomes obsolete when students can simply use AI to complete assignments
- **Solution**: Accept AI output as given, focus on what humans do uniquely - strategic decision-making under uncertainty
- **Method**: Boardroom simulation with conflicting interests, building coherent strategy over time

### The Evolution (Design Journey)
1. **Phase 1**: "AI as intern" - Students improve AI output (abandoned)
2. **Phase 2**: "Boardroom Simulation" - AI output as briefing for decisions (PIVOT 1)
3. **Phase 3**: "Project Continuity" - Connected weekly narrative
4. **Phase 4**: "Dual Role" - Students as both RvB and RvT (PIVOT 2)
5. **Phase 5**: Website implementation (current version 5)

## Repository Structure

- `start-docs/` - Course documentation and module plans
  - `Moduleplan Project Continuïteit.md` - Complete 7-week course structure with detailed lesson plans
  - `De RvT Persona Kaarten.md` - Seven specialized supervisory board persona cards for peer evaluation
  - `Toetsoverzicht AEC.md` - Weekly assessment overview with specific assignment requirements

## Course Architecture

The course follows a **boardroom simulation model** where:

1. **Student teams become Boards of Directors (Raad van Bestuur/RvB)** with assigned roles:
   - CEO (De Balans-kunstenaar) - leads decisions, maintains vision and balance
   - CFO (De Kapitaal-Allocateur) - focuses on risk, returns, shareholder value (champions buyback option)
   - COO (De Optimalisator) - focuses on operational efficiency (champions Exploit strategy)
   - CIO (De Pionier) - focuses on innovation and disruption (champions Explore strategy)

2. **The Triangle Conflict (Het Driehoeksconflict)**:
   - **Exploit** (COO): Optimize current business, efficiency, short-term gains
   - **Explore** (CIO): Discover new business, innovation, long-term growth
   - **Buyback** (CFO): Return capital to shareholders, financial discipline
   - This creates a three-way tension that drives strategic decision-making

3. **Weekly cycle pattern**:
   - Pre-class: AI-generated intelligence briefing analysis
   - In-class: Boardroom simulation with strategic decision-making
   - Post-class: Document decision as strategic "pillar"

4. **Project Continuity Narrative**: Each week builds on previous decisions, creating one coherent strategy

5. **Final weeks transformation**: Teams switch from RvB to specialized Supervisory Board (Raad van Toezicht/RvT) roles using persona cards to evaluate other teams' strategies

## Weekly Structure Pattern

Each week follows a consistent three-part structure:
- **A. Self-study preparation** (AI task + role-specific analysis)
- **B. Workshop boardroom simulation** (15 min intro + 75-90 min simulation + decision documentation)
- **C. Teacher notes** (focus areas and conflict stimulation guidance)

## Key Educational Concepts

- **Strategic Pillars**: Week-by-week building of comprehensive strategy (Project Continuity)
- **The Triangle Conflict**: Three-way tension between Exploit, Explore, and Buyback strategies
- **Role-based decision making**: Different executive perspectives with conflicting interests
- **AI as Given**: AI output accepted as complete briefing, focus on decision-making
- **Dual Role System**: Students function as both RvB (executives) and RvT (supervisors)
- **WAAROM/HOE/WAT Structure**: Each assignment has didactic rationale, practical steps, and clear deliverables
- **Peer evaluation**: Seven specialized RvT personas for critical questioning

## Assessment Framework

- Weekly strategic decisions documented as "pillars"
- Final presentation of integrated strategy (Week 6/7)
- Dual evaluation: presentation skills as RvB + questioning skills as RvT
- Focus on synthesis, storytelling, and critical analysis rather than data reproduction

## Working with Course Materials

When modifying course content:
- Maintain the Dutch language throughout all materials
- Preserve the business simulation narrative structure
- Keep role-based perspective requirements for each executive position
- Ensure AI integration remains focused on strategic decision-making rather than passive consumption
- Maintain timing structures for boardroom simulations (very important for class management)

## File Conventions

- All documentation in Markdown format
- Dutch language for all educational content
- Structured headers for easy navigation
- Consistent formatting for role descriptions and weekly patterns

## Website Project

### Overview
A GitHub Pages website is being developed to serve three distinct user groups:
1. **Studenten** - Interactive week overview, role information, AI briefing tools, triangle conflict visualization
2. **Docenten** - Lesson plans with WAAROM/HOE/WAT structure, timing guides, didactic instructions
3. **Curriculum Commissie** - Risk management, educational accountability, pedagogical innovation rationale

### Version History
- **V1**: Basic lesson plans and accountability documents
- **V2**: UX refinement for web application feel
- **V3**: Added WAAROM/HOE/WAT structure for clarity
- **V4**: Added submission moments and feedback flow
- **V5**: Full pedagogical context and triangle conflict
- **V6**: Performance optimization (removed GPU-dependent effects)
- **V7**: Current version with week details modal and bug fixes

### Recent Changes (Post-Deployment)
1. **Performance Optimization**
   - Removed all backdrop-filter CSS properties (glassmorphism)
   - Simplified visual effects for older computers
   - Replaced transparent backgrounds with solid colors
   - Removed complex animations

2. **Bug Fixes**
   - Fixed hover issue on role cards (z-index problem)
   - Ensured content stays visible during interactions

3. **New Features**
   - Dynamic week details modal with content from JSON
   - WAAROM/HOE/WAT tabs in modal view
   - AI prompt display with copy-to-clipboard
   - Full integration with content.json data

### Technical Architecture
- **Pure frontend** - No backend required, runs directly on GitHub Pages
- **Multi-page structure** - Separate HTML files per stakeholder group
- **JSON-driven content** - All course data in a single content.json file
- **Vanilla JavaScript** - No frameworks, lightweight and fast
- **Modern CSS** - Glassmorphism effects with custom properties
- **Shared components** - Navigation and utilities loaded via JavaScript

### Architecture Rationale
Chosen for **separate HTML pages** instead of SPA because:
- Each user group (students/teachers/committee) typically only needs their section
- Direct bookmarkable URLs (docenten.html, studenten.html)
- Simpler to understand and maintain for non-technical users
- Better SEO and faster initial load per user group
- Natural fit with GitHub Pages file-based routing

### File Structure
```
website/
├── index.html              # Landing page with navigation to 3 stakeholder pages
├── studenten.html          # Student interface with week overview and roles
├── studenten-script.js     # Student portal JavaScript (modals, interactions)
├── studenten-styles.css    # Student portal specific styles
├── docenten.html           # Teacher dashboard with lesson plans and timing
├── docenten-script.js      # Teacher dashboard JavaScript (timer, navigation)
├── docenten-styles.css     # Teacher dashboard specific styles
├── commissie.html          # Committee page with risk matrix and accountability
├── commissie-script.js     # Committee portal JavaScript
├── commissie-styles.css    # Committee portal specific styles
├── styles.css              # Shared styling (optimized, no backdrop-filter)
├── script.js               # Shared JavaScript functionality
├── content.json            # Complete course content database
├── content-loader.js       # Content loading and rendering system
├── test-playwright.js      # Automated test suite for Playwright MCP
└── tasks/
    └── tasks-PRD.md        # Project task tracking and requirements

docs/                       # GitHub Pages deployment (mirror of website/)
├── [all website files]     # Exact copy for production deployment

.github/
└── workflows/
    └── static.yml          # GitHub Pages deployment configuration
```

## Design Guidelines

### Color Scheme
- **Primary**: Fresh apple green (#8FD14F, #A8E06A for gradients)
- **Accent**: Raspberry red (#E63946, #FF6B6B for highlights)
- **Base**: Crystal white with transparency (rgba(255,255,255,0.9))
- **Background**: Soft grey (#F8F9FA)

### Visual Philosophy
- **Serenity & Space** - Generous padding, breathing room between elements
- **Water Theme** - Fluid animations, ripple effects, wave patterns
- **Transparency** - Glass morphism with backdrop blur effects
- **Clarity** - High contrast, clear typography hierarchy

### UX Principles
- Mobile-first responsive design
- Smooth transitions (300ms ease)
- Accessible with ARIA labels and keyboard navigation
- Print-friendly layouts for docenten

### Pedagogical Design Principles
- **Make Conflict Visible**: Triangle conflict visualization must be prominent
- **Show Continuity**: Visual connections between weekly decisions
- **Role Clarity**: Clear indication of current role and its interests
- **AI Integration**: Seamless copy-paste flow for AI prompts
- **Dual Identity**: Easy switch between RvB and RvT perspectives

## Development Workflow

### Scaffolding Approach
Work in small, testable increments:
1. Create minimal working component
2. Write and execute tests
3. Get user approval
4. Proceed to next step

### Testing Protocol
- Create test file for each development step
- Store test results in `tests/test-results.json`
- Validate HTML, CSS, and JavaScript functionality
- Test on multiple screen sizes
- Check accessibility compliance

### Step-by-Step Implementation
1. **Foundation** - Create folder structure and landing page (index.html)
2. **Styling** - CSS with theme colors and glassmorphism
3. **Shared JS** - Common utilities and navigation loader
4. **Test Foundation** - Validate base structure works
5. **Student Page** - Create studenten.html with week overview
6. **Content JSON** - Build data structure with course content
7. **Student Features** - Add roles, AI briefings, progress tracking
8. **Test Students** - Validate student interface
9. **Teacher Page** - Create docenten.html with lesson plans
10. **Teacher Features** - Add timing tools, didactic notes
11. **Test Teachers** - Validate teacher dashboard
12. **Committee Page** - Create commissie.html with risk overview
13. **Committee Features** - Add risk matrix, mitigation strategies
14. **Test Committee** - Validate committee interface
15. **Final Integration** - Test all pages together

## Content Management

### JSON Structure
```json
{
  "metadata": {
    "version": "1.0",
    "lastUpdated": "2024-08-24"
  },
  "course": {
    "name": "Algemene Economie C-cluster",
    "abbreviation": "AEC"
  },
  "weeks": [...],
  "roles": [...],
  "risks": [...],
  "personas": [...]
}
```

### Content Updates
- Edit content.json directly
- Maintain version number
- Test after each update
- No rebuild required

## Deployment

### GitHub Pages Setup
1. Push all files to main branch
2. Enable GitHub Pages in repository settings
3. Select `/docs` folder as source (configured)
4. Website available at: `https://hanbedrijfskunde.github.io/aecc/`

### Current Status
- **Live URL**: https://hanbedrijfskunde.github.io/aecc/
- **Deployment Folder**: `/docs` (mirror of `/website`)
- **GitHub Actions**: Configured for automatic deployment

### Requirements
- Modern browser with JavaScript enabled
- No server-side processing needed
- Works offline after initial load (cached resources)
- **Performance Note**: CSS optimized for older computers without hardware acceleration

## Task List Management

### Working with Task Lists
The project uses a detailed task list in `/website/tasks/tasks-PRD.md` to track implementation progress. Follow these strict guidelines:

### Implementation Protocol
1. **One sub-task at a time**: 
   - Do NOT start the next sub-task until asking for user permission
   - User must respond with "yes" or "y" to proceed
   - This ensures controlled, reviewable progress

2. **Completion Protocol**:
   When finishing a sub-task:
   - Immediately mark it as completed by changing `[ ]` to `[x]`
   - Update the task list file
   - Stop and ask: "Sub-task X.X completed. May I proceed with the next sub-task?"
   
   When all sub-tasks under a parent are complete:
   - Run any applicable tests (for this project: browser testing)
   - Stage changes: `git add .`
   - Remove any temporary files
   - Commit with descriptive message:
     ```bash
     git commit -m "feat: complete task X.0 - [description]" -m "- [key change 1]" -m "- [key change 2]" -m "Related to task X.0 in PRD"
     ```
   - Mark the parent task as `[x]`

3. **Task List Maintenance**:
   - Keep the "Relevant Files" section updated with all created/modified files
   - Add new tasks as they emerge during development
   - Include brief descriptions for each file's purpose

### Working Order
1. Check `/website/tasks/tasks-PRD.md` to identify the next incomplete sub-task
2. Implement only that specific sub-task
3. Update the task list marking the sub-task as complete
4. Wait for user approval before continuing
5. Repeat until all tasks are complete

### Important Notes
- Never skip ahead or work on multiple sub-tasks simultaneously
- Always update the task list immediately after completing work
- The scaffolding approach ensures quality and allows for course corrections
- This systematic approach aligns with the pedagogical design philosophy of the project