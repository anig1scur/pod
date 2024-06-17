export enum Mode {
  R = 'Read',
  L = 'Listen',
  F = 'Fill in'
}

export type Dialogue = {
  author: string;
  text: string;
}

export type Scripts = Dialogue[];
