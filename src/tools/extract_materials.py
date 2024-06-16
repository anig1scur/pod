from bs4 import BeautifulSoup

grouped_content = {
    "introduction": [],
    "this_week_question": [],
    "vocabulary": [],
    "transcript": [],
    "authors": [],
}

sections = {
    "Introduction": "introduction",
    "This week's question": "this_week_question",
    "This week's question:": "this_week_question",
    "Vocabulary": "vocabulary",
    "TRANSCRIPT": "transcript",
    "Transcript": "transcript",
}


current_section = None


# Function to clean and extract text
def clean_text(element):
    return element.get_text(separator=" ", strip=True).replace("\xa0", " ")


with open("./example.html", "r") as f:
    contents = f.read()

    soup = BeautifulSoup(contents, "html.parser")
    richtext = soup.find("div", class_=["widget-richtext"])
    texts = richtext.find(class_=["text"])

    key = ""
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
                if last_p_before_question:
                    grouped_content["introduction"].append(last_p_before_question)
        elif element.name == "strong":
            # Set the current section based on the <strong> text
            heading = element.get_text(strip=True)
            if heading in sections:
                current_section = sections.get(heading)
            elif current_section == "vocabulary":
                # Collect vocabulary terms and descriptions
                vocab_text = heading
                desc_text = element.next_sibling.strip() if element.next_sibling else ""
                grouped_content[current_section].append(
                    {"text": vocab_text, "desc": desc_text}
                )
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
                    author, _, remainder = strong_text.partition(
                        "<br/>" if "<br/>" in strong_text else "<br>"
                    )
                else:
                    author = strong_text

                text = clean_text(element).replace(author, "", 1).strip()
                if author not in grouped_content["authors"]:
                    grouped_content["authors"].append(author)

                if text and text != "Note: This is not a word-for-word transcript.":
                    grouped_content[current_section].append(
                        {"author": author, "text": text}
                    )
            elif current_section == "vocabulary" and element.find("strong"):
                vocab_text = element.find("strong").get_text(strip=True)
                desc_text = clean_text(element).replace(vocab_text, "").strip()
                if vocab_text.lower() == "transcript":
                    current_section = "transcript"
                    continue
                grouped_content[current_section].append(
                    {"text": vocab_text, "desc": desc_text}
                )
            elif current_section != "vocabulary" and current_section != "transcript":
                # For other sections, append text content
                text = clean_text(element)
                if text and text != "Note: This is not a word-for-word transcript.":
                    grouped_content[current_section].append(text)

with open("./example.ts", "w") as f:
    f.write("export const content = " + str(grouped_content))
