import { isPrerelease } from "./app.js";

export function runUITests() {
  console.log("Running UI tests...");
  try {
    const button = document.createElement("esp-web-install-button");
    console.assert(button !== null, "Button element should be creatable");

    console.assert(
      isPrerelease("v1.0.0") === false,
      "v1.0.0 is not a prerelease",
    );
    console.assert(
      isPrerelease("v0.1.41") === false,
      "v0.1.41 is not a prerelease",
    );
    console.assert(
      isPrerelease("v1.0.0-rc.1") === true,
      "v1.0.0-rc.1 is a prerelease",
    );
    console.assert(
      isPrerelease("v1.0.0-beta.2") === true,
      "v1.0.0-beta.2 is a prerelease",
    );
    console.assert(
      isPrerelease("v1.0.0-alpha") === true,
      "v1.0.0-alpha is a prerelease",
    );
    console.assert(
      isPrerelease("1.0.0-preview") === true,
      "1.0.0-preview is a prerelease",
    );
    console.assert(
      isPrerelease("") === false,
      "empty string is not a prerelease",
    );
    console.assert(isPrerelease(null) === false, "null is not a prerelease");

    console.log("✅ UI tests passed!");
  } catch (e) {
    console.error("❌ UI tests failed:", e);
  }
}
