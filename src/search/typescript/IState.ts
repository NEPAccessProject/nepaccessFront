export interface ISearchState {
  titleRaw: string;
  startPublish: null;
  endPublish: null;
  startComment: null;
  endComment: null;
  agency: string[];
  agencyRaw: string[];
  cooperatingAgency: string[];
  cooperatingAgencyRaw: string[];
  state: string[];
  stateRaw: string[];
  county: string[];
  countyRaw: string[];
  decision: string[];
  decisionRaw: string[];
  action: string[];
  actionRaw: string[];
  typeAll: boolean;
  typeFinal: boolean;
  typeDraft: boolean;
  typeEA: boolean;
  typeNOI: boolean;
  typeROD: boolean;
  typeScoping: boolean;
  typeOther: boolean;
  showQuickTipsDialog: boolean;
  showPDFDialog: boolean;
  showSearchTipsDialog: boolean;
  needsComments: boolean;
  needsDocument: boolean;
  optionsChecked: boolean;
  iconClassName: string;
  limit: number;
  offset: number;
  searchOption: string;
  test: Globals.anEnum.options;
  tooltipOpen: undefined;
  proximityOption: null;
  proximityDisabled: boolean;
  hideOrganization: boolean;
  markup: boolean;
  fragmentSizeValue: number;
  isDirty: boolean;
  surveyChecked: boolean;
  surveyDone: boolean;
  surveyResult: string;
  filtersHidden: boolean;

  countyOptions: Globals.counties;
}