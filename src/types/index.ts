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

export type EpisodeData = {
  title: string;
  img: string;
  url: string;
  audio: string;
  vocab: {
    text: string;
    desc: string;
  }[];
  intro: string[];
  transcript: Scripts;
}