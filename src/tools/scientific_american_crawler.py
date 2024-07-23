import os
import json
import requests
from bs4 import BeautifulSoup

headers = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36"
}
HOST = "https://www.scientificamerican.com"
SCIAM_URL = "https://www.scientificamerican.com/podcasts/"
OUTPUT_FOLDER = "./public/assets/sciam/scripts"


def extract_json_from_page(url):
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        soup = BeautifulSoup(response.content, "html.parser")
        script_tag = soup.find("script", {"id": "__DATA__"})
        if script_tag:
            try:
                json_text = script_tag.string.split("window.__DATA__=JSON.parse(`", 1)[
                    1
                ].rsplit("`)", 1)[0]
                json_text = json_text.encode("raw_unicode_escape").decode(
                    "unicode_escape"
                )
                return json.loads(json_text)
            except (IndexError, json.JSONDecodeError) as e:
                print(f"Error extracting JSON data: {e}")
                return None
        else:
            print("No script tag with id '__DATA__' found.")
            return None
    else:
        print(f"Failed to retrieve the page. Status code: {response.status_code}")
        return None


def extract_transcript_from_page(url):
    response = requests.get(url, headers=headers)
    soup = BeautifulSoup(response.text, "html.parser")
    paragraphs = soup.find_all("p", {"data-block": "sciam/paragraph"})
    transcript = []
    for paragraph in paragraphs:
        if paragraph.find("b"):
            author = paragraph.find("b").text.strip().strip(":")
            text = paragraph.text.replace(author, "", 1).strip(":").strip()
            author = author.replace("\u00a0", "'")
            transcript.append({"author": author, "text": text})
        else:
            text = paragraph.text
            if not transcript:
                continue
            transcript[-1]["text"] += " " + text
    return transcript


def process_and_save_podcast_data(json_data, output_folder):
    results = json_data.get("initialData", {}).get("props", {}).get("results", [])
    for result in results:
        fn = f"{result['id']}.json"
        if os.path.exists(os.path.join(output_folder, fn)):
            print(f"Skipping {fn} as it already exists.")
            continue

        title = BeautifulSoup(result["display_title"], "html.parser").get_text()
        image_url = result["image_url"]
        audio_url = result["media_url"]
        category = result["category"]
        episode_url = HOST + result["url"]
        summary = BeautifulSoup(result["summary"], "html.parser").get_text()
        authors = [author["name"] for author in result["authors"]]
        transcript = extract_transcript_from_page(episode_url)
        output_data = {
            "title": title,
            "img": image_url,
            "url": episode_url,
            "audio": audio_url,
            "intro": [summary],
            "authors": authors,
            "category": [category],
            "transcript": transcript,
        }

        output_file_path = os.path.join(output_folder, fn)
        with open(output_file_path, "w") as f:
            json.dump(output_data, f, indent=2)


def main(page_limit=30):
    page = 1
    for _ in range(page_limit):
        json_data = extract_json_from_page(f"{SCIAM_URL}?page={page}")
        if json_data:
            process_and_save_podcast_data(json_data, OUTPUT_FOLDER)
            page += 1
        else:
            print("Failed to extract JSON data from the page.")
            break


if __name__ == "__main__":
    main()
