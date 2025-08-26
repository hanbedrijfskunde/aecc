# Development Directory

This directory contains development artifacts, prototypes, and archived materials that are not part of the production website.

## Directory Structure

```
dev/
├── README.md           # This file
├── archived/           # Archived development files
├── test-artifacts/     # Test results, screenshots, debugging output
└── prototypes/         # Experimental code and design prototypes
```

## Contents

### `/archived/`
- Historical development files
- Old test implementations
- Deprecated prototypes

### `/test-artifacts/`  
- Playwright test results and screenshots
- Performance audit outputs
- Debug logs and error contexts
- Visual regression test baselines

### `/prototypes/`
- Experimental UI components
- Design system prototypes  
- Feature mockups and trials

## Usage Guidelines

1. **Keep production clean** - Only production-ready files should be in `/docs/`
2. **Archive responsibly** - Move old files here before deleting
3. **Document experiments** - Add README files for complex prototypes
4. **Clean periodically** - Remove outdated artifacts monthly

## Excluded from Git
Large test artifacts and temporary files should be added to `.gitignore` if they become excessive.

---
*Created: 2025-08-26*  
*Purpose: Organize development artifacts separately from production code*