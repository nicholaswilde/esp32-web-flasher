import {
  isPrerelease,
  parseUrlParams,
  resolveRepoParam,
  resolveVersionParam,
} from "./app.js";

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

    // URL parameter parsing tests
    const parsed = parseUrlParams(
      "?repo=nicholaswilde/cyd-weather-station&device=cyd_28c&version=v0.1.42&prerelease=true&autoload=1&bootloaderAddress=0x0&firmwareAddress=0x10000&partitionsAddress=0x8000",
    );
    console.assert(
      parsed.repo === "nicholaswilde/cyd-weather-station",
      "parseUrlParams extracts repo",
    );
    console.assert(
      parsed.device === "cyd_28c",
      "parseUrlParams extracts device",
    );
    console.assert(
      parsed.version === "v0.1.42",
      "parseUrlParams extracts version",
    );
    console.assert(
      parsed.prerelease === true,
      "parseUrlParams parses prerelease=true",
    );
    console.assert(
      parsed.autoload === true,
      "parseUrlParams parses autoload=1",
    );
    console.assert(
      parsed.bootloaderAddress === "0x0",
      "parseUrlParams extracts bootloaderAddress",
    );
    console.assert(
      parsed.firmwareAddress === "0x10000",
      "parseUrlParams extracts firmwareAddress",
    );
    console.assert(
      parsed.partitionsAddress === "0x8000",
      "parseUrlParams extracts partitionsAddress",
    );

    const emptyParsed = parseUrlParams("");
    console.assert(
      emptyParsed.repo === "" &&
        emptyParsed.prerelease === false &&
        emptyParsed.autoload === false,
      "parseUrlParams defaults cleanly on empty query",
    );

    const repos = [
      "nicholaswilde/cyd-weather-station",
      "nicholaswilde/side-eye",
      "other/side-eye",
    ];
    console.assert(
      resolveRepoParam("nicholaswilde/cyd-weather-station", repos) ===
        "nicholaswilde/cyd-weather-station",
      "resolveRepoParam matches exact repo",
    );
    console.assert(
      resolveRepoParam("cyd-weather-station", repos) ===
        "nicholaswilde/cyd-weather-station",
      "resolveRepoParam matches unique suffix",
    );
    console.assert(
      resolveRepoParam("side-eye", repos) === "",
      "resolveRepoParam rejects ambiguous suffix",
    );
    console.assert(
      resolveRepoParam("unknown/repo", repos) === "",
      "resolveRepoParam returns empty for unknown repo",
    );

    const versions = ["v1.1.0", "v1.0.0"];
    console.assert(
      resolveVersionParam("latest", versions) === "v1.1.0",
      "resolveVersionParam resolves latest",
    );
    console.assert(
      resolveVersionParam("v1.0.0", versions) === "v1.0.0",
      "resolveVersionParam matches exact version",
    );
    console.assert(
      resolveVersionParam("v9.9.9", versions) === "",
      "resolveVersionParam returns empty for missing version",
    );

    console.log("✅ UI tests passed!");
  } catch (e) {
    console.error("❌ UI tests failed:", e);
  }
}
