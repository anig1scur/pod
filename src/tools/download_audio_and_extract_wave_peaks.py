import os
import json
import requests
import numpy as np
from pydub import AudioSegment
from pydub.utils import make_chunks

proxies = {
}

SCRIPTS_DIR = "./public/assets/{}/scripts"
AUDIOS_DIR = "./public/assets/{}/audios"


class NpEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, np.integer):
            return int(obj)
        if isinstance(obj, np.floating):
            return float(obj)
        if isinstance(obj, np.ndarray):
            return obj.tolist()
        return super(NpEncoder, self).default(obj)


def get_audio_peaks(file_path, chunk_size_ms=300):
    audio = AudioSegment.from_file(file_path)
    chunks = make_chunks(audio, chunk_size_ms)

    peaks = []
    for chunk in chunks:
        raw_data = np.array(chunk.get_array_of_samples())

        peak = np.max(np.abs(raw_data))
        peaks.append(peak)

    return peaks


# 下载音频文件的函数
def download_audio(url, file_path):
    response = requests.get(url, stream=True, proxies=proxies)
    if response.status_code == 200:
        with open(file_path, "wb+") as f:
            f.write(response.content)
        print(f"Downloaded {file_path}")
    else:
        print(f"Failed to download {url}")


def process_json_file(json_file_path, type):
    with open(json_file_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    audio_url = data.get("audio", [])
    file_name = json_file_path.split("/")[-1][:-5]
    file_path = os.path.join(AUDIOS_DIR.format(type), f"{file_name}.mp3")

    if data.get("wave_peaks"):
        print(f"{file_name} already has wave peaks data, skipping extraction.")
        return

    if not os.path.exists(file_path):
        download_audio(audio_url, file_path)
    else:
        print(f"{file_name} already exists, skipping download.")

    # 获取音频波峰数据并存储到 JSON 中
    peaks = get_audio_peaks(file_path)

    data["wave_peaks"] = peaks
    with open(json_file_path, "w") as f:
        json_dumps_str = json.dumps(data, separators=(",", ":"), cls=NpEncoder)
        print(json_dumps_str, file=f)


def process_json_files_in_folder(type):
    for root, _, files in os.walk(SCRIPTS_DIR.format(type)):
        for file in files:
            if file.endswith(".json"):
                json_file_path = os.path.join(root, file)
                process_json_file(json_file_path, type)


process_json_files_in_folder('sciam')
