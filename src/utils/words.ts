// load words from txt

type CEFR = 'A1' | 'A2' | 'B1' | 'B2' | 'C1'; // 你需要根据实际的 CEFR 类型定义它

export const loadCEFR = async (type: CEFR): Promise<string[]> => {
  const words: string[] = [];

  try {
    const res = await fetch(`./assets/vocabulary/${ type }.txt`);
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
