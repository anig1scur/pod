import os
import json
import requests
from bs4 import BeautifulSoup
from utils import XML_HEADERS

LIFE_KIT_URL = "https://www.npr.org/get/510338/render/partial/next"
OUTPUT_FOLDER = "./public/assets/lifekit/scripts"


def extract_all_episode_urls():

    START, STEP, MAX = 1, 100, 100
    # START, STEP, MAX = 1, 100, 2000

    links = []
    for i in range(START, MAX, STEP):
        print(f"{LIFE_KIT_URL}?start={i}&count={STEP}")
        response = requests.get(
            f"{LIFE_KIT_URL}?start={i}&count={STEP}", headers=XML_HEADERS, timeout=20
        )
        if response.status_code == 200:
            soup = BeautifulSoup(response.text, "html.parser")
            titles = [
                b.find_parent("a") for b in soup.find_all("b", class_="icn-transcript")
            ]
            links += [title["href"] for title in titles]
        else:
            print(f"Failed to retrieve the page. Status code: {response.status_code}")
            continue
    return links


def extract_transcript_from_page(soup):

    paragraphs = soup.select("div.transcript.storytext > p")

    transcript = []
    authors = []
    cur_author = None

    for i, paragraph in enumerate(paragraphs):
        text = paragraph.text.strip()
        if not text:
            continue
        if paragraph.has_attr("class") and paragraph["class"][0] == "disclaimer":
            continue

        if text[0] == "(" and text[-1] == ")":
            continue

        if ":" in text and text.split(":")[0].isupper():
            author, content = text.split(":", 1)
            author = author.strip()
            content = content.strip()
            if content:
                transcript.append({"author": author, "text": content})
            if author not in authors:
                authors.append(author)
            cur_author = author
        elif cur_author:
            transcript.append({"author": cur_author, "text": text})

    return authors, transcript


def extract_and_save_episode_data(url):
    file_name = url.split("/")[-1]
    file_path = os.path.join(OUTPUT_FOLDER, f"{file_name}.json")

    if os.path.exists(file_path):
        # print(f"{file_name} already exists, skipping extraction.")
        return

    response = requests.get(url, headers=XML_HEADERS)
    soup = BeautifulSoup(response.text, "lxml")
    print(f"Extracting data from {url}")

    title = soup.find("h1", class_="transcript").text.strip("\n").strip().lstrip("< ")
    authors, transcript = extract_transcript_from_page(soup)
    description = soup.find("meta", attrs={"name": "description"})["content"]
    img = soup.find("meta", attrs={"property": "og:image"})["content"]
    audio_url = (
        soup.find("li", class_="audio-tool audio-tool-download")
        .find("a")["href"]
        .split("?")[0]
    )
    data = {
        "title": title,
        "url": url,
        "intro": description,
        "transcript": transcript,
        "audio": audio_url,
        "img": img,
        "authors": authors,
    }
    with open(file_path, "w+") as f:
        f.write(json.dumps(data, indent=2))


def main():
    episode_urls = extract_all_episode_urls()
    for url in episode_urls:
        extract_and_save_episode_data(url)


if __name__ == "__main__":
    main()
