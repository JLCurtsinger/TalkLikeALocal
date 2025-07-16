export interface State {
  name: string;
  abbreviation: string;
  terms: Term[];
}

export interface Culture {
  name: string;
  languageFamily?: string;
  websiteUrl?: string;
  terms: Term[];
}

export interface Term {
  word: string;
  phonetic: string;
  audioUrl?: string;
  description?: string;
}