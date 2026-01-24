
import os
import json
import glob
from six_mins_english_crawler import extract_episode_data

SCRIPTS_DIR = os.path.join(
    os.path.dirname(__file__), "../public/assets/6mins/scripts"
)

def repair():
    json_files = glob.glob(os.path.join(SCRIPTS_DIR, "*.json"))
    count = 0
    fixed = 0
    
    print(f"Found {len(json_files)} json files.")
    
    for file_path in json_files:
        with open(file_path, "r") as f:
            try:
                data = json.load(f)
            except json.JSONDecodeError:
                print(f"Error decoding {file_path}, skipping.")
                continue
        
        # Check heuristic for broken file
        # If transcript has 0 or 1 item, it's likely broken (whole block) 
        if "transcript" in data and len(data["transcript"]) <= 1:
            print(f"Reparing possibly broken file: {os.path.basename(file_path)}")
            
            url = data.get("url")
            if not url:
                print(f"No URL found in {file_path}, skipping.")
                continue
            
            # Re-crawl data
            try:
                new_data = extract_episode_data(url)
            except Exception as e:
                print(f"Failed to crawl {url}: {e}")
                continue
                
            if not new_data:
                print(f"Returned no data for {url}")
                continue

            # Check if repair actually improved things (more transcript parts)
            if len(new_data.get("transcript", [])) > len(data["transcript"]):
                # Preserve fields that crawler might miss or that we want to keep if existing
                new_data["wave_peaks"] = data.get("wave_peaks", [])
                
                # Do NOT preserve fragments as transcript has changed
                # new_data["fragments"] = data.get("fragments", [])
                
                # Overwrite file
                with open(file_path, "w") as f:
                    json.dump(new_data, f, indent=2)
                
                print(f"Fixed and saved {os.path.basename(file_path)}")
                fixed += 1
            else:
                 print(f"Re-crawl yielded same or fewer transcript lines ({len(new_data.get('transcript', []))}), skipping update.")
        
        # Check for files that were repaired (or are valid) but have stale fragments (mismatched length)
        elif "transcript" in data and len(data["transcript"]) > 1:
            fragments = data.get("fragments", [])
            if fragments and len(fragments) < len(data["transcript"]) * 0.5:
                print(f"Detected stale fragments for {os.path.basename(file_path)} (Fragments: {len(fragments)}, Transcript: {len(data['transcript'])}). Removing fragments.")
                del data["fragments"]
                with open(file_path, "w") as f:
                    json.dump(data, f, indent=2)
                fixed += 1

        
        count += 1
        
    print(f"Scanned {count} files. Fixed {fixed} files.")

if __name__ == "__main__":
    repair()
