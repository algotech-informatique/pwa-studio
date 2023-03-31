import { SmartModelDto } from '@algotech-ce/core';

export interface Model {
  key: string;
  display: string;
  selected: boolean;
  sm?: SmartModelDto;
};
