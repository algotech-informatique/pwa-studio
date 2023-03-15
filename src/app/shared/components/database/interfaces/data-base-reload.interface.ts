import { SearchSODto } from '@algotech/core';
import { BreadCrumbLink } from './link.interface';
import { Model } from './model.interface';

export interface DBreload {
  selectedModel: Model;
  initQuery?: boolean;
  keepfilters?: boolean;
  link: BreadCrumbLink;
  query?: SearchSODto;
};
