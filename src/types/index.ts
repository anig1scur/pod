export type Mode = {
  Read: 'Read';
  FillIn: 'FillIn';
  Listen: 'Listen';
}

export type ModeType = Mode[keyof Mode];

export type Dialogue = {
  author: string;
  text: string;
}

export type Scripts = Dialogue[];
