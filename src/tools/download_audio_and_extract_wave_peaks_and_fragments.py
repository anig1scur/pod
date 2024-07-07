import os
import json
import requests
import numpy as np
from utils import NpEncoder
from pydub import AudioSegment
from pydub.utils import make_chunks

import aeneas.executetask
from aeneas.task import Task
from glob import glob


proxies = {}


SCRIPTS_DIR = "./public/assets/{}/scripts"
AUDIOS_DIR = "./public/assets/{}/audios"


def get_audio_fragment(audio, script):
    if not script:
        return
    task = Task(
        config_string="task_language=eng|is_text_type=plain|os_task_file_format=json"
    )
    task.audio_file_path_absolute = audio
    with open("temp_transcript.txt", "w") as f:
        f.write(script)
    task.text_file_path_absolute = "temp_transcript.txt"

    aeneas.executetask.ExecuteTask(task).execute()
    sync_map = json.loads(task.sync_map.json_string)
    fragments = []
    for fragment in sync_map["fragments"]:
        if not fragment["lines"]:
            continue
        fragments.append(
            {
                "begin": fragment["begin"],
                "end": fragment["end"],
                "lines": fragment["lines"],
            }
        )

    return fragments


def get_audio_peaks(file_path, chunk_size_ms=300):
    audio = AudioSegment.from_file(file_path)
    chunks = make_chunks(audio, chunk_size_ms)

    peaks = []
    for chunk in chunks:
        raw_data = np.array(chunk.get_array_of_samples())

        peak = np.max(np.abs(raw_data))
        peaks.append(peak)

    return peaks


def download_audio(url, file_path):
    print(f"Downloading {url}")
    response = requests.get(url, stream=True, proxies=proxies)
    if response.status_code == 200:
        with open(file_path, "wb+") as f:
            f.write(response.content)
        print(f"Downloaded {file_path}")
        return True
    else:
        print(f"Failed to download {url}, status code: {response.status_code}")


def process_json_file(json_file_path, type):
    with open(json_file_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    audio_url = data.get("audio")
    file_name = json_file_path.split("/")[-1][:-5]
    file_path = os.path.join(AUDIOS_DIR.format(type), f"{file_name}.mp3")

    if data.get("wave_peaks") and data.get("fragments"):
        print(
            f"{file_name} already has wave peaks and fragments data, skipping extraction."
        )
        return

    if not os.path.exists(file_path):
        if not download_audio(audio_url, file_path):
            return
    else:
        print(f"{file_name} already exists, skipping download.")

    if data.get("wave_peaks"):
        print(f"{file_name} already has wave peaks data")
    else:
        peaks = get_audio_peaks(file_path)
        data["wave_peaks"] = peaks

    if data.get("fragments"):
        print(f"{file_name} already has fragments data")
    else:
        try:
            fragments = get_audio_fragment(
                file_path, "\n".join([s["text"] for s in data["transcript"]])
            )
            data["fragments"] = fragments
        except Exception as e:
            print(f"Failed to extract fragments for {file_name}: {e}")

    with open(json_file_path, "w") as f:
        json_dumps_str = json.dumps(data, separators=(",", ":"), cls=NpEncoder)
        print(json_dumps_str, file=f)


def update_typescript_file(type):
    episodes = []
    json_files = sorted(glob(os.path.join(SCRIPTS_DIR.format(type), "*.json")))
    for json_file in json_files:
        print(f"Processing {json_file}")
        with open(json_file, "r") as f:
            episode_data = json.load(f)
            episodes.append(
                {
                    "id": os.path.basename(json_file)[:-5],
                    "title": episode_data.get("title", ""),
                    "img": episode_data.get("img", ""),
                    "url": episode_data.get("url", ""),
                    "audio": episode_data.get("audio", ""),
                }
            )

    episodes = list(reversed(episodes))
    ts_content = (
        f"export const episodes = {json.dumps(episodes, indent=2)};\n"
        f"export const episodeIds = {json.dumps([e['id'] for e in episodes], indent=2)};\n"
        "export default episodes;"
    )

    with open("./src/utils/{}.ts".format(type), "w") as f:
        f.write(ts_content)


def process_json_files_in_folder(type):
    # update_typescript_file(type)
    for root, _, files in os.walk(SCRIPTS_DIR.format(type)):
        for file in files:
            if file.endswith(".json"):
                json_file_path = os.path.join(root, file)
                print(f"Processing {json_file_path}")
                process_json_file(json_file_path, type)


process_json_files_in_folder("tfts")
