import os
import json
import requests
import numpy as np
from utils import NpEncoder
from mutagen.mp3 import MP3
from pydub import AudioSegment
from pydub.utils import make_chunks
import aeneas.executetask
from aeneas.task import Task
from glob import glob

TYPE = os.environ.get("TYPE", "lifekit")

# 本地下载太慢了，for github workflow, 临时最多处理 50 个
MAX_AUDIO_PROCESS = 50
PROCESS_COUNT = 0

SCRIPTS_DIR = os.path.join(
    os.path.dirname(__file__), f"../public/assets/{TYPE}/scripts"
)
AUDIOS_DIR = os.path.join(os.path.dirname(__file__), f"../public/assets/{TYPE}/audios")


def get_mp3_duration(file_path):
    try:
        audio = MP3(file_path)
        duration_seconds = audio.info.length
        return int(duration_seconds)
    except Exception as e:
        print(f"Error: {e}")
        return None


def get_audio_fragment(audio, script):
    if not script:
        return None

    task = Task(
        config_string="task_language=eng|is_text_type=plain|os_task_file_format=json"
    )
    task.audio_file_path_absolute = audio

    with open("temp_transcript.txt", "w") as f:
        f.write(script)
    task.text_file_path_absolute = "temp_transcript.txt"

    try:
        aeneas.executetask.ExecuteTask(task).execute()
        sync_map = json.loads(task.sync_map.json_string)
        return [
            {
                "begin": fragment["begin"],
                "end": fragment["end"],
                "lines": fragment["lines"],
            }
            for fragment in sync_map["fragments"]
            if fragment["lines"]
        ]
    except Exception as e:
        print(f"Error in get_audio_fragment: {e}")
        return None


def get_audio_peaks(file_path, chunk_size_ms=300):
    audio = AudioSegment.from_file(file_path)
    chunks = make_chunks(audio, chunk_size_ms)
    return [np.max(np.abs(np.array(chunk.get_array_of_samples()))) for chunk in chunks]


def download_audio(url, file_path):
    print(f"Downloading {url}")
    try:
        response = requests.get(url, stream=True)
        if response.status_code == 200:
            with open(file_path, "wb") as f:
                f.write(response.content)
            print(f"Downloaded {file_path}")
            return True
        else:
            print(f"Failed to download {url}, status code: {response.status_code}")
            return False
    except Exception as e:
        print(f"Error: {e}")
    return False


def remove_audio(file_path):
    if os.path.exists(file_path):
        os.remove(file_path)


def process_json_file(json_file_path):
    with open(json_file_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    file_name = os.path.splitext(os.path.basename(json_file_path))[0]
    file_path = os.path.join(AUDIOS_DIR, f"{file_name}.mp3")

    if (
        data.get("wave_peaks") is None
        or data.get("fragments") is None
        or data.get("duration") is None
    ):
        if not os.path.exists(file_path):
            if not download_audio(data.get("audio"), file_path):
                return
        global PROCESS_COUNT
        PROCESS_COUNT += 1
        if data.get("wave_peaks") is None:
            data["wave_peaks"] = get_audio_peaks(file_path)

        if data.get("fragments") is None:
            try:
                script = "\n".join(s["text"] for s in data["transcript"])
                data["fragments"] = get_audio_fragment(file_path, script)
            except Exception as e:
                print(f"Failed to extract fragments for {file_name}: {e}")
                data["fragments"] = []

        data["duration"] = get_mp3_duration(file_path)

        with open(json_file_path, "w") as f:
            json.dump(data, f, separators=(",", ":"), cls=NpEncoder)
            remove_audio(file_path)


def update_typescript_file():
    episodes = []
    json_files = sorted(glob(os.path.join(SCRIPTS_DIR, "*.json")))
    for json_file in json_files:
        with open(json_file, "r") as f:
            episode_data = json.load(f)
            episodes.append(
                {
                    "id": os.path.splitext(os.path.basename(json_file))[0],
                    "title": episode_data.get("title", ""),
                    "img": episode_data.get("img", ""),
                    "url": episode_data.get("url", ""),
                    "audio": episode_data.get("audio", ""),
                }
            )

    episodes.reverse()
    ts_content = (
        f"export const episodes = {json.dumps(episodes, indent=2)};\n"
        f"export const episodeIds = {json.dumps([e['id'] for e in episodes], indent=2)};\n"
        "export default episodes;"
    )

    with open(f"./src/utils/{TYPE}.ts", "w") as f:
        f.write(ts_content)


def process_json_files():
    update_typescript_file()
    for json_file in glob(os.path.join(SCRIPTS_DIR, "*.json")):
        print(f"Processing {json_file}")
        if PROCESS_COUNT >= MAX_AUDIO_PROCESS:
            break
        process_json_file(json_file)


if __name__ == "__main__":
    process_json_files()
