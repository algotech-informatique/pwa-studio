import { SmartModelDto } from '@algotech/core';

export interface Model {
  key: string;
  display: string;
  selected: boolean;
  sm?: SmartModelDto;
};
