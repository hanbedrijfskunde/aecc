#!/bin/bash

# AEC Health Check Script
# Monitors site health and performance

set -e

echo "🏥 AEC Health Check"
echo "==================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
SITE_URL="https://hanbedrijfskunde.github.io/aecc/"
TIMEOUT=10
EXPECTED_RESPONSE=200

# Functions
print_status() { echo -e "${BLUE}[CHECK]${NC} $1"; }
print_success() { echo -e "${GREEN}[✅ PASS]${NC} $1"; }
print_warning() { echo -e "${YELLOW}[⚠️ WARN]${NC} $1"; }
print_error() { echo -e "${RED}[❌ FAIL]${NC} $1"; }

# Health checks
check_site_availability() {
    print_status "Checking site availability..."
    
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time $TIMEOUT "$SITE_URL" || echo "000")
    
    if [ "$HTTP_CODE" = "200" ]; then
        print_success "Site is available (HTTP $HTTP_CODE)"
        return 0
    else
        print_error "Site unavailable (HTTP $HTTP_CODE)"
        return 1
    fi
}

check_response_time() {
    print_status "Checking response time..."
    
    RESPONSE_TIME=$(curl -s -o /dev/null -w "%{time_total}" --max-time $TIMEOUT "$SITE_URL" || echo "timeout")
    
    if [ "$RESPONSE_TIME" != "timeout" ]; then
        RESPONSE_MS=$(echo "$RESPONSE_TIME * 1000" | bc)
        if (( $(echo "$RESPONSE_TIME < 2" | bc -l) )); then
            print_success "Response time: ${RESPONSE_MS%.*}ms (< 2000ms target)"
            return 0
        else
            print_warning "Response time: ${RESPONSE_MS%.*}ms (> 2000ms target)"
            return 1
        fi
    else
        print_error "Request timed out"
        return 1
    fi
}

check_ssl_certificate() {
    print_status "Checking SSL certificate..."
    
    SSL_EXPIRY=$(curl -sI "$SITE_URL" --connect-timeout $TIMEOUT 2>/dev/null | grep -i "strict-transport-security" || echo "")
    
    if [ -n "$SSL_EXPIRY" ]; then
        print_success "SSL certificate is valid and HSTS enabled"
        return 0
    else
        print_warning "Could not verify SSL/HSTS configuration"
        return 1
    fi
}

check_critical_pages() {
    print_status "Checking critical pages..."
    
    PAGES=("" "studenten.html" "docenten.html" "commissie.html")
    FAILED_PAGES=()
    
    for page in "${PAGES[@]}"; do
        URL="${SITE_URL}${page}"
        HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time $TIMEOUT "$URL" || echo "000")
        
        if [ "$HTTP_CODE" = "200" ]; then
            echo "  ✅ $URL"
        else
            echo "  ❌ $URL (HTTP $HTTP_CODE)"
            FAILED_PAGES+=("$page")
        fi
    done
    
    if [ ${#FAILED_PAGES[@]} -eq 0 ]; then
        print_success "All critical pages accessible"
        return 0
    else
        print_error "Failed pages: ${FAILED_PAGES[*]}"
        return 1
    fi
}

check_content_integrity() {
    print_status "Checking content integrity..."
    
    # Check if main content is present
    CONTENT=$(curl -s --max-time $TIMEOUT "$SITE_URL" || echo "")
    
    if echo "$CONTENT" | grep -q "Boardroom Simulatie"; then
        print_success "Main content is present"
        return 0
    else
        print_error "Main content missing or corrupted"
        return 1
    fi
}

check_javascript_errors() {
    print_status "Checking for JavaScript errors..."
    
    # This would require a headless browser for full JS error checking
    # For now, check if JS files are accessible
    JS_FILES=("script.js" "studenten-script.js" "docenten-script.js" "commissie-script.js")
    FAILED_JS=()
    
    for js_file in "${JS_FILES[@]}"; do
        URL="${SITE_URL}${js_file}"
        HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time $TIMEOUT "$URL" || echo "000")
        
        if [ "$HTTP_CODE" != "200" ]; then
            FAILED_JS+=("$js_file")
        fi
    done
    
    if [ ${#FAILED_JS[@]} -eq 0 ]; then
        print_success "JavaScript files accessible"
        return 0
    else
        print_warning "Inaccessible JS files: ${FAILED_JS[*]}"
        return 1
    fi
}

check_css_files() {
    print_status "Checking CSS files..."
    
    CSS_FILES=("styles.css" "studenten-styles.css" "docenten-styles.css" "commissie-styles.css")
    FAILED_CSS=()
    
    for css_file in "${CSS_FILES[@]}"; do
        URL="${SITE_URL}${css_file}"
        HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time $TIMEOUT "$URL" || echo "000")
        
        if [ "$HTTP_CODE" != "200" ]; then
            FAILED_CSS+=("$css_file")
        fi
    done
    
    if [ ${#FAILED_CSS[@]} -eq 0 ]; then
        print_success "CSS files accessible"
        return 0
    else
        print_warning "Inaccessible CSS files: ${FAILED_CSS[*]}"
        return 1
    fi
}

# Run all health checks
echo "Running health checks for: $SITE_URL"
echo ""

FAILED_CHECKS=0

# Execute checks
check_site_availability || ((FAILED_CHECKS++))
check_response_time || ((FAILED_CHECKS++))
check_ssl_certificate || ((FAILED_CHECKS++))
check_critical_pages || ((FAILED_CHECKS++))
check_content_integrity || ((FAILED_CHECKS++))
check_javascript_errors || ((FAILED_CHECKS++))
check_css_files || ((FAILED_CHECKS++))

echo ""
echo "📊 Health Check Summary"
echo "======================="

TOTAL_CHECKS=7
PASSED_CHECKS=$((TOTAL_CHECKS - FAILED_CHECKS))

if [ $FAILED_CHECKS -eq 0 ]; then
    print_success "All health checks passed ($PASSED_CHECKS/$TOTAL_CHECKS)"
    echo "🎉 Site is healthy!"
    exit 0
elif [ $FAILED_CHECKS -le 2 ]; then
    print_warning "$FAILED_CHECKS/$TOTAL_CHECKS checks failed - Site has minor issues"
    echo "⚠️ Site is operational with warnings"
    exit 1
else
    print_error "$FAILED_CHECKS/$TOTAL_CHECKS checks failed - Site has major issues"
    echo "🚨 Site health is critical!"
    exit 2
fi