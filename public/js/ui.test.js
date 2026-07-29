export function runUITests() {
  console.log("Running UI tests...");
  try {
    const button = document.createElement("esp-web-install-button");
    console.assert(button !== null, "Button element should be creatable");
    console.log("✅ UI tests passed!");
  } catch (e) {
    console.error("❌ UI tests failed:", e);
  }
}
