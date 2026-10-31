# Agent Skills Catalog

Catalog of custom Antigravity agent skills available in `esp32-web-flasher`.

| Skill | Description | Task / Command |
|---|---|---|
| [`add-repo`](skills/add-repo/SKILL.md) | Adds a new GitHub repository to the project and downloads its firmware releases | `task add-repo` |
| [`cavecrew`](skills/cavecrew/SKILL.md) | Decision guide for delegating to caveman-style subagents | `/cavecrew` |
| [`caveman`](skills/caveman/SKILL.md) | Ultra-compressed communication mode cutting output tokens ~65% | `/caveman` |
| [`caveman-commit`](skills/caveman-commit/SKILL.md) | Terse conventional commit message generator | `/caveman-commit` |
| [`caveman-compress`](skills/caveman-compress/SKILL.md) | Compress memory and markdown files into caveman format | `/caveman-compress <file>` |
| [`caveman-help`](skills/caveman-help/SKILL.md) | Quick-reference card for caveman modes, skills, and commands | `/caveman-help` |
| [`caveman-review`](skills/caveman-review/SKILL.md) | One-line code review comments preserving actionable signals | `/caveman-review` |
| [`caveman-stats`](skills/caveman-stats/SKILL.md) | Show real token usage and estimated savings for session | `/caveman-stats` |
| [`download-firmware`](skills/download-firmware/SKILL.md) | Downloads and extracts firmware releases from GitHub into firmware/ | `task download-firmware` |
| [`ponytail`](skills/ponytail/SKILL.md) | Forces laziest solution that actually works (YAGNI, stdlib first) | `/ponytail` |
| [`ponytail-audit`](skills/ponytail-audit/SKILL.md) | Whole-repo audit for over-engineering and bloat | `/ponytail-audit` |
| [`ponytail-debt`](skills/ponytail-debt/SKILL.md) | Harvest ponytail comments in codebase into debt ledger | `/ponytail-debt` |
| [`ponytail-gain`](skills/ponytail-gain/SKILL.md) | Compact scoreboard of ponytail measured impact | `/ponytail-gain` |
| [`ponytail-help`](skills/ponytail-help/SKILL.md) | Quick-reference card for ponytail modes, skills, and commands | `/ponytail-help` |
| [`ponytail-review`](skills/ponytail-review/SKILL.md) | Code review hunting over-engineering and unneeded complexity | `/ponytail-review` |
| [`release`](skills/release/SKILL.md) | Automates versioning, tagging, and deployment via scripts/release.sh | `/release` |
| [`release-summary`](skills/release-summary/SKILL.md) | Generates GitHub release summary from git logs via scripts/release_summary.py | `/release-summary` |
| [`test-fix`](skills/test-fix/SKILL.md) | Runs full validation suite (formatting and unit tests) and autonomously fixes failures | `task test` / `/test-fix` |
