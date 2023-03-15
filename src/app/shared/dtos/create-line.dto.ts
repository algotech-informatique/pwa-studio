import { ObjectTreeLineDto } from './object-tree-line.dto';
import { SnModelDto } from '@algotech/core';
import { DirectoryClipboardDto } from './directory-clipboard.dto';

export class CreateLineDto {
    type: 'directory' | 'resource';
    parent?: ObjectTreeLineDto;
    value?: SnModelDto|DirectoryClipboardDto;
    context?: any;
}
