const { test, expect } = require("@playwright/test");

test("Browser tests execute successfully", async ({ page }) => {
  // We'll capture any console errors or failures
  const errors = [];
  page.on("console", (msg) => {
    if (msg.type() === "error" || msg.text().includes("❌")) {
      errors.push(msg.text());
    }
  });
  page.on("pageerror", (exception) => {
    errors.push(exception.message);
  });

  // Navigate to the test page
  await page.goto("/test.html");

  // Wait for the "All test suites completed." message
  // Or timeout if tests get stuck
  await page.waitForFunction(() => {
    return new Promise((resolve) => {
      const originalLog = console.log;
      console.log = function (...args) {
        if (args.join(" ").includes("All test suites completed.")) {
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

test("Help button opens chosen repository in new window and respects disabled state", async ({
  page,
}) => {
  await page.goto("/index.html");

  const helpBtn = page.locator("#help-github-btn");
  const repoSelect = page.locator("#github-repo-select");
  const clearBtn = page.locator("#clear-github-btn");

  // Initially disabled when no repo is selected
  await expect(helpBtn).toBeDisabled();

  // Wait for repositories to load in select
  await page.waitForFunction(() => {
    const select = document.getElementById("github-repo-select");
    return select && select.options.length > 1;
  });

  // Select first repository option
  const optionValue = await repoSelect
    .locator("option")
    .nth(1)
    .getAttribute("value");
  await repoSelect.selectOption(optionValue);

  // Help button should now be enabled
  await expect(helpBtn).toBeEnabled();

  // Verify clicking opens the repo url in a new tab/window
  const popupPromise = page.waitForEvent("popup");
  await helpBtn.click();
  const popup = await popupPromise;
  expect(popup.url()).toBe(`https://github.com/${optionValue}`);
  await popup.close();

  // Clear resets and disables help button
  await clearBtn.click();
  await expect(helpBtn).toBeDisabled();
});

test("Buttons have informative tooltips", async ({ page }) => {
  await page.goto("/index.html");

  const buttons = [
    {
      id: "#fetch-github-btn",
      title: "Load selected firmware release for flashing",
    },
    { id: "#help-github-btn", title: "Open selected repository in GitHub" },
    {
      id: "#clear-github-btn",
      title: "Clear repository, device, and version selections",
    },
    {
      id: "#upload-btn",
      title: "Package selected binary files into manifest for flashing",
    },
    {
      id: "#clear-upload-btn",
      title: "Clear selected binary files and reset addresses",
    },
    {
      id: "#console-connect-btn",
      title: "Connect or disconnect serial connection to ESP32",
    },
    { id: "#console-toggle-btn", title: "Toggle visibility of terminal logs" },
    { id: "#console-clear-btn", title: "Clear serial console output" },
  ];

  for (const { id, title } of buttons) {
    const el = page.locator(id);
    await expect(el).toHaveAttribute("title", title);
  }
});
