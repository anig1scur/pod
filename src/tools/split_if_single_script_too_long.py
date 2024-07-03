import os
import json
import re
from glob import glob


SCRIPTS_DIR = "./public/assets/{}/scripts"


# Function to split text into chunks of no more than 100 words
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

    for entry in data["transcript"]:
        text = entry["text"]
        author = entry["author"]
        chunks = split_text(text)
        entry["text"] = chunks[0]
        for chunk in chunks[1:]:
            data["transcript"].append({"author": author, "text": chunk})

    with open(json_file, "w") as f:
        json_dumps_str = json.dumps(data)
        print(json_dumps_str, file=f)


def process_all_json_files(type):
    json_files = sorted(glob(os.path.join(SCRIPTS_DIR.format(type), "*.json")))
    for json_file in json_files[:10]:
        print(f"Processing {json_file}")
        process_json_transcripts(json_file)


process_all_json_files("sciam")
