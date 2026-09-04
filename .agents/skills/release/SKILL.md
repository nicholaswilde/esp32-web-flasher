# /release

Automates the versioning, tagging, and deployment process for the project.

## Description
This skill handles the release process: verifying repository state, validating code quality and test passes, bumping metadata version numbers, committing, tagging, and pushing atomically to the remote repository.

## Protocol

1. **Verify Git State & Sync Remote:**
   - Check `rtk git status --porcelain` to ensure there are no unexpected local modifications.
   - Synchronize with remote before making release commits:
     `rtk git pull --rebase origin main`

2. **Pre-release Quality Validation:**
   - Run `task format` to format code according to project style.
   - Run `task test` to execute Python backend and Playwright frontend tests.
   - If tests fail, stop immediately and report the error.

3. **Extract and Calculate Version:**
   - Detect the latest tag from git:
     `rtk git tag --sort=-v:refname | head -n 1`
   - Calculate the new patch version by incrementing the last digit (e.g., `0.1.2` -> `0.1.3`).

4. **Update Version Files and Commit:**
   - Update `version = "..."` in `pyproject.toml` (without the 'v' prefix).
   - Update `"version": "..."` in `public/config.json` (with the 'v' prefix, e.g., `"v0.1.3"`).
   - Stage the version files along with any formatting changes produced by `task format`:
     `rtk git add pyproject.toml public/config.json` (and any formatted files)
   - Commit the changes:
     `rtk git commit -m "chore(release): bump version to v<new_version>"`

5. **Tag the Release:**
   - Create an annotated git tag:
     `rtk git tag -a v<new_version> -m "Release v<new_version>"`
   - **NOTE:** Use non-interactive command flags (`git tag -a -m`) to prevent terminal prompts or editor spawning.

6. **Atomic Push:**
   - Push the branch and the new tag atomically:
     `rtk git push --atomic origin main v<new_version>`

7. **Error Handling:**
   - If any step fails, stop immediately, do not tag or push, and report the detailed error to the user.
