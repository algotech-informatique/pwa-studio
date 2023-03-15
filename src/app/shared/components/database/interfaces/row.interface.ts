export interface Row {
  id: string;
  properties: {
    key: string;
    value: any;
    realValue?: any;
    editable?: boolean;
    isComposition: boolean;
  }[];
};
