export interface Word {
  id: number;
  eng: string;
  ru: string;
  example?: string;
  synonym?: string;
  correctCount: number;
  createdAt: string;
}

export interface Topic {
  id: number;
  name: string;
  createdAt: string;
  lastUpdated: string;
  words: Word[];
}

export type DisplayMode = 'english' | 'russian';
