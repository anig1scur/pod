// load words from txt

export enum VocabType {
  B1 = 'B1',
  B2 = 'B2',
  C1 = 'C1',
  AWL_570 = 'AWL_570',
  GRE_Manhattan_Prep_1000 = 'GRE_Manhattan_Prep_1000',
  GRE_Mason_2000 = 'GRE_Mason_2000',
}

export const loadVocab = async (type: VocabType): Promise<string[]> => {
  const words: string[] = [];

  try {
    const res = await fetch(`./assets/vocabulary/${ type }.txt`);
    const text = await res.text();
    const lines = text.split('\n');
    lines.forEach((line) => {
      words.push(line.trim());
    });
  } catch (error) {
    console.error("Failed to load vocabulary :", error);
  }

  return words;
}
