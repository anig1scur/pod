import os
import json
import re
from glob import glob


SCRIPTS_DIR = "./public/assets/{}/scripts"


def split_text(text, max_words=100):
    sentences = re.split(r"(?<=[.!?]) +", text)
    chunks = []
    current_chunk = []

    current_word_count = 0
    for sentence in sentences:
        sentence_word_count = len(sentence.split())
        if current_word_count + sentence_word_count <= max_words:
            current_chunk.append(sentence)
            current_word_count += sentence_word_count
        else:
            chunks.append(" ".join(current_chunk).strip())
            current_chunk = [sentence]
            current_word_count = sentence_word_count

    if current_chunk:
        chunks.append(" ".join(current_chunk).strip())

    return chunks


def process_json_transcripts(json_file):
    with open(json_file, "r") as f:
        data = json.load(f)

    transcript = data["transcript"]
    new_transcript = []
    for entry in transcript:
        text = entry["text"]
        author = entry["author"]
        chunks = split_text(text)
        entry["text"] = chunks[0]
        for chunk in chunks:
            new_transcript.append({"author": author, "text": chunk})
    data["transcript"] = new_transcript

    with open(json_file, "w") as f:
        json_dumps_str = json.dumps(data, separators=(",", ":"))
        print(json_dumps_str, file=f)


def process_all_json_files(type):
    json_files = sorted(glob(os.path.join(SCRIPTS_DIR.format(type), "*.json")))
    print(json_files)
    for json_file in json_files:
        print(f"Processing {json_file}")
        process_json_transcripts(json_file)


process_all_json_files("sciam")
