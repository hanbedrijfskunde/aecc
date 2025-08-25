#!/bin/bash

# AEC Deployment Script
# Validates and deploys the website to GitHub Pages

set -e  # Exit on any error

echo "🚀 AEC Deployment Script"
echo "========================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
print_status "Checking prerequisites..."

if ! command -v git &> /dev/null; then
    print_error "Git is not installed"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    print_error "NPM is not installed"
    exit 1
fi

if [ ! -f "package.json" ]; then
    print_error "package.json not found. Run from project root."
    exit 1
fi

print_success "Prerequisites check passed"

# Check git status
print_status "Checking git status..."

if ! git diff-index --quiet HEAD --; then
    print_warning "You have uncommitted changes. Please commit or stash them first."
    git status --porcelain
    exit 1
fi

if [ "$(git rev-parse --abbrev-ref HEAD)" != "main" ]; then
    print_warning "You are not on the main branch. Switch to main before deploying."
    echo "Current branch: $(git rev-parse --abbrev-ref HEAD)"
    exit 1
fi

print_success "Git status check passed"

# Run pre-deployment checks
print_status "Running pre-deployment validation..."

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    print_status "Installing dependencies..."
    npm install
fi

# Run tests
print_status "Running tests..."
if ! npm test; then
    print_error "Tests failed. Deployment aborted."
    exit 1
fi
print_success "Tests passed"

# Validate HTML
print_status "Validating HTML..."
if ! npm run validate; then
    print_error "HTML validation failed. Deployment aborted."
    exit 1
fi
print_success "HTML validation passed"

# Lint CSS and JS
print_status "Running linters..."
if ! npm run lint; then
    print_error "Linting failed. Deployment aborted."
    exit 1
fi
print_success "Linting passed"

# Performance check (optional, don't fail deployment)
print_status "Running performance check..."
if npm run lighthouse:local 2>/dev/null; then
    print_success "Performance check completed"
else
    print_warning "Performance check skipped (local server not running)"
fi

# Deploy to GitHub
print_status "Deploying to GitHub Pages..."

# Add commit message with timestamp
TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")
COMMIT_MSG="deploy: automated deployment at $TIMESTAMP"

# Check if there are any changes to commit
if git diff-index --quiet HEAD --; then
    print_status "No changes to commit, pushing current state..."
else
    print_status "Committing changes..."
    git add .
    git commit -m "$COMMIT_MSG"
fi

# Push to main branch (GitHub Pages will auto-deploy)
print_status "Pushing to main branch..."
if ! git push origin main; then
    print_error "Failed to push to GitHub"
    exit 1
fi

print_success "Successfully pushed to GitHub"

# Wait a moment and check deployment status
print_status "Waiting for GitHub Pages deployment..."
sleep 5

# Check if site is responding
SITE_URL="https://hanbedrijfskunde.github.io/aecc/"
print_status "Checking site availability: $SITE_URL"

if curl -sL --max-time 10 "$SITE_URL" > /dev/null; then
    print_success "Site is responding"
else
    print_warning "Site may still be deploying. Check again in a few minutes."
fi

# Deployment summary
echo ""
echo "🎉 Deployment Summary"
echo "===================="
echo "✅ Tests: Passed"
echo "✅ HTML Validation: Passed" 
echo "✅ Linting: Passed"
echo "✅ Git Push: Successful"
echo "🌐 Live URL: $SITE_URL"
echo ""
echo "Note: GitHub Pages deployment may take 5-10 minutes to complete."
echo "Monitor deployment status at: https://github.com/hanbedrijfskunde/aecc/actions"

print_success "Deployment script completed successfully!"

exit 0