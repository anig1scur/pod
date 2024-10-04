import os
import json
import requests
from bs4 import BeautifulSoup
from utils import XML_HEADERS

LIFE_KIT_URL = "https://www.npr.org/get/510338/render/partial/next"
OUTPUT_FOLDER = "./public/assets/lifekit/scripts"


def extract_all_episode_urls():

    START, STEP, MAX = 1, 100, 2000

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


def extract_and_save_episode_data(url):
    pass


def main():
    episode_urls = extract_all_episode_urls()
    print(len(episode_urls))


if __name__ == "__main__":
    main()
