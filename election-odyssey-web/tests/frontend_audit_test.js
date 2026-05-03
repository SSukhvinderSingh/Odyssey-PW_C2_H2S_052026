const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const htmlPath = path.resolve(__dirname, '../index.html');
const htmlContent = fs.readFileSync(htmlPath, 'utf8');

const dom = new JSDOM(htmlContent);
const document = dom.window.document;

let passed = 0;
let failed = 0;

function assert(condition, message) {
    if (condition) {
        console.log(`✅ PASS: ${message}`);
        passed++;
    } else {
        console.error(`❌ FAIL: ${message}`);
        failed++;
    }
}

console.log("--- Starting Frontend Audit Tests ---\n");

// 1. Accessibility Tests
console.log("Testing Accessibility (ARIA & Roles)...");
assert(document.querySelector('nav').getAttribute('role') === 'navigation', "Nav element has role='navigation'");
assert(document.querySelector('nav').getAttribute('aria-label') === 'Main Navigation', "Nav element has aria-label='Main Navigation'");
assert(document.querySelector('main').getAttribute('role') === 'main', "Main element has role='main'");
assert(document.querySelector('#ai-bubble').getAttribute('aria-label') === 'Open AI Guide', "AI Bubble has aria-label");
assert(document.querySelector('#ai-chat').getAttribute('role') === 'dialog', "AI Chat has role='dialog'");
assert(document.querySelector('#chat-messages').getAttribute('aria-live') === 'polite', "Chat messages container is an aria-live region");
assert(document.querySelector('#btn-send-chat').getAttribute('aria-label') === 'Send Message', "Send Chat button has aria-label");
assert(document.querySelector('#btn-close-chat').getAttribute('aria-label') === 'Close Chat', "Close Chat button has aria-label");
assert(document.querySelector('#lang-selector').getAttribute('aria-label') === 'Select Language', "Language selector has aria-label");
assert(document.querySelectorAll('.persona-card[tabindex="0"]').length === 6, "All 6 persona cards are keyboard focusable (tabindex=0)");

console.log("\nTesting Google Services (PWA, SEO, GA4)...");
assert(document.querySelector('link[rel="manifest"]') !== null, "PWA Manifest is linked in <head>");
assert(document.querySelector('script[src*="googletagmanager.com"]') !== null, "Google Analytics (GA4) script is present");
assert(document.querySelector('script[type="application/ld+json"]') !== null, "JSON-LD Structured Data is present");
assert(document.querySelector('link[rel="preconnect"][href*="fonts.googleapis.com"]') !== null, "Google Fonts use <link rel='preconnect'> for performance");

console.log("\n--- Audit Summary ---");
console.log(`Passed: ${passed}`);
console.log(`Failed: ${failed}`);

if (failed > 0) {
    console.error("\n❌ AUDIT FAILED. Some elements are missing required attributes.");
    process.exit(1);
} else {
    console.log("\n✅ ALL TESTS PASSED. The application meets Phase 1 Accessibility and Google Service standards.");
    process.exit(0);
}
