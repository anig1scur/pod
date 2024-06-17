// load words from txt
import A1 from '../assets/vocabulary/A1.txt?url';
import A2 from '../assets/vocabulary/A2.txt?url';
import B1 from '../assets/vocabulary/B1.txt?url';
import B2 from '../assets/vocabulary/B2.txt?url';
import C1 from '../assets/vocabulary/C1.txt?url';


type CEFR = 'A1' | 'A2' | 'B1' | 'B2' | 'C1'; // 你需要根据实际的 CEFR 类型定义它

export const DICT_PATH = {
  A1: A1,
  A2: A2,
  B1: B1,
  B2: B2,
  C1: C1,
}

export const loadCEFR = async (type: CEFR): Promise<string[]> => {
  const words: string[] = [];

  try {
    const res = await fetch(DICT_PATH[type]);
    const text = await res.text();
    const lines = text.split('\n');
    lines.forEach((line) => {
      words.push(line.trim());
    });
  } catch (error) {
    console.error("Failed to load CEFR data:", error);
  }

  return words;
}
