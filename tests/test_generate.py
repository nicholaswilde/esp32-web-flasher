import os
import json
import pytest
import subprocess
import shutil

def test_generate_firmware_index(tmp_path):
    # Setup mock firmware directory
    firmware_dir = tmp_path / "public" / "firmware"
    firmware_dir.mkdir(parents=True)
    
    # Create mock repo and versions
    mock_repo = firmware_dir / "testorg" / "testrepo" / "device_a" / "v1.0.0"
    mock_repo.mkdir(parents=True)
    mock_repo2 = firmware_dir / "testorg" / "testrepo" / "device_a" / "v1.1.0"
    mock_repo2.mkdir(parents=True)
    
    # Mock the script's firmware_dir path
    script_path = os.path.abspath("scripts/generate_firmware_index.py")
    
    # Run the script but replace the firmware_dir path dynamically
    with open(script_path, "r") as f:
        script_code = f.read()
    
    # Replace the hardcoded firmware_dir
    script_code = script_code.replace('firmware_dir = "public/firmware"', f'firmware_dir = "{str(firmware_dir)}"')
    
    # Execute the modified script
    namespace = {}
    exec(script_code, namespace)
    
    # Verify index.json was created
    index_file = firmware_dir / "index.json"
    assert index_file.exists()
    
    with open(index_file, "r") as f:
        data = json.load(f)
        
    assert "testorg/testrepo" in data
    assert "device_a" in data["testorg/testrepo"]
    versions = data["testorg/testrepo"]["device_a"]
    assert "v1.1.0" in versions
    assert "v1.0.0" in versions
    # Check descending sort
    assert versions[0] == "v1.1.0"
    assert versions[1] == "v1.0.0"
