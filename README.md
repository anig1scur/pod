<div align=center>
<img  src="./logo.png" width="200"/>
</div>

# Pod

**Pod**, your English learning Partner web app. Access at [Github Pages](https://r.piggy.lol/pod/) or [Vercel](https://pod-omega.vercel.app/pod/). This project is designed to help you improve your English by combining learning with typing. The main feature of Pod is to locate and emphasize crucial vocabulary in articles, aiding in memorization and comprehension.


![index](pod.png)


## Supported Podcasts

Pod currently supports two types of podcasts:

1. **[BBC 6 Minutes English Podcast](https://www.bbc.co.uk/learningenglish/english/features/6-minute-english)**

2. **[Scientific American Podcast](https://www.scientificamerican.com/podcasts/)**

3. **[Think Fast Talk Smart](https://www.gsb.stanford.edu/business-podcasts/think-fast-talk-smart-podcast)**

4. **[Life Kit from NPR](https://www.npr.org/podcasts/510338/all-guides)**

I am planning to add more like The Atlantic, TED, talk shows, etc in the future. This service is not provided by the official source. All materials are sourced from the internet for educational purposes. Please contact me if there are any copyright concerns.

## Supported

1. **Reading Mode**
   1. Highlight vocabulary
   2. Bionic Reading
   3. Translation ( we highly recommend you use your own translator)
2. **Fill in Mode**
   1. Fill in the blank like Duolingo
   2. Check the answer
3. **Dictation Mode**
   1. Seek to accurate time of a script
   1. Dictate sentence randomly
   2. Type the sentence and check the answer
4. **Export to PDF**
   - Export the whole transcript with highlighted vocabulary blank to PDF, for easy printing and practicing.

## Suppo  rted Vocabulary

1. CEFR (Common European Framework of Reference for Languages) B1-C1
2. [AWL (Academic Word List) 570](https://www.eapfoundation.com/vocab/academic/awllists/)
3. [GRE Manhattan Prep 1000](https://r.piggy.lol/pod/assets/pdf/manhattan_prep_1000_gre_words_.pdf)
4. [GRE Mason 2000](https://quizlet.com/tw/211687200/mason-gre-2000-flash-cards/)
5. [GRE 5000](https://www.vocabulary.com/lists/128536)


## Development

### 1. Front End

```bash
pnpm install
pnpm dev
```

### 2. Crawl episode data

```bash
pip install -r scripts/requirements.txt
python scripts/[choose-crawler-file-name].py
python scripts/download_audio_and_extract_wave_peaks_and_fragments.py
```

## Contribution

If you have any suggestions or would like to contribute to this project, please feel free to contact me. I am open to any ideas and improvements.
