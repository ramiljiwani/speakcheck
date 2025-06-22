export interface SectionData {
    Observations?: string;
    Recommendations?: string[];
  }
  export type Feedback = Record<string, SectionData>;