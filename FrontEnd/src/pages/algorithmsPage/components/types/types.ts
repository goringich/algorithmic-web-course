export interface Section {
  title: string;
  content?: string;
  subSection?: Section[];
  code?: string;
  visualization?: string;
}
