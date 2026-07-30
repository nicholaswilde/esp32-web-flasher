# /test-fix

Runs the full validation suite (formatting and unit tests) and autonomously fixes failures.

## Description
This skill ensures the `esp32-web-flasher` codebase conforms to formatting standards and testing standards. It actively detects violations and applies automatic or surgical corrections.

## Protocol

1. **Execute CI Checks:**
   - Run the validation tasks:
     - Formatting / Linting: Run `task format` (formats HTML/CSS/JS using Prettier)
     - Unit Tests: Run `task test` (runs Pytest for backend and Playwright for frontend)

2. **Analyze Failures:**
   - If any check fails, capture the output and identify the category:
     - **Formatting**: Typically `task format` will automatically fix issues. If it fails, check for syntax errors in HTML/CSS/JS.
     - **Python Tests**: Check for failures in `tests/test_generate.py` caused by script logic bugs or test assertions.
     - **Frontend Tests**: Check for failures in `tests/frontend.spec.js` or `public/js/*.test.js` caused by UI bugs, mock object mismatches, or state leakage.
     - **CRITICAL:** Do NOT modify `Taskfile.yml` to bypass or disable any checks.

3. **Apply Corrections:**
   - **Syntax/Formatting**: Fix any JavaScript or Python syntax errors preventing formatting or execution.
   - **Tests**: Debug code logic, update test assertions, or correct mock objects in the test files as needed. For frontend tests, be aware of shared state in `window` or cached module variables and mock them properly.

4. **Verify and Re-Test:**
   - Re-run the tests via `task test` to ensure all checks pass cleanly after modifications.

5. **Report:**
   - Provide a concise summary of the checks executed and any fixes applied.
