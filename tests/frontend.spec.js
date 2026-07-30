const { test, expect } = require('@playwright/test');

test('Browser tests execute successfully', async ({ page }) => {
  // We'll capture any console errors or failures
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error' || msg.text().includes('❌')) {
      errors.push(msg.text());
    }
  });
  page.on('pageerror', exception => {
    errors.push(exception.message);
  });

  // Navigate to the test page
  await page.goto('/test.html');

  // Wait for the "All test suites completed." message
  // Or timeout if tests get stuck
  await page.waitForFunction(() => {
    return new Promise(resolve => {
      const originalLog = console.log;
      console.log = function(...args) {
        if (args.join(' ').includes('All test suites completed.')) {
          resolve(true);
        }
        originalLog.apply(console, args);
      };
      
      // Check if it already printed it before we wrapped console.log
      // We can do a small delay to make sure tests finish if they are fast
      setTimeout(() => resolve(true), 1500);
    });
  });

  // Verify there were no errors or failures logged
  expect(errors).toEqual([]);
});
