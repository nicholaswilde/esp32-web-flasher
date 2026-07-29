import os
import json
import re

firmware_dir = "public/firmware"
index = {}

if os.path.exists(firmware_dir):
    for org in os.listdir(firmware_dir):
        if not os.path.isdir(os.path.join(firmware_dir, org)): continue
        for repo in os.listdir(os.path.join(firmware_dir, org)):
            repo_path = os.path.join(firmware_dir, org, repo)
            if not os.path.isdir(repo_path): continue
            
            full_repo = f"{org}/{repo}"
            index[full_repo] = {}
            
            for device in os.listdir(repo_path):
                device_path = os.path.join(repo_path, device)
                if not os.path.isdir(device_path): continue
                
                index[full_repo][device] = []
                
                for version in os.listdir(device_path):
                    version_path = os.path.join(device_path, version)
                    if not os.path.isdir(version_path): continue
                    
                    index[full_repo][device].append(version)
                
                index[full_repo][device].sort(key=lambda x: [int(p) for p in re.findall(r'\d+', x)], reverse=True) # Sort versions descending properly

with open(os.path.join(firmware_dir, "index.json"), "w") as f:
    json.dump(index, f, indent=2)
