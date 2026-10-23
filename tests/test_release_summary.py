import os
import sys
import pytest
from unittest.mock import patch, MagicMock

sys.path.insert(0, os.path.abspath("scripts"))
import release_summary as rs

def test_format_special_thanks():
    assert rs.format_special_thanks(None) is None
    assert rs.format_special_thanks("### Already formatted") == "### Already formatted"
    assert rs.format_special_thanks("Huge thanks already") == "Huge thanks already"
    assert rs.format_special_thanks("Jane") == "Huge thanks to **Jane**!"
    assert rs.format_special_thanks("John", "reporting bug") == "Huge thanks to **John** for reporting bug!"
    assert rs.format_special_thanks("Alice", "fixing tests!") == "Huge thanks to **Alice** for fixing tests!"

def test_release_summary_dry_run(capsys):
    mock_log = (
        "- feat(ui): add new button\n"
        "- fix(ci): resolve rate limit\n"
        "- refactor(app): simplify structure\n"
        "- docs: update README\n"
        "- chore: conductor checkpoint\n"
    )

    def fake_run_cmd(cmd):
        if "git tag" in cmd:
            return "v0.1.4\nv0.1.3"
        if "git log" in cmd:
            return mock_log
        return ""

    with patch.object(rs, "run_cmd", side_effect=fake_run_cmd):
        with patch("sys.argv", ["release_summary.py", "--dry-run"]):
            rs.main()

    captured = capsys.readouterr().out
    assert "### 🚀 **New Features**" in captured
    assert "- `ui`: Add new button" in captured
    assert "### 🐛 **Bug Fixes**" in captured
    assert "- `ci`: Resolve rate limit" in captured
    assert "### ✨ **Improvements**" in captured
    assert "- `app`: Simplify structure" in captured
    assert "### 📝 **Documentation**" in captured
    assert "- Update README" in captured
    assert "Full Changelog" in captured
