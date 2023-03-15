export interface BreadCrumbLink {
  root: boolean;
  path: string;
  key: string;
  parentUuid: string;
  model: string;
  display: string;
  uuids: string[];
  multiple: boolean;
  isComposition: boolean;
};
