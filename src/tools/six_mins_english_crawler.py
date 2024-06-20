import json
import requests
from bs4 import BeautifulSoup

sections = {
    "Introduction": "intro",
    "This week's question": "this_week_question",
    "This week's question:": "this_week_question",
    "Vocabulary": "vocab",
    "TRANSCRIPT": "transcript",
    "Transcript": "transcript",
}

current_section = None

RENAMES = [
    "6_minute_english",
    "6min_english",
    "6min_eng",
    "6_min_english",
    "6_min_eng",
    "6_minute",
    "6ME",
    "6me",
    "6min",
    "6mins",
]


def clean_text(element):
    return element.get_text(separator=" ", strip=True).replace("\xa0", " ")


def extract_episode_data(url):

    data = {
        "title": "",
        "img": "",
        "url": "",
        "audio": "",
        "intro": [],
        "this_week_question": [],
        "vocab": [],
        "transcript": [],
        "authors": [],
    }

    response = requests.get(url, timeout=10)
    contents = response.text

    soup = BeautifulSoup(contents, "html.parser")

    data["url"] = url
    # 1. title + image + audio
    title = soup.find("meta", attrs={"property": "og:title"})
    image = soup.find("meta", attrs={"property": "og:image"})
    audio = soup.find("a", class_="download bbcle-download-extension-mp3")
    if not audio:
        return

    data["audio"] = audio["href"]
    if title:
        data["title"] = title["content"].lstrip(
            "BBC Learning English - 6 Minute English / "
        )
    if image:
        data["img"] = image["content"]

    # 2. process meta
    richtext = soup.find("div", class_=["widget-richtext"])
    texts = richtext.find(class_=["text"])

    # Flag to handle introduction section
    found_question_section = False
    last_p_before_question = None

    # Iterate through the elements
    for element in texts.children:
        if element.name == "h3":
            # Set the current section based on the <h3> text
            heading = element.get_text(strip=True)
            current_section = sections.get(heading)
            if current_section == "this_week_question":
                found_question_section = True
                if (
                    last_p_before_question
                    and last_p_before_question not in data["intro"]
                ):
                    data["intro"].append(last_p_before_question)
        elif element.name == "strong":
            # Set the current section based on the <strong> text
            heading = element.get_text(strip=True)
            if heading in sections:
                current_section = sections.get(heading)
            elif current_section == "vocab":
                # Collect vocabulary terms and descriptions
                vocab_text = heading
                desc_text = element.next_sibling.strip() if element.next_sibling else ""
                data[current_section].append({"text": vocab_text, "desc": desc_text})
        elif element.name == "p":
            # Handle potential nested <span> tags in <p> tags
            if element.find("span"):
                for span in element.find_all("span"):
                    span.unwrap()
            # Handle introduction section by tracking the last <p> before the question section
            text = clean_text(element)
            if text and not found_question_section:
                last_p_before_question = text.strip()
            # For transcript section, collect the author and text
            elif current_section == "transcript" and element.find("strong"):
                strong_text = element.find("strong").decode_contents().strip()
                if "<br/>" in strong_text or "<br>" in strong_text:
                    author, _, _ = strong_text.partition(
                        "<br/>" if "<br/>" in strong_text else "<br>"
                    )
                else:
                    author = strong_text
                text = clean_text(element).replace(author, "", 1).strip()
                author.replace("\u00a0", "'")
                if author and author not in data["authors"]:
                    data["authors"].append(author)

                if text and text != "Note: This is not a word-for-word transcript.":
                    # 这么替换有点宽泛了?
                    text = text.replace(" ’", "’")
                    data[current_section].append({"author": author, "text": text})
            elif current_section == "vocab" and element.find("strong"):
                vocab_text = element.find("strong").get_text(strip=True)
                desc_text = clean_text(element).replace(vocab_text, "").strip()
                if vocab_text.lower() == "transcript":
                    current_section = "transcript"
                    continue
                data[current_section].append({"text": vocab_text, "desc": desc_text})
            elif (
                current_section
                and current_section != "vocab"
                and current_section != "transcript"
            ):
                # For other sections, append text content
                text = clean_text(element)
                if text and text != "Note: This is not a word-for-word transcript.":
                    data[current_section].append(text)
    return data


def extract_episode_urls():
    bbc_6min_url = (
        "https://www.bbc.co.uk/learningenglish/english/features/6-minute-english"
    )
    response = requests.get(bbc_6min_url, timeout=10)
    contents = response.text
    soup = BeautifulSoup(contents, "html.parser")
    container = soup.find_all("div", class_="widget-container widget-container-full")
    a_links = container[0].find_all("a")
    urls = [
        "https://www.bbc.co.uk" + a["href"]
        for a in a_links
        if "/learningenglish/english/features" in a["href"]
    ]

    return list(dict.fromkeys(urls))

def extract_ts():
    bbc_6min_episodes = []
    from glob import glob

    jsons = glob("./public/assets/6mins/scripts/*.json")
    jsons = sorted(jsons)
    for j in jsons:
        episode = {}
        with open(j, "r") as f:
            episode = json.load(f)
            bbc_6min_episodes.append({
                "id": j.split("/")[-1][:-5],
                "t†itle": episode.get("title", ""),
                "img": episode.get("img", ""),
                "url": episode.get("url", ""),
                "audio": episode.get("audio", "")
            })
    with open("./src/utils/6min.ts", "w+") as f:
        bbc_6min_episodes = list(reversed(bbc_6min_episodes))
        f.write(f"export const episodes = {json.dumps(bbc_6min_episodes)};")
        f.write(f"\nexport const episodeIds = {json.dumps([e['id'] for e in bbc_6min_episodes])};") 
        f.write(f"\nexport default episodes;")


def run():
    urls = extract_episode_urls()

    for url in urls:
        print(f"Extracting {url}")
        data = extract_episode_data(url)
        if not (data and data["audio"]):
            continue

        fname = data["audio"].split("/")[-1][:-13]
        for r in RENAMES:
            fname = fname.replace(r, "")
        with open(f"../public/assets/6mins/{fname}.json", "w+") as f:
            f.write(json.dumps(data, indent=2))


if __name__ == "__main__":
    # 1. run
    # run()
    # 2. generate index.ts
    extract_ts()
