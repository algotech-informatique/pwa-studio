export type DBType = 'smartObjects' | 'deleted';
export interface Tab {
  key: string;
  display: string;
  disabled?: boolean;
  hidden?: boolean;
}
