# ESP32 Web Flasher Project Rules

- **Test-Driven Development (TDD)**: Strictly mandatory. Always write failing tests first (Red), implement minimum code to pass (Green), then refactor. Never write unverified implementation code without prior failing tests.
- **Quality Gates**:
  - Always run `task check` before committing (verifies Prettier format check and full test suite).
  - Run fast unit tests during development loops: `task test:unit`.
  - Run frontend/browser integration tests: `task test:frontend`.
- **Core Stack Standards**:
  - Task runner: `task` (`Taskfile.yml`) as single entry point for development workflows.
  - Python execution: always use `uv` (`rtk uv run ...`). Never run bare `python` or bare `pip`.
  - Formatting: Prettier via `task format` / `task format:check`.
- **Architecture & Design**:
  - Client-side static architecture hosted on GitHub Pages.
  - Catppuccin Mocha palette strictly enforced.
  - Secret safety: Never commit plain secrets, tokens, or credentials.
