
export interface IEISDoc {
  id: number;
  title: string;
  documentType: string;
  commentDate: string | null;
  registerDate: string;
  agency: string;
  department: string;
  cooperatingAgency: string;
  state: string;
  county: string;
  filename: string;
  commentsFilename: string | null;
  folder: string;
  size: number;
  link: string;
  notes: string;
  status: string;
  subtype: string;
  summaryText: string | null;
  noiDate: string | null;
  draftNoa: string | null;
  finalNoa: string | null;
  firstRodDate: string | null;
  processId: string | null;
  action: string;
  decision: string;
}


export interface IFile {
  id: number;
  processId: number;
  documentType: string; 
  filename: string;
  folder: string;
  relativePath: string;
  //eisdoc: IEISDoc;
  size?: number;
  filenames: string[];
}

export interface IFiles extends Array<IFile>{}

export interface IFilesResponse {
  files: [IFile];
}

