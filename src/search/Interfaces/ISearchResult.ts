
export interface IRecord {
  title: string;
  agency: string;
  cooperatingAgency: string | null;
  commentDate: string;
  registerDate: string;
  state: string;
  documentType: string;
  filename: string;
  commentsFilename: string;
  size: number;
  id: number;
  luceneIds: string[];
  folder: string;
  plaintext: string[];
  name: string;
  link: string | null;
  firstRodDate: string | null;
  processId: number;
  notes: string | null;
  status: string | null;
  subtype: string | null;
  county: string;
  action: string;
  decision: string;
  relevance: number;
}

export interface ISearchResult {
  records: [IRecord];
  processId: number;
  isProcess?: boolean;
  originalIndex: number;
  registerDate?: any;
  draftNoa?: string;
  finalNoa?: string;
  commentDate?: any;
  title: string;
  county?: string;
  action?: string;
  decision?: string;
  relevance?: number;
  agency?: string | string[];
  state?: string;
  cooperatingAgency: string | string[] | null
}