import json
import os
import re
import shutil
import subprocess
import time
import urllib.error
import urllib.request
import pytest

DOCKER_AVAILABLE = (
    shutil.which("docker") is not None
    and subprocess.run(
        ["docker", "info"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL
    ).returncode
    == 0
)

IMAGE_TAG = "esp32-web-flasher:test"


@pytest.fixture(scope="session")
def docker_image():
    if not DOCKER_AVAILABLE:
        pytest.skip("Docker daemon is not available")
    build_res = subprocess.run(
        ["docker", "build", "--load", "-t", IMAGE_TAG, "."],
        capture_output=True,
        text=True,
    )
    assert build_res.returncode == 0, f"docker build failed: {build_res.stderr}"
    return IMAGE_TAG


def test_dockerfile_scaffolding():
    dockerfile = "Dockerfile"
    assert os.path.exists(dockerfile), "Dockerfile must exist"
    with open(dockerfile, "r", encoding="utf-8") as f:
        content = f.read()

    assert re.search(r"FROM\s+.*AS\s+builder", content, re.IGNORECASE), (
        "Dockerfile must have a builder stage"
    )
    assert re.search(r"FROM\s+nginx:alpine", content, re.IGNORECASE), (
        "Dockerfile runtime stage must use nginx:alpine"
    )
    assert "EXPOSE 80" in content, "Dockerfile must expose port 80"
    assert "HEALTHCHECK" in content, "Dockerfile must declare a HEALTHCHECK"


def test_dockerignore():
    dockerignore = ".dockerignore"
    assert os.path.exists(dockerignore), ".dockerignore must exist"
    with open(dockerignore, "r", encoding="utf-8") as f:
        ignored = [line.strip() for line in f if line.strip() and not line.startswith("#")]

    expected_ignores = [".git", "node_modules", "tests", "playwright-report"]
    for expected in expected_ignores:
        assert any(expected in item for item in ignored), (
            f"{expected} must be excluded in .dockerignore"
        )


def test_compose_yaml():
    compose_file = "compose.yaml"
    assert os.path.exists(compose_file), "compose.yaml must exist"
    with open(compose_file, "r", encoding="utf-8") as f:
        content = f.read()

    assert "esp32-web-flasher" in content, "compose.yaml must define esp32-web-flasher service"
    assert "8000:80" in content, "compose.yaml must map port 8000:80"
    assert "/usr/share/nginx/html/firmware" in content, "compose.yaml must mount firmware volume"
    assert "/usr/share/nginx/html/config.json" in content, "compose.yaml must mount config.json volume"

    if DOCKER_AVAILABLE:
        res = subprocess.run(
            ["docker", "compose", "config", "--quiet"],
            capture_output=True,
            text=True,
        )
        assert res.returncode == 0, f"docker compose config failed: {res.stderr}"


def test_docker_build_and_size(docker_image):
    inspect_res = subprocess.run(
        ["docker", "image", "inspect", docker_image, "--format", "{{.Size}}"],
        capture_output=True,
        text=True,
        check=True,
    )
    image_size_bytes = int(inspect_res.stdout.strip())
    max_size = 100 * 1024 * 1024  # 100 MB limit
    assert image_size_bytes < max_size, (
        f"Docker image size {image_size_bytes / (1024 * 1024):.2f}MB exceeds 100MB limit"
    )


def test_docker_runtime_and_endpoints(docker_image):
    cid = subprocess.run(
        ["docker", "run", "-d", "-p", "0:80", docker_image],
        capture_output=True,
        text=True,
        check=True,
    ).stdout.strip()

    try:
        port_res = subprocess.run(
            ["docker", "port", cid, "80/tcp"],
            capture_output=True,
            text=True,
            check=True,
        )
        port_match = re.search(r":([0-9]+)$", port_res.stdout.splitlines()[0])
        assert port_match, f"Unable to parse port from: {port_res.stdout}"
        port = port_match.group(1)

        # Wait for web server to start responding
        base_url = f"http://127.0.0.1:{port}"
        ready = False
        for _ in range(30):
            try:
                with urllib.request.urlopen(f"{base_url}/", timeout=1) as resp:
                    if resp.status == 200:
                        ready = True
                        break
            except Exception:
                time.sleep(0.5)

        assert ready, "Web server did not become responsive within 15s"

        # Check root page
        with urllib.request.urlopen(f"{base_url}/") as resp:
            assert resp.status == 200
            html = resp.read().decode("utf-8")
            assert "ESP32 Web Flasher" in html

        # Check favicon
        with urllib.request.urlopen(f"{base_url}/favicon.svg") as resp:
            assert resp.status == 200

        # Check 404 response
        with pytest.raises(urllib.error.HTTPError) as exc_info:
            urllib.request.urlopen(f"{base_url}/nonexistent-page-test")
        assert exc_info.value.code == 404

    finally:
        subprocess.run(["docker", "rm", "-f", cid], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)


def test_docker_volume_mounts(tmp_path, docker_image):
    # Create dummy config and firmware
    test_config = tmp_path / "config.json"
    test_config.write_text(json.dumps({"testKey": "testVal123"}), encoding="utf-8")

    test_firmware_dir = tmp_path / "firmware"
    test_firmware_dir.mkdir()
    test_bin = test_firmware_dir / "app.bin"
    test_bin.write_bytes(b"DUMMY_ESP32_FIRMWARE_BYTES")

    cid = subprocess.run(
        [
            "docker",
            "run",
            "-d",
            "-p",
            "0:80",
            "-v",
            f"{test_config}:/usr/share/nginx/html/config.json:ro",
            "-v",
            f"{test_firmware_dir}:/usr/share/nginx/html/firmware:ro",
            docker_image,
        ],
        capture_output=True,
        text=True,
        check=True,
    ).stdout.strip()

    try:
        port_res = subprocess.run(
            ["docker", "port", cid, "80/tcp"],
            capture_output=True,
            text=True,
            check=True,
        )
        port_match = re.search(r":([0-9]+)$", port_res.stdout.splitlines()[0])
        assert port_match, f"Unable to parse port from: {port_res.stdout}"
        port = port_match.group(1)

        base_url = f"http://127.0.0.1:{port}"
        # Wait for ready
        ready = False
        for _ in range(30):
            try:
                with urllib.request.urlopen(f"{base_url}/", timeout=1) as resp:
                    if resp.status == 200:
                        ready = True
                        break
            except Exception:
                time.sleep(0.5)
        assert ready, "Web server did not become responsive"

        # Verify mounted config.json
        with urllib.request.urlopen(f"{base_url}/config.json") as resp:
            assert resp.status == 200
            data = json.loads(resp.read().decode("utf-8"))
            assert data.get("testKey") == "testVal123"

        # Verify mounted firmware binary
        with urllib.request.urlopen(f"{base_url}/firmware/app.bin") as resp:
            assert resp.status == 200
            content = resp.read()
            assert content == b"DUMMY_ESP32_FIRMWARE_BYTES"

    finally:
        subprocess.run(["docker", "rm", "-f", cid], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
